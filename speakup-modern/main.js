// /main.js (Professional Hybrid Architecture)

// GSAP loaded globally via script tags (optimized for Cloudflare Pages)
// THREE.js loaded as ES modules for better tree-shaking

// Import your custom modules
import { setup3DScene } from './js/modules/three-module.js';
import { setupScrollytelling } from './js/modules/animation-controller.js';

// Import and make THREE.js globally available
import * as THREE from 'three';
window.THREE = THREE; // Make THREE globally available for debugging tools

// Import debugging system
import './js/diagnostics/debug-controller.js';
import { ThreeSceneDebugger } from './js/diagnostics/three-scene-debugger.js';
import { PerformanceMonitor } from './js/diagnostics/performance-monitor.js';
import { ScrollytellingDebugger } from './js/diagnostics/scrollytelling-debugger.js';
import { CanvasPixelDebugger } from './js/diagnostics/canvas-pixel-debugger.js';

// Debug verification function
function verifyDebugSetup() {
    console.log('🔧 VERIFYING DEBUG SETUP...');
    
    const checks = [
        { name: 'Debug Controller', test: () => !!window.debugController, obj: 'window.debugController' },
        { name: 'Quick Background Fix', test: () => !!window.quickBackgroundFix, obj: 'window.quickBackgroundFix' },
        { name: 'Scrollytelling Debug', test: () => !!window.scrollytellingDebug, obj: 'window.scrollytellingDebug' },
        { name: 'Three Scene Debugger', test: () => !!window.threeSceneDebugger, obj: 'window.threeSceneDebugger' },
        { name: 'Performance Monitor', test: () => !!window.performanceMonitor, obj: 'window.performanceMonitor' },
        { name: 'Canvas Pixel Debugger', test: () => !!window.canvasPixelDebug, obj: 'window.canvasPixelDebug' }
    ];
    
    checks.forEach(check => {
        const status = check.test() ? '✅' : '❌';
        console.log(`  ${status} ${check.name}: ${check.obj}`);
    });
    
    if (window.scrollytellingDebug) {
        console.log('\n🔍 Running quick scrollytelling analysis...');
        try {
            window.scrollytellingDebug.analyze();
        } catch (error) {
            console.error('❌ Error running scrollytelling analysis:', error);
        }
    }
    
    console.log('\n💡 Try running: quickBackgroundFix.fixEverything()');
}

// Register GSAP plugins (loaded globally)
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    if (window.debugController) {
        window.debugController.registerModule('gsap', 'loaded', gsap.version);
        window.debugController.registerModule('scrolltrigger', 'loaded', ScrollTrigger.version);
    }
    console.log("✅ GSAP loaded globally and registered");
} else {
    if (window.debugController) {
        window.debugController.error('GSAP not available - check script tags', 'main');
    }
    console.error("❌ GSAP not available - check script tags");
}

