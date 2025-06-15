// js/main.js find its variables. It only knows about the things it explicitly `import`s.
const gsap = window.gsap;
const THREE = window.THREE;
const { ScrollTrigger, Flip, MorphSVGPlugin } = window; // Also get the plugins

// ADD THIS LINE TO REGISTER THE PLUGINS:
gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugi
                    
// Get the globally loaded libraries so our module can see them.
import { threeModule } from './modules/three-module.js';
import { createScrollEngine } from './modules/scroll-engine.js';
import { createActors } from './modules/actors.js';
import { setupHandoffAnimation } from './modules/handoff-animation.js';


// This is the one place we define the shared "state" of our app
const APP_STATE = {
  scrolly: { progress: 0 }
};

function initSite() {
  // Check if we are on a page that actually has the scrollytelling animation
  const masterTrigger = document.querySelector('.scrolly-container');
  if (!masterTrigger) {
    console.log("Scrollytelling section not found on this page. Skipping animation setup.");
    return; // Exit if not on the right page
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

// ADD THIS LINE:
gsap.set(DOM_ELEMENTS.finalLogoSvg, { autoAlpha: 0 }); // Hide the SVG on load
  
const { cube } = threeModule.setup(DOM_ELEMENTS.canvas);
  
  createScrollEngine(DOM_ELEMENTS.masterTrigger, (progress) => {
    APP_STATE.scrolly.progress = progress;
  });
  
  createActors(cube, DOM_ELEMENTS.textPillars, APP_STATE);
  
  setupHandoffAnimation(DOM_ELEMENTS, cube);
}

window.addEventListener('load', initSite);
