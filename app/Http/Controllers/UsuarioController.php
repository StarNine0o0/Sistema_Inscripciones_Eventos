<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Repositories\UsuariosRepository;
use App\Http\Requests\StoreUsuarioRequest;
use App\Http\Requests\UpdateUsuarioRequest;
use Inertia\Inertia;

class UsuarioController extends Controller
{
    private $usuariosRepository;

    public function __construct(UsuariosRepository $usuariosRepository)
    {
        $this->usuariosRepository = $usuariosRepository;
    }

    public function index()
    {
        try {
            $resultado = $this->usuariosRepository->obtenerUsuarios();
            return response()->json($resultado, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener usuarios: ' . $e->getMessage()], 500);
        }
    }

    public function store(StoreUsuarioRequest $request)
    {
        try {
            $usuario = $this->usuariosRepository->registrarUsuario($request->all());
            return response()->json($usuario, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al registrar: ' . $e->getMessage()], 500);
        }
    }

    // Adaptado para devolver la vista de Inertia usando el repositorio
    public function show(int $id)
    {
        try {
            $resultado = $this->usuariosRepository->obtenerUsuario($id);
            
            // Si el repositorio devolbió un error JSON (ej. 404 no encontrado)
            if ($resultado instanceof \Illuminate\Http\JsonResponse) {
                return $resultado;
            }

            return Inertia::render('Usuarios/Perfil', [
                'usuario_perfil' => $resultado['usuario']
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al mostrar el perfil: ' . $e->getMessage()], 500);
        }
    }

    public function update(UpdateUsuarioRequest $request, int $id)
    {
        try {
            $resultado = $this->usuariosRepository->actualizarUsuario($id, $request->all());
            return response()->json($resultado, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(int $id)
    {
        try {
            $resultado = $this->usuariosRepository->eliminarUsuario($id);
            return response()->json($resultado, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al eliminar: ' . $e->getMessage()], 500);
        }
    }
}