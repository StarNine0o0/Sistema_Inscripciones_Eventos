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

    // Rutas exclusivas para la aplicación móvil (participantes)
    Route::post('/eventos/{evento}/inscribirse', [InscripcionController::class, 'inscribirseApp']);


});

/*rutas para el organizador e incripciones (estas ahorita no)
Route::middleware(['auth:sanctum', 'organizador'])->group(function () {
    Route::get('/eventos/{evento}/inscripciones', [InscripcionController::class, 'index']);
    Route::post('/eventos/{evento}/inscripciones', [InscripcionController::class, 'store']);
    Route::get('/eventos/{evento}/inscripciones/exportar', [InscripcionController::class, 'exportar']);
    Route::get('/eventos/{evento}/ocupacion', [InscripcionController::class, 'ocupacion']);
    Route::patch('/inscripciones/{inscripcion}/cancelar', [InscripcionController::class, 'cancelar']);
    Route::post('/inscripciones/checkin', [InscripcionController::class, 'checkin']);
}); */

