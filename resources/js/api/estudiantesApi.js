import { mockResponse } from './client';

// Campos alineados a tu tabla "usuarios" (id_usuario, id_rol, nombre_completo,
// correo_institucional, matricula_empleado, estado_usuario, foto_perfil).
// Ajusta nombres/campos apenas me pases tu esquema real si hay una tabla
// "estudiantes" separada con más datos (carrera, semestre, etc).
let ESTUDIANTES = [
    {
        id_usuario: 101,
        nombre_completo: 'Ana Sofía Martínez López',
        correo_institucional: 'ana.martinez@institucion.edu',
        matricula_empleado: 'A2023-0145',
        estado_usuario: 'Activo',
        foto_perfil: null,
    },
    {
        id_usuario: 102,
        nombre_completo: 'Carlos Eduardo Ramírez Torres',
        correo_institucional: 'carlos.ramirez@institucion.edu',
        matricula_empleado: 'A2022-0876',
        estado_usuario: 'Activo',
        foto_perfil: null,
    },
    {
        id_usuario: 103,
        nombre_completo: 'Valeria Guadalupe Hernández Cruz',
        correo_institucional: 'valeria.hernandez@institucion.edu',
        matricula_empleado: 'A2024-0021',
        estado_usuario: 'Inactivo',
        foto_perfil: null,
    },
    {
        id_usuario: 104,
        nombre_completo: 'Jorge Iván Domínguez Pérez',
        correo_institucional: 'jorge.dominguez@institucion.edu',
        matricula_empleado: 'A2023-0532',
        estado_usuario: 'Activo',
        foto_perfil: null,
    },
];

// GET /api/estudiantes
export async function getEstudiantes() {
    return mockResponse(ESTUDIANTES);
}

// GET /api/estudiantes?buscar={query}
export async function searchEstudiantes(query) {
    const texto = query.trim().toLowerCase();
    if (!texto) return mockResponse(ESTUDIANTES);

    const resultado = ESTUDIANTES.filter(
        (est) =>
            est.nombre_completo.toLowerCase().includes(texto) ||
            est.correo_institucional.toLowerCase().includes(texto) ||
            est.matricula_empleado.toLowerCase().includes(texto)
    );
    return mockResponse(resultado);
}
