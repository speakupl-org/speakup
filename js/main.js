// js/main.js

// --- SETUP PHASE ---
const { gsap, ScrollTrigger, Flip, MorphSVGPlugin } = window;
const { THREE } = window;
gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin);

// --- MODULE IMPORTS ---
import { threeModule } from './modules/three-module.js';
import { createScrollEngine } from './modules/scroll-engine.js';
import { createActors } from './modules/actors.js';
import { setupHandoffAnimation } from './modules/handoff-animation.js';

// --- STATE MANAGEMENT ---
const APP_STATE = {
  scrolly: { progress: 0 }
};

// --- INITIALIZATION ---
function initSite() {
  const masterTrigger = document.querySelector('.scrolly-container');
  if (!masterTrigger) {
    console.log("Scrollytelling section not found on this page. Skipping animations.");
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

  // Check if the critical SVG element exists before trying to use it.
  if (!DOM_ELEMENTS.finalLogoSvg) {
    console.error("CRITICAL ERROR: The #final-logo-svg element was not found in the HTML.");
    return; // Stop execution if the SVG is missing.
  }

  // Hide the SVG placeholder on load.
  gsap.set(DOM_ELEMENTS.finalLogoSvg, { autoAlpha: 0 });

  // --- EXECUTION ---
  const { cube } = threeModule.setup(DOM_ELEMENTS.canvas, THREE);
  
  createScrollEngine(DOM_ELEMENTS.masterTrigger, (progress) => {
    APP_STATE.scrolly.progress = progress;
  }, gsap);

  createActors(cube, DOM_ELEMENTS.textPillars, APP_STATE, gsap);
  
  // Pass the required libraries to the handoff function
  setupHandoffAnimation(DOM_ELEMENTS, cube, { gsap, Flip, MorphSVGPlugin });
}

// Use the classic and reliable 'load' event listener.
window.addEventListener('load', initSite);
