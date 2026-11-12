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
        'harga',
        'subtotal',
    ];

    protected $casts = [
        'quantity' => 'float',
        'harga'    => 'float',
        'subtotal' => 'float',
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

