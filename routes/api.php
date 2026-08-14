<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\InscripcionController;

use App\Http\Controllers\EventosApiController;



// Rutas publicas 
Route::post('/login', [AuthController::class, 'loginApi']);
Route::post('/register', [AuthController::class, 'register']);

// Rutas para cualquier usuario autenticado
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/eventos', [EventosApiController::class, 'index']);
    Route::get('/eventos/{id}', [EventosApiController::class, 'show']);

    // Rutas exclusivas para la aplicacin móvil 
    Route::post('/eventos/{evento}/inscribirse', [InscripcionController::class, 'inscribirseApp']);

    // Botón de cancelar inscripcionn desde la app
    Route::patch('/inscripciones/{inscripcion}/cancelar', [InscripcionController::class, 'cancelarApp']);


});



