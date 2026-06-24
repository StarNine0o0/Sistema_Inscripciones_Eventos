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
        Schema::create('inscripciones', function (Blueprint $table) {
        $table->id('id_inscripcion');
        $table->unsignedBigInteger('id_participante');
        $table->unsignedBigInteger('id_evento');
        $table->dateTime('fecha_inscripcion')->useCurrent();
        $table->enum('estado_inscripcion', ['Activa', 'Cancelada'])->default('Activa');
        $table->enum('estado_asistencia', ['Confirmada', 'Ausente', 'Pendiente'])->default('Pendiente');
        $table->timestamps();

        // Declaración de Llaves Foráneas
        $table->foreign('id_participante')->references('id_usuario')->on('usuarios');
        $table->foreign('id_evento')->references('id_evento')->on('eventos');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscripcions');
    }
};
