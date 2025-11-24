import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CategoryList from './pages/CategoryList';
import CategoryGrid from './pages/CategoryGrid';
import SpeciesDetail from './pages/SpeciesDetail';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<CategoryList />} />
          <Route path="/category/:period" element={<CategoryGrid />} />
          <Route path="/species/:id" element={<SpeciesDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
