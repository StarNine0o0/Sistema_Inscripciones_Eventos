<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreSedeRequest extends FormRequest
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
            'nombre_sede' => 'required|string|max:255|unique:sedes,nombre_sede',
            'capacidad' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre_sede.required' => 'El nombre de la sede es obligatorio.',
            'nombre_sede.string' => 'El nombre de la sede debe ser una cadena de texto.',
            'nombre_sede.max' => 'El nombre de la sede no debe exceder los 255 caracteres.',
            'nombre_sede.unique' => 'El nombre de la sede ya existe. Por favor, elige otro nombre.',
            'capacidad.required' => 'La capacidad es obligatoria.',
            'capacidad.integer' => 'La capacidad debe ser un número entero.',
            'capacidad.min' => 'La capacidad debe ser al menos 1.',
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
