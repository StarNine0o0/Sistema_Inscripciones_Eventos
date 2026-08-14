<?php

namespace App\Http\Controllers\Repositories;

use App\Models\Inscripcion;
use Illuminate\Database\Eloquent\Collection;

class InscripcionRepository
{
    public function listarPorEvento(int $idEvento, ?string $estado = null): Collection
    {
        $query = Inscripcion::where('id_evento', $idEvento)
            ->with('participante:id_usuario,nombre_completo,correo_institucional');

        if ($estado) {
            $query->where('estado_inscripcion', $estado);
        }

        return $query->orderBy('fecha_inscripcion')->get();
    }

    public function buscarPorId(int $id): ?Inscripcion
    {
        return Inscripcion::find($id);
    }

    public function buscarPorCodigo(string $codigo): ?Inscripcion
    {
        return Inscripcion::where('codigo_confirmacion', $codigo)->first();
    }

    public function existeCanceladaDe(int $idEvento, int $idParticipante): bool
    {
        return Inscripcion::where('id_evento', $idEvento)
            ->where('id_participante', $idParticipante)
            ->where('estado_inscripcion', 'Cancelada')
            ->exists();
    }

    public function existeActivaDe(int $idEvento, int $idParticipante): bool
    {
        return Inscripcion::where('id_evento', $idEvento)
            ->where('id_participante', $idParticipante)
            ->where('estado_inscripcion', 'Activa')
            ->exists();
    }

    public function crear(array $datos): Inscripcion
    {
        return Inscripcion::create($datos);
    }

    public function cancelar(Inscripcion $inscripcion): void
    {
        $inscripcion->update(['estado_inscripcion' => 'Cancelada']);
    }

    public function confirmarAsistencia(Inscripcion $inscripcion): void
    {
        $inscripcion->update([
            'estado_asistencia' => 'Confirmada',
            'fecha_checkin'     => now(),
        ]);
    }
}