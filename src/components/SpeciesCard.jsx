import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SpeciesCard = ({ species, index }) => {
    return (
        <Link to={`/species/${species.id}`}>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                style={{
                    position: 'relative',
                    height: '400px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    backgroundColor: 'var(--card-bg)'
                }}
            >
                <div style={{ height: '100%', width: '100%' }}>
                    <motion.img
                        src={import.meta.env.BASE_URL + species.images[0].replace(/^\//, '')}
                        alt={species.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            maxWidth: '100%',
                            objectFit: 'cover',
                            filter: 'grayscale(20%) contrast(110%)'
                        }}
                        whileHover={{ scale: 1.05, filter: 'grayscale(0%) contrast(100%)' }}
                        transition={{ duration: 0.4 }}
                        onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found'; }}
                    />
                </div>

                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '2rem',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.7), transparent)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                }}>
                    <h2 style={{ fontSize: '1.8rem', margin: 0, marginBottom: '0.5rem' }}>{species.name}</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ color: 'var(--accent-color)', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Era:</span>
                            <span style={{ color: '#ccc', fontSize: '0.8rem' }}>{species.era}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ color: 'var(--accent-color)', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Loc:</span>
                            <span style={{ color: '#ccc', fontSize: '0.8rem' }}>{species.location}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default SpeciesCard;
