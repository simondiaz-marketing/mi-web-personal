import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imgDir = path.join(__dirname, '../public/assets/img');

async function optimizeImages(dir) {
    const files = await fs.readdir(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(dir, file.name);

        if (file.isDirectory()) {
            await optimizeImages(fullPath);
        } else if (file.isFile() && /\.(png|jpe?g)$/i.test(file.name)) {
            const stats = await fs.stat(fullPath);
            const sizeMB = stats.size / (1024 * 1024);

            if (sizeMB > 1) {
                console.log(`Optimizing ${file.name} (${sizeMB.toFixed(2)} MB)...`);
                const parsed = path.parse(fullPath);
                const outputPath = path.join(parsed.dir, `${parsed.name}.webp`);

                try {
                    await sharp(fullPath)
                        .webp({ quality: 80 })
                        .toFile(outputPath);
                    
                    console.log(`Created ${path.basename(outputPath)}`);
                    
                    // Rename the original to .bak so we don't break things instantly, 
                    // or we can just leave it up to the user to delete. Let's leave it for now.
                } catch (error) {
                    console.error(`Error optimizing ${file.name}:`, error);
                }
            }
        }
    }
}

optimizeImages(imgDir)
    .then(() => console.log('Done!'))
    .catch(err => console.error(err));
