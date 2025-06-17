import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { RoundedBoxGeometry } from './RoundedBoxGeometry.js';
import { BoxGeometry, Vector3 } from 'three';

let lastCube = null;

export function setup3DScene(canvas, THREE) {
    const scene = new THREE.Scene();
    // Configure camera near/far to avoid clipping bleed
     
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.near = 0.1;
    camera.far = 1000;
    camera.updateProjectionMatrix();
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    // Ensure depth buffer clear and allow transparency
    renderer.autoClearDepth = true;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- The Final Glassy, Rounded Cube ---
    const geometry = new RoundedBoxGeometry(1.5, 1.5, 1.5, 6, 0.2);
    const material = new THREE.MeshPhysicalMaterial({
        // Base material properties
        color: 0xffffff,           // Base color (will be tinted by transmission)
        metalness: 0,              // Glass is non-metallic
        roughness: 0.05,           // Slight roughness for more realistic reflections
        
        // Glass transmission properties
        transmission: 0.95,        // Slightly less than 1.0 for more realistic glass
        ior: 1.52,                 // Index of refraction for crown glass (more realistic than 2.33)
        thickness: 0.5,            // Controls light absorption through the material
        
        // Clearcoat layer for premium finish
        clearcoat: 1.0,            // Full clearcoat intensity for glossy finish
        clearcoatRoughness: 0.03,  // Very smooth clearcoat for sharp reflections
        
        // Subtle tinting and enhancement
        attenuationColor: 0xe8f4ff, // Very light blue tint for premium glass look
        attenuationDistance: 2.0,   // Distance over which the tint is applied
        
        // Additional enhancement properties
        specularIntensity: 1.0,    // Full specular reflections
        specularColor: 0xffffff,   // White specular highlights
        sheen: 0.2,               // Subtle sheen for added depth
        sheenColor: 0xf0f8ff,     // Very light blue sheen
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    // Store cube reference for external access and diagnostics
    lastCube = cube;
    // Attach canvas element for diagnostics observer
    cube.userData.canvas = canvas;
    console.log('Debug (three-module): Cube added to scene with initial rotation:', {
        x: cube.rotation.x.toFixed(3),
        y: cube.rotation.y.toFixed(3),
        z: cube.rotation.z.toFixed(3)
    });

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

/**
 * Returns the last created cube from the 3D scene
 */
export function getCube() {
    return lastCube;
}