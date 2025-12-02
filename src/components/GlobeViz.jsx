import React, { useEffect, useRef, useState } from 'react';
import speciesData from '../data/species.json';
import { getCoordinatesBySpeciesId, getCoordinatesForLocation } from '../utils/locationCoordinates';

const GlobeViz = () => {
    const globeEl = useRef();
    const containerRef = useRef();
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

            const baseUrl = import.meta.env.BASE_URL.slice(0, -1);

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
            if (!window.Globe || !globeEl.current) return;
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
                .width(containerRef.current.clientWidth)
                .height(containerRef.current.clientHeight)

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
                .pointLabel(d => `
                    <div style="
                        background: rgba(5, 5, 5, 0.95);
                        border: 1px solid #C5A059;
                        padding: 12px 15px;
                        font-family: 'Lato', sans-serif;
                        text-align: left;
                        max-width: 250px;
                    ">
                        <div style="
                            font-family: 'Cinzel', serif;
                            color: #fff;
                            font-weight: 700;
                            font-size: 14px;
                            border-bottom: 1px solid #333;
                            padding-bottom: 5px;
                            margin-bottom: 5px;
                            letter-spacing: 1px;
                        ">${d.name.toUpperCase()}</div>
                        <div style="font-size: 10px; color: #888; font-style: italic; margin-bottom: 5px;">${d.scientificName || ''}</div>
                        <div style="font-size: 11px; color: #aaa; margin-bottom: 2px;">LOCATION: <span style="color: #C5A059; font-weight: bold;">${d.location}</span></div>
                        <div style="font-size: 11px; color: #aaa; margin-bottom: 2px;">DISCOVERED: <span style="color: #C5A059; font-weight: bold;">${d.year}</span></div>
                        <div style="font-size: 11px; color: #aaa;">BY: <span style="color: #C5A059; font-weight: bold;">${d.discoverer}</span></div>
                    </div>
                `)
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
                if (containerRef.current && world) {
                    world.width(containerRef.current.clientWidth);
                    world.height(containerRef.current.clientHeight);
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

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                height: 'min(600px, 60vh)',
                width: '100%',
                backgroundColor: '#0a0a0a',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                perspective: '1000px',
                zIndex: 0
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

            <div
                style={{
                    position: 'absolute',
                    bottom: '60px',
                    left: '60px',
                    width: '350px',
                    maxWidth: '80%',
                    padding: '25px',
                    paddingLeft: '25px',
                    borderLeft: '2px solid #C5A059',
                    background: 'linear-gradient(90deg, rgba(10,10,10,0.95), transparent)',
                    pointerEvents: 'none',
                    opacity: focusedLocation ? 1 : 0,
                    transform: focusedLocation ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.5s ease',
                    display: 'flex',
                    gap: '20px',
                    flexDirection: isMobile ? 'column' : 'row'
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
                            <h2 style={{ fontSize: '26px', fontStyle: 'italic', margin: '0 0 12px 0', color: '#fff', fontFamily: 'Lato, sans-serif' }}>
                                {focusedLocation.name}
                            </h2>
                            <div style={{ fontFamily: 'Lato, sans-serif', fontSize: '12px', lineHeight: '1.6', color: '#bbb' }}>
                                {focusedLocation.desc}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default GlobeViz;
