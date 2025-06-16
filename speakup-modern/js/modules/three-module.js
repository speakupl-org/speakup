// js/modules/three-module.js
import { RoundedBoxGeometry } from './RoundedBoxGeometry.js';

export function setup3DScene(canvas, THREE) {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- The Glassy, Rounded Cube ---
    const geometry = new RoundedBoxGeometry(1.5, 1.5, 1.5, 6, 0.2); // width, height, depth, segments, radius
    const material = new THREE.MeshPhysicalMaterial({
        metalness: 0.1,
        roughness: 0.05,
        transmission: 1.0,
        ior: 1.7,
        envMapIntensity: 1.5,
        // For the perfect glassy look, it needs something to reflect.
        // We will add an environment map if this is still not right.
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // --- Lighting ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    // --- Animation & Resize ---
    const animate = () => {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };
    const onResize = () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    };
    window.addEventListener('resize', onResize);
    onResize();
    animate();

    return { cube };
}
