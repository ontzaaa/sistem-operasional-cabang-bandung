<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckDashboardAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Pastikan pengguna sudah login
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // Admin otomatis mendapatkan akses Dashboard
        if (strtolower($user->divisi) === 'admin') {
            return $next($request);
        }

        // Penjualan dan Gudang harus mendapat izin Admin
        if (!$user->can_access_dashboard) {
            return response()->json([
                'status' => false,
                'message' => 'Akses Dashboard belum diberikan oleh Admin.',
            ], 403);
        }

        return $next($request);
    }
}
