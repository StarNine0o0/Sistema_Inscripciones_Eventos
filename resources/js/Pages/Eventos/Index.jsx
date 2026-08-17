import React, { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react'; 
import axios from 'axios';

import GestionInscripciones from './GestionInscripciones';
import FormularioEventoModal from './FormularioEventoModal';
import '../Dashboard/Dashboard.css';

export default function Index({ eventos, sedes, categorias, filtros }) {
    const { auth } = usePage().props;
    const usuario = auth?.user || {};

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [eventoParaGestionar, setEventoParaGestionar] = useState(null);
    const [modalFormularioAbierto, setModalFormularioAbierto] = useState(false);
    const [eventoEnEdicion, setEventoEnEdicion] = useState(null);

    const [valoresFiltros, setValoresFiltros] = useState({
        id_categoria: filtros?.id_categoria || '',
        estado_evento: filtros?.estado_evento || '',
        fecha_inicio: filtros?.fecha_inicio || '',
    });

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const aplicarFiltros = (e) => {
        e.preventDefault();
        router.get('/eventos', valoresFiltros, { preserveState: true, replace: true });
    };
    
    const limpiarFiltros = () => {
        setValoresFiltros({ id_categoria: '', estado_evento: '', fecha_inicio: '' });
        router.get('/eventos', {}, { preserveState: true, replace: true });
    };

    const handleAbrirNuevo = () => {
        setEventoEnEdicion(null);
        setModalFormularioAbierto(true);
    };

    const handleEditar = (evento) => {
        setEventoEnEdicion(evento);
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

    const handleLogout = () => {
            router.post('/logout');
        };

    return (
        <div className="dashboard-container">
            {/* SIDEBAR LATERAL AZUL */}
            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-content">
                    <div className="sidebar-header">
                        <div className="brand-info">
                            <h2 className="brand-title">UniEvents</h2>
                            <span className="brand-subtitle">
                                {usuario.nombre} ({usuario.id_rol === 1 ? 'Admin' : 'Organizador'})
                            </span>
                        </div>
                        <button 
                            className="menu-toggle" 
                            onClick={toggleSidebar} 
                            title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
                        >
                            <span className="material-symbols-outlined">
                                {isCollapsed ? 'menu' : 'chevron_left'}
                            </span>
                        </button>
                    </div>

                    <nav className="sidebar-nav">
                        {usuario.id_rol === 2 && (
                            <Link href="/eventos" className="nav-item active">
                                <span className="material-symbols-outlined nav-icon">calendar_month</span>
                                <span className="nav-text">Eventos</span>
                            </Link>
                        )}

                        {usuario.id_rol === 1 && (
                            <>
                                <Link href="/usuarios" className="nav-item">
                                    <span className="material-symbols-outlined nav-icon">group</span>
                                    <span className="nav-text">Usuarios</span>
                                </Link>
                                <Link href="/categorias" className="nav-item">
                                    <span className="material-symbols-outlined nav-icon">category</span>
                                    <span className="nav-text">Categorías</span>
                                </Link>
                                <Link href="/sedes" className="nav-item">
                                    <span className="material-symbols-outlined nav-icon">apartment</span>
                                    <span className="nav-text">Sedes</span>
                                </Link>
                                <Link href="/eventos" className="nav-item active">
                                    <span className="material-symbols-outlined nav-icon">calendar_month</span>
                                    <span className="nav-text">Eventos</span>
                                </Link>
                            </>
                        )}
                        <Link href="/reportes" className="nav-item" title={isCollapsed ? "Reportes" : ""}>
                            <span className="material-symbols-outlined nav-icon">monitoring</span>
                            {!isCollapsed && <span className="nav-text">Reportes</span>}
                        </Link>
                    </nav>
                </div>

                {/* FOOTER DEL SIDEBAR */}
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="btn-logout">
                        <span className="material-symbols-outlined">logout</span>
                        <span className="nav-text">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* ÁREA DE CONTENIDO PRINCIPAL */}
            <main className="main-content">
                <div className="top-bar">
                    <div>
                        <h1 className="page-title">Gestión de Eventos</h1>
                        <p className="page-subtitle">Administra los eventos de la plataforma</p>
                    </div>
                    <button onClick={handleAbrirNuevo} className="btn-primary">
                        <span className="material-symbols-outlined">add</span>
                        Nuevo Evento
                    </button>
                </div>

                {/* BARRA DE FILTROS 
                <div className="table-panel" style={{ marginBottom: '24px' }}>
                    <form onSubmit={aplicarFiltros} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                                Categoría
                            </label>
                            <select 
                                value={valoresFiltros.id_categoria} 
                                onChange={e => setValoresFiltros({...valoresFiltros, id_categoria: e.target.value})}
                                style={{ padding: '8px 14px', borderRadius: '9999px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '14px', outline: 'none' }}
                            >
                                <option value="">Todas</option>
                                {categorias && categorias.map(cat => (
                                    <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre_categoria}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                                Estado
                            </label>
                            <select 
                                value={valoresFiltros.estado_evento} 
                                onChange={e => setValoresFiltros({...valoresFiltros, estado_evento: e.target.value})}
                                style={{ padding: '8px 14px', borderRadius: '9999px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '14px', outline: 'none' }}
                            >
                                <option value="">Todos</option>
                                <option value="Borrador">Borrador</option>
                                <option value="Publicado">Publicado</option>
                                <option value="Cancelado">Cancelado</option>
                                <option value="Finalizado">Finalizado</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                                A partir de la fecha
                            </label>
                            <input 
                                type="date" 
                                value={valoresFiltros.fecha_inicio}
                                onChange={e => setValoresFiltros({...valoresFiltros, fecha_inicio: e.target.value})}
                                style={{ padding: '8px 14px', borderRadius: '9999px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '14px', outline: 'none' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button type="submit" className="btn-primary" style={{ padding: '8px 18px', fontSize: '14px' }}>
                                Filtrar
                            </button>
                            <button type="button" onClick={limpiarFiltros} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '14px' }}>
                                Limpiar
                            </button>
                        </div>
                    </form>
                </div>*/}

                {/* TABLA DE EVENTOS */}
                <div className="table-panel">
                    <table className="data-table">
                        <thead>
                            <tr>
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
                                    <tr key={evento.id_evento}>
                                        <td>{evento.id_evento}</td>
                                        <td style={{ fontWeight: '600' }}>{evento.nombre_evento}</td>
                                        <td>{new Date(evento.fecha_inicio).toLocaleString()}</td>
                                        <td>
                                            <span className={`status-tag ${evento.estado_evento === 'Publicado' ? 'active' : 'inactive'}`}>
                                                {evento.estado_evento}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                                <button 
                                                    onClick={() => setEventoParaGestionar(evento)} 
                                                    className="btn-secondary" 
                                                    title="Gestión de Inscripciones"
                                                    style={{ padding: '6px 8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>group</span>
                                                </button>

                                                <button 
                                                    onClick={() => handleEditar(evento)} 
                                                    className="btn-secondary" 
                                                    title="Editar Evento"
                                                    style={{ padding: '6px 8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                                                </button>

                                                {evento.estado_evento === 'Borrador' && (
                                                    <button 
                                                        onClick={() => handleCambiarEstado(evento.id_evento, 'Publicado')} 
                                                        className="btn-primary" 
                                                        title="Publicar Evento"
                                                        style={{ padding: '6px 8px', backgroundColor: '#16a34a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                                    >
                                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>publish</span>
                                                    </button>
                                                )}

                                                {evento.estado_evento === 'Publicado' && (
                                                    <button 
                                                        onClick={() => handleCambiarEstado(evento.id_evento, 'Cancelado')} 
                                                        className="btn-primary" 
                                                        title="Cancelar Evento"
                                                        style={{ padding: '6px 8px', backgroundColor: '#dc2626', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                                    >
                                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>cancel</span>
                                                    </button>
                                                )}
                                                
                                                <button 
                                                    onClick={() => handleEliminar(evento.id_evento)} 
                                                    className="btn-secondary" 
                                                    title="Eliminar Evento"
                                                    style={{ padding: '6px 8px', color: '#b91c1c', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                                        No hay eventos registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    
                    {/* PAGINACIÓN */}
                    <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
                        {eventos.links && eventos.links.map((link, index) => (
                            link.url ? (
                                <Link 
                                    key={index} 
                                    href={link.url} 
                                    className={`btn-secondary ${link.active ? 'active' : ''}`}
                                    style={{ 
                                        padding: '6px 12px', 
                                        fontSize: '13px', 
                                        backgroundColor: link.active ? '#1e3a8a' : '#ffffff',
                                        color: link.active ? '#ffffff' : '#334155'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span 
                                    key={index} 
                                    style={{ padding: '6px 12px', fontSize: '13px', color: '#94a3b8' }}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )
                        ))}
                    </div>
                </div>
            </main>

            {/* MODALES REUTILIZABLES */}
            {modalFormularioAbierto && (
                <FormularioEventoModal 
                    eventoParaEditar={eventoEnEdicion}
                    sedes={sedes}
                    categorias={categorias}
                    onClose={() => setModalFormularioAbierto(false)}
                />
            )}

            {eventoParaGestionar && (
                <GestionInscripciones 
                    evento={eventoParaGestionar}
                    onClose={() => setEventoParaGestionar(null)} 
                />
            )}              
        </div>
    );
}