import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import SpeciesCard from '../components/SpeciesCard';
import Navbar from '../components/Navbar';
import speciesData from '../data/species.json';
import { motion } from 'framer-motion';

const CategoryGrid = () => {
    const { period } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSticky, setIsSticky] = useState(false);

    const periodSpecies = speciesData.filter(s => s.period === period);

    const filteredSpecies = periodSpecies.filter(species =>
        species.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        species.scientificName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleScroll = () => {
            // When user scrolls past 200px, make navbar sticky and show search in it
            // Only update state if it actually needs to change to prevent re-renders
            if (window.scrollY > 200 && !isSticky) {
                setIsSticky(true);
            } else if (window.scrollY <= 200 && isSticky) {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isSticky]);

    // Memoize the search change handler to prevent unnecessary re-renders
    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
    }, []);

    return (
        <>
            {/* Always render spacer to prevent layout shift - it smoothly transitions */}
            <div style={{ height: isSticky ? '80px' : '0px', transition: 'height 0.3s ease' }} />

            <Navbar
                showSearch={isSticky}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                searchPlaceholder={`Search ${period} species...`}
                isSticky={isSticky}
            />

            <div className="container">
                <Link to="/" style={{ display: 'inline-block', marginTop: '2rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
                    ← Back to Periods
                </Link>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    style={{ textAlign: 'center', paddingTop: '2rem', paddingBottom: '1rem' }}
                >
                    <h1 style={{ marginBottom: '1rem' }}>{period} <span style={{ color: 'var(--accent-color)' }}>Record</span></h1>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                        Exploring species from the {period} period.
                    </p>
                </motion.div>

                {/* Original search bar - hidden when sticky */}
                <div style={{
                    opacity: isSticky ? 0 : 1,
                    maxHeight: isSticky ? '0' : '200px',
                    overflow: 'hidden',
                    transition: 'opacity 0.3s ease, max-height 0.3s ease'
                }}>
                    <div className="search-wrapper">
                        <div className="search-container">
                            <div className="search-input-wrapper">
                                <svg
                                    className="search-icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder={`Search ${period} species...`}
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="search-input"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="search-clear"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

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
            </div>
        </>
    );
};

export default CategoryGrid;
