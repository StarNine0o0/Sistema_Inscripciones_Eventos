import React, { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import '../../../css/app.css';

export default function Index({ sedes }) {
    const { auth, errors } = usePage().props;
    const usuario = auth?.user || {};

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [formData, setFormData] = useState({
        nombre_sede: '',
        capacidad_sede: ''
    });

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        router.post('/sedes', formData, {
            onSuccess: () => {
                setMostrarFormulario(false);
                setFormData({ nombre_sede: '', capacidad_sede: '' });
                alert('Sede registrada correctamente');
            }
        });
    };

    const handleEliminar = (id) => {
        if (!confirm('¿Seguro que deseas eliminar esta sede?')) return;
        
        router.delete(`/sedes/${id}`, {
            onError: (err) => {
                if (err.error) alert(err.error); 
            }
        });
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="dashboard-container">
            {/* SIDEBAR LATERAL */}
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
                            <Link href="/eventos" className="nav-item">
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
                                <Link href="/sedes" className="nav-item active">
                                    <span className="material-symbols-outlined nav-icon">apartment</span>
                                    <span className="nav-text">Sedes</span>
                                </Link>
                                <Link href="/eventos" className="nav-item">
                                    <span className="material-symbols-outlined nav-icon">calendar_month</span>
                                    <span className="nav-text">Eventos</span>
                                </Link>
                            </>
                        )}
                    </nav>
                </div>

                {/* FOOTER DEL SIDEBAR (BOTÓN LOGOUT) */}
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="btn-logout">
                        <span className="material-symbols-outlined">logout</span>
                        <span className="nav-text">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* ÁREA DE CONTENIDO PRINCIPAL */}
            <main className="main-content">
                {/* CABECERA */}
                <div className="top-bar">
                    <div>
                        <h1 className="page-title">Gestión de Sedes</h1>
                        <p className="page-subtitle">Administra los lugares y capacidades del campus</p>
                    </div>
                    <button 
                        onClick={() => setMostrarFormulario(!mostrarFormulario)} 
                        className={mostrarFormulario ? 'btn-secondary' : 'btn-primary'}
                    >
                        <span className="material-symbols-outlined">
                            {mostrarFormulario ? 'close' : 'add'}
                        </span>
                        {mostrarFormulario ? 'Cancelar' : 'Nueva Sede'}
                    </button>
                </div>

                {/* ALERTA DE ERRORES */}
                {errors && errors.error && (
                    <div className="alert-error">
                        {errors.error}
                    </div>
                )}

                {/* FORMULARIO DE CREACIÓN */}
                {mostrarFormulario && (
                    <div className="panel">
                        <h3 className="panel-title">Crear Nueva Sede</h3>
                        
                        {(errors.nombre_sede || errors.capacidad_sede) && (
                            <div className="alert-error" style={{ marginBottom: '12px' }}>
                                {errors.nombre_sede && <p style={{ margin: '0 0 4px 0' }}>• {errors.nombre_sede}</p>}
                                {errors.capacidad_sede && <p style={{ margin: 0 }}>• {errors.capacidad_sede}</p>}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="form-inline">
                            <div className="input-container" style={{ flex: 2 }}>
                                <input 
                                    type="text" 
                                    className="custom-input"
                                    placeholder="Nombre de la sede (ej. Auditorio Principal)" 
                                    required 
                                    value={formData.nombre_sede}
                                    onChange={e => setFormData({ ...formData, nombre_sede: e.target.value })} 
                                />
                            </div>
                            <div className="input-container" style={{ flex: 1 }}>
                                <input 
                                    type="number" 
                                    className="custom-input"
                                    placeholder="Capacidad máxima" 
                                    required 
                                    value={formData.capacidad_sede}
                                    onChange={e => setFormData({ ...formData, capacidad_sede: e.target.value })} 
                                />
                            </div>
                            <button type="submit" className="btn-primary">
                                Guardar
                            </button>
                        </form>
                    </div>
                )}

                {/* TABLA DE SEDES */}
                <div className="panel">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre de la Sede</th>
                                <th>Capacidad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sedes && sedes.length > 0 ? (
                                sedes.map(sede => (
                                    <tr key={sede.id_sede}>
                                        <td>{sede.id_sede}</td>
                                        <td style={{ fontWeight: '600' }}>{sede.nombre_sede}</td>
                                        <td>{sede.capacidad_sede} personas</td>
                                        <td>
                                            <button 
                                                onClick={() => handleEliminar(sede.id_sede)} 
                                                className="btn-danger"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                                        No hay sedes registradas.
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