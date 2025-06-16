// js/main.js

// --- 1. MODERN IMPORTS ---
// Libraries are imported directly from node_modules.
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

// Your custom modules, with the full correct paths from the root.
// All custom modules live inside 'js/modules/'.
import { threeModule } from './js/modules/three-module.js';
import { setupScrollytelling } from './js/modules/animation-controller.js';
import { setupHandoffAnimation } from './js/modules/handoff-animation.js';

// --- 2. SETUP & EXECUTION ---
// Register GSAP plugins immediately after import.
gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin);

console.log("Modern modules loaded. Initializing application...");

function runApplication() {
    const scrollyContainer = document.querySelector('.scrolly-container');

    // Only run the animation on pages that have the scrolly-container.
    if (scrollyContainer) {
        console.log("Scrollytelling section found, setting up scene.");

        const DOM_ELEMENTS = {
            canvas: document.querySelector('#threejs-canvas'),
            textPillars: gsap.utils.toArray('.pillar-text-content'),
            handoffPoint: document.querySelector('#handoff-point'),
            summaryPlaceholder: document.querySelector('#summary-placeholder'),
            finalLogoSvg: document.querySelector('#final-logo-svg'),
            morphPath: document.querySelector('#morph-path'),
        };

        const { cube } = threeModule.setup(DOM_ELEMENTS.canvas);

        if (cube) {
            setupScrollytelling(cube, DOM_ELEMENTS.textPillars);
            setupHandoffAnimation(DOM_ELEMENTS, cube);

            // Hide the logo initially. GSAP will reveal it.
            if (DOM_ELEMENTS.finalLogoSvg) {
                gsap.set(DOM_ELEMENTS.finalLogoSvg, { autoAlpha: 0 });
            }
        }
    }
}

// Wait for the DOM to be fully parsed before running the application.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runApplication);
} else {
    runApplication();
}