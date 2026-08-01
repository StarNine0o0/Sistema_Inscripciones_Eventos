<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckOrganizerRole
{
    public function handle(Request $request, Closure $next): Response
    {
        $usuario = $request->user();

        if ($usuario && in_array($usuario->id_rol, [2, 3], true)) {
            return $next($request);
        }

        return response()->json([
            'mensaje' => 'Acceso denegado. Se requiere rol de Organizador o Administrador.',
        ], 403);
    }
}