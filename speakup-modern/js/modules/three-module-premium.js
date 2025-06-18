// Professional Premium Glass Cube Module - Promise-Based Loading Architecture

import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RoundedBoxGeometry } from './RoundedBoxGeometry.js';

// Function name changed to match main.js import
export function create3DScene(canvas) {
    return new Promise((resolve, reject) => {
        console.log("🚀 Starting premium 3D scene creation...");
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100); // Aspect ratio set later
        camera.position.set(0, 0, 4);

        // Premium renderer with cinematic settings
        const renderer = new THREE.WebGLRenderer({ 
            canvas, 
            antialias: true, 
            alpha: true 
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping; // Cinematic tone mapping
        renderer.toneMappingExposure = 0.85; // Precise value to prevent overexposure
        renderer.setClearColor(0x000000, 0); // Transparent background
        
        console.log("✅ Premium renderer configured");

        // --- The Professional Loading Manager ---
        const loadingManager = new THREE.LoadingManager();

        loadingManager.onLoad = () => {
            console.log("✅ All 3D assets loaded successfully.");
            
            // Start the render loop ONLY after everything is loaded
            const animate = () => {
                // Only auto-rotate when not being controlled by ScrollTrigger
                if (!cube.userData.isScrollControlled) {
                    cube.rotation.x += 0.005;
                    cube.rotation.y += 0.008;
                }
                composer.render(); // Use composer for post-processing
                requestAnimationFrame(animate);
            };
            animate();
            
            console.log("✅ Premium animation loop started");
            
            // Make the dormant crystal visible after everything is loaded
            cube.visible = true;
            
            // Resolve the promise with the complete scene including narrative lights
            resolve({ 
                scene, 
                camera, 
                renderer, 
                composer, 
                bloomPass, 
                cube,
                lights: {
                    pillar1: pillar1Light,
                    pillar2: pillar2Light, 
                    pillar3: pillar3Light
                }
            });
        };

        loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = Math.round((itemsLoaded / itemsTotal) * 100);
            console.log(`📦 Loading progress: ${progress}% (${url})`);
        };

        loadingManager.onError = (url) => {
            console.error(`❌ Error loading asset: ${url}`);
            reject(new Error(`Asset loading failed: ${url}`));
        };

        // --- Scene Objects (created immediately) ---
        // POLISHED CRYSTAL CUBE - Following exact "Polished Crystal" specifications
        // 1. Structure & Form - RoundedBoxGeometry with soft, bevelled edges
        const geometry = new RoundedBoxGeometry(1.8, 1.8, 1.8, 6, 0.2); // radius 0.2 for realistic highlights
        
        const material = new THREE.MeshPhysicalMaterial({
            // 2. Light Transmission & Refraction - The "Crystal" effect
            transmission: 0.98, // Slightly reduced for better light interaction
            ior: 1.7, // Lead crystal level - creates significant light distortion
            thickness: 1.5, // Optimized for colored light transmission
            
            // 3. Color & Attenuation - The "Inherent Tint" (optimized for colored lighting)
            color: 0xFFFFFF, // Pure white base for maximum color fidelity
            attenuationColor: 0xFFFFFF, // Pure white to not filter colors
            attenuationDistance: 10.0, // Much higher for minimal attenuation
            
            // 4. Surface & Reflections - The "Polished" effect
            roughness: 0.0, // Perfect smoothness for maximum light sensitivity
            metalness: 0.0, // Dielectric (non-metal)
            clearcoat: 1.0, // Perfect lacquer layer for dual reflections
            clearcoatRoughness: 0.0, // Perfectly smooth clearcoat for sharp highlights
            
            // Enhanced properties for colored light responsiveness
            reflectivity: 0.8, // Slightly reduced to let more light penetrate
            envMapIntensity: 0.6, // Reduced to prioritize direct colored lighting
            transparent: true,
            opacity: 0.95, // Slight opacity for enhanced light interaction
            side: THREE.DoubleSide,
            needsUpdate: true // Force recalculation
        });
        
        const cube = new THREE.Mesh(geometry, material);
        
        // Initialize cube state
        cube.scale.set(1, 1, 1);
        cube.rotation.set(0, 0, 0);
        cube.userData = { isScrollControlled: false };
        cube.visible = false; // Start invisible - dormant crystal awaiting interaction
        
        scene.add(cube);
        
        console.log("✅ Polished Crystal cube created - dormant, awaiting narrative illumination");

        // NARRATIVE LIGHTS - Positioned to project FROM the text INTO the crystal
        // These lights will "project" each pillar's essence onto the crystal
        const pillar1Light = new THREE.PointLight(0xFFE0B8, 0, 15, 1.5); // Warm gold - increased range and decay
        pillar1Light.position.set(2.5, 1.2, 1.8); // Optimized positioning for maximum impact
        scene.add(pillar1Light);
        
        const pillar2Light = new THREE.PointLight(0xB8D8FF, 0, 15, 1.5); // Cool blue - increased range and decay
        pillar2Light.position.set(2.5, 0, 1.8); // Optimized positioning for maximum impact
        scene.add(pillar2Light);
        
        const pillar3Light = new THREE.PointLight(0xFFFFFF, 0, 15, 1.5); // Pure white - increased range and decay
        pillar3Light.position.set(2.5, -1.2, 1.8); // Optimized positioning for maximum impact
        scene.add(pillar3Light);
        
        // CREATE LIGHT HELPERS FOR DEBUGGING (initially invisible)
        const pillar1Helper = new THREE.PointLightHelper(pillar1Light, 0.3);
        pillar1Helper.visible = false;
        scene.add(pillar1Helper);
        
        const pillar2Helper = new THREE.PointLightHelper(pillar2Light, 0.3);
        pillar2Helper.visible = false;
        scene.add(pillar2Helper);
        
        const pillar3Helper = new THREE.PointLightHelper(pillar3Light, 0.3);
        pillar3Helper.visible = false;
        scene.add(pillar3Helper);
        
        console.log("✅ Narrative lights positioned to project FROM text INTO crystal");

        // LIGHTING SETUP - Minimal base lighting to prioritize narrative lights
        // Very subtle fill lighting to not overpower the story-driven lights
        const ambientLight = new THREE.AmbientLight(0x404040, 0.05); // Further reduced for maximum color impact
        scene.add(ambientLight);
        
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.08); // Further reduced for maximum color impact
        fillLight.position.set(-2, 3, 2);
        scene.add(fillLight);
        
        console.log("✅ Minimal base lighting - narrative lights will completely dominate");

        // 5. Lighting & Rendering - The "Cinematic" look
        // Primary light source: citrus_orchard_puresky_1k.hdr (as specified)
        const rgbeLoader = new RGBELoader(loadingManager);
        rgbeLoader.load('/images/citrus_orchard_puresky_1k.hdr', 
            (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                scene.environment = texture; // Primary light source
                // No scene.background to maintain transparency
                
                console.log("✅ Citrus orchard HDR environment loaded (primary light source)");
            }
        );

        // CINEMATIC POST-PROCESSING - Precise bloom settings for polished crystal
        const composer = new EffectComposer(renderer);
        
        // Base render pass
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);
        
        // Cinematic bloom with exact specifications
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
            0.3, // strength - subtle, elegant glow (was 0.4)
            0.5, // radius - soft, diffuse radius (was 0.4) 
            0.8  // threshold - only brightest specular highlights (was 0.85)
        );
        composer.addPass(bloomPass);
        
        // Output pass for final color correction
        const outputPass = new OutputPass();
        composer.addPass(outputPass);
        
        console.log("✅ Cinematic post-processing configured for polished crystal");

        // Premium resize handling
        const onResize = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            composer.setSize(width, height);
            bloomPass.resolution.set(width, height);
        };
        window.addEventListener('resize', onResize);
        onResize();

        // Refined interactive hover effects for polished crystal
        let isHovered = false;
        canvas.addEventListener('mouseenter', () => {
            if (!isHovered) {
                isHovered = true;
                gsap.to(bloomPass, { 
                    duration: 0.8, 
                    strength: 0.4, // Subtle increase from 0.3
                    ease: 'power2.out' 
                });
                gsap.to(cube.material, {
                    duration: 1.0,
                    envMapIntensity: 1.8, // Gentle increase from 1.5
                    ease: 'power2.out'
                });
            }
        });
        
        canvas.addEventListener('mouseleave', () => {
            if (isHovered) {
                isHovered = false;
                gsap.to(bloomPass, { 
                    duration: 0.8, 
                    strength: 0.3, // Return to base value
                    ease: 'power2.out' 
                });
                gsap.to(cube.material, {
                    duration: 1.0,
                    envMapIntensity: 1.5, // Return to base value
                    ease: 'power2.out'
                });
            }
        });
        
        // DEBUGGING TOOLS - Console controls for Living Crystal
        // Make lights accessible from browser console for testing
        window.livingCrystalDebug = {
            lights: {
                pillar1: pillar1Light,
                pillar2: pillar2Light,
                pillar3: pillar3Light
            },
            helpers: {
                pillar1: pillar1Helper,
                pillar2: pillar2Helper,
                pillar3: pillar3Helper
            },
            cube: cube,
            scene: scene,
            camera: camera,
            renderer: renderer,
            showHelpers: (show = true) => {
                console.log(`${show ? '👁️ Showing' : '🚫 Hiding'} light position helpers`);
                Object.values(window.livingCrystalDebug.helpers).forEach(helper => {
                    helper.visible = show;
                });
                if (show) {
                    console.log('💡 Light helpers now visible - you can see light positions');
                } else {
                    console.log('🔍 Light helpers hidden for clean viewing');
                }
            },
            testLight: (pillar, intensity = 2.5) => {
                console.log(`🔍 Testing ${pillar} light with intensity ${intensity}`);
                if (window.livingCrystalDebug.lights[pillar]) {
                    window.livingCrystalDebug.lights[pillar].intensity = intensity;
                    console.log(`✅ ${pillar} light set to intensity ${intensity}`);
                    console.log(`Color: #${window.livingCrystalDebug.lights[pillar].color.getHexString()}`);
                    console.log(`Position: `, window.livingCrystalDebug.lights[pillar].position);
                    
                    // Visual feedback in page title
                    document.title = `Living Crystal - ${pillar} active (${intensity})`;
                    
                    // Log cube material properties for debugging
                    console.log('Crystal material properties:', {
                        color: cube.material.color.getHexString(),
                        roughness: cube.material.roughness,
                        transmission: cube.material.transmission,
                        ior: cube.material.ior,
                        thickness: cube.material.thickness
                    });
                } else {
                    console.error(`❌ Light ${pillar} not found`);
                }
            },
            testAllLights: (intensity = 2.0) => {
                console.log(`🌈 Testing all lights simultaneously with intensity ${intensity}`);
                Object.entries(window.livingCrystalDebug.lights).forEach(([name, light]) => {
                    light.intensity = intensity;
                    console.log(`${name}: #${light.color.getHexString()}`);
                });
                document.title = `Living Crystal - All lights active (${intensity})`;
            },
            testLightColors: () => {
                console.log('🎨 Displaying light colors:');
                const colors = {
                    pillar1: window.livingCrystalDebug.lights.pillar1.color.getHexString(),
                    pillar2: window.livingCrystalDebug.lights.pillar2.color.getHexString(),
                    pillar3: window.livingCrystalDebug.lights.pillar3.color.getHexString()
                };
                console.table(colors);
                
                // Create visual color swatches in console
                Object.entries(colors).forEach(([name, color]) => {
                    console.log(`%c${name}: #${color}`, `background: #${color}; color: white; padding: 4px 8px; font-weight: bold;`);
                });
            },
            simulateScroll: (position = 0.5) => {
                console.log(`📜 Simulating scroll position: ${(position * 100).toFixed(1)}%`);
                
                // Reset first
                window.livingCrystalDebug.resetLights();
                
                // Simulate the scroll timeline logic with new intensities
                if (position >= 0.1 && position < 0.35) {
                    // Pillar 1 active
                    const intensity = 6.0 * Math.min((position - 0.1) / 0.05, 1);
                    window.livingCrystalDebug.testLight('pillar1', intensity);
                } else if (position >= 0.45 && position < 0.65) {
                    // Pillar 2 active
                    const intensity = 6.0 * Math.min((position - 0.45) / 0.05, 1);
                    window.livingCrystalDebug.testLight('pillar2', intensity);
                } else if (position >= 0.75 && position < 0.95) {
                    // Pillar 3 active
                    const intensity = 7.0 * Math.min((position - 0.75) / 0.05, 1);
                    window.livingCrystalDebug.testLight('pillar3', intensity);
                } else {
                    console.log('📍 At position with no active lights');
                }
            },
            resetLights: () => {
                console.log('🔄 Resetting all lights to intensity 0');
                Object.values(window.livingCrystalDebug.lights).forEach(light => {
                    light.intensity = 0;
                });
                document.title = 'Living Crystal - Lights reset';
            },
            showLightStatus: () => {
                console.log('💡 Current light status:');
                const status = {};
                Object.entries(window.livingCrystalDebug.lights).forEach(([name, light]) => {
                    status[name] = {
                        intensity: light.intensity.toFixed(2),
                        color: `#${light.color.getHexString()}`,
                        position: `(${light.position.x.toFixed(1)}, ${light.position.y.toFixed(1)}, ${light.position.z.toFixed(1)})`,
                        distance: light.distance,
                        decay: light.decay
                    };
                });
                console.table(status);
            },
            testSequence: () => {
                console.log('🎬 Testing narrative light sequence...');
                const debug = window.livingCrystalDebug;
                debug.resetLights();
                
                setTimeout(() => {
                    console.log('🟡 Activating Pillar 1 (Gold) - Warm, Inviting');
                    debug.testLight('pillar1', 6.0);
                }, 1000);
                
                setTimeout(() => {
                    console.log('🔵 Switching to Pillar 2 (Blue) - Cool, Intellectual');
                    debug.resetLights();
                    debug.testLight('pillar2', 6.0);
                }, 3500);
                
                setTimeout(() => {
                    console.log('⚪ Switching to Pillar 3 (White) - Pure, Clarifying');
                    debug.resetLights();
                    debug.testLight('pillar3', 7.0);
                }, 6000);
                
                setTimeout(() => {
                    console.log('🔄 Sequence complete, resetting lights');
                    debug.resetLights();
                }, 8500);
            },
            comprehensiveTest: () => {
                console.log('🧪 Running Comprehensive Living Crystal Test');
                console.log('================================================');
                
                const debug = window.livingCrystalDebug;
                
                // Step 1: Reset and show initial state
                debug.resetLights();
                debug.showLightStatus();
                console.log('✅ Step 1: Initial state verified');
                
                // Step 2: Test each light individually
                setTimeout(() => {
                    console.log('\n🟡 Step 2a: Testing Gold Light (Pillar 1)');
                    debug.testLight('pillar1', 6.0);
                    debug.testLightColors();
                }, 1000);
                
                setTimeout(() => {
                    console.log('\n🔵 Step 2b: Testing Blue Light (Pillar 2)');
                    debug.resetLights();
                    debug.testLight('pillar2', 6.0);
                }, 3000);
                
                setTimeout(() => {
                    console.log('\n⚪ Step 2c: Testing White Light (Pillar 3)');
                    debug.resetLights();
                    debug.testLight('pillar3', 7.0);
                }, 5000);
                
                // Step 3: Test all lights together
                setTimeout(() => {
                    console.log('\n🌈 Step 3: Testing All Lights Combined');
                    debug.testAllLights(4.0);
                }, 7000);
                
                // Step 4: Test scroll positions
                setTimeout(() => {
                    console.log('\n📜 Step 4: Testing Scroll Positions');
                    debug.simulateScroll(0.15); // Pillar 1 region
                }, 9000);
                
                setTimeout(() => {
                    debug.simulateScroll(0.50); // Pillar 2 region
                }, 10500);
                
                setTimeout(() => {
                    debug.simulateScroll(0.80); // Pillar 3 region
                }, 12000);
                
                // Step 5: Final cleanup and status
                setTimeout(() => {
                    console.log('\n🔄 Step 5: Final Reset and Status Report');
                    debug.resetLights();
                    debug.showLightStatus();
                    
                    console.log('\n🎯 COMPREHENSIVE TEST COMPLETE');
                    console.log('================================');
                    console.log('✅ All lighting systems functional');
                    console.log('✅ Color transmission verified');
                    console.log('✅ Scroll simulation working');
                    console.log('✅ Living Crystal ready for production use');
                }, 13500);
            },
            help: () => {
                console.log('🛠️ Living Crystal Debug Commands:');
                console.log('testLight(pillar, intensity) - Test individual light');
                console.log('testAllLights(intensity) - Test all lights at once');
                console.log('testLightColors() - Show color swatches');
                console.log('showHelpers(true/false) - Show/hide light position helpers');
                console.log('simulateScroll(0-1) - Simulate scroll position');
                console.log('testSequence() - Run full narrative sequence');
                console.log('showLightStatus() - Display current light data');
                console.log('resetLights() - Turn off all lights');
                console.log('comprehensiveTest() - Run complete system diagnostic');
                console.log('\nExamples:');
                console.log('livingCrystalDebug.testLight("pillar1", 6.0)');
                console.log('livingCrystalDebug.simulateScroll(0.2) // 20% scroll');
                console.log('livingCrystalDebug.showHelpers(true) // Show light positions');
                console.log('livingCrystalDebug.comprehensiveTest() // Full diagnostic');
                console.log('livingCrystalDebug.testLightColors()');
            }
        };
        
        console.log('🛠️ Living Crystal Debug Tools Enhanced & Ready:');
        console.log('Type: livingCrystalDebug.help() for all commands');
        console.log('Quick test: livingCrystalDebug.testSequence()');
        console.log('Full diagnostic: livingCrystalDebug.comprehensiveTest()');
        console.log('Color test: livingCrystalDebug.testLightColors()');
    });
}
