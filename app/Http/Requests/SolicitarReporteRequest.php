<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SolicitarReporteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tipo_reporte' => 'required|in:eventos_populares,tasa_asistencia,participacion_categoria,usuarios_activos,resumen_general',
            'formato'      => 'required|in:pdf,excel',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin'    => 'nullable|date|after_or_equal:fecha_inicio',
            'id_categoria' => 'nullable|integer|exists:categorias,id_categoria',
            'id_organizador' => 'nullable|integer|exists:usuarios,id_usuario',
        ];
    }
}