// 4. --- Main Application Logic (Now Async) ---
async function runApplication() {
    console.log("Application starting...");

    // --- Part 1: Global Lenis Smooth Scroll Setup ---
    // This runs on every page that includes main.js
    if (typeof Lenis === 'undefined') {
        console.warn("Lenis library not found. Smooth scroll will be disabled.");
        // If no Lenis, we can't do any advanced scroll animations, so we might as well stop.
    } else {
        const lenis = new Lenis();
        if (window.debugController) {
            window.debugController.registerModule('lenis', 'loaded', 'unknown');
        }

        // Connect Lenis to GSAP's ticker for perfectly synchronized timing
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        if (window.debugController) {
            window.debugController.info('Global smooth scroll initialized with Lenis', 'main');
        }
        console.log("Global smooth scroll initialized.");

        // Now, we connect ScrollTrigger to the Lenis instance.
        // This makes ALL ScrollTriggers on the site (if you add more later) use Lenis.
        ScrollTrigger.scrollerProxy(document.body, {
            scrollTop(value) {
                if (arguments.length) {
                    lenis.scrollTo(value);
                }
                return lenis.scroll;
            },
            getBoundingClientRect() {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            }
        });
        // When Lenis scrolls, we MUST tell ScrollTrigger to update its own internal state.
        lenis.on('scroll', ScrollTrigger.update);
    }
    

    // --- Part 2: Page-Specific Scrollytelling Setup ---
    // This part only runs if it finds the necessary elements on the current page.
    const scrollyWrapper = document.querySelector('.scrolly-experience-wrapper');
    if (!scrollyWrapper) {
        console.log("Scrollytelling components not found on this page. Exiting animation setup.");
        return; // This is a normal page, so we're done.
    }

    console.log("Scrollytelling components FOUND. Initializing professional loading sequence...");
    
    // Initialize debug session for Three.js AFTER functions are defined
    if (window.location.search.includes('debug=true') || window.location.hostname === 'localhost') {
        console.log("🔧 THREE.JS DEBUG SESSION STARTED");
        window.threeJsDebugMode = true;
        debugThreeJsEnvironment();
        
        // Run debug verification after a short delay to ensure all tools are loaded
        setTimeout(() => {
            verifyDebugSetup();
            createSophisticatedColorFixes();
            createSimpleWorkingFixes(); // Add simple fixes that actually work
        }, 500);
    }
    
    // A. Collect all DOM elements for the animation
    const DOM = {
        canvas: document.querySelector('#threejs-canvas'),
        placeholder: document.querySelector('#canvas-placeholder'),
        textPillars: gsap.utils.toArray('.pillar-text-content'),
        // ... add other elements if needed
    };

    if (!DOM.canvas || !DOM.placeholder) {
        console.error("Critical: Canvas or placeholder not found.");
        return;
    }

    // --- The Staged Reveal ---
    try {
        if (window.debugController) {
            window.debugController.startTimer('3d-scene-loading');
            window.debugController.info('Starting 3D scene initialization', 'main');
        }
        
        console.log("🔄 Loading 3D assets...");
        
        // 1. Await the 3D Scene: This pauses execution until all assets are loaded.
        const scene3D = setup3DScene(DOM.canvas);
        window.threeJsScene = scene3D; // Keep for backward compatibility
        
        // STRATEGIC FIX: Register scene with debugger (no more global dependency)
        if (window.debugController) {
            window.debugController.setScene(scene3D);
            window.debugController.setCanvas(DOM.canvas);
            const loadTime = window.debugController.endTimer('3d-scene-loading');
            window.debugController.info(`3D scene loaded in ${loadTime.toFixed(2)}ms`, 'main');
        }
        
        // Initialize 3D scene debugger
        if (window.debugController?.isEnabled) {
            // Delay debugger creation to ensure renderer is fully initialized
            setTimeout(() => {
                window.threeDebugger = new ThreeSceneDebugger(scene3D);
                window.debugController.registerModule('three-scene-debugger', 'loaded', '1.0.0');
            }, 600);
        }
        
        // Always create quick fix functions (not just in debug mode)
        window.quickBackgroundFix = {
            setPageColor: () => {
                if (scene3D.renderer) {
                    scene3D.renderer.setClearColor(0x112024, 1);
                    console.log("✅ Applied page background color (#112024) to renderer");
                }
            },
            setTransparent: () => {
                if (scene3D.renderer) {
                    scene3D.renderer.setClearColor(0x000000, 0);
                    console.log("✅ Set renderer to transparent");
                }
            },
            setWhite: () => {
                if (scene3D.renderer) {
                    scene3D.renderer.setClearColor(0xffffff, 1);
                    console.log("✅ Set renderer to white background");
                }
            },
            showCanvas: () => {
                gsap.set(DOM.canvas, { autoAlpha: 1 });
                gsap.set(DOM.placeholder, { autoAlpha: 0 });
                console.log("✅ Forced canvas to be visible");
            },
            showCube: () => {
                if (scene3D.cube) {
                    scene3D.cube.visible = true;
                    console.log("✅ Forced cube to be visible");
                } else {
                    console.warn("❌ Cube not found in scene3D");
                }
            },
            fixEverything: () => {
                // Show canvas
                gsap.set(DOM.canvas, { autoAlpha: 1 });
                gsap.set(DOM.placeholder, { autoAlpha: 0 });
                // Show cube
                if (scene3D.cube) {
                    scene3D.cube.visible = true;
                }
                // Fix background
                if (scene3D.renderer) {
                    scene3D.renderer.setClearColor(0x112024, 1);
                }
                console.log("✅ Applied complete fix: canvas visible + cube visible + background color");
            },
            info: () => {
                console.log("🔧 Quick fix commands:");
                console.log("  quickBackgroundFix.fixEverything() - ← TRY THIS FIRST!");
                console.log("  quickBackgroundFix.showCanvas() - Force canvas visible");
                console.log("  quickBackgroundFix.showCube() - Force cube visible");
                console.log("  quickBackgroundFix.setPageColor() - Fix background color");
                console.log("  quickBackgroundFix.setTransparent() - Make transparent");
                console.log("  quickBackgroundFix.setWhite() - Test with white");
            }
        };
        
        // Trigger debug analysis if in debug mode
        if (window.threeJsDebugMode) {
            // Dispatch custom event for debug analysis
            window.dispatchEvent(new CustomEvent('threeSceneCreated', { detail: scene3D }));
            console.log("🔧 Quick background fix available: quickBackgroundFix.info()");
        }

        console.log("✅ All assets loaded. Starting reveal sequence...");

        // 2. The Reveal Animation: Now that the 3D scene is 100% ready.
        console.log("🎬 Starting canvas reveal animation...");
        const tl = gsap.timeline({
            onComplete: () => {
                console.log("✅ Canvas reveal animation complete");
            }
        });
        tl.to(DOM.placeholder, { autoAlpha: 0, duration: 0.5 })
          .to(DOM.canvas, { autoAlpha: 1, duration: 0.5 }, "-=0.25") // Overlap the fades
          .from(scene3D.cube.scale, { 
              x: 0, y: 0, z: 0, 
              duration: 1.0, 
              ease: 'back.out(1.2)' 
          }, "-=0.2"); // Start cube entrance slightly before canvas is fully visible
          
        // Fallback: Force canvas visible if animation fails
        setTimeout(() => {
            const canvasStyle = getComputedStyle(DOM.canvas);
            if (canvasStyle.opacity === '0' || canvasStyle.visibility === 'hidden') {
                console.warn("⚠️ Canvas still hidden after animation - applying fallback");
                gsap.set(DOM.canvas, { autoAlpha: 1 });
                gsap.set(DOM.placeholder, { autoAlpha: 0 });
            }
        }, 2000);

        // 3. Initialize Animations: Only set up ScrollTrigger after the scene is visible.
        if (scene3D && scene3D.cube) {
            if (window.debugController) {
                window.debugController.startTimer('scrollytelling-setup');
            }
            setupScrollytelling(scene3D.cube, scene3D); // Pass full scene3D object
            if (window.debugController) {
                window.debugController.endTimer('scrollytelling-setup');
                window.debugController.info('Scrollytelling animations initialized', 'main');
            }
            console.log("✅ Premium 3D experience with professional loading complete");
        }

    } catch (error) {
        if (window.debugController) {
            window.debugController.error('Failed to initialize 3D experience', 'main', error);
        }
        console.error("Failed to initialize 3D experience:", error);
        
        // Hide the spinner on error and show fallback message
        if (DOM.placeholder) {
            const spinner = DOM.placeholder.querySelector('.placeholder-spinner');
            if (spinner) {
                spinner.style.display = 'none';
                DOM.placeholder.innerHTML = '<div style="color: white; text-align: center;">3D content unavailable</div>';
            }
        }
    }
}

