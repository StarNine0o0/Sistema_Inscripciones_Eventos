<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Repositories\UsuariosRepository;
use App\Http\Requests\StoreUsuarioRequest;
use App\Http\Requests\UpdateUsuarioRequest;
use Inertia\Inertia;
use App\Models\Usuario;

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
            $resultado = $this->usuariosRepository->obtenerUsuarios($request->all());
            return Inertia::render('Usuarios/Index', [
                'usuarios' => $resultado['usuarios']
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

    // Adaptado para devolver la vista de Inertia usando el repositorio
    public function show(int $id)
    {
        try {
            $resultado = $this->usuariosRepository->obtenerUsuario($id);
        
            return Inertia::render('Usuarios/Perfil', [
                'usuario_perfil' => $resultado['usuario']
            ]);
        } catch (\Exception $e) {
        abort($e->getCode() ?: 500, $e->getMessage());
        }
    }

    public function cambiarEstado(Request $request, int $id)
    {
        try {
            // Validamos que venga el campo 'estado' desde React
            $request->validate([
                'estado' => 'required|string'
            ]);

            // Buscamos el usuario y actualizamos el campo en la base de datos
            $usuario = Usuario::findOrFail($id);
            $usuario->update([
                'estado_usuario' => $request->input('estado')
            ]);

            return redirect()->back()->with('success', 'Estado del usuario actualizado correctamente.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Error al cambiar estado: ' . $e->getMessage()]);
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

    public function destroy(Request $request, int $id)
    {
        // Si el frontend no especifica un estado lo pasmo a inactivo por defecto
        $nuevoEstado = $request->estado_usuario ?? 'Inactivo';

        try {
            $this->usuariosRepository->cambiarEstado($id, $nuevoEstado);
            
            return redirect()->back()->with('success', 'Estado del usuario "eliminado" correctamente.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function restablecerContrasena(Request $request, int $id)
{
    $request->validate([
        'contrasena' => 'required|string|min:6'
    ]);

    try {
        $this->usuariosRepository->restablecerContrasena($id, $request->contrasena);

        return redirect()->back()->with('success', 'Contraseña restablecida con éxito.');
    } catch (\Exception $e) {
        return redirect()->back()->withErrors(['error' => $e->getMessage()]);
    }
}



}