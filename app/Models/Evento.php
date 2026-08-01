<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    protected $table = 'eventos';
    protected $primaryKey = 'id_evento';
    protected $fillable = [
        'id_organizador',
        'id_categoria',
        'id_sede',
        'nombre_evento',
        'descripcion',
        'fecha_inicio',
        'fecha_fin',
        'capacidad_maxima',
        'imagen_portada',
        'estado_evento',
    ];

    protected $casts = [
        'fecha_inicio' => 'datetime',
        'fecha_fin'    => 'datetime',
    ];


    // Relación con la categoría, un evento pertenece a una categoría
    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'id_categoria', 'id_categoria');
    }

    // Relación con el organizador, un evento pertenece a un organizador
    public function organizador()
    {
        return $this->belongsTo(Usuario::class, 'id_organizador', 'id_usuario');
    }

    // Relación con inscripciones, un evento puede tener muchas inscripciones
    public function inscripciones()
    {
        return $this->hasMany(Inscripcion::class, 'id_evento', 'id_evento');
    }

    // Relación con la sede, un evento pertenece a una sede
    public function sede()
    {
        return $this->belongsTo(Sede::class, 'id_sede', 'id_sede');
    }


    // Cuenta solo las inscripciones activas (no canceladas) del evento
    public function inscritosActivos()
    {
        return $this->inscripciones()->where('estado_inscripcion', 'Activa')->count();
    }

    // Indica si el evento alcanzó su capacidad máxima
    public function cupoLleno(): bool
    {
        return $this->inscritosActivos() >= $this->capacidad_maxima;
    }

    // Indica si la fecha actual está dentro del rango del evento (fecha_inicio - fecha_fin)
    public function esFechaDelEvento(): bool
    {
        $hoy = now()->toDateString();
        return $hoy >= $this->fecha_inicio->toDateString()
            && $hoy <= $this->fecha_fin->toDateString();
    }
}
