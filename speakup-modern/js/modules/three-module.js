// /js/modules/three-module.js - The Interactive Crystal - FINAL POLISH

// --- Core Three.js Imports ---
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { RoundedBoxGeometry } from './RoundedBoxGeometry.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export function setup3DScene(canvas) {
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7);
    camera.lookAt(0, 0, 0);

    // Cinematic Renderer Configuration
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace; // Non-negotiable for cinematic color
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // Non-negotiable for cinematic grade
    renderer.toneMappingExposure = 0.9; // Starting point for proper exposure
    renderer.setClearColor(0x000000, 0);

    // Post-Processing: UnrealBloomPass for Premium Edge Glow
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
        1.2,    // strength
        0.4,    // radius  
        0.85    // threshold - high value so only brightest highlights bloom
    );
    composer.addPass(bloomPass);
    
    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    // FINAL POLISH: Translucent Smoked Crystal Material
    const geometry = new RoundedBoxGeometry(2, 2, 2, 8, 0.15);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x222222, // Neutral very dark gray - color comes from lights
        metalness: 0.1,
        roughness: 0.1, // Very low for polished surface with sharp reflections
        transmission: 0.92, // Between 0.9-0.95 for dense, smoky translucent material
        ior: 1.55, // Realistic for high-quality acrylic/crystal
        thickness: 2.5, // Substantial value for deep light travel and tinting
        clearcoat: 1.0, // Full clearcoat for high-gloss varnish layer
        clearcoatRoughness: 0.1, // Subtle realistic texture on clearcoat
        reflectivity: 1.0,
        envMapIntensity: 1.0, // Full environment reflection intensity
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.visible = false;
    
    // Interactive state tracking
    cube.userData = {
        isInteractive: true,
        isCinematic: false,
        targetRotation: { x: 0, y: 0, z: 0 },
        velocity: { x: 0, y: 0, z: 0 }
    };
    
    scene.add(cube);

    // Cinematic Dynamic Lighting System
    const pillar1 = new THREE.PointLight(0xFFB800, 0, 12, 1.5); // Primary brand color - warm gold
    pillar1.position.set(4, 2, 3); // Positioned to simulate light from text
    scene.add(pillar1);
    
    const pillar2 = new THREE.PointLight(0x87CEEB, 0, 12, 1.5); // Cool complementary blue
    pillar2.position.set(4, 0, 3); // Center position
    scene.add(pillar2);
    
    const pillar3 = new THREE.PointLight(0xFFFFFF, 0, 12, 1.5); // Clean bright white
    pillar3.position.set(4, -2, 3); // Lower position
    scene.add(pillar3);
    
    const lights = { pillar1, pillar2, pillar3 };

    // Minimal ambient - environment will provide base lighting
    scene.add(new THREE.AmbientLight(0x404040, 0.02));

    // MANDATORY: Environment Lighting - citrus_orchard_puresky_1k.hdr
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('/public/images/citrus_orchard_puresky_1k.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture; // MANDATORY for realistic base reflections
        console.log("✅ HDR environment loaded - crystal surface will feel polished");
    }, undefined, (error) => {
        console.warn("HDR environment failed to load, using fallback:", error);
        // Fallback to basic environment
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        const envTexture = pmremGenerator.fromScene(new THREE.Scene()).texture;
        scene.environment = envTexture;
        pmremGenerator.dispose();
    });

    // Act 1: Draggable Interaction System
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let mouseMoveHandler, mouseUpHandler;

    function onMouseDown(event) {
        if (!cube.userData.isInteractive) return;
        
        isDragging = true;
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };

        mouseMoveHandler = onMouseMove.bind(this);
        mouseUpHandler = onMouseUp.bind(this);
        
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
        canvas.style.cursor = 'grabbing';
    }

    function onMouseMove(event) {
        if (!isDragging || !cube.userData.isInteractive) return;

        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };

        // Convert mouse movement to rotation with inertia
        const rotationSpeed = 0.01;
        cube.userData.velocity.y += deltaMove.x * rotationSpeed;
        cube.userData.velocity.x += deltaMove.y * rotationSpeed;

        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    function onMouseUp() {
        if (!cube.userData.isInteractive) return;
        
        isDragging = false;
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        canvas.style.cursor = 'grab';
    }

    // Act 2: Enable/Disable interaction methods for cinematic control
    function enableInteraction() {
        cube.userData.isInteractive = true;
        cube.userData.isCinematic = false;
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.style.cursor = 'grab';
        console.log("🎮 Interactive mode enabled - cube is draggable");
    }

    function disableInteraction() {
        cube.userData.isInteractive = false;
        cube.userData.isCinematic = true;
        canvas.removeEventListener('mousedown', onMouseDown);
        canvas.style.cursor = 'default';
        
        // Clean up any active drag listeners
        if (mouseMoveHandler) document.removeEventListener('mousemove', mouseMoveHandler);
        if (mouseUpHandler) document.removeEventListener('mouseup', mouseUpHandler);
        
        console.log("🎬 Cinematic mode enabled - GSAP controls cube");
    }

    // Act 1: Gentle idle rotation and inertia system
    function updateCubeRotation() {
        if (cube.userData.isInteractive && !cube.userData.isCinematic) {
            // Apply velocity to rotation
            cube.rotation.x += cube.userData.velocity.x;
            cube.rotation.y += cube.userData.velocity.y;
            
            // Add gentle idle rotation when not dragging
            if (!isDragging) {
                cube.rotation.y += 0.003; // Gentle automatic y-axis spin
                
                // Apply damping to velocity for smooth return to idle
                cube.userData.velocity.x *= 0.95;
                cube.userData.velocity.y *= 0.95;
            }
        }
    }

    // Animation loop with post-processing
    function animate() {
        updateCubeRotation();
        composer.render(); // Use composer instead of renderer for post-processing
        requestAnimationFrame(animate);
    }
    animate();

    // Handle window resize for composer
    function onWindowResize() {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        composer.setSize(canvas.clientWidth, canvas.clientHeight);
    }
    window.addEventListener('resize', onWindowResize);

    // Reveal cube and enable interaction after brief delay
    setTimeout(() => { 
        cube.visible = true;
        enableInteraction();
    }, 300);

    // Return complete scene object for animation-controller
    return { 
        cube, 
        lights, 
        enableInteraction, 
        disableInteraction,
        renderer,
        composer, // Include composer for potential external control
        scene,
        camera
    };
}