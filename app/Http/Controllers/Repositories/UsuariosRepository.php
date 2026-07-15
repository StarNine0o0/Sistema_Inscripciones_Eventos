<?php

namespace App\Http\Controllers\Repositories;

use App\Models\Usuario;

class UsuariosRepository
{
    public function obtenerUsuarios()
    {
        try {
            $usuarios = Usuario::all();
            return [
                "mensaje" => "Usuarios obtenidos correctamente",
                "usuarios" => $usuarios
            ];
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los usuarios: ' . $e->getMessage()], 500);
        }
    }

    public function registrarUsuario(array $data)
    {
        try {
            $usuario = Usuario::create([
                'nombre_completo'      => $data['nombre_completo'],
                'correo_institucional' => $data['correo_institucional'],
                'matricula_empleado'   => $data['matricula_empleado'],
                'contrasena'           => bcrypt($data['contrasena']),
                'id_rol'               => $data['id_rol'],
                'estado_usuario'       => 'Activo'
            ]);

            return $usuario;
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al registrar el usuario: ' . $e->getMessage()], 500);
        }
    }

    public function obtenerUsuario(int $id)
    {
        try {
            // Buscamos al usuario y cargamos sus relaciones de una vez
            $usuario = Usuario::with(['inscripciones', 'eventosOrganizados'])->find($id);
            
            if (!$usuario) {
                return response()->json(['error' => 'Usuario no encontrado'], 404);
            }
            
            return [
                "mensaje" => "Usuario obtenido correctamente",
                "usuario" => $usuario
            ];
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener el usuario: ' . $e->getMessage()], 500);
        }
    }

    public function actualizarUsuario(int $id, array $data)
    {
        try {
            $usuario = $this->obtenerUsuario($id)['usuario'];
            
            $usuario->update([
                'nombre_completo'      => $data['nombre_completo'] ?? $usuario->nombre_completo,
                'correo_institucional' => $data['correo_institucional'] ?? $usuario->correo_institucional,
                'matricula_empleado'   => $data['matricula_empleado'] ?? $usuario->matricula_empleado,
                'id_rol'               => $data['id_rol'] ?? $usuario->id_rol
            ]);

            return [
                "mensaje" => "Usuario actualizado correctamente",
                "usuario" => $usuario
            ];
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar el usuario: ' . $e->getMessage()], 500);
        }
    }

    public function eliminarUsuario(int $id)
    {
        try {
            $usuario = $this->obtenerUsuario($id)['usuario'];
            
            // Hacemos el "Soft Delete"
            $usuario->update([
                'estado_usuario' => 'Inactivo'
            ]);

            return [
                "mensaje" => "Usuario desactivado correctamente"
            ];
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al desactivar el usuario: ' . $e->getMessage()], 500);
        }
    }
}