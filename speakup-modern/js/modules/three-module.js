// js/modules/three-module.js

import * as THREE from 'three';

export const threeModule = {
    renderer: null,
    camera: null,
    scene: null,
    cube: null,
    
    // The setup function now accepts THREE as an argument.
    setup: function(canvas, THREE) {
        // --- Set up scene, camera, and renderer ---
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
        this.camera.position.set(0, 0, 5);
        this.scene.add(this.camera);
  
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  
        // --- The "Crystal" Cube ---
        const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  
        // Create a reflective environment
        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
        const cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
        this.scene.add(cubeCamera);
  
        const material = new THREE.MeshPhysicalMaterial({
            metalness: 0,
            roughness: 0,
            transmission: 1.0,
            ior: 2.33,
            // Use the scene's reflective texture
            envMap: cubeRenderTarget.texture,
        });
  
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
  
        // Ensure the reflective camera follows the cube
        cubeCamera.position.copy(this.cube.position);
  
        // --- The Animate Loop ---
        // Update the environment map and render the scene in each frame.
        this.animate = () => {
            if (this.renderer && this.cube) {
                // Hide the cube and update the cubeCamera for accurate reflections.
                this.cube.visible = false;
                cubeCamera.update(this.renderer, this.scene);
                this.cube.visible = true;
  
                this.renderer.render(this.scene, this.camera);
            }
            requestAnimationFrame(this.animate.bind(this));
        };
  
        // --- Lighting ---
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        const dirLight = new THREE.DirectionalLight(0xffffff, 2);
        dirLight.position.set(10, 10, 10);
        this.scene.add(dirLight);
  
        // --- Resize Handler ---
        this.handleResize = () => {
            this.camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        };
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize();
  
        // Start the animation
        this.animate();
  
        return { cube: this.cube };
    }
};