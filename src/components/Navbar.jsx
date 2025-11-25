import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = ({ showSearch, searchTerm, onSearchChange, searchPlaceholder, isSticky }) => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        padding: isSticky ? '1rem 0' : '2rem 0',
        marginBottom: isSticky ? '0' : '2rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: isSticky ? 'fixed' : 'relative',
        top: isSticky ? 0 : 'auto',
        left: isSticky ? 0 : 'auto',
        right: isSticky ? 0 : 'auto',
        backgroundColor: isSticky ? 'rgba(10, 10, 10, 0.95)' : 'transparent',
        backdropFilter: isSticky ? 'blur(10px)' : 'none',
        zIndex: 1000,
        transition: 'all 0.3s ease'
      }}
    >
      <div className="container nav-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>
            ARCH<span style={{ color: 'var(--accent-color)' }}>.</span>LOG
          </span>
        </Link>

        {showSearch && (
          <div className="search-container" style={{
            flex: '1',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
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
                placeholder={searchPlaceholder || "Search species..."}
                value={searchTerm}
                onChange={onSearchChange}
                className="search-input"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange({ target: { value: '' } })}
                  className="search-clear"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        )}

        <div className="nav-links" style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
          <Link to="/" style={{ color: 'var(--text-primary)' }}>Collection</Link>
          <span style={{ color: 'var(--text-secondary)', cursor: 'not-allowed' }}>Timeline</span>
          <span style={{ color: 'var(--text-secondary)', cursor: 'not-allowed' }}>About</span>
        </div>
      </div>
    </motion.nav>
  );
};

export default React.memo(Navbar);
