// SpeakUp - Vite Entry Point

import './css/main.css';

import { PageController, setupPageTransitions } from './js/modules/page-controller.js';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import Lenis from '@studio-freight/lenis';

import { setup3DScene } from './js/modules/three-module.js';
import { setupScrollytelling } from './js/modules/animation-controller.js';
import { ThreeJSErrorBoundary } from './js/modules/error-boundary.js';
import { MobileCardSystem } from './js/components/mobile/card-mobile-enhanced.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const pageController = new PageController();
        setupPageTransitions();
        await pageController.buildAndRevealPage();
        await initializeHeavyComponents();
    } catch (error) {
        document.body.style.opacity = '1';
        document.body.classList.add('emergency-fallback');
        console.error('Initialization failed:', error);
    }
});

async function initializeHeavyComponents() {
    try {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            smoothTouch: false,
            touchMultiplier: 2
        });
        
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        
        const canvas = document.getElementById('crystal-canvas');
        if (canvas) {
            try {
                const scene3D = await setup3DScene(canvas);
                await setupScrollytelling(scene3D);
            } catch (error) {
                console.error('Error initializing 3D scene:', error);
            }
        }
        
        if (isMobile) {
            const cardSystem = new MobileCardSystem();
            cardSystem.init();
        }
        
        initializeComponents();
    } catch (error) {
        console.error('Heavy components initialization failed:', error);
    }
}

function initializeComponents() {
    const nav = document.querySelector('nav');
    if (nav) {
        nav.classList.add('initialized');
    }
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }
}