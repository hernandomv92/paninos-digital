/**
 * lib/deliveryZones.js
 *
 * Dos capas:
 *  1. ALL_CALI_NEIGHBORHOODS — lista completa de barrios de Cali (~250)
 *     Usada para el autocomplete (el cliente puede buscar cualquier barrio).
 *
 *  2. COBERTURA_* — subconjuntos con cobertura por sede.
 *     Solo estos tienen entrega a domicilio activa.
 *
 * PARA AGREGAR BARRIOS A COBERTURA:
 *   - Agrega el nombre (en minúsculas, sin tilde) al array COBERTURA_LIBERTADORES
 *     o COBERTURA_CALDAS según corresponda.
 *   - El nombre debe coincidir exactamente con cómo aparece en ALL_CALI_NEIGHBORHOODS.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. TODOS LOS BARRIOS DE CALI (para autocomplete)
// ─────────────────────────────────────────────────────────────────────────────
// Fuente: comunas 1–22 de Santiago de Cali.
// Organizados alfabéticamente. Agregar nuevos barrios aquí si faltan.

export const ALL_CALI_NEIGHBORHOODS = [
    // A
    'Aguacatal',
    'Aguablanca',
    'Alfonso López',
    'Alférez Real',
    'Altos de Menga',
    'Altos de Santa Mónica',
    'Altos de Normandía',
    'Antonio Nariño',
    'Aranjuez',
    'Autopista Sur',
    // B
    'Bajo Aguacatal',
    'Bajo Jordán',
    'Belén',
    'Bello Horizonte',
    'Benjamín Herrera',
    'Boyacá',
    'Bretaña',
    'Buenos Aires',
    // C
    'Caldas',
    'Calimio',
    'Calipso',
    'Caney',
    'Cañasgordas',
    'Capri',
    'Centenario',
    'Charco Azul',
    'Chipichape',
    'Chipichape Norte',
    'Ciudad 2000',
    'Ciudad Capri',
    'Ciudad Córdoba',
    'Ciudad Jardín',
    'Ciudad Universitaria',
    'Claret',
    'Colinas del Limonar',
    'Comuneros',
    'Concepción',
    'Cristóbal Colón',
    'Cristo Rey',
    'Cuarto de Legua',
    'Cureña',
    // D
    'Departamental',
    'Doce de Octubre',
    // E
    'El Bosque',
    'El Caney',
    'El Cortijo',
    'El Diamante',
    'El Dorado',
    'El Guabal',
    'El Ingenio',
    'El Libertador',
    'El Nacional',
    'El Parche',
    'El Peñón',
    'El Piloto',
    'El Poblado',
    'El Retiro',
    'El Rodeo',
    'El Troncal',
    'El Vallado',
    'El Vergel',
    // F
    'Fátima',
    'Floralia',
    'Florida Nueva',
    'Floresta',
    // G
    'Gaitán',
    'Gardenias',
    'Guayaquil',
    'Granada',
    // H
    'Holmes Trujillo',
    'Huandama',
    // I
    'Ignacio Rengifo',
    // J
    'Jorge Zawadzky',
    'José María Córdoba',
    // L
    'La Alameda',
    'La Base',
    'La Choclona',
    'La Esperanza',
    'La Flora',
    'La Floresta',
    'La Fortaleza',
    'La Frontera',
    'La Gran Colombia',
    'La Hacienda',
    'La Independencia',
    'La Isla',
    'La Leyenda',
    'La Merced',
    'La Miranda',
    'La Nueva Granada',
    'La Paz',
    'La Playita',
    'La Reforma',
    'La Rivera',
    'La Rosa',
    'La Selva',
    'La Sirena',
    'La Sultana',
    'La Trinidad',
    'La Unión',
    'Las Acacias',
    'Las Américas',
    'Las Ceibas',
    'Las Delicias',
    'Las Granjas',
    'Las Lomas',
    'Las Orquídeas',
    'Las Palmas',
    'Libertadores',
    'Limonar',
    'Los Anzos',
    'Los Chorros',
    'Los Comuneros',
    'Los Libertadores',
    'Los Mangos',
    'Los Naranjos',
    'Los Pinos',
    // M
    'Manuela Beltrán',
    'Marroquín',
    'Meléndez',
    'Menga',
    'Miraflores',
    'Montebello',
    // N
    'Nápoles',
    'Normandía',
    'Nueva Floresta',
    'Nueva Italia',
    // O
    'Obrero',
    // P
    'Pance',
    'Pasoancho',
    'Paso del Comercio',
    'Petecuy',
    'Pízamos',
    'Popular',
    'Portal de la Hacienda',
    // Q
    'Quintas de Don Simón',
    'Quintas de San Pedro',
    // R
    'Rafael Uribe',
    'República de Israel',
    'Reforma',
    // S
    'Salomia',
    'San Bosco',
    'San Antonio',
    'San Cayetano',
    'San Fernando',
    'San Fernando Nuevo',
    'San Judas Tadeo',
    'San Luis',
    'San Pedro',
    'San Vicente',
    'Santa Elena',
    'Santa Fe',
    'Santa Mónica',
    'Santa Mónica Residencial',
    'Santa Rosa',
    'Santa Teresita',
    'Siloe',
    'Siloé',
    // T
    'Talanga',
    'Terrón Colorado',
    'Tequendama',
    'Trinidad',
    // U
    'Unicentro',
    'Univalle',
    // V
    'Valle de Lili',
    'Valle del Lili',
    'Versalles',
    'Villa Colombia',
    'Villacolombia',
    'Villa Fátima',
    'Villa del Sur',
    // Y
    'Yumbo', // límite norte Cali
    // Z
    'Zamorano',
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. BARRIOS CON COBERTURA POR SEDE
// ─────────────────────────────────────────────────────────────────────────────
// ⚠️  Para agregar un barrio a cobertura:
//     - Debe existir en ALL_CALI_NEIGHBORHOODS (o agréguelo allí primero)
//     - Copie el nombre normalizado (minúsculas, sin tilde) aquí debajo

// Sede Libertadores — zona centro-norte de Cali
// Mapa: desde Chipichape/Calle 42 hasta Huandama/Calle 8 · Cras 15 a 70
const COBERTURA_LIBERTADORES = new Set([
    'aranjuez',
    'autopista sur',
    'bello horizonte',
    'bretana',
    'buenos aires',
    'centenario',
    'chipichape',
    'concepcion',
    'cristobal colon',
    'cuarto de legua',
    'el ingenio',
    'el parche',
    'el penon',
    'granada',
    'guayaquil',
    'huandama',
    'la alameda',
    'la flora',
    'la merced',
    'la nueva granada',
    'la selva',
    'las delicias',
    'las lomas',
    'libertadores',
    'los libertadores',
    'miraflores',
    'nueva granada',
    'obrero',
    'paso del comercio',
    'quintas de san pedro',
    'salomia',
    'san antonio',
    'san bosco',
    'san cayetano',
    'san fernando',
    'san fernando nuevo',
    'san pedro',
    'santa monica',
    'santa monica residencial',
    'santa rosa',
    'versalles',
]);

// Sede Caldas — zona sur-occidente de Cali
// Mapa: desde El Guabal/Calle 44 hasta ICESI/Pance · Cras 28 a 100+
const COBERTURA_CALDAS = new Set([
    'bajo jordan',
    'caldas',
    'canasgordas',
    'capri',
    'ciudad 2000',
    'ciudad capri',
    'ciudad cordoba',
    'ciudad jardin',
    'ciudad universitaria',
    'el caney',
    'el guabal',
    'holmes trujillo',
    'la hacienda',
    'los chorros',
    'los mangos',
    'los naranjos',
    'melendez',
    'montebello',
    'pance',
    'pasoancho',
    'portal de la hacienda',
    'saladito',
    'terron colorado',
    'unicentro',
    'univalle',
    'valle de lili',
    'villa fatima',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. FUNCIONES PÚBLICAS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normaliza un string para comparación (minúsculas, sin tildes, sin espacios extra).
 */
