<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\SalesOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SalesOrderController extends Controller
{
    // Menampilkan daftar Sales Order
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'status' => [
                'nullable',
                'in:Submitted,Diproses,Selesai,Cancelled'
            ],
            'start_date' => ['nullable', 'date_format:Y-m-d'],
            'end_date' => [
                'nullable',
                'date_format:Y-m-d',
                'after_or_equal:start_date'
            ],
            'per_page' => [
                'nullable',
                'integer',
                'min:1',
                'max:100'
            ],
        ]);

        $query = SalesOrder::with([
            'customer:id,kode_pelanggan,nama_pelanggan',
            'user:id,nama_lengkap',
            'detailSalesOrder.barang:id,kode_barang,nama_barang',
        ]);

        if (!empty($validated['search'])) {
            $search = $validated['search'];

            $query->where(function ($q) use ($search) {
                $q->where('nomor_so', 'ILIKE', "%{$search}%")
                    ->orWhereHas('customer', function ($customer) use ($search) {
                        $customer->where(
                            'nama_pelanggan',
                            'ILIKE',
                            "%{$search}%"
                        );
                    });
            });
        }

        if (!empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        if (!empty($validated['start_date'])) {
            $query->whereDate(
                'tanggal_so',
                '>=',
                $validated['start_date']
            );
        }

        if (!empty($validated['end_date'])) {
            $query->whereDate(
                'tanggal_so',
                '<=',
                $validated['end_date']
            );
        }

        $salesOrders = $query
            ->orderByDesc('tanggal_so')
            ->orderByDesc('id')
            ->paginate($validated['per_page'] ?? 10);

        return response()->json([
            'status' => true,
            'message' => 'Daftar Sales Order berhasil diambil.',
            'data' => $salesOrders,
        ], 200);
    }

    // Menampilkan detail Sales Order
    public function show(int $id)
    {
        $salesOrder = SalesOrder::with([
            'customer',
            'user',
            'detailSalesOrder.barang',
            'pengirimanGudang',
        ])->find($id);

        if (!$salesOrder) {
            return response()->json([
                'status' => false,
                'message' => 'Sales Order tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Detail Sales Order berhasil diambil.',
            'data' => $salesOrder,
        ], 200);
    }

    // Membuat Sales Order baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal_so' => [
                'required',
                'date_format:Y-m-d',
            ],
            'customer_id' => [
                'required',
                'integer',
                'exists:customers,id',
            ],
            'metode_pembayaran' => [
                'nullable',
                'string',
                'max:100',
            ],
            'keterangan' => [
                'nullable',
                'string',
            ],
            'details' => [
                'required',
                'array',
                'min:1',
            ],
            'details.*.barang_id' => [
                'required',
                'integer',
                'exists:barang,id',
            ],
            'details.*.carton' => [
                'required',
                'integer',
                'min:1',
            ],
            'details.*.pack' => [
                'required',
                'integer',
                'min:1',
            ],
            'details.*.harga' => [
                'nullable',
                'numeric',
                'min:0',
            ],
        ]);

        $salesOrder = DB::transaction(function () use ($validated) {

            // Membuat nomor SO berdasarkan tanggal transaksi.
            $tanggalNomor = str_replace(
                '-',
                '',
                $validated['tanggal_so']
            );

            $prefix = 'SO-' . $tanggalNomor . '-';

            // Mengunci nomor urut untuk tanggal yang sama.
            // Database proyek menggunakan PostgreSQL.
            DB::select(
                'SELECT pg_advisory_xact_lock(?)',
                [crc32($tanggalNomor)]
            );

            $nomorTerakhir = SalesOrder::where(
                'nomor_so',
                'like',
                $prefix . '%'
            )
                ->orderByDesc('nomor_so')
                ->value('nomor_so');

            $nomorUrut = $nomorTerakhir
                ? ((int) substr($nomorTerakhir, strlen($prefix))) + 1
                : 1;

            $nomorSO = $prefix . str_pad(
                $nomorUrut,
                4,
                '0',
                STR_PAD_LEFT
            );

            // Membuat data utama Sales Order.
            $salesOrder = SalesOrder::create([
                'nomor_so' => $nomorSO,
                'tanggal_so' => $validated['tanggal_so'],
                'customer_id' => $validated['customer_id'],
                'user_id' => Auth::user()->id,
                'metode_pembayaran' =>
                $validated['metode_pembayaran'] ?? null,
                'keterangan' => $validated['keterangan'] ?? null,
                'status' => 'Submitted',
                'subtotal' => 0,
                'grand_total' => 0,
            ]);

            $totalSO = 0;

            // Menyimpan setiap detail barang.
            foreach ($validated['details'] as $index => $detail) {

                $barang = Barang::find($detail['barang_id']);

                if (!$barang) {
                    throw ValidationException::withMessages([
                        "details.$index.barang_id" =>
                        'Barang tidak ditemukan.',
                    ]);
                }

                // Memastikan konfigurasi kemasan tersedia.
                if (
                    !$barang->pack_per_carton ||
                    !$barang->isi_per_pack ||
                    $barang->pack_per_carton < 1 ||
                    $barang->isi_per_pack < 1
                ) {
                    throw ValidationException::withMessages([
                        "details.$index.barang_id" =>
                        'Konfigurasi Pack per Carton dan isi PCS per Pack untuk barang ini belum tersedia.',
                    ]);
                }

                $carton = (int) $detail['carton'];
                $pack = (int) $detail['pack'];

                // Validasi jumlah Pack berdasarkan Carton.
                $packSeharusnya =
                    $carton * $barang->pack_per_carton;

                if ($pack !== $packSeharusnya) {
                    throw ValidationException::withMessages([
                        "details.$index.pack" =>
                        "Jumlah Pack harus {$packSeharusnya} untuk {$carton} Carton barang ini.",
                    ]);
                }

                // Quantity dihitung otomatis dalam PCS.
                $quantity =
                    $pack * $barang->isi_per_pack;

                // Harga manual digunakan jika dikirim.
                // Jika tidak, gunakan harga master barang.
                $harga = $detail['harga'] ?? $barang->harga;

                if ($harga === null || $harga <= 0) {
                    throw ValidationException::withMessages([
                        "details.$index.harga" =>
                        'Harga barang belum tersedia. Silakan masukkan harga secara manual.',
                    ]);
                }

                // Menghitung subtotal detail.
                $subtotalDetail = round(
                    $quantity * $harga,
                    2
                );

                $salesOrder->detailSalesOrder()->create([
                    'barang_id' => $barang->id,
                    'quantity' => $quantity,
                    'satuan' => 'pcs',
                    'carton' => $carton,
                    'pack' => $pack,
                    'harga' => $harga,
                    'subtotal' => $subtotalDetail,

                    // Snapshot konfigurasi saat transaksi dibuat.
                    'pack_per_carton_snapshot' =>
                    $barang->pack_per_carton,

                    'isi_per_pack_snapshot' =>
                    $barang->isi_per_pack,
                ]);

                $totalSO += $subtotalDetail;
            }

            // Memperbarui total Sales Order.
            $salesOrder->update([
                'subtotal' => $totalSO,
                'grand_total' => $totalSO,
            ]);

            // Membuat catatan awal untuk proses gudang.
            $salesOrder->pengirimanGudang()->create([
                'status_pengiriman' => 'Menunggu_Picking',
                'keterangan' => null,
            ]);

            return $salesOrder->load([
                'customer',
                'user',
                'detailSalesOrder.barang',
                'pengirimanGudang',
            ]);
        });

        return response()->json([
            'status' => true,
            'message' => 'Sales Order berhasil dibuat.',
            'data' => $salesOrder,
        ], 201);
    }
}
