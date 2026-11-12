<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SalesOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class DashboardController extends Controller
{
    /**
     * GET /api/dashboard
     */
    public function index(Request $request)
    {
        try {

            // ==========================================
            // 1. METRIK PENJUALAN
            // Satu query untuk SUM dan COUNT
            // ==========================================

            $metrikPenjualan = DB::table('sales_orders')
                ->where('status', '!=', 'Cancelled')
                ->selectRaw('
                    COALESCE(SUM(grand_total), 0) AS nilai_penjualan,
                    COUNT(*) AS total_sales_order
                ')
                ->first();

            $nilaiPenjualan = (float) $metrikPenjualan->nilai_penjualan;
            $totalSalesOrder = (int) $metrikPenjualan->total_sales_order;


            // ==========================================
            // 2. METRIK GUDANG
            // Satu query untuk seluruh status gudang
            // ==========================================

            $statusGudang = [
                'Menunggu_Picking',
                'Proses_Picking',
                'Proses_Packing',
                'Siap_Kirim',
                'Diperjalanan',
            ];

            $dataStatusGudang = DB::table('pengiriman_gudang')
                ->select('status_pengiriman')
                ->selectRaw('COUNT(*) AS total_order')
                ->whereIn('status_pengiriman', $statusGudang)
                ->groupBy('status_pengiriman')
                ->get()
                ->keyBy('status_pengiriman');

            $jumlahOrderGudang = [];

            foreach ($statusGudang as $status) {
                $jumlahOrderGudang[$status] =
                    (int) ($dataStatusGudang[$status]->total_order ?? 0);
            }


            // ==========================================
            // 3. JUMLAH BARANG SELURUH STATUS GUDANG
            // Satu query untuk semua status dan satuan
            // ==========================================

            $dataJumlahGudang = DB::table('detail_sales_orders')
                ->join(
                    'sales_orders',
                    'detail_sales_orders.sales_order_id',
                    '=',
                    'sales_orders.id'
                )
                ->join(
                    'pengiriman_gudang',
                    'pengiriman_gudang.sales_order_id',
                    '=',
                    'sales_orders.id'
                )
                ->whereIn(
                    'pengiriman_gudang.status_pengiriman',
                    $statusGudang
                )
                ->select(
                    'pengiriman_gudang.status_pengiriman',
                    'detail_sales_orders.satuan'
                )
                ->selectRaw('SUM(detail_sales_orders.quantity) AS total')
                ->groupBy(
                    'pengiriman_gudang.status_pengiriman',
                    'detail_sales_orders.satuan'
                )
                ->get();

            $jumlahBarangGudang = [];

            foreach ($statusGudang as $status) {
                $jumlahBarangGudang[$status] = $this->formatJumlahBarang(
                    $dataJumlahGudang->where(
                        'status_pengiriman',
                        $status
                    )
                );
            }


            // ==========================================
            // 4. PENERIMAAN SALES ORDER
            // SO Submitted yang belum memiliki pengiriman
            // ==========================================

            $soBelumDikirim = DB::table('sales_orders')
                ->where('status', 'Submitted')
                ->whereNotExists(function ($query) {
                    $query->select(DB::raw(1))
                        ->from('pengiriman_gudang')
                        ->whereColumn(
                            'pengiriman_gudang.sales_order_id',
                            'sales_orders.id'
                        );
                });

            $penerimaanOrder = (clone $soBelumDikirim)->count();

            $penerimaanJumlahData = DB::table('detail_sales_orders')
                ->join(
                    'sales_orders',
                    'detail_sales_orders.sales_order_id',
                    '=',
                    'sales_orders.id'
                )
                ->where('sales_orders.status', 'Submitted')
                ->whereNotExists(function ($query) {
                    $query->select(DB::raw(1))
                        ->from('pengiriman_gudang')
                        ->whereColumn(
                            'pengiriman_gudang.sales_order_id',
                            'sales_orders.id'
                        );
                })
                ->select('detail_sales_orders.satuan')
                ->selectRaw('SUM(detail_sales_orders.quantity) AS total')
                ->groupBy('detail_sales_orders.satuan')
                ->get();

            $penerimaanJumlah = $this->formatJumlahBarang(
                $penerimaanJumlahData
            );


            // ==========================================
            // 5. POSISI ORDER
            // Menggunakan hasil query agregasi sebelumnya
            // ==========================================

            $posisiOrder = [

                'penerimaan_so' => [
                    'order' => $penerimaanOrder,
                    'jumlah' => $penerimaanJumlah,
                ],

                'menunggu_picking' => [
                    'order' => $jumlahOrderGudang['Menunggu_Picking'],
                    'jumlah' => $jumlahBarangGudang['Menunggu_Picking'],
                ],

                'proses_picking' => [
                    'order' => $jumlahOrderGudang['Proses_Picking'],
                    'jumlah' => $jumlahBarangGudang['Proses_Picking'],
                ],

                'disiapkan' => [
                    'order' => $jumlahOrderGudang['Proses_Packing'],
                    'jumlah' => $jumlahBarangGudang['Proses_Packing'],
                ],

                'siap_kirim' => [
                    'order' => $jumlahOrderGudang['Siap_Kirim'],
                    'jumlah' => $jumlahBarangGudang['Siap_Kirim'],
                ],

                'dalam_pengiriman' => [
                    'order' => $jumlahOrderGudang['Diperjalanan'],
                    'jumlah' => $jumlahBarangGudang['Diperjalanan'],
                ],
            ];


            // ==========================================
            // 6. ORDER TERBARU
            // Eager loading untuk mencegah N+1 query
            // ==========================================

            $orderTerbaru = SalesOrder::with([
                'customer',
                'user',
                'detailSalesOrder',
                'pengirimanGudang',
            ])
                ->latest()
                ->limit(5)
                ->get()
                ->map(function ($order) {

                    $jumlahBarang = [
                        'carton' => 0,
                        'pack' => 0,
                        'pcs' => 0,
                    ];

                    foreach ($order->detailSalesOrder as $detail) {

                        $satuan = strtolower(
                            trim($detail->satuan)
                        );

                        if (array_key_exists($satuan, $jumlahBarang)) {
                            $jumlahBarang[$satuan] +=
                                (float) $detail->quantity;
                        }
                    }

                    return [
                        'id' => $order->id,

                        'nomor_so' => $order->nomor_so,

                        'pelanggan' =>
                            $order->customer->nama_pelanggan ?? '-',

                        'salesperson' =>
                            $order->user->nama_lengkap ?? '-',

                        'jumlah_barang' => $jumlahBarang,

                        'status_penjualan' => $order->status,

                        'status_gudang' => [
                            'label' =>
                                $order->pengirimanGudang
                                    ->status_pengiriman
                                    ?? 'Belum Diproses',

                            'subtext' =>
                                $order->pengirimanGudang
                                    ->keterangan
                                    ?? 'Menunggu proses gudang',
                        ],

                        'grand_total' => (float) $order->grand_total,

                        'tanggal' => $order->created_at
                            ? $order->created_at->format('Y-m-d H:i')
                            : null,
                    ];
                });


            // ==========================================
            // 7. RESPONSE DASHBOARD
            // ==========================================

            return response()->json([

                'status' => true,

                'message' => 'Data dashboard berhasil dimuat',

                'data' => [

                    'metrics' => [

                        'nilai_penjualan' => $nilaiPenjualan,

                        'total_sales_order' => $totalSalesOrder,

                        'antrean_gudang' => [
                            'order' => $jumlahOrderGudang['Menunggu_Picking'],
                            'jumlah' => $jumlahBarangGudang['Menunggu_Picking'],
                        ],

                        'dalam_pengiriman' => [
                            'order' => $jumlahOrderGudang['Diperjalanan'],
                            'jumlah' => $jumlahBarangGudang['Diperjalanan'],
                        ],
                    ],

                    'posisi_order' => $posisiOrder,

                    'order_terbaru' => $orderTerbaru,
                ],

            ], 200);

        } catch (Throwable $e) {

            Log::error('Dashboard gagal dimuat', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Gagal memuat data dashboard.',
            ], 500);
        }
    }


    /**
     * Format jumlah Carton, Pack, dan PCS.
     */
    private function formatJumlahBarang($data): array
    {
        $hasil = [
            'carton' => 0,
            'pack' => 0,
            'pcs' => 0,
        ];

        foreach ($data as $item) {

            $satuan = strtolower(trim($item->satuan));

            if (array_key_exists($satuan, $hasil)) {
                $hasil[$satuan] = (float) $item->total;
            }
        }

        return $hasil;
    }
}
