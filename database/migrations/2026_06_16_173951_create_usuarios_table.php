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
        Schema::create('usuarios', function (Blueprint $table) {
        $table->id('id_usuario');
        $table->unsignedBigInteger('id_rol');
        $table->string('nombre_completo');
        $table->string('correo_institucional')->unique();
        $table->string('contrasena'); 
        $table->string('matricula_empleado')->unique();
        $table->enum('estado_usuario', ['Activo', 'Inactivo'])->default('Activo');
        $table->string('foto_perfil')->nullable();
        $table->timestamps();

        // Declaración de Llaves Foráneas 
        $table->foreign('id_rol')->references('id_rol')->on('roles');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
