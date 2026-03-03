/**
 * Configuración de sedes de Paninos.
 * Datos reales de las 2 sedes en Cali, Valle del Cauca.
 */

export const LOCATIONS = [
    {
        id: 1,
        slug: 'sur',
        name: 'Sede Sur',
        address: 'Calle 3 # 68-48',
        neighborhood: 'Barrio Caldas',
        city: 'Cali, Valle del Cauca',
        schedule: 'Lun - Dom: 12pm - 10:30pm',
        whatsappNumber: '573137258091',
        emoji: '🏪',
        hasDelivery: true,
        prepTimeMinutes: 20,
        logroPosId: 1,
        coordinates: { lat: 3.4516, lng: -76.5320 },
    },
    {
        id: 2,
        slug: 'oeste',
        name: 'Sede Oeste',
        address: 'Cra 22 #2b-05',
        neighborhood: 'Barrio Libertadores',
        city: 'Cali, Valle del Cauca',
        schedule: 'Lun - Dom: 12pm - 10:30pm',
        whatsappNumber: '573214382959',
        emoji: '🏬',
        hasDelivery: true,
        prepTimeMinutes: 20,
        logroPosId: 2,
        coordinates: { lat: 3.4450, lng: -76.5390 },
    },
];

export function getLocationById(id) {
    return LOCATIONS.find((loc) => loc.id === id);
}

export function getLocationBySlug(slug) {
    return LOCATIONS.find((loc) => loc.slug === slug);
}
