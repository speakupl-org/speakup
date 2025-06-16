import { RoundedBoxGeometry } from './RoundedBoxGeometry.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export function setup3DScene(canvas, THREE) {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- The Final Glassy, Rounded Cube ---
    const geometry = new RoundedBoxGeometry(1.5, 1.5, 1.5, 6, 0.2);
    const material = new THREE.MeshPhysicalMaterial({
        metalness: 0,
        roughness: 0,
        transmission: 1.0,
        ior: 2.33,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // --- Environment Map ---
    // This is the key to the glassy look.
    // It uses the .hdr file you already have in your public/images folder.
    new RGBELoader().load('/images/citrus_orchard_puresky_1k.hdr', function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture; // Use this for reflections.
        // scene.background = texture; // Optional: if you want to see the background image.
    });
    
    // --- Lighting ---
    scene.add(new THREE.AmbientLight(0xffffff, 1.0)); // A bit more ambient light
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    // --- Animation & Resize (as before) ---
    const animate = () => {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };
    const onResize = () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };
    window.addEventListener('resize', onResize);
    onResize();
    animate();

    return { cube };
}