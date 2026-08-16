import React, { useEffect, useState } from 'react';
import { searchEventos } from '../../../api/eventosApi';

const EventosSection = ({ onNuevoEvento, onEditarEvento }) => {
    const [eventos, setEventos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(true);

    // Se re-ejecuta cada vez que cambia el texto de búsqueda.
    // searchEventos ya filtra tanto si "busqueda" está vacío como si no.
    useEffect(() => {
        let activo = true;
        setCargando(true);
        searchEventos(busqueda).then((data) => {
            if (!activo) return;
            setEventos(data);
            setCargando(false);
        });
        return () => {
            activo = false;
        };
    }, [busqueda]);

    return (
        <>
            <header className="top-bar">
                <div>
                    <h1 className="page-title">Eventos</h1>
                    <p className="page-subtitle">Gestiona todos los eventos de la institución</p>
                </div>

                <div className="action-buttons">
                    <button className="btn-primary" onClick={onNuevoEvento}>
                        <span className="material-symbols-outlined">add</span> Nuevo evento
                    </button>
                </div>
            </header>

            <section className="table-panel">
                <div className="table-header">
                    <h3 className="table-title">Todos los Eventos</h3>
                    <div className="table-controls">
                        <input
                            type="text"
                            placeholder="Buscar evento..."
                            className="search-input"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                        <button className="filter-btn">
                            <span className="material-symbols-outlined">tune</span> Filtrar
                        </button>
                    </div>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Evento</th>
                            <th>Fecha Inicio</th>
                            <th>Fecha Fin</th>
                            <th>Capacidad</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cargando ? (
                            <tr>
                                <td colSpan={6}>Cargando eventos…</td>
                            </tr>
                        ) : eventos.length === 0 ? (
                            <tr>
                                <td colSpan={6}>No se encontraron eventos para "{busqueda}"</td>
                            </tr>
                        ) : (
                            eventos.map((evt) => (
                                <tr key={evt.id_evento}>
                                    <td><strong>{evt.nombre_evento}</strong></td>
                                    <td>{new Date(evt.fecha_inicio).toLocaleDateString()}</td>
                                    <td>{new Date(evt.fecha_fin).toLocaleDateString()}</td>
                                    <td>{evt.inscritos}/{evt.capacidad_maxima}</td>
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

export default EventosSection;
