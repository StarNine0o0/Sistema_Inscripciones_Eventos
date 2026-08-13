import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function GestionInscripciones({ evento, onClose }) {
    const [inscritos, setInscritos] = useState([]);
    const [ocupacion, setOcupacion] = useState(null);
    const [cargando, setCargando] = useState(true);

    // Al abrir el modal, traemos los datos automáticamente
    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setCargando(true);
        try {
            const [resInscripciones, resOcupacion] = await Promise.all([
                axios.get(`/eventos/${evento.id_evento}/inscripciones`),
                axios.get(`/eventos/${evento.id_evento}/ocupacion`)
            ]);
            
            setInscritos(resInscripciones.data.inscripciones);
            setOcupacion(resOcupacion.data.ocupacion);
        } catch (error) {
            alert("Error al cargar los datos del evento");
        } finally {
            setCargando(false);
        }
    };

    // 1. Registrar asistencia
    const handleCheckin = async (id_inscripcion) => {
        try {
            const response = await axios.post('/inscripciones/checkin', { 
                id_inscripcion: id_inscripcion 
            });
            
            setInscritos(inscritos.map(inscrito => 
                inscrito.id_inscripcion === id_inscripcion 
                    ? { ...inscrito, estado_asistencia: 'Confirmada' } 
                    : inscrito
            ));
            
            alert(response.data.mensaje);
        } catch (error) {
            alert(error.response?.data?.mensaje || "Error al registrar asistencia");
        }
    };

    // 2. Cancelar inscripción
    const handleCancelar = async (id_inscripcion) => {
        if (!window.confirm("¿Seguro que deseas cancelar esta inscripción?")) return;

        try {
            const response = await axios.patch(`/inscripciones/${id_inscripcion}/cancelar`);
            
            setInscritos(inscritos.map(inscrito => 
                inscrito.id_inscripcion === id_inscripcion 
                    ? { ...inscrito, estado_inscripcion: 'Cancelada' } 
                    : inscrito
            ));

            cargarDatos(); // Recargar para actualizar el porcentaje de ocupación
            alert(response.data.mensaje);
        } catch (error) {
            alert(error.response?.data?.mensaje || "Error al cancelar");
        }
    };

    // 3. Agregar participante manualmente
    const handleAgregarManual = async () => {
        const correo = window.prompt("Ingresa el correo institucional del participante:");
        if (!correo) return; 

        try {
            const response = await axios.post(`/eventos/${evento.id_evento}/inscripciones`, { 
                correo_institucional: correo 
            });
            
            alert(response.data.mensaje);
            cargarDatos(); // Recargar la tabla completa para mostrar al nuevo
        } catch (error) {
            alert(error.response?.data?.mensaje || "Error al agregar participante");
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            
            <div style={{ background: 'white', width: '90%', maxWidth: '900px', borderRadius: '8px', padding: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
                
                {/* CABECERA */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                    <h2>Gestión de Inscripciones: {evento.nombre_evento}</h2>
                    <button onClick={onClose} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>
                        Cerrar (X)
                    </button>
                </div>

                {cargando ? (
                    <p style={{ marginTop: '20px', textAlign: 'center' }}>Cargando datos...</p>
                ) : (
                    <div style={{ marginTop: '20px' }}>
                        
                        {/* SECCIÓN DE OCUPACIÓN */}
                        <div style={{ background: '#f3f4f6', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                            <h3 style={{ margin: '0 0 10px 0' }}>Porcentaje de Ocupación</h3>
                            <p style={{ margin: 0, fontWeight: 'bold' }}>
                                {ocupacion?.inscritos_activos} de {ocupacion?.capacidad_maxima} lugares ocupados ({ocupacion?.porcentaje_ocupacion}%)
                            </p>
                            
                            {/* Barra de progreso visual */}
                            <div style={{ background: '#e5e7eb', height: '20px', width: '100%', borderRadius: '10px', marginTop: '10px', overflow: 'hidden' }}>
                                <div style={{ 
                                    background: ocupacion?.cupo_lleno ? '#ef4444' : '#3b82f6', 
                                    height: '100%', 
                                    width: `${ocupacion?.porcentaje_ocupacion}%`,
                                    transition: 'width 0.5s ease-in-out'
                                }}></div>
                            </div>
                        </div>

                        {/* BARRA DE ACCIONES */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <button onClick={handleAgregarManual} style={{ background: '#10b981', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                + Añadir Manualmente
                            </button>
                            
                            {/* El enlace directo a la ruta de exportar. Agregamos un target para que abra y descargue sin salir del modal */}
                            <a href={`/eventos/${evento.id_evento}/inscripciones/exportar`} target="_blank" rel="noreferrer" style={{ background: '#3b82f6', color: 'white', padding: '8px 15px', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                                ⬇️ Exportar a Excel/CSV
                            </a>
                        </div>

                        {/* TABLA DE INSCRITOS */}
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #eee' }}>
                                    <th style={{ paddingBottom: '10px' }}>Nombre</th>
                                    <th style={{ paddingBottom: '10px' }}>Correo</th>
                                    <th style={{ paddingBottom: '10px' }}>Estado</th>
                                    <th style={{ paddingBottom: '10px' }}>Asistencia</th>
                                    <th style={{ paddingBottom: '10px' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inscritos.length > 0 ? (
                                    inscritos.map(inscrito => (
                                        <tr key={inscrito.id_inscripcion} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '10px 0' }}>{inscrito.nombre}</td>
                                            <td>{inscrito.correo}</td>
                                            <td>
                                                <span style={{ color: inscrito.estado_inscripcion === 'Activa' ? 'green' : 'red', fontWeight: 'bold' }}>
                                                    {inscrito.estado_inscripcion}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{ color: inscrito.estado_asistencia === 'Confirmada' ? 'green' : 'gray', fontWeight: 'bold' }}>
                                                    {inscrito.estado_asistencia}
                                                </span>
                                            </td>
                                            <td>
                                                {/* Botón de Check-in (Solo si está activa y no se ha confirmado asistencia) */}
                                                {inscrito.estado_inscripcion === 'Activa' && inscrito.estado_asistencia === 'Pendiente' && (
                                                    <button 
                                                        onClick={() => handleCheckin(inscrito.id_inscripcion)}
                                                        style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '5px 10px', marginRight: '5px', cursor: 'pointer', borderRadius: '4px' }}>
                                                        Check-in
                                                    </button>
                                                )}

                                                {/* Botón de Cancelar (Solo si está activa) */}
                                                {inscrito.estado_inscripcion === 'Activa' && (
                                                    <button 
                                                        onClick={() => handleCancelar(inscrito.id_inscripcion)}
                                                        style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>
                                                        Cancelar
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                            No hay participantes inscritos aún.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                    </div>
                )}
            </div>
        </div>
    );
}