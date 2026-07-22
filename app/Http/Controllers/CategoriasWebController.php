<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriasWebController extends Controller
{
    public function index()
    {
        // Tramos todas las categorías ordenadas alfabéticamente
        $categorias = Categoria::orderBy('nombre_categoria', 'asc')->get();
        
        return Inertia::render('Categorias/Index', [
            'categorias' => $categorias
        ]);
    }

    // Recibe los datos del modal de "Crear"
    public function store(Request $request)
    {
        $request->validate([
            'nombre_categoria' => 'required|string|max:255|unique:categorias,nombre_categoria'
        ]);

        Categoria::create([
            'nombre_categoria' => $request->nombre_categoria
        ]);

        // En Inertia, redirigir "back" actualiza la data en React sin recargar la página
        return redirect()->back()->with('success', 'Categoría creada con éxito.');
    }

    public function update(Request $request, int $id)
    {
        $request->validate([
            'nombre_categoria' => 'required|string|max:255|unique:categorias,nombre_categoria,' . $id . ',id_categoria'
        ]);

        $categoria = Categoria::findOrFail($id);
        $categoria->update([
            'nombre_categoria' => $request->nombre_categoria
        ]);

        return redirect()->back()->with('success', 'Categoría actualizada correctamente.');
    }

    // Elimina la categoría
    public function destroy( int $id)
    {
        $categoria = Categoria::findOrFail($id);
        // si no hay eventos asociados a la categoría, se puede eliminar
        if ($categoria->eventos()->count() > 0) {
            return redirect()->back()->withErrors(['error' => 'No se puede eliminar porque hay eventos usando esta categoría.']);
        }
        $categoria->delete();

        return redirect()->back()->with('success', 'Categoría eliminada.');
    }
}