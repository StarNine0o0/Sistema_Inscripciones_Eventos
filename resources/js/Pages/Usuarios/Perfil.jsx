import React from 'react';
import { Link } from '@inertiajs/react';

export default function Perfil({ usuario_perfil }) {
    
    if (!usuario_perfil) {
        return <div style={{ padding: '20px' }}>Cargando perfil...</div>;
    }

    // Extraemos las relaciones (Laravel suele pasarlas en camelCase o snake_case dependiendo de tu configuración)
    const eventosOrganizados = usuario_perfil.eventos_organizados || usuario_perfil.eventosOrganizados || [];
    const inscripciones = usuario_perfil.inscripciones || [];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', background: '#f3f4f6' }}>
            
            <div style={{ flex: 1, padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
                
                <div style={{ marginBottom: '20px' }}>
                    <Link href="/usuarios" style={{ color: '#4b5563', textDecoration: 'none' }}>
                        ← Volver a la lista de usuarios
                    </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                    
                    {/* COLUMNA IZQUIERDA: TARJETA DE USUARIO */}
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' }}>
                        
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#e5e7eb', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', color: '#9ca3af' }}>
                                👤
                            </div>
                            <h2 style={{ marginTop: '15px', marginBottom: '5px' }}>{usuario_perfil.nombre_completo}</h2>
                            <span style={{ 
                                display: 'inline-block', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                                background: usuario_perfil.estado_usuario === 'Activo' ? '#d1fae5' : '#fee2e2',
                                color: usuario_perfil.estado_usuario === 'Activo' ? '#065f46' : '#991b1b'
                            }}>
                                {usuario_perfil.estado_usuario}
                            </span>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '15px 0' }} />

                        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                            <p><strong>📧 Correo:</strong> <br/>{usuario_perfil.correo_institucional}</p>
                            <p><strong>🪪 Matrícula:</strong> <br/>{usuario_perfil.matricula_empleado}</p>
                            <p><strong>🛡️ Rol:</strong> <br/>{usuario_perfil.id_rol === 1 ? 'Administrador' : 'Organizador'}</p>
                            <p><strong>📅 Registrado el:</strong> <br/>{new Date(usuario_perfil.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: ACTIVIDAD */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        
                        {/* SECCIÓN 1: EVENTOS ORGANIZADOS (Solo si es Organizador) */}
                        {usuario_perfil.id_rol === 2 && (
                            <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <h3 style={{ marginTop: 0, borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>Eventos Organizados ({eventosOrganizados.length})</h3>
                                
                                {eventosOrganizados.length > 0 ? (
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {eventosOrganizados.map(evento => (
                                            <li key={evento.id_evento} style={{ padding: '10px 0', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between' }}>
                                                <span><strong>{evento.nombre_evento}</strong> <br/><small style={{color: '#6b7280'}}>{new Date(evento.fecha_inicio).toLocaleDateString()}</small></span>
                                                <span style={{ fontSize: '12px', background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', height: 'fit-content' }}>
                                                    {evento.estado_evento}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p style={{ color: '#6b7280', fontSize: '14px' }}>Este usuario no ha organizado ningún evento aún.</p>
                                )}
                            </div>
                        )}

                        {/* SECCIÓN 2: INSCRIPCIONES */}
                        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ marginTop: 0, borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>Historial de Inscripciones ({inscripciones.length})</h3>
                            
                            {inscripciones.length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {inscripciones.map(inscripcion => (
                                        <li key={inscripcion.id_inscripcion} style={{ padding: '10px 0', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Inscripción #{inscripcion.id_inscripcion}</span>
                                            <span style={{ 
                                                fontSize: '12px', padding: '4px 8px', borderRadius: '4px',
                                                background: inscripcion.estado_inscripcion === 'Activa' ? '#d1fae5' : '#fee2e2',
                                                color: inscripcion.estado_inscripcion === 'Activa' ? '#065f46' : '#991b1b'
                                            }}>
                                                {inscripcion.estado_inscripcion}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ color: '#6b7280', fontSize: '14px' }}>Este usuario no se ha inscrito a ningún evento.</p>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}