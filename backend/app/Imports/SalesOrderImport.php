<?php

namespace App\Imports;

use App\Models\Barang;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class BarangImport implements ToModel, WithHeadingRow
{
    /**
     * Menentukan bahwa header kolom Excel berada pada baris ke-4
     */
    public function headingRow(): int
    {
        return 4;
    }

    public function model(array $row)
    {
        // Melewati baris kosong jika kode barang tidak ada
        if (empty($row['kode'])) {
            return null;
        }

        return Barang::updateOrCreate(
            ['kode_barang' => $row['kode']],
            [
                'kode_induk'  => $row['kdinduk'] ?? null,
                'nama_barang' => $row['nama'],
                'isi_per_box' => $row['box'] ?? $row['at_box'] ?? 1,
                'gudang'      => $row['gudang'] ?? 'BDG',
                'lokasi_rak'  => $row['lokasi'] ?? null,
                'quantity'    => $row['quantity'] ?? 0,
                'carton'      => $row['carton'] ?? 0,
                'pack'        => $row['pack'] ?? 0,
                'pcs'         => $row['pcs'] ?? 0,
                'nilai_stock' => $row['nilai_stock'] ?? 0,
                'harga'       => $row['harga'] ?? 0,
                'harga_trt'   => $row['harga_trt'] ?? 0,
                'harga_mtb'   => $row['harga_mtb'] ?? 0,
                'harga_msp'   => $row['harga_msp'] ?? 0,
            ]
        );
    }
}