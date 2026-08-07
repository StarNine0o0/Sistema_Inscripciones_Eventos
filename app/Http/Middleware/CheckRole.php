<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $rolEsperado): Response
    {
        //Verificamos que el usuario esté logeado
        if (!$request->user()) {
            abort(403, 'Usuario no autenticado aun.');
        }

        //Mapamos los nombres de los roles con los IDs
        $roles = [
            'administrador'       => 1,
            'organizador' => 2,
        ];

        //verificamos le rol este definido 
        if (!array_key_exists($rolEsperado, $roles)) {
            abort(403, 'Rol no definido en el sistema.');
        }

        //  Comparamos el id_rol del usuario con el que requiere la ruta
        if ($request->user()->id_rol === $roles[$rolEsperado]) {
            return $next($request);
        }
        abort(403, 'Acceso denegado. No tienes permisos para entrar a este módulo.');
    }
}