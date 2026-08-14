<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReporteGenerado extends Model
{
    //
      protected $table = 'reportes_generados';
    protected $primaryKey = 'id_reporte';
    protected $fillable = [
        'id_usuario_solicitante',
        'tipo_reporte',
        'formato',
        'filtros',
        'estado',
        'ruta_archivo',
        'mensaje_error',
    ];

    protected $casts = [
        'filtros' => 'array',
    ];

    public function solicitante()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario_solicitante', 'id_usuario');
    }
}