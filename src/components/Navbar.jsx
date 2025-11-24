import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        padding: '2rem 0',
        marginBottom: '2rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <div className="container nav-container">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>
            ARCH<span style={{ color: 'var(--accent-color)' }}>.</span>LOG
          </span>
        </Link>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          <Link to="/" style={{ color: 'var(--text-primary)' }}>Collection</Link>
          <span style={{ color: 'var(--text-secondary)', cursor: 'not-allowed' }}>Timeline</span>
          <span style={{ color: 'var(--text-secondary)', cursor: 'not-allowed' }}>About</span>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
