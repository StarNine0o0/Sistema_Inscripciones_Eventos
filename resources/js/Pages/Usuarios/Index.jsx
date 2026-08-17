import React, { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import '../../../css/app.css';

export default function Index({ usuarios, filtros }) {
    const { auth, errors } = usePage().props;
    const usuarioLogeado = auth?.user || {};

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    // Estado para modal de edición
    const [usuarioEditando, setUsuarioEditando] = useState(null);

    // Estado para preview al hacer hover (Tooltip)
    const [previewUsuario, setPreviewUsuario] = useState(null);
    const [posicionTooltip, setPosicionTooltip] = useState({ top: 0, left: 0 });

    // Estados para búsqueda y filtrado local en el frontend
    const [busqueda, setBusqueda] = useState(filtros?.busqueda || '');
    const [filtroRol, setFiltroRol] = useState(filtros?.rol || '');

    // Formulario de creación
    const [formData, setFormData] = useState({
        nombre_completo: '',
        correo_institucional: '',
        matricula_empleado: '',
        contrasena: '',
        id_rol: ''
    });

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    // Cerrar Sesión
    const handleLogout = () => {
        router.post('/logout');
    };

    // FILTRADO EN TIEMPO REAL (FRONTEND)
    const listaUsuarios = Array.isArray(usuarios) ? usuarios : (usuarios?.data || []);

    const usuariosFiltrados = listaUsuarios.filter((user) => {
        const termino = busqueda.toLowerCase().trim();

        const coincideNombre = user.nombre_completo?.toLowerCase().includes(termino);
        const coincideCorreo = (user.correo || user.correo_institucional)?.toLowerCase().includes(termino);
        const coincideMatricula = user.matricula_empleado?.toLowerCase().includes(termino);
        
        const coincideRol = filtroRol === '' || String(user.id_rol) === String(filtroRol);
        const coincideTexto = termino === '' || coincideNombre || coincideCorreo || coincideMatricula;

        return coincideTexto && coincideRol;
    });

    const handleFiltros = (e) => {
        e.preventDefault();
    };

    // Crear Usuario
    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/usuarios', formData, {
            onSuccess: () => {
                setMostrarFormulario(false);
                setFormData({
                    nombre_completo: '',
                    correo_institucional: '',
                    matricula_empleado: '',
                    contrasena: '',
                    id_rol: ''
                });
                alert('Usuario registrado correctamente');
            }
        });
    };

    // Editar Usuario
    const handleAbrirEditar = (user) => {
        setUsuarioEditando({
            id_usuario: user.id_usuario,
            nombre_completo: user.nombre_completo || '',
            correo_institucional: user.correo_institucional || user.correo || '',
            matricula_empleado: user.matricula_empleado || '',
            id_rol: user.id_rol || ''
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        router.put(`/usuarios/${usuarioEditando.id_usuario}`, usuarioEditando, {
            onSuccess: () => {
                setUsuarioEditando(null);
                alert('Usuario actualizado correctamente');
            }
        });
    };

    // Activar / Desactivar Usuario
    const handleCambiarEstado = (id, estadoActual) => {
        const nuevoEstado = estadoActual === 'Activo' ? 'Inactivo' : 'Activo';
        const accion = estadoActual === 'Activo' ? 'Desactivar' : 'Activar';

        if (!confirm(`¿Seguro que deseas ${accion} este usuario?`)) return;

        router.put(`/usuarios/${id}/estado`, { estado: nuevoEstado }, {
            preserveScroll: true,
        });
    };

    // Handlers para el tooltip flotante con posición fija en viewport
    const handleMouseEnter = (e, user) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPosicionTooltip({
            top: rect.top - 100,
            left: rect.right - 260
        });
        setPreviewUsuario(user);
    };

    const handleMouseLeave = () => {
        setPreviewUsuario(null);
    };

    return (
        <div className="dashboard-container">
            {/* SIDEBAR LATERAL */}
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
                        {/* RUTAS DEL ORGANIZADOR */}
                        {usuarioLogeado.id_rol === 2 && (
                            <Link href="/eventos" className="nav-item" title={isCollapsed ? "Eventos" : ""}>
                                <span className="material-symbols-outlined nav-icon">calendar_month</span>
                                {!isCollapsed && <span className="nav-text">Eventos</span>}
                            </Link>
                        )}

                        {/* RUTAS DEL ADMINISTRADOR */}
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
                           <Link href="/reportes" className="nav-item" title={isCollapsed ? "Reportes" : ""}>
                                    <span className="material-symbols-outlined nav-icon">monitoring</span>
                                    {!isCollapsed && <span className="nav-text">Reportes</span>}
                                </Link>
                    </nav>
                </div>

                {/* BOTÓN CERRAR SESIÓN */}
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="btn-logout" title={isCollapsed ? "Cerrar Sesión" : ""}>
                        <span className="material-symbols-outlined nav-icon">logout</span>
                        {!isCollapsed && <span className="nav-text">Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <main className="main-content">
                <div className="top-bar">
                    <div>
                        <h1 className="page-title">Gestión de Usuarios</h1>
                        <p className="page-subtitle">Administra los usuarios, roles y accesos a la plataforma</p>
                    </div>
                    <button
                        onClick={() => setMostrarFormulario(true)}
                        className="btn-primary"
                    >
                        <span className="material-symbols-outlined">person_add</span>
                        Nuevo Usuario
                    </button>
                </div>

                {/* BUSCADOR Y FILTROS */}
                <div className="table-panel filter-panel">
                    <form onSubmit={handleFiltros} className="filter-form">
                        <div className="search-input-wrapper">
                            <input
                                type="text"
                                className="form-control search-input"
                                placeholder="Buscar por nombre, correo o matrícula..."
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                            />
                            <span className="material-symbols-outlined search-icon">search</span>
                        </div>

                        <select
                            className="form-control select-filter"
                            value={filtroRol}
                            onChange={e => setFiltroRol(e.target.value)}
                        >
                            <option value="">Todos los roles</option>
                            <option value="1">Administrador</option>
                            <option value="2">Organizador</option>
                            <option value="3">Participante</option>

                        </select>
                    </form>
                </div>

                {/* TABLA DE USUARIOS FILTRADOS */}
                <div className="table-panel">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Matrícula</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th className="th-actions">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosFiltrados.length > 0 ? (
                                usuariosFiltrados.map(user => {
                                    const estadoNombre = user.estado_usuario ?? user.estado ?? (user.deleted_at ? 'Inactivo' : 'Activo');
                                    const esActivo = estadoNombre === 'Activo' || estadoNombre === 1 || estadoNombre === '1';

                                    return (
                                        <tr key={user.id_usuario}>
                                            <td>{user.matricula_empleado}</td>
                                            <td className="font-semibold">{user.nombre_completo}</td>
                                            <td>{user.correo || user.correo_institucional}</td>
                                            <td>{user.id_rol === 1 ? 'Admin' : user.id_rol === 2 ? 'Organizador' : 'Participante'}</td>
                                            <td>
                                                <span className={`badge ${esActivo ? 'badge-active' : 'badge-inactive'}`}>
                                                    {esActivo ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="actions-wrapper">
                                                    {/* Ver Perfil */}
                                                    <Link
                                                        href={`/usuarios/${user.id_usuario}`}
                                                        className="btn-action btn-action-view"
                                                        title="Ver perfil"
                                                        onMouseEnter={(e) => handleMouseEnter(e, user)}
                                                        onMouseLeave={handleMouseLeave}
                                                    >
                                                        <span className="material-symbols-outlined">visibility</span>
                                                    </Link>

                                                    {/* Editar */}
                                                    <button
                                                        onClick={() => handleAbrirEditar(user)}
                                                        className="btn-action btn-action-edit"
                                                        title="Editar usuario"
                                                    >
                                                        <span className="material-symbols-outlined">edit</span>
                                                    </button>

                                                    {/* Activar / Desactivar */}
                                                    <button
                                                        onClick={() => handleCambiarEstado(user.id_usuario, esActivo ? 'Activo' : 'Inactivo')}
                                                        className={`btn-action ${esActivo ? 'btn-action-success' : 'btn-action-danger'}`}
                                                        title={esActivo ? "Desactivar usuario" : "Activar usuario"}
                                                    >
                                                        <span className="material-symbols-outlined">
                                                            {esActivo ? 'check_circle' : 'block'}
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="empty-table-msg">
                                        No se encontraron usuarios que coincidan con la búsqueda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* MODAL REGISTRAR USUARIO */}
            {mostrarFormulario && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3 className="modal-title">Registrar Nuevo Usuario</h3>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={() => setMostrarFormulario(false)}
                            >
                                ✕
                            </button>
                        </div>

                        {errors && Object.keys(errors).length > 0 && (
                            <div className="error-messages">
                                {Object.values(errors).map((err, idx) => (
                                    <p key={idx} className="error-text">• {err}</p>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label className="form-label">Nombre completo</label>
                                <input
                                    type="text"
                                    className="form-control2"
                                    placeholder="Ej. Juan Pérez"
                                    required
                                    value={formData.nombre_completo}
                                    onChange={e => setFormData({ ...formData, nombre_completo: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Correo institucional</label>
                                <input
                                    type="email"
                                    className="form-control2"
                                    placeholder="usuario@universidad.edu"
                                    required
                                    value={formData.correo_institucional}
                                    onChange={e => setFormData({ ...formData, correo_institucional: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Matrícula / No. Empleado</label>
                                <input
                                    type="text"
                                    className="form-control2"
                                    placeholder="Ej. A01234567"
                                    required
                                    value={formData.matricula_empleado}
                                    onChange={e => setFormData({ ...formData, matricula_empleado: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control2"
                                    placeholder="••••••••"
                                    required
                                    value={formData.contrasena}
                                    onChange={e => setFormData({ ...formData, contrasena: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Rol</label>
                                <select
                                    className="form-control2"
                                    required
                                    value={formData.id_rol}
                                    onChange={e => setFormData({ ...formData, id_rol: e.target.value })}
                                >
                                    <option value="">-- Seleccionar Rol --</option>
                                    <option value="1">Administrador</option>
                                    <option value="2">Organizador</option>
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button 
                                    type="button" 
                                    onClick={() => setMostrarFormulario(false)} 
                                    className="btn-secondary"
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    Guardar Usuario
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL EDITAR USUARIO */}
            {usuarioEditando && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3 className="modal-title">Editar Usuario</h3>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={() => setUsuarioEditando(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="modal-form">
                            <div className="form-group">
                                <label className="form-label">Nombre completo</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={usuarioEditando.nombre_completo}
                                    onChange={e => setUsuarioEditando({ ...usuarioEditando, nombre_completo: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Correo institucional</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    required
                                    value={usuarioEditando.correo_institucional}
                                    onChange={e => setUsuarioEditando({ ...usuarioEditando, correo_institucional: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Matrícula / No. Empleado</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={usuarioEditando.matricula_empleado}
                                    onChange={e => setUsuarioEditando({ ...usuarioEditando, matricula_empleado: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Rol</label>
                                <select
                                    className="form-control"
                                    required
                                    value={usuarioEditando.id_rol}
                                    onChange={e => setUsuarioEditando({ ...usuarioEditando, id_rol: e.target.value })}
                                >
                                    <option value="1">Administrador</option>
                                    <option value="2">Organizador</option>
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={() => setUsuarioEditando(null)} className="btn-secondary">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TOOLTIP FLOATING PREVIEW */}
            {previewUsuario && (
                <div
                    className="tooltip-preview"
                    style={{
                        position: 'fixed',
                        top: `${posicionTooltip.top}px`,
                        left: `${posicionTooltip.left}px`,
                        zIndex: 9999,
                        pointerEvents: 'none'
                    }}
                >
                    <div className="tooltip-header">
                        <div className="avatar-circle">
                            {previewUsuario.nombre_completo ? previewUsuario.nombre_completo.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <div className="tooltip-name">{previewUsuario.nombre_completo}</div>
                            <div className="tooltip-role">{previewUsuario.id_rol === 1 ? 'Administrador' : previewUsuario.id_rol === 2 ? 'Organizador' : 'Participante'}</div>
                        </div>
                    </div>

                    <div className="tooltip-body">
                        <div><strong>Matrícula:</strong> {previewUsuario.matricula_empleado}</div>
                        <div><strong>Correo:</strong> {previewUsuario.correo || previewUsuario.correo_institucional}</div>
                        <div><strong>Estado:</strong> {previewUsuario.estado || (previewUsuario.deleted_at ? 'Inactivo' : 'Activo')}</div>
                    </div>
                </div>
            )}
        </div>
    );
}