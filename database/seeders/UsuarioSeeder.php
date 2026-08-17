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

    public function index(Request $request)
    {
        try {
            $filtros = [
                'busqueda' => $request->input('busqueda', ''),
                'rol' => $request->input('rol', ''),
            ];

            // Pasa los filtros al repositorio si tu método lo soporta
            $resultado = $this->usuariosRepository->obtenerUsuarios($filtros);

            return Inertia::render('Usuarios/Index', [
                'usuarios' => $resultado['usuarios'],
                'filtros' => $filtros
            ]);
        } catch (\Exception $e) {
            abort(500, 'Error al cargar el panel de usuarios: ' . $e->getMessage());
        }
    }

    public function store(StoreUsuarioRequest $request)
    {
        try {
            $this->usuariosRepository->registrarUsuario($request->validated());
            
            return redirect()->back()->with('success', 'Usuario registrado con éxito.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Error al registrar: ' . $e->getMessage()]);
        }
    }

    public function show(int $id)
    {
        try {
            $resultado = $this->usuariosRepository->obtenerUsuario($id);
        
            return Inertia::render('Usuarios/Perfil', [
                'usuario_perfil' => $resultado['usuario']
            ]);
        } catch (\Exception $e) {
            abort(500, 'Error al mostrar el perfil: ' . $e->getMessage());
        }
    }

    public function update(UpdateUsuarioRequest $request, int $id)
    {
        try {
            $this->usuariosRepository->actualizarUsuario($id, $request->validated());
            
            return redirect()->back()->with('success', 'Usuario actualizado correctamente.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Error al actualizar: ' . $e->getMessage()]);
        }
    }

    public function cambiarEstado(Request $request, int $id)
    {
        try {
            $nuevoEstado = $request->input('estado');
            
            if (method_exists($this->usuariosRepository, 'cambiarEstadoUsuario')) {
                $this->usuariosRepository->cambiarEstadoUsuario($id, $nuevoEstado);
            } else {
                $this->usuariosRepository->actualizarUsuario($id, ['estado' => $nuevoEstado]);
            }
            
            return redirect()->back()->with('success', 'Estado de usuario actualizado correctamente.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Error al cambiar estado: ' . $e->getMessage()]);
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->usuariosRepository->eliminarUsuario($id);
            
            return redirect()->back()->with('success', 'Usuario desactivado correctamente.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}