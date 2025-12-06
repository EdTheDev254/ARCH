import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import speciesData from '../data/species.json';
import { getCoordinatesBySpeciesId, getCoordinatesForLocation } from '../utils/locationCoordinates';
import ModelViewer from './ModelViewer';

const GlobeViz = () => {
    const globeEl = useRef();
    const containerRef = useRef();
    const globeContainerRef = useRef();
    const [focusedLocation, setFocusedLocation] = useState(null);
    const [show3DViewer, setShow3DViewer] = useState(true);
    const [scale, setScale] = useState(1);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Seeded random number generator (consistent for same seed)
    const seededRandom = (seed) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };

    // Get today's date as a seed (changes daily)
    const getDailySeed = () => {
        const today = new Date();
        return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    };

    // Shuffle array using seeded random
    const shuffleWithSeed = (array, seed) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom(seed + i) * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Transform species data to include precise coordinates
    const allMapData = speciesData
        .map(species => {
            const coords = getCoordinatesBySpeciesId(species.id) ||
                getCoordinatesForLocation(species.location || species.discovery?.where);

            if (!coords) return null;

            const baseUrl = import.meta.env.BASE_URL.slice(0, -1);

            return {
                name: species.name,
                period: species.period.toUpperCase(),
                lat: coords.lat,
                lng: coords.lng,
                year: species.discovery?.when || 'Unknown',
                discoverer: species.discovery?.who || 'Unknown',
                desc: species.description.substring(0, 150) + '...',
                fullDesc: species.description,
                scientificName: species.scientificName,
                location: species.location || species.discovery?.where || 'Unknown',
                image: species.images && species.images.length > 0 ? baseUrl + species.images[0] : null,
                model: species.model || null
            };
        })
        .filter(Boolean);

    // Daily random selection of species (12 species max, at least 1 with 3D model)
    const mapData = React.useMemo(() => {
        const seed = getDailySeed();
        const speciesWithModels = allMapData.filter(s => s.model);
        const speciesWithoutModels = allMapData.filter(s => !s.model);

        // Always include at least 1 species with 3D model (if any exist)
        const shuffledModels = shuffleWithSeed(speciesWithModels, seed);
        const shuffledOthers = shuffleWithSeed(speciesWithoutModels, seed + 1);

        // Take 1-2 with models, rest without (total 12)
        const modelsToShow = shuffledModels.slice(0, Math.min(2, shuffledModels.length));
        const othersToShow = shuffledOthers.slice(0, 12 - modelsToShow.length);

        return [...modelsToShow, ...othersToShow];
    }, [allMapData]);

    useEffect(() => {
        const initGlobe = () => {
            if (!window.Globe || !globeEl.current || !globeContainerRef.current) return;
            if (globeEl.current.innerHTML !== '') return;

            const altitude = isMobile ? 2.5 : 1.8;

            const world = window.Globe()
                (globeEl.current)
                .backgroundColor('#0a0a0a')
                .showAtmosphere(true)
                .atmosphereColor('#3a228a')
                .atmosphereAltitude(0.15)
                .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
                .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
                .width(globeContainerRef.current.clientWidth)
                .height(globeContainerRef.current.clientHeight)

                .htmlElementsData(mapData)
                .htmlElement(d => {
                    const el = document.createElement('div');
                    el.innerHTML = '●';
                    // Red color for species with 3D models, gold for others
                    const hasModel = !!d.model;
                    el.style.color = hasModel ? '#ff4444' : '#C5A059';
                    el.style.fontSize = hasModel ? '20px' : '16px';
                    el.style.cursor = 'pointer';
                    el.style.pointerEvents = 'auto';
                    el.style.userSelect = 'none';
                    el.style.textShadow = hasModel ? '0 0 12px #ff4444' : '0 0 8px #C5A059';
                    el.onclick = (e) => {
                        e.stopPropagation();
                        console.log('Clicked marker data:', d);
                        console.log('Model path:', d.model);
                        // Reset 3D viewer visibility when selecting new species
                        setShow3DViewer(true);
                        // Use functional update to ensure state changes properly
                        setFocusedLocation(prev => {
                            // Force a new object reference even if same species
                            return { ...d, _clickTime: Date.now() };
                        });
                        world.pointOfView({ lat: d.lat, lng: d.lng, altitude: isMobile ? 2.5 : 1.8 }, 1200);
                        resetAutoRotateTimer();
                    };
                    return el;
                })
                .htmlAltitude(0.005)

                .ringsData([])
                .ringColor(() => '#C5A059')
                .ringMaxRadius(8)
                .ringPropagationSpeed(2)
                .ringRepeatPeriod(1200)

                .pointsData(mapData)
                .pointColor(() => 'transparent')
                .pointRadius(2)
                .pointAltitude(0.005)
                .pointLabel('')
                .onPointClick(d => {
                    setFocusedLocation(prev => ({ ...d, _clickTime: Date.now() }));
                    world.pointOfView({ lat: d.lat, lng: d.lng, altitude: isMobile ? 2.5 : 1.8 }, 1200);
                    resetAutoRotateTimer();
                })
                .onGlobeReady(() => {
                    setTimeout(() => setIsLoaded(true), 500);
                });

            world.controls().autoRotate = true;
            world.controls().autoRotateSpeed = 0.4;
            world.controls().enableZoom = false;
            world.pointOfView({ lat: 20, lng: 0, altitude: altitude });

            let autoRotateTimer;
            function resetAutoRotateTimer() {
                world.controls().autoRotate = false;
                clearTimeout(autoRotateTimer);
                autoRotateTimer = setTimeout(() => {
                    world.controls().autoRotate = true;
                }, 1000);
            }

            world.controls().addEventListener('start', resetAutoRotateTimer);

            const handleResize = () => {
                if (globeContainerRef.current && world) {
                    world.width(globeContainerRef.current.clientWidth);
                    world.height(globeContainerRef.current.clientHeight);
                }
                setIsMobile(window.innerWidth < 768);
            };
            window.addEventListener('resize', handleResize);

            globeEl.current.world = world;
        };

        if (window.Globe) {
            initGlobe();
        } else {
            const interval = setInterval(() => {
                if (window.Globe) {
                    initGlobe();
                    clearInterval(interval);
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, [mapData]);

    useEffect(() => {
        if (globeEl.current && globeEl.current.world && focusedLocation) {
            globeEl.current.world.ringsData([focusedLocation]);
        }
    }, [focusedLocation]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const newScale = Math.max(0.5, 1 - scrollY / 800);
            setScale(newScale);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-scroll to show globe and detail card on mobile when location is focused
    useEffect(() => {
        if (isMobile && focusedLocation && containerRef.current && !isInteracting) {
            setTimeout(() => {
                const elementTop = containerRef.current.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementTop + 75; // Scroll down more to move content up

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 300);
        }
    }, [focusedLocation, isMobile, isInteracting]);

    return (
        <motion.div
            layout
            ref={containerRef}
            transition={{ duration: 0.5, type: "spring", bounce: 0 }}
            style={{
                position: isMobile && isInteracting ? 'fixed' : 'relative',
                top: isMobile && isInteracting ? 0 : 'auto',
                left: isMobile && isInteracting ? 0 : 'auto',
                height: isMobile && isInteracting ? '100vh' : (isMobile && focusedLocation ? 'auto' : 'min(600px, 60vh)'),
                width: isMobile && isInteracting ? '100vw' : '100%',
                backgroundColor: '#0a0a0a',
                overflowY: isMobile && isInteracting ? 'auto' : 'hidden',
                display: 'flex',
                flexDirection: isMobile && (focusedLocation || isInteracting) ? 'column' : 'row',
                justifyContent: 'center',
                alignItems: 'center',
                perspective: '1000px',
                zIndex: isMobile && isInteracting ? 9999 : 0
            }}
        >
            {/* Legend tooltip for markers - hide when 3D viewer is open */}
            {!isMobile && !(focusedLocation && focusedLocation.model && show3DViewer) && (
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 10,
                    background: 'rgba(10,10,10,0.85)',
                    border: '1px solid rgba(197, 160, 89, 0.3)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '11px',
                    color: '#888'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ color: '#ff4444', fontSize: '14px', textShadow: '0 0 8px #ff4444' }}>●</span>
                        <span>3D Model Available</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#C5A059', fontSize: '12px', textShadow: '0 0 6px #C5A059' }}>●</span>
                        <span>Discovery Location</span>
                    </div>
                </div>
            )}
            {/* Globe Container */}
            <motion.div
                ref={globeContainerRef}
                animate={{
                    width: !isMobile && focusedLocation && focusedLocation.model && show3DViewer ? '50%' : '100%'
                }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: isMobile && focusedLocation ? '50vh' : (isMobile && isInteracting ? '100vh' : '100%'),
                    minHeight: isMobile && focusedLocation ? '400px' : '100%',
                    flexShrink: 0,
                    position: 'relative'
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#0a0a0a',
                        zIndex: 1000,
                        opacity: isLoaded ? 0 : 1,
                        transition: 'opacity 1s ease',
                        pointerEvents: 'none'
                    }}
                />

                {/* Interaction Overlay - Mobile Only */}
                {isMobile && !isInteracting && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 10,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: 'rgba(0,0,0,0.1)',
                            transition: 'background 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}
                    >
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsInteracting(true);
                            }}
                            style={{
                                padding: '12px 24px',
                                border: '1px solid #C5A059',
                                background: 'rgba(10,10,10,0.8)',
                                color: '#C5A059',
                                fontFamily: 'Cinzel, serif',
                                letterSpacing: '2px',
                                fontSize: '14px',
                                pointerEvents: 'auto',
                                cursor: 'pointer'
                            }}
                        >
                            TAP TO EXPLORE
                        </div>
                    </div>
                )}

                {/* Exit Interaction Button - Mobile Only */}
                <AnimatePresence>
                    {isMobile && isInteracting && (
                        <motion.button
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsInteracting(false);
                                setFocusedLocation(null);
                            }}
                            style={{
                                position: 'absolute',
                                bottom: '20px',
                                right: '20px',
                                zIndex: 20,
                                background: 'rgba(10,10,10,0.8)',
                                border: '1px solid #C5A059',
                                color: '#C5A059',
                                padding: '8px 16px',
                                cursor: 'pointer',
                                fontFamily: 'Cinzel, serif',
                                fontSize: '12px'
                            }}
                        >
                            EXIT EXPLORATION
                        </motion.button>
                    )}
                </AnimatePresence>

                <div
                    style={{
                        transform: `scale(${scale})`,
                        transition: 'transform 0.1s ease-out',
                        transformOrigin: 'center center',
                        width: '100%',
                        height: '100%',
                        pointerEvents: !isMobile || isInteracting ? 'auto' : 'none'
                    }}
                >
                    <div ref={globeEl} />
                </div>
            </motion.div>

            {/* 3D Model Viewer - Desktop Only */}
            <AnimatePresence>
                {!isMobile && focusedLocation && focusedLocation.model && show3DViewer && (
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: '50%' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        style={{
                            height: '100%',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Close Button - only closes 3D viewer, keeps card */}
                        <button
                            onClick={() => setShow3DViewer(false)}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                zIndex: 20,
                                background: 'rgba(10,10,10,0.8)',
                                border: '1px solid #C5A059',
                                color: '#C5A059',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                fontFamily: 'Lato, sans-serif',
                                fontSize: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ✕
                        </button>
                        <ModelViewer
                            modelPath={focusedLocation.model}
                            speciesName={focusedLocation.name}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Info Panel */}
            <motion.div
                layout
                style={{
                    position: isMobile && focusedLocation ? 'relative' : 'absolute',
                    bottom: isMobile && focusedLocation ? 'auto' : '60px',
                    left: isMobile && focusedLocation ? 'auto' : '60px',
                    width: isMobile && focusedLocation ? '100%' : '350px',
                    maxWidth: isMobile && focusedLocation ? '100%' : '80%',
                    padding: '25px',
                    paddingBottom: isMobile && focusedLocation ? '100px' : '25px',
                    paddingLeft: '25px',
                    borderLeft: isMobile && focusedLocation ? 'none' : '2px solid #C5A059',
                    borderTop: isMobile && focusedLocation ? '2px solid #C5A059' : 'none',
                    background: isMobile && focusedLocation ? '#0a0a0a' : 'linear-gradient(90deg, rgba(10,10,10,0.95), transparent)',
                    pointerEvents: isMobile && focusedLocation ? 'auto' : 'none',
                    display: focusedLocation ? 'flex' : 'none',
                    gap: '20px',
                    flexDirection: isMobile ? 'column' : 'row',
                    zIndex: 5
                }}
            >
                {/* Close button for info card */}
                {focusedLocation && (
                    <button
                        onClick={() => setFocusedLocation(null)}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'rgba(10,10,10,0.8)',
                            border: '1px solid #C5A059',
                            color: '#C5A059',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'auto',
                            zIndex: 10
                        }}
                    >
                        ✕
                    </button>
                )}
                <AnimatePresence mode="wait">
                    {focusedLocation && (
                        <motion.div
                            key={focusedLocation.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            style={{ display: 'flex', gap: '20px', flexDirection: isMobile ? 'column' : 'row', width: '100%' }}
                        >
                            {focusedLocation.image && (
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    flexShrink: 0,
                                    border: '2px solid #C5A059',
                                    overflow: 'hidden',
                                    backgroundColor: '#1a1a1a'
                                }}>
                                    <img
                                        src={focusedLocation.image}
                                        alt={focusedLocation.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                            )}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontFamily: 'Cinzel, serif', color: '#C5A059', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>
                                    {focusedLocation.period}
                                </div>
                                <h2 style={{ fontSize: '26px', fontStyle: 'italic', margin: '0 0 4px 0', color: '#fff', fontFamily: 'Lato, sans-serif' }}>
                                    {focusedLocation.name}
                                </h2>
                                <div style={{ fontSize: '12px', color: '#888', fontStyle: 'italic', marginBottom: '12px' }}>
                                    {focusedLocation.scientificName}
                                </div>
                                <div style={{ fontFamily: 'Lato, sans-serif', fontSize: '12px', lineHeight: '1.6', color: '#bbb', marginBottom: '12px' }}>
                                    {isMobile ? focusedLocation.fullDesc : focusedLocation.desc}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', color: '#aaa' }}>
                                    <div>LOCATION: <span style={{ color: '#C5A059', fontWeight: 'bold' }}>{focusedLocation.location}</span></div>
                                    <div>DISCOVERED: <span style={{ color: '#C5A059', fontWeight: 'bold' }}>{focusedLocation.year}</span></div>
                                    <div style={{ gridColumn: '1 / -1' }}>BY: <span style={{ color: '#C5A059', fontWeight: 'bold' }}>{focusedLocation.discoverer}</span></div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default GlobeViz;
