<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;


//ruta inertia par ael panel web de administracion de usuarios publica por ahora
Route::get('/usuarios/{usuario}', [UsuarioController::class, 'show']);
Route::put('/usuarios/{usuario}', [UsuarioController::class, 'update']);
Route::delete('/usuarios/{usuario}', [UsuarioController::class, 'destroy']);

//Aquí esta el auth esperando a que haya un Login en React para poder acceder a la ruta de perfil de usuario
// Route::middleware(['auth', 'admin'])->group(function () {
// });