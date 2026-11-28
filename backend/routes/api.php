<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardAccessController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ImportController;
use App\Http\Controllers\Api\MasterDataController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SalesOrderController;
use Illuminate\Support\Facades\Route;

// ============================================================
// PUBLIK — Tidak perlu token
// ============================================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// ============================================================
// TERPROTEKSI — Wajib Bearer Token (Sanctum)
// ============================================================
Route::middleware('auth:sanctum')->group(function () {

    // LOGOUT & PROFIL
    Route::post('/logout',                       [AuthController::class, 'logout']);
    Route::get('/profile',                       [ProfileController::class, 'show']);
    Route::put('/profile',                       [ProfileController::class, 'update']);
    Route::put('/profile/change-password',       [ProfileController::class, 'changePassword']);

    // DASHBOARD — akses dikontrol middleware dashboard.access
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware('dashboard.access');

    // --------------------------------------------------------
    // KHUSUS ADMIN
    // --------------------------------------------------------
    Route::middleware('divisi:admin')->group(function () {
        Route::put('/profile/work-info', [ProfileController::class, 'updateWorkInfo']);

        // Kelola hak akses dashboard per pengguna
        Route::get('/admin/dashboard-access',       [DashboardAccessController::class, 'index']);
        Route::put('/admin/dashboard-access/{id}',  [DashboardAccessController::class, 'update']);
    });

    // --------------------------------------------------------
    // PENJUALAN & ADMIN
    // --------------------------------------------------------
    Route::middleware('divisi:penjualan,admin')->group(function () {

        // Sales Order (CRUD)
        Route::get('/sales-orders',                [SalesOrderController::class, 'index']);
        Route::post('/sales-orders',             [SalesOrderController::class, 'store']);
        Route::get('/sales-orders/{id}',         [SalesOrderController::class, 'show']);
        Route::put('/sales-orders/{id}',         [SalesOrderController::class, 'update']);
        // 4. Batalkan SO — hanya jika belum diproses gudang
        Route::patch('/sales-orders/{id}/cancel', [SalesOrderController::class, 'cancel']);

        // Import Excel
        Route::post('/import/sales-orders', [ImportController::class, 'importSalesOrder']);
        Route::post('/import/barang',       [ImportController::class, 'importBarang']);

        // Master Data (untuk dropdown form)
        Route::get('/master/customers', [MasterDataController::class, 'customers']);
        Route::get('/master/barang',    [MasterDataController::class, 'barang']);
    });

    // --------------------------------------------------------
    // GUDANG & ADMIN — akan diisi saat modul gudang dikerjakan
    // --------------------------------------------------------
    Route::middleware('divisi:gudang,admin')->group(function () {
        // Route::get('/picking-list', ...);
        // Route::get('/surat-jalan', ...);
    });
});
