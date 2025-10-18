// backend/services/cacheService.js

// Un simple sistema de caché en memoria con TTL (Time-To-Live).
const cache = new Map();

/**
 * Guarda un valor en la caché con un tiempo de vida (TTL) en segundos.
 * @param {string} key - La clave única para el dato en caché.
 * @param {*} value - El valor a guardar.
 * @param {number} ttl - Tiempo de vida en segundos. Por defecto 600s (10 minutos).
 */
export function set(key, value, ttl = 600) {
  const expires = Date.now() + ttl * 1000;
  cache.set(key, { value, expires });
  console.log(`CACHE: Guardado "${key}" con TTL de ${ttl}s.`);
}

/**
 * Obtiene un valor de la caché. Devuelve null si no existe o ha expirado.
 * @param {string} key - La clave del dato a obtener.
 * @returns {*} El valor guardado o null.
 */
export function get(key) {
  const data = cache.get(key);
  if (!data) {
    console.log(`CACHE: Fallo para "${key}".`);
    return null;
  }

  if (Date.now() > data.expires) {
    console.log(`CACHE: Expirado "${key}". Eliminando.`);
    cache.delete(key);
    return null;
  }

  console.log(`CACHE: Acierto para "${key}".`);
  return data.value;
}

/**
 * Elimina un dato específico de la caché.
 * @param {string} key - La clave a eliminar.
 */
export function clear(key) {
  if (cache.has(key)) {
    cache.delete(key);
    console.log(`CACHE: Limpiado "${key}".`);
  }
}

/**
 * Elimina todas las claves de la caché que comiencen con un prefijo dado.
 * @param {string} prefix - El prefijo para buscar y eliminar.
 */
export function clearByPrefix(prefix) {
  let clearedCount = 0;
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
      clearedCount++;
    }
  }
  if (clearedCount > 0) console.log(`CACHE: Limpiadas ${clearedCount} claves con prefijo "${prefix}".`);
}

export default {
  get,
  set,
  clear,
  clearByPrefix
};