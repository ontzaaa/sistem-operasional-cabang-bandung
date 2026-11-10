
<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ImportController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Support\Facades\Route;

// 1. Rute Publik (Tanpa Token)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 2. Rute Terproteksi (Wajib Bearer Token Sanctum)
Route::middleware('auth:sanctum')->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Fitur Profil Pengguna
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/change-password', [ProfileController::class, 'changePassword']);

    // Fitur Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Fitur Khusus Admin - Informasi Pekerjaan
    Route::middleware('divisi:admin')->group(function () {
        Route::put('/profile/work-info', [ProfileController::class, 'updateWorkInfo']);
    });

    // Endpoint Import Excel
    Route::post('/import/sales-orders', [ImportController::class, 'importSalesOrder']);
    Route::post('/import/barang', [ImportController::class, 'importBarang']);

    // Rute Khusus Divisi Penjualan & Admin
    Route::middleware('divisi:penjualan,admin')->group(function () {
        // Fitur Sales Order & Barang Inden
    });

    // Rute Khusus Divisi Gudang & Admin
    Route::middleware('divisi:gudang,admin')->group(function () {
        // Fitur Picking List & Surat Jalan
    });

});