function normalize(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Dado el nombre de un barrio, retorna si tiene cobertura y qué sede le asigna.
 *
 * @param {string} neighborhood
 * @returns {{ covered: true, sede_slug: string } | { covered: false }}
 */
export function checkCoverage(neighborhood) {
    const q = normalize(neighborhood);

    if (COBERTURA_LIBERTADORES.has(q)) return { covered: true, sede_slug: 'libertadores' };
    if (COBERTURA_CALDAS.has(q)) return { covered: true, sede_slug: 'caldas' };

    // Búsqueda parcial como fallback
    for (const n of COBERTURA_LIBERTADORES) {
        if (n.includes(q) || q.includes(n)) return { covered: true, sede_slug: 'libertadores' };
    }
    for (const n of COBERTURA_CALDAS) {
        if (n.includes(q) || q.includes(n)) return { covered: true, sede_slug: 'caldas' };
    }

    return { covered: false };
}

/**
 * Retorna sugerencias de autocompletado desde TODOS los barrios de Cali.
 * Cada sugerencia incluye si tiene cobertura o no.
 *
 * @param {string} query
 * @param {number} limit
 * @returns {Array<{ name: string, covered: boolean, sede: string|null }>}
 */
export function getNeighborhoodSuggestions(query, limit = 8) {
    if (!query || query.length < 2) return [];

    const q = normalize(query);

    const results = ALL_CALI_NEIGHBORHOODS
        .filter(name => normalize(name).includes(q))
        .sort((a, b) => {
            // Priorizar los que empiezan con el query
            const aN = normalize(a);
            const bN = normalize(b);
            const aStarts = aN.startsWith(q);
            const bStarts = bN.startsWith(q);
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
            return aN.localeCompare(bN);
        })
        .slice(0, limit)
        .map(name => {
            const nName = normalize(name);
            let covered = false;
            let sede = null;
            if (COBERTURA_LIBERTADORES.has(nName)) { covered = true; sede = 'libertadores'; }
            else if (COBERTURA_CALDAS.has(nName)) { covered = true; sede = 'caldas'; }
            return { name, covered, sede };
        });

    return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DATOS PARA MOSTRAR EN UI
// ─────────────────────────────────────────────────────────────────────────────

export const COVERAGE_ZONES_DISPLAY = [
    {
        sede: 'Sede Libertadores',
        slug: 'libertadores',
        count: COBERTURA_LIBERTADORES.size,
        destacados: ['Granada', 'Santa Mónica', 'San Antonio', 'La Alameda', 'Guayaquil', 'San Fernando', 'Chipichape'],
    },
    {
        sede: 'Sede Caldas',
        slug: 'caldas',
        count: COBERTURA_CALDAS.size,
        destacados: ['Caldas', 'Ciudad Jardín', 'Valle de Lili', 'El Caney', 'Ciudad 2000', 'Meléndez', 'Unicentro'],
    },
];

export const TOTAL_COVERAGE_BARRIOS = COBERTURA_LIBERTADORES.size + COBERTURA_CALDAS.size;
