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

    return (
        <div className="container">
            <Link to="/" style={{ display: 'inline-block', marginTop: '2rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
                ← Back to Periods
            </Link>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
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
