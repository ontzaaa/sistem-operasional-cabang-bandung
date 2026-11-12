<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class SalesOrder extends Model
{
    protected $fillable = [
        'nomor_so',
        'tanggal_so',
        'customer_id',
        'user_id',
        'metode_pembayaran',
        'keterangan',
        'status',
        'subtotal',
        'grand_total',
    ];

    protected $casts = [
        'tanggal_so' => 'date',
        'subtotal'   => 'float',
        'grand_total' => 'float',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function detailSalesOrder(): HasMany
    {
        return $this->hasMany(DetailSalesOrder::class);
    }

    public function pengirimanGudang(): HasOne
    {
        return $this->hasOne(PengirimanGudang::class);
    }
}

