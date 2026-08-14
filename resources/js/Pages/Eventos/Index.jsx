import React, { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react'; 
import axios from 'axios';


import GestionInscripciones from './GestionInscripciones';
import FormularioEventoModal from './FormularioEventoModal';

export default function Index({ eventos, sedes, categorias, filtros }) {

    // Extraemos al usuario logeado usando Inertia
    const { auth } = usePage().props;
    const usuario = auth?.user || {};

    // Estados para controlar qué modal está abierto
    const [eventoParaGestionar, setEventoParaGestionar] = useState(null); // Modal Inscripciones
    const [modalFormularioAbierto, setModalFormularioAbierto] = useState(false); // Modal Crear/Editar
    const [eventoEnEdicion, setEventoEnEdicion] = useState(null); // Datos del evento a editar

    //funciones de filtros isset
    const [valoresFiltros, setValoresFiltros] = useState({
        id_categoria: '',
        estado_evento: '',
        fecha_inicio: '',
    });

    //mandamos las variables por la url y con el preserveState: true, replace: true para que no se recargue la pagina o parpadie para mejor ux
    const aplicarFiltros = (e) => {
        e.preventDefault();
        router.get('/eventos', valoresFiltros, { preserveState: true, replace: true });
    }
    
    const limpiarFiltros = () => {
        setValoresFiltros({ id_categoria: '', estado_evento: '', fecha_inicio: '' });
        router.get('/eventos', {}, { preserveState: true, replace: true });
    };

    // Funciones para abrir los modales
    const handleAbrirNuevo = () => {
        setEventoEnEdicion(null); // Null significa que es un evento nuevo
        setModalFormularioAbierto(true);
    };

    const handleEditar = (evento) => {
        setEventoEnEdicion(evento); // Le pasamos todo el evento para que se llene
        setModalFormularioAbierto(true);
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
                
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '20px' }}>
                    Conectado como: {usuario.nombre} ({usuario.id_rol === 1 ? 'Admin' : 'Organizador'})
                </div>

                <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
                {usuario.id_rol === 2 && (
                    <li style={{ marginBottom: '15px' }}>
                        <Link href="/eventos" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 'bold' }}>
                            📅 Eventos
                        </Link>
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
                                <Link href="/sedes" style={{ color: 'white', textDecoration: 'none' }}>🏢 Sedes</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div style={{ flex: 1, padding: '30px', background: '#f3f4f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>Gestión de Eventos</h1>
                    <button 
                        onClick={handleAbrirNuevo}
                        style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        + Nuevo Evento
                    </button>
                </div>

                 {/* NUEVO: BARRA DE FILTROS */}
                <div style={{ background: 'white', marginTop: '20px', padding: '15px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <form onSubmit={aplicarFiltros} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Categoría:</label>
                            <select 
                                value={valoresFiltros.id_categoria} 
                                onChange={e => setValoresFiltros({...valoresFiltros, id_categoria: e.target.value})}
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '150px' }}
                            >
                                <option value="">Todas</option>
                                {categorias && categorias.map(cat => (
                                    <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre_categoria}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Estado:</label>
                            <select 
                                value={valoresFiltros.estado_evento} 
                                onChange={e => setValoresFiltros({...valoresFiltros, estado_evento: e.target.value})}
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '150px' }}
                            >
                                <option value="">Todos</option>
                                <option value="Borrador">Borrador</option>
                                <option value="Publicado">Publicado</option>
                                <option value="Cancelado">Cancelado</option>
                                <option value="Finalizado">Finalizado</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>A partir de la fecha:</label>
                            <input 
                                type="date" 
                                value={valoresFiltros.fecha_inicio}
                                onChange={e => setValoresFiltros({...valoresFiltros, fecha_inicio: e.target.value})}
                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" style={{ padding: '8px 15px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                🔍 Filtrar
                            </button>
                            <button type="button" onClick={limpiarFiltros} style={{ padding: '8px 15px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                🧹 Limpiar
                            </button>
                        </div>
                    </form>
                </div>

                {/* TABLA DE EVENTOS */}
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
                                            {/* BOTONES DE ACCIÓN */}
                                            <button 
                                                onClick={() => setEventoParaGestionar(evento)} 
                                                style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '5px 10px', marginRight: '5px', cursor: 'pointer', borderRadius: '4px' }}>
                                                👥 Inscripciones
                                            </button>

                                            <button 
                                                onClick={() => handleEditar(evento)} 
                                                style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '5px 10px', marginRight: '5px', cursor: 'pointer', borderRadius: '4px' }}>
                                                ✏️ Editar
                                            </button>

                                            {evento.estado_evento === 'Borrador' && (
                                                <button onClick={() => handleCambiarEstado(evento.id_evento, 'Publicado')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '5px 10px', marginRight: '5px', cursor: 'pointer', borderRadius: '4px' }}>
                                                    Publicar
                                                </button>
                                            )}
                                            {evento.estado_evento === 'Publicado' && (
                                                <button onClick={() => handleCambiarEstado(evento.id_evento, 'Cancelado')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', marginRight: '5px', cursor: 'pointer', borderRadius: '4px' }}>
                                                    Cancelar
                                                </button>
                                            )}
                                            
                                            <button onClick={() => handleEliminar(evento.id_evento)} style={{ background: '#111827', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>
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
            
            {/* RENDERIZADO DE MODALES */}

            {/* Modal 1: Crear/Editar Evento */}
            {modalFormularioAbierto && (
                <FormularioEventoModal 
                    eventoParaEditar={eventoEnEdicion}
                    sedes={sedes}
                    categorias={categorias}
                    onClose={() => setModalFormularioAbierto(false)}
                />
            )}

            {/* Modal 2: Gestionar Inscripciones */} 
            {eventoParaGestionar && (
                <GestionInscripciones 
                    evento={eventoParaGestionar}
                    onClose={() => setEventoParaGestionar(null)} 
                />
            )}               
        </div>
    );
}