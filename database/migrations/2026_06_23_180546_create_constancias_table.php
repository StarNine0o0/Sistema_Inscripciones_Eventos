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
        Schema::create('constancias', function (Blueprint $table) {
            $table->id('id_constancia');
            $table->unsignedBigInteger('id_inscripcion');
            $table->string('folio_generado')->unique();
            $table->dateTime('fecha_emision')->useCurrent();
            $table->timestamps();

            $table->foreign('id_inscripcion')->references('id_inscripcion')->on('inscripciones');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('constancias');
    }
};
