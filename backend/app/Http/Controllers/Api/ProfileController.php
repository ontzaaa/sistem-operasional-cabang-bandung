<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    /**
     * Endpoint API untuk menampilkan profil pengguna
     */
    public function show(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'status' => true,
            'message' => 'Data profil berhasil ditampilkan',
            'data' => [
                'id' => $user->id,
                'nama_lengkap' => $user->nama_lengkap,
                'username' => $user->username,
                'email' => $user->email,
                'no_telepon' => $user->no_telepon,
                'domisili' => $user->domisili,
                'divisi' => $user->divisi,
                'jabatan' => $user->jabatan,
                'cabang' => $user->cabang,
                'atasan_langsung' => $user->atasan_langsung,
                'created_at' => $user->created_at,
            ],
        ], 200);
    }
    /**
 * Endpoint API untuk memperbarui profil pengguna
 */
public function update(Request $request)
{
    $user = $request->user();

    $validator = Validator::make($request->all(), [
        'nama_lengkap' => 'sometimes|required|string|max:255',
        'email' => 'sometimes|required|email|max:255|unique:users,email,' . $user->id,
        'no_telepon' => 'sometimes|nullable|string|max:20',
        'domisili' => 'sometimes|nullable|string|max:255',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => false,
            'message' => 'Validasi gagal',
            'errors' => $validator->errors(),
        ], 422);
    }

    $user->update($validator->validated());

    return response()->json([
        'status' => true,
        'message' => 'Profil berhasil diperbarui',
        'data' => [
            'id' => $user->id,
            'nama_lengkap' => $user->nama_lengkap,
            'username' => $user->username,
            'email' => $user->email,
            'no_telepon' => $user->no_telepon,
            'domisili' => $user->domisili,
            'divisi' => $user->divisi,
            'jabatan' => $user->jabatan,
            'cabang' => $user->cabang,
            'atasan_langsung' => $user->atasan_langsung,
        ],
    ], 200);
}
/**
 * Endpoint API untuk mengubah password pengguna
 */
public function changePassword(Request $request)
{
    $user = $request->user();

    $validator = Validator::make($request->all(), [
        'current_password' => 'required|string',
        'password' => 'required|string|min:8|confirmed',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => false,
            'message' => 'Validasi gagal',
            'errors' => $validator->errors(),
        ], 422);
    }

    // Memeriksa password lama
    if (!Hash::check($request->current_password, $user->password)) {
        return response()->json([
            'status' => false,
            'message' => 'Password lama tidak sesuai',
        ], 422);
    }

    // Memperbarui password baru
    $user->password = $request->password;
    $user->save();

    return response()->json([
        'status' => true,
        'message' => 'Password berhasil diperbarui',
    ], 200);
}
/**
 * Endpoint API untuk memperbarui informasi pekerjaan
 */
public function updateWorkInfo(Request $request)
{
    $user = $request->user();

    $validator = Validator::make($request->all(), [
        'jabatan' => 'sometimes|nullable|string|max:255',
        'cabang' => 'sometimes|nullable|string|max:255',
        'atasan_langsung' => 'sometimes|nullable|string|max:255',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => false,
            'message' => 'Validasi gagal',
            'errors' => $validator->errors(),
        ], 422);
    }

    $user->update($validator->validated());

    return response()->json([
        'status' => true,
        'message' => 'Informasi pekerjaan berhasil diperbarui',
        'data' => [
            'jabatan' => $user->jabatan,
            'cabang' => $user->cabang,
            'atasan_langsung' => $user->atasan_langsung,
        ],
    ], 200);
}
}