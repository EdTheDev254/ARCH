import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import speciesData from '../data/species.json';

const SpeciesDetail = () => {
    const { id } = useParams();
    const species = speciesData.find(s => s.id === id);
    const [selectedImage, setSelectedImage] = useState(0);

    if (!species) return <div className="container">Species not found</div>;

    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <Link to={`/category/${species.period}`} style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
                    ← Back to {species.period}
                </Link>
                <Link to="/" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
                    ← All Periods
                </Link>
            </div>

            <div className="detail-grid">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="img-container-responsive">
                        <img
                            src={import.meta.env.BASE_URL.slice(0, -1) + species.images[selectedImage]}
                            alt={species.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                display: 'block'
                            }}
                            onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found'; }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        {species.images.map((img, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedImage(idx)}
                                style={{
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                    opacity: selectedImage === idx ? 1 : 0.5,
                                    border: selectedImage === idx ? '2px solid var(--accent-color)' : '2px solid transparent',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <img
                                    src={import.meta.env.BASE_URL.slice(0, -1) + img}
                                    alt={`${species.name} ${idx + 1}`}
                                    style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }}
                                />
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <span style={{ color: 'var(--accent-color)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '1rem' }}>
                        {species.era}
                    </span>
                    <h1 style={{ marginBottom: '0.5rem', lineHeight: 1.1 }}>{species.name}</h1>
                    <h3 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', fontStyle: 'italic', fontFamily: 'var(--font-heading)', marginBottom: '2rem' }}>
                        {species.scientificName}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <h4 style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Description</h4>
                            <p style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>{species.description}</p>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '4px' }}>
                            <h4 style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', color: 'var(--accent-color)', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Discovery</h4>
                            <div className="discovery-grid">
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Discovered By</span>
                                    <span style={{ fontSize: '1rem' }}>{species.discovery.who}</span>
                                </div>
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Year</span>
                                    <span style={{ fontSize: '1rem' }}>{species.discovery.when}</span>
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <span style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Age</span>
                                    <span style={{ fontSize: '1rem' }}>{species.discovery.age}</span>
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <span style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Location</span>
                                    <span style={{ fontSize: '1rem' }}>{species.discovery.where}</span>
                                </div>
                            </div>
                        </div>

                        <div className="discovery-grid">
                            <div>
                                <h4 style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Location</h4>
                                <p>{species.location}</p>
                            </div>
                            <div>
                                <h4 style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Fun Fact</h4>
                                <p style={{ color: 'var(--accent-color)' }}>{species.funFact}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SpeciesDetail;
