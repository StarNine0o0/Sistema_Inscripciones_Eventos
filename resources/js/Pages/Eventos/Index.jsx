import React, { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react'; // IMPORTANTE: Agregamos usePage
import axios from 'axios';

export default function Index({ eventos, sedes, categorias, filtros }) {
    // 1. Extraemos al usuario logeado usando Inertia
    const { auth } = usePage().props;
    const usuario = auth?.user || {};

    // Estados para el formulario de crear
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [erroresBackend, setErroresBackend] = useState(null);
    const [formData, setFormData] = useState({
        nombre_evento: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_fin: '',
        capacidad_maxima: '',
        id_categoria: '', 
        id_organizador: usuario.id, // Opcional: autocompletar el organizador con el usuario actual
        id_sede: '',        
        imagen_portada: null
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErroresBackend(null);

        const data = new FormData();
        for (const key in formData) {
            if(formData[key] !== null && formData[key] !== '') {
                data.append(key, formData[key]);
            }
        }

        try {
            const response = await axios.post('/eventos', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            alert(response.data.mensaje);
            setMostrarFormulario(false);
            router.reload(); 
            
        } catch (error) {
            if (error.response && error.response.data.error) {
                setErroresBackend(error.response.data.error);
            } else if (error.response && error.response.data.errors) {
                const mensajesErrores = Object.values(error.response.data.errors).flat().join(' | ');
                setErroresBackend("Faltan datos: " + mensajesErrores);
            }
        }
    };

    const handleCambiarEstado = async (id, nuevoEstado) => {
        try {
            const response = await axios.put(`/eventos/${id}/estado`, {
                estado_evento: nuevoEstado
            });
            
            alert(response.data.mensaje);
            router.reload(); 
            
        } catch (error) {
            if (error.response && error.response.data.error) {
                alert("ERROR BACKEND: " + error.response.data.error);
            }
        }
    };

    const handleEliminar = async (id) => {
        if (!confirm('¿Seguro que deseas eliminar este evento?')) return;
        
        try {
            await axios.delete(`/eventos/${id}`);
            alert('Evento eliminado');
            router.reload();
        } catch (error) {
            alert('Error al eliminar');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            
            {/* SIDEBAR DINÁMICO */}
            <div style={{ width: '250px', background: '#1f2937', color: 'white', padding: '20px' }}>
                <h2>Mi Proyecto</h2>
                
                {/* Mostramos qué usuario está logeado (Opcional, para UX) */}
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '20px' }}>
                    Conectado como: {usuario.nombre} ({usuario.id_rol === 1 ? 'Admin' : 'Organizador'})
                </div>

                <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
                    
                {/* ENLACES SOLO PARA ORGANIZADOR (Rol 2) */}
                {usuario.id_rol === 2 && (
                    <li style={{ marginBottom: '15px' }}>
                        <Link href="/eventos" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 'bold' }}>
                            📅 Eventos
                        </Link>
                    </li>
                )}

                    {/* ENLACES SOLO PARA ADMINISTRADOR */}
                    {usuario.id_rol === 1 && (
                        <>
                            <li style={{ marginBottom: '15px' }}>
                                <Link href="/usuarios" style={{ color: 'white', textDecoration: 'none' }}>👥 Usuarios</Link>
                            </li>
                            <li style={{ marginBottom: '15px' }}>
                                <Link href="/categorias" style={{ color: 'white', textDecoration: 'none' }}>🏷️ Categorías</Link>
                            </li>
                            <li style={{ marginBottom: '15px' }}>
                                <Link href="/sedes" style={{ color: 'white', textDecoration: 'none' }}>🏢 Sedes</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>

            {/* CONTENIDO PRINCIPAL (Sin cambios en tu código original) */}
            <div style={{ flex: 1, padding: '30px', background: '#f3f4f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>Gestión de Eventos</h1>
                    <button 
                        onClick={() => setMostrarFormulario(!mostrarFormulario)}
                        style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        {mostrarFormulario ? 'Cancelar' : '+ Nuevo Evento'}
                    </button>
                </div>

                {mostrarFormulario && (
                    <div style={{ background: 'white', padding: '20px', marginTop: '20px', borderRadius: '8px', border: '1px solid #ccc' }}>
                        <h3>Crear Evento de Prueba</h3>
                        
                        {erroresBackend && (
                            <div style={{ background: '#fecaca', color: '#991b1b', padding: '10px', marginBottom: '15px' }}>
                                {erroresBackend}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', maxWidth: '500px' }}>
                            <input type="text" placeholder="Nombre del evento" required 
                                onChange={e => setFormData({...formData, nombre_evento: e.target.value})} />
                            
                            <textarea placeholder="Descripción" required 
                                onChange={e => setFormData({...formData, descripcion: e.target.value})}></textarea>
                            
                            <label>Fecha Inicio:</label>
                            <input type="datetime-local" required 
                                onChange={e => setFormData({...formData, fecha_inicio: e.target.value})} />
                            
                            <label>Fecha Fin:</label>
                            <input type="datetime-local" required 
                                onChange={e => setFormData({...formData, fecha_fin: e.target.value})} />
                            
                            <input type="number" placeholder="Capacidad Máxima (ej. 50)" required 
                                onChange={e => setFormData({...formData, capacidad_maxima: e.target.value})} />
                            
                            <label>Imagen (Opcional):</label>
                            <input type="file" onChange={e => setFormData({...formData, imagen_portada: e.target.files[0]})} />

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Sede:</label>
                                <select 
                                    value={formData.id_sede} 
                                    onChange={e => setFormData({...formData, id_sede: e.target.value})}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    required
                                >
                                    <option value="">-- Selecciona una Sede --</option>
                                    {sedes && sedes.map(sede => (
                                        <option key={sede.id_sede} value={sede.id_sede}>
                                            {sede.nombre_sede}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Categoría:</label>
                                <select 
                                    value={formData.id_categoria} 
                                    onChange={e => setFormData({...formData, id_categoria: e.target.value})}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    required
                                >
                                    <option value="">-- Selecciona una Categoría --</option>
                                    {categorias && categorias.map(categoria => (
                                        <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                            {categoria.nombre_categoria}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <button type="submit" style={{ padding: '10px', background: '#10b981', color: 'white', border: 'none', cursor: 'pointer' }}>Guardar Evento</button>
                        </form>
                    </div>
                )}

                <div style={{ background: 'white', marginTop: '30px', borderRadius: '8px', padding: '20px', overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #eee' }}>
                                <th>ID</th>
                                <th>Título</th>
                                <th>Fecha Inicio</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {eventos.data && eventos.data.length > 0 ? (
                                eventos.data.map(evento => (
                                    <tr key={evento.id_evento} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '10px 0' }}>{evento.id_evento}</td>
                                        <td>{evento.nombre_evento}</td>
                                        <td>{new Date(evento.fecha_inicio).toLocaleString()}</td>
                                        <td>
                                            <strong style={{ 
                                                color: evento.estado_evento === 'Publicado' ? 'green' : 
                                                       evento.estado_evento === 'Cancelado' ? 'red' : 'gray' 
                                            }}>
                                                {evento.estado_evento}
                                            </strong>
                                        </td>
                                        <td>
                                            {evento.estado_evento === 'Borrador' && (
                                                <button onClick={() => handleCambiarEstado(evento.id_evento, 'Publicado')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '5px 10px', marginRight: '5px', cursor: 'pointer' }}>
                                                    Publicar
                                                </button>
                                            )}
                                            {evento.estado_evento === 'Publicado' && (
                                                <button onClick={() => handleCambiarEstado(evento.id_evento, 'Cancelado')} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '5px 10px', marginRight: '5px', cursor: 'pointer' }}>
                                                    Cancelar
                                                </button>
                                            )}
                                            
                                            <button onClick={() => handleEliminar(evento.id_evento)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No hay eventos registrados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    
                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                        {eventos.links && eventos.links.map((link, index) => (
                            link.url ? (
                                <Link 
                                    key={index} 
                                    href={link.url} 
                                    style={{ padding: '5px 10px', background: link.active ? '#3b82f6' : '#e5e7eb', color: link.active ? 'white' : 'black', textDecoration: 'none', borderRadius: '4px' }}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span 
                                    key={index} 
                                    style={{ padding: '5px 10px', background: '#f3f4f6', color: '#9ca3af', borderRadius: '4px' }}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}