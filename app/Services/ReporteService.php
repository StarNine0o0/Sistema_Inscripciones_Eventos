<?php

namespace App\Services;

use App\Models\Categoria;
use App\Models\Constancia;
use App\Models\Evento;
use App\Models\Inscripcion;
use App\Models\Usuario;
use Illuminate\Support\Collection;

class ReporteService
{
    private function aplicarFiltrosEvento($query, array $filtros)
    {
        if (!empty($filtros['fecha_inicio'])) {
            $query->whereDate('fecha_inicio', '>=', $filtros['fecha_inicio']);
        }
        if (!empty($filtros['fecha_fin'])) {
            $query->whereDate('fecha_fin', '<=', $filtros['fecha_fin']);
        }
        if (!empty($filtros['id_categoria'])) {
            $query->where('id_categoria', $filtros['id_categoria']);
        }
        if (!empty($filtros['id_organizador'])) {
            $query->where('id_organizador', $filtros['id_organizador']);
        }

        return $query;
    }

    public function eventosPopulares(array $filtros, int $limite = 10): Collection
    {
        $query = Evento::query()
            ->withCount(['inscripciones' => function ($q) {
                $q->where('estado_inscripcion', 'Activa');
            }])
            ->with(['categoria:id_categoria,nombre_categoria', 'organizador:id_usuario,nombre_completo']);

        $query = $this->aplicarFiltrosEvento($query, $filtros);

        return $query->orderByDesc('inscripciones_count')
            ->limit($limite)
            ->get()
            ->map(fn (Evento $e) => [
                'id_evento'          => $e->id_evento,
                'nombre_evento'      => $e->nombre_evento,
                'categoria'          => $e->categoria->nombre_categoria ?? null,
                'organizador'        => $e->organizador->nombre_completo ?? null,
                'fecha_inicio'       => $e->fecha_inicio,
                'total_inscripciones'=> $e->inscripciones_count,
            ]);
    }

    public function tasaAsistencia(array $filtros): Collection
    {
        $query = Evento::query()
            ->withCount([
                'inscripciones as total_inscritos' => function ($q) {
                    $q->where('estado_inscripcion', 'Activa');
                },
                'inscripciones as total_confirmados' => function ($q) {
                    $q->where('estado_inscripcion', 'Activa')
                      ->where('estado_asistencia', 'Confirmada');
                },
            ]);

        $query = $this->aplicarFiltrosEvento($query, $filtros);

        return $query->get()->map(function (Evento $e) {
            $tasa = $e->total_inscritos > 0
                ? round(($e->total_confirmados / $e->total_inscritos) * 100, 2)
                : 0;

            return [
                'id_evento'         => $e->id_evento,
                'nombre_evento'     => $e->nombre_evento,
                'total_inscritos'   => $e->total_inscritos,
                'total_confirmados' => $e->total_confirmados,
                'tasa_asistencia'   => $tasa,
            ];
        });
    }

    public function participacionPorCategoria(array $filtros): Collection
    {
        $eventosQuery = Evento::query();
        $eventosQuery = $this->aplicarFiltrosEvento($eventosQuery, $filtros);
        $idsEventosFiltrados = $eventosQuery->pluck('id_evento');

        return Categoria::query()
            ->withCount(['eventos' => function ($q) use ($idsEventosFiltrados) {
                $q->whereIn('id_evento', $idsEventosFiltrados);
            }])
            ->with(['eventos' => function ($q) use ($idsEventosFiltrados) {
                $q->whereIn('id_evento', $idsEventosFiltrados)
                  ->withCount(['inscripciones' => fn ($qi) => $qi->where('estado_inscripcion', 'Activa')]);
            }])
            ->get()
            ->map(function (Categoria $c) {
                return [
                    'id_categoria'         => $c->id_categoria,
                    'nombre_categoria'     => $c->nombre_categoria,
                    'total_eventos'        => $c->eventos_count,
                    'total_inscripciones'  => $c->eventos->sum('inscripciones_count'),
                ];
            });
    }

  public function usuariosMasActivos(array $filtros, int $limite = 10): Collection
    {
        $idsEventosFiltrados = $this->aplicarFiltrosEvento(Evento::query(), $filtros)->pluck('id_evento');

        return Usuario::query()
            ->where('id_rol', 3) // Participante
            ->withCount(['inscripciones' => function ($q) use ($idsEventosFiltrados) {
                $q->where('estado_inscripcion', 'Activa')
                  ->whereIn('id_evento', $idsEventosFiltrados);
            }])
            ->get()
            ->filter(fn (Usuario $u) => $u->inscripciones_count > 0)
            ->sortByDesc('inscripciones_count')
            ->take($limite)
            ->values()
            ->map(fn (Usuario $u) => [
                'id_usuario'          => $u->id_usuario,
                'nombre_completo'     => $u->nombre_completo,
                'correo_institucional'=> $u->correo_institucional,
                'total_inscripciones' => $u->inscripciones_count,
            ]);
    }

    public function resumenGeneral(array $filtros): array
    {
        $eventosQuery = $this->aplicarFiltrosEvento(Evento::query(), $filtros);
        $idsEventosFiltrados = (clone $eventosQuery)->pluck('id_evento');

        $totalEventosPublicados = (clone $eventosQuery)
            ->where('estado_evento', '!=', 'Cancelado')
            ->count();

        $totalInscripciones = Inscripcion::whereIn('id_evento', $idsEventosFiltrados)
            ->where('estado_inscripcion', 'Activa')
            ->count();

        $totalConstancias = Constancia::whereHas('inscripcion', function ($q) use ($idsEventosFiltrados) {
            $q->whereIn('id_evento', $idsEventosFiltrados);
        })->count();

        return [
            'total_eventos_publicados' => $totalEventosPublicados,
            'total_inscripciones'      => $totalInscripciones,
            'total_constancias_emitidas' => $totalConstancias,
        ];
    }

    public function generarPorTipo(string $tipo, array $filtros)
    {
        return match ($tipo) {
            'eventos_populares'      => $this->eventosPopulares($filtros, 50),
            'tasa_asistencia'        => $this->tasaAsistencia($filtros),
            'participacion_categoria'=> $this->participacionPorCategoria($filtros),
            'usuarios_activos'       => $this->usuariosMasActivos($filtros, 50),
            'resumen_general'        => collect([$this->resumenGeneral($filtros)]),
            default => throw new \InvalidArgumentException("Tipo de reporte no válido: {$tipo}"),
        };
    }
}