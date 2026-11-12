<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengiriman_gudang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sales_order_id')->unique()->constrained('sales_orders')->cascadeOnDelete();
            $table->enum('status_pengiriman', [
                'Menunggu_Picking',
                'Proses_Picking',
                'Proses_Packing',
                'Siap_Kirim',
                'Diperjalanan',
                'Selesai',
            ])->default('Menunggu_Picking');
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengiriman_gudang');
    }
};

