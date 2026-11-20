<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardAccessController extends Controller
{
    /**
     * GET /api/admin/dashboard-access
     * Menampilkan daftar pengguna beserta izin Dashboard.
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
     * PUT /api/admin/dashboard-access/{id}
     * Mengubah izin akses Dashboard pengguna.
     */
    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'can_access_dashboard' => ['required', 'boolean'],
        ]);

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Pengguna tidak ditemukan.',
            ], 404);
        }

        // Admin otomatis memiliki akses Dashboard.
        if (strtolower($user->divisi) === 'admin') {
            return response()->json([
                'message' => 'Admin sudah memiliki akses Dashboard secara otomatis.',
            ], 422);
        }

        $user->can_access_dashboard = $validated['can_access_dashboard'];
        $user->save();

        return response()->json([
            'message' => 'Izin akses Dashboard berhasil diperbarui.',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'divisi' => $user->divisi,
                'can_access_dashboard' => $user->can_access_dashboard,
            ],
        ]);
    }
}
