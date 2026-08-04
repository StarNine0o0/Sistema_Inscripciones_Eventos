<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Repositories\SedeRepository;
use App\Http\Requests\StoreSedeRequest;
use App\Http\Requests\UpdateSedeRequest;

class SedesWebController extends Controller
{
    private $sedeRepository;

    public function __construct(SedeRepository $sedeRepository)
    {
        $this->sedeRepository = $sedeRepository;
    }

    public function index()
    {
        try {
            $resultado = $this->sedeRepository->obtenerSedes();
            
            return Inertia::render('Sedes/Index', [
                'sedes' => $resultado['sedes']
            ]);
        } catch (\Exception $e) {
            abort(500, 'Error al cargar el panel de sedes: ' . $e->getMessage());
        }
    }

    public function store(StoreSedeRequest $request)
    {
        try {
            $this->sedeRepository->registrarSede($request->validated());
            
            return redirect()->back()->with('success', 'Sede creada con éxito.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Error al registrar: ' . $e->getMessage()]);
        }
    }

    public function update(UpdateSedeRequest $request, int $id)
    {
        try {
            $this->sedeRepository->actualizarSede($id, $request->validated());
            
            return redirect()->back()->with('success', 'Sede actualizada correctamente.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Error al actualizar: ' . $e->getMessage()]);
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->sedeRepository->eliminarSede($id);
            
            return redirect()->back()->with('success', 'Sede eliminada.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}