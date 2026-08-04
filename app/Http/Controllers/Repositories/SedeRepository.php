<?php

namespace App\Http\Controllers\Repositories;

use App\Models\Sede;

class SedeRepository
{
    public function obtenerSedes()
    {
        try {
            $sedes = Sede::orderBy('nombre_sede', 'asc')->get();
            return [
                "mensaje" => "Sedes obtenidas correctamente",
                "sedes" => $sedes
            ];
        } catch (\Exception $e) {
            throw new \Exception('Error al obtener sedes: ' . $e->getMessage(), 500);
        }
    }

    public function registrarSede(array $data)
    {
        try {
            $sede = Sede::create($data);
            return [
                "mensaje" => "Sede registrada correctamente",
                "sede" => $sede
            ];
        } catch (\Exception $e) {
            throw new \Exception('Error al registrar sede: ' . $e->getMessage(), 500);
        }
    }

    public function actualizarSede(int $id, array $data)
    {
        try {
            $sede = Sede::find($id);
            if (!$sede) {
                throw new \Exception('Sede no encontrada', 404);
            }
            $sede->update($data);
            return [
                "mensaje" => "Sede actualizada correctamente",
                "sede" => $sede
            ];
        } catch (\Exception $e) {
            throw new \Exception('Error al actualizar sede: ' . $e->getMessage(), 500);
        }
    }

    public function eliminarSede(int $id)
    {
        try {
            $sede = Sede::findOrFail($id);
            
            // Verificar si hay eventos asociados a la sede antes de eliminarla
            if ($sede->eventos()->count() > 0) {
                throw new \Exception('No se puede eliminar porque hay eventos usando esta sede.', 422);
            }
            
            $sede->delete();
            return [
                "mensaje" => "Sede eliminada correctamente"
            ];
        } catch (\Exception $e) {
            $codigo = $e->getCode() ?: 500;
            throw new \Exception($e->getMessage(), $codigo);
        }
    }
}