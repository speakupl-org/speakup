// js/modules/three-module.js

// MODERN IMPORT: This file now imports its own tools.
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export const threeModule = {
    setup: function(canvas) {
        // Scene, camera, and renderer setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        this.camera.position.z = 4;

        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // --- DEFINITIVE GLASSY CUBE ---
        const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2); // A bit smaller for optimal appearance
        const material = new THREE.MeshPhysicalMaterial({
            metalness: 0,
            roughness: 0,
            transmission: 1.0, // 100% transparent
            ior: 2.33,
            thickness: 2.0, // Thicker glass for more refraction
        });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);

        // --- ENVIRONMENT & LIGHTING ---
        // This is the secret to making glass look good.
        const loader = new RGBELoader();
        // Ensure you have an .hdr file in your /public/images/ folder.
        loader.load('/images/your-studio-environment.hdr', (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.background = texture; // Optional: display the environment as a background
            this.scene.environment = texture;  // CRUCIAL: use for reflections
        });

        // Add a simple directional light to illuminate the scene
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
        dirLight.position.set(5, 10, 7.5);
        this.scene.add(dirLight);

        // Animation and resize handling
        const animate = () => {
            if (!this.renderer) return; // Guard against missing renderer
            requestAnimationFrame(animate);
            this.renderer.render(this.scene, this.camera);
        };
        animate();

        const onResize = () => {
            if (!this.renderer) return; // Guard against missing renderer
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        };
        window.addEventListener('resize', onResize);
        onResize(); // Initial call

        return { cube: this.cube };
    }
};