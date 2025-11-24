import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { URL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, 'src', 'data', 'species.json');
const publicDir = path.join(__dirname, 'public', 'images');

// Ensure directory exists
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path.join(publicDir, filename));
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
            }
        };

        const request = https.get(url, options, (response) => {
            // Handle redirects
            if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
                const newUrl = new URL(response.headers.location, url).toString(); // Resolve relative redirects
                console.log(`  Redirecting to ${newUrl}`);
                downloadImage(newUrl, filename).then(resolve).catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Failed to consume '${url}' status: ${response.statusCode}`));
                return;
            }

            const contentType = response.headers['content-type'];
            if (!contentType || !contentType.startsWith('image/')) {
                // Warn but try to download anyway as sometimes headers are wrong or it's octet-stream
                console.warn(`  Warning: Content-Type is ${contentType} for ${url}`);
            }

            response.pipe(file);
            file.on('finish', () => {
                file.close();
                // Check file size
                const stats = fs.statSync(path.join(publicDir, filename));
                if (stats.size === 0) {
                    fs.unlinkSync(path.join(publicDir, filename));
                    reject(new Error('Downloaded file is empty'));
                } else {
                    resolve();
                }
            });
        });

        request.on('error', (err) => {
            fs.unlink(path.join(publicDir, filename), () => { });
            reject(err);
        });
    });
};

const manualFixes = [
    { id: 'dunkleosteus', index: 0, filename: 'dunkleosteus-0.jpg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dunkleosteus_intermedius.jpg' },
    { id: 'brachiosaurus', index: 0, filename: 'brachiosaurus-0.jpg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Brachiosaurus_DB.jpg' },
    { id: 'stegosaurus', index: 1, filename: 'stegosaurus-2.png', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/202009_Stegosaurus_stenops.png' },
    { id: 'carnotaurus', index: 0, filename: 'carnotaurus-0.jpg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Carnotaurus_sastrei_Reconstruction.jpg' },
    { id: 'diplodocus', index: 1, filename: 'diplodocus-1.jpg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Diplodocus_carnegii.jpg' },
    { id: 'iguanodon', index: 1, filename: 'iguanodon-1.jpg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Iguanodon_bernissartensis.jpg' },
    { id: 'anomalocaris', index: 0, filename: 'anomalocaris-0.png', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Anomalocaris_canadensis.png' },
    { id: 'anomalocaris', index: 1, filename: 'anomalocaris-1.jpg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Anomalocaris_canadensis_-_reconstruction_-_MUSE.jpg' },
    { id: 'titanoboa', index: 0, filename: 'titanoboa-0.jpg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Titanoboa_NT.jpg' },
    { id: 'mosasaurus', index: 0, filename: 'mosasaurus-0.jpg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mosasaurus_hoffmanni_life.jpg' },
    { id: 'glyptodon', index: 0, filename: 'glyptodon-0.jpg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Représentation_Glyptodon_clavipes.jpg' },
    { id: 'megatherium', index: 0, filename: 'megatherium-0.jpg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Megatherium_americanum.jpg' },
    { id: 'plesiosaurus', index: 0, filename: 'plesiosaurus-0.png', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Plesiosaurus_dolichodeirus.png' },
    { id: 'quetzalcoatlus', index: 0, filename: 'quetzalcoatlus-0.png', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Quetzalcoatlus_northropi.png' },
    { id: 'thylacine', index: 0, filename: 'thylacine-0.png', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Thylacine.png' },
    { id: 'pachycephalosaurus', index: 0, filename: 'pachycephalosaurus-0.jpg', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pachycephalosaurus_Reconstruction.jpg' },
    { id: 'deinosuchus', index: 0, filename: 'deinosuchus-0.png', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Deinosuchus_riograndensis.png' },
    { id: 'arthropleura', index: 0, filename: 'arthropleura-0.png', url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Arthropleura_reconstruction.png' }
];

const processSpecies = async () => {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Apply manual fixes first
    for (const fix of manualFixes) {
        console.log(`Applying fix for ${fix.id} image ${fix.index}...`);
        try {
            await downloadImage(fix.url, fix.filename);
            // Update data
            const species = data.find(s => s.id === fix.id);
            if (species) {
                // Ensure array is long enough (it should be)
                if (species.images.length <= fix.index) {
                    // If index is out of bounds, push? Or assume it exists?
                    // For stegosaurus index 1 is actually the 2nd image.
                    // Let's just set it if it exists, or push if it's the next one.
                    species.images[fix.index] = `/images/${fix.filename}`;
                } else {
                    species.images[fix.index] = `/images/${fix.filename}`;
                }
            }
        } catch (error) {
            console.error(`Failed to fix ${fix.filename}:`, error.message);
        }
    }

    // Process any remaining URLs in the JSON (optional, but good for completeness)
    for (const species of data) {
        const newImages = [];
        for (let i = 0; i < species.images.length; i++) {
            const url = species.images[i];
            if (url.startsWith('/images/')) {
                newImages.push(url);
                continue;
            }
            // It's a remote URL
            const ext = path.extname(url).split('?')[0] || '.jpg';
            const filename = `${species.id}-${i}${ext}`;
            try {
                console.log(`Downloading remaining remote URL ${url} to ${filename}...`);
                await downloadImage(url, filename);
                newImages.push(`/images/${filename}`);
            } catch (error) {
                console.error(`Failed to download ${url}: ${error.message}`);
                newImages.push(url);
            }
        }
        species.images = newImages;
    }

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log('Done! species.json updated.');
};

processSpecies();
