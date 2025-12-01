// Species location data (5 test species)
const speciesLocations = [
    {
        name: "Tyrannosaurus Rex",
        location: "Montana, USA",
        lat: 46.8797,
        lon: -110.3626,
        era: "Late Cretaceous",
        color: 0xff6b6b
    },
    {
        name: "Velociraptor",
        location: "Gobi Desert, Mongolia",
        lat: 43.5,
        lon: 104.0,
        era: "Late Cretaceous",
        color: 0x4ecdc4
    },
    {
        name: "Spinosaurus",
        location: "Egypt",
        lat: 26.8206,
        lon: 30.8025,
        era: "Late Cretaceous",
        color: 0x95e1d3
    },
    {
        name: "Archaeopteryx",
        location: "Solnhofen, Germany",
        lat: 48.8897,
        lon: 10.9942,
        era: "Late Jurassic",
        color: 0xf38181
    },
    {
        name: "Megalodon",
        location: "Pacific Ocean",
        lat: 0,
        lon: -160,
        era: "Neogene",
        color: 0xaa96da
    }
];

// Scene setup
let scene, camera, renderer, globe, markers = [], controls;
let raycaster, mouse;

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0e1a, 10, 50);

    // Camera
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 12;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('globe-container').appendChild(renderer.domElement);

    // Raycaster for hover detection
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x4cc9f0, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x7209b7, 0.5, 100);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // Create Globe
    createGlobe();

    // Add species markers
    addSpeciesMarkers();

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 6;
    controls.maxDistance = 20;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);

    // Hide loading
    document.getElementById('loading').style.display = 'none';

    // Start animation
    animate();
}

function createGlobe() {
    // Main globe sphere
    const geometry = new THREE.SphereGeometry(5, 64, 64);

    // Wireframe material
    const material = new THREE.MeshPhongMaterial({
        color: 0x4cc9f0,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
        emissive: 0x4cc9f0,
        emissiveIntensity: 0.2
    });

    globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // Add inner glow sphere
    const glowGeometry = new THREE.SphereGeometry(4.95, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x4cc9f0,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
    });
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowSphere);

    // Add country boundaries (simplified latitude/longitude lines)
    addLatLongLines();
}

function addLatLongLines() {
    const latLongGroup = new THREE.Group();

    // Latitude lines
    for (let lat = -80; lat <= 80; lat += 20) {
        const curve = new THREE.EllipseCurve(
            0, 0,
            5 * Math.cos(lat * Math.PI / 180), 5 * Math.cos(lat * Math.PI / 180),
            0, 2 * Math.PI,
            false,
            0
        );

        const points = curve.getPoints(64);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0x4cc9f0,
            transparent: true,
            opacity: 0.15
        });
        const line = new THREE.Line(geometry, material);
        line.rotation.x = Math.PI / 2;
        line.position.y = 5 * Math.sin(lat * Math.PI / 180);
        latLongGroup.add(line);
    }

    // Longitude lines
    for (let lon = 0; lon < 360; lon += 20) {
        const curve = new THREE.EllipseCurve(
            0, 0,
            5, 5,
            0, 2 * Math.PI,
            false,
            0
        );

        const points = curve.getPoints(64);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0x4cc9f0,
            transparent: true,
            opacity: 0.15
        });
        const line = new THREE.Line(geometry, material);
        line.rotation.y = lon * Math.PI / 180;
        latLongGroup.add(line);
    }

    scene.add(latLongGroup);
}

function addSpeciesMarkers() {
    speciesLocations.forEach((species, index) => {
        const markerGroup = new THREE.Group();

        // Convert lat/lon to 3D coordinates
        const phi = (90 - species.lat) * (Math.PI / 180);
        const theta = (species.lon + 180) * (Math.PI / 180);

        const x = -5.1 * Math.sin(phi) * Math.cos(theta);
        const y = 5.1 * Math.cos(phi);
        const z = 5.1 * Math.sin(phi) * Math.sin(theta);

        // Marker sphere
        const markerGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const markerMaterial = new THREE.MeshBasicMaterial({
            color: species.color,
            transparent: true,
            opacity: 0.9
        });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.userData = species;
        marker.name = `marker-${index}`;

        // Glow ring
        const ringGeometry = new THREE.RingGeometry(0.2, 0.25, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: species.color,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.lookAt(0, 0, 0);

        markerGroup.add(marker);
        markerGroup.add(ring);
        markerGroup.position.set(x, y, z);

        markers.push(markerGroup);
        scene.add(markerGroup);
    });
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Check for marker hover
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(markers.flatMap(m => m.children), true);

    if (intersects.length > 0) {
        const intersected = intersects[0].object;
        const species = intersected.userData;

        if (species && species.name) {
            document.body.style.cursor = 'pointer';
            showSpeciesInfo(species);
        }
    } else {
        document.body.style.cursor = 'default';
    }
}

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(markers.flatMap(m => m.children), true);

    if (intersects.length > 0) {
        const species = intersects[0].object.userData;
        if (species && species.name) {
            showSpeciesInfo(species);
        }
    }
}

function showSpeciesInfo(species) {
    const infoDiv = document.getElementById('species-info');
    infoDiv.innerHTML = `
        <strong style="color: #${species.color.toString(16)}; font-size: 16px;">${species.name}</strong><br>
        <span style="color: rgba(255,255,255,0.7);">📍 ${species.location}</span><br>
        <span style="color: rgba(255,255,255,0.7);">🕐 ${species.era}</span>
    `;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate globe slowly
    if (globe) {
        globe.rotation.y += 0.001;
    }

    // Pulse markers
    markers.forEach((marker, index) => {
        const scale = 1 + Math.sin(Date.now() * 0.003 + index) * 0.2;
        marker.children[1].scale.set(scale, scale, 1);
    });

    controls.update();
    renderer.render(scene, camera);
}

// Initialize on load
window.addEventListener('DOMContentLoaded', init);
