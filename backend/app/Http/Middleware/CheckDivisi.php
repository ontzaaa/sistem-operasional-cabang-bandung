<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckDivisi
{
    public function handle(Request $request, Closure $next, ...$divisi)
    {
        $user = $request->user();

        if (
            !$user ||
            !in_array(
                strtolower($user->divisi),
                array_map('strtolower', $divisi)
            )
        ) {
            return response()->json([
                'status' => false,
                'message' => 'Anda tidak memiliki hak akses untuk fitur ini.',
            ], 403);
        }

        return $next($request);
    }
}
