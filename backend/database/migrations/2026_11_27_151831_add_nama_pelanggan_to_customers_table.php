
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('customers', 'nama_pelanggan')) {
            Schema::table('customers', function (Blueprint $table) {
                $table->string('nama_pelanggan')
                    ->nullable()
                    ->after('kode_pelanggan');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('customers', 'nama_pelanggan')) {
            Schema::table('customers', function (Blueprint $table) {
                $table->dropColumn('nama_pelanggan');
            });
        }
    }
};
