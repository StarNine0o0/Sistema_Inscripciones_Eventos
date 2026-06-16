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
        Schema::create('eventos', function (Blueprint $table) {
        $table->id('id_evento');
        $table->unsignedBigInteger('id_organizador');
        $table->unsignedBigInteger('id_categoria');
        $table->string('nombre_evento');
        $table->text('descripcion');
        $table->dateTime('fecha_inicio');
        $table->dateTime('fecha_fin');
        $table->string('ubicacion');
        $table->integer('capacidad_maxima');
        $table->string('imagen_portada')->nullable();
        $table->string('estado_evento'); // Ej: Programado, En Curso, Cancelado
        $table->timestamps();

        // Declaración de Llaves Foráneas
        $table->foreign('id_organizador')->references('id_usuario')->on('usuarios');
        $table->foreign('id_categoria')->references('id_categoria')->on('categorias');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eventos');
    }
};
