
<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ImportController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\DashboardAccessController;
use App\Http\Controllers\Api\SalesOrderController;
use Illuminate\Support\Facades\Route;

// 1. Rute Publik
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 2. Rute Terproteksi
Route::middleware('auth:sanctum')->group(function () {

    // Fitur Profil Pengguna
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/change-password', [ProfileController::class, 'changePassword']);

    // Pengelolaan Izin Dashboard
    Route::get('/admin/dashboard-access', [DashboardAccessController::class, 'index']);
    Route::put('/admin/dashboard-access/{id}', [DashboardAccessController::class, 'update']);

    // Fitur Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Dashboard dengan Persetujuan Admin
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware('dashboard.access');

    // Fitur Khusus Admin
    Route::middleware('divisi:admin')->group(function () {

        // Informasi Pekerjaan
        Route::put('/profile/work-info', [ProfileController::class, 'updateWorkInfo']);
    });

    // Endpoint Import Excel
    Route::post('/import/sales-orders', [ImportController::class, 'importSalesOrder']);
    Route::post('/import/barang', [ImportController::class, 'importBarang']);

    // Rute Khusus Divisi Penjualan & Admin
    Route::middleware('divisi:penjualan,admin')->group(function () {

        // Daftar Sales Order
        Route::get('/sales-orders', [SalesOrderController::class, 'index']);

        // Membuat Sales Order
        Route::post('/sales-orders', [SalesOrderController::class, 'store']);

        // Detail Sales Order
        Route::get('/sales-orders/{id}', [SalesOrderController::class, 'show']);

        // Fitur Barang Inden (akan dibuat berikutnya)
    });

    // Rute Khusus Divisi Gudang & Admin
    Route::middleware('divisi:gudang,admin')->group(function () {

        // Fitur Picking List & Surat Jalan (akan dibuat berikutnya)
    });
});
