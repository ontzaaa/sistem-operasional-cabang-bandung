<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailSalesOrder extends Model
{
    protected $fillable = [
        'sales_order_id',
        'barang_id',
        'quantity',
        'satuan',
        'carton',
        'pack',
        'harga',
        'subtotal',
        'pack_per_carton_snapshot',
        'isi_per_pack_snapshot',
    ];

    protected $casts = [
        'quantity' => 'float',
        'carton' => 'float',
        'pack' => 'float',
        'harga' => 'float',
        'subtotal' => 'float',
        'pack_per_carton_snapshot' => 'integer',
        'isi_per_pack_snapshot' => 'integer',
    ];

    public function salesOrder(): BelongsTo
    {
        return $this->belongsTo(SalesOrder::class);
    }

    public function barang(): BelongsTo
    {
        return $this->belongsTo(Barang::class);
    }
}
