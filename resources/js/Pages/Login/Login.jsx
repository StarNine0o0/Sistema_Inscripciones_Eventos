import React from 'react';
import { useForm, Head } from '@inertiajs/react';
import './login.css';

export default function Login() {
    // Usamos tu lógica de Inertia para conectar con el backend
    const { data, setData, post, processing, errors } = useForm({
        correo_institucional: '',
        contrasena: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Enviamos la petición directamente a tu AuthController
        post('/login');
    };

    return (
        <>
            <Head title="Iniciar sesión" />

            {/* Mantenemos la estructura visual exacta de tu compañera */}
            <div className="login-page">
                <div className="login-card">
                    <div className="login-header">
                        <h1 className="login-logo">UniEvents</h1>
                        <p className="login-subtitle">Inicia sesión para continuar</p>
                    </div>

                    {/* Manejo de errores que vienen desde Laravel */}
                    {errors.correo_institucional && (
                        <div className="login-feedback error">
                            {errors.correo_institucional}
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
                                value={data.correo_institucional}
                                onChange={(e) => setData('correo_institucional', e.target.value)}
                                placeholder="ejemplo@institucion.edu"
                                required
                                autoFocus
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
                                value={data.contrasena}
                                onChange={(e) => setData('contrasena', e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            {/* Mostramos error de contraseña si existe */}
                            {errors.contrasena && (
                                <div className="login-feedback error" style={{ marginTop: '0.5rem' }}>
                                    {errors.contrasena}
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing} 
                            className="login-button"
                        >
                            {/* Usamos el 'processing' de Inertia para el estado de carga */}
                            {processing ? 'Ingresando...' : 'Entrar'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}