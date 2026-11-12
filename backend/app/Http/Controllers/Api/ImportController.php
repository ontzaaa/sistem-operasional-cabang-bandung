<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Imports\SalesOrderImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;
use Throwable;





class ImportController extends Controller
{
    /**
     * Import Data Sales Order dari Excel
     * POST /api/import/sales-orders
     */
    
public function importSalesOrder(Request $request)
{
    set_time_limit(300);

    $request->validate([
        'file_excel' => 'required|file|mimes:xlsx,xls|max:10240',
    ]);

    try {
        $import = new SalesOrderImport();

        Excel::import(
            $import,
            $request->file('file_excel')
        );

        $result = $import->persist();

        return response()->json([
            'status' => true,
            'message' => 'Import Sales Order berhasil.',
            'data' => $result,
        ], 200);

    } catch (Throwable $e) {

        Log::error('Import Sales Order gagal', [
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ]);

        return response()->json([
            'status' => false,
            'message' => 'Import Sales Order gagal.',
            'error' => config('app.debug')
                ? $e->getMessage()
                : 'Terjadi kesalahan saat import.',
        ], 500);
    }
}


    /**
     * Import Data Stok Barang dari Excel
     * POST /api/import/barang
     */
    public function importBarang(Request $request)
    {
        $request->validate([
            'file_excel' => 'required|file|mimes:xlsx,xls,csv|max:10240',
        ]);

        try {
            Excel::import(
                new BarangImport(),
                $request->file('file_excel')
            );

            return response()->json([
                'status' => true,
                'message' => 'Data stok barang berhasil diimpor!',
            ], 200);

        } catch (Throwable $e) {

            Log::error('Import Barang gagal', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Gagal mengimpor data barang.',
                'error' => config('app.debug')
                    ? $e->getMessage()
                    : 'Terjadi kesalahan saat memproses file Excel.',
            ], 500);
        }
    }
}
