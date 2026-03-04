/**
 * optimize-bebidas.js
 * Convierte los PNG pesados de /public/images/Bebidas a WebP optimizado.
 * Los WebP ya existentes los deja intactos.
 * Ejecutar: node scripts/optimize-bebidas.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const BEBIDAS_DIR = path.join(__dirname, '../public/images/Bebidas');

const PNG_FILES = [
    'COCA COLA 500ML.png',
    'COCACOLA 1.5LT.png',
    'COCACOLA ZERO 400ML.png',
    'CORONITA.png',
];

async function convertToWebP(filename) {
    const input = path.join(BEBIDAS_DIR, filename);
    const outputName = filename.replace(/\.png$/i, '.webp');
    const output = path.join(BEBIDAS_DIR, outputName);

    if (!fs.existsSync(input)) {
        console.log(`  ⚠️  No encontrado: ${filename}`);
        return;
    }

    const statBefore = fs.statSync(input).size;

    await sharp(input)
        .webp({ quality: 82, effort: 4 })
        .toFile(output);

    const statAfter = fs.statSync(output).size;
    const saving = (((statBefore - statAfter) / statBefore) * 100).toFixed(1);

    console.log(`  ✅ ${filename} → ${outputName}`);
    console.log(`     ${(statBefore / 1024).toFixed(0)}KB → ${(statAfter / 1024).toFixed(0)}KB (${saving}% menos)\n`);

    // Borrar el PNG original si la conversión fue exitosa
    fs.unlinkSync(input);
    console.log(`     🗑️  PNG original eliminado`);
}

async function main() {
    console.log('\n🔄 Optimizando imágenes de bebidas...\n');
    for (const file of PNG_FILES) {
        await convertToWebP(file);
    }
    console.log('✨ Listo!\n');
}

main().catch(console.error);
