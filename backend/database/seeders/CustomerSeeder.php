<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            ['kode_pelanggan' => 'CUST-001', 'nama_pelanggan' => 'PT Maju Jaya',       'kota' => 'Bandung'],
            ['kode_pelanggan' => 'CUST-002', 'nama_pelanggan' => 'CV Berkah Sejahtera', 'kota' => 'Jakarta'],
            ['kode_pelanggan' => 'CUST-003', 'nama_pelanggan' => 'Toko Sumber Rejeki',  'kota' => 'Cimahi'],
        ];

        foreach ($customers as $c) {
            Customer::updateOrCreate(
                ['kode_pelanggan' => $c['kode_pelanggan']],
                $c
            );
        }
    }
}

