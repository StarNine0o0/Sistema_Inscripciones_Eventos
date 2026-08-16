<?php

namespace App\Mail;

use App\Models\Inscripcion;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InscripcionConfirmada extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Inscripcion $inscripcion) {}

   public function build()
{
    return $this->subject('Tu código de confirmación')
        ->view('emails.inscripcion_confirmada')
        ->with([
            'codigo' => $this->inscripcion->codigo_confirmacion,
            'nombre' => $this->inscripcion->participante->nombre_completo ?? 'Participante',
        ]);
}
}
