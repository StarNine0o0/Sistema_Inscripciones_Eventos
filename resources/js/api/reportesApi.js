import { request } from './client';

export const TIPOS_REPORTE = [
    { id: 'resumen_general', label: 'Resumen General', icono: 'space_dashboard' },
    { id: 'eventos_populares', label: 'Eventos Populares', icono: 'local_fire_department' },
    { id: 'tasa_asistencia', label: 'Tasa de Asistencia', icono: 'fact_check' },
    { id: 'participacion_categoria', label: 'Participación por Categoría', icono: 'category' },
    { id: 'usuarios_activos', label: 'Usuarios más Activos', icono: 'workspace_premium' },
];

function aQueryString(filtros = {}) {
    const params = new URLSearchParams(filtros);
    const qs = params.toString();
    return qs ? `?${qs}` : '';
}

export async function getResumenGeneral(filtros = {}) {
    const data = await request(`/reportes/resumen-general${aQueryString(filtros)}`);
    return data.datos;
}

export async function getEventosPopulares(filtros = {}) {
    const data = await request(`/reportes/eventos-populares${aQueryString(filtros)}`);
    return data.datos;
}

export async function getTasaAsistencia(filtros = {}) {
    const data = await request(`/reportes/tasa-asistencia${aQueryString(filtros)}`);
    return data.datos;
}

export async function getParticipacionPorCategoria(filtros = {}) {
    const data = await request(`/reportes/participacion-categoria${aQueryString(filtros)}`);
    return data.datos;
}

export async function getUsuariosMasActivos(filtros = {}) {
    const data = await request(`/reportes/usuarios-activos${aQueryString(filtros)}`);
    return data.datos;
}

export async function solicitarExportacion(tipoReporte, formato, filtros = {}) {
    return request('/reportes/exportar', {
        method: 'POST',
        body: { tipo_reporte: tipoReporte, formato, ...filtros },
    });
}

export async function consultarEstadoReporte(idReporte) {
    return request(`/reportes/${idReporte}/estado`);
}

export async function descargarReporte(idReporte) {
    // Descarga directa: el navegador maneja el archivo binario.
    window.location.href = `/reportes/${idReporte}/descargar`;
}

export async function getHistorialReportes() {
    // Nota: no existe endpoint de listado en ReporteController todavía.
    // Devolvemos vacío por ahora para no romper la UI.
    return [];
}