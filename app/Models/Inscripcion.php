<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Inscripcion extends Model
{

     use HasFactory;
    protected $table = 'inscripciones';
    protected $primaryKey = 'id_inscripcion';
    protected $fillable = [
        'id_evento',
        'id_participante',
        'codigo_confirmacion',
        'fecha_inscripcion',
        'estado_inscripcion',
        'estado_asistencia',
        'fecha_checkin',
    ];


    protected $casts = [
        'fecha_inscripcion' => 'datetime',
        'fecha_checkin'     => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Inscripcion $inscripcion) {
            if (empty($inscripcion->codigo_confirmacion)) {
                do {
                    $codigo = strtoupper(Str::random(8));
                } while (self::where('codigo_confirmacion', $codigo)->exists());

                $inscripcion->codigo_confirmacion = $codigo;
            }
        });
    }

    // Relación con el evento, una inscripción pertenece a un evento
    public function evento()
    {
        return $this->belongsTo(Evento::class, 'id_evento', 'id_evento');
    }

    // Relación con el participante, una inscripción pertenece a un participante
    public function participante()
    {
        return $this->belongsTo(Usuario::class, 'id_participante', 'id_usuario');
    }

    // Relación con la constancia, una inscripción puede tener una constancia
    public function constancia()
    {
        return $this->hasOne(Constancia::class, 'id_inscripcion', 'id_inscripcion');
    }   

}
