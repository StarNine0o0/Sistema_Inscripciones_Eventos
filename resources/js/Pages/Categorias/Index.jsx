import React, { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import '../../../css/app.css';

export default function Index({ categorias }) {
    const { auth, errors } = usePage().props;
    const usuarioLogeado = auth?.user || {};

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [nombreCategoria, setNombreCategoria] = useState('');

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const handleLogout = () => {
        router.post('/logout');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
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
                if (err.error) alert(err.error);
            }
        });
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
                        {usuarioLogeado.id_rol === 2 && (
                            <Link href="/eventos" className="nav-item" title={isCollapsed ? "Eventos" : ""}>
                                <span className="material-symbols-outlined nav-icon">calendar_month</span>
                                {!isCollapsed && <span className="nav-text">Eventos</span>}
                            </Link>
                        )}

                        {usuarioLogeado.id_rol === 1 && (
                            <>
                                <Link href="/usuarios" className="nav-item" title={isCollapsed ? "Usuarios" : ""}>
                                    <span className="material-symbols-outlined nav-icon">group</span>
                                    {!isCollapsed && <span className="nav-text">Usuarios</span>}
                                </Link>
                                <Link href="/categorias" className="nav-item active" title={isCollapsed ? "Categorías" : ""}>
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
                        <h1 className="page-title">Gestión de Categorías</h1>
                        <p className="page-subtitle">Administra las categorías disponibles para la clasificación de eventos</p>
                    </div>
                    <button
                        onClick={() => setMostrarFormulario(!mostrarFormulario)}
                        className={mostrarFormulario ? 'btn-secondary' : 'btn-primary'}
                    >
                        <span className="material-symbols-outlined">
                            {mostrarFormulario ? 'close' : 'add'}
                        </span>
                        {mostrarFormulario ? 'Cancelar' : 'Nueva Categoría'}
                    </button>
                </div>

                {/* MENSAJES DE ERROR */}
                {errors && (errors.nombre_categoria || errors.error) && (
                    <div className="alert-error">
                        {errors.nombre_categoria || errors.error}
                    </div>
                )}

                {/* FORMULARIO DE CREACIÓN */}
                {mostrarFormulario && (
                    <div className="panel">
                        <h3 className="panel-title">Registrar Nueva Categoría</h3>
                        <form onSubmit={handleSubmit} className="form-inline">
                            <div className="input-container">
                                <input
                                    type="text"
                                    placeholder="Nombre de la categoría"
                                    required
                                    value={nombreCategoria}
                                    onChange={e => setNombreCategoria(e.target.value)}
                                    className="custom-input"
                                />
                            </div>
                            <button type="submit" className="btn-primary">
                                Guardar Categoría
                            </button>
                        </form>
                    </div>
                )}

                {/* TABLA DE CATEGORÍAS */}
                <div className="panel">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th style={{ width: '80px' }}>ID</th>
                                <th>Nombre de la Categoría</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias && categorias.length > 0 ? (
                                categorias.map(categoria => (
                                    <tr key={categoria.id_categoria}>
                                        <td style={{ fontWeight: '500', color: '#64748b' }}>#{categoria.id_categoria}</td>
                                        <td style={{ fontWeight: '600', color: '#1e293b' }}>{categoria.nombre_categoria}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleEliminar(categoria.id_categoria)}
                                                className="btn-danger"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                                        No hay categorías registradas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}