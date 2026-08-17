<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reporte</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #1f2937; }
        h1 { font-size: 18px; margin-bottom: 4px; }
        .subtitulo { color: #6b7280; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #e5e7eb; padding: 6px 8px; text-align: left; }
        th { background: #f3f4f6; }
        .resumen-caja { display: inline-block; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 20px; margin-right: 10px; text-align: center; }
        .resumen-numero { font-size: 22px; font-weight: bold; display: block; }
        .resumen-label { color: #6b7280; font-size: 11px; }
    </style>
</head>
<body>

    @php
        $titulos = [
            'eventos_populares' => 'Eventos Populares',
            'tasa_asistencia' => 'Tasa de Asistencia',
            'participacion_categoria' => 'Participación por Categoría',
            'usuarios_activos' => 'Usuarios más Activos',
            'resumen_general' => 'Resumen General',
        ];
    @endphp

    <h1>{{ $titulos[$tipoReporte] ?? $tipoReporte }}</h1>
    <p class="subtitulo">Generado el {{ now()->format('d/m/Y H:i') }}</p>

    @if($tipoReporte === 'resumen_general')
    @php
        $filasResumen = $datos instanceof \Illuminate\Support\Collection ? $datos->toArray() : (array) $datos;
        $resumen = $filasResumen[0] ?? [];
    @endphp
    <div>
        <div class="resumen-caja">
            <span class="resumen-numero">{{ $resumen['total_eventos_publicados'] ?? 0 }}</span>
            <span class="resumen-label">Eventos publicados</span>
        </div>
        <div class="resumen-caja">
            <span class="resumen-numero">{{ $resumen['total_inscripciones'] ?? 0 }}</span>
            <span class="resumen-label">Inscripciones</span>
        </div>
        <div class="resumen-caja">
            <span class="resumen-numero">{{ $resumen['total_constancias_emitidas'] ?? 0 }}</span>
            <span class="resumen-label">Constancias emitidas</span>
        </div>
    </div>

    @elseif($tipoReporte === 'eventos_populares')
        <table>
            <thead>
                <tr>
                    <th>Evento</th>
                    <th>Categoría</th>
                    <th>Organizador</th>
                    <th>Fecha inicio</th>
                    <th>Inscripciones</th>
                </tr>
            </thead>
            <tbody>
                @forelse($datos as $fila)
                    <tr>
                        <td>{{ $fila['nombre_evento'] ?? '' }}</td>
                        <td>{{ $fila['categoria'] ?? '' }}</td>
                        <td>{{ $fila['organizador'] ?? '' }}</td>
                        <td>{{ $fila['fecha_inicio'] ?? '' }}</td>
                        <td>{{ $fila['total_inscripciones'] ?? 0 }}</td>
                    </tr>
                @empty
                    <tr><td colspan="5">Sin datos disponibles.</td></tr>
                @endforelse
            </tbody>
        </table>

    @elseif($tipoReporte === 'tasa_asistencia')
        <table>
            <thead>
                <tr>
                    <th>Evento</th>
                    <th>Inscritos</th>
                    <th>Confirmados</th>
                    <th>Tasa de asistencia</th>
                </tr>
            </thead>
            <tbody>
                @forelse($datos as $fila)
                    <tr>
                        <td>{{ $fila['nombre_evento'] ?? '' }}</td>
                        <td>{{ $fila['total_inscritos'] ?? 0 }}</td>
                        <td>{{ $fila['total_confirmados'] ?? 0 }}</td>
                        <td>{{ number_format($fila['tasa_asistencia'] ?? 0, 2) }}%</td>
                    </tr>
                @empty
                    <tr><td colspan="4">Sin datos disponibles.</td></tr>
                @endforelse
            </tbody>
        </table>

    @elseif($tipoReporte === 'participacion_categoria')
        <table>
            <thead>
                <tr>
                    <th>Categoría</th>
                    <th>Eventos</th>
                    <th>Inscripciones</th>
                </tr>
            </thead>
            <tbody>
                @forelse($datos as $fila)
                    <tr>
                        <td>{{ $fila['nombre_categoria'] ?? '' }}</td>
                        <td>{{ $fila['total_eventos'] ?? 0 }}</td>
                        <td>{{ $fila['total_inscripciones'] ?? 0 }}</td>
                    </tr>
                @empty
                    <tr><td colspan="3">Sin datos disponibles.</td></tr>
                @endforelse
            </tbody>
        </table>

    @elseif($tipoReporte === 'usuarios_activos')
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Correo institucional</th>
                    <th>Inscripciones</th>
                </tr>
            </thead>
            <tbody>
                @forelse($datos as $fila)
                    <tr>
                        <td>{{ $fila['nombre_completo'] ?? '' }}</td>
                        <td>{{ $fila['correo_institucional'] ?? '' }}</td>
                        <td>{{ $fila['total_inscripciones'] ?? 0 }}</td>
                    </tr>
                @empty
                    <tr><td colspan="3">Sin datos disponibles.</td></tr>
                @endforelse
            </tbody>
        </table>

    @else
        <p>Tipo de reporte no reconocido: {{ $tipoReporte }}</p>
    @endif

</body>
</html>