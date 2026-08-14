<?php

namespace App\Http\Controllers\Repositories;

use App\Models\ReporteGenerado;

class ReporteRepository
{
    public function crear(array $datos): ReporteGenerado
    {
        return ReporteGenerado::create($datos);
    }

    public function buscarPorId(int $id): ?ReporteGenerado
    {
        return ReporteGenerado::find($id);
    }

    public function marcarProcesando(ReporteGenerado $reporte): void
    {
        $reporte->update(['estado' => 'Procesando']);
    }

    public function marcarCompletado(ReporteGenerado $reporte, string $rutaArchivo): void
    {
        $reporte->update([
            'estado'       => 'Completado',
            'ruta_archivo' => $rutaArchivo,
        ]);
    }

    public function marcarFallido(ReporteGenerado $reporte, string $mensajeError): void
    {
        $reporte->update([
            'estado'        => 'Fallido',
            'mensaje_error' => $mensajeError,
        ]);
    }
}