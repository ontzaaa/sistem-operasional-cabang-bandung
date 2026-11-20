<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ImportController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\DashboardAccessController;
use App\Http\Controllers\Api\SalesOrderController;
use Illuminate\Support\Facades\Route;

// ROUTE PUBLIK
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ROUTE TERPROTEKSI
Route::middleware('auth:sanctum')->group(function () {

    // PROFIL
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/change-password', [ProfileController::class, 'changePassword']);

    // LOGOUT
    Route::post('/logout', [AuthController::class, 'logout']);

    // KHUSUS ADMIN
    Route::middleware('divisi:admin')->group(function () {
        Route::get('/admin/dashboard-access', [DashboardAccessController::class, 'index']);
        Route::put('/admin/dashboard-access/{id}', [DashboardAccessController::class, 'update']);

        Route::put('/profile/work-info', [ProfileController::class, 'updateWorkInfo']);
    });

    // DASHBOARD
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware('dashboard.access');

    // IMPORT EXCEL
    Route::post('/import/sales-orders', [ImportController::class, 'importSalesOrder']);
    Route::post('/import/barang', [ImportController::class, 'importBarang']);

    // PENJUALAN DAN ADMIN
    Route::middleware('divisi:penjualan,admin')->group(function () {
        Route::get('/sales-orders', [SalesOrderController::class, 'index']);
        Route::post('/sales-orders', [SalesOrderController::class, 'store']);
        Route::get('/sales-orders/{id}', [SalesOrderController::class, 'show']);
    });

    // GUDANG DAN ADMIN
    Route::middleware('divisi:gudang,admin')->group(function () {
        // Endpoint Gudang akan ditambahkan berikutnya.
    });
});
