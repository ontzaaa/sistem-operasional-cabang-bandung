<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Akun Divisi Admin
        User::create([
            'nama_lengkap' => 'Admin Cabang',
            'username'     => 'admin',
            'email'        => 'admin@solomurni.co.id',
            'password'     => Hash::make('password123'),
            'divisi'       => 'admin',
        ]);

        // 2. Akun Divisi Penjualan
        User::create([
            'nama_lengkap' => 'Sales Bandung',
            'username'     => 'sales1',
            'email'        => 'sales@solomurni.co.id',
            'password'     => Hash::make('password123'),
            'divisi'       => 'penjualan',
        ]);

        // 3. Akun Divisi Gudang
        User::create([
            'nama_lengkap' => 'Staf Gudang',
            'username'     => 'gudang1',
            'email'        => 'gudang@solomurni.co.id',
            'password'     => Hash::make('password123'),
            'divisi'       => 'gudang',
        ]);
    }
}