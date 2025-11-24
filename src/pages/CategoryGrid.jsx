import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SpeciesCard from '../components/SpeciesCard';
import speciesData from '../data/species.json';
import { motion } from 'framer-motion';

const CategoryGrid = () => {
    const { period } = useParams();
    const filteredSpecies = speciesData.filter(s => s.period === period);

    return (
        <div className="container">
            <Link to="/" style={{ display: 'inline-block', marginTop: '2rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
                ← Back to Periods
            </Link>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{ marginBottom: '4rem', textAlign: 'center', paddingTop: '2rem' }}
            >
                <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>{period} <span style={{ color: 'var(--accent-color)' }}>Record</span></h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                    Exploring species from the {period} period.
                </p>
            </motion.div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', paddingBottom: '4rem' }}>
                {filteredSpecies.map((species, index) => (
                    <SpeciesCard key={species.id} species={species} index={index} />
                ))}
            </div>
        </div>
    );
};

export default CategoryGrid;
