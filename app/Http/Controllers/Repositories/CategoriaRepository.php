<?php

namespace App\Http\Controllers\Repositories;


use App\Models\Categoria;


class CategoriaRepository
{
    public function obtenerCategorias()
    {
        try {
            $categorias = Categoria::orderBy('nombre_categoria', 'asc')->get();
            return [
                "mensaje" => "Categorías obtenidas correctamente",
                "categorias" => $categorias
            ];
        } catch (\Exception $e) {
            throw new \Exception('Error al obtener categorías: ' . $e->getMessage(),500);
        }
    }

    public function registrarCategoria(array $data)
    {
        try {
            $categoria = Categoria::create($data);
            return [
                "mensaje" => "Categoría registrada correctamente",
                "categoria" => $categoria
            ];
        } catch (\Exception $e) {
            throw new \Exception('Error al registrar categoría: ' . $e->getMessage(),500);
        }
    }

    public function actualizarCategoria(int $id, array $data)
    {
        try {
            $categoria = Categoria::find($id);
            if (!$categoria) {
                throw new \Exception('Categoría no encontrada', 404);
            }
            $categoria->update($data);
            return [
                "mensaje" => "Categoría actualizada correctamente",
                "categoria" => $categoria
            ];
        } catch (\Exception $e) {
            throw new \Exception('Error al actualizar categoría: ' . $e->getMessage(),500);
        }
    }

    public function eliminarCategoria(int $id)
    {
       try {
            $categoria = Categoria::findOrFail($id);
            
            if ($categoria->eventos()->count() > 0) {
                throw new \Exception('No se puede eliminar porque hay eventos usando esta categoría.', 422);
            }
            
            $categoria->delete();
            return [
                "mensaje" => "Categoría eliminada correctamente"
            ];
        } catch (\Exception $e) {
            //respetams el cofigo de error si ya viene con uno como un 422, o si no, le ponemos 500
            $codigo = $e->getCode() ?: 500;
            throw new \Exception('Error al eliminar categoría: ' . $e->getMessage(),500);
        }
    }



}
