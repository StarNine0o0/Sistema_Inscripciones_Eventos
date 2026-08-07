<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('usuarios')->updateOrInsert(
            ['correo_institucional' => 'admin@uni.edu.mx'],
            [
                'id_rol' => 1,
                'nombre_completo' => 'Administrador',
                'contrasena' => Hash::make('admin123'),
                'matricula_empleado' => 'ADMIN-001',
                'estado_usuario' => 'activo',
                'foto_perfil' => null,
            ]
        );

        DB::table('usuarios')->updateOrInsert(
            ['correo_institucional' => 'organi@uni.edu.mx'],
            [
                'id_rol' => 2,
                'nombre_completo' => 'Organizador',
                'contrasena' => Hash::make('org123'),
                'matricula_empleado' => 'ORGN-001',
                'estado_usuario' => 'activo',
                'foto_perfil' => null,
            ]
        );
    }
}