import React, { createContext, useCallback, useContext, useState } from 'react';
import Toast from '../components/Toast/Toast';

const ToastContext = createContext(null);

let idCounter = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const cerrarToast = useCallback((id) => {
        setToasts((actuales) => actuales.filter((t) => t.id !== id));
    }, []);

    // tipo: 'success' | 'error' | 'info'
    const showToast = useCallback((mensaje, tipo = 'success', duracionMs = 3500) => {
        const id = ++idCounter;
        setToasts((actuales) => [...actuales, { id, mensaje, tipo }]);
        setTimeout(() => cerrarToast(id), duracionMs);
    }, [cerrarToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-stack">
                {toasts.map((t) => (
                    <Toast key={t.id} mensaje={t.mensaje} tipo={t.tipo} onClose={() => cerrarToast(t.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

// Hook para usar en cualquier componente: const { showToast } = useToast();
export const useToast = () => {
    const contexto = useContext(ToastContext);
    if (!contexto) {
        throw new Error('useToast debe usarse dentro de un <ToastProvider>');
    }
    return contexto;
};
