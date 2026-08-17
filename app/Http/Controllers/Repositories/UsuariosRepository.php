<?php

namespace App\Http\Controllers\Repositories;

use App\Models\Usuario;

class UsuariosRepository
{
    public function obtenerUsuarios(array $filtros = [])
    {
        try {
            $query = Usuario::query();

            //  Filtro de búsqueda (por nombre o correo)
            if (isset($filtros['busqueda'])) {
                $termino = $filtros['busqueda'];
            
                //usamos la funcion de interna de lavrel para buscar en la consulta la haga en ambas columnas alavez y que el orwhere no choque con rol 
                $query->where(function ($q) use ($termino) {
                    $q->where('nombre_completo', 'like', '%' . $termino . '%')
                    ->orWhere('correo_institucional', 'like', '%' . $termino . '%');
                });
            }

            // Filtro por Rol
            if (isset($filtros['id_rol'])) {
                $query->where('id_rol', $filtros['id_rol']);
            }

            //  Filtro por Estado
            if (isset($filtros['estado_usuario'])) {
                $query->where('estado_usuario', $filtros['estado_usuario']);
            }
            
            $usuarios = $query->with('rol')->paginate(10);
            return [
                "mensaje" => "Usuarios obtenidos correctamente",
                "usuarios" => $usuarios
            ];
        } catch (\Exception $e) {
            throw new \Exception('Error al obtener los usuarios: ' . $e->getMessage(), 500);
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
            $codigo = $e->getCode() ?: 500;
            throw new \Exception($e->getMessage(), $codigo);
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

   public function cambiarEstado(int $id, string $nuevoEstado)
    {
        try {
            
            $usuario = $this->obtenerUsuario($id)['usuario'];
            
            // validamsos que no tenga un evento activo o publicado
            if ($nuevoEstado === 'Inactivo') {
                
                $tieneEventosActivos = $usuario->eventosOrganizados()
                    ->whereIn('estado_evento', ['Activo', 'Publicado'])
                    ->exists();

                if ($tieneEventosActivos) {
                    throw new \Exception('No se puede desactivar la cuenta: el usuario tiene eventos publicados o activos como organizador.', 422);
                }
            }

            $usuario->update([
                'estado_usuario' => $nuevoEstado
            ]);

            return [
                "mensaje" => "El estado del usuario ha cambiado a " . $nuevoEstado
            ];
        } catch (\Exception $e) {
            $codigo = $e->getCode() ?: 500;
            throw new \Exception($e->getMessage(), $codigo);
        }
    }

    public function restablecerContrasena(int $id, string $nuevaContrasena)
{
    try {
        $usuario = $this->obtenerUsuario($id)['usuario'];

        $usuario->update([
            'contrasena' => bcrypt($nuevaContrasena)
        ]);

        return [
            "mensaje" => "Contraseña restablecida correctamente"
        ];
    } catch (\Exception $e) {
        $codigo = $e->getCode() ?: 500;
        throw new \Exception('Error al restablecer contraseña: ' . $e->getMessage(), $codigo);
    }
}






}