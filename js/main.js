// js/main.js

// --- 1. SETUP PHASE ---
// Get all necessary libraries from the global window object.
const { gsap, ScrollTrigger, Flip, MorphSVGPlugin } = window;
const { THREE } = window;

// Check if the core libraries loaded. If not, stop everything.
if (!gsap || !THREE) {
    console.error("CRITICAL ERROR: GSAP or THREE.js failed to load. Aborting script.");
} else {
    // Register the GSAP plugins so they can be used.
    gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin);

    // --- 2. MODULE IMPORTS ---
    import { threeModule } from './modules/three-module.js';
    import { createScrollEngine } from './modules/scroll-engine.js';
    import { createActors } from './modules/actors.js';
    import { setupHandoffAnimation } from './modules/handoff-animation.js';

    // --- 3. STATE MANAGEMENT ---
    const APP_STATE = {
      scrolly: { progress: 0 }
    };

    // --- 4. INITIALIZATION ---
    function initSite() {
      // Find the main trigger element for the animation.
      const masterTrigger = document.querySelector('.scrolly-container');
      if (!masterTrigger) {
        // If it's not on this page, do nothing.
        console.log("Scrollytelling section not found on this page. Skipping animations.");
        return; 
      }
      console.log("Scrollytelling section found. Initializing Sovereign System...");
      
      // Collect all necessary DOM elements.
      const DOM_ELEMENTS = {
        canvas: document.querySelector('#threejs-canvas'),
        masterTrigger: masterTrigger,
        textPillars: gsap.utils.toArray('.pillar-text-content'),
        handoffPoint: document.querySelector('#handoff-point'),
        summaryPlaceholder: document.querySelector('#summary-placeholder'),
        finalLogoSvg: document.querySelector('#final-logo-svg'),
        morphPath: document.querySelector('#morph-path'),
      };

      // Hide the final SVG on page load.
      if (DOM_ELEMENTS.finalLogoSvg) {
        gsap.set(DOM_ELEMENTS.finalLogoSvg, { autoAlpha: 0 });
      } else {
          console.warn("Could not find #final-logo-svg to hide.");
      }

      // --- 5. EXECUTION (Passing dependencies) ---
      // Start all the systems and give them the tools they need.
      
      // Pass THREE to the three.js module.
      const { cube } = threeModule.setup(DOM_ELEMENTS.canvas, THREE);
      
      // Pass gsap to the scroll engine module.
      createScrollEngine(DOM_ELEMENTS.masterTrigger, (progress) => {
        APP_STATE.scrolly.progress = progress;
      }, gsap);
      
      // Pass gsap to the actors module.
      createActors(cube, DOM_ELEMENTS.textPillars, APP_STATE, gsap);
      
      // Pass the necessary GSAP plugins to the handoff animation module.
      setupHandoffAnimation(DOM_ELEMENTS, cube, { gsap, Flip, MorphSVGPlugin });
    }

    // --- 6. LAUNCH ---
    // Wait for the entire page to load before starting the animations.
    window.addEventListener('load', initSite);
}