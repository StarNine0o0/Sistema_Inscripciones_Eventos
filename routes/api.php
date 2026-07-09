<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UsuarioController;

// Rutas publicas 
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Rutas para cualquier usuario autenticado
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Rutas para el administrador
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // RUTA TEMPORAL PARA PRUEBAS (Se mudará a web.php después)
    // En routes/api.php, dentro del grupo 'auth:sanctum', 'admin'

    
});