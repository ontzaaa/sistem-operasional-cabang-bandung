<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use Carbon\CarbonPeriod;
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
        $validated = $request->validate([
            'start_date' => [
                'nullable',
                'required_with:end_date',
                'date_format:Y-m-d',
            ],
            'end_date' => [
                'nullable',
                'required_with:start_date',
                'date_format:Y-m-d',
                'after_or_equal:start_date',
            ],
        ]);

        $startDate = isset($validated['start_date'])
            ? Carbon::parse($validated['start_date'])->startOfDay()
            : now()->startOfMonth();

        $endDate = isset($validated['end_date'])
            ? Carbon::parse($validated['end_date'])->endOfDay()
            : now()->endOfMonth();

        $jumlahHari = (int) $startDate->diffInDays($endDate) + 1;

        $jenisGrafik = $jumlahHari <= 31 ? 'harian' : 'bulanan';

        try {

            // ==========================================
            // 1. METRIK PENJUALAN
            // Mengikuti filter tanggal
            // ==========================================

            $metrikPenjualan = DB::table('sales_orders')
                ->where('status', '!=', 'Cancelled')
                ->whereBetween('tanggal_so', [
                    $startDate->toDateString(),
                    $endDate->toDateString(),
                ])
                ->selectRaw('
                     COALESCE(SUM(grand_total), 0) AS nilai_penjualan,
                    COUNT(*) AS total_sales_order
               ')
                ->first();

            $nilaiPenjualan = (float) $metrikPenjualan->nilai_penjualan;
            $totalSalesOrder = (int) $metrikPenjualan->total_sales_order;

            // ==========================================
            // 1B. GRAFIK PENJUALAN
            // ==========================================

            $queryGrafik = DB::table('sales_orders')
                ->where('status', '!=', 'Cancelled')
                ->whereBetween('tanggal_so', [
                    $startDate->toDateString(),
                    $endDate->toDateString(),
                ]);

            if ($jenisGrafik === 'harian') {

                $dataGrafik = $queryGrafik
                    ->selectRaw('
            DATE(tanggal_so) AS periode,
            COALESCE(SUM(grand_total), 0) AS total_penjualan
        ')
                    ->groupByRaw('DATE(tanggal_so)')
                    ->orderBy('periode')
                    ->get()
                    ->keyBy('periode');
            } else {

                $dataGrafik = $queryGrafik
                    ->selectRaw("
            TO_CHAR(tanggal_so, 'YYYY-MM') AS periode,
            COALESCE(SUM(grand_total), 0) AS total_penjualan
        ")
                    ->groupByRaw("TO_CHAR(tanggal_so, 'YYYY-MM')")
                    ->orderBy('periode')
                    ->get()
                    ->keyBy('periode');
            }


            // Menyiapkan data grafik
            $grafikPenjualan = [];

            if ($jenisGrafik === 'harian') {

                $periodeGrafik = CarbonPeriod::create(
                    $startDate->copy()->startOfDay(),
                    '1 day',
                    $endDate->copy()->startOfDay()
                );

                foreach ($periodeGrafik as $tanggal) {

                    $periode = $tanggal->format('Y-m-d');

                    $grafikPenjualan[] = [
                        'periode' => $periode,
                        'total_penjualan' => (float) (
                            $dataGrafik[$periode]->total_penjualan ?? 0
                        ),
                    ];
                }
            } else {

                $periodeGrafik = CarbonPeriod::create(
                    $startDate->copy()->startOfMonth(),
                    '1 month',
                    $endDate->copy()->startOfMonth()
                );

                foreach ($periodeGrafik as $bulan) {

                    $periode = $bulan->format('Y-m');

                    $grafikPenjualan[] = [
                        'periode' => $periode,
                        'total_penjualan' => (float) (
                            $dataGrafik[$periode]->total_penjualan ?? 0
                        ),
                    ];
                }
            }


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

                    'grafik_penjualan' => [
                        'jenis_periode' => $jenisGrafik,
                        'start_date' => $startDate->toDateString(),
                        'end_date' => $endDate->toDateString(),
                        'data' => $grafikPenjualan,
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
    private function formatJumlahBarang(
        \Illuminate\Support\Collection $data
    ): array {
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
