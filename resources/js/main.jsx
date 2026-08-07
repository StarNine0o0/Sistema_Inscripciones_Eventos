import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import { ToastProvider } from './context/ToastContext';

import '../css/app.css';

const App = () => {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem('usuario');
        if (usuarioGuardado) {
            setUsuario(JSON.parse(usuarioGuardado));
        }
        setCargando(false);
    }, []);

    const handleLoginSuccess = (user) => {
        setUsuario(user);
    };

    if (cargando) {
        return null;
    }

    return (
        <React.StrictMode>
            <ToastProvider>
                {usuario ? (
                    <Dashboard usuario={usuario} />
                ) : (
                    <Login onLoginSuccess={handleLoginSuccess} />
                )}
            </ToastProvider>
        </React.StrictMode>
    );
};

// --- CONTROL DEL CONTENEDOR RAIZ ---
const rootElement = document.getElementById('app');

if (rootElement) {
    // Si la raíz no existe en la instancia global, la creamos una sola vez
    if (!window._reactRoot) {
        window._reactRoot = ReactDOM.createRoot(rootElement);
    }
    
    // Renderizamos dentro de la misma raíz
    window._reactRoot.render(<App />);
}