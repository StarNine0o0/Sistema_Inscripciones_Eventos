<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SedeSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('sedes')->insert([
            ['nombre_sede' => 'Auditorio Principal', 'capacidad_sede' => 200],
            ['nombre_sede' => 'Sala Audivisual', 'capacidad_sede' => 150],
            ['nombre_sede' => 'Laboratorio de Computo A', 'capacidad_sede' => 150],
            ['nombre_sede' => 'Explanada', 'capacidad_sede' => 100],
        ]);
    }
}
