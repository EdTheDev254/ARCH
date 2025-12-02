import React, { useEffect, useRef, useState } from 'react';
import speciesData from '../data/species.json';
import { getCoordinatesBySpeciesId, getCoordinatesForLocation } from '../utils/locationCoordinates';

const GlobeViz = () => {
    const globeEl = useRef();
    const containerRef = useRef();
    const globeContainerRef = useRef();
    const [focusedLocation, setFocusedLocation] = useState(null);
    const [scale, setScale] = useState(1);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Transform species data to include precise coordinates
    const mapData = speciesData
        .map(species => {
            const coords = getCoordinatesBySpeciesId(species.id) ||
                getCoordinatesForLocation(species.location || species.discovery?.where);

            if (!coords) return null;

            const baseUrl = import.meta.env.BASE_URL.slice(0, - 1);

            return {
                name: species.name,
                period: species.period.toUpperCase(),
                lat: coords.lat,
                lng: coords.lng,
                year: species.discovery?.when || 'Unknown',
                discoverer: species.discovery?.who || 'Unknown',
                desc: species.description.substring(0, 150) + '...',
                scientificName: species.scientificName,
                location: species.location || species.discovery?.where || 'Unknown',
                image: species.images && species.images.length > 0 ? baseUrl + species.images[0] : null
            };
        })
        .filter(Boolean);

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
                    el.style.color = '#C5A059';
                    el.style.fontSize = '16px';
                    el.style.cursor = 'pointer';
                    el.style.pointerEvents = 'auto';
                    el.style.userSelect = 'none';
                    el.style.textShadow = '0 0 8px #C5A059';
                    el.onclick = () => {
                        setFocusedLocation(d);
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
                    setFocusedLocation(d);
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
        if (isMobile && focusedLocation && containerRef.current) {
            setTimeout(() => {
                const elementTop = containerRef.current.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementTop + 75; // Scroll down more to move content up

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 300);
        }
    }, [focusedLocation, isMobile]);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                height: isMobile && focusedLocation ? 'auto' : 'min(600px, 60vh)',
                width: '100%',
                backgroundColor: '#0a0a0a',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: isMobile && focusedLocation ? 'column' : 'row',
                justifyContent: 'center',
                alignItems: 'center',
                perspective: '1000px',
                zIndex: 0
            }}
        >
            {/* Globe Container */}
            <div
                ref={globeContainerRef}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: isMobile && focusedLocation ? '50vh' : '100%',
                    minHeight: isMobile && focusedLocation ? '400px' : '100%',
                    flexShrink: 0
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
                        onClick={() => setIsInteracting(true)}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 10,
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: 'rgba(0,0,0,0.1)',
                            transition: 'background 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.1)'}
                    >
                        <div style={{
                            padding: '12px 24px',
                            border: '1px solid #C5A059',
                            background: 'rgba(10,10,10,0.8)',
                            color: '#C5A059',
                            fontFamily: 'Cinzel, serif',
                            letterSpacing: '2px',
                            fontSize: '14px',
                            pointerEvents: 'none'
                        }}>
                            TAP TO EXPLORE
                        </div>
                    </div>
                )}

                {/* Exit Interaction Button - Mobile Only */}
                {isMobile && isInteracting && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsInteracting(false);
                            setFocusedLocation(null);
                        }}
                        style={{
                            position: 'absolute',
                            top: '20px',
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
                    </button>
                )}

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
            </div>

            {/* Info Panel */}
            <div
                style={{
                    position: isMobile && focusedLocation ? 'relative' : 'absolute',
                    bottom: isMobile && focusedLocation ? 'auto' : '60px',
                    left: isMobile && focusedLocation ? 'auto' : '60px',
                    width: isMobile && focusedLocation ? '100%' : '350px',
                    maxWidth: isMobile && focusedLocation ? '100%' : '80%',
                    padding: '25px',
                    paddingLeft: '25px',
                    borderLeft: isMobile && focusedLocation ? 'none' : '2px solid #C5A059',
                    borderTop: isMobile && focusedLocation ? '2px solid #C5A059' : 'none',
                    background: isMobile && focusedLocation ? '#0a0a0a' : 'linear-gradient(90deg, rgba(10,10,10,0.95), transparent)',
                    pointerEvents: isMobile && focusedLocation ? 'auto' : 'none',
                    opacity: focusedLocation ? 1 : 0,
                    transform: focusedLocation ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.5s ease',
                    display: focusedLocation ? 'flex' : 'none',
                    gap: '20px',
                    flexDirection: isMobile ? 'column' : 'row',
                    zIndex: 5
                }}
            >
                {focusedLocation && (
                    <>
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
                                {focusedLocation.desc}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', color: '#aaa' }}>
                                <div>LOCATION: <span style={{ color: '#C5A059', fontWeight: 'bold' }}>{focusedLocation.location}</span></div>
                                <div>DISCOVERED: <span style={{ color: '#C5A059', fontWeight: 'bold' }}>{focusedLocation.year}</span></div>
                                <div style={{ gridColumn: '1 / -1' }}>BY: <span style={{ color: '#C5A059', fontWeight: 'bold' }}>{focusedLocation.discoverer}</span></div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default GlobeViz;
