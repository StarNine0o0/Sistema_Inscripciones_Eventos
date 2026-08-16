import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';

const ConfiguracionSection = ({ usuario }) => {
    const { showToast } = useToast();
    const [nombre, setNombre] = useState(usuario?.nombre_completo || '');
    const [correo, setCorreo] = useState(usuario?.correo_institucional || '');

    const handleGuardar = (e) => {
        e.preventDefault();
        // Real endpoint: PUT /api/usuarios/{id}
        showToast('Cambios guardados con éxito.', 'success');
    };

    return (
        <>
            <header className="top-bar">
                <div>
                    <h1 className="page-title">Configuración</h1>
                    <p className="page-subtitle">Administra los datos de tu cuenta</p>
                </div>
            </header>

            <section className="table-panel">
                <div className="table-header">
                    <h3 className="table-title">Perfil</h3>
                </div>

                <form onSubmit={handleGuardar} className="modal-form">
                    <div className="form-group">
                        <label>Nombre completo</label>
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    </div>

                    <div className="form-group">
                        <label>Correo institucional</label>
                        <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="btn-submit">Guardar Cambios</button>
                    </div>
                </form>
            </section>
        </>
    );
};

export default ConfiguracionSection;
