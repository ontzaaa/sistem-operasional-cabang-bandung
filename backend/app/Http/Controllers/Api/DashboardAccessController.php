<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardAccessController extends Controller
{
    /**
     * Menampilkan daftar pengguna dan status akses Dashboard.
     * Khusus Admin.
     */
    public function index()
    {
        $users = User::query()
            ->whereIn('divisi', ['penjualan', 'gudang'])
            ->select([
                'id',
                'nama_lengkap',
                'username',
                'email',
                'divisi',
                'can_access_dashboard',
            ])
            ->orderBy('nama_lengkap')
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Daftar akses Dashboard berhasil dimuat.',
            'data' => $users,
        ]);
    }

    /**
     * Memberikan atau mencabut akses Dashboard pengguna.
     * Khusus Admin.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'can_access_dashboard' => ['required', 'boolean'],
        ]);

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Pengguna tidak ditemukan.',
            ], 404);
        }

        // Izin hanya dapat dikelola untuk divisi Penjualan dan Gudang.
        if (!in_array(strtolower($user->divisi), ['penjualan', 'gudang'])) {
            return response()->json([
                'status' => false,
                'message' => 'Izin Dashboard hanya dapat dikelola untuk divisi Penjualan dan Gudang.',
            ], 403);
        }

        $user->can_access_dashboard = $validated['can_access_dashboard'];
        $user->save();

        return response()->json([
            'status' => true,
            'message' => $user->can_access_dashboard
                ? 'Akses Dashboard berhasil diberikan.'
                : 'Akses Dashboard berhasil dicabut.',
            'data' => [
                'id' => $user->id,
                'nama_lengkap' => $user->nama_lengkap,
                'divisi' => $user->divisi,
                'can_access_dashboard' => $user->can_access_dashboard,
            ],
        ]);
    }
}
