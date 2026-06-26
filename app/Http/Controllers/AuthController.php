<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        //Validar que nos envíen los datos requeridos
        $request->validate([
            'correo_institucional' => 'required|email',
            'contrasena' => 'required'
        ]);

        // Buscar al usuario en la base de datos
        $usuario = Usuario::where('correo_institucional', $request->correo_institucional)->first();

        // Verificar que el usuario exista y la contraseña coincida
        if (!$usuario || !Hash::check($request->contrasena, $usuario->contrasena)) {
            return response()->json([
                'mensaje' => 'Credenciales incorrectas'
            ], 401);
        }

        // Verificar que la cuenta no esté desactivada
        if ($usuario->estado_usuario !== 'Activo') {
            return response()->json([
                'mensaje' => 'Tu cuenta está desactivada. Contacta al administrador.'
            ], 403);
        }

        // Generar el token de seguridad
        $token = $usuario->createToken('auth_token')->plainTextToken;

        //Retornar el token y los datos del usuario (incluyendo su rol)
        return response()->json([
            'mensaje' => 'Inicio de sesión exitoso',
            'token' => $token,
            'usuario' => $usuario->load('rol')
        ], 200);
    }
}
