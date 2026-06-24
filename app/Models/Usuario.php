<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuario';
    protected $fillable = [
        'id_rol',
        'nombre_completo',
        'correo_institucional',
        'contrasena',
        'matricula_empleado',
        'rol',
        'estado_cuenta',
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
