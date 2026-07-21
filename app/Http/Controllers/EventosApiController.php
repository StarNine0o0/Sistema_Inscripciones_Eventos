<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Repositories\EventosRepository;

class EventosApiController extends Controller
{
    private $eventosRepository;

    public function __construct(EventosRepository $eventosRepository)
    {
        $this->eventosRepository = $eventosRepository;
    }

    public function index(Request $request)
    {
        try {
            $resultado = $this->eventosRepository->obtenerEventos($request->all());
            return response()->json($resultado, 200);
        } catch (\Exception $e) {
            $codigo = $e->getCode() ?: 500;
            return response()->json(['error' => $e->getMessage()], $codigo);
        }
    }


    public function show(int $id)
    {
        try {
            $resultado = $this->eventosRepository->obtenerEvento($id);
            return response()->json($resultado, 200);
        } catch (\Exception $e) {
            $codigo = $e->getCode() == 404 ? 404 : 500;
            return response()->json(['error' => $e->getMessage()], $codigo);
        }
    }
}