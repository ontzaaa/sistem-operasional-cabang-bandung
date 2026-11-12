<?php

namespace Database\Seeders;

use App\Models\Barang;
use Illuminate\Database\Seeder;

class BarangSeeder extends Seeder
{
    public function run(): void
    {
        $barangs = [
            [
                'kode_barang' => 'BRG-001',
                'nama_barang' => 'Mie Goreng Spesial',
                'isi_per_box' => 40,
                'gudang'      => 'BDG',
                'carton'      => 50,
                'pack'        => 20,
                'pcs'         => 100,
                'quantity'    => 2270,
                'harga'       => 3500,
            ],
            [
                'kode_barang' => 'BRG-002',
                'nama_barang' => 'Mie Kuah Original',
                'isi_per_box' => 40,
                'gudang'      => 'BDG',
                'carton'      => 30,
                'pack'        => 10,
                'pcs'         => 50,
                'quantity'    => 1250,
                'harga'       => 3000,
            ],
            [
                'kode_barang' => 'BRG-003',
                'nama_barang' => 'Snack Jagung Bakar',
                'isi_per_box' => 24,
                'gudang'      => 'BDG',
                'carton'      => 100,
                'pack'        => 0,
                'pcs'         => 200,
                'quantity'    => 2600,
                'harga'       => 5000,
            ],
        ];

        foreach ($barangs as $b) {
            Barang::updateOrCreate(
                ['kode_barang' => $b['kode_barang']],
                $b
            );
        }
    }
}

