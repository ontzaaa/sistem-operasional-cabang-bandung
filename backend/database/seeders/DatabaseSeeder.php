<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'nama_lengkap' => 'Budi Santoso',
            'username'     => 'budi_sales',
            'email'        => 'budi@solomurni.co.id',
            'password'     => Hash::make('password123'),
            'divisi'       => 'penjualan',
        ]);
    }
}