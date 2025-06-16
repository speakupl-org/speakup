// main.js

// --- 1. MODERN IMPORTS ---
// This imports the libraries directly from the node_modules folder.
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

// Import your own custom modules from their correct new paths
import { threeModule } from './js/modules/three-module.js';
import { createScrollEngine } from './js/modules/scroll-engine.js';
// We are not using actors.js anymore
import { setupHandoffAnimation } from './js/modules/handoff-animation.js';

// --- 2. SETUP & EXECUTION ---
// Register the GSAP plugins.
gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin);

console.log("Modern modules loaded successfully.");

// A function to run our application
function runApplication() {
    // Find the main trigger element for the animation.
    const scrollyContainer = document.querySelector('.scrolly-container');

    // Only run the animation setup if the scrolly-container exists on this page.
    if (scrollyContainer) {
        console.log("Scrollytelling section found, initializing animations.");

        const canvas = document.querySelector('#threejs-canvas');
        if (canvas) {
            const { cube } = threeModule.setup(canvas, THREE);
            createScrollEngine(cube, gsap);

            // Set up the handoff animation
            const DOM_ELEMENTS = {
                canvas: canvas,
                handoffPoint: document.querySelector('#handoff-point'),
                summaryPlaceholder: document.querySelector('#summary-placeholder'),
                finalLogoSvg: document.querySelector('#final-logo-svg'),
                morphPath: document.querySelector('#morph-path'),
            };

            if (DOM_ELEMENTS.finalLogoSvg) {
                gsap.set(DOM_ELEMENTS.finalLogoSvg, { autoAlpha: 0 });
                setupHandoffAnimation(DOM_ELEMENTS, cube, { gsap, Flip, MorphSVGPlugin, ScrollTrigger });
            }
        }
    }
}

// Run the application once the document is ready
runApplication();