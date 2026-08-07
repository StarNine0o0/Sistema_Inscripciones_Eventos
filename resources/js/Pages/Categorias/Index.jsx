import React, { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';

export default function Index({ categorias }) {
    // Extraemos al usuario y los posibles errores/mensajes flash de Inertia
    const { auth, errors } = usePage().props;
    const usuario = auth?.user || {};

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [nombreCategoria, setNombreCategoria] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Usamos router de Inertia (es más limpio que axios cuando no hay imágenes)
        router.post('/categorias', { nombre_categoria: nombreCategoria }, {
            onSuccess: () => {
                setMostrarFormulario(false);
                setNombreCategoria('');
                alert('Categoría registrada correctamente');
            }
        });
    };

    const handleEliminar = (id) => {
        if (!confirm('¿Seguro que deseas eliminar esta categoría?')) return;
        
        router.delete(`/categorias/${id}`, {
            onError: (err) => {
                if(err.error) alert(err.error); // Muestra el error de "tiene eventos asociados"
            }
        });
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            
            {/* SIDEBAR DINÁMICO */}
            <div style={{ width: '250px', background: '#1f2937', color: 'white', padding: '20px' }}>
                <h2>Mi Proyecto</h2>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '20px' }}>
                    Conectado como: {usuario.nombre} (Admin)
                </div>

                <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
                    {usuario.id_rol === 2 && (
                        <li style={{ marginBottom: '15px' }}>
                            <Link href="/eventos" style={{ color: 'white', textDecoration: 'none' }}>📅 Eventos</Link>
                        </li>
                    )}
                    {usuario.id_rol === 1 && (
                        <>
                            <li style={{ marginBottom: '15px' }}>
                                <Link href="/usuarios" style={{ color: 'white', textDecoration: 'none' }}>👥 Usuarios</Link>
                            </li>
                            <li style={{ marginBottom: '15px' }}>
                                <Link href="/categorias" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 'bold' }}>🏷️ Categorías</Link>
                            </li>
                            <li style={{ marginBottom: '15px' }}>
                                <Link href="/sedes" style={{ color: 'white', textDecoration: 'none' }}>🏢 Sedes</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div style={{ flex: 1, padding: '30px', background: '#f3f4f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>Gestión de Categorías</h1>
                    <button 
                        onClick={() => setMostrarFormulario(!mostrarFormulario)}
                        style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        {mostrarFormulario ? 'Cancelar' : '+ Nueva Categoría'}
                    </button>
                </div>

                {/* Mostrar errores de validación de Laravel (como el unique) */}
                {errors && errors.nombre_categoria && (
                    <div style={{ background: '#fecaca', color: '#991b1b', padding: '10px', marginTop: '15px', borderRadius: '5px' }}>
                        {errors.nombre_categoria}
                    </div>
                )}
                
                {/* Mostrar error de eliminación (cuando tiene eventos) */}
                {errors && errors.error && (
                    <div style={{ background: '#fecaca', color: '#991b1b', padding: '10px', marginTop: '15px', borderRadius: '5px' }}>
                        {errors.error}
                    </div>
                )}

                {mostrarFormulario && (
                    <div style={{ background: 'white', padding: '20px', marginTop: '20px', borderRadius: '8px', border: '1px solid #ccc' }}>
                        <h3>Crear Categoría</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <input 
                                type="text" 
                                placeholder="Nombre de la categoría" 
                                required 
                                value={nombreCategoria}
                                onChange={e => setNombreCategoria(e.target.value)} 
                                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                            <button type="submit" style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Guardar
                            </button>
                        </form>
                    </div>
                )}

                <div style={{ background: 'white', marginTop: '30px', borderRadius: '8px', padding: '20px', overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #eee' }}>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias && categorias.length > 0 ? (
                                categorias.map(categoria => (
                                    <tr key={categoria.id_categoria} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '15px 0' }}>{categoria.id_categoria}</td>
                                        <td>{categoria.nombre_categoria}</td>
                                        <td>
                                            <button onClick={() => handleEliminar(categoria.id_categoria)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>No hay categorías registradas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}