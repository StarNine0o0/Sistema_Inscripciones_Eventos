<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Repositories\SedeRepository;
use App\Http\Requests\StoreSedeRequest;
use App\Http\Requests\UpdateSedeRequest;
use App\Models\Sede;

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

    public function store(Request $request)
    {
        $request->validate([
            'nombre_sede' => 'required|string|max:255',
            'capacidad_sede' => 'required|numeric|min:1',
        ], [
            'nombre_sede.required' => 'El nombre de la sede es obligatorio.',
            'capacidad_sede.required' => 'La capacidad es obligatoria.',
            'capacidad_sede.numeric' => 'La capacidad debe ser un número entero.',
        ]);

        Sede::create([
            'nombre_sede' => $request->nombre_sede,
            'capacidad_sede' => $request->capacidad_sede,
        ]);

        return redirect()->back()->with('mensaje', 'Sede registrada correctamente');
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