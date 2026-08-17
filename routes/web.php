<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventosWebController;
use App\Http\Controllers\CategoriasWebController;
use App\Http\Controllers\SedesWebController;
use App\Http\Controllers\InscripcionController;
use App\Http\Controllers\ReporteController;

// Rutas públicas / Guest
Route::get('/login', function () {
    return Inertia::render('Login/Login');
})->name('login');

Route::post('/login', [AuthController::class, 'loginWeb']);

Route::get('/', function () {
    if (auth()->check()) {
        return redirect('/dashboard');
    }
    return redirect('/login');
});

// Recuperación de contraseña
Route::get('/recuperar-password', [AuthController::class, 'showLinkRequestForm'])->name('password.request');
Route::post('/recuperar-password', [AuthController::class, 'sendResetLinkEmail'])->name('password.email');
Route::get('/reset-password/{token}', [AuthController::class, 'showResetForm'])->name('password.reset');
Route::post('/reset-password', [AuthController::class, 'reset'])->name('password.update');

// --------------------------------------------------------------------------
// RUTAS PARA USUARIOS AUTENTICADOS (Cualquier rol)
// --------------------------------------------------------------------------
Route::middleware(['auth'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

// --------------------------------------------------------------------------
// RUTAS EXCLUSIVAS DE ADMINISTRADOR
// --------------------------------------------------------------------------
Route::middleware(['auth', 'role:administrador'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard/Dashboard', [
            'usuario' => auth()->user(),
        ]);
    })->name('dashboard');

    // Gestión de usuarios
    Route::get('/usuarios', [UsuarioController::class, 'index']);
    Route::put('/usuarios/{usuario}', [UsuarioController::class, 'update']);
    Route::put('/usuarios/{usuario}/estado', [UsuarioController::class, 'cambiarEstado']);
    Route::delete('/usuarios/{usuario}', [UsuarioController::class, 'destroy']);
    Route::post('/usuarios', [UsuarioController::class, 'store']);

    // Gestión de categorías
    Route::get('/categorias', [CategoriasWebController::class, 'index']);
    Route::post('/categorias', [CategoriasWebController::class, 'store']);
    Route::put('/categorias/{id}', [CategoriasWebController::class, 'update']);
    Route::delete('/categorias/{id}', [CategoriasWebController::class, 'destroy']);

    // Gestión de sedes
    Route::get('/sedes', [SedesWebController::class, 'index']);
    Route::post('/sedes', [SedesWebController::class, 'store']);
    Route::put('/sedes/{id}', [SedesWebController::class, 'update']);
    Route::delete('/sedes/{id}', [SedesWebController::class, 'destroy']);

    // Reportes
    Route::get('/reportes/resumen-general', [ReporteController::class, 'resumenGeneral']);
    Route::get('/reportes/eventos-populares', [ReporteController::class, 'eventosPopulares']);
    Route::get('/reportes/tasa-asistencia', [ReporteController::class, 'tasaAsistencia']);
    Route::get('/reportes/participacion-categoria', [ReporteController::class, 'participacionPorCategoria']);
    Route::get('/reportes/usuarios-activos', [ReporteController::class, 'usuariosMasActivos']);
    Route::post('/reportes/exportar', [ReporteController::class, 'solicitarExportacion']);
    Route::get('/reportes/{reporte}/estado', [ReporteController::class, 'estado']);
    Route::get('/reportes/{reporte}/descargar', [ReporteController::class, 'descargar']);
});

// --------------------------------------------------------------------------
// RUTAS EXCLUSIVAS DE ORGANIZADOR
// --------------------------------------------------------------------------
Route::middleware(['auth', 'role:organizador'])->group(function () {
    // Gestión de eventos
    Route::get('/eventos', [EventosWebController::class, 'index']);
    Route::post('/eventos', [EventosWebController::class, 'store']);
    Route::get('/eventos/{id}', [EventosWebController::class, 'show']);
    Route::put('/eventos/{id}', [EventosWebController::class, 'update']);
    Route::delete('/eventos/{id}', [EventosWebController::class, 'destroy']);
    Route::put('/eventos/{id}/estado', [EventosWebController::class, 'cambiarEstado']);

    // Gestión de inscripciones
    Route::get('/eventos/{evento}/inscripciones', [InscripcionController::class, 'index']);
    Route::post('/eventos/{evento}/inscripciones', [InscripcionController::class, 'store']);
    Route::get('/eventos/{evento}/inscripciones/exportar', [InscripcionController::class, 'exportar']);
    Route::get('/eventos/{evento}/ocupacion', [InscripcionController::class, 'ocupacion']);
    Route::patch('/inscripciones/{inscripcion}/cancelar', [InscripcionController::class, 'cancelar']);
    Route::post('/inscripciones/checkin', [InscripcionController::class, 'checkin']);
});