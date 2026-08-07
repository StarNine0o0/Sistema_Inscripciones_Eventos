import React, { useEffect, useState } from 'react';
import { getEventos } from '../../../api/eventosApi';
import { getEstudiantes } from '../../../api/estudiantesApi';

const InicioSection = ({ usuario, onNuevoEvento, onEditarEvento }) => {
    const [eventos, setEventos] = useState([]);
    const [totalEstudiantes, setTotalEstudiantes] = useState(0);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        let activo = true;
        Promise.all([getEventos(), getEstudiantes()]).then(([eventosData, estudiantesData]) => {
            if (!activo) return;
            setEventos(eventosData);
            setTotalEstudiantes(estudiantesData.length);
            setCargando(false);
        });
        return () => {
            activo = false;
        };
    }, []);

    const eventosActivos = eventos.filter((ev) => ev.estado_evento !== 'Finalizado' && ev.estado_evento !== 'Cancelado');
    const capacidadTotal = eventos.reduce((acc, ev) => acc + ev.capacidad_maxima, 0);
    const inscritosTotal = eventos.reduce((acc, ev) => acc + (ev.inscritos || 0), 0);

    return (
        <>
            <header className="top-bar">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Bienvenidos, {usuario?.nombre_completo || 'Administrador'}</p>
                </div>

                <div className="action-buttons">
                    <button className="btn-secondary">
                        <span className="material-symbols-outlined">download</span> Exportar
                    </button>
                    <button className="btn-primary" onClick={onNuevoEvento}>
                        <span className="material-symbols-outlined">add</span> Nuevo evento
                    </button>
                </div>
            </header>

            <section className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-title">Total Estudiantes</span>
                        <div className="icon-badge blue">
                            <span className="material-symbols-outlined">groups</span>
                        </div>
                    </div>
                    <div className="metric-value">{cargando ? '—' : totalEstudiantes}</div>
                    <div className="metric-footer">Registrados</div>
                </div>

                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-title">Eventos Activos</span>
                        <div className="icon-badge green">
                            <span className="material-symbols-outlined">event_available</span>
                        </div>
                    </div>
                    <div className="metric-value">{cargando ? '—' : eventosActivos.length}</div>
                    <div className="metric-footer">de {cargando ? '—' : eventos.length} en total</div>
                </div>

                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-title">Capacidad Libre</span>
                        <div className="icon-badge orange">
                            <span className="material-symbols-outlined">trending_up</span>
                        </div>
                    </div>
                    <div className="metric-value">{cargando ? '—' : capacidadTotal - inscritosTotal}</div>
                    <div className="metric-footer">de {cargando ? '—' : capacidadTotal} cupos</div>
                </div>

                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-title">Inscripciones</span>
                        <div className="icon-badge purple">
                            <span className="material-symbols-outlined">how_to_reg</span>
                        </div>
                    </div>
                    <div className="metric-value">{cargando ? '—' : inscritosTotal}</div>
                    <div className="metric-footer">acumuladas</div>
                </div>
            </section>

            <section className="table-panel">
                <div className="table-header">
                    <h3 className="table-title">Eventos Recientes</h3>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Evento</th>
                            <th>Fecha Inicio</th>
                            <th>Capacidad</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cargando ? (
                            <tr>
                                <td colSpan={5}>Cargando eventos…</td>
                            </tr>
                        ) : (
                            eventos.slice(0, 5).map((evt) => (
                                <tr key={evt.id_evento}>
                                    <td><strong>{evt.nombre_evento}</strong></td>
                                    <td>{new Date(evt.fecha_inicio).toLocaleDateString()}</td>
                                    <td>{evt.capacidad_maxima} personas</td>
                                    <td>
                                        <span className={`status-tag ${evt.estado_evento === 'Programado' ? 'active' : ''}`}>
                                            {evt.estado_evento}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-icon cursor-pointer"
                                            onClick={() => onEditarEvento(evt)}
                                            title="Editar Evento"
                                        >
                                            <span className="material-symbols-outlined">edit</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </section>
        </>
    );
};

export default InicioSection;
