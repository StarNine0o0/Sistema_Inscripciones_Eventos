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


Route::get('/login', function () {
    return Inertia::render('Login/Login');
})->name('login');

Route::middleware(['auth', 'role:administrador'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard/Dashboard', [
            'usuario' => auth()->user(),
        ]);
    })->name('dashboard');
});

Route::get('/', function () {
    if (auth()->check()) {
        return redirect('/dashboard');
    }
    return redirect('/login');
});

Route::post('/login', [AuthController::class, 'loginWeb']);

// Ruta para ver el formulario de "olvidé mi contraseña"
Route::get('/recuperar-password', [AuthController::class, 'showLinkRequestForm'])->name('password.request');
// Ruta para procesar el envío del correo
Route::post('/recuperar-password', [AuthController::class, 'sendResetLinkEmail'])->name('password.email');
// Ruta para mostrar el formulario donde escriben la nueva contraseña
Route::get('/reset-password/{token}', [AuthController::class, 'showResetForm'])->name('password.reset');
// Ruta para guardar la nueva contraseña
Route::post('/reset-password', [AuthController::class, 'reset'])->name('password.update');



Route::middleware(['auth','role:administrador'])->group(function () {

// rutas de usuarios
Route::get('/usuarios', [UsuarioController::class, 'index']);
Route::get('/usuarios/{usuario}', [UsuarioController::class, 'show']);
Route::put('/usuarios/{usuario}', [UsuarioController::class, 'update']);
Route::delete('/usuarios/{usuario}', [UsuarioController::class, 'destroy']);
Route::post('/usuarios', [UsuarioController::class, 'store']);
Route::put('/usuarios/{id}/restablecer-contrasena', [UsuarioController::class, 'restablecerContrasena']);



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

 //rutas de inscripciones para organizador
    Route::get('/eventos/{evento}/inscripciones', [InscripcionController::class, 'index']);
    Route::post('/eventos/{evento}/inscripciones', [InscripcionController::class, 'store']);
    Route::get('/eventos/{evento}/inscripciones/exportar', [InscripcionController::class, 'exportar']);
    Route::get('/eventos/{evento}/ocupacion', [InscripcionController::class, 'ocupacion']);
    Route::patch('/inscripciones/{inscripcion}/cancelar', [InscripcionController::class, 'cancelar']);
    Route::post('/inscripciones/checkin', [InscripcionController::class, 'checkin']);
});

Route::middleware(['auth', 'role:administrador'])->group(function () {
    Route::get('/reportes/resumen-general', [ReporteController::class, 'resumenGeneral']);
    Route::get('/reportes/eventos-populares', [ReporteController::class, 'eventosPopulares']);
    Route::get('/reportes/tasa-asistencia', [ReporteController::class, 'tasaAsistencia']);
    Route::get('/reportes/participacion-categoria', [ReporteController::class, 'participacionPorCategoria']);
    Route::get('/reportes/usuarios-activos', [ReporteController::class, 'usuariosMasActivos']);
    Route::post('/reportes/exportar', [ReporteController::class, 'solicitarExportacion']);
    Route::get('/reportes/{reporte}/estado', [ReporteController::class, 'estado']);
    Route::get('/reportes/{reporte}/descargar', [ReporteController::class, 'descargar']);
});