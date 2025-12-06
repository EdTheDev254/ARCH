import React, { Suspense, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';

// Component to load and display the 3D model
const Model = ({ modelPath, onLoaded }) => {
    const { scene } = useGLTF(modelPath);
    const { camera } = useThree();

    useEffect(() => {
        // Auto-fit camera to model
        camera.position.set(5, 3, 5);
        camera.lookAt(0, 0, 0);
        // Notify parent that model is loaded
        if (onLoaded) onLoaded();
    }, [camera, onLoaded]);

    return (
        <Center>
            <primitive
                object={scene}
                scale={1}
                dispose={null}
            />
        </Center>
    );
};

const ModelViewer = ({ modelPath, speciesName }) => {
    const baseUrl = import.meta.env.BASE_URL.slice(0, -1);
    const fullPath = baseUrl + modelPath;
    const [isModelLoaded, setIsModelLoaded] = useState(false);

    // Preload the model
    useEffect(() => {
        setIsModelLoaded(false);
        useGLTF.preload(fullPath);
    }, [fullPath]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                borderLeft: '2px solid #C5A059',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Loading Overlay */}
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: isModelLoaded ? 0 : 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                    zIndex: isModelLoaded ? -1 : 100,
                    pointerEvents: isModelLoaded ? 'none' : 'auto'
                }}
            >
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #333',
                    borderTop: '3px solid #C5A059',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <div style={{
                    marginTop: '16px',
                    fontFamily: 'Cinzel, serif',
                    color: '#C5A059',
                    fontSize: '12px',
                    letterSpacing: '2px'
                }}>
                    LOADING MODEL...
                </div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </motion.div>

            {/* Header */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 10,
                fontFamily: 'Cinzel, serif',
                color: '#C5A059',
                fontSize: '12px',
                letterSpacing: '2px',
                textTransform: 'uppercase'
            }}>
                3D Model View
            </div>

            {/* Species name */}
            {speciesName && (
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    zIndex: 10,
                    fontFamily: 'Lato, sans-serif',
                    color: '#fff',
                    fontSize: '18px',
                    fontStyle: 'italic'
                }}>
                    {speciesName}
                </div>
            )}

            {/* Controls hint */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                zIndex: 10,
                fontFamily: 'Lato, sans-serif',
                color: '#666',
                fontSize: '11px',
                textAlign: 'right'
            }}>
                <div>🖱️ Left drag to rotate</div>
                <div>🔍 Scroll to zoom</div>
                <div>✋ Right drag to pan</div>
            </div>

            {/* 3D Canvas */}
            <Canvas
                camera={{ position: [5, 3, 5], fov: 50 }}
                style={{ background: 'transparent' }}
                dpr={[1, 2]}
            >
                {/* Lighting */}
                <ambientLight intensity={0.4} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={1}
                    castShadow
                />
                <directionalLight
                    position={[-10, -10, -5]}
                    intensity={0.3}
                />
                <pointLight position={[0, 10, 0]} intensity={0.5} color="#C5A059" />

                {/* Environment for reflections */}
                <Environment preset="night" />

                {/* Model */}
                <Suspense fallback={null}>
                    <Model modelPath={fullPath} onLoaded={() => setIsModelLoaded(true)} />
                </Suspense>

                {/* Orbit Controls - with panning enabled */}
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                    minDistance={2}
                    maxDistance={20}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 1.5}
                    panSpeed={0.8}
                />

                {/* Ground grid for reference */}
                <gridHelper args={[20, 20, '#333333', '#222222']} position={[0, -1.5, 0]} />
            </Canvas>
        </motion.div>
    );
};

export default ModelViewer;
