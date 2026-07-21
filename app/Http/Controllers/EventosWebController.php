<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Repositories\EventosRepository;
use App\Http\Requests\StoreEventoRequest;
use App\Http\Requests\UpdateEventosRequest; 
use Inertia\Inertia;

class EventosWebController extends Controller
{
    private $eventosRepository;

    public function __construct(EventosRepository $eventosRepository)
    {
        $this->eventosRepository = $eventosRepository;
    }

    // Retorna la vista principal del panel de eventos
    public function index(Request $request)
    {
        try {
            $resultado = $this->eventosRepository->obtenerEventos($request->all());
            
            return Inertia::render('Eventos/Index', [
                'eventos' => $resultado['eventos'] // Mandamos el arreglo al React
            ]);
        } catch (\Exception $e) {
            abort(500, 'Error al cargar el panel de los eventos: ' . $e->getMessage());
        }
    }

// Retorna la vista de detalle de un evento específico
    public function show(int $id)
    {
        try {
            $resultado = $this->eventosRepository->obtenerEvento($id);
            
            return Inertia::render('Eventos/Detalle', [
                'evento' => $resultado['evento']
            ]);
        } catch (\Exception $e) { 
            $codigo = $e->getCode() == 404 ? 404 : 500;
            abort($codigo, $e->getMessage());
        }
    }




    // Mantenemos el store devolviendo JSOn para que el front pueda manejar la respuesta con fetch
    public function store(StoreEventoRequest $request)
    {
        try {
            $evento = $this->eventosRepository->registrarEvento(
                $request->all(), 
                $request->file('imagen_portada')
            );

            return response()->json([
                "mensaje" => "Evento registrado correctamente",
                "evento" => $evento
            ], 201);
            
            
        } catch (\Exception $e) {// le pasamos el código de error 404 si el evento no se encuentra, o 500 si hay otro error manejandolo con el repository para que react no piense que es otro error 
            $codigo = $e->getCode() ?: 500;
            return response()->json(['error' => 'Error al registrar el evento: ' . $e->getMessage()], $codigo);
        }
    }

    

    public function update(UpdateEventosRequest $request, int $id) 
    {
        try {
            $resultado = $this->eventosRepository->actualizarEvento(
                $id, 
                $request->all(), 
                $request->file('imagen_portada')//mandamos tmabien la imagen para que la actualze si es que se manda una nueva
            );
            
            return response()->json($resultado, 200);
        } catch (\Exception $e) {
            $codigo = $e->getCode() == 404 ? 404 : 500;
            return response()->json(['error' => $e->getMessage()], $codigo);
        }
    }

    public function destroy(int $id)
    {
        try {
            $resultado = $this->eventosRepository->eliminarEvento($id);
            
            return response()->json($resultado, 200);
        } catch (\Exception $e) {
            $codigo = $e->getCode() == 404 ? 404 : 500;
            return response()->json(['error' => $e->getMessage()], $codigo);
        }
    }

    public function cambiarEstado(Request $request, int $id)
    {
        // daoble validacion , esto pasa depues al repository para que no se pueda cambiar a un estado no permitido
        $request->validate(['estado_evento' => 'required|string']);

        try {
            $resultado = $this->eventosRepository->cambiarEstado($id, $request->estado_evento);
            
            return response()->json($resultado, 200);
        } catch (\Exception $e) {
            $codigo = $e->getCode() ?: 500;
            return response()->json(['error' => $e->getMessage()], $codigo);
        }
    }



}