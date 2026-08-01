<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInscripcionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id_participante'      => 'required_without:correo_institucional|integer|exists:usuarios,id_usuario',
            'correo_institucional' => 'required_without:id_participante|email|exists:usuarios,correo_institucional',
        ];
    }

    public function messages(): array
    {
        return [
            'id_participante.required_without'      => 'Debe indicar id_participante o correo_institucional del participante.',
            'id_participante.exists'                => 'El participante indicado no existe.',
            'correo_institucional.required_without' => 'Debe indicar correo_institucional o id_participante del participante.',
            'correo_institucional.exists'            => 'No existe ningún usuario registrado con ese correo institucional.',
        ];
    }
}