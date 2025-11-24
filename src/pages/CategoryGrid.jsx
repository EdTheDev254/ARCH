import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SpeciesCard from '../components/SpeciesCard';
import speciesData from '../data/species.json';
import { motion } from 'framer-motion';

const CategoryGrid = () => {
    const { period } = useParams();
    const [searchTerm, setSearchTerm] = useState('');

    const periodSpecies = speciesData.filter(s => s.period === period);

    const filteredSpecies = periodSpecies.filter(species =>
        species.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        species.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    viewBox = "0 0 24 24"
    fill = "none"
    stroke = "currentColor"
    strokeWidth = "2"
        >
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg >
    <input
        type="text"
        placeholder={`Search ${period} species...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
    />
{
    searchTerm && (
        <button
            onClick={() => setSearchTerm('')}
            className="search-clear"
        >
            ×
        </button>
    )
}
                    </div >
                </div >
            </div >

    <div className="grid-responsive">
        {filteredSpecies.length > 0 ? (
            filteredSpecies.map((species, index) => (
                <SpeciesCard key={species.id} species={species} index={index} />
            ))
        ) : (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                No species found matching "{searchTerm}"
            </div>
        )}
    </div>
        </div >
    );
};

export default CategoryGrid;