// 5. START
// We wait for the full page to load to ensure all elements and styles are ready.
window.addEventListener('load', runApplication);

// === THREE.JS DEBUG SESSION ===
function debugThreeJsEnvironment() {
    try {
        console.log("🎯 Starting Three.js Debug Session");
        
        // 1. Check CSS Variables and Computed Styles
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        const backgroundDark = computedStyle.getPropertyValue('--color-background-dark').trim();
        
        console.log("📋 CSS Environment Check:");
        console.log("  --color-background-dark:", backgroundDark);
    
    // 2. Check Canvas Container Styles
    setTimeout(() => {
        const canvas = document.querySelector('#threejs-canvas');
        const visualsContainer = document.querySelector('.scrolly-visuals');
        
        if (canvas) {
            const canvasStyles = getComputedStyle(canvas);
            console.log("🎨 Canvas Styles:");
            console.log("  background:", canvasStyles.background);
            console.log("  backgroundColor:", canvasStyles.backgroundColor);
            console.log("  opacity:", canvasStyles.opacity);
            console.log("  visibility:", canvasStyles.visibility);
        }
        
        if (visualsContainer) {
            const containerStyles = getComputedStyle(visualsContainer);
            console.log("📦 Container Styles:");
            console.log("  background:", containerStyles.background);
            console.log("  backgroundColor:", containerStyles.backgroundColor);
        }
    }, 100);
    
    // 3. Monitor Scene Creation
    window.addEventListener('threeSceneCreated', (event) => {
        debugThreeJsScene(event.detail);
    });
    
    } catch (error) {
        console.error("Debug initialization failed, but main app will continue:", error);
    }
}

function debugThreeJsScene(scene3D) {
    console.log("🔍 THREE.JS SCENE DEBUG ANALYSIS");
    
    if (!scene3D) {
        console.error("❌ Scene3D object is null or undefined");
        return;
    }
    
    // 1. Renderer Analysis
    if (scene3D.renderer) {
        const renderer = scene3D.renderer;
        console.log("🖥️ Renderer Analysis:");
        try {
            const clearColor = renderer.getClearColor();
            console.log("  Clear Color:", `#${clearColor.getHexString()}`);
            console.log("  Clear Alpha:", renderer.getClearAlpha());
        } catch (err) {
            console.warn("  Could not read clearColor/alpha:", err);
        }
        console.log("  Output Color Space:", renderer.outputColorSpace);
        console.log("  Tone Mapping:", getToneMappingName(renderer.toneMapping));
        console.log("  Tone Mapping Exposure:", renderer.toneMappingExposure);
        
        // Check if alpha is causing issues (safely)
        try {
            if (renderer.getClearColor().getHex() === 0x000000 && renderer.getClearAlpha() === 0) {
                console.warn("⚠️ POTENTIAL ISSUE: Transparent black clear color might appear as solid black");
                console.log("💡 SOLUTION: Try renderer.setClearColor(0x112024, 1) to match page background");
            }
        } catch (err) {
            console.warn("  Could not check clear color for issues:", err);
        }
    }
    
    // 2. Scene Analysis
    if (scene3D.scene) {
        const scene = scene3D.scene;
        console.log("🌟 Scene Analysis:");
        console.log("  Background:", scene.background);
        console.log("  Environment:", scene.environment ? "Loaded" : "Not loaded");
        
        if (!scene.environment) {
            console.warn("⚠️ POTENTIAL ISSUE: No HDR environment loaded - cube may appear dark");
        }
    }
    
    // 3. Cube Material Analysis
    if (scene3D.cube) {
        const cube = scene3D.cube;
        const material = cube.material;
        console.log("🧊 Cube Material Analysis:");
        console.log("  Visible:", cube.visible);
        console.log("  Material Type:", material.type);
        console.log("  Color:", `#${material.color.getHexString()}`);
        console.log("  Transmission:", material.transmission);
        console.log("  Opacity:", material.opacity);
        console.log("  Transparent:", material.transparent);
        console.log("  Metalness:", material.metalness);
        console.log("  Roughness:", material.roughness);
        
        if (material.transmission > 0.5 && !scene3D.scene.environment) {
            console.warn("⚠️ POTENTIAL ISSUE: High transmission material without environment map");
            console.log("💡 SOLUTION: Ensure HDR environment loads properly");
        }
    }
    
    // 4. Lighting Analysis
    if (scene3D.lights) {
        console.log("💡 Lighting Analysis:");
        Object.entries(scene3D.lights).forEach(([name, light]) => {
            if (light) {
                console.log(`  ${name}:`, {
                    intensity: light.intensity,
                    color: `#${light.color.getHexString()}`,
                    position: light.position
                });
            }
        });
        
        const totalIntensity = Object.values(scene3D.lights)
            .reduce((sum, light) => sum + (light?.intensity || 0), 0);
        
        if (totalIntensity === 0) {
            console.warn("⚠️ POTENTIAL ISSUE: All lights have zero intensity - scene will be dark");
        }
    }
    
    // 5. Background Color Recommendations
    console.log("🎨 BACKGROUND FIX RECOMMENDATIONS:");
    console.log("1. Set renderer clear color to match page:", "renderer.setClearColor(0x112024, 1)");
    console.log("2. Or set scene background:", "scene.background = new THREE.Color(0x112024)");
    console.log("3. Or ensure HDR environment loads:", "Check citrus_orchard_puresky_1k.hdr path");
    
    // 6. Live Testing Functions
    window.testBackgroundFixes = {
        setPageColor: () => {
            scene3D.renderer.setClearColor(0x112024, 1);
            console.log("✅ Applied page background color to renderer");
        },
        setTransparent: () => {
            scene3D.renderer.setClearColor(0x000000, 0);
            console.log("✅ Set renderer to transparent");
        },
        setWhite: () => {
            scene3D.renderer.setClearColor(0xffffff, 1);
            console.log("✅ Set renderer to white");
        },
        setSceneBackground: () => {
            scene3D.scene.background = new THREE.Color(0x112024);
            console.log("✅ Set scene background color");
        },
        clearSceneBackground: () => {
            scene3D.scene.background = null;
            console.log("✅ Cleared scene background");
        }
    };
    
    console.log("🔧 Test functions available: window.testBackgroundFixes");
    console.log("  testBackgroundFixes.setPageColor() - Match page background");
    console.log("  testBackgroundFixes.setTransparent() - Transparent background");
    console.log("  testBackgroundFixes.setWhite() - White background");
    console.log("  testBackgroundFixes.setSceneBackground() - Scene background");
}

