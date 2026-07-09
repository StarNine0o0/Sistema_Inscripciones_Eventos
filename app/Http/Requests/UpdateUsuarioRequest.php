<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUsuarioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $usuario = $this->route('usuario');// Obtener el usuario de la ruta

        return [
            'nombre_completo' => 'required|string|max:255',
            'correo_institucional' => 'required|email|unique:usuarios,correo_institucional,' . $usuario->id_usuario . ',id_usuario',
            'matricula_empleado' => 'required|string|unique:usuarios,matricula_empleado,' . $usuario->id_usuario . ',id_usuario',
            'id_rol' => 'required|integer|exists:roles,id_rol'
        ];
    }
}
