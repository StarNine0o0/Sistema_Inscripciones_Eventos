import React, { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import '../../../css/app.css';

export default function Index() {
    const { auth } = usePage().props;
    const usuarioLogeado = auth?.user || {};
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="dashboard-container">
            {/* SIDEBAR LATERAL (Diseño Pro) */}
            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-content">
                    <div className="sidebar-header">
                        {!isCollapsed && (
                            <div className="brand-info">
                                <h2 className="brand-title">UniEvents</h2>
                                <span className="brand-subtitle">
                                    {usuarioLogeado.nombre_completo || usuarioLogeado.nombre} ({usuarioLogeado.id_rol === 1 ? 'Admin' : 'Organizador'})
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
                                <Link href="/usuarios" className="nav-item" title={isCollapsed ? "Usuarios" : ""}>
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

                        {/* RUTAS COMPARTIDAS (Reportes) */}
                        <Link href="/reportes" className="nav-item" title={isCollapsed ? "Reportes" : ""}>
                            <span className="material-symbols-outlined nav-icon">monitoring</span>
                            {!isCollapsed && <span className="nav-text">Reportes</span>}
                        </Link>
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
                <div className="top-bar">
                    <div>
                        <h1 className="page-title">Dashboard Principal</h1>
                        <p className="page-subtitle">Bienvenido al panel de control de UniEvents</p>
                    </div>
                </div>

                {/* TARJETA DE BIENVENIDA */}
                <div className="table-panel" style={{ padding: '50px 30px', marginTop: '20px', textAlign: 'center' }}>
                    <div style={{ background: '#eff6ff', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: '#2563eb' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '40px' }}>waving_hand</span>
                    </div>
                    <h2 style={{ color: '#1e293b', fontSize: '28px', marginTop: 0, marginBottom: '10px' }}>
                        ¡Hola, {usuarioLogeado.nombre_completo || usuarioLogeado.nombre}!
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
                        Has iniciado sesión correctamente en el sistema con el rol de <strong style={{ color: '#0f172a' }}>{usuarioLogeado.id_rol === 1 ? 'Administrador' : 'Organizador'}</strong>.
                    </p>
                    <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '20px' }}>
                        Utiliza el menú lateral izquierdo para navegar por las diferentes secciones y gestionar la plataforma.
                    </p>
                </div>
            </main>
        </div>
    );
}