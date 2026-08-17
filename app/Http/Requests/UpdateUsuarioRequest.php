<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;


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
        // Obtiene la ID desde la ruta (/usuarios/5), ya sea string o Modelo
        $usuarioParam = $this->route('usuario');
        $idUsuario = is_object($usuarioParam) ? $usuarioParam->id_usuario : $usuarioParam;

        return [
            'nombre_completo' => 'required|string|max:255',
            'correo_institucional' => [
                'required',
                'email',
                Rule::unique('usuarios', 'correo_institucional')->ignore($idUsuario, 'id_usuario')
            ],
            'matricula_empleado' => [
                'required',
                'string',
                Rule::unique('usuarios', 'matricula_empleado')->ignore($idUsuario, 'id_usuario')
            ],
            'id_rol' => 'required|integer',
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


    protected function failedValidation(Validator $validator)
    {
        
        throw new HttpResponseException(response()->json([
            'mensaje' => 'Error de validación',
            'errores' => $validator->errors()
        ], 422));
    }




}
