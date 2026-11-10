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
            'divisi'       => 'required|in:penjualan,gudang',
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
        /**
     * Endpoint API Login Pengguna
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Username atau password salah',
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Login berhasil',
            'data' => [
                'id' => $user->id,
                'nama_lengkap' => $user->nama_lengkap,
                'username' => $user->username,
                'email' => $user->email,
                'divisi' => $user->divisi,
            ],
            'token' => $token,
        ], 200);
    }
    /**
     * Endpoint API Logout Pengguna
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => true,
            'message' => 'Logout berhasil',
        ], 200);
    }
}