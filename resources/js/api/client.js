/**
 * Cliente base de peticiones.
 *
 * Por ahora "request" no llama a ningún servidor: devuelve datos ficticios
 * con un pequeño retraso para que la interfaz se comporte igual que si
 * hablara con el backend real (loading states, promesas, etc).
 *
 * Cuando el backend Laravel esté listo, solo hay que reemplazar el cuerpo
 * de esta función por una llamada real. El resto del código (los archivos
 * eventosApi.js y estudiantesApi.js) no necesita cambiar porque ya están
 * escritos contra esta misma función.
 *
 * Ejemplo de la versión real:
 *
 *   export async function request(endpoint, options = {}) {
 *     const res = await fetch(`/api${endpoint}`, {
 *       headers: { 'Content-Type': 'application/json', ...options.headers },
 *       credentials: 'include',
 *       ...options,
 *     });
 *     if (!res.ok) throw new Error(`Error ${res.status} en ${endpoint}`);
 *     return res.json();
 *   }
 */

const SIMULATED_DELAY_MS = 350;

function clonar(data) {
    return typeof structuredClone === 'function'
        ? structuredClone(data)
        : JSON.parse(JSON.stringify(data));
}

export function mockResponse(data) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(clonar(data)), SIMULATED_DELAY_MS);
    });
}
