import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';

export default function FormularioEventoModal({ eventoParaEditar, sedes, categorias, onClose }) {
    const { auth } = usePage().props;
    const usuario = auth?.user || {};

    const [erroresBackend, setErroresBackend] = useState(null);
    const [formData, setFormData] = useState({
        nombre_evento: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_fin: '',
        capacidad_maxima: '',
        id_categoria: '', 
        id_organizador: usuario.id, 
        id_sede: '',        
        imagen_portada: null
    });

    // Se ejecuta cada vez que se abre el modal para saber si creamos o editamos
    useEffect(() => {
        if (eventoParaEditar) {
            const formatearFechaParaInput = (fechaOriginal) => {
                if (!fechaOriginal) return '';
                const date = new Date(fechaOriginal);
                date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                return date.toISOString().slice(0, 16);
            };

            setFormData({
                nombre_evento: eventoParaEditar.nombre_evento,
                descripcion: eventoParaEditar.descripcion,
                fecha_inicio: formatearFechaParaInput(eventoParaEditar.fecha_inicio),
                fecha_fin: formatearFechaParaInput(eventoParaEditar.fecha_fin),
                capacidad_maxima: eventoParaEditar.capacidad_maxima,
                id_categoria: eventoParaEditar.id_categoria,
                id_organizador: eventoParaEditar.id_organizador,
                id_sede: eventoParaEditar.id_sede,
                imagen_portada: null
            });
        }
    }, [eventoParaEditar]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErroresBackend(null);

        const data = new FormData();
        for (const key in formData) {
            if(formData[key] !== null && formData[key] !== '') {
                data.append(key, formData[key]);
            }
        }

        try {
            if (eventoParaEditar) {
                data.append('_method', 'PUT');
                const response = await axios.post(`/eventos/${eventoParaEditar.id_evento}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert(response.data.mensaje || 'Evento actualizado con éxito');
            } else {
                const response = await axios.post('/eventos', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert(response.data.mensaje || 'Evento creado con éxito');
            }
            
            onClose(); // Cerramos el modal al terminar
            router.reload(); // Recargamos la tabla
            
        } catch (error) {
            if (error.response && error.response.data.error) {
                setErroresBackend(error.response.data.error);
            } else if (error.response && error.response.data.errors) {
                const mensajesErrores = Object.values(error.response.data.errors).flat().join(' | ');
                setErroresBackend("Faltan datos: " + mensajesErrores);
            }
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                
                {/* Botón de cerrar (X) en la esquina superior derecha */}
                <button 
                    onClick={onClose} 
                    style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer' }}
                >
                    ❌
                </button>

                <h3>{eventoParaEditar ? 'Editar Evento' : 'Crear Nuevo Evento'}</h3>
                
                {erroresBackend && (
                    <div style={{ background: '#fecaca', color: '#991b1b', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
                        {erroresBackend}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
                    <input type="text" placeholder="Nombre del evento" required 
                        value={formData.nombre_evento}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        onChange={e => setFormData({...formData, nombre_evento: e.target.value})} />
                    
                    <textarea placeholder="Descripción" required 
                        value={formData.descripcion}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '80px' }}
                        onChange={e => setFormData({...formData, descripcion: e.target.value})}></textarea>
                    
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Fecha Inicio:</label>
                        <input type="datetime-local" required 
                            value={formData.fecha_inicio}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                            onChange={e => setFormData({...formData, fecha_inicio: e.target.value})} />
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Fecha Fin:</label>
                        <input type="datetime-local" required 
                            value={formData.fecha_fin}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                            onChange={e => setFormData({...formData, fecha_fin: e.target.value})} />
                    </div>
                    
                    <input type="number" placeholder="Capacidad Máxima (ej. 50)" required 
                        value={formData.capacidad_maxima}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        onChange={e => setFormData({...formData, capacidad_maxima: e.target.value})} />
                    
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Imagen (Opcional):</label>
                        <input type="file" onChange={e => setFormData({...formData, imagen_portada: e.target.files[0]})} />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Sede:</label>
                        <select 
                            value={formData.id_sede} 
                            onChange={e => setFormData({...formData, id_sede: e.target.value})}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                            required
                        >
                            <option value="">-- Selecciona una Sede --</option>
                            {sedes && sedes.map(sede => (
                                <option key={sede.id_sede} value={sede.id_sede}>
                                    {sede.nombre_sede}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Categoría:</label>
                        <select 
                            value={formData.id_categoria} 
                            onChange={e => setFormData({...formData, id_categoria: e.target.value})}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                            required
                        >
                            <option value="">-- Selecciona una Categoría --</option>
                            {categorias && categorias.map(categoria => (
                                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                    {categoria.nombre_categoria}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <button type="submit" style={{ padding: '12px', background: '#10b981', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
                        {eventoParaEditar ? 'Actualizar Evento' : 'Guardar Evento'}
                    </button>
                </form>
            </div>
        </div>
    );
}