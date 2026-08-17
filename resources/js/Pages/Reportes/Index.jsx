import React, { useEffect, useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import '../../../css/app.css';

const TIPOS_REPORTE = [
    { id: 'resumen_general', label: 'Resumen General' },
    { id: 'eventos_populares', label: 'Eventos Populares' },
    { id: 'tasa_asistencia', label: 'Tasa de Asistencia' },
    { id: 'participacion_categoria', label: 'Participación por Categoría' },
    { id: 'usuarios_activos', label: 'Usuarios más Activos' },
];

export default function Index() {
    const { auth } = usePage().props;
    const usuarioLogeado = auth?.user || {};

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [tipoActivo, setTipoActivo] = useState('resumen_general');
    
    // Filtros: Si es organizador, aplicamos su ID para que solo vea sus propios eventos
    const [filtros, setFiltros] = useState({ 
        fecha_inicio: '', 
        fecha_fin: '', 
        id_categoria: '', 
        id_organizador: usuarioLogeado.id_rol === 2 ? usuarioLogeado.id_usuario : '' 
    });

    const [cargando, setCargando] = useState(true);
    const [resumen, setResumen] = useState(null);
    const [datosReporte, setDatosReporte] = useState([]); 
    
    const [formatoExportar, setFormatoExportar] = useState('pdf');
    const [exportando, setExportando] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    const handleLogout = () => {
        router.post('/logout');
    };

    const cargarDatos = async () => {
        setCargando(true);
        try {
            if (tipoActivo === 'resumen_general') {
                const res = await axios.get('/reportes/resumen-general', { params: filtros });
                setResumen(res.data.datos);
            } else {
                const endpoint = tipoActivo.replace('_', '-'); 
                const res = await axios.get(`/reportes/${endpoint}`, { params: filtros });
                setDatosReporte(res.data.datos);
            }
        } catch (error) {
            console.error("Error al cargar reportes:", error);
        }
        setCargando(false);
    };

    useEffect(() => {
        cargarDatos();
    }, [tipoActivo]);

    const handleFiltroChange = (campo) => (e) => {
        setFiltros((f) => ({ ...f, [campo]: e.target.value }));
    };

    const handleAplicarFiltros = (e) => {
        e.preventDefault();
        cargarDatos();
    };

    const handleExportar = async () => {
        setExportando(true);
        try {
            const response = await axios.post('/reportes/exportar', {
                tipo_reporte: tipoActivo,
                formato: formatoExportar,
                ...filtros
            });

            const id_reporte = response.data.id_reporte;
            alert('Generando el reporte en segundo plano…');

            const intervalo = setInterval(async () => {
                const estadoRes = await axios.get(`/reportes/${id_reporte}/estado`);
                const estadoInfo = estadoRes.data;

                if (estadoInfo.estado === 'Completado') {
                    clearInterval(intervalo);
                    setExportando(false);
                    alert('Tu reporte está listo. Iniciando descarga…');
                    window.open(`/reportes/${id_reporte}/descargar`, '_blank');
                } else if (estadoInfo.estado === 'Fallido') {
                    clearInterval(intervalo);
                    setExportando(false);
                    alert(estadoInfo.mensaje_error || 'No se pudo generar el reporte.');
                }
            }, 2000); 

        } catch (err) {
            setExportando(false);
            alert('Ocurrió un error al solicitar el reporte.');
        }
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
                        <Link href="/reportes" className="nav-item active" title={isCollapsed ? "Reportes" : ""}>
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
                        <h1 className="page-title">Reportes y Estadísticas</h1>
                        <p className="page-subtitle">Proporciona información consolidada sobre el uso del sistema y participación en eventos.</p>
                    </div>
                </div>

                {/* PANEL DE FILTROS */}
                <div className="table-panel filter-panel" style={{ padding: '20px', marginBottom: '20px' }}>
                    <form onSubmit={handleAplicarFiltros} style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        <div className="form-group" style={{ margin: 0, minWidth: '200px' }}>
                            <label className="form-label">Desde (Fecha de Inicio)</label>
                            <input 
                                type="date" 
                                className="form-control" 
                                value={filtros.fecha_inicio} 
                                onChange={handleFiltroChange('fecha_inicio')} 
                            />
                        </div>
                        <div className="form-group" style={{ margin: 0, minWidth: '200px' }}>
                            <label className="form-label">Hasta (Fecha de Fin)</label>
                            <input 
                                type="date" 
                                className="form-control" 
                                value={filtros.fecha_fin} 
                                onChange={handleFiltroChange('fecha_fin')} 
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ height: 'fit-content', padding: '10px 20px' }}>
                            <span className="material-symbols-outlined" style={{ marginRight: '8px', fontSize: '18px' }}>filter_alt</span>
                            Filtrar Reporte
                        </button>
                    </form>
                </div>

                {/* PESTAÑAS (TABS) DE TIPOS DE REPORTE */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {TIPOS_REPORTE.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTipoActivo(t.id)}
                            className={tipoActivo === t.id ? 'btn-primary' : 'btn-secondary'}
                            style={{ 
                                padding: '10px 20px', 
                                border: 'none', 
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontWeight: tipoActivo === t.id ? 'bold' : 'normal'
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ÁREA DE RESULTADOS */}
                <div className="table-panel">
                    {cargando ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '48px', animation: 'spin 2s linear infinite' }}>sync</span>
                            <p style={{ marginTop: '10px' }}>Procesando información...</p>
                        </div>
                    ) : tipoActivo === 'resumen_general' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', padding: '30px' }}>
                            
                            <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                                <div style={{ background: '#dbeafe', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', color: '#2563eb' }}>
                                    <span className="material-symbols-outlined">event</span>
                                </div>
                                <h2 style={{ fontSize: '36px', margin: '0 0 5px 0', color: '#0f172a' }}>{resumen?.total_eventos_publicados || 0}</h2>
                                <p style={{ margin: 0, color: '#64748b', fontWeight: '500' }}>Eventos Publicados</p>
                            </div>
                            
                            <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                                <div style={{ background: '#dcfce7', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', color: '#16a34a' }}>
                                    <span className="material-symbols-outlined">how_to_reg</span>
                                </div>
                                <h2 style={{ fontSize: '36px', margin: '0 0 5px 0', color: '#0f172a' }}>{resumen?.total_inscripciones || 0}</h2>
                                <p style={{ margin: 0, color: '#64748b', fontWeight: '500' }}>Inscripciones Totales</p>
                            </div>
                            
                            <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                                <div style={{ background: '#f3e8ff', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', color: '#9333ea' }}>
                                    <span className="material-symbols-outlined">workspace_premium</span>
                                </div>
                                <h2 style={{ fontSize: '36px', margin: '0 0 5px 0', color: '#0f172a' }}>{resumen?.total_constancias_emitidas || 0}</h2>
                                <p style={{ margin: 0, color: '#64748b', fontWeight: '500' }}>Constancias Emitidas</p>
                            </div>

                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        {/* Generar los encabezados dinámicamente según la data recibida */}
                                        {datosReporte.length > 0 && Object.keys(datosReporte[0]).map((clave, index) => (
                                            <th key={index} style={{ textTransform: 'uppercase' }}>
                                                {clave.replace(/_/g, ' ')}
                                            </th>
                                        ))}
                                        {datosReporte.length === 0 && <th>Detalle del Reporte</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {datosReporte.length > 0 ? (
                                        datosReporte.map((fila, idx) => (
                                            <tr key={idx}>
                                                {Object.values(fila).map((valor, i) => (
                                                    <td key={i}>
                                                        {/* Si el valor es numérico pero parece un porcentaje, le agregamos formato, si no lo mostramos tal cual */}
                                                        {valor !== null && valor !== undefined ? valor.toString() : '—'}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="10" className="empty-table-msg">
                                                No se encontraron datos para los filtros seleccionados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* BOTONES PARA DESCARGAR EL PDF/EXCEL */}
                <div className="table-panel" style={{ marginTop: '20px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <strong style={{ color: '#0f172a' }}>Exportar Resultados</strong>
                        <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#64748b' }}>
                            La generación se realizará en segundo plano.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <select 
                            className="form-control" 
                            value={formatoExportar} 
                            onChange={e => setFormatoExportar(e.target.value)}
                            style={{ margin: 0, minWidth: '150px' }}
                        >
                            <option value="pdf">Formato PDF</option>
                            <option value="excel">Formato Excel</option>
                        </select>
                        <button 
                            onClick={handleExportar} 
                            disabled={exportando}
                            className={exportando ? 'btn-secondary' : 'btn-primary'}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <span className="material-symbols-outlined">
                                {exportando ? 'hourglass_top' : 'download'}
                            </span>
                            {exportando ? 'Generando Archivo...' : 'Exportar Reporte'}
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
}