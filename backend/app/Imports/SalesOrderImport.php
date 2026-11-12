<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Concerns\Import;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;
use Carbon\Carbon;
use RuntimeException;

class SalesOrderImport implements Import, WithMultipleSheets
{
    use Importable;

    private array $headers = [];
    private array $details = [];

    public function sheets(): array
    {
        return [
            'Header SO' => new SalesOrderHeaderSheet($this),
            'Detail SO' => new SalesOrderDetailSheet($this),
        ];
    }

    public function collectHeaders(Collection $rows): void
    {
        $this->headers = $this->cleanRows($rows);
    }

    public function collectDetails(Collection $rows): void
    {
        $this->details = $this->cleanRows($rows);
    }

    private function cleanRows(Collection $rows): array
    {
        return $rows->skip(1)
            ->map(fn ($row) => $row->toArray())
            ->filter(fn ($row) =>
                !empty(trim((string) ($row[0] ?? '')))
            )
            ->values()
            ->all();
    }

    public function persist(): array
    {
        if (empty($this->headers)) {
            throw new RuntimeException('Sheet Header SO kosong.');
        }

        if (empty($this->details)) {
            throw new RuntimeException('Sheet Detail SO kosong.');
        }

        /*
         * 1. NORMALISASI HEADER
         */

        $headers = [];

        foreach ($this->headers as $index => $row) {
            $data = [
                'nomor_so' => trim((string) ($row[0] ?? '')),
                'tanggal_so' => $this->parseDate($row[1] ?? null),
                'kode_pelanggan' => trim((string) ($row[2] ?? '')),
                'metode_pembayaran' => trim((string) ($row[3] ?? '')),
                'keterangan' => $row[4] ?? null,
            ];

            $validator = Validator::make($data, [
                'nomor_so' => 'required|string|max:50',
                'tanggal_so' => 'required|date',
                'kode_pelanggan' => 'required|string',
                'metode_pembayaran' => 'required|string|max:50',
            ]);

            if ($validator->fails()) {
                throw ValidationException::withMessages([
                    'Header SO baris ' . ($index + 2) =>
                        $validator->errors()->all(),
                ]);
            }

            if (isset($headers[$data['nomor_so']])) {
                throw new RuntimeException(
                    'Nomor SO duplikat dalam Excel: ' . $data['nomor_so']
                );
            }

            $headers[$data['nomor_so']] = $data;
        }

        /*
         * 2. NORMALISASI DETAIL
         */

        $details = [];
        $kodeBarang = [];

        foreach ($this->details as $index => $row) {
            $data = [
                'nomor_so' => trim((string) ($row[0] ?? '')),
                'kode_barang' => trim((string) ($row[1] ?? '')),
                'quantity' => $row[2] ?? null,
                'satuan' => strtoupper(trim((string) ($row[3] ?? ''))),
                'harga' => $row[4] ?? null,
            ];

            $validator = Validator::make($data, [
                'nomor_so' => 'required|string',
                'kode_barang' => 'required|string',
                'quantity' => 'required|numeric|gt:0',
                'satuan' => 'required|in:CARTON,PACK,PCS',
                'harga' => 'required|numeric|min:0',
            ]);

            if ($validator->fails()) {
                throw ValidationException::withMessages([
                    'Detail SO baris ' . ($index + 2) =>
                        $validator->errors()->all(),
                ]);
            }

            if (!isset($headers[$data['nomor_so']])) {
                throw new RuntimeException(
                    'Nomor SO tidak ditemukan pada Header SO: ' .
                    $data['nomor_so']
                );
            }

            $kodeBarang[] = $data['kode_barang'];
            $details[] = $data;
        }

        /*
         * 3. AMBIL MASTER DATA SEKALIGUS
         */

        $nomorSO = array_keys($headers);

        $existingSO = DB::table('sales_orders')
            ->whereIn('nomor_so', $nomorSO)
            ->pluck('nomor_so')
            ->all();

        if (!empty($existingSO)) {
            throw new RuntimeException(
                'Nomor SO sudah terdaftar: ' .
                implode(', ', $existingSO)
            );
        }

        $customers = DB::table('customers')
            ->whereIn(
                'kode_pelanggan',
                array_unique(array_column($headers, 'kode_pelanggan'))
            )
            ->pluck('id', 'kode_pelanggan')
            ->all();

        $barangs = DB::table('barang')
            ->whereIn('kode_barang', array_unique($kodeBarang))
            ->pluck('id', 'kode_barang')
            ->all();

        foreach ($headers as $nomor => $header) {
            if (!isset($customers[$header['kode_pelanggan']])) {
                throw new RuntimeException(
                    'Pelanggan tidak ditemukan: ' .
                    $header['kode_pelanggan']
                );
            }
        }

        foreach ($details as $detail) {
            if (!isset($barangs[$detail['kode_barang']])) {
                throw new RuntimeException(
                    'Barang tidak ditemukan: ' .
                    $detail['kode_barang']
                );
            }
        }

        /*
         * 4. HITUNG TOTAL SETIAP SO
         */

        $totalPerSO = [];

        foreach ($details as $detail) {
            $subtotal = (float) $detail['quantity'] *
                        (float) $detail['harga'];

            $nomor = $detail['nomor_so'];

            $totalPerSO[$nomor] =
                ($totalPerSO[$nomor] ?? 0) + $subtotal;
        }

        foreach ($headers as $nomor => $header) {
            if (!isset($totalPerSO[$nomor])) {
                throw new RuntimeException(
                    'Sales Order tidak memiliki detail: ' . $nomor
                );
            }
        }

        /*
         * 5. SIMPAN DALAM SATU TRANSAKSI
         */

        return DB::transaction(function () use (
            $headers,
            $details,
            $customers,
            $barangs,
            $totalPerSO
        ) {
            $orderIds = [];
            $createdBy = auth()->id();

            foreach ($headers as $nomor => $header) {
                $total = $totalPerSO[$nomor];

                $orderIds[$nomor] = DB::table('sales_orders')
                    ->insertGetId([
                        'nomor_so' => $nomor,
                        'tanggal_so' => $header['tanggal_so'],
                        'customer_id' =>
                            $customers[$header['kode_pelanggan']],
                        'user_id' => auth()->id(),
                        'metode_pembayaran' =>
                            $header['metode_pembayaran'],
                        'status' => 'Submitted',
                        'subtotal' => $total,
                        'grand_total' => $total,
                        'keterangan' => $header['keterangan'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
            }

            $insertDetails = [];

            foreach ($details as $detail) {
                $harga = (float) $detail['harga'];
                $quantity = (float) $detail['quantity'];

                $insertDetails[] = [
                    'sales_order_id' =>
                        $orderIds[$detail['nomor_so']],
                    'barang_id' =>
                        $barangs[$detail['kode_barang']],
                    'quantity' => $quantity,
                    'satuan' => strtolower($detail['satuan']),
                    'harga' => $harga,
                    'subtotal' => $quantity * $harga,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            foreach (array_chunk($insertDetails, 500) as $chunk) {
                DB::table('detail_sales_orders')->insert($chunk);
            }

            return [
                'total_sales_order' => count($headers),
                'total_detail' => count($details),
            ];
        }, 3);
    }

    private function parseDate($value): ?string
    {
        if (empty($value)) {
            return null;
        }

        if (is_numeric($value)) {
            return ExcelDate::excelToDateTimeObject(
                (float) $value
            )->format('Y-m-d');
        }

        return Carbon::parse($value)->format('Y-m-d');
    }
}

class SalesOrderHeaderSheet implements ToCollection
{
    public function __construct(
        private SalesOrderImport $parent
    ) {}

    public function collection(Collection $rows): void
    {
        $this->parent->collectHeaders($rows);
    }
}

class SalesOrderDetailSheet implements ToCollection
{
    public function __construct(
        private SalesOrderImport $parent
    ) {}

    public function collection(Collection $rows): void
    {
        $this->parent->collectDetails($rows);
    }
}
