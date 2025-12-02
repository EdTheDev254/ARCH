// Precise coordinates for specific fossil discovery sites
// Based on actual paleontological records and formation locations

export const speciesCoordinates = {
    // Cretaceous - North America
    "tyrannosaurus-rex": { lat: 46.9, lng: -101.5 }, // Hell Creek Formation, Montana
    "triceratops": { lat: 39.74, lng: -104.99 }, // Denver area, Colorado
    "ankylosaurus": { lat: 47.03, lng: -106.75 }, // Hell Creek Formation, Montana
    "parasaurolophus": { lat: 50.76, lng: -111.49 }, // Dinosaur Provincial Park, Alberta
    "pteranodon": { lat: 38.80, lng: -100.94 }, // Smoky Hill Chalk, Kansas
    "pachycephalosaurus": { lat: 47.5, lng: -110.5 }, // Montana, USA
    "deinosuchus": { lat: 47.2, lng: -109.8 }, // Montana, USA
    "elasmosaurus": { lat: 38.5, lng: -99.5 }, // Kansas, USA
    "quetzalcoatlus": { lat: 29.25, lng: -103.25 }, // Big Bend National Park, Texas
    "styracosaurus": { lat: 50.8, lng: -111.5 }, // Alberta, Canada

    // Cretaceous - Other
    "velociraptor": { lat: 44.14, lng: 103.72 }, // Flaming Cliffs, Mongolia
    "spinosaurus": { lat: 28.41, lng: 28.81 }, // Bahariya Formation, Egypt
    "carnotaurus": { lat: -43.00, lng: -67.50 }, // La Colonia Formation, Argentina
    "iguanodon": { lat: 51.02, lng: -0.14 }, // Sussex, England
    "mosasaurus": { lat: 50.85, lng: 5.69 }, // Maastricht, Netherlands
    "therizinosaurus": { lat: 44.2, lng: 104.0 }, // Gobi Desert, Mongolia
    "baryonyx": { lat: 51.32, lng: -0.53 }, // Surrey, England
    "microraptor": { lat: 41.5, lng: 123.0 }, // Liaoning, China
    "giganotosaurus": { lat: -42.5, lng: -69.5 }, // Patagonia, Argentina
    "sarcosuchus": { lat: 23.0, lng: 5.0 }, // Sahara Desert
    "kaprosuchus": { lat: 16.0, lng: 8.0 }, // Niger

    // Jurassic - North America
    "stegosaurus": { lat: 39.68, lng: -105.19 }, // Dinosaur Ridge, Colorado
    "brachiosaurus": { lat: 39.08, lng: -108.58 }, // Colorado River Valley
    "allosaurus": { lat: 39.37, lng: -108.55 }, // Morrison Formation, Colorado
    "diplodocus": { lat: 39.60, lng: -105.10 }, // Morrison Formation, Colorado

    // Jurassic - Europe
    "archaeopteryx": { lat: 48.89, lng: 10.99 }, // Solnhofen, Germany
    "plesiosaurus": { lat: 50.72, lng: -2.44 }, // Dorset, England
    "liopleurodon": { lat: 47.0, lng: 2.5 }, // France
    "dimorphodon": { lat: 50.72, lng: -2.44 }, // Dorset, UK

    // Triassic
    "coelophysis": { lat: 36.28, lng: -106.5 }, // Ghost Ranch, New Mexico
    "plateosaurus": { lat: 51.0, lng: 10.0 }, // Germany
    "postosuchus": { lat: 33.7, lng: -100.0 }, // Texas, USA

    // Permian
    "dimetrodon": { lat: 33.6, lng: -99.3 }, // Texas, USA
    "edaphosaurus": { lat: 33.5, lng: -99.5 }, // Texas Red Beds
    "helicoprion": { lat: 60.0, lng: 60.0 }, // Ural Mountains, Russia
    "inostrancevia": { lat: 64.5, lng: 40.5 }, // Northern Dvina River, Russia

    // Devonian
    "dunkleosteus": { lat: 41.5, lng: -81.7 }, // Cleveland Shale, Ohio
    "tiktaalik": { lat: 78.0, lng: -85.0 }, // Ellesmere Island, Canada
    "ichthyostega": { lat: 72.0, lng: -40.0 }, // East Greenland

    // Carboniferous
    "arthropleura": { lat: 51.0, lng: 10.5 }, // Germany
    "meganeura": { lat: 46.3, lng: 2.7 }, // Commentry, France

    // Cambrian
    "anomalocaris": { lat: 51.4, lng: -116.5 }, // Burgess Shale, Canada
    "hallucigenia": { lat: 51.4, lng: -116.5 }, // Burgess Shale, Canada
    "opabinia": { lat: 51.4, lng: -116.5 }, // Burgess Shale, Canada

    // Paleogene
    "titanoboa": { lat: 11.03, lng: -72.69 }, // Cerrejón, Colombia
    "basilosaurus": { lat: 30.0, lng: -91.0 }, // Louisiana, USA
    "andrewsarchus": { lat: 44.0, lng: 104.5 }, // Gobi Desert, Mongolia
    "paraceratherium": { lat: 43.0, lng: 77.0 }, // Kazakhstan

    // Neogene
    "megalodon": { lat: 10.0, lng: -140.0 }, // Pacific Ocean (widespread)
    "argentavis": { lat: -36.5, lng: -64.5 }, // La Pampa, Argentina

    // Pleistocene
    "woolly-mammoth": { lat: 71.24, lng: -179.42 }, // Wrangel Island, Siberia
    "smilodon": { lat: 34.06, lng: -118.36 }, // La Brea Tar Pits, California
    "glyptodon": { lat: -34.60, lng: -58.38 }, // Argentina
    "megatherium": { lat: -34.57, lng: -59.14 }, // Luján, Argentina

    // Holocene
    "dodo": { lat: -20.16, lng: 57.50 }, // Mauritius
    "thylacine": { lat: -42.88, lng: 147.33 }, // Tasmania, Australia
};

