<?php

namespace Database\Seeders;

use App\Models\Evento;
use App\Models\Usuario;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class InscModulo4Seeder extends Seeder
{
    public function run(): void
    {
        // 1) Organizador de prueba
        $organizador = Usuario::firstOrCreate(
            ['correo_institucional' => 'organizador@uni.edu.mx'],
            [
                'id_rol' => 2, // Organizador
                'nombre_completo' => 'Organizador de Prueba',
                'contrasena' => Hash::make('organizador123'),
                'matricula_empleado' => 'ORG-001',
                'estado_usuario' => 'Activo',
            ]
        );

        // 2) Evento que ocurre HOY (para poder probar el check-in) con cupo pequeño
        $evento = Evento::firstOrCreate(
            ['nombre_evento' => 'Evento Demo Módulo 4'],
            [
                'id_organizador' => $organizador->id_usuario,
                'id_categoria' => 1,
                'id_sede' => 1,
                'descripcion' => 'Evento de prueba para verificar el módulo de inscripciones.',
                'fecha_inicio' => now()->startOfDay(),
                'fecha_fin' => now()->endOfDay(),
                'capacidad_maxima' => 2, // pequeño a propósito, para probar "cupo lleno"
                'estado_evento' => 'En Curso',
            ]
        );

        // 3) Tres participantes de prueba (uno de más, para probar el cupo lleno)
        $participantes = [
            ['correo' => 'participante1@uni.edu.mx', 'nombre' => 'Participante Uno', 'matricula' => 'PART-001'],
            ['correo' => 'participante2@uni.edu.mx', 'nombre' => 'Participante Dos', 'matricula' => 'PART-002'],
            ['correo' => 'participante3@uni.edu.mx', 'nombre' => 'Participante Tres', 'matricula' => 'PART-003'],
        ];

        foreach ($participantes as $p) {
            Usuario::firstOrCreate(
                ['correo_institucional' => $p['correo']],
                [
                    'id_rol' => 3, // Participante
                    'nombre_completo' => $p['nombre'],
                    'contrasena' => Hash::make('participante123'),
                    'matricula_empleado' => $p['matricula'],
                    'estado_usuario' => 'Activo',
                ]
            );
        }

        $this->command->info('Datos de prueba del Módulo 4 creados:');
        $this->command->info('  Organizador -> organizador@uni.edu.mx / organizador123');
        $this->command->info('  Participantes -> participante1@uni.edu.mx / participante123 (y 2, 3)');
        $this->command->info('  Evento -> "Evento Demo Módulo 4" (id_evento: ' . $evento->id_evento . '), cupo_maximo=2, hoy');
    }
}