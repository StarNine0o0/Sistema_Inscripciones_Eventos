<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreUsuarioRequest extends FormRequest
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
        return [
            'nombre_completo' => 'required|string|max:255',
            'correo_institucional' => 'required|email|unique:usuarios,correo_institucional',
            'contrasena' => 'required|string|min:6',
            'matricula_empleado' => 'required|string|unique:usuarios,matricula_empleado',
            'id_rol' => 'required|integer|exists:roles,id_rol'
        ];
    }

    public function messages(): array
    {
        return [
            'correo_institucional.unique' => 'Este correo ya está registrado en el sistema.',
            'matricula_empleado.unique' => 'Esta matrícula ya pertenece a otro usuario.',
            'id_rol.exists' => 'El rol seleccionado no es válido.'
        ];
    }


}
