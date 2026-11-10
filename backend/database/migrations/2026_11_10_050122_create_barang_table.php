<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('barang', function (Blueprint $table) {
            $table->id();
            $table->string('kode_barang')->unique();             // KODE (Unique identifier)
            $table->string('kode_induk')->nullable();            // KDINDUK
            $table->string('nama_barang');                       // NAMA
            $table->integer('isi_per_box')->default(1);          // @BOX
            $table->string('gudang')->default('BDG');            // GUDANG
            $table->string('lokasi_rak')->nullable();            // LOKASI
            $table->integer('quantity')->default(0);             // QUANTITY
            $table->integer('carton')->default(0);               // CARTON
            $table->integer('pack')->default(0);                 // PACK
            $table->integer('pcs')->default(0);                  // PCS
            $table->decimal('nilai_stock', 15, 2)->default(0); // NILAI STOCK
            $table->decimal('harga', 15, 2)->default(0);       // HARGA
            $table->decimal('harga_trt', 15, 2)->default(0);   // HARGA TRT
            $table->decimal('harga_mtb', 15, 2)->default(0);   // HARGA MTB
            $table->decimal('harga_msp', 15, 2)->default(0);   // HARGA MSP
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barang');
    }
};