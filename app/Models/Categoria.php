<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    use HasFactory;
    protected $table = 'categorias';
    protected $primaryKey = 'id_categoria';
    protected $fillable = [
        'nombre_categoria',
        
    ];

    // Relación con eventos, una categoría puede tener muchos eventos
    public function eventos()
    {
        return $this->hasMany(Evento::class, 'id_categoria', 'id_categoria');
    }
}
