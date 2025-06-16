// js/main.js

// --- 1. MODERN IMPORTS ---
// In a Vite project, we import libraries directly from node_modules.
import './css/style.css'; 
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

// We will handle the premium MorphSVG plugin separately if needed.

// Import our own custom modules using the CORRECT file paths.
import { threeModule } from './js/modules/three-module.js';
import { setupAnimationController } from './js/modules/animation-controller.js';
import { setupHandoffAnimation } from './js/modules/handoff-animation.js';

// --- 2. WRAPPER FUNCTION ---
// It's good practice to wrap the main execution in a function.
function runApplication() {
    
    // --- 3. SETUP & VALIDATION ---
    // Register the GSAP plugins so they are available to use. This is critical.
    gsap.registerPlugin(ScrollTrigger, Flip);

    // Check if the page has the scrollytelling animation container.
    // This allows the script to run on all pages without breaking.
    if (!document.querySelector('.scrolly-container')) {
        console.log("Scrollytelling section not found on this page. Skipping animations.");
        return; // Exit gracefully if the animation isn't needed.
    }

    console.log("Scrollytelling section found. Initializing animations...");

    // --- 4. DOM ELEMENT SELECTION ---
    // Collect all the HTML elements our animation needs.
    const DOM_ELEMENTS = {
        canvas: document.querySelector('#threejs-canvas'),
        textPillars: gsap.utils.toArray('.pillar-text-content'),
        handoffPoint: document.querySelector('#handoff-point'),
        summaryPlaceholder: document.querySelector('#summary-placeholder'),
        finalLogoSvg: document.querySelector('#final-logo-svg'),
        morphPath: document.querySelector('#morph-path'),
    };

    // --- 5. EXECUTION ---
    // Now we call our modules to set up their parts of the experience.
    // Since our modules will also use modern 'import', we no longer need to pass libraries as arguments.
    
    const { cube } = threeModule.setup(DOM_ELEMENTS.canvas);

    // The animation controller will handle the cube and text animations.
    setupAnimationController(cube, DOM_ELEMENTS.textPillars);
    
    // The handoff animation handles the final morph.
    // Note: This may throw an error if the premium MorphSVGPlugin is not set up correctly for Vite. We can fix that next.
    setupHandoffAnimation(DOM_ELEMENTS, cube);
}

// --- 6. START ---
// Wait for the entire page to be fully loaded, then run our application.
window.addEventListener('load', runApplication);