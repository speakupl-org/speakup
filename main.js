import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// 1. Import all necessary libraries from node_modules
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import * as THREE from 'three';

// 2. Import your custom modules
import { setup3DScene } from './js/modules/three-module.js';
import { setupScrollytelling } from './js/modules/animation-controller.js';
import { setupHandoffAnimation } from './js/modules/handoff-animation.js';

// 3. Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin);

// 4. Main Application Logic
function runApplication() {
    console.log("Application starting...");
    const canvas = document.querySelector('#threejs-canvas');
    if (!canvas) {
        console.log("Scrollytelling canvas not found on this page. Exiting.");
        return;
    }

    // A. Setup the 3D Scene and get the cube
    const { cube } = setup3DScene(canvas, THREE);

    if (cube) {
        // B. Setup the main scroll-driven animations for the cube and text
        setupScrollytelling(cube, gsap);

        // C. Setup the final handoff animation
        const handoffElements = {
            canvas,
            handoffPoint: document.querySelector('#handoff-point'),
            summaryPlaceholder: document.querySelector('#summary-placeholder'),
            finalLogoSvg: document.querySelector('#final-logo-svg'),
            morphPath: document.querySelector('#morph-path'),
        };
        if (handoffElements.handoffPoint) {
            setupHandoffAnimation(handoffElements, cube, gsap);
        }
    }
}

// 5. Run the app
runApplication();