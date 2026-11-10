<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ImportController;
use Illuminate\Support\Facades\Route;

// 1. Rute Publik (Tanpa Token)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 2. Rute Terproteksi (Wajib Bearer Token Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    //Endpoint Unggal Excel
    Route::post('/import/sales-orders', [ImportController::class, 'importSalesOrder']);
    Route::post('/import/barang', [ImportController::class, 'importBarang']);

    // Fitur Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Rute Khusus Divisi Penjualan & Admin
    Route::middleware('divisi:penjualan,admin')->group(function () {
        // Fitur Sales Order & Barang Inden
    });

    // Rute Khusus Divisi Gudang & Admin
    Route::middleware('divisi:gudang,admin')->group(function () {
        // Fitur Picking List & Surat Jalan
    });
});