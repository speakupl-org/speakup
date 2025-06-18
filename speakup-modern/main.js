// /main.js (Professional Hybrid Architecture)

// GSAP loaded globally via script tags (optimized for Cloudflare Pages)
// THREE.js loaded as ES modules for better tree-shaking

// Import your custom modules
import { setup3DScene } from './js/modules/three-module.js';
import { setupScrollytelling } from './js/modules/animation-controller.js';

// Register GSAP plugins (loaded globally)
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    console.log("✅ GSAP loaded globally and registered");
} else {
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

        // Connect Lenis to GSAP's ticker for perfectly synchronized timing
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

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
        console.log("🔄 Loading 3D assets...");
        
        // 1. Await the 3D Scene: This pauses execution until all assets are loaded.
        const scene3D = setup3DScene(DOM.canvas);

        console.log("✅ All assets loaded. Starting reveal sequence...");

        // 2. The Reveal Animation: Now that the 3D scene is 100% ready.
        const tl = gsap.timeline();
        tl.to(DOM.placeholder, { autoAlpha: 0, duration: 0.5 })
          .to(DOM.canvas, { autoAlpha: 1, duration: 0.5 }, "-=0.25") // Overlap the fades
          .from(scene3D.cube.scale, { 
              x: 0, y: 0, z: 0, 
              duration: 1.0, 
              ease: 'back.out(1.2)' 
          }, "-=0.2"); // Start cube entrance slightly before canvas is fully visible

        // 3. Initialize Animations: Only set up ScrollTrigger after the scene is visible.
        if (scene3D && scene3D.cube) {
            setupScrollytelling(scene3D.cube, scene3D); // Pass full scene3D object
            console.log("✅ Premium 3D experience with professional loading complete");
        }

    } catch (error) {
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
