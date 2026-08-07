<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UsuarioController;
<<<<<<< HEAD
use App\Http\Controllers\EventosApiController;
=======
use App\Http\Controllers\InscripcionController;
>>>>>>> feature/modulo4-Gestion-Inscripciones

// Rutas publicas 
Route::post('/login', [AuthController::class, 'loginApi']);
Route::post('/register', [AuthController::class, 'register']);

// Rutas para cualquier usuario autenticado
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/eventos', [EventosApiController::class, 'index']);
    Route::get('/eventos/{id}', [EventosApiController::class, 'show']);


});
<<<<<<< HEAD
=======

// Rutas para el administrador
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // RUTA TEMPORAL PARA PRUEBAS (Se mudará a web.php después)
    // En routes/api.php, dentro del grupo 'auth:sanctum', 'admin'    
});

//rutas para el organizador e inscripciones
Route::middleware(['auth:sanctum', 'organizador'])->group(function () {
    Route::get('/eventos/{evento}/inscripciones', [InscripcionController::class, 'index']);
    Route::post('/eventos/{evento}/inscripciones', [InscripcionController::class, 'store']);
    Route::get('/eventos/{evento}/inscripciones/exportar', [InscripcionController::class, 'exportar']);
    Route::get('/eventos/{evento}/ocupacion', [InscripcionController::class, 'ocupacion']);
    Route::patch('/inscripciones/{inscripcion}/cancelar', [InscripcionController::class, 'cancelar']);
    Route::post('/inscripciones/checkin', [InscripcionController::class, 'checkin']);
});
>>>>>>> feature/modulo4-Gestion-Inscripciones
