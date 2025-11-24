import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesToDownload = [
    {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Dunkleosteus_intermed_nt.jpg/800px-Dunkleosteus_intermed_nt.jpg',
        filename: 'dunkleosteus-0.jpg'
    },
    {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Brachiosaurus_DB.jpg/800px-Brachiosaurus_DB.jpg',
        filename: 'brachiosaurus-0.jpg'
    },
    {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Stegosaurus_stenops_reconstruction.png/800px-Stegosaurus_stenops_reconstruction.png',
        filename: 'stegosaurus-2.jpg' // Note: saving png as jpg might be weird if I don't convert, but let's stick to extension or change it. The URL is png.
    },
    {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Carnotaurus_sastrei_reconstruction.jpg/800px-Carnotaurus_sastrei_reconstruction.jpg',
        filename: 'carnotaurus-0.jpg'
    },
    {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Diplodocus_carnegii_Senckenberg.jpg/800px-Diplodocus_carnegii_Senckenberg.jpg',
        filename: 'diplodocus-1.jpg'
    },
    {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Iguanodon_bernissartensis_2020.png/800px-Iguanodon_bernissartensis_2020.png',
        filename: 'iguanodon-1.png'
    },
    {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Anomalocaris_canadensis_reconstruction.png/800px-Anomalocaris_canadensis_reconstruction.png',
        filename: 'anomalocaris-0.png'
    },
    {
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Anomalocaris_canadensis_reconstruction_-_MUSE.jpg/800px-Anomalocaris_canadensis_reconstruction_-_MUSE.jpg',
        filename: 'anomalocaris-1.jpg'
    }
];

const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, 'public', 'images', filename);
        const file = fs.createWriteStream(filePath);

        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        };

        https.get(url, options, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: Status Code ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${filename}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => { });
            reject(err);
        });
    });
};

const run = async () => {
    console.log('Starting image downloads...');
    for (const img of imagesToDownload) {
        try {
            // Fix extension if needed (Stegosaurus case)
            let finalFilename = img.filename;
            if (img.url.endsWith('.png') && img.filename.endsWith('.jpg')) {
                finalFilename = img.filename.replace('.jpg', '.png');
                console.log(`Adjusting filename for ${img.filename} to ${finalFilename}`);
            }

            await downloadImage(img.url, finalFilename);
        } catch (error) {
            console.error(`Error downloading ${img.filename}:`, error.message);
        }
    }
    console.log('All downloads completed.');
};

run();
