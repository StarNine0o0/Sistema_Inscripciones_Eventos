<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Repositories\CategoriaRepository;
use App\Http\Requests\StoreCategoriaRequest;
use App\Http\Requests\UpdateCategoriaRequest;

class CategoriasWebController extends Controller
{
    private $categoriaRepository;

    public function __construct(CategoriaRepository $categoriaRepository)
    {
        $this->categoriaRepository = $categoriaRepository;
    }

   public function index()
    {
        try {
            $resultado = $this->categoriaRepository->obtenerCategorias();
            
            return Inertia::render('Categorias/Index', [
                'categorias' => $resultado['categorias']
            ]);
        } catch (\Exception $e) {
            abort(500, 'Error al cargar el panel de categorías: ' . $e->getMessage());
        }
    }

    // Recibe los datos del modal de "Crear"
    public function store(StoreCategoriaRequest $request)
    {
        try {
            $this->categoriaRepository->registrarCategoria($request->validated());
            
            return redirect()->back()->with('success', 'Categoría creada con éxito.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Error al registrar: ' . $e->getMessage()]);
        }
    }
    public function update(UpdateCategoriaRequest $request, int $id)
    {
     
        try {
            $this->categoriaRepository->actualizarCategoria($id, $request->validated());
            
            return redirect()->back()->with('success', 'Categoría actualizada correctamente.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Error al actualizar: ' . $e->getMessage()]);
        }
    }

    public function destroy(int $id)
    {
        try {
            $this->categoriaRepository->eliminarCategoria($id);
            
            return redirect()->back()->with('success', 'Categoría eliminada.');
        } catch (\Exception $e) {
            // Aquí atrapamos el error 422 si la categoría tiene eventos
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
