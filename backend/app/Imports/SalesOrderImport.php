<?php

namespace App\Imports;

use App\Models\SalesOrder;
use App\Models\DetailSalesOrder;
use App\Models\PengirimanGudang;
use App\Models\Toko;
use App\Models\Barang;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\DB;

class SalesOrderImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // $row merepresentasikan nama header kolom di file Excel
        // Contoh Header Excel: nomor_so | nomor_po | kode_toko | kode_barang | jumlah_pesan | id_sales

        return DB::transaction(function () use ($row) {
            // 1. Cari data toko dan barang berdasarkan kode di Excel
            $toko = Toko::where('kode_toko', $row['kode_toko'])->first();
            $barang = Barang::where('kode_barang', $row['kode_barang'])->first();

            if (!$toko || !$barang) {
                return null; // Melewati baris jika toko/barang tidak ditemukan
            }

            // 2. Buat atau dapatkan Sales Order
            $so = SalesOrder::firstOrCreate(
                ['nomor_so' => $row['nomor_so']],
                [
                    'nomor_po'    => $row['nomor_po'],
                    'user_id'     => $row['id_sales'] ?? 1,
                    'toko_id'     => $toko->id,
                    'total_harga' => 0,
                    'status_so'   => 'Pending',
                ]
            );

            // 3. Tambahkan Rincian Item Barang
            $subtotal = $barang->harga_satuan * $row['jumlah_pesan'];
            DetailSalesOrder::create([
                'sales_order_id' => $so->id,
                'barang_id'      => $barang->id,
                'jumlah_pesan'   => $row['jumlah_pesan'],
                'harga_satuan'   => $barang->harga_satuan,
                'subtotal'       => $subtotal,
            ]);

            // Accumulate total harga SO
            $so->increment('total_harga', $subtotal);

            // 4. Otomatis buatkan antrean pengiriman gudang
            PengirimanGudang::firstOrCreate(
                ['sales_order_id' => $so->id],
                [
                    'nomor_surat_jalan' => 'SJ-' . $so->nomor_so,
                    'status_pengiriman' => 'Menunggu_Picking',
                ]
            );

            return $so;
        });
    }
}