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
        $table->unsignedBigInteger('id_sede');
        $table->string('nombre_evento');
        $table->text('descripcion');
        $table->dateTime('fecha_inicio');
        $table->dateTime('fecha_fin');
        $table->integer('capacidad_maxima');
        $table->string('imagen_portada')->nullable();
        $table->enum('estado_evento', ['Programado', 'En Curso', 'Cancelado', 'Finalizado'])->default('Programado'); 
        $table->timestamps();

        // Declaración de Llaves Foráneas
        $table->foreign('id_organizador')->references('id_usuario')->on('usuarios');
        $table->foreign('id_categoria')->references('id_categoria')->on('categorias');
        $table->foreign('id_sede')->references('id_sede')->on('sedes');
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
