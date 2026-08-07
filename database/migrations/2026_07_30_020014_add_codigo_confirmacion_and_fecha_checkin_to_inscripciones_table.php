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
         Schema::table('inscripciones', function (Blueprint $table) {
            $table->string('codigo_confirmacion', 10)->nullable()->unique()->after('id_evento');
            $table->dateTime('fecha_checkin')->nullable()->after('estado_asistencia');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
         Schema::table('inscripciones', function (Blueprint $table) {
            $table->dropColumn(['codigo_confirmacion', 'fecha_checkin']);
        });
    }
};
