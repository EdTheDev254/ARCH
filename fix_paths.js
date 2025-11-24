import fs from 'fs';

// Read the species.json file
const data = JSON.parse(fs.readFileSync('src/data/species.json', 'utf8'));

// Remove leading slashes from all image paths
data.forEach(species => {
    species.images = species.images.map(img => img.replace(/^\//, ''));
});

// Write back to file
fs.writeFileSync('src/data/species.json', JSON.stringify(data, null, 2));

console.log('Fixed image paths - removed leading slashes');
