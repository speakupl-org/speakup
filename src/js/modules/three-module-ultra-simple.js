// Professional Premium Glass Cube Module - GENNADY PHILOSOPHY COMPLIANT
// Using global THREE.js to avoid multiple instances warning
// THREE and its components are available via global script tags
// GSAP is loaded globally via script tags

// This function now returns a Promise that resolves with the scene objects.
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
        renderer.toneMappingExposure = 1.0;
        renderer.setClearColor(0x000000, 0); // Transparent background
        
        console.log("✅ Premium renderer configured");

        // --- The Professional Loading Manager ---
        const loadingManager = new THREE.LoadingManager();
        let assetsLoaded = false;

        loadingManager.onLoad = () => {
            console.log("✅ All 3D assets loaded successfully.");
            assetsLoaded = true;
            
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
            
            // Resolve the promise with the complete scene
            resolve({ scene, camera, renderer, composer, bloomPass, cube });
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
        // PREMIUM ARTISANAL GLASS CUBE - Following exact specifications
        const geometry = new THREE.BoxGeometry(1.8, 1.8, 1.8); // Slightly larger for premium feel
        const material = new THREE.MeshPhysicalMaterial({
            // 1. Base Material & Color - Cool blue-gray tint
            color: 0x9EB7B5, // Subtle cool blue-gray as specified
            thickness: 2.0, // Critical for tint visibility (1.5-2.5 range)
            transmission: 1.0, // Fully transparent
            
            // 2. Surface Quality & Reflections - Almost perfectly smooth
            roughness: 0.03, // Very low but not 0.0 for realism
            metalness: 0.0, // This is glass, not metal
            clearcoat: 1.0, // Perfectly polished outer layer
            clearcoatRoughness: 0.05, // Subtle texture on clearcoat
            
            // 3. Light Interaction & Refraction - Crystal-like behavior
            ior: 1.6, // Higher than standard glass for crystal feel
            specularIntensity: 1.0, // Strong reflections
            
            // Additional premium properties
            reflectivity: 1.0,
            envMapIntensity: 1.5,
            transparent: true,
            side: THREE.DoubleSide // Ensure proper light interaction
        });
        
        const cube = new THREE.Mesh(geometry, material);
        
        // Initialize cube state
        cube.scale.set(1, 1, 1);
        cube.rotation.set(0, 0, 0);
        cube.userData = { isScrollControlled: false };
        cube.visible = true; // Visible from start since we control visibility via canvas
        
        scene.add(cube);
        
        console.log("✅ Premium artisanal glass cube created");
            // 1. Base Material & Color - Cool blue-gray tint
            color: 0x9EB7B5, // Subtle cool blue-gray as specified
            thickness: 2.0, // Critical for tint visibility (1.5-2.5 range)
            transmission: 1.0, // Fully transparent
            
            // 2. Surface Quality & Reflections - Almost perfectly smooth
            roughness: 0.03, // Very low but not 0.0 for realism
            metalness: 0.0, // This is glass, not metal
            clearcoat: 1.0, // Perfectly polished outer layer
            clearcoatRoughness: 0.05, // Subtle texture on clearcoat
            
            // 3. Light Interaction & Refraction - Crystal-like behavior
            ior: 1.6, // Higher than standard glass for crystal feel
            specularIntensity: 1.0, // Strong reflections
            
            // Additional premium properties
            reflectivity: 1.0,
            envMapIntensity: 1.5,
            transparent: true,
            side: THREE.DoubleSide // Ensure proper light interaction
        });
        
        const cube = new THREE.Mesh(geometry, material);
        
        // Initialize cube state to prevent jumps
        cube.scale.set(1, 1, 1);
        cube.rotation.set(0, 0, 0);
        cube.userData = { isScrollControlled: false };
        cube.visible = false; // Start invisible until HDR loads
        
        scene.add(cube);
        
        console.log("✅ Premium artisanal glass cube created with MeshPhysicalMaterial");

        // PREMIUM LIGHTING SETUP - Clean and bright without overexposure
        // Primary: Citrus Orchard HDR environment (as specified)
        const rgbeLoader = new RGBELoader();
        rgbeLoader.load('/images/citrus_orchard_puresky_1k.hdr', 
            (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                scene.environment = texture; // Environment lighting and reflections only
                // No scene.background to prevent bleeding as requested
                
                console.log("✅ Premium citrus orchard HDR environment loaded");
                
                // Make cube visible after environment loads
                cube.visible = true;
            },
            (progress) => {
                console.log(`📦 Loading premium environment: ${Math.round(progress.loaded / progress.total * 100)}%`);
            },
            (error) => {
                console.warn("❌ Failed to load HDR environment, using fallback");
                // Fallback lighting if HDR fails
                scene.add(new THREE.AmbientLight(0x404040, 0.3));
                const keyLight = new THREE.DirectionalLight(0xffffff, 0.4);
                keyLight.position.set(5, 5, 5);
                scene.add(keyLight);
                cube.visible = true;
            }
        );

        // Subtle fill lighting (very low intensity as specified)
        const ambientLight = new THREE.AmbientLight(0x404040, 0.2); // Low intensity fill
        scene.add(ambientLight);
        
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3); // Subtle fill light
        fillLight.position.set(-2, 3, 2);
        scene.add(fillLight);
        
        console.log("✅ Premium lighting setup complete with HDR primary + subtle fill");

        // CINEMATIC POST-PROCESSING - Bloom for premium glow
        const composer = new EffectComposer(renderer);
        
        // Base render pass
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);
        
        // Premium bloom effect for cinematic highlights
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
            0.4, // strength - moderate elegant glow
            0.4, // radius - soft diffuse bloom
            0.85 // threshold - only brightest highlights
        );
        composer.addPass(bloomPass);
        
        // Output pass for final color correction
        const outputPass = new OutputPass();
        composer.addPass(outputPass);
        
        console.log("✅ Cinematic post-processing pipeline configured");

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

        // Premium animation loop with post-processing
        const animate = () => {
            // Only auto-rotate when not being controlled by ScrollTrigger
            if (!cube.userData.isScrollControlled) {
                cube.rotation.x += 0.005;
                cube.rotation.y += 0.008;
            }
            composer.render(); // Use composer instead of renderer for post-processing
            requestAnimationFrame(animate);
        };
        animate();
        
        console.log("✅ Premium animation with cinematic post-processing started");

        // Fade in canvas with GSAP
        gsap.fromTo(canvas, 
            { opacity: 0 },
            { 
                delay: 0.3, 
                duration: 1.5, 
                opacity: 1, 
                ease: 'power2.out' 
            }
        );

        // Premium entrance animation with enhanced timing
        gsap.fromTo(cube.scale,
            { x: 0, y: 0, z: 0 },
            {
                delay: 1.0, // Wait for HDR to load
                duration: 1.0,
                x: 1, y: 1, z: 1,
                ease: 'back.out(1.2)', // Less bouncy than elastic
                onComplete: () => {
                    // Mark as ready for scroll control
                    cube.userData.entranceComplete = true;
                }
            }
        );

        // Premium interactive hover effects
        let isHovered = false;
        canvas.addEventListener('mouseenter', () => {
            if (!isHovered && cube.userData.entranceComplete) {
                isHovered = true;
                gsap.to(bloomPass, { 
                    duration: 0.6, 
                    strength: 0.6, 
                    ease: 'power2.out' 
                });
                gsap.to(cube.material, {
                    duration: 0.8,
                    envMapIntensity: 2.0,
                    ease: 'power2.out'
                });
            }
        });
        
        canvas.addEventListener('mouseleave', () => {
            if (isHovered) {
                isHovered = false;
                gsap.to(bloomPass, { 
                    duration: 0.6, 
                    strength: 0.4, 
                    ease: 'power2.out' 
                });
                gsap.to(cube.material, {
                    duration: 0.8,
                    envMapIntensity: 1.5,
                    ease: 'power2.out'
                });
            }
        });

        return { cube, scene, camera, renderer, composer, bloomPass };
    } catch (error) {
        console.error("❌ Error in setup3DScene:", error);
        return { cube: null };
    }
}
