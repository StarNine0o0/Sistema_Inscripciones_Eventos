<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateEventosRequest extends FormRequest
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
        'nombre_evento' => 'sometimes|required|string|max:255',
        'descripcion' => 'sometimes|required|string',
        'fecha_inicio' => 'sometimes|required|date', 
        'fecha_fin' => 'sometimes|required|date|after_or_equal:fecha_inicio',
        'capacidad_maxima' => 'sometimes|required|integer|min:1',
        'imagen_portada' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        'id_categoria' => 'sometimes|required|integer|exists:categorias,id_categoria',
        'id_organizador' => 'sometimes|required|integer|exists:usuarios,id_usuario',
        'id_sede' => 'sometimes|required|integer|exists:sedes,id_sede',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre_evento.required' => 'El nombre del evento es obligatorio.',
            'descripcion.required' => 'La descripción del evento es obligatoria.',
            'fecha_inicio.required' => 'La fecha de inicio es obligatoria.',
            'fecha_fin.required' => 'La fecha de fin es obligatoria.',
            'fecha_fin.after_or_equal' => 'La fecha de fin debe ser igual o posterior a la fecha de inicio.',
            'capacidad_maxima.required' => 'La capacidad máxima es obligatoria.',
            'capacidad_maxima.integer' => 'La capacidad máxima debe ser un número entero.',
            'capacidad_maxima.min' => 'La capacidad máxima debe ser al menos 1.',
            'id_categoria.exists' => 'La categoría seleccionada no existe.',
            'id_organizador.exists' => 'El organizador seleccionado no existe.',
            'id_sede.exists' => 'La sede seleccionada no existe.'
        ];
    }
/* IGNORE ESTO A MENOS DE QUE VEAMOS QUE SEA NECESARIO
    public function prepareForValidation()
    {
        // Si fecha_inicio o fecha_fin no están presentes en la solicitud, las eliminamos para evitar errores de validación
        if (!$this->has('fecha_inicio')) {
            $this->request->remove('fecha_inicio');
        }
        if (!$this->has('fecha_fin')) {
            $this->request->remove('fecha_fin');
        }
    */


   protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'mensaje' => 'Error de validación',
            'errores' => $validator->errors()
        ], 422));
    }     
}
