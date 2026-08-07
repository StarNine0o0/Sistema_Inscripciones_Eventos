<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventosWebController;
use App\Http\Controllers\CategoriasWebController;
use App\Http\Controllers\SedesWebController;


Route::get('/login', function () {
    return Inertia::render('Login');
})->name('login');


Route::post('/login', [AuthController::class, 'loginWeb']);




Route::middleware(['auth','role:administrador'])->group(function () {

// rutas de usuarios
Route::get('/usuarios', [UsuarioController::class, 'index']);
Route::get('/usuarios/{usuario}', [UsuarioController::class, 'show']);
Route::put('/usuarios/{usuario}', [UsuarioController::class, 'update']);
Route::delete('/usuarios/{usuario}', [UsuarioController::class, 'destroy']);


    // rutas de categorías
    Route::get('/categorias', [CategoriasWebController::class, 'index']);
    Route::post('/categorias', [CategoriasWebController::class, 'store']);
    Route::put('/categorias/{id}', [CategoriasWebController::class, 'update']);
    Route::delete('/categorias/{id}', [CategoriasWebController::class, 'destroy']);

    // rutas de sedes
    Route::get('/sedes', [SedesWebController::class, 'index']);
    Route::post('/sedes', [SedesWebController::class, 'store']);
    Route::put('/sedes/{id}', [SedesWebController::class, 'update']);
    Route::delete('/sedes/{id}', [SedesWebController::class, 'destroy']);
    



 });




 Route::middleware(['auth', 'role:organizador'])->group(function () {

//rutas de eventos 
Route::get('/eventos', [EventosWebController::class, 'index']);
    Route::post('/eventos', [EventosWebController::class, 'store']); // usar modal para crear evento
    Route::get('/eventos/{id}', [EventosWebController::class, 'show']);
    Route::put('/eventos/{id}', [EventosWebController::class, 'update']);// usar modal para editar evento
    Route::delete('/eventos/{id}', [EventosWebController::class, 'destroy']);
    Route::put('/eventos/{id}/estado', [EventosWebController::class, 'cambiarEstado']);

 

 });
