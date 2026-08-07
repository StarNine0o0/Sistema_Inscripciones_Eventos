import React from 'react';
import './Toast.css';

const ICONOS = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
};

const Toast = ({ mensaje, tipo = 'success', onClose }) => {
    return (
        <div className={`toast toast-${tipo}`}>
            <span className="material-symbols-outlined toast-icon">{ICONOS[tipo] || ICONOS.info}</span>
            <span className="toast-message">{mensaje}</span>
            <button className="toast-close" onClick={onClose} title="Cerrar">
                <span className="material-symbols-outlined">close</span>
            </button>
        </div>
    );
};

export default Toast;
