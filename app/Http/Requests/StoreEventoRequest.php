<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreEventoRequest extends FormRequest
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
            'nombre_evento' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'fecha_inicio' => 'required|date|after_or_equal:today',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'capacidad_maxima' => 'required|integer|min:1',
            'imagen_portada' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:1024', // estoy entre este fotmato o el formato url
            'id_categoria' => 'required|integer|exists:categorias,id_categoria',
            'id_organizador' => 'required|integer|exists:usuarios,id_usuario',
            'id_sede' => 'required|integer|exists:sedes,id_sede',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre_evento.required' => 'El nombre del evento es obligatorio.',
            'descripcion.required' => 'La descripción del evento es obligatoria.',
            'fecha_inicio.required' => 'La fecha de inicio es obligatoria.',
            'fecha_inicio.after_or_equal' => 'La fecha de inicio debe ser hoy o una fecha futura.',
            'fecha_fin.required' => 'La fecha de fin es obligatoria.',
            'fecha_fin.after_or_equal' => 'La fecha de fin debe ser igual o posterior a la fecha de inicio.',
            'capacidad_maxima.required' => 'La capacidad máxima es obligatoria.',
            'capacidad_maxima.integer' => 'La capacidad máxima debe ser un número entero.',
            'capacidad_maxima.min' => 'La capacidad máxima debe ser al menos 1.',
            'id_categoria.required' => 'La categoría es obligatoria.',
            'id_categoria.exists' => 'La categoría seleccionada no existe.',
            'id_organizador.required' => 'El organizador es obligatorio.',
            'id_organizador.exists' => 'El organizador seleccionado no existe.',
            'id_sede.required' => 'La sede es obligatoria.',
            'id_sede.exists' => 'La sede seleccionada no existe.'
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
