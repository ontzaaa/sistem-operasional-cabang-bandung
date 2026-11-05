<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Endpoint API Registrasi Pengguna Baru
     */
    public function register(Request $request)
    {
        // 1. Validasi Input JSON
        $validator = Validator::make($request->all(), [
            'nama_lengkap' => 'required|string|max:255',
            'username'     => 'required|string|max:255|unique:users',
            'email'        => 'required|string|email|max:255|unique:users',
            'password'     => 'required|string|min:6',
            'divisi'       => 'required|in:penjualan,admin,gudang',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => false,
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        // 2. Simpan Data ke PostgreSQL (Neon)
        $user = User::create([
            'nama_lengkap' => $request->nama_lengkap,
            'username'     => $request->username,
            'email'        => $request->email,
            'password'     => Hash::make($request->password),
            'divisi'       => $request->divisi,
        ]);

        // 3. Kembalikan Respon JSON
        return response()->json([
            'status'  => true,
            'message' => 'Registrasi akun pengguna berhasil',
            'data'    => [
                'id'           => $user->id,
                'nama_lengkap' => $user->nama_lengkap,
                'username'     => $user->username,
                'email'        => $user->email,
                'divisi'       => $user->divisi,
            ]
        ], 201);
    }
}