import React, { useState, useEffect } from 'react';

// Objeto con valores por defecto para limpiar el formulario cuando se crea un evento nuevo
const INITIAL_STATE = {
  nombre_evento: '',
  descripcion: '',
  fecha_inicio: '',
  fecha_fin: '',
  capacidad_maxima: 100,
  imagen_portada: '',
  estado_evento: 'Programado'
};

const ModalEvento = ({ isOpen, onClose, eventoAEditar = null, onSave }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);

  // EFECTO CLAVE: Si 'eventoAEditar' cambia o se abre el modal, cargamos los datos o limpiamos el formulario
  useEffect(() => {
    if (eventoAEditar) {
      setFormData(eventoAEditar);
    } else {
      setFormData(INITIAL_STATE);
    }
  }, [eventoAEditar, isOpen]);

  if (!isOpen) return null;

  const esEdicion = Boolean(eventoAEditar);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, esEdicion);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glassmorphism">
        <div className="modal-header">
          <h2>{esEdicion ? 'Editar Evento' : 'Crear Nuevo Evento'}</h2>
          <button className="modal-close" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nombre del Evento</label>
            <input 
              type="text" 
              name="nombre_evento" 
              value={formData.nombre_evento} 
              onChange={handleInputChange} 
              placeholder="Ej. Conferencia de IA" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea 
              name="descripcion" 
              value={formData.descripcion} 
              onChange={handleInputChange} 
              rows="3" 
              placeholder="Detalles sobre el evento..." 
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fecha y Hora Inicio</label>
              <input 
                type="datetime-local" 
                name="fecha_inicio" 
                value={formData.fecha_inicio} 
                onChange={handleInputChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Fecha y Hora Fin</label>
              <input 
                type="datetime-local" 
                name="fecha_fin" 
                value={formData.fecha_fin} 
                onChange={handleInputChange} 
                required 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Capacidad Máxima</label>
              <input 
                type="number" 
                name="capacidad_maxima" 
                value={formData.capacidad_maxima} 
                onChange={handleInputChange} 
                min="1" 
                required 
              />
            </div>

            <div className="form-group">
              <label>Estado Inicial</label>
              <select 
                name="estado_evento" 
                value={formData.estado_evento} 
                onChange={handleInputChange}
              >
                <option value="Programado">Programado</option>
                <option value="En Curso">En Curso</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Carga de Imagen Portada */}
          <div className="form-group">
            <label>Imagen de Portada</label>
            <div className="image-input-container">
              <input 
                type="file" 
                accept="image/*"
                id="imagen_portada_input"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData((prev) => ({ ...prev, imagen_portada: file.name }));
                  }
                }} 
                style={{ display: 'none' }}
              />
              <label htmlFor="imagen_portada_input" className="file-upload-btn">
                <span className="material-symbols-outlined">add_photo_alternate</span>
                {formData.imagen_portada ? formData.imagen_portada : 'Seleccionar imagen de portada'}
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {esEdicion ? 'Guardar Cambios' : 'Crear Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEvento;