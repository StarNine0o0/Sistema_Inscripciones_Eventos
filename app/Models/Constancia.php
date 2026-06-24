<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Constancia extends Model
{
    protected $table = 'constancias';
    protected $primaryKey = 'id_constancia';
    protected $fillable = ['id_inscripcion', 'folio_generado', 'fecha_emision'];

    public function inscripcion() {
        return $this->belongsTo(Inscripcion::class, 'id_inscripcion', 'id_inscripcion');
    }
}
