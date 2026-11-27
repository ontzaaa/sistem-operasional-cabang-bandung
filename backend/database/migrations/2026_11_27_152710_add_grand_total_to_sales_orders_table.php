
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('sales_orders', 'grand_total')) {
            Schema::table('sales_orders', function (Blueprint $table) {
                $table->decimal('grand_total', 15, 2)
                    ->default(0)
                    ->after('subtotal');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('sales_orders', 'grand_total')) {
            Schema::table('sales_orders', function (Blueprint $table) {
                $table->dropColumn('grand_total');
            });
        }
    }
};
