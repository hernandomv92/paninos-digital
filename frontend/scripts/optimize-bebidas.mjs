import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BEBIDAS_DIR = path.join(__dirname, '../public/images/Bebidas');

// Convierte todos los .jpg/.png no-webp que haya en la carpeta
const files = fs.readdirSync(BEBIDAS_DIR).filter(f => /\.(jpg|jpeg|png)$/i.test(f));

if (files.length === 0) {
    console.log('No hay JPG/PNG que convertir.\n');
    process.exit(0);
}

console.log(`\n🔄 Convirtiendo ${files.length} archivo(s)...\n`);

for (const filename of files) {
    const input = path.join(BEBIDAS_DIR, filename);
    const outputName = filename.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const output = path.join(BEBIDAS_DIR, outputName);

    const before = fs.statSync(input).size;
    await sharp(input).webp({ quality: 85, effort: 4 }).toFile(output);
    const after = fs.statSync(output).size;
    const saving = (((before - after) / before) * 100).toFixed(1);

    console.log(`  ✅ ${filename} → ${outputName}`);
    console.log(`     ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB  (ahorro: ${saving}%)`);
    fs.unlinkSync(input);
}

console.log('\n✨ Listo!\n');
