<?php

namespace App\Http\Controllers\Repositories;

use App\Models\Evento;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Illuminate\Http\Request;

class EventosRepository
{
    public function obtenerEventos($filtros = [])
    {
        try {
            $query = Evento::query();

            // Filtro isset solo para evitar errores si no se envía el filtro, osea si el usuario no envía el filtro, no se aplica
            if (isset($filtros['id_categoria'])) {$query->where('id_categoria', $filtros['id_categoria']);}
                
            // Filtro por estado (borrador, publicado, cancelado, finalizado)
            if (isset($filtros['estado_evento'])) { $query->where('estado_evento', $filtros['estado_evento']);}
               
            // Filtro por fecha de inicio, si se envía, se obtienen los eventos que inician a partir de esa fecha
            if (isset($filtros['fecha_inicio'])) {$query->whereDate('fecha_inicio', '>=', $filtros['fecha_inicio']);}
                
            // Cargamos al relacion con categoría y el conteo de inscritos
            $eventos = $query->with('categoria')->withCount('inscripciones')->orderBy('fecha_inicio', 'asc')->paginate(10);

            //mandamos la sede y el nombre del organizador 
            $eventos = $query->with(['categoria', 'sede', 'organizador'])->withCount('inscripciones')->orderBy('fecha_inicio', 'asc')->paginate(10);   
            

                //getcollection, es un objeto que contiene los resultados de la consulta, y el transform es un método que permite modificar cada elemento del objeto, en este caso estamos modificando el estado_mostrar de cada evento, si el evento tiene más inscripciones que la capacidad máxima, se muestra como lleno, si no, se muestra el estado real del evento
            $eventos->getCollection()->transform(function ($evento) {
                if ($evento->inscripciones_count >= $evento->capacidad_maxima) {
                    $evento->estado_mostrar = 'Lleno';
                } else {
                    $evento->estado_mostrar = $evento->estado_evento;
                }
                return $evento;
            });

            return [
                "mensaje" => "Eventos obtenidos correctamente",
                "eventos" => $eventos
            ];
        } catch (\Exception $e) {
            throw new \Exception('Error al obtener eventos: ' . $e->getMessage(),500);
        }
    }

    public function registrarEvento(array $data, $imagen = null)
    {
        try {
            $rutaImagen = null;
            
            // Lógica para guardar la imagen si se envía
            if ($imagen) {
                $rutaImagen = $imagen->store('portadas_eventos', 'public');
            }

            $evento = Evento::create([
            'nombre_evento'    => $data['nombre_evento'],
            'descripcion'      => $data['descripcion'],
            'id_categoria'     => $data['id_categoria'],
            'id_organizador'   => $data['id_organizador'],
            'id_sede'          => $data['id_sede'],
            'fecha_inicio'     => $data['fecha_inicio'],
            'fecha_fin'        => $data['fecha_fin'],
            'capacidad_maxima' => $data['capacidad_maxima'],
            'imagen_portada'   => $rutaImagen,
            'estado_evento'    => 'Borrador' 
            ]);

            return $evento;
        } catch (\Exception $e) {
            throw new \Exception('Error al registrar el evento: ' . $e->getMessage(), 500);
        }
    }

    public function obtenerEvento(int $id)
    {
        try {
            // Cargamos la relación con categoría y la ruta completa hacia el participante y contamos tambien las inscripciones
            $evento = Evento::with(['categoria', 'inscripciones.participante'])
                            ->withCount('inscripciones')
                            ->with(['sede', 'organizador'])
                            ->find($id);
            
            if (!$evento) {
                throw new \Exception('Evento no encontrado', 404);
            }
            
            return [
                "mensaje" => "Evento obtenido correctamente",
                "evento" => $evento
            ];
        } catch (\Exception $e) {
            throw new \Exception('Error al obtener el evento: ' . $e->getMessage(), 500);
        }
    }

    public function actualizarEvento(int $id, array $data, $imagen = null)
    {
        try {
            $evento = Evento::findOrFail($id);

            // Lógica para actualizar la imagen si se envía una nueva
            if ($imagen) {
                // Eliminar las imgen anterior si existe
                if ($evento->imagen_portada) {
                    Storage::disk('public')->delete($evento->imagen_portada);
                }
                $rutaImagen = $imagen->store('portadas_eventos', 'public');
                $data['imagen_portada'] = $rutaImagen;
            }

            $evento->update([
                'nombre_evento'    => $data['nombre_evento'] ?? $evento->nombre_evento,
                'descripcion'      => $data['descripcion'] ?? $evento->descripciaon,
                'id_categoria'     => $data['id_categoria'] ?? $evento->id_categoria,
                'id_organizador'   => $data['id_organizador'] ?? $evento->id_organizador,
                'id_sede'          => $data['id_sede'] ?? $evento->id_sede,
                'fecha_inicio'     => $data['fecha_inicio'] ?? $evento->fecha_inicio,
                'fecha_fin'        => $data['fecha_fin'] ?? $evento->fecha_fin,
                'capacidad_maxima' => $data['capacidad_maxima'] ?? $evento->capacidad_maxima,
                'imagen_portada'   => $data['imagen_portada'] ?? $evento->imagen_portada

            ]);

            return [
                "mensaje" => "Evento actualizado correctamente",
                "evento" => $evento
            ];
        } catch (\Exception $e) {
            throw new \Exception('Error al actualizar el evento: ' . $e->getMessage(), 500);
        }
    }


public function eliminarEvento(int $id)
    {
        try {
            $evento = Evento::findOrFail($id);

            // Eliminar la imagen si existe
            if ($evento->imagen_portada) {
                Storage::disk('public')->delete($evento->imagen_portada);
            }

            $evento->delete();

            return [
                "mensaje" => "Evento eliminado correctamente"
            ];
        } catch (\Exception $e) {
            throw new \Exception('Error al eliminar el evento: ' . $e->getMessage(), 500);
        }
    }

    public function cambiarEstado(int $id, string $nuevoEstado)
{
    $estadosPermitidos = ['Borrador', 'Publicado', 'Cancelado', 'Finalizado'];

    //in_array, para que no se pueda cambiar a un estado no permitido
    if (!in_array($nuevoEstado, $estadosPermitidos)) {
        throw new \Exception('Estado no permitido, los estados permitidos son: ' . implode(', ', $estadosPermitidos), 422);
    }

    $evento = Evento::findOrFail($id);

    if ($nuevoEstado === 'Publicado') {
        //convertimos la feha en un objeto carbon para poder comparar si la fecha de inicio ya pasó, si es así no se puede modificar a publicado 
        if (Carbon::parse($evento->fecha_inicio)->isPast()) {// si la fecha de inicio ya pasó, no se puede cambiar a publicado
            throw new \Exception('No puedes publicar un evento cuya fecha de inicio ya pasó.', 422);
        }
    }

    try {
        $evento->update(['estado_evento' => $nuevoEstado]);

        return [
            "mensaje" => "El estado del evento ha cambiado a " . $nuevoEstado,
            "evento" => $evento
        ];
    } catch (\Exception $e) {
        throw new \Exception('Error al actualizar la base de datos: ' . $e->getMessage(), 500);
    }
}
    
}