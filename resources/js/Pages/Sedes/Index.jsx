import React, { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';

export default function Index({ sedes }) {
    // Extraemos al usuario y los posibles errores/mensajes flash de Inertia
    const { auth, errors } = usePage().props;
    const usuario = auth?.user || {};

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    
    // Como son dos campos, usamos un objeto para el estado
    const [formData, setFormData] = useState({
        nombre_sede: '',
        capacidad_sede: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        router.post('/sedes', formData, {
            onSuccess: () => {
                setMostrarFormulario(false);
                setFormData({ nombre_sede: '', capacidad_sede: '' }); // Limpiamos el form
                alert('Sede registrada correctamente');
            }
        });
    };

    const handleEliminar = (id) => {
        if (!confirm('¿Seguro que deseas eliminar esta sede?')) return;
        
        router.delete(`/sedes/${id}`, {
            onError: (err) => {
                // Muestra el error si intentas borrar una sede con eventos
                if(err.error) alert(err.error); 
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
                                <Link href="/categorias" style={{ color: 'white', textDecoration: 'none' }}>🏷️ Categorías</Link>
                            </li>
                            <li style={{ marginBottom: '15px' }}>
                                <Link href="/sedes" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 'bold' }}>🏢 Sedes</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div style={{ flex: 1, padding: '30px', background: '#f3f4f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>Gestión de Sedes</h1>
                    <button 
                        onClick={() => setMostrarFormulario(!mostrarFormulario)}
                        style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        {mostrarFormulario ? 'Cancelar' : '+ Nueva Sede'}
                    </button>
                </div>

                {/* Mostrar error de eliminación (cuando tiene eventos vinculados) */}
                {errors && errors.error && (
                    <div style={{ background: '#fecaca', color: '#991b1b', padding: '10px', marginTop: '15px', borderRadius: '5px' }}>
                        {errors.error}
                    </div>
                )}

                {mostrarFormulario && (
                    <div style={{ background: 'white', padding: '20px', marginTop: '20px', borderRadius: '8px', border: '1px solid #ccc' }}>
                        <h3>Crear Sede</h3>
                        
                        {/* Mostrar errores de validación de Laravel para los inputs */}
                        {(errors.nombre_sede || errors.capacidad_sede) && (
                            <div style={{ color: '#991b1b', marginBottom: '10px', fontSize: '14px' }}>
                                {errors.nombre_sede && <p style={{margin: '0 0 5px 0'}}>• {errors.nombre_sede}</p>}
                                {errors.capacidad_sede && <p style={{margin: 0}}>• {errors.capacidad_sede}</p>}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <input 
                                type="text" 
                                placeholder="Nombre de la sede (ej. Auditorio)" 
                                required 
                                value={formData.nombre_sede}
                                onChange={e => setFormData({...formData, nombre_sede: e.target.value})} 
                                style={{ flex: 2, padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' }}
                            />
                            <input 
                                type="number" 
                                placeholder="Capacidad máxima" 
                                required 
                                value={formData.capacidad_sede}
                                onChange={e => setFormData({...formData, capacidad_sede: e.target.value})} 
                                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '150px' }}
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
                                <th>Nombre de la Sede</th>
                                <th>Capacidad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sedes && sedes.length > 0 ? (
                                sedes.map(sede => (
                                    <tr key={sede.id_sede} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '15px 0' }}>{sede.id_sede}</td>
                                        <td>{sede.nombre_sede}</td>
                                        <td>{sede.capacidad_sede} personas</td>
                                        <td>
                                            <button onClick={() => handleEliminar(sede.id_sede)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No hay sedes registradas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}