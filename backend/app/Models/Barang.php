<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Barang extends Model
{
    protected $table = 'barang';

    protected $fillable = [
        'kode_barang',
        'kode_induk',
        'nama_barang',
        'isi_per_box',
        'pack_per_carton',
        'isi_per_pack',
        'gudang',
        'lokasi_rak',
        'quantity',
        'carton',
        'pack',
        'pcs',
        'nilai_stock',
        'harga',
        'harga_trt',
        'harga_mtb',
        'harga_msp',
    ];

    protected $casts = [
        'isi_per_box'       => 'integer',
        'pack_per_carton'   => 'integer',
        'isi_per_pack'      => 'integer',
        'quantity'          => 'integer',
        'carton'            => 'integer',
        'pack'              => 'integer',
        'pcs'               => 'integer',
        'nilai_stock'       => 'float',
        'harga'             => 'float',
        'harga_trt'         => 'float',
        'harga_mtb'         => 'float',
        'harga_msp'         => 'float',
    ];

    public function detailSalesOrders(): HasMany
    {
        return $this->hasMany(DetailSalesOrder::class);
    }
}
