/**
 * Configuración de sedes de Paninos.
 * 
 * NOTA: Por ahora estos datos son estáticos (hardcoded).
 * Cuando el backend tenga el endpoint GET /api/locations/,
 * se puede reemplazar esta importación por una llamada a la API.
 */

export const LOCATIONS = [
    {
        id: 1,
        slug: 'caldas',
        name: 'Sede Caldas',
        address: 'Caldas, Antioquia',
        neighborhood: 'Centro',
        schedule: 'Lun - Sáb: 10am - 8pm · Dom: 11am - 6pm',
        // Número de WhatsApp de ESTA sede (para notificaciones de pedidos)
        whatsappNumber: '573137258091',
        // Color de acento para diferenciar visualmente las sedes
        accentColor: 'paninos-yellow',
        // Emoji/icono representativo
        emoji: '🏪',
        // ¿Tiene domicilio disponible?
        hasDelivery: true,
        // Tiempo estimado de preparación (minutos)
        prepTimeMinutes: 20,
        // Loggro POS ID (para filtrar el menú por sede en el futuro)
        logroPosId: 1,
        // Coordenadas para el mapa de cobertura (futuro)
        coordinates: {
            lat: 6.0948,
            lng: -75.6357,
        },
    },
    {
        id: 2,
        slug: 'otra-sede',
        name: 'Sede Principal',
        address: 'Medellín, Antioquia',
        neighborhood: 'El Poblado',
        schedule: 'Lun - Sáb: 11am - 9pm · Dom: 12pm - 7pm',
        whatsappNumber: '573137258091', // Reemplazar con el número real de esta sede
        accentColor: 'blue-400',
        emoji: '🏬',
        hasDelivery: false,
        prepTimeMinutes: 25,
        logroPosId: 2,
        coordinates: {
            lat: 6.2087,
            lng: -75.5706,
        },
    },
];

/**
 * Obtiene una sede por su ID.
 * @param {number} id
 * @returns {object|undefined}
 */
export function getLocationById(id) {
    return LOCATIONS.find((loc) => loc.id === id);
}

/**
 * Obtiene una sede por su slug.
 * @param {string} slug
 * @returns {object|undefined}
 */
export function getLocationBySlug(slug) {
    return LOCATIONS.find((loc) => loc.slug === slug);
}
