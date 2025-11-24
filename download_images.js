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

const downloadImage = (url, filename, redirectCount = 0) => {
    return new Promise((resolve, reject) => {
        if (redirectCount > 5) {
            reject(new Error('Too many redirects'));
            return;
        }

        const filePath = path.join(publicDir, filename);

        // Check if file already exists and is not empty
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            if (stats.size > 0) {
                console.log(`  Skipping ${filename} (already exists)`);
                resolve();
                return;
            }
        }

        const file = fs.createWriteStream(filePath);
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
            },
            timeout: 30000 // 30 seconds timeout
        };

        const request = https.get(url, options, (response) => {
            // Handle redirects
            if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
                const newUrl = new URL(response.headers.location, url).toString();
                console.log(`  Redirecting to ${newUrl}`);
                downloadImage(newUrl, filename, redirectCount + 1).then(resolve).catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                file.close();
                fs.unlink(filePath, () => { }); // Delete partial file
                reject(new Error(`Failed to consume '${url}' status: ${response.statusCode}`));
                return;
            }

            response.pipe(file);
            file.on('finish', () => {
                file.close();
                // Check file size
                try {
                    const stats = fs.statSync(filePath);
                    if (stats.size === 0) {
                        fs.unlinkSync(filePath);
                        reject(new Error('Downloaded file is empty'));
                    } else {
                        resolve();
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        request.on('error', (err) => {
            file.close();
            fs.unlink(filePath, () => { }); // Delete partial file
            reject(err);
        });

        request.on('timeout', () => {
            request.destroy();
            file.close();
            fs.unlink(filePath, () => { });
            reject(new Error('Request timed out'));
        });
    });
};

const processSpecies = async () => {
    console.log('Starting image download process (Strict Mode)...');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    let updated = false;

    for (const species of data) {
        const newImages = [];
        for (let i = 0; i < species.images.length; i++) {
            const url = species.images[i];

            // If it's already a local path
            if (url.startsWith('/images/')) {
                const localFilename = url.split('/').pop();
                const localPath = path.join(publicDir, localFilename);
                if (fs.existsSync(localPath)) {
                    newImages.push(url);
                } else {
                    console.warn(`  Removing missing local file reference: ${url}`);
                    updated = true;
                }
                continue;
            }

            // It's a remote URL
            let ext = path.extname(url).split('?')[0] || '.jpg';
            if (ext.length > 5) ext = '.jpg';

            const filename = `${species.id}-${i}${ext}`;

            try {
                console.log(`Processing ${species.name} image ${i}...`);
                await downloadImage(url, filename);
                newImages.push(`/images/${filename}`);
                updated = true;
            } catch (error) {
                console.error(`  Failed to download ${url}: ${error.message}`);
                console.error(`  REMOVING image reference from species.json.`);
                updated = true;
                // We do NOT push the url back. It is gone.
            }
        }
        species.images = newImages;
    }

    if (updated) {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        console.log('Done! species.json updated and cleaned.');
    } else {
        console.log('Done! No changes needed.');
    }
};

processSpecies();
