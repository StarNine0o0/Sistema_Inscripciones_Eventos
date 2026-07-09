<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\StoreUsuarioRequest;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Http\Requests\UpdateUsuarioRequest;

class UsuarioController extends Controller
{
    public function index(Request $request){

    $termino = $request->input('buscar'); 

    $query = Usuario::with('rol');

    if ($termino) {
            $query->where(function ($q) use ($termino) {
                $q->where('nombre_completo', 'LIKE', "%{$termino}%")
                  ->orWhere('correo_institucional', 'LIKE', "%{$termino}%")
                  ->orWhere('matricula_empleado', 'LIKE', "%{$termino}%")
                  
                  // Esta función es la  permite buscar dentro de la tabla relacionada (roles)
                  ->orWhereHas('rol', function ($qRol) use ($termino) {
                      $qRol->where('nombre_rol', 'LIKE', "%{$termino}%");
                  });
            });
        }

        $usuarios =$query->paginate(10);
        return response()->json($usuarios, 200); 


    }   

    public function store(StoreUsuarioRequest $request)
    {
        // Se supone que la validacion ya se esta haciendo en el StoreUsuarioRequest por ende si lleguamos aqui ya esta validado
       

        //Ceamos al usuario con el rol que el administrador decidió
        $usuario = Usuario::create([
            'id_rol' => $request->id_rol,
            'nombre_completo' => $request->nombre_completo,
            'correo_institucional' => $request->correo_institucional,
            'contrasena' => Hash::make($request->contrasena),
            'matricula_empleado' => $request->matricula_empleado,
            'estado_usuario' => 'Activo'
        ]);

    
        return response()->json([
            'mensaje' => 'Usuario registrado exitosamente por el administrador',
            'usuario' => $usuario->load('rol')
        ], 201);
    }

    public function update(UpdateUsuarioRequest $request, Usuario $usuario)
    {
        $usuario->update([
            'nombre_completo' => $request->nombre_completo,
            'correo_institucional' => $request->correo_institucional,
            'matricula_empleado' => $request->matricula_empleado,
            'id_rol' => $request->id_rol
        ]);
        return response()->json([
            'mensaje' => 'Usuario actualizado exitosamente',
            'usuario' => $usuario->load('rol')
        ], 200);
    }

    public function show(Usuario $usuario)
    {

       $usuario->load(['inscripciones', 'eventosOrganizados']);

        return Inertia::render('Usuarios/Perfil', [
            'usuario_perfil' => $usuario //propiedad prop q recibe react
        ]); 




    }


    public function destroy(Usuario $usuario)
    {
    
       $usuario->update(['estado_usuario' => 'Inactivo']);
        return response()->json([
            'mensaje' => 'Usuario desactivado exitosamente',
            'usuario' => $usuario
        ], 200);
    }





} 

