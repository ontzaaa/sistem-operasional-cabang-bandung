<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PengirimanGudang extends Model
{
    protected $table = 'pengiriman_gudang';

    protected $fillable = [
        'sales_order_id',
        'status_pengiriman',
        'keterangan',
    ];

    public function salesOrder(): BelongsTo
    {
        return $this->belongsTo(SalesOrder::class);
    }
}

