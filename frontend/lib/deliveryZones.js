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
    'Alto Napoles',
    'Altos de Menga',
    'Altos de Santa Mónica',
    'Altos de Normandía',
    'Antonio Nariño',
    'Arboledas',
    'Aranjuez',
    'Autopista Sur',
    // B
    'Bajo Aguacatal',
    'Bajo Jordán',
    'Belén',
    'Bellavista',
    'Bello Horizonte',
    'Benjamín Herrera',
    'Boyacá',
    'Bretaña',
    'Brisas del Limonar',
    'Buenos Aires',
    // C
    'Caldas',
    'Calimio',
    'Calipso',
    'Camino Real-Joaquin Borrero Sinisterra',
    'Camino Real-Los Fundadores',
    'Caney',
    'Cañasgordas',
    'Cañaveralejo',
    'Capri',
    'Centenario',
    'Champagnat',
    'Charco Azul',
    'Chipichape',
    'Chipichape Norte',
    'Ciudad 2000',
    'Ciudad Capri',
    'Ciudad Córdoba',
    'Ciudad Jardín',
    'Ciudad Universitaria',
    'Ciudadela Pasoancho',
    'Ciudadela Comfandi',
    'Claret',
    'Colseguros',
    'Colseguros Andes',
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
    'El Cedro',
    'El Cortijo',
    'El Diamante',
    'El Dorado',
    'El Gran Limonar',
    'El Guabal',
    'El Hoyo',
    'El Ingenio',
    'El Jordan',
    'El Libertador',
    'El Lido',
    'El Limonar',
    'El Mortiñal',
    'El Nacional',
    'El Parche',
    'El Peñón',
    'El Piloto',
    'El Poblado',
    'El Refugio',
    'El Retiro',
    'El Rodeo',
    'El Troncal',
    'El Vallado',
    'El Vergel',
    'Eucaristico',
    // F
    'Fátima',
    'Farallones',
    'Floralia',
    'Florida Nueva',
    'Floresta',
    'Francisco Eladio Ramirez',
    // G
    'Gaitán',
    'Gardenias',
    'Guayaquil',
    'Granada',
    // H
    'Holmes Trujillo',
    'Huandama',
    'Horizontes',
    // I
    'Ignacio Rengifo',
    // J
    'Juananbu',
    'Junin',
    'Jorge Zawadzky',
    'José María Córdoba',
    // L
    'La Alameda',
    'La Arbolada',
    'La Base',
    'La Cascada',
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
    'La Libertad',
    'La Merced',
    'La Miranda',
    'La Nueva Granada',
    'La Paz',
    'La Playa',
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
    'Lourdes',
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
    'Mayapan-Las Vegas',
    'Meléndez',
    'Menga',
    'Miraflores',
    'Montebello',
    'Multicentro',
    // N
    'Nápoles',
    'Navarro - la cancha',
    'Normandía',
    'Nueva Floresta',
    'Nueva Italia',
    'Nueva Tequendama',
    'Nuevo San Fernando',
    // O
    'Obrero',
    'Olimpico',
    // P
    'Panamericano',
    'Pampalinda',
    'Pance',
    'Prados del Limonar',
    'Prados del Norte',
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
    'San Juan Bosco',
    'San Judas Tadeo',
    'San Judas Tadeo II',
    'San Luis',
    'San Pascual',
    'San Pedro',
    'San Vicente',
    'Santa Anita',
    'Santa Elena',
    'Santa Barbara',
    'Santa Isabel',
    'Santa Fe',
    'Santa Mónica',
    'Santa Mónica Residencial',
    'Santa Mónica Belalcazar',
    'Santa Rosa',
    'Santa Teresita',
    'Santo Domingo',
    'Sector Melendez',
    'Siloe',
    'Siloé',
    'Santa Rita',
    // T
    'Talanga',
    'Terrón Colorado',
    'Tequendama',
    'Trinidad',
    // U
    'Unidad Residencial Santiago de Cali',
    'Unicentro',
    'Univalle',
    'Urbanizacion Militar',
    'Urbanizacion Rio Lili',
    // V
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
    // #
    '3 de Julio',
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
    'santa rita',
    'santa teresita',
    'arboledas',
    'normandia',
    'altos de normandia',
    'el penon',
    'bellavista',
    'el mortinal',
    'santa barbara',
    'navarro - la cancha',
    'el nacional',
    'san antonio',
    'san cayetano',
    'san fernando',
    'los libertadores',
    'miraflores',
    'centenario',
    'juananbu',
    'granada',
    'versalles',
    'el hoyo',
    'santa monica residencial',
    'san vicente',
    'prados del norte',
    'san juan bosco',
    'san pascual',
    'santa rosa',
    'guayaquil',
    'bretana',
    'la alameda',
    'junin',
    'chipichape',
    'chipichape norte',
    'el cedro',
    '3 de julio',
    'champagnat',
    'colseguros',
    'aranjuez',
    'santa monica belalcazar',
    'las acacias',
    'san cristobal',
    'la libertad',
    'cristobal colon',
    'colseguros andes',
    'olimpico',
    'el dorado',
    'pasoancho',
    'el guabal',
    'san judas tadeo ii',
    'el lido',
    'eucaristico',
    'nuevo san fernando',
]);

