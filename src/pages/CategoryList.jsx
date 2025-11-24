import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import speciesData from '../data/species.json';
import SearchBar from '../components/SearchBar';

const CategoryList = () => {
    // Extract unique periods and sort them chronologically (custom order)
    const periodOrder = ['Cambrian', 'Devonian', 'Carboniferous', 'Permian', 'Triassic', 'Jurassic', 'Cretaceous', 'Paleogene', 'Neogene', 'Pleistocene', 'Holocene'];

    const periods = [...new Set(speciesData.map(s => s.period))].sort((a, b) => {
        return periodOrder.indexOf(a) - periodOrder.indexOf(b);
    });

    return (
        <div className="container">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{ marginBottom: '4rem', textAlign: 'center', paddingTop: '4rem' }}
            >
                <h1 style={{ marginBottom: '1rem' }}>Extinct <span style={{ color: 'var(--accent-color)' }}>Record</span></h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    Select a time period to explore the catalog of lost life.
                </p>
                <SearchBar />
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
                {periods.map((period, index) => (
                    <Link key={period} to={`/category/${period}`}>
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ x: 20, backgroundColor: 'rgba(255,255,255,0.05)' }}
                            style={{
                                padding: '2rem',
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <h2 style={{ fontSize: '2rem', margin: 0 }}>{period}</h2>
                            <span style={{ color: 'var(--accent-color)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Explore &rarr;
                            </span>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryList;
