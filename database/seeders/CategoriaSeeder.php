<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('categorias')->insert([
            ['nombre_categoria' => 'Taller'],
            ['nombre_categoria' => 'Conferencia'],
            ['nombre_categoria' => 'Seminario'],
            ['nombre_categoria' => 'Curso'],
            ['nombre_categoria' => 'Competencia'],
        ]);
    }
}
