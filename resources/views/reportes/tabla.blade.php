<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reporte: {{ $tipoReporte }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        h1 { font-size: 16px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #999; padding: 6px 8px; text-align: left; }
        th { background-color: #eee; }
    </style>
</head>
<body>
    <h1>Reporte: {{ str_replace('_', ' ', ucfirst($tipoReporte)) }}</h1>
    <p>Generado el {{ now()->format('d/m/Y H:i') }}</p>

    @if (count($datos) > 0)
        <table>
            <thead>
                <tr>
                    @foreach (array_keys($datos->first()) as $columna)
                        <th>{{ str_replace('_', ' ', ucfirst($columna)) }}</th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @foreach ($datos as $fila)
                    <tr>
                        @foreach ($fila as $valor)
                            <td>{{ $valor }}</td>
                        @endforeach
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p>No hay datos para los filtros seleccionados.</p>
    @endif
</body>
</html>