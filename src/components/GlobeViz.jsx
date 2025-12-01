import React, { useEffect, useRef, useState } from 'react';
import speciesData from '../data/species.json';

const GlobeViz = () => {
    const globeEl = useRef();
    const containerRef = useRef();
    const [focusedLocation, setFocusedLocation] = useState(null);
    const [scale, setScale] = useState(1);
    const [isLoaded, setIsLoaded] = useState(false);

    // Use the specific test data from the prototype as requested
    const mapData = [
        { name: "Anomalocaris", period: "CAMBRIAN", lat: 51.4, lng: -116.5, year: 1892, discoverer: "J.F. Whiteaves", desc: "The 'Odd Shrimp'. Apex predator of the Cambrian seas." },
        { name: "Dunkleosteus", period: "DEVONIAN", lat: 41.5, lng: -81.7, year: 1873, discoverer: "Jay Terrell", desc: "A massive hyper-carnivorous armored fish." },
        { name: "Meganeura", period: "CARBONIFEROUS", lat: 46.3, lng: 2.7, year: 1880, discoverer: "Charles Brongniart", desc: "Dragonfly-like insect with a 70cm wingspan." },
        { name: "Dimetrodon", period: "PERMIAN", lat: 33.6, lng: -99.3, year: 1878, discoverer: "Edward Drinker Cope", desc: "Sail-backed synapsid, predating dinosaurs." },
        { name: "Archaeopteryx", period: "JURASSIC", lat: 48.9, lng: 11.0, year: 1861, discoverer: "Hermann von Meyer", desc: "The transitional fossil between dinosaurs and birds." },
        { name: "Velociraptor", period: "CRETACEOUS", lat: 44.0, lng: 105.0, year: 1923, discoverer: "Peter Kaisen", desc: "Small, feathered dromaeosaurid dinosaur." },
        { name: "Smilodon", period: "PLEISTOCENE", lat: 34.0, lng: -118.3, year: 1842, discoverer: "Peter Wilhelm Lund", desc: "The Saber-toothed Cat of the Ice Age." },
        { name: "Diprotodon", period: "PLEISTOCENE", lat: -25.0, lng: 135.0, year: 1838, discoverer: "Sir Thomas Mitchell", desc: "The largest marsupial to ever live." },
        { name: "Megalodon", period: "MIOCENE", lat: 10.0, lng: -140.0, year: 1843, discoverer: "Louis Agassiz", desc: "An extinct species of mackerel shark." },
        { name: "Kaprosuchus", period: "CRETACEOUS", lat: 16.0, lng: 8.0, year: 2009, discoverer: "Sereno & Larsson", desc: "BoarCroc - terrestrial crocodile from Niger." },
        { name: "Inostrancevia", period: "PERMIAN", lat: 64.5, lng: 40.5, year: 1922, discoverer: "Vladimir Amalitsky", desc: "Largest gorgonopsid saber-tooth predator." }
    ];

    useEffect(() => {
        const initGlobe = () => {
            if (!window.Globe || !globeEl.current) return;

            // Check if already initialized
            if (globeEl.current.innerHTML !== '') return;

            const world = window.Globe()
                (globeEl.current)
                .backgroundColor('#0a0a0a')
                .showAtmosphere(true)
                .atmosphereColor('#3a228a')
                .atmosphereAltitude(0.15)
                .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
                .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
                .width(window.innerWidth)
                .height(600)

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
                        world.pointOfView({ lat: d.lat, lng: d.lng, altitude: 1.8 }, 1200);
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
                        <div style="font-size: 11px; color: #aaa; margin-bottom: 2px;">DISCOVERED: <span style="color: #C5A059; font-weight: bold;">${d.year}</span></div>
                        <div style="font-size: 11px; color: #aaa;">BY: <span style="color: #C5A059; font-weight: bold;">${d.discoverer}</span></div>
                    </div>
                `)
                .onPointClick(d => {
                    setFocusedLocation(d);
                    world.pointOfView({ lat: d.lat, lng: d.lng, altitude: 1.8 }, 1200);
                    resetAutoRotateTimer();
                })
                .onGlobeReady(() => {
                    // Globe is ready, fade out the curtain
                    setTimeout(() => setIsLoaded(true), 500);
                });

            world.controls().autoRotate = true;
            world.controls().autoRotateSpeed = 0.4;
            world.controls().enableZoom = false;

            // Closer altitude = larger earth (was 2.5)
            world.pointOfView({ lat: 20, lng: 0, altitude: 1.8 });

            let autoRotateTimer;
            function resetAutoRotateTimer() {
                world.controls().autoRotate = false;
                clearTimeout(autoRotateTimer);
                autoRotateTimer = setTimeout(() => {
                    world.controls().autoRotate = true;
                }, 1000); // Reduced from 3000ms to 1000ms
            }

            world.controls().addEventListener('start', resetAutoRotateTimer);

            const handleResize = () => {
                world.width(window.innerWidth);
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
    }, []);

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
                height: '600px',
                width: '100%',
                backgroundColor: '#0a0a0a', // Prevent white flash on load
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                perspective: '1000px',
                zIndex: 0
            }}
        >
            {/* Loading Curtain */}
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

            <div
                style={{
                    transform: `scale(${scale})`,
                    transition: 'transform 0.1s ease-out',
                    transformOrigin: 'center center'
                }}
            >
                <div ref={globeEl} />
            </div>

            <div
                style={{
                    position: 'absolute',
                    bottom: '60px',
                    left: '60px',
                    width: '280px',
                    padding: '25px',
                    borderLeft: '2px solid #C5A059',
                    background: 'linear-gradient(90deg, rgba(10,10,10,0.95), transparent)',
                    pointerEvents: 'none',
                    opacity: focusedLocation ? 1 : 0,
                    transform: focusedLocation ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.5s ease'
                }}
            >
                {focusedLocation && (
                    <>
                        <div style={{ fontFamily: 'Cinzel, serif', color: '#C5A059', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>
                            {focusedLocation.period}
                        </div>
                        <h2 style={{ fontSize: '26px', fontStyle: 'italic', margin: '0 0 12px 0', color: '#fff' }}>
                            {focusedLocation.name}
                        </h2>
                        <div style={{ fontFamily: 'Lato, sans-serif', fontSize: '12px', lineHeight: '1.6', color: '#bbb' }}>
                            {focusedLocation.desc}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default GlobeViz;
