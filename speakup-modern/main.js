// /main.js

// 1. Import all necessary libraries
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

// 2. Import your custom modules
import { setup3DScene } from './js/modules/three-module.js';
import { setupScrollytelling } from './js/modules/animation-controller.js';

// 3. Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// 4. Main Application Logic
function runApplication() {
    console.log("Application starting...");

    // --- Part 1: Global Lenis Smooth Scroll Setup ---
    if (typeof Lenis === 'undefined') {
        console.warn("Lenis library not found. Using native scroll.");
    } else {
        const lenis = new Lenis();
        // Sync Lenis with GSAP's ticker
        gsap.ticker.add(time => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
        // Proxy ScrollTrigger to use Lenis
        ScrollTrigger.scrollerProxy(document.body, {
            scrollTop(value) {
                if (arguments.length) lenis.scrollTo(value);
                return lenis.scroll;
            },
            getBoundingClientRect() {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            }
        });
        // Update ScrollTrigger on Lenis scroll
        lenis.on('scroll', ScrollTrigger.update);
        console.log("Global smooth scroll initialized.");
    }

    // --- Part 2: Page-Specific Scrollytelling Setup ---
    const wrapper = document.querySelector('.scrolly-experience-wrapper');
    if (!wrapper) {
        console.log("Scrollytelling components not found. Skipping animation.");
        return;
    }
    console.log("Scrollytelling wrapper found. Initializing... ");

    // Collect DOM elements
    const canvasEl = document.querySelector('#threejs-canvas');
    const textPillars = gsap.utils.toArray('.pillar-text-content');
    if (!canvasEl) {
        console.error("#threejs-canvas not found.");
        return;
    }

    // Setup 3D scene and retrieve cube
    const { cube } = setup3DScene(canvasEl, THREE);
    if (!cube) {
        console.error("3D Scene setup failed to return a cube object.");
        return;
    }

    // Initialize the scrollytelling animation
    setupScrollytelling(cube);
}

// 5. START
// We use DOMContentLoaded as it's generally faster, but the logic inside
// our controller should be robust enough to handle it.
window.addEventListener('load', runApplication);
