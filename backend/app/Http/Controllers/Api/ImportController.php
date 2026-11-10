<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\SalesOrderImport;

class ImportController extends Controller
{
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
}