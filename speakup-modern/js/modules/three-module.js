// js/modules/three-module.js

// MODERN IMPORT: This file now imports its own tools.
import * as THREE from 'three';

// The object we export is just the module itself.
export const threeModule = {
    setup: function(canvas) {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
        this.camera.position.z = 3.5; // We'll keep the camera here for now.

        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // --- AESTHETIC FIX ---
        // 1. Reduce the size of the cube's geometry.
        const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2); // Was 1.5, now smaller.

        // 2. Build the definitive "Crystal Glass" material.
        const material = new THREE.MeshPhysicalMaterial({
            metalness: 0,
            roughness: 0,
            transmission: 1.0,  // Full transparency
            ior: 1.7,           // IOR for glass is ~1.5; for crystal a bit higher.
            thickness: 1.2,     // Corresponds to the new geometry size
            specularIntensity: 1.0,
            // Subtle color tint from your palette to match the site.
            color: 0xE5F5F5, 
            specularColor: 0xFFFFFF, // Pure white highlights
        });

        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);

        // 3. Improve the lighting to make the glass "pop".
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.5)); // Softer ambient light
        
        // A strong, white key light from the top-right.
        const keyLight = new THREE.DirectionalLight(0xffffff, 2);
        keyLight.position.set(1, 1, 1);
        this.scene.add(keyLight);
        
        // A colored rim light from the bottom-left to give it shape and match your palette.
        const rimLight = new THREE.PointLight(0x00A09A, 2); // Your primary accent color
        rimLight.position.set(-2, -2, -2);
        this.scene.add(rimLight);

        const onResize = () => {
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        };
        window.addEventListener('resize', onResize);
        onResize();

        const animate = () => {
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(animate);
        }
        animate();

        return { cube: this.cube };
    }
};