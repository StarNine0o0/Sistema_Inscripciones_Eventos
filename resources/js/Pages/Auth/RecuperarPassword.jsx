import React, { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { errors } = usePage().props;
    const [correo, setCorreo] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/recuperar-password', { correo_institucional: correo });
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Recuperar Contraseña</h2>
            <div style={{ color: 'red', wordBreak: 'break-all' }}>Errores ocultos: {JSON.stringify(errors)}</div>
            <p style={{ fontSize: '14px', color: '#666' }}>
                Ingresa tu correo institucional y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            {status && <div style={{ color: 'green', marginBottom: '10px' }}>{status}</div>}
            {errors.correo_institucional && <div style={{ color: 'red' }}>{errors.correo_institucional}</div>}

            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Correo institucional" 
                    required 
                    value={correo}
                    onChange={e => setCorreo(e.target.value)}
                    style={{ width: '100%', padding: '10px', margin: '10px 0', boxSizing: 'border-box' }}
                />
                <button type="submit" style={{ width: '100%', padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Enviar enlace
                </button>
            </form>
            <div style={{ marginTop: '15px' }}>
                <Link href="/login">Volver al inicio de sesión</Link>
            </div>
        </div>
    );
}