import React, { useState } from 'react';
import { router, Link, usePage } from '@inertiajs/react';

export default function Index({ usuarios, filtros }) {
    const { auth, errors } = usePage().props;
    const usuarioLogeado = auth?.user || {};

    // Estados para búsqueda y filtrado
    const [busqueda, setBusqueda] = useState(filtros?.busqueda || '');
    const [filtroRol, setFiltroRol] = useState(filtros?.id_rol || '');

    // Estados para el formulario
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [formData, setFormData] = useState({
        nombre_completo: '',
        correo_institucional: '',
        matricula_empleado: '',
        contrasena: '',
        id_rol: ''
    });

    const handleFiltros = (e) => {
        e.preventDefault();
        // El backend espera 'id_rol', no 'rol'
        router.get('/usuarios', { busqueda, id_rol: filtroRol }, { preserveState: true });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post('/usuarios', formData, {
            onSuccess: () => {
                setMostrarFormulario(false);
                setFormData({ nombre_completo: '', correo_institucional: '', matricula_empleado: '', contrasena: '', id_rol: '' });
                alert('Usuario registrado correctamente');
            }
        });
    };

    const handleCambiarEstado = (id, estadoActual) => {
        const nuevoEstado = estadoActual === 'Activo' ? 'Inactivo' : 'Activo';
        const accion = estadoActual === 'Activo' ? 'Desactivar' : 'Activar';
        
        if (!confirm(`¿Seguro que deseas ${accion} este usuario?`)) return;
        
        // Usamos la ruta DELETE (destroy) pero le mandamos el nuevo estado por data
        router.delete(`/usuarios/${id}`, { 
            data: { estado_usuario: nuevoEstado },
            preserveScroll: true,
            onSuccess: () => alert(`Usuario ${nuevoEstado.toLowerCase()} con éxito.`),
            onError: (err) => alert(err.error || 'Error al cambiar estado')
        });
    };

    const handleRestablecerContrasena = (id) => {
        const nuevaContrasena = prompt("Ingresa la nueva contraseña (mínimo 6 caracteres):");
        if (!nuevaContrasena) return;
        if (nuevaContrasena.length < 6) return alert("La contraseña debe tener al menos 6 caracteres.");

        router.put(`/usuarios/${id}/restablecer-contrasena`, { contrasena: nuevaContrasena }, {
            preserveScroll: true,
            onSuccess: () => alert('Contraseña restablecida correctamente.')
        });
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            
            {/* SIDEBAR */}
            <div style={{ width: '250px', background: '#1f2937', color: 'white', padding: '20px' }}>
                <h2>Mi Proyecto</h2>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '20px' }}>
                    Conectado como: {usuarioLogeado.nombre_completo} (Admin)
                </div>

                <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
                    <li style={{ marginBottom: '15px' }}>
                        <Link href="/usuarios" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 'bold' }}>👥 Usuarios</Link>
                    </li>
                    <li style={{ marginBottom: '15px' }}>
                        <Link href="/categorias" style={{ color: 'white', textDecoration: 'none' }}>🏷️ Categorías</Link>
                    </li>
                    <li style={{ marginBottom: '15px' }}>
                        <Link href="/sedes" style={{ color: 'white', textDecoration: 'none' }}>🏢 Sedes</Link>
                    </li>
                </ul>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div style={{ flex: 1, padding: '30px', background: '#f3f4f6' }}>
                
                {/* MOSTRAR ERRORES DEL BACKEND */}
                {errors?.error && (
                    <div style={{ background: '#fecaca', color: '#991b1b', padding: '10px', marginBottom: '15px', borderRadius: '4px' }}>
                        {errors.error}
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>Gestión de Usuarios</h1>
                    <button 
                        onClick={() => setMostrarFormulario(!mostrarFormulario)}
                        style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        {mostrarFormulario ? 'Cancelar' : '+ Nuevo Usuario'}
                    </button>
                </div>

                {/* BARRA DE BÚSQUEDA Y FILTROS */}
                <form onSubmit={handleFiltros} style={{ display: 'flex', gap: '10px', marginTop: '20px', background: 'white', padding: '15px', borderRadius: '8px' }}>
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre o correo..." 
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        style={{ flex: 2, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <select 
                        value={filtroRol} 
                        onChange={e => setFiltroRol(e.target.value)}
                        style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="">Todos los roles</option>
                        <option value="1">Administrador</option>
                        <option value="2">Organizador</option>
                    </select>
                    <button type="submit" style={{ padding: '8px 15px', background: '#4b5563', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        🔍 Filtrar
                    </button>
                </form>

                {/* FORMULARIO DE CREACIÓN */}
                {mostrarFormulario && (
                    <div style={{ background: 'white', padding: '20px', marginTop: '20px', borderRadius: '8px', border: '1px solid #ccc' }}>
                        <h3>Registrar Nuevo Usuario</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
                            <input type="text" placeholder="Nombre completo" required value={formData.nombre_completo} onChange={e => setFormData({...formData, nombre_completo: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            <input type="email" placeholder="Correo institucional" required value={formData.correo_institucional} onChange={e => setFormData({...formData, correo_institucional: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            <input type="text" placeholder="Matrícula / No. Empleado" required value={formData.matricula_empleado} onChange={e => setFormData({...formData, matricula_empleado: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                            <input type="password" placeholder="Contraseña" required value={formData.contrasena} onChange={e => setFormData({...formData, contrasena: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />

                            <select required value={formData.id_rol} onChange={e => setFormData({...formData, id_rol: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                                <option value="">-- Seleccionar Rol --</option>
                                <option value="1">Administrador</option>
                                <option value="2">Organizador</option>
                            </select>
                            
                            <button type="submit" style={{ gridColumn: 'span 2', padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Guardar Usuario
                            </button>
                        </form>
                    </div>
                )}

                {/* TABLA DE USUARIOS */}
                <div style={{ background: 'white', marginTop: '20px', borderRadius: '8px', padding: '20px', overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #eee' }}>
                                <th>Matrícula</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios?.data && usuarios.data.length > 0 ? (
                                usuarios.data.map(user => (
                                    <tr key={user.id_usuario} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '15px 0' }}>{user.matricula_empleado}</td>
                                        <td>{user.nombre_completo}</td>
                                        {/* Corrección de nombre de variable */}
                                        <td>{user.correo_institucional}</td> 
                                        {/* Accediendo a la relación del rol si existe, si no, fallback al ID */}
                                        <td>{user.rol ? user.rol.nombre_rol : (user.id_rol === 1 ? 'Admin' : 'Organizador')}</td>
                                        <td>
                                            <span style={{ color: user.estado_usuario === 'Activo' ? 'green' : 'red', fontWeight: 'bold' }}>
                                                {user.estado_usuario}
                                            </span>
                                        </td>
                                        <td style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                            <Link href={`/usuarios/${user.id_usuario}`} style={{ background: '#3b82f6', color: 'white', padding: '5px 10px', borderRadius: '4px', textDecoration: 'none', fontSize: '12px' }}>Ver Perfil</Link>
                                            
                                            <button onClick={() => handleRestablecerContrasena(user.id_usuario)} style={{ background: '#6366f1', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                                                🔑 Contraseña
                                            </button>

                                            <button onClick={() => handleCambiarEstado(user.id_usuario, user.estado_usuario)} style={{ background: user.estado_usuario === 'Activo' ? '#ef4444' : '#10b981', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                                                {user.estado_usuario === 'Activo' ? 'Desactivar' : 'Activar'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No hay usuarios registrados.</td></tr>
                            )}
                        </tbody>
                    </table>

                    {/* PAGINACIÓN */}
                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                        {usuarios?.links && usuarios.links.map((link, index) => (
                            link.url ? (
                                <Link key={index} href={link.url} style={{ padding: '5px 10px', background: link.active ? '#3b82f6' : '#e5e7eb', color: link.active ? 'white' : 'black', textDecoration: 'none', borderRadius: '4px' }} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ) : (
                                <span key={index} style={{ padding: '5px 10px', background: '#f3f4f6', color: '#9ca3af', borderRadius: '4px' }} dangerouslySetInnerHTML={{ __html: link.label }} />
                            )
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}