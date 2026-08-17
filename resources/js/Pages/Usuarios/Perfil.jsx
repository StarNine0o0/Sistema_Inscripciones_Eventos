import React, { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import '../../../css/app.css';

export default function Perfil({ usuario_perfil }) {
    const { auth } = usePage().props;
    const usuarioLogeado = auth?.user || {};
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const handleLogout = () => {
        router.post('/logout');
    };

    if (!usuario_perfil) {
        return <div style={{ padding: '20px' }}>Cargando perfil...</div>;
    }

    // Extraemos las relaciones
    const eventosOrganizados = usuario_perfil.eventos_organizados || usuario_perfil.eventosOrganizados || [];
    const inscripciones = usuario_perfil.inscripciones || [];
    const estadoNombre = usuario_perfil.estado_usuario ?? usuario_perfil.estado ?? (usuario_perfil.deleted_at ? 'Inactivo' : 'Activo');
    const esActivo = estadoNombre === 'Activo' || estadoNombre === 1 || estadoNombre === '1';

    return (
        <div className="dashboard-container">
            {/* SIDBAR LATERAL  */}
            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-content">
                    <div className="sidebar-header">
                        {!isCollapsed && (
                            <div className="brand-info">
                                <h2 className="brand-title">UniEvents</h2>
                                <span className="brand-subtitle">
                                    {usuarioLogeado.nombre} ({usuarioLogeado.id_rol === 1 ? 'Admin' : 'Organizador'})
                                </span>
                            </div>
                        )}
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
                        {usuarioLogeado.id_rol === 2 && (
                            <Link href="/eventos" className="nav-item" title={isCollapsed ? "Eventos" : ""}>
                                <span className="material-symbols-outlined nav-icon">calendar_month</span>
                                {!isCollapsed && <span className="nav-text">Eventos</span>}
                            </Link>
                        )}

                        {usuarioLogeado.id_rol === 1 && (
                            <>
                                <Link href="/usuarios" className="nav-item active" title={isCollapsed ? "Usuarios" : ""}>
                                    <span className="material-symbols-outlined nav-icon">group</span>
                                    {!isCollapsed && <span className="nav-text">Usuarios</span>}
                                </Link>
                                <Link href="/categorias" className="nav-item" title={isCollapsed ? "Categorías" : ""}>
                                    <span className="material-symbols-outlined nav-icon">category</span>
                                    {!isCollapsed && <span className="nav-text">Categorías</span>}
                                </Link>
                                <Link href="/sedes" className="nav-item" title={isCollapsed ? "Sedes" : ""}>
                                    <span className="material-symbols-outlined nav-icon">apartment</span>
                                    {!isCollapsed && <span className="nav-text">Sedes</span>}
                                </Link>
                            </>
                        )}
                    </nav>
                </div>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="btn-logout" title={isCollapsed ? "Cerrar Sesión" : ""}>
                        <span className="material-symbols-outlined nav-icon">logout</span>
                        {!isCollapsed && <span className="nav-text">Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <main className="main-content">
                <div className="top-bar" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <Link href="/usuarios" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="page-title">Perfil de Usuario</h1>
                        <p className="page-subtitle">Información detallada y actividad del usuario en el sistema</p>
                    </div>
                </div>

                {/* TARJETA DE INFORMACIÓN DEL USUARIO */}
                <div className="table-panel" style={{ padding: '30px', display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="avatar-circle" style={{ width: '100px', height: '100px', fontSize: '36px' }}>
                        {usuario_perfil.nombre_completo ? usuario_perfil.nombre_completo.charAt(0).toUpperCase() : 'U'}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '24px', margin: '0 0 10px 0', color: '#1e293b' }}>{usuario_perfil.nombre_completo}</h2>
                        <span className={`badge ${esActivo ? 'badge-active' : 'badge-inactive'}`} style={{ marginBottom: '15px', display: 'inline-block' }}>
                            {esActivo ? 'Usuario Activo' : 'Usuario Inactivo'}
                        </span>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '15px' }}>
                            <div>
                                <strong style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Correo Institucional</strong>
                                <p style={{ margin: '5px 0 0 0', color: '#0f172a' }}>{usuario_perfil.correo || usuario_perfil.correo_institucional}</p>
                            </div>
                            <div>
                                <strong style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Matrícula / Empleado</strong>
                                <p style={{ margin: '5px 0 0 0', color: '#0f172a' }}>{usuario_perfil.matricula_empleado}</p>
                            </div>
                            <div>
                                <strong style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Rol en el Sistema</strong>
                                <p style={{ margin: '5px 0 0 0', color: '#0f172a' }}>{usuario_perfil.id_rol === 1 ? 'Administrador' : usuario_perfil.id_rol === 2 ? 'Organizador' : 'Participante'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECCIÓN DE EVENTOS ORGANIZADOS */}
                {usuario_perfil.id_rol === 2 && (
                    <div className="table-panel" style={{ marginTop: '20px' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
                            <h3 style={{ margin: 0, color: '#1e293b' }}>Eventos Organizados ({eventosOrganizados.length})</h3>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Nombre del Evento</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {eventosOrganizados.length > 0 ? (
                                    eventosOrganizados.map(evento => (
                                        <tr key={evento.id_evento}>
                                            <td className="font-semibold">{evento.nombre_evento}</td>
                                            <td>{new Date(evento.fecha_inicio).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge ${evento.estado_evento === 'Publicado' || evento.estado_evento === 'Activo' ? 'badge-active' : 'badge-inactive'}`}>
                                                    {evento.estado_evento}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="empty-table-msg">Este usuario no ha organizado ningún evento.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* SECCIÓN DE INSCRIPCIONES */}
                <div className="table-panel" style={{ marginTop: '20px' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: 0, color: '#1e293b' }}>Historial de Inscripciones ({inscripciones.length})</h3>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID Inscripción</th>
                                <th>Fecha de Registro</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inscripciones.length > 0 ? (
                                inscripciones.map(inscripcion => (
                                    <tr key={inscripcion.id_inscripcion}>
                                        <td className="font-semibold">#{inscripcion.id_inscripcion}</td>
                                        <td>{new Date(inscripcion.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge ${inscripcion.estado_inscripcion === 'Activa' ? 'badge-active' : 'badge-inactive'}`}>
                                                {inscripcion.estado_inscripcion}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="empty-table-msg">Este usuario no tiene inscripciones registradas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </main>
        </div>
    );
}