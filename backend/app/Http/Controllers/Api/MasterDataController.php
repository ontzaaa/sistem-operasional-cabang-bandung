<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\Customer;
use Illuminate\Http\Request;

class MasterDataController extends Controller
{
    public function customers(Request $request)
    {
        $search = $request->query('search');

        $customers = Customer::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kode_pelanggan', 'ILIKE', "%{$search}%")
                        ->orWhere('nama_pelanggan', 'ILIKE', "%{$search}%");
                });
            })
            ->select('id', 'kode_pelanggan', 'nama_pelanggan', 'kota')
            ->orderBy('nama_pelanggan')
            ->limit(100)
            ->get();

        return response()->json([
            'status' => true,
            'data' => $customers,
        ]);
    }

    public function barang(Request $request)
    {
        $search = $request->query('search');

        $barang = Barang::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('kode_barang', 'ILIKE', "%{$search}%")
                        ->orWhere('nama_barang', 'ILIKE', "%{$search}%");
                });
            })
            ->select(
                'id',
                'kode_barang',
                'nama_barang',
                'pack_per_carton',
                'isi_per_pack',
                'harga'
            )
            ->orderBy('nama_barang')
            ->limit(100)
            ->get();

        return response()->json([
            'status' => true,
            'data' => $barang,
        ]);
    }
}
