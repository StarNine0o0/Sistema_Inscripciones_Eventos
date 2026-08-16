import React, { useEffect, useState } from 'react';
import { getEventos } from '../../../api/eventosApi';

const AnaliticasSection = () => {
    const [eventos, setEventos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        let activo = true;
        getEventos().then((data) => {
            if (!activo) return;
            setEventos(data);
            setCargando(false);
        });
        return () => {
            activo = false;
        };
    }, []);

    const porEstado = eventos.reduce((acc, ev) => {
        acc[ev.estado_evento] = (acc[ev.estado_evento] || 0) + 1;
        return acc;
    }, {});

    const ocupacionPromedio = eventos.length
        ? Math.round(
              eventos.reduce((acc, ev) => acc + (ev.inscritos / ev.capacidad_maxima) * 100, 0) / eventos.length
          )
        : 0;

    return (
        <>
            <header className="top-bar">
                <div>
                    <h1 className="page-title">Analíticas</h1>
                    <p className="page-subtitle">Panorama general del desempeño de tus eventos</p>
                </div>
            </header>

            <section className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-title">Ocupación Promedio</span>
                        <div className="icon-badge blue">
                            <span className="material-symbols-outlined">donut_large</span>
                        </div>
                    </div>
                    <div className="metric-value">{cargando ? '—' : `${ocupacionPromedio}%`}</div>
                    <div className="metric-footer">de capacidad usada</div>
                </div>

                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-title">Programados</span>
                        <div className="icon-badge green">
                            <span className="material-symbols-outlined">event_upcoming</span>
                        </div>
                    </div>
                    <div className="metric-value">{cargando ? '—' : porEstado['Programado'] || 0}</div>
                    <div className="metric-footer">eventos</div>
                </div>

                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-title">Finalizados</span>
                        <div className="icon-badge orange">
                            <span className="material-symbols-outlined">event_available</span>
                        </div>
                    </div>
                    <div className="metric-value">{cargando ? '—' : porEstado['Finalizado'] || 0}</div>
                    <div className="metric-footer">eventos</div>
                </div>

                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-title">Cancelados</span>
                        <div className="icon-badge purple">
                            <span className="material-symbols-outlined">event_busy</span>
                        </div>
                    </div>
                    <div className="metric-value">{cargando ? '—' : porEstado['Cancelado'] || 0}</div>
                    <div className="metric-footer">eventos</div>
                </div>
            </section>

            <section className="table-panel">
                <div className="table-header">
                    <h3 className="table-title">Ocupación por Evento</h3>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Evento</th>
                            <th>Inscritos</th>
                            <th>Capacidad</th>
                            <th>Ocupación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cargando ? (
                            <tr>
                                <td colSpan={4}>Cargando datos…</td>
                            </tr>
                        ) : (
                            eventos.map((ev) => (
                                <tr key={ev.id_evento}>
                                    <td><strong>{ev.nombre_evento}</strong></td>
                                    <td>{ev.inscritos}</td>
                                    <td>{ev.capacidad_maxima}</td>
                                    <td>{Math.round((ev.inscritos / ev.capacidad_maxima) * 100)}%</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </section>
        </>
    );
};

export default AnaliticasSection;
