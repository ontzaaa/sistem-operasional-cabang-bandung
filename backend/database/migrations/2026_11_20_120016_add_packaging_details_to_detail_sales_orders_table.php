
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('detail_sales_orders', function (Blueprint $table) {
            // Jumlah carton dalam transaksi
            $table->decimal('carton', 10, 2)
                ->default(0);

            // Jumlah total pack dalam transaksi
            $table->decimal('pack', 10, 2)
                ->default(0);

            // Snapshot konversi ketika transaksi dibuat
            $table->integer('pack_per_carton_snapshot')
                ->nullable();

            $table->integer('isi_per_pack_snapshot')
                ->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('detail_sales_orders', function (Blueprint $table) {
            $table->dropColumn([
                'carton',
                'pack',
                'pack_per_carton_snapshot',
                'isi_per_pack_snapshot',
            ]);
        });
    }
};
