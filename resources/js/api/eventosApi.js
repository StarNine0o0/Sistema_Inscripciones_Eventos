import { mockResponse } from './client';

// Datos ficticios. Cuando conectes el backend, este arreglo desaparece:
// los datos vendrán de la respuesta real de GET /api/eventos
let EVENTOS = [
    {
        id_evento: 1,
        nombre_evento: 'Conferencia Internacional de IA 2026',
        descripcion: 'Un vistazo al futuro de la tecnología y el desarrollo de software.',
        fecha_inicio: '2026-06-23T09:00',
        fecha_fin: '2026-06-23T18:00',
        capacidad_maxima: 200,
        inscritos: 142,
        imagen_portada: 'ia-conference.jpg',
        estado_evento: 'Programado',
    },
    {
        id_evento: 2,
        nombre_evento: 'Hackathon Universitario',
        descripcion: 'Competencia de 24 horas para resolver problemas reales mediante código.',
        fecha_inicio: '2026-07-15T10:00',
        fecha_fin: '2026-07-16T10:00',
        capacidad_maxima: 100,
        inscritos: 58,
        imagen_portada: 'hackathon.jpg',
        estado_evento: 'Programado',
    },
    {
        id_evento: 3,
        nombre_evento: 'Semana de Ciberseguridad',
        descripcion: 'Talleres prácticos sobre pentesting, redes y protección de datos.',
        fecha_inicio: '2026-05-04T09:00',
        fecha_fin: '2026-05-08T17:00',
        capacidad_maxima: 150,
        inscritos: 150,
        imagen_portada: 'ciberseguridad.jpg',
        estado_evento: 'Finalizado',
    },
    {
        id_evento: 4,
        nombre_evento: 'Feria de Titulación',
        descripcion: 'Presentación de proyectos finales de las carreras de ingeniería.',
        fecha_inicio: '2026-08-10T09:00',
        fecha_fin: '2026-08-10T15:00',
        capacidad_maxima: 300,
        inscritos: 12,
        imagen_portada: 'feria-titulacion.jpg',
        estado_evento: 'Cancelado',
    },
];

// GET /api/eventos
export async function getEventos() {
    return mockResponse(EVENTOS);
}

// GET /api/eventos?buscar={query}
export async function searchEventos(query) {
    const texto = query.trim().toLowerCase();
    if (!texto) return mockResponse(EVENTOS);

    const resultado = EVENTOS.filter(
        (ev) =>
            ev.nombre_evento.toLowerCase().includes(texto) ||
            ev.descripcion.toLowerCase().includes(texto) ||
            ev.estado_evento.toLowerCase().includes(texto)
    );
    return mockResponse(resultado);
}

// POST /api/eventos
export async function crearEvento(datos) {
    const nuevo = { ...datos, id_evento: Date.now(), inscritos: 0 };
    EVENTOS = [...EVENTOS, nuevo];
    return mockResponse(nuevo);
}

// PUT /api/eventos/{id}
export async function actualizarEvento(id, datos) {
    EVENTOS = EVENTOS.map((ev) => (ev.id_evento === id ? { ...ev, ...datos } : ev));
    return mockResponse(EVENTOS.find((ev) => ev.id_evento === id));
}

// DELETE /api/eventos/{id}
export async function eliminarEvento(id) {
    EVENTOS = EVENTOS.filter((ev) => ev.id_evento !== id);
    return mockResponse({ ok: true });
}