// Sede Caldas — zona sur-occidente de Cali
// Mapa: desde El Guabal/Calle 44 hasta ICESI/Pance · Cras 28 a 100+
const COBERTURA_CALDAS = new Set([
    'santo domingo',
    'jorge zawadzky',
    'la selva',
    'las granjas',
    'san judas tadeo',
    'la nueva granada',
    'unidad residencial santiago de cali',
    'santa isabel',
    'panamericano',
    'departamental',
    'urbanizacion militar',
    'nueva tequendama',
    'cuarto de legua',
    'camino real-joaquin borrero sinisterra',
    'camino real-los fundadores',
    'santa anita',
    'la selva',
    'canaveralejo',
    'pampalinda',
    'la cascada',
    'el refugio',
    'caldas',
    'el gran limonar',
    'el limonar',
    'limonar',
    'buenos aires',
    'los chorros',
    'lourdes',
    'farallones',
    'quintas de don simon',
    'alferez real',
    'el gran limonar-cataya',
    'bosques del limonar',
    'canaveralas-los samanes',
    'la hacienda',
    'los portales del nuevo rey',
    'colinas del sur',
    'padros del sur',
    'francisco eladio ramirez',
    'napoles',
    'alto napoles',
    'ciudad capri',
    'quintas de don simon',
    'prados del limonar',
    'ciudadela pasoancho',
    'mayapan-las vegas',
    'ciudad 2000',
    'brisas del limonar',
    'la arbolada',
    'ciudadela comfandi',
    'caney',
    'valle del lili',
    'multicentro',
    'la playa',
    'ciudad jardin',
    'melendez',
    'el jordan',
    'horizontes',
    'sector melendez',
    'urbanizacion rio lili',
    'unicentro',
    'univalle',
    'pance',
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
        sede: 'Sede Oeste',
        slug: 'oeste',
        count: COBERTURA_LIBERTADORES.size,
        destacados: ['Granada', 'Santa Mónica', 'San Antonio', 'La Alameda', 'Guayaquil', 'San Fernando', 'Chipichape'],
    },
    {
        sede: 'Sede Sur',
        slug: 'sur',
        count: COBERTURA_CALDAS.size,
        destacados: ['Caldas', 'Ciudad Jardín', 'Valle del Lili', 'El Caney', 'Ciudad 2000', 'Meléndez', 'Unicentro'],
    },
];

export const TOTAL_COVERAGE_BARRIOS = COBERTURA_LIBERTADORES.size + COBERTURA_CALDAS.size;
