import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import speciesData from '../data/species.json';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const navigate = useNavigate();
    const searchRef = useRef(null);

    useEffect(() => {
        if (searchTerm.length > 0) {
            const filtered = speciesData.filter(species =>
                species.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                species.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                species.period.toLowerCase().includes(searchTerm.toLowerCase())
            ).slice(0, 5);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
        setSelectedIndex(-1);
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (species) => {
        navigate(`/species/${species.id}`);
        setSearchTerm('');
        setShowSuggestions(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            handleSelect(suggestions[selectedIndex]);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    return (
        <div ref={searchRef} className="search-container">
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
                    placeholder="Search extinct species..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => searchTerm && setShowSuggestions(true)}
                    className="search-input"
                />
                {searchTerm && (
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setShowSuggestions(false);
                        }}
                        className="search-clear"
                    >
                        ×
                    </button>
                )}
            </div>

            <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="search-suggestions"
                    >
                        {suggestions.map((species, index) => (
                            <motion.div
                                key={species.id}
                                onClick={() => handleSelect(species)}
                                className={`search-suggestion-item ${selectedIndex === index ? 'selected' : ''}`}
                                whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                            >
                                <div className="suggestion-name">{species.name}</div>
                                <div className="suggestion-meta">
                                    <span>{species.scientificName}</span>
                                    <span className="suggestion-period">{species.period}</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;
