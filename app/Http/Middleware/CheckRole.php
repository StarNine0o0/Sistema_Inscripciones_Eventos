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
    //usamor el operador spread de acoumalacion para que recoja lo que tenga depues de la coma de nestra ruta web midlawer 'administrador.organizador'
    public function handle(Request $request, Closure $next, string ...$rolesEsperados): Response
    {
        // Verificamos que el usuario esté logeado
        if (!$request->user()) {
            abort(403, 'Usuario no autenticado aun.');
        }

    
        $rolesMap = [
            'administrador' => 1,
            'organizador'   => 2,
        ];

        // Convertimos los roles permitidos a sus respectivos IDs numéricos
        $idsPermitidos = [];
        foreach ($rolesEsperados as $rol) {
            if (array_key_exists(trim($rol), $rolesMap)) {
                $idsPermitidos[] = $rolesMap[trim($rol)];
            }
        }

        // Comparamos si el id_rol del usuario actual está dentro de los permitidos para esta ruta
        if (in_array((int) $request->user()->id_rol, $idsPermitidos, true)) {
            return $next($request);
        }

        abort(403, 'Acceso denegado. No tienes permisos para entrar a este módulo.');
    }
}