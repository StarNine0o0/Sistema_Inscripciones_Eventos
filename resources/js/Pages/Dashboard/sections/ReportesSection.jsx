import React, { useEffect, useMemo, useState } from 'react';
import {
    TIPOS_REPORTE,
    getResumenGeneral,
    getEventosPopulares,
    getTasaAsistencia,
    getParticipacionPorCategoria,
    getUsuariosMasActivos,
    solicitarExportacion,
    consultarEstadoReporte,
    descargarReporte,
    getHistorialReportes,
} from '../../../api/reportesApi';
import BarChartSimple from '../../../components/Charts/BarChartSimple';
import DonutChartSimple from '../../../components/Charts/DonutChartSimple';
import { useToast } from '../../../context/ToastContext';
import './ReporteSection.css';

const ESTADO_TAG = {
    Pendiente: 'pending',
    Procesando: 'pending',
    Completado: 'active',
    Fallido: 'inactive',
};

const ReportesSection = () => {
    const { showToast } = useToast();

    const [tipoActivo, setTipoActivo] = useState('resumen_general');
    const [filtros, setFiltros] = useState({ fecha_inicio: '', fecha_fin: '', id_categoria: '', id_organizador: '' });

    const [cargando, setCargando] = useState(true);
    const [resumen, setResumen] = useState(null);
    const [eventosPopulares, setEventosPopulares] = useState([]);
    const [tasaAsistencia, setTasaAsistencia] = useState([]);
    const [participacionCategoria, setParticipacionCategoria] = useState([]);
    const [usuariosActivos, setUsuariosActivos] = useState([]);

    const [formatoExportar, setFormatoExportar] = useState('pdf');
    const [exportando, setExportando] = useState(false);
    const [historial, setHistorial] = useState([]);

    const cargarDatos = async () => {
        setCargando(true);
        const [r, ep, ta, pc, ua, hist] = await Promise.all([
            getResumenGeneral(filtros),
            getEventosPopulares(filtros),
            getTasaAsistencia(filtros),
            getParticipacionPorCategoria(filtros),
            getUsuariosMasActivos(filtros),
            getHistorialReportes(),
        ]);
        setResumen(r);
        setEventosPopulares(ep);
        setTasaAsistencia(ta);
        setParticipacionCategoria(pc);
        setUsuariosActivos(ua);
        setHistorial(hist);
        setCargando(false);
    };

    useEffect(() => {
        cargarDatos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFiltroChange = (campo) => (e) => {
        setFiltros((f) => ({ ...f, [campo]: e.target.value }));
    };

    const handleAplicarFiltros = (e) => {
        e.preventDefault();
        cargarDatos();
    };

    // ---- Exportación PDF / Excel ----
    const handleExportar = async () => {
        setExportando(true);
        try {
            const { id_reporte } = await solicitarExportacion(tipoActivo, formatoExportar, filtros);
            showToast('Generando el reporte en segundo plano…', 'info');

            const intervalo = setInterval(async () => {
                const estado = await consultarEstadoReporte(id_reporte);

                setHistorial((prev) => {
                    const existe = prev.some((r) => r.id_reporte === id_reporte);
                    const actualizado = { id_reporte, tipo_reporte: tipoActivo, formato: formatoExportar, estado: estado.estado, creado_en: new Date().toISOString() };
                    return existe
                        ? prev.map((r) => (r.id_reporte === id_reporte ? { ...r, estado: estado.estado } : r))
                        : [actualizado, ...prev];
                });

                if (estado.estado === 'Completado') {
                    clearInterval(intervalo);
                    setExportando(false);
                    const { url } = await descargarReporte(id_reporte);
                    showToast('Tu reporte está listo. Iniciando descarga…', 'success');
                    // En producción "url" apunta al endpoint real de descarga del archivo.
                    window.open(url, '_blank');
                } else if (estado.estado === 'Fallido') {
                    clearInterval(intervalo);
                    setExportando(false);
                    showToast(estado.mensaje_error || 'No se pudo generar el reporte.', 'error');
                }
            }, 900);
        } catch (err) {
            setExportando(false);
            showToast('Ocurrió un error al solicitar el reporte.', 'error');
        }
    };

    const handleDescargarHistorial = async (idReporte) => {
        const { url } = await descargarReporte(idReporte);
        window.open(url, '_blank');
    };

    const tipoInfo = useMemo(() => TIPOS_REPORTE.find((t) => t.id === tipoActivo), [tipoActivo]);

    return (
        <>
            <header className="top-bar">
                <div>
                    <h1 className="page-title">Reportes</h1>
                    <p className="page-subtitle">Gráficas, estadísticas y exportación de reportes en PDF o Excel</p>
                </div>
                <div className="action-buttons">
                    <button className="btn-secondary" onClick={cargarDatos} title="Actualizar datos">
                        <span className="material-symbols-outlined">refresh</span>
                        Actualizar
                    </button>
                </div>
            </header>

            {/* ---- Filtros ---- */}
            <section className="table-panel filtros-panel">
                <form className="filtros-form" onSubmit={handleAplicarFiltros}>
                    <div className="filtro-campo">
                        <label>Desde</label>
                        <input type="date" value={filtros.fecha_inicio} onChange={handleFiltroChange('fecha_inicio')} />
                    </div>
                    <div className="filtro-campo">
                        <label>Hasta</label>
                        <input type="date" value={filtros.fecha_fin} onChange={handleFiltroChange('fecha_fin')} />
                    </div>
                    <div className="filtro-campo">
                        <label>Categoría</label>
                        <select value={filtros.id_categoria} onChange={handleFiltroChange('id_categoria')}>
                            <option value="">Todas</option>
                            {participacionCategoria.map((c) => (
                                <option key={c.id_categoria} value={c.id_categoria}>{c.nombre_categoria}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn-primary filtro-submit">
                        <span className="material-symbols-outlined">filter_alt</span>
                        Aplicar filtros
                    </button>
                </form>
            </section>

            {/* ---- Selector de tipo de reporte ---- */}
            <nav className="reporte-tabs">
                {TIPOS_REPORTE.map((t) => (
                    <button
                        key={t.id}
                        className={`reporte-tab ${tipoActivo === t.id ? 'active' : ''}`}
                        onClick={() => setTipoActivo(t.id)}
                    >
                        <span className="material-symbols-outlined">{t.icono}</span>
                        {t.label}
                    </button>
                ))}
            </nav>

            {/* ---- Resumen General ---- */}
            {tipoActivo === 'resumen_general' && (
                <>
                    <section className="metrics-grid metrics-grid-3">
                        <div className="metric-card">
                            <div className="metric-header">
                                <span className="metric-title">Eventos Publicados</span>
                                <div className="icon-badge blue"><span className="material-symbols-outlined">event</span></div>
                            </div>
                            <div className="metric-value">{cargando ? '—' : resumen?.total_eventos_publicados}</div>
                            <div className="metric-footer">en el rango seleccionado</div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-header">
                                <span className="metric-title">Inscripciones</span>
                                <div className="icon-badge green"><span className="material-symbols-outlined">how_to_reg</span></div>
                            </div>
                            <div className="metric-value">{cargando ? '—' : resumen?.total_inscripciones}</div>
                            <div className="metric-footer">activas</div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-header">
                                <span className="metric-title">Constancias Emitidas</span>
                                <div className="icon-badge purple"><span className="material-symbols-outlined">workspace_premium</span></div>
                            </div>
                            <div className="metric-value">{cargando ? '—' : resumen?.total_constancias_emitidas}</div>
                            <div className="metric-footer">documentos generados</div>
                        </div>
                    </section>

                    <section className="charts-grid">
                        <div className="table-panel">
                            <div className="table-header"><h3 className="table-title">Top eventos por inscripciones</h3></div>
                            {cargando ? <p className="chart-loading">Cargando…</p> : (
                                <BarChartSimple
                                    data={eventosPopulares.map((e) => ({ etiqueta: e.nombre_evento, valor: e.total_inscripciones }))}
                                />
                            )}
                        </div>
                        <div className="table-panel">
                            <div className="table-header"><h3 className="table-title">Participación por categoría</h3></div>
                            {cargando ? <p className="chart-loading">Cargando…</p> : (
                                <DonutChartSimple
                                    data={participacionCategoria.map((c) => ({ etiqueta: c.nombre_categoria, valor: c.total_inscripciones }))}
                                />
                            )}
                        </div>
                    </section>
                </>
            )}

            {/* ---- Eventos Populares ---- */}
            {tipoActivo === 'eventos_populares' && (
                <section className="table-panel">
                    <div className="table-header"><h3 className="table-title">Eventos con más inscripciones</h3></div>
                    {cargando ? <p className="chart-loading">Cargando…</p> : (
                        <BarChartSimple data={eventosPopulares.map((e) => ({ etiqueta: e.nombre_evento, valor: e.total_inscripciones }))} />
                    )}
                    <table className="data-table" style={{ marginTop: 24 }}>
                        <thead>
                            <tr><th>Evento</th><th>Categoría</th><th>Organizador</th><th>Fecha</th><th>Inscripciones</th></tr>
                        </thead>
                        <tbody>
                            {eventosPopulares.map((e) => (
                                <tr key={e.id_evento}>
                                    <td><strong>{e.nombre_evento}</strong></td>
                                    <td>{e.categoria}</td>
                                    <td>{e.organizador}</td>
                                    <td>{e.fecha_inicio}</td>
                                    <td>{e.total_inscripciones}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {/* ---- Tasa de Asistencia ---- */}
            {tipoActivo === 'tasa_asistencia' && (
                <section className="table-panel">
                    <div className="table-header"><h3 className="table-title">Tasa de asistencia por evento</h3></div>
                    {cargando ? <p className="chart-loading">Cargando…</p> : (
                        <BarChartSimple color="#16a34a" sufijo="%" data={tasaAsistencia.map((e) => ({ etiqueta: e.nombre_evento, valor: e.tasa_asistencia }))} />
                    )}
                    <table className="data-table" style={{ marginTop: 24 }}>
                        <thead>
                            <tr><th>Evento</th><th>Inscritos</th><th>Confirmados</th><th>Tasa</th></tr>
                        </thead>
                        <tbody>
                            {tasaAsistencia.map((e) => (
                                <tr key={e.id_evento}>
                                    <td><strong>{e.nombre_evento}</strong></td>
                                    <td>{e.total_inscritos}</td>
                                    <td>{e.total_confirmados}</td>
                                    <td>{e.tasa_asistencia}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {/* ---- Participación por Categoría ---- */}
            {tipoActivo === 'participacion_categoria' && (
                <section className="table-panel">
                    <div className="table-header"><h3 className="table-title">Inscripciones por categoría</h3></div>
                    {cargando ? <p className="chart-loading">Cargando…</p> : (
                        <DonutChartSimple data={participacionCategoria.map((c) => ({ etiqueta: c.nombre_categoria, valor: c.total_inscripciones }))} />
                    )}
                    <table className="data-table" style={{ marginTop: 24 }}>
                        <thead>
                            <tr><th>Categoría</th><th>Eventos</th><th>Inscripciones</th></tr>
                        </thead>
                        <tbody>
                            {participacionCategoria.map((c) => (
                                <tr key={c.id_categoria}>
                                    <td><strong>{c.nombre_categoria}</strong></td>
                                    <td>{c.total_eventos}</td>
                                    <td>{c.total_inscripciones}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {/* ---- Usuarios más Activos ---- */}
            {tipoActivo === 'usuarios_activos' && (
                <section className="table-panel">
                    <div className="table-header"><h3 className="table-title">Usuarios con más inscripciones</h3></div>
                    {cargando ? <p className="chart-loading">Cargando…</p> : (
                        <BarChartSimple color="#9333ea" data={usuariosActivos.map((u) => ({ etiqueta: u.nombre_completo, valor: u.total_inscripciones }))} />
                    )}
                    <table className="data-table" style={{ marginTop: 24 }}>
                        <thead>
                            <tr><th>Usuario</th><th>Correo</th><th>Inscripciones</th></tr>
                        </thead>
                        <tbody>
                            {usuariosActivos.map((u) => (
                                <tr key={u.id_usuario}>
                                    <td><strong>{u.nombre_completo}</strong></td>
                                    <td>{u.correo_institucional}</td>
                                    <td>{u.total_inscripciones}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}

            {/* ---- Panel de exportación ---- */}
            <section className="table-panel export-panel">
                <div className="table-header">
                    <h3 className="table-title">Exportar reporte: {tipoInfo?.label}</h3>
                </div>

                <div className="export-controls">
                    <div className="formato-selector">
                        <button
                            type="button"
                            className={`formato-btn ${formatoExportar === 'pdf' ? 'active' : ''}`}
                            onClick={() => setFormatoExportar('pdf')}
                        >
                            <span className="material-symbols-outlined">picture_as_pdf</span>
                            PDF
                        </button>
                        <button
                            type="button"
                            className={`formato-btn ${formatoExportar === 'excel' ? 'active' : ''}`}
                            onClick={() => setFormatoExportar('excel')}
                        >
                            <span className="material-symbols-outlined">table_view</span>
                            Excel
                        </button>
                    </div>

                    <button className="btn-primary" onClick={handleExportar} disabled={exportando}>
                        <span className="material-symbols-outlined">
                            {exportando ? 'progress_activity' : 'download'}
                        </span>
                        {exportando ? 'Generando…' : 'Generar y descargar'}
                    </button>
                </div>

                {/* ---- Historial de exportaciones ---- */}
                {historial.length > 0 && (
                    <table className="data-table" style={{ marginTop: 20 }}>
                        <thead>
                            <tr><th>Reporte</th><th>Formato</th><th>Estado</th><th></th></tr>
                        </thead>
                        <tbody>
                            {historial.map((r) => (
                                <tr key={r.id_reporte}>
                                    <td>{TIPOS_REPORTE.find((t) => t.id === r.tipo_reporte)?.label || r.tipo_reporte}</td>
                                    <td className="formato-cell">
                                        <span className="material-symbols-outlined">
                                            {r.formato === 'pdf' ? 'picture_as_pdf' : 'table_view'}
                                        </span>
                                        {r.formato.toUpperCase()}
                                    </td>
                                    <td><span className={`status-tag ${ESTADO_TAG[r.estado] || 'inactive'}`}>{r.estado}</span></td>
                                    <td>
                                        <button
                                            className="btn-icon"
                                            title="Descargar"
                                            disabled={r.estado !== 'Completado'}
                                            onClick={() => handleDescargarHistorial(r.id_reporte)}
                                        >
                                            <span className="material-symbols-outlined">download</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </>
    );
};

export default ReportesSection;