// js/main.js

// --- SETUP PHASE ---
// Get the globally loaded libraries so our module can see them.
const gsap = window.gsap;
const THREE = window.THREE;
const { ScrollTrigger, Flip, MorphSVGPlugin } = window;

// Register the GSAP plugins so they can be used. This is CRITICAL.
gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin);

// Import our custom, separated modules.
import { threeModule } from './modules/three-module.js';
import { createScrollEngine } from './modules/scroll-engine.js';
import { createActors } from './modules/actors.js';
import { setupHandoffAnimation } from './modules/handoff-animation.js';

// --- STATE MANAGEMENT ---
// A single, simple object to hold the shared state of our animation.
const APP_STATE = {
  scrolly: { progress: 0 }
};

// --- INITIALIZATION ---
// The main function that starts everything.
function initSite() {
  // First, check if the necessary container exists on this page.
  const masterTrigger = document.querySelector('.scrolly-container');
  if (!masterTrigger) {
    console.log("Scrollytelling section not found. Skipping animations.");
    return; 
  }
  console.log("Scrollytelling section found. Initializing Sovereign System...");
  
  // Collect all necessary DOM elements into one object for clarity.
  const DOM_ELEMENTS = {
    canvas: document.querySelector('#threejs-canvas'),
    masterTrigger: masterTrigger,
    textPillars: gsap.utils.toArray('.pillar-text-content'),
    handoffPoint: document.querySelector('#handoff-point'),
    summaryPlaceholder: document.querySelector('#summary-placeholder'),
    finalLogoSvg: document.querySelector('#final-logo-svg'),
    morphPath: document.querySelector('#morph-path'),
  };
  
  // Hide the SVG placeholder on load.
  gsap.set(DOM_ELEMENTS.finalLogoSvg, { autoAlpha: 0 });

  // --- EXECUTION ---
  // Start the various parts of our system.
  const { cube } = threeModule.setup(DOM_ELEMENTS.canvas);
createScrollEngine(DOM_ELEMENTS.masterTrigger, (progress) => {
  APP_STATE.scrolly.progress = progress;
}, gsap);
  createActors(cube, DOM_ELEMENTS.textPillars, APP_STATE, gsap);
  setupHandoffAnimation(DOM_ELEMENTS, cube);
}

// ... the rest of your initSite function ...

// This function will wait until the entire page, including all scripts, is truly ready.
async function run() {
  // Wait for the next "tick" of the browser's event loop to ensure everything is settled.
  await new Promise(resolve => setTimeout(resolve, 0));
  initSite();
}

// Start the process.
run();