function getToneMappingName(value) {
    const mappings = {
        0: 'NoToneMapping',
        1: 'LinearToneMapping', 
        2: 'ReinhardToneMapping',
        3: 'CineonToneMapping',
        4: 'ACESFilmicToneMapping'
    };
    return mappings[value] || `Unknown(${value})`;
}

// 🎯 COMPREHENSIVE FIX FUNCTION - Addresses all identified issues
function fixAllIssues() {
    console.log('🔧 APPLYING COMPREHENSIVE FIXES...');
    
    const fixes = [];
    
    // 0. Deep canvas analysis first
    if (window.canvasPixelDebug) {
        console.log('🔬 Running deep canvas analysis...');
        const analysis = window.canvasPixelDebug.analyze();
        fixes.push('✅ Deep canvas analysis completed');
        
        // Apply renderer fixes if black background detected
        if (analysis && analysis.isBlack) {
            console.log('🎨 Black renderer detected - applying fixes...');
            window.canvasPixelDebug.fixRenderer();
            fixes.push('✅ Renderer black background fixed');
        }
    }
    
    // 1. Fix lighting issues
    if (window.threeJsScene && window.threeJsScene.lights) {
        console.log('💡 Fixing light intensities...');
        window.threeJsScene.lights.pillar1.intensity = Math.max(0.3, window.threeJsScene.lights.pillar1.intensity);
        window.threeJsScene.lights.pillar2.intensity = Math.max(0.2, window.threeJsScene.lights.pillar2.intensity);
        window.threeJsScene.lights.pillar3.intensity = Math.max(0.4, window.threeJsScene.lights.pillar3.intensity);
        fixes.push('✅ Light intensities restored');
    }
    
    // 2. Fix cube visibility
    if (window.threeJsScene && window.threeJsScene.cube) {
        console.log('🧊 Ensuring cube visibility...');
        window.threeJsScene.cube.visible = true;
        if (window.threeJsScene.cube.material) {
            // Ensure the material is visible
            window.threeJsScene.cube.material.transparent = true;
            window.threeJsScene.cube.material.opacity = Math.max(0.8, window.threeJsScene.cube.material.opacity);
            window.threeJsScene.cube.material.needsUpdate = true;
        }
        fixes.push('✅ Cube visibility ensured');
    }
    
    // 3. Fix renderer clear color (the most important fix!)
    if (window.threeJsScene && window.threeJsScene.renderer) {
        console.log('🎨 Setting proper renderer background...');
        // Get the actual page background color
        const pageColor = getComputedStyle(document.documentElement).getPropertyValue('--color-background-dark').trim() || '#112024';
        console.log('📝 Using page color:', pageColor);
        window.threeJsScene.renderer.setClearColor(pageColor, 1);
        fixes.push('✅ Renderer background set to page color');
    }
    
    // 4. Fix canvas positioning and visibility
    const canvas = document.querySelector('#threejs-canvas');
    if (canvas) {
        console.log('📱 Optimizing canvas settings...');
        canvas.style.background = 'transparent';
        canvas.style.opacity = '1';
        canvas.style.visibility = 'visible';
        canvas.style.pointerEvents = 'auto';
        fixes.push('✅ Canvas visibility optimized');
    }
    
    // 5. Fix container backgrounds
    const visuals = document.querySelector('.scrolly-visuals');
    if (visuals) {
        console.log('📦 Clearing container backgrounds...');
        visuals.style.background = 'transparent';
        visuals.style.backgroundColor = 'transparent';
        fixes.push('✅ Container backgrounds cleared');
    }
    
    // 6. Run quick background fix
    if (window.quickBackgroundFix) {
        console.log('⚡ Running quick background fix...');
        window.quickBackgroundFix.fixEverything();
        fixes.push('✅ Quick background fix applied');
    }
    
    console.log('\n🎯 FIXES COMPLETED:');
    fixes.forEach(fix => console.log(`  ${fix}`));
    
    console.log('\n💡 New commands available:');
    console.log('  - canvasPixelDebug.analyze() - Deep rendering analysis');
    console.log('  - canvasPixelDebug.fixRenderer() - Fix renderer issues');
    console.log('  - scrollytellingDebug.showOverlays() - See layout boundaries');
    
    return { success: true, fixes };
}

