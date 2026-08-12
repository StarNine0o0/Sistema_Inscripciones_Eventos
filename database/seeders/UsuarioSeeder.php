<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UsuarioSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('usuarios')->insert([
            [
                'id_rol' => 1,
                'nombre_completo' => 'Administrador',
                'correo_institucional' => 'admin@uni.edu.mx',
                'contrasena' => Hash::make('admin123'),
                'matricula_empleado' => 'ADMIN-001',
                'estado_usuario' => 'activo',
                'foto_perfil' => null,
            ],
             [
                'id_rol' => 1,
                'nombre_completo' => 'Organizador',
                'correo_institucional' => 'org@uni.edu.mx',
                'contrasena' => Hash::make('org123'),
                'matricula_empleado' => 'ORG-001',
                'estado_usuario' => 'activo',
                'foto_perfil' => null,
            ]
        ]);
    }
}
