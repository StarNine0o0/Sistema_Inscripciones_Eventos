<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verificar si el usuario autenticado tiene el rol de administrador
        if ($request->user() && $request->user()->id_rol === 1) {
            return $next($request);
        }

        // Si no es administrador, retornar un error 403 (Prohibido)
        return response()->json(['mensaje' => 'Acceso denegado. Se requiere rol de administrador.'], 403);
    }
}
