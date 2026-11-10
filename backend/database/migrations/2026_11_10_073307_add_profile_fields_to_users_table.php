
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('no_telepon', 20)->nullable();
            $table->string('domisili')->nullable();
            $table->string('jabatan')->nullable();
            $table->string('cabang')->nullable();
            $table->string('atasan_langsung')->nullable();
            $table->timestamp('email_verified_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'no_telepon',
                'domisili',
                'jabatan',
                'cabang',
                'atasan_langsung',
                'email_verified_at',
            ]);
        });
    }
};
