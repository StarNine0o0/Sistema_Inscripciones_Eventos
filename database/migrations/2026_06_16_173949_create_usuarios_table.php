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
        $table->string('nombre_completo');
        $table->string('correo_institucional')->unique();
        $table->string('contrasena'); 
        $table->string('matricula_empleado')->unique();
        $table->string('rol'); // Ej: Administrador, Organizador, Participante
        $table->boolean('estado_cuenta')->default(true);
        $table->string('foto_perfil')->nullable();
        $table->timestamps();
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
