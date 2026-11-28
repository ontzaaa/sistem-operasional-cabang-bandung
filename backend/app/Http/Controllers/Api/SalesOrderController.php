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
    // =========================================================================
    // 1 & 3 — INDEX: Daftar SO dengan filter pencarian, status, dan tanggal
    //          Hak akses: divisi:penjualan,admin (diterapkan di route)
    // =========================================================================
    public function index(Request $request)
    {
        $validated = $request->validate([
            // 3. Filter pencarian
            'search'     => ['nullable', 'string', 'max:100'],
            // 3. Filter status
            'status'     => ['nullable', 'in:Submitted,Diproses,Selesai,Cancelled'],
            // 3. Filter tanggal
            'start_date' => ['nullable', 'date_format:Y-m-d'],
            'end_date'   => [
                'nullable',
                'date_format:Y-m-d',
                'after_or_equal:start_date',
            ],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = SalesOrder::with([
            'customer:id,kode_pelanggan,nama_pelanggan',
            'user:id,nama_lengkap',
            'detailSalesOrder.barang:id,kode_barang,nama_barang',
            'pengirimanGudang:id,sales_order_id,status_pengiriman',
        ]);

        // 3. Pencarian: nomor SO atau nama pelanggan
        if (!empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($q) use ($search) {
                $q->where('nomor_so', 'ILIKE', "%{$search}%")
                    ->orWhereHas('customer', fn ($c) =>
                        $c->where('nama_pelanggan', 'ILIKE', "%{$search}%")
                    );
            });
        }

        // 3. Filter status
        if (!empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        // 3. Filter rentang tanggal
        if (!empty($validated['start_date'])) {
            $query->whereDate('tanggal_so', '>=', $validated['start_date']);
        }
        if (!empty($validated['end_date'])) {
            $query->whereDate('tanggal_so', '<=', $validated['end_date']);
        }

        $salesOrders = $query
            ->orderByDesc('tanggal_so')
            ->orderByDesc('id')
            ->paginate($validated['per_page'] ?? 10);

        return response()->json([
            'status'  => true,
            'message' => 'Daftar Sales Order berhasil diambil.',
            'data'    => $salesOrders,
        ], 200);
    }

    // =========================================================================
    // SHOW — Detail satu Sales Order
    // =========================================================================
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
                'status'  => false,
                'message' => 'Sales Order tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'status'  => true,
            'message' => 'Detail Sales Order berhasil diambil.',
            'data'    => $salesOrder,
        ], 200);
    }

    // =========================================================================
    // STORE — Buat SO baru
    // 1. Validasi carton & pack   2. Validasi harga & subtotal
    // 5. Hak akses via route middleware divisi:penjualan,admin
    // =========================================================================
    public function store(Request $request)
    {
        $validated = $request->validate($this->detailRules());

        // 5. Validasi duplikasi barang dalam satu SO
        $this->validasiDuplikasiBarang($validated['details']);

        $salesOrder = DB::transaction(function () use ($validated) {

            // Generate nomor SO otomatis dengan advisory lock (hindari race condition)
            $tanggalNomor = str_replace('-', '', $validated['tanggal_so']);
            $prefix       = 'SO-' . $tanggalNomor . '-';

            DB::select('SELECT pg_advisory_xact_lock(?)', [crc32($tanggalNomor)]);

            $nomorTerakhir = SalesOrder::where('nomor_so', 'like', $prefix . '%')
                ->orderByDesc('nomor_so')
                ->value('nomor_so');

            $nomorUrut = $nomorTerakhir
                ? ((int) substr($nomorTerakhir, strlen($prefix))) + 1
                : 1;

            $nomorSO = $prefix . str_pad($nomorUrut, 4, '0', STR_PAD_LEFT);

            $salesOrder = SalesOrder::create([
                'nomor_so'          => $nomorSO,
                'tanggal_so'        => $validated['tanggal_so'],
                'customer_id'       => $validated['customer_id'],
                'user_id'           => Auth::id(),
                'metode_pembayaran' => $validated['metode_pembayaran'] ?? null,
                'keterangan'        => $validated['keterangan'] ?? null,
                'status'            => 'Submitted',
                'subtotal'          => 0,
                'grand_total'       => 0,
            ]);

            // 1 & 2: Validasi dan simpan detail (carton, pack, harga, subtotal)
            $totalSO = $this->simpanDetails($salesOrder, $validated['details']);

            $salesOrder->update([
                'subtotal'    => $totalSO,
                'grand_total' => $totalSO,
            ]);

            // Buat catatan awal antrian gudang
            $salesOrder->pengirimanGudang()->create([
                'status_pengiriman' => 'Menunggu_Picking',
                'keterangan'        => null,
            ]);

            return $salesOrder->load([
                'customer',
                'user',
                'detailSalesOrder.barang',
                'pengirimanGudang',
            ]);
        });

        return response()->json([
            'status'  => true,
            'message' => 'Sales Order berhasil dibuat.',
            'data'    => $salesOrder,
        ], 201);
    }

    // =========================================================================
    // UPDATE — Edit SO
    // 4. Pembatasan edit: hanya jika status Submitted & gudang Menunggu_Picking
    // 1 & 2. Validasi carton, pack, harga, subtotal tetap berjalan
    // =========================================================================
    public function update(Request $request, int $id)
    {
        $validated = $request->validate($this->detailRules());

        // 5. Validasi duplikasi barang dalam satu SO
        $this->validasiDuplikasiBarang($validated['details']);

        $salesOrder = DB::transaction(function () use ($validated, $id) {

            $salesOrder = SalesOrder::whereKey($id)->lockForUpdate()->first();

            if (!$salesOrder) {
                abort(404, 'Sales Order tidak ditemukan.');
            }

            $salesOrder->load(['detailSalesOrder', 'pengirimanGudang']);

            // 4. Pembatasan edit: SO hanya bisa diedit jika belum diproses gudang
            $this->pastikanBisaDiedit($salesOrder);

            // Simpan harga lama per barang_id sebelum detail dihapus
            $hargaLama = $salesOrder->detailSalesOrder
                ->pluck('harga', 'barang_id')
                ->all();

            $salesOrder->update([
                'tanggal_so'        => $validated['tanggal_so'],
                'customer_id'       => $validated['customer_id'],
                'metode_pembayaran' => $validated['metode_pembayaran'] ?? null,
                'keterangan'        => $validated['keterangan'] ?? null,
            ]);

            $salesOrder->detailSalesOrder()->delete();

            // 1 & 2: Validasi dan simpan detail baru
            $totalSO = $this->simpanDetails(
                $salesOrder,
                $validated['details'],
                $hargaLama
            );

            $salesOrder->update([
                'subtotal'    => $totalSO,
                'grand_total' => $totalSO,
            ]);

            return $salesOrder->fresh()->load([
                'customer',
                'user',
                'detailSalesOrder.barang',
                'pengirimanGudang',
            ]);
        });

        return response()->json([
            'status'  => true,
            'message' => 'Sales Order berhasil diperbarui.',
            'data'    => $salesOrder,
        ], 200);
    }

    // =========================================================================
    // CANCEL — Batalkan SO
    // 4. Hanya bisa dibatalkan jika belum diproses gudang (sama dengan aturan edit)
    // 5. Hak akses: divisi:penjualan,admin via route
    // =========================================================================
    public function cancel(int $id)
    {
        $salesOrder = DB::transaction(function () use ($id) {

            $salesOrder = SalesOrder::whereKey($id)->lockForUpdate()->first();

            if (!$salesOrder) {
                abort(404, 'Sales Order tidak ditemukan.');
            }

            $salesOrder->load('pengirimanGudang');

            // 4. Pembatasan: SO yang sudah diproses gudang tidak bisa dibatalkan
            $this->pastikanBisaDiedit($salesOrder);

            if ($salesOrder->status === 'Cancelled') {
                throw ValidationException::withMessages([
                    'status' => 'Sales Order ini sudah dibatalkan sebelumnya.',
                ]);
            }

            $salesOrder->update(['status' => 'Cancelled']);

            return $salesOrder->fresh()->load([
                'customer',
                'user',
                'detailSalesOrder.barang',
                'pengirimanGudang',
            ]);
        });

        return response()->json([
            'status'  => true,
            'message' => 'Sales Order berhasil dibatalkan.',
            'data'    => $salesOrder,
        ], 200);
    }

    // =========================================================================
    // PRIVATE — Aturan validasi request (dipakai store & update)
    // =========================================================================
    private function detailRules(): array
    {
        return [
            'tanggal_so'          => ['required', 'date_format:Y-m-d'],
            'customer_id'         => ['required', 'integer', 'exists:customers,id'],
            'metode_pembayaran'   => ['nullable', 'string', 'max:100'],
            'keterangan'          => ['nullable', 'string'],
            'details'             => ['required', 'array', 'min:1'],
            'details.*.barang_id' => ['required', 'integer', 'exists:barang,id'],
            // 1. Carton minimal 1
            'details.*.carton'    => ['required', 'integer', 'min:1'],
            // 1. Pack minimal 0 — validasi logis (pack = carton × pack_per_carton)
            //    dilakukan secara manual di simpanDetails()
            'details.*.pack'      => ['required', 'integer', 'min:0'],
            // 2. Harga opsional input manual; jika tidak diisi ambil dari master
            'details.*.harga'     => ['nullable', 'numeric', 'min:0'],
        ];
    }

    // =========================================================================
    // PRIVATE — Validasi tidak ada barang_id duplikat dalam satu SO
    // =========================================================================
    private function validasiDuplikasiBarang(array $details): void
    {
        $ids  = array_column($details, 'barang_id');
        $unik = array_unique($ids);

        if (count($ids) !== count($unik)) {
            throw ValidationException::withMessages([
                'details' => 'Terdapat barang yang sama lebih dari satu baris. Gabungkan menjadi satu baris.',
            ]);
        }
    }

    // =========================================================================
    // PRIVATE — Pastikan SO masih bisa diedit / dibatalkan
    // 4. Blokir jika status bukan Submitted, atau gudang sudah melewati Menunggu_Picking
    // =========================================================================
    private function pastikanBisaDiedit(SalesOrder $salesOrder): void
    {
        $statusGudang = $salesOrder->pengirimanGudang?->status_pengiriman;

        $bisaDiedit =
            $salesOrder->status === 'Submitted' &&
            $statusGudang === 'Menunggu_Picking';

        if (!$bisaDiedit) {
            throw ValidationException::withMessages([
                'status' => 'Sales Order tidak dapat diubah karena sudah diproses oleh Gudang' .
                    ($statusGudang ? " (status gudang: {$statusGudang})." : '.'),
            ]);
        }
    }

    // =========================================================================
    // PRIVATE — Simpan baris detail dan kembalikan total SO
    // 1. Validasi carton & pack berdasarkan konfigurasi barang
    // 2. Validasi harga > 0, hitung subtotal otomatis
    // $hargaLama diisi saat update agar harga lama bisa dipertahankan
    // =========================================================================
    private function simpanDetails(
        SalesOrder $salesOrder,
        array $details,
        array $hargaLama = []
    ): float {
        $totalSO = 0.0;

        foreach ($details as $index => $detail) {

            /** @var Barang|null $barang */
            $barang = Barang::find($detail['barang_id']);

            if (!$barang) {
                throw ValidationException::withMessages([
                    "details.$index.barang_id" => 'Barang tidak ditemukan.',
                ]);
            }

            // 1. Validasi konfigurasi kemasan tersedia
            if (
                !$barang->pack_per_carton ||
                !$barang->isi_per_pack   ||
                $barang->pack_per_carton < 1 ||
                $barang->isi_per_pack    < 1
            ) {
                throw ValidationException::withMessages([
                    "details.$index.barang_id" =>
                        "Konfigurasi kemasan barang [{$barang->kode_barang}] belum tersedia " .
                        '(Pack per Carton dan Isi PCS per Pack harus diisi).',
                ]);
            }

            $carton = (int) $detail['carton'];
            $pack   = (int) $detail['pack'];

            // 1. Validasi pack = carton × pack_per_carton
            $packSeharusnya = $carton * $barang->pack_per_carton;

            if ($pack !== $packSeharusnya) {
                throw ValidationException::withMessages([
                    "details.$index.pack" =>
                        "Barang [{$barang->kode_barang}]: Jumlah Pack harus " .
                        "{$packSeharusnya} (= {$carton} Carton × {$barang->pack_per_carton} Pack/Carton), " .
                        "bukan {$pack}.",
                ]);
            }

            // Quantity dalam PCS dihitung otomatis
            $quantity = $pack * $barang->isi_per_pack;

            // 2. Prioritas harga: input manual → harga lama (update) → harga master
            $harga = $detail['harga'] ?? $hargaLama[$barang->id] ?? $barang->harga;

            if ($harga === null || (float) $harga <= 0) {
                throw ValidationException::withMessages([
                    "details.$index.harga" =>
                        "Harga barang [{$barang->kode_barang}] belum tersedia. " .
                        'Silakan masukkan harga secara manual.',
                ]);
            }

            // 2. Hitung subtotal otomatis (quantity PCS × harga)
            $subtotalDetail = round((float) $quantity * (float) $harga, 2);

            $salesOrder->detailSalesOrder()->create([
                'barang_id'                => $barang->id,
                'quantity'                 => $quantity,
                'satuan'                   => 'pcs',
                'carton'                   => $carton,
                'pack'                     => $pack,
                'harga'                    => $harga,
                'subtotal'                 => $subtotalDetail,
                // Snapshot konfigurasi kemasan saat transaksi dibuat
                'pack_per_carton_snapshot' => $barang->pack_per_carton,
                'isi_per_pack_snapshot'    => $barang->isi_per_pack,
            ]);

            $totalSO += $subtotalDetail;
        }

        return $totalSO;
    }
}
