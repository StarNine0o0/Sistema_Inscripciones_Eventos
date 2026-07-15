<?php

namespace App\Http\Controllers\Repositories;

use App\Models\Evento;

class EventosRepository
{
    public function obtenerEventos()
    {
        try {
            $eventos = Evento::all();
            return [
                "mensaje" => "Eventos obtenidos correctamente",
                "eventos" => $eventos
            ];
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los eventos: ' . $e->getMessage()], 500);
        }
    }

    public function registrarEvento(array $data)
    {
        try {
            $evento = Evento::create([
                'nombre_evento' => $data['nombre_evento'],
                'descripcion'   => $data['descripcion'],
                'fecha'         => $data['fecha'],
                'cupo_maximo'   => $data['cupo_maximo'],
            ]);

            return $evento;
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al registrar el evento: ' . $e->getMessage()], 500);
        }
    }

    public function obtenerEvento(int $id)
    {
        try {
            $evento = Evento::find($id);
            if (!$evento) {
                return response()->json(['error' => 'Evento no encontrado'], 404);
            }
            return [
                "mensaje" => "Evento obtenido correctamente",
                "evento" => $evento
            ];
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener el evento: ' . $e->getMessage()], 500);
        }
    }

    public function actualizarEvento(int $id, array $data)
    {
        try {
            $evento = $this->obtenerEvento($id)['evento'];
            
            $evento->update([
                'nombre_evento' => $data['nombre_evento'] ?? $evento->nombre_evento,
                'descripcion'   => $data['descripcion'] ?? $evento->descripcion,
                'fecha'         => $data['fecha'] ?? $evento->fecha,
                'cupo_maximo'   => $data['cupo_maximo'] ?? $evento->cupo_maximo,
            ]);

            return [
                "meta" => "Evento actualizado correctamente",
                "evento" => $evento
            ];
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar el evento: ' . $e->getMessage()], 500);
        }
    }

    public function eliminarEvento(int $id)
    {
        try {
            // Aquí puedes aplicar tu lógica de cambio de estado si lo prefieres
            $evento = $this->obtenerEvento($id)['evento'];
            $evento->delete(); 
            
            return [
                "mensaje" => "Evento eliminado correctamente"
            ];
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al eliminar el evento: ' . $e->getMessage()], 500);
        }
    }
}