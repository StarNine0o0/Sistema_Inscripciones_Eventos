import React from 'react';

// Recibe la variable 'usuario_perfil' directamente desde tu controlador de Laravel
export default function Perfil({ usuario_perfil }) {
    return (
        <div>
            <h1>Perfil de {usuario_perfil.nombre_completo}</h1>
            <p>Correo: {usuario_perfil.correo_institucional}</p>
            <p>Matrícula: {usuario_perfil.matricula_empleado}</p>
            
            <h2>Eventos que ha organizado:</h2>
            <ul>
                {usuario_perfil.eventos_organizados.map(evento => (
                    <li key={evento.id_evento}>{evento.nombre_evento}</li>
                ))}
            </ul>
        </div>
    );
}