<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SalesOrder;
use App\Models\PengirimanGudang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Endpoint utama untuk memuat seluruh data Dashboard
     * GET /api/dashboard
     */
    public function index(Request $request)
    {
        try {
            // 1. Kartu Metrik Atas (Metrics Summary)
            $nilaiPenjualan = SalesOrder::where('status_so', '!=', 'Batal')->sum('total_harga');
            $totalSalesOrder = SalesOrder::count();

            // Antrean Gudang (Menunggu Picking)
            $antreanGudangOrder = PengirimanGudang::where('status_pengiriman', 'Menunggu_Picking')->count();
            $antreanGudangBox = DB::table('detail_sales_orders')
                ->join('sales_orders', 'detail_sales_orders.sales_order_id', '=', 'sales_orders.id')
                ->join('pengiriman_gudang', 'pengiriman_gudang.sales_order_id', '=', 'sales_orders.id')
                ->where('pengiriman_gudang.status_pengiriman', 'Menunggu_Picking')
                ->sum('detail_sales_orders.jumlah_pesan');

            // Dalam Pengiriman
            $dalamPengirimanOrder = PengirimanGudang::where('status_pengiriman', 'Diperjalanan')->count();
            $dalamPengirimanBox = DB::table('detail_sales_orders')
                ->join('sales_orders', 'detail_sales_orders.sales_order_id', '=', 'sales_orders.id')
                ->join('pengiriman_gudang', 'pengiriman_gudang.sales_order_id', '=', 'sales_orders.id')
                ->where('pengiriman_gudang.status_pengiriman', 'Diperjalanan')
                ->sum('detail_sales_orders.jumlah_pesan');

            // 2. Posisi Order Saat Ini (Order Status Summary Widgets)
            $posisiOrder = [
                'penerimaan_so' => [
                    'order' => SalesOrder::where('status_so', 'Pending')->count(),
                    'box'   => (int) DB::table('detail_sales_orders')
                                ->join('sales_orders', 'detail_sales_orders.sales_order_id', '=', 'sales_orders.id')
                                ->where('sales_orders.status_so', 'Pending')
                                ->sum('jumlah_pesan'),
                ],
                'disiapkan' => [
                    'order' => PengirimanGudang::where('status_pengiriman', 'Proses_Packing')->count(),
                    'box'   => (int) DB::table('detail_sales_orders')
                                ->join('sales_orders', 'detail_sales_orders.sales_order_id', '=', 'sales_orders.id')
                                ->join('pengiriman_gudang', 'pengiriman_gudang.sales_order_id', '=', 'sales_orders.id')
                                ->where('pengiriman_gudang.status_pengiriman', 'Proses_Packing')
                                ->sum('jumlah_pesan'),
                ],
                'siap_kirim' => [
                    'order' => PengirimanGudang::where('status_pengiriman', 'Siap_Kirim')->count(),
                    'box'   => (int) DB::table('detail_sales_orders')
                                ->join('sales_orders', 'detail_sales_orders.sales_order_id', '=', 'sales_orders.id')
                                ->join('pengiriman_gudang', 'pengiriman_gudang.sales_order_id', '=', 'sales_orders.id')
                                ->where('pengiriman_gudang.status_pengiriman', 'Siap_Kirim')
                                ->sum('jumlah_pesan'),
                ],
                'dalam_pengiriman' => [
                    'order' => $dalamPengirimanOrder,
                    'box'   => (int) $dalamPengirimanBox,
                ],
                'retur' => [
                    'order' => SalesOrder::where('status_so', 'Retur')->count(),
                    'box'   => (int) DB::table('detail_sales_orders')
                                ->join('sales_orders', 'detail_sales_orders.sales_order_id', '=', 'sales_orders.id')
                                ->where('sales_orders.status_so', 'Retur')
                                ->sum('jumlah_pesan'),
                ],
            ];

            // 3. Tabel Order Terbaru (5 Data Terakhir)
            $orderTerbaru = SalesOrder::with(['toko:id,nama_toko', 'user:id,nama_lengkap', 'detailSalesOrder', 'pengirimanGudang'])
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get()
                ->map(function ($order) {
                    $totalBox = $order->detailSalesOrder->sum('jumlah_pesan');
                    return [
                        'id'               => $order->id,
                        'nomor_so'         => $order->nomor_so,
                        'pelanggan'        => $order->toko->nama_toko ?? '-',
                        'salesperson'      => $order->user->nama_lengkap ?? '-',
                        'box'              => (int) $totalBox,
                        'status_penjualan' => $order->status_so,
                        'status_gudang'    => [
                            'label'   => $order->pengirimanGudang->status_pengiriman ?? 'Menunggu_Picking',
                            'subtext' => $order->pengirimanGudang->keterangan ?? 'SO baru dari penjualan',
                        ],
                        'tanggal'          => $order->created_at->format('Y-m-d H:i'),
                    ];
                });

            return response()->json([
                'status'  => true,
                'message' => 'Data dashboard berhasil dimuat',
                'data'    => [
                    'metrics' => [
                        'nilai_penjualan'   => (float) $nilaiPenjualan,
                        'total_sales_order' => $totalSalesOrder,
                        'antrean_gudang'    => [
                            'order' => $antreanGudangOrder,
                            'box'   => (int) $antreanGudangBox,
                        ],
                        'dalam_pengiriman'  => [
                            'order' => $dalamPengirimanOrder,
                            'box'   => (int) $dalamPengirimanBox,
                        ],
                    ],
                    'posisi_order'  => $posisiOrder,
                    'order_terbaru' => $orderTerbaru,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal memuat data dashboard: ' . $e->getMessage()
            ], 500);
        }
    }
}