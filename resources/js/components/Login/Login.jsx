import React, { useState } from 'react';
import './Login.css';

// Agregamos onLoginSuccess como prop
const Login = ({ onLoginSuccess }) => {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [mensaje, setMensaje] = useState(null);
    const [cargando, setCargando] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setCargando(true);

        // Datos de usuario de prueba (Mock)
        const usuarioMock = {
            id_usuario: 1,
            nombre_completo: 'Usuario de Prueba',
            correo_institucional: correo || 'admin@institucion.edu',
            id_rol: 1
        };

        // Simula la respuesta rápida de entrada
        setTimeout(() => {
            localStorage.setItem('usuario', JSON.stringify(usuarioMock));
            setCargando(false);

            // En lugar de recargar la página o ir a /api/login, notificamos a React:
            if (onLoginSuccess) {
                onLoginSuccess(usuarioMock);
            }
        }, 300);
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h1 className="login-logo">UniEvents</h1>
                    <p className="login-subtitle">Inicia sesión en el Admin Panel</p>
                </div>

                {mensaje && (
                    <div className={`login-feedback ${mensaje.tipo}`}>
                        {mensaje.texto}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="correo">
                            Correo Institucional
                        </label>
                        <input
                            id="correo"
                            type="email"
                            className="form-input"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            placeholder="ejemplo@institucion.edu"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="contrasena">
                            Contraseña
                        </label>
                        <input
                            id="contrasena"
                            type="password"
                            className="form-input"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={cargando} 
                        className="login-button"
                    >
                        {cargando ? 'Ingresando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;