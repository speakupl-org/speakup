// js/main.js

// --- 1. MODULE IMPORTS ---
// All imports MUST be at the top level of the file.
import { threeModule } from './modules/three-module.js';
import { createScrollEngine } from './modules/scroll-engine.js';
import { createActors } from './modules/actors.js';
import { setupHandoffAnimation } from './modules/handoff-animation.js';

// --- 2. LAUNCH FUNCTION ---
// We wrap our entire application in a function that we call later.
function runApplication() {

    // --- 3. SETUP & VALIDATION ---
    // Get the globally loaded libraries.
    const { gsap, ScrollTrigger, Flip, MorphSVGPlugin } = window;
    const { THREE } = window;

    // Check if the libraries were actually loaded before we use them.
    if (!gsap || !THREE || !ScrollTrigger || !Flip || !MorphSVGPlugin) {
        console.error("CRITICAL ERROR: One or more essential libraries (GSAP, THREE.js, or GSAP plugins) failed to load. Aborting script.");
        return; // Stop everything.
    }
    
    // Register the GSAP plugins.
    gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin);

    // --- 4. STATE MANAGEMENT ---
    const APP_STATE = {
      scrolly: { progress: 0 }
    };

    // --- 5. INITIALIZATION ---
    function initSite() {
      const masterTrigger = document.querySelector('.scrolly-container');
      if (!masterTrigger) {
        console.log("Scrollytelling section not found. Skipping animations.");
        return; 
      }
      console.log("Scrollytelling section found. Initializing Sovereign System...");
      
      const DOM_ELEMENTS = {
        canvas: document.querySelector('#threejs-canvas'),
        masterTrigger: masterTrigger,
        textPillars: gsap.utils.toArray('.pillar-text-content'),
        handoffPoint: document.querySelector('#handoff-point'),
        summaryPlaceholder: document.querySelector('#summary-placeholder'),
        finalLogoSvg: document.querySelector('#final-logo-svg'),
        morphPath: document.querySelector('#morph-path'),
      };

      if (!DOM_ELEMENTS.finalLogoSvg) {
        console.warn("Warning: The #final-logo-svg element was not found in the HTML. Morph animation will not work.");
      } else {
        gsap.set(DOM_ELEMENTS.finalLogoSvg, { autoAlpha: 0 });
      }

      // --- 6. EXECUTION ---
      const { cube } = threeModule.setup(DOM_ELEMENTS.canvas, THREE);
      createScrollEngine(DOM_ELEMENTS.masterTrigger, (progress) => {
        APP_STATE.scrolly.progress = progress;
      }, gsap);
      createActors(cube, DOM_ELEMENTS.textPillars, APP_STATE, gsap);
      setupHandoffAnimation(DOM_ELEMENTS, cube, { gsap, Flip, MorphSVGPlugin });
    }

    // Call the main initialization function.
    initSite();
}

// --- 7. START ---
// Wait for the entire page to be fully loaded, then run our application.
window.addEventListener('load', runApplication);