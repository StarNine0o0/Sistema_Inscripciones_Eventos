import React, { useEffect, useState } from 'react';
import { searchEstudiantes } from '../../../api/estudiantesApi';

const EstudiantesSection = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        let activo = true;
        setCargando(true);
        searchEstudiantes(busqueda).then((data) => {
            if (!activo) return;
            setEstudiantes(data);
            setCargando(false);
        });
        return () => {
            activo = false;
        };
    }, [busqueda]);

    const inicialesDe = (nombre) =>
        nombre
            .split(' ')
            .slice(0, 2)
            .map((p) => p[0])
            .join('')
            .toUpperCase();

    return (
        <>
            <header className="top-bar">
                <div>
                    <h1 className="page-title">Estudiantes</h1>
                    <p className="page-subtitle">Consulta y administra los estudiantes registrados</p>
                </div>
            </header>

            <section className="table-panel">
                <div className="table-header">
                    <h3 className="table-title">Todos los Estudiantes</h3>
                    <div className="table-controls">
                        <input
                            type="text"
                            placeholder="Buscar por nombre, correo o matrícula..."
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
                            <th>Estudiante</th>
                            <th>Correo Institucional</th>
                            <th>Matrícula</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cargando ? (
                            <tr>
                                <td colSpan={4}>Cargando estudiantes…</td>
                            </tr>
                        ) : estudiantes.length === 0 ? (
                            <tr>
                                <td colSpan={4}>No se encontraron estudiantes para "{busqueda}"</td>
                            </tr>
                        ) : (
                            estudiantes.map((est) => (
                                <tr key={est.id_usuario}>
                                    <td>
                                        <div className="student-cell">
                                            {est.foto_perfil ? (
                                                <img src={est.foto_perfil} alt={est.nombre_completo} className="avatar-circle" />
                                            ) : (
                                                <span className="avatar-circle avatar-fallback">{inicialesDe(est.nombre_completo)}</span>
                                            )}
                                            <strong>{est.nombre_completo}</strong>
                                        </div>
                                    </td>
                                    <td>{est.correo_institucional}</td>
                                    <td>{est.matricula_empleado}</td>
                                    <td>
                                        <span className={`status-tag ${est.estado_usuario === 'Activo' ? 'active' : 'inactive'}`}>
                                            {est.estado_usuario}
                                        </span>
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

export default EstudiantesSection;
