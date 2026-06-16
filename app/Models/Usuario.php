<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';
    protected $fillable = [
        'nombre_completo',
        'correo_institucional',
        'contrasena',
        'matricula_empleado',
        'rol',
        'estado_cuenta',
        'foto_perfil'
    ];

    // Relación con eventos organizados
    public function eventosOrganizados()
    {
        return $this->hasMany(Evento::class, 'id_organizador');
    }

    // Relación con inscripciones como participante
    public function inscripciones()
    {
        return $this->hasMany(Inscripcion::class, 'id_participante');
    }
}
