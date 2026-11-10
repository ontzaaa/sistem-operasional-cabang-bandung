<?php

use App\Http\Middleware\CheckDivisi;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
    // Registrasi alias middleware hak akses divisi
    $middleware->alias([
        'divisi' => CheckDivisi::class,
    ]);

    // API mengembalikan JSON jika pengguna belum terautentikasi
    $middleware->redirectGuestsTo(function ($request) {
        return $request->is('api/*') ? null : route('login');
    });
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();