<?php

namespace App\Http\Controllers;

use App\Http\Requests\SolicitarReporteRequest;
use App\Jobs\GenerarReporteJob;
use App\Models\ReporteGenerado;
use App\Http\Controllers\Repositories\ReporteRepository;
use App\Services\ReporteService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReporteController extends Controller
{
    public function __construct(
        private ReporteService $reporteService,
        private ReporteRepository $reportes
    ) {
    }

    private function filtros(Request $request): array
    {
        return array_filter([
            'fecha_inicio'   => $request->query('fecha_inicio'),
            'fecha_fin'      => $request->query('fecha_fin'),
            'id_categoria'   => $request->query('id_categoria'),
            'id_organizador' => $request->query('id_organizador'),
        ], fn ($valor) => $valor !== null && $valor !== '');
    }

    public function eventosPopulares(Request $request)
    {
        $datos = $this->reporteService->eventosPopulares($this->filtros($request));
        return response()->json(['mensaje' => 'Reporte generado correctamente.', 'datos' => $datos]);
    }

    public function tasaAsistencia(Request $request)
    {
        $datos = $this->reporteService->tasaAsistencia($this->filtros($request));
        return response()->json(['mensaje' => 'Reporte generado correctamente.', 'datos' => $datos]);
    }

    public function participacionPorCategoria(Request $request)
    {
        $datos = $this->reporteService->participacionPorCategoria($this->filtros($request));
        return response()->json(['mensaje' => 'Reporte generado correctamente.', 'datos' => $datos]);
    }

    public function usuariosMasActivos(Request $request)
    {
        $datos = $this->reporteService->usuariosMasActivos($this->filtros($request));
        return response()->json(['mensaje' => 'Reporte generado correctamente.', 'datos' => $datos]);
    }

    public function resumenGeneral(Request $request)
    {
        $datos = $this->reporteService->resumenGeneral($this->filtros($request));
        return response()->json(['mensaje' => 'Reporte generado correctamente.', 'datos' => $datos]);
    }

    public function solicitarExportacion(SolicitarReporteRequest $request)
    {
        $reporte = $this->reportes->crear([
            'id_usuario_solicitante' => $request->user()->id_usuario,
            'tipo_reporte' => $request->tipo_reporte,
            'formato'      => $request->formato,
            'filtros'      => $this->filtros($request),
            'estado'       => 'Pendiente',
        ]);

        GenerarReporteJob::dispatch($reporte->id_reporte);//despacha el trabajo para generar el reporte en segundo plano, pasando el id del reporte como parámetro.

        return response()->json([
            'mensaje' => 'La generación del reporte fue encolada. Consulta su estado con el id_reporte.',
            'id_reporte' => $reporte->id_reporte,
            'estado' => $reporte->estado,
        ], 202);
    }

    public function estado(Request $request, ReporteGenerado $reporte)
    {
        return response()->json([
            'id_reporte'   => $reporte->id_reporte,
            'tipo_reporte' => $reporte->tipo_reporte,
            'formato'      => $reporte->formato,
            'estado'       => $reporte->estado,
            'mensaje_error'=> $reporte->mensaje_error,
            'listo_para_descargar' => $reporte->estado === 'Completado',
        ]);
    }

    public function descargar(Request $request, ReporteGenerado $reporte)
    {
        if ($reporte->estado !== 'Completado' || !$reporte->ruta_archivo) {
            return response()->json([
                'mensaje' => 'El reporte todavía no está listo para descargar. Estado actual: ' . $reporte->estado,
            ], 409);
        }

        if (!Storage::disk('local')->exists($reporte->ruta_archivo)) {
            return response()->json(['mensaje' => 'El archivo del reporte ya no existe.'], 404);
        }

        return Storage::disk('local')->download($reporte->ruta_archivo);
    }
}