/**
 * Get precise coordinates for a species by ID
 * @param {string} speciesId - Species ID from species.json
 * @returns {Object|null} - {lat, lng} or null if not found
 */
export function getCoordinatesBySpeciesId(speciesId) {
    return speciesCoordinates[speciesId] || null;
}

// Legacy location string mapping (for fallback)
export const locationCoordinates = {
    // North America
    "North America": { lat: 45.0, lng: -100.0 },
    "North America (USA)": { lat: 39.0, lng: -98.0 },
    "Montana, USA": { lat: 47.0, lng: -110.0 },
    "Hell Creek Formation, Montana, USA": { lat: 46.9, lng: -101.5 },
    "Denver, Colorado, USA": { lat: 39.74, lng: -104.99 },
    "Morrison, Colorado, USA": { lat: 39.68, lng: -105.19 },
    "Colorado River Valley, USA": { lat: 39.08, lng: -108.58 },
    "Colorado, USA": { lat: 39.37, lng: -108.55 },
    "Wyoming, USA": { lat: 43.0, lng: -107.5 },
    "Alberta, Canada": { lat: 50.76, lng: -111.49 },
    "British Columbia, Canada": { lat: 51.4, lng: -116.5 },
    "Western Kansas, USA": { lat: 38.80, lng: -100.94 },
    "Kansas, USA": { lat: 38.5, lng: -99.5 },
    "New Mexico, USA": { lat: 36.28, lng: -106.5 },
    "Louisiana, USA": { lat: 30.0, lng: -91.0 },
    "Big Bend National Park, Texas, USA": { lat: 29.25, lng: -103.25 },

    // South America
    "South America": { lat: -15.0, lng: -60.0 },
    "Argentina": { lat: -34.0, lng: -64.0 },
    "Chubut, Argentina": { lat: -43.00, lng: -67.50 },
    "Brazil": { lat: -10.0, lng: -55.0 },
    "Patagonia, Argentina": { lat: -42.0, lng: -68.0 },
    "Cerrejón, Colombia": { lat: 11.03, lng: -72.69 },
    "Luján, Argentina": { lat: -34.57, lng: -59.14 },
    "La Pampa, Argentina": { lat: -36.5, lng: -64.5 },

    // Africa
    "Africa": { lat: 0.0, lng: 20.0 },
    "North Africa": { lat: 25.0, lng: 20.0 },
    "Africa (Niger)": { lat: 16.0, lng: 8.0 },
    "Niger": { lat: 16.0, lng: 8.0 },
    "Egypt": { lat: 28.41, lng: 28.81 },
    "Tanzania": { lat: -6.0, lng: 35.0 },
    "Morocco": { lat: 32.0, lng: -6.0 },
    "South Africa": { lat: -30.0, lng: 25.0 },
    "Sahara Desert": { lat: 23.0, lng: 5.0 },

    // Europe
    "Europe": { lat: 50.0, lng: 10.0 },
    "Germany": { lat: 48.89, lng: 10.99 },
    "England": { lat: 52.0, lng: -1.0 },
    "Dorset, England": { lat: 50.72, lng: -2.44 },
    "Sussex, England": { lat: 51.02, lng: -0.14 },
    "Surrey, England": { lat: 51.32, lng: -0.53 },
    "Dorset, UK": { lat: 50.72, lng: -2.44 },
    "United Kingdom": { lat: 52.0, lng: -1.0 },
    "France": { lat: 46.3, lng: 2.7 },
    "Spain": { lat: 40.0, lng: -3.5 },
    "Belgium": { lat: 50.8, lng: 4.3 },
    "Russia": { lat: 64.5, lng: 40.5 },
    "Northern Dvina River, Russia": { lat: 64.5, lng: 40.5 },
    "Ural Mountains, Russia": { lat: 60.0, lng: 60.0 },
    "Netherlands": { lat: 50.85, lng: 5.69 },
    "Maastricht, Netherlands": { lat: 50.85, lng: 5.69 },

    // Asia
    "Asia": { lat: 34.0, lng: 100.0 },
    "Central Asia": { lat: 43.0, lng: 77.0 },
    "Kazakhstan": { lat: 43.0, lng: 77.0 },
    "Mongolia": { lat: 44.14, lng: 103.72 },
    "Gobi Desert, Mongolia": { lat: 44.14, lng: 103.72 },
    "China": { lat: 35.0, lng: 105.0 },
    "Liaoning, China": { lat: 41.5, lng: 123.0 },
    "India": { lat: 20.0, lng: 77.0 },
    "Pakistan": { lat: 30.0, lng: 70.0 },
    "Siberia": { lat: 71.24, lng: -179.42 },

    // Australia & Oceania
    "Australia": { lat: -25.0, lng: 135.0 },
    "Queensland, Australia": { lat: -20.0, lng: 145.0 },
    "Tasmania, Australia": { lat: -42.88, lng: 147.33 },
    "New Zealand": { lat: -41.0, lng: 174.0 },
    "Mauritius": { lat: -20.16, lng: 57.50 },

    // Antarctica & Arctic
    "Antarctica": { lat: -75.0, lng: 0.0 },
    "Greenland": { lat: 72.0, lng: -40.0 },
    "East Greenland": { lat: 72.0, lng: -40.0 },

    // Oceans
    "Worldwide Oceans": { lat: 10.0, lng: -140.0 },
    "Global": { lat: 10.0, lng: -140.0 },
    "Global Oceans": { lat: 10.0, lng: -140.0 },
    "Atlantic Ocean": { lat: 25.0, lng: -40.0 },
    "Pacific Ocean": { lat: 10.0, lng: -140.0 },

    // Specific formations
    "Burgess Shale, Canada": { lat: 51.4, lng: -116.5 },
    "Ellesmere Island, Canada": { lat: 78.0, lng: -85.0 },
    "La Brea Tar Pits, California": { lat: 34.06, lng: -118.36 },
    "Solnhofen, Germany": { lat: 48.89, lng: 10.99 },
    "Cleveland Shale, Ohio": { lat: 41.5, lng: -81.7 },
    "Ohio, USA": { lat: 41.5, lng: -81.7 },
    "Commentry, France": { lat: 46.3, lng: 2.7 },
    "Texas, USA": { lat: 33.6, lng: -99.3 },
    "Texas Red Beds, Texas, USA": { lat: 33.5, lng: -99.5 },
    "Ghost Ranch, New Mexico": { lat: 36.28, lng: -106.5 }
};

/**
 * Get coordinates for a location string, with fuzzy matching
 * @param {string} location - Location string from species data
 * @returns {Object|null} - {lat, lng} or null if not found
 */
export function getCoordinatesForLocation(location) {
    if (!location) return null;

    // Direct match
    if (locationCoordinates[location]) {
        return locationCoordinates[location];
    }

    // Fuzzy match
    const lowerLocation = location.toLowerCase();
    for (const [key, coords] of Object.entries(locationCoordinates)) {
        if (lowerLocation.includes(key.toLowerCase())) {
            return coords;
        }
    }

    const match = location.match(/\(([^)]+)\)/);
    if (match) {
        const extracted = match[1];
        if (locationCoordinates[extracted]) {
            return locationCoordinates[extracted];
        }
    }

    return null;
}
