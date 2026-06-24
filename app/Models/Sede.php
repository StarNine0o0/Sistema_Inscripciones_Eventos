<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sede extends Model
{
    protected $table = 'sedes';
    protected $primaryKey = 'id_sede';
    protected $fillable = ['nombre_sede', 'capacidad_sede'];

    public function eventos(){
        return $this->hasMany(Evento::class, 'id_sede', 'id_sede');
    }
}