// SOPHISTICATED COLOR FIXES - Based on detailed analysis
function createSophisticatedColorFixes() {
    window.sophisticatedColorFix = {
        // Analyze all colors in the system
        analyzeAllColors: () => {
            if (window.debugController) {
                return window.debugController.analyzeAllColors();
            } else {
                console.log('❌ Debug controller not available');
                return null;
            }
        },
        
        // Fix based on detected issues
        fixDetectedIssues: () => {
            console.log('🔧 RUNNING SOPHISTICATED COLOR FIXES...');
            
            const analysis = window.sophisticatedColorFix.analyzeAllColors();
            if (!analysis) return false;
            
            const fixes = [];
            
            // Fix each detected issue
            analysis.issues.forEach(issue => {
                switch (issue.type) {
                    case 'RENDERER_BLACK_BACKGROUND':
                        console.log('🎨 Fixing renderer black background...');
                        if (window.threeJsScene?.renderer) {
                            window.threeJsScene.renderer.setClearColor(0x000000, 0); // Transparent
                            fixes.push('✅ Renderer set to transparent');
                        }
                        break;
                        
                    case 'CANVAS_INVISIBLE':
                        console.log('👁️ Making canvas visible...');
                        const canvas = document.querySelector('#threejs-canvas');
                        if (canvas) {
                            canvas.style.opacity = '1';
                            canvas.style.visibility = 'visible';
                            fixes.push('✅ Canvas made visible');
                        }
                        break;
                        
                    case 'DARK_CONTAINER_COVERING_CANVAS':
                        console.log('📦 Fixing dark container...');
                        const visuals = document.querySelector('.scrolly-visuals');
                        if (visuals) {
                            visuals.style.background = 'transparent';
                            visuals.style.backgroundColor = 'transparent';
                            fixes.push('✅ Container background cleared');
                        }
                        break;
                }
            });
            
            console.log('\n🎯 SOPHISTICATED FIXES APPLIED:');
            fixes.forEach(fix => console.log(`  ${fix}`));
            
            return { success: true, fixes, issues: analysis.issues.length };
        },
        
        // Make everything completely transparent
        makeFullyTransparent: () => {
            console.log('🌟 MAKING EVERYTHING FULLY TRANSPARENT...');
            
            const fixes = [];
            
            // 1. Renderer transparent
            if (window.threeJsScene?.renderer) {
                window.threeJsScene.renderer.setClearColor(0x000000, 0);
                fixes.push('✅ Renderer transparent');
            }
            
            // 2. All containers transparent
            const containers = ['.scrolly-visuals', '.scrolly-wrapper', '#canvas-placeholder', 'body'];
            containers.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.background = 'transparent';
                    element.style.backgroundColor = 'transparent';
                    fixes.push(`✅ ${selector} transparent`);
                }
            });
            
            // 3. Canvas fully visible
            const canvas = document.querySelector('#threejs-canvas');
            if (canvas) {
                canvas.style.opacity = '1';
                canvas.style.visibility = 'visible';
                canvas.style.background = 'transparent';
                fixes.push('✅ Canvas visible and transparent');
            }
            
            console.log('\n🌟 TRANSPARENCY FIXES:');
            fixes.forEach(fix => console.log(`  ${fix}`));
            
            return fixes;
        },
        
        // Set specific color with proper alpha
        setSpecificColor: (color, alpha = 1) => {
            console.log(`🎨 Setting specific color: ${color} (alpha: ${alpha})`);
            
            if (window.threeJsScene?.renderer) {
                // Convert color string to THREE.js color
                const threeColor = new THREE.Color(color);
                window.threeJsScene.renderer.setClearColor(threeColor, alpha);
                console.log(`✅ Renderer set to ${color} with alpha ${alpha}`);
                return true;
            }
            
            console.log('❌ Renderer not available');
            return false;
        },
        
        info: () => {
            console.log('🎨 SOPHISTICATED COLOR TOOLS:');
            console.log('  sophisticatedColorFix.analyzeAllColors() - Complete color analysis');
            console.log('  sophisticatedColorFix.fixDetectedIssues() - Fix based on analysis');
            console.log('  sophisticatedColorFix.makeFullyTransparent() - Make everything transparent');
            console.log('  sophisticatedColorFix.setSpecificColor("#112024", 0) - Set transparent page color');
            console.log('  sophisticatedColorFix.setSpecificColor("#ffffff", 1) - Set white background');
        }
    };
    
    console.log('🎨 Sophisticated color fix tools available: sophisticatedColorFix.info()');
}

