import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import './FormularioEventoModal.css';

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
            
            onClose();
            router.reload();
            
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
        <div className="modal-overlay">
            <div className="modal-container">
                
                <div className="modal-header">
                    <h3 className="modal-title">
                        {eventoParaEditar ? 'Editar Evento' : 'Crear Nuevo Evento'}
                    </h3>
                    <button className="btn-close" onClick={onClose} title="Cerrar">
                        ✕
                    </button>
                </div>
                
                {erroresBackend && (
                    <div className="error-banner">
                        {erroresBackend}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="evento-form">
                    <div className="form-group">
                        <label className="form-label">Nombre del Evento</label>
                        <input 
                            type="text" 
                            placeholder="Ej. Conferencia de Tecnología" 
                            required 
                            className="form-input"
                            value={formData.nombre_evento}
                            onChange={e => setFormData({...formData, nombre_evento: e.target.value})} 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Descripción</label>
                        <textarea 
                            placeholder="Detalles sobre el evento..." 
                            required 
                            className="form-textarea"
                            value={formData.descripcion}
                            onChange={e => setFormData({...formData, descripcion: e.target.value})}
                        />
                    </div>
                    
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Fecha Inicio</label>
                            <input 
                                type="datetime-local" 
                                required 
                                className="form-input"
                                value={formData.fecha_inicio}
                                onChange={e => setFormData({...formData, fecha_inicio: e.target.value})} 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Fecha Fin</label>
                            <input 
                                type="datetime-local" 
                                required 
                                className="form-input"
                                value={formData.fecha_fin}
                                onChange={e => setFormData({...formData, fecha_fin: e.target.value})} 
                            />
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Capacidad Máxima</label>
                            <input 
                                type="number" 
                                placeholder="Ej. 100" 
                                required 
                                className="form-input"
                                value={formData.capacidad_maxima}
                                onChange={e => setFormData({...formData, capacidad_maxima: e.target.value})} 
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Imagen (Opcional)</label>
                            <input 
                                type="file" 
                                className="form-file-input"
                                onChange={e => setFormData({...formData, imagen_portada: e.target.files[0]})} 
                            />
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Sede</label>
                            <select 
                                value={formData.id_sede} 
                                onChange={e => setFormData({...formData, id_sede: e.target.value})}
                                className="form-select"
                                required
                            >
                                <option value="">-- Selecciona --</option>
                                {sedes && sedes.map(sede => (
                                    <option key={sede.id_sede} value={sede.id_sede}>
                                        {sede.nombre_sede}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Categoría</label>
                            <select 
                                value={formData.id_categoria} 
                                onChange={e => setFormData({...formData, id_categoria: e.target.value})}
                                className="form-select"
                                required
                            >
                                <option value="">-- Selecciona --</option>
                                {categorias && categorias.map(categoria => (
                                    <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                        {categoria.nombre_categoria}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <button type="submit" className="btn-submit">
                        {eventoParaEditar ? 'Actualizar Evento' : 'Guardar Evento'}
                    </button>
                </form>
            </div>
        </div>
    );
}