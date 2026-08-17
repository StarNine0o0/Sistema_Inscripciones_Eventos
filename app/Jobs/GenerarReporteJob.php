<?php

namespace App\Jobs;

use App\Http\Controllers\Repositories\ReporteRepository;
use App\Services\ReporteService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;


class GenerarReporteJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;

    public function __construct(private int $idReporte)
    {
    }

public function handle(ReporteService $service, ReporteRepository $reportes): void
    {
        $reporte = $reportes->buscarPorId($this->idReporte);

        if (!$reporte) {
            return;
        }

        //Iniciar sesion temporalmente en el trabajador
        Auth::loginUsingId($reporte->id_usuario_solicitante);

        $reportes->marcarProcesando($reporte);

        try {
            $datos = $service->generarPorTipo($reporte->tipo_reporte, $reporte->filtros ?? []);

            $nombreArchivo = $reporte->tipo_reporte . '_' . $reporte->id_reporte . '_' . now()->format('Ymd_His');

            $ruta = $reporte->formato === 'pdf'
                ? $this->generarPdf($nombreArchivo, $reporte->tipo_reporte, $datos)
                : $this->generarExcel($nombreArchivo, $datos);

            $reportes->marcarCompletado($reporte, $ruta);
        } catch (\Throwable $e) {
            $reportes->marcarFallido($reporte, $e->getMessage());
        }
    }

    private function generarPdf(string $nombreArchivo, string $tipoReporte, $datos): string
    {
        $ruta = 'reportes/' . $nombreArchivo . '.pdf';

        $pdf = Pdf::loadView('reportes.tabla', [
            'tipoReporte' => $tipoReporte,
            'datos'       => $datos,
        ]);

        Storage::disk('local')->put($ruta, $pdf->output());

        return $ruta;
    }

    private function generarExcel(string $nombreArchivo, $datos): string
    {
        $ruta = 'reportes/' . $nombreArchivo . '.csv';

        $filas = $datos instanceof \Illuminate\Support\Collection ? $datos->toArray() : (array) $datos;

        $csv = fopen('php://temp', 'w+');
        fwrite($csv, "\xEF\xBB\xBF");

        if (!empty($filas)) {
            fputcsv($csv, array_keys($filas[0]));
            foreach ($filas as $fila) {
                fputcsv($csv, $fila);
            }
        }

        rewind($csv);
        $contenido = stream_get_contents($csv);
        fclose($csv);

        Storage::disk('local')->put($ruta, $contenido);

        return $ruta;
    }
}