// SIMPLE WORKING FIXES - No THREE dependency
function createSimpleWorkingFixes() {
    window.simpleColorFix = {
        // Make canvas black (for testing)
        makeCanvasBlack: () => {
            console.log('🖤 MAKING CANVAS BLACK...');
            const canvas = document.querySelector('#threejs-canvas');
            if (canvas) {
                // Set CSS background to black
                canvas.style.backgroundColor = 'black';
                canvas.style.background = 'black';
                canvas.style.opacity = '1';
                
                // Also set renderer to black
                if (window.threeJsScene?.renderer) {
                    window.threeJsScene.renderer.setClearColor(0x000000, 1);
                }
                
                console.log('✅ Canvas and renderer set to black');
                console.log('📏 Canvas dimensions:', canvas.getBoundingClientRect());
                return true;
            }
            console.log('❌ Canvas not found');
            return false;
        },
        
        // Force canvas to be completely visible
        forceCanvasVisible: () => {
            console.log('👁️ FORCING CANVAS VISIBLE...');
            const canvas = document.querySelector('#threejs-canvas');
            if (canvas) {
                canvas.style.opacity = '1';
                canvas.style.visibility = 'visible';
                canvas.style.display = 'block';
                canvas.style.zIndex = '5';
                console.log('✅ Canvas forced visible');
                console.log('📏 Canvas rect:', canvas.getBoundingClientRect());
                console.log('🎨 Canvas computed style:', {
                    opacity: getComputedStyle(canvas).opacity,
                    visibility: getComputedStyle(canvas).visibility,
                    background: getComputedStyle(canvas).background
                });
                return true;
            }
            return false;
        },
        
        // Use the working renderer fix (the one that worked before)
        setRendererColor: (color = '#000000', alpha = 1) => {
            console.log(`🎨 SETTING RENDERER COLOR: ${color} (alpha: ${alpha})`);
            
            if (window.threeJsScene?.renderer) {
                try {
                    // Convert hex to number for THREE.js
                    const colorNum = parseInt(color.replace('#', '0x'));
                    window.threeJsScene.renderer.setClearColor(colorNum, alpha);
                    console.log(`✅ Renderer set to ${color} with alpha ${alpha}`);
                    return true;
                } catch (error) {
                    console.log('❌ Error setting renderer color:', error);
                    return false;
                }
            }
            console.log('❌ Renderer not available');
            return false;
        },
        
        // The combo that should work
        makeBlackVisible: () => {
            console.log('🔧 MAKING CANVAS BLACK AND VISIBLE...');
            const results = [];
            
            // 1. Force canvas visible
            results.push(window.simpleColorFix.forceCanvasVisible());
            
            // 2. Set renderer to black
            results.push(window.simpleColorFix.setRendererColor('#000000', 1));
            
            // 3. Set canvas background to black as backup
            results.push(window.simpleColorFix.makeCanvasBlack());
            
            console.log('🎯 Results:', results);
            return results.every(r => r);
        },
        
        // Test with white to see if it's working
        makeWhiteVisible: () => {
            console.log('🔧 MAKING CANVAS WHITE AND VISIBLE...');
            const results = [];
            
            results.push(window.simpleColorFix.forceCanvasVisible());
            results.push(window.simpleColorFix.setRendererColor('#ffffff', 1));
            
            const canvas = document.querySelector('#threejs-canvas');
            if (canvas) {
                canvas.style.backgroundColor = 'white';
                results.push(true);
            }
            
            return results.every(r => r);
        },
        
        // Enhanced cube visibility controls
        makeCubeVisible: () => {
            console.log('🧊 MAKING CUBE VISIBLE...');
            
            if (!window.threeJsScene?.cube) {
                console.log('❌ Cube not found in scene');
                return false;
            }
            
            const cube = window.threeJsScene.cube;
            const fixes = [];
            
            // 1. Make cube visible
            cube.visible = true;
            fixes.push('✅ Cube visible');
            
            // 2. Adjust material for better visibility
            if (cube.material) {
                // Reduce transmission so it's not too glass-like
                cube.material.transmission = 0.3; // Less transparent
                cube.material.opacity = 0.9;
                cube.material.transparent = true;
                
                // Add some base color
                cube.material.color.setHex(0x444444); // Darker gray instead of very dark
                
                cube.material.needsUpdate = true;
                fixes.push('✅ Cube material adjusted for visibility');
            }
            
            // 3. Boost lighting
            if (window.threeJsScene.lights) {
                Object.values(window.threeJsScene.lights).forEach((light, index) => {
                    light.intensity = Math.max(1.0, light.intensity); // Boost intensity
                    fixes.push(`✅ Light ${index + 1} intensity boosted to ${light.intensity}`);
                });
            }
            
            // 4. Add emergency ambient light if needed
            if (window.threeJsScene.scene) {
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
                window.threeJsScene.scene.add(ambientLight);
                fixes.push('✅ Emergency ambient light added');
            }
            
            console.log('🧊 Cube visibility fixes:');
            fixes.forEach(fix => console.log(`  ${fix}`));
            
            return true;
        },
        
        // Perfect combination for visibility
        makeVisibleWithCube: (backgroundColor = '#000000') => {
            console.log(`🎯 MAKING CANVAS VISIBLE WITH CUBE (bg: ${backgroundColor})...`);
            
            const steps = [];
            
            // 1. Force canvas visible
            steps.push(window.simpleColorFix.forceCanvasVisible());
            
            // 2. Set background color
            steps.push(window.simpleColorFix.setRendererColor(backgroundColor, 1));
            
            // 3. Make cube visible with enhanced settings
            steps.push(window.simpleColorFix.makeCubeVisible());
            
            console.log('🎯 Steps completed:', steps);
            
            // 4. Final verification
            if (window.threeJsScene?.cube) {
                console.log('🧊 Final cube state:', {
                    visible: window.threeJsScene.cube.visible,
                    transmission: window.threeJsScene.cube.material?.transmission,
                    opacity: window.threeJsScene.cube.material?.opacity,
                    color: window.threeJsScene.cube.material?.color.getHexString()
                });
            }
            
            return steps.every(Boolean);
        },
        
        // Dark background with visible cube
        makeBlackWithVisibleCube: () => {
            return window.simpleColorFix.makeVisibleWithCube('#000000');
        },
        
        // Light background with visible cube
        makeLightWithVisibleCube: () => {
            return window.simpleColorFix.makeVisibleWithCube('#112024'); // Page color
        },
        
        // ULTIMATE BACKGROUND REMOVAL - Make cube independent of background
        removeBackgroundCompletely: () => {
            console.log('🌟 REMOVING BACKGROUND COMPLETELY...');
            
            const fixes = [];
            
            // 1. Make renderer completely transparent
            if (window.threeJsScene?.renderer) {
                window.threeJsScene.renderer.setClearColor(0x000000, 0); // Alpha = 0 = transparent
                fixes.push('✅ Renderer set to completely transparent');
            }
            
            // 2. Remove all CSS backgrounds
            const canvas = document.querySelector('#threejs-canvas');
            if (canvas) {
                canvas.style.background = 'transparent';
                canvas.style.backgroundColor = 'transparent';
                canvas.style.opacity = '1';
                canvas.style.visibility = 'visible';
                fixes.push('✅ Canvas CSS backgrounds removed');
            }
            
            // 3. Remove container backgrounds
            const visuals = document.querySelector('.scrolly-visuals');
            if (visuals) {
                visuals.style.background = 'transparent';
                visuals.style.backgroundColor = 'transparent';
                fixes.push('✅ Container backgrounds removed');
            }
            
            console.log('🌟 Background removal:');
            fixes.forEach(fix => console.log(`  ${fix}`));
            
            return fixes.length > 0;
        },
        
        // MAKE CUBE SELF-ILLUMINATED - Independent of external lighting
        makeCubeSelfIlluminated: () => {
            console.log('💡 MAKING CUBE SELF-ILLUMINATED...');
            
            if (!window.threeJsScene?.cube) {
                console.log('❌ Cube not found');
                return false;
            }
            
            const cube = window.threeJsScene.cube;
            const material = cube.material;
            const fixes = [];
            
            // 1. Make cube visible
            cube.visible = true;
            fixes.push('✅ Cube visible');
            
            // 2. Add emissive properties (self-lighting)
            if (material) {
                // Make it emit its own light
                material.emissive = new THREE.Color(0x222244); // Subtle blue glow
                material.emissiveIntensity = 0.3;
                
                // Reduce transparency but keep glass effect
                material.transmission = 0.5; // Semi-transparent
                material.opacity = 0.85;
                material.transparent = true;
                
                // Enhance surface properties
                material.metalness = 0.1;
                material.roughness = 0.1;
                material.color.setHex(0x445566); // Slightly visible base color
                
                // Add rim lighting effect
                material.clearcoat = 1.0;
                material.clearcoatRoughness = 0.1;
                
                material.needsUpdate = true;
                fixes.push('✅ Cube made self-illuminating with emissive properties');
                fixes.push('✅ Added clearcoat for rim lighting effect');
            }
            
            console.log('💡 Self-illumination fixes:');
            fixes.forEach(fix => console.log(`  ${fix}`));
            
            return true;
        },
        
        // ENHANCE THREE.JS INTERNAL LIGHTING - Make it background independent
        enhanceInternalLighting: () => {
            console.log('🔦 ENHANCING INTERNAL THREE.JS LIGHTING...');
            
            if (!window.threeJsScene?.scene) {
                console.log('❌ Scene not found');
                return false;
            }
            
            const scene = window.threeJsScene.scene;
            const fixes = [];
            
            // 1. Boost existing lights dramatically
            if (window.threeJsScene.lights) {
                Object.entries(window.threeJsScene.lights).forEach(([name, light]) => {
                    light.intensity = 2.0; // Much brighter
                    light.distance = 20; // Longer reach
                    fixes.push(`✅ ${name} intensity boosted to ${light.intensity}`);
                });
            }
            
            // 2. Add powerful ambient light
            const existingAmbient = scene.children.find(child => child.type === 'AmbientLight');
            if (existingAmbient) {
                existingAmbient.intensity = 0.8; // Much brighter ambient
                fixes.push('✅ Existing ambient light boosted');
            } else {
                const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
                scene.add(ambientLight);
                fixes.push('✅ New powerful ambient light added');
            }
            
            // 3. Add directional light for consistent illumination
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
            directionalLight.position.set(5, 5, 5);
            directionalLight.target.position.set(0, 0, 0);
            scene.add(directionalLight);
            scene.add(directionalLight.target);
            fixes.push('✅ Directional light added for consistent illumination');
            
            // 4. Add point light at camera position
            const pointLight = new THREE.PointLight(0xffffff, 1.0, 30);
            pointLight.position.set(0, 0, 10);
            scene.add(pointLight);
            fixes.push('✅ Point light added at camera position');
            
            console.log('🔦 Internal lighting enhancements:');
            fixes.forEach(fix => console.log(`  ${fix}`));
            
            return true;
        },
        
        // ULTIMATE INDEPENDENCE - Remove background + self-illuminate cube
        makeCompletelyIndependent: () => {
            console.log('🚀 MAKING CUBE COMPLETELY BACKGROUND-INDEPENDENT...');
            
            const results = [];
            
            // 1. Remove all backgrounds
            results.push(window.simpleColorFix.removeBackgroundCompletely());
            
            // 2. Make cube self-illuminated
            results.push(window.simpleColorFix.makeCubeSelfIlluminated());
            
            // 3. Enhance internal lighting
            results.push(window.simpleColorFix.enhanceInternalLighting());
            
            // 4. Final verification
            if (window.threeJsScene?.cube) {
                console.log('🧊 Final cube state:', {
                    visible: window.threeJsScene.cube.visible,
                    emissive: window.threeJsScene.cube.material?.emissive?.getHexString(),
                    emissiveIntensity: window.threeJsScene.cube.material?.emissiveIntensity,
                    transmission: window.threeJsScene.cube.material?.transmission
                });
            }
            
            if (window.threeJsScene?.renderer) {
                console.log('🎨 Final renderer state:', {
                    clearAlpha: window.threeJsScene.renderer.getClearAlpha(),
                    outputColorSpace: window.threeJsScene.renderer.outputColorSpace
                });
            }
            
            console.log('🚀 Background independence complete!');
            return results.every(Boolean);
        },
        
        // EXTREME VISIBILITY - Maximum lighting and glow
        makeExtremelyVisible: () => {
            console.log('⚡ MAKING CUBE EXTREMELY VISIBLE...');
            
            if (!window.threeJsScene?.cube) return false;
            
            const cube = window.threeJsScene.cube;
            const material = cube.material;
            
            // 1. Maximum self-illumination
            material.emissive = new THREE.Color(0x4488ff); // Bright blue glow
            material.emissiveIntensity = 0.8; // Very bright
            
            // 2. Less transparency
            material.transmission = 0.2; // Much less transparent
            material.opacity = 0.95;
            
            // 3. Bright base color
            material.color.setHex(0x6699ff); // Bright blue
            
            // 4. Maximum clearcoat for rim lighting
            material.clearcoat = 1.0;
            material.clearcoatRoughness = 0.0; // Mirror-like
            
            material.needsUpdate = true;
            
            console.log('⚡ Cube set to maximum visibility');
            return true;
        },
        
        // ...existing code...
    };
    
    console.log('🔧 Simple working fixes available: simpleColorFix.info()');
}

// Add specific fix for scrolly-visuals background
function makeContainerTransparent() {
    console.log('🎨 MAKING CONTAINER COMPLETELY TRANSPARENT...');
    
    const visuals = document.querySelector('.scrolly-visuals');
    if (visuals) {
        console.log('📦 Before - Container background:', getComputedStyle(visuals).background);
        
        // Override the CSS background completely
        visuals.style.backgroundColor = 'transparent !important';
        visuals.style.backgroundImage = 'none !important';
        visuals.style.background = 'transparent !important';
        
        console.log('📦 After - Container background:', getComputedStyle(visuals).background);
        console.log('✅ Container is now completely transparent');
        
        return true;
    }
    
    console.log('❌ Could not find .scrolly-visuals container');
    return false;
}

// Make it globally available
window.makeContainerTransparent = makeContainerTransparent;

// Make fix function globally available
window.fixAllIssues = fixAllIssues;

// Make the exact change that caused the color change but with transparency
function setRendererTransparent() {
    console.log('🎨 SETTING RENDERER TO TRANSPARENT...');
    
    if (window.threeJsScene?.renderer) {
        // This is the exact line that changed the color in fixAllIssues()
        // but modified to be transparent (alpha = 0)
        window.threeJsScene.renderer.setClearColor(0x000000, 0); // Black with 0 alpha = transparent
        console.log('✅ Renderer clear color set to transparent');
        
        // Alternative: use the page color but with transparency
        // window.threeJsScene.renderer.setClearColor(0x112024, 0);
        
        return true;
    }
    
    console.log('❌ Three.js renderer not found');
    return false;
}

// Make it globally available  
window.setRendererTransparent = setRendererTransparent;

// Initialize sophisticated color fix tools
createSophisticatedColorFixes();
createSimpleWorkingFixes();
