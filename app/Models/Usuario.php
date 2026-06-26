<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';
    protected $fillable = [
        'id_rol',
        'nombre_completo',
        'correo_institucional',
        'contrasena',
        'matricula_empleado',
        'estado_usuario',
        'foto_perfil'
    ];

    protected $hidden = [
        'contrasena',
    ];


    // Relación con eventos organizados , un organizador puede tener muchos eventos
    public function eventosOrganizados()
    {
        return $this->hasMany(Evento::class, 'id_organizador', 'id_usuario');
    }

    // Relación con inscripciones como participante, un participante puede tener muchas inscripciones
    public function inscripciones()
    {
        return $this->hasMany(Inscripcion::class, 'id_participante', 'id_usuario');
    }

    // Relación con el rol, un usuario pertenece a un rol
    public function rol()
    {
        return $this->belongsTo(Rol::class, 'id_rol', 'id_rol');
    }   
}
