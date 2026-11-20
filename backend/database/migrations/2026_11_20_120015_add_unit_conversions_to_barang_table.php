
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('barang', function (Blueprint $table) {
            // Jumlah pack dalam satu carton
            $table->integer('pack_per_carton')->nullable()
                ->after('isi_per_box');

            // Jumlah pcs dalam satu pack
            $table->integer('isi_per_pack')->nullable()
                ->after('pack_per_carton');
        });
    }

    public function down(): void
    {
        Schema::table('barang', function (Blueprint $table) {
            $table->dropColumn([
                'pack_per_carton',
                'isi_per_pack',
            ]);
        });
    }
};
