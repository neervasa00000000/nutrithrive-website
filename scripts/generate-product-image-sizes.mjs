import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const folder = new URL('../site/assets/images/product_webp/', import.meta.url);
let created = 0;
for (const name of (await fs.readdir(folder)).filter(name => name.endsWith('.webp') && !/-card-\d+\.webp$/.test(name))) {
  for (const width of [160,320,640,960]) {
    const target = new URL(name.replace(/\.webp$/,`-card-${width}.webp`), folder);
    try { await fs.access(target); continue; } catch { /* generate missing sizes only */ }
    await sharp(await fs.readFile(new URL(name,folder))).resize({width,withoutEnlargement:true}).webp({quality:80,effort:6}).toFile(target.pathname);
    created++;
  }
}
console.log(`Generated ${created} smaller product images; originals retained.`);
