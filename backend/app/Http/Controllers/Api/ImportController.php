<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\SalesOrderImport;
use App\Imports\BarangImport; // Import class BarangImport

class ImportController extends Controller
{
    /**
     * Import Data Sales Order dari Excel
     * POST /api/import/sales-orders
     */
    public function importSalesOrder(Request $request)
    {
        $request->validate([
            'file_excel' => 'required|mimes:xlsx,xls,csv|max:10240', // Maksimal 10MB
        ]);

        try {
            Excel::import(new SalesOrderImport, $request->file('file_excel'));

            return response()->json([
                'status'  => true,
                'message' => 'Data dari file Excel berhasil diimpor ke database!',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal mengimpor data: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Import Data Stok Barang dari Excel (Header di baris ke-4)
     * POST /api/import/barang
     */
    public function importBarang(Request $request)
    {
        $request->validate([
            'file_excel' => 'required|mimes:xlsx,xls,csv|max:10240',
        ]);

        try {
            Excel::import(new BarangImport, $request->file('file_excel'));

            return response()->json([
                'status'  => true,
                'message' => 'Data stok barang dari Excel berhasil diimpor ke database!',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Gagal mengimpor data barang: ' . $e->getMessage(),
            ], 500);
        }
    }
}