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
          Schema::create('reportes_generados', function (Blueprint $table) {
            $table->id('id_reporte');
            $table->unsignedBigInteger('id_usuario_solicitante');
            $table->string('tipo_reporte', 50);
            $table->enum('formato', ['pdf', 'excel'])->default('excel');
            $table->json('filtros')->nullable();
            $table->enum('estado', ['Pendiente', 'Procesando', 'Completado', 'Fallido'])->default('Pendiente');
            $table->string('ruta_archivo')->nullable();
            $table->text('mensaje_error')->nullable();
            $table->timestamps();

            $table->foreign('id_usuario_solicitante')->references('id_usuario')->on('usuarios');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reportes_generados');
    }
};
