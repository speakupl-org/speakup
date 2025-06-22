// SpeakUp - VITE OPTIMIZED ENTRY POINT

// ANTI-FOUC: Immediate setup
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.remove('content-loading');
    document.body.classList.add('content-loaded');
});

// Import CSS (Gennady-Style consolidated)
import './css/main.css';

// ANTI-FOUC: Ensure content loads smoothly after CSS import
document.documentElement.style.setProperty('--loading-complete', '1');
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.remove('content-loading');
        document.body.classList.add('content-loaded');
    });
} else {
    document.body.classList.remove('content-loading');
    document.body.classList.add('content-loaded');
}

// Import essential libraries
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import Lenis from '@studio-freight/lenis';

// Import your custom modules
import { setup3DScene } from './js/modules/three-module.js';
import { setupScrollytelling } from './js/modules/animation-controller.js';
import { ThreeJSErrorBoundary } from './js/modules/error-boundary.js';
import { MobileCardSystem } from './js/components/mobile/card-mobile-enhanced.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize debug controller (imported as a module now)
import './js/diagnostics/debug-controller-gennady.js';
import './js/diagnostics/quick-background-fix.js';
import './js/diagnostics/scrollytelling-debugger-gennady.js';

// Debug mode flag
const DEBUG_MODE = true;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', async () => {
    try {
        if (window.debug && window.debug.enabled) {
            window.debug.log('APP', 'INIT', 'STARTING');
        }

        // Mobile detection
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
        if (window.debug && window.debug.enabled) {
            window.debug.log('APP.MOBILE', 'READY', { 
                isMobile,
                isTablet: window.innerWidth >= 768 && window.innerWidth <= 1024,
                isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent),
                isAndroid: /Android/i.test(navigator.userAgent),
                isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
                viewportWidth: window.innerWidth,
                devicePixelRatio: window.devicePixelRatio || 1
            });
        }

        // Initialize Lenis smooth scrolling
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            smoothTouch: false,
            touchMultiplier: 2
        });
        
        // Connect Lenis to RAF
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        
        // Setup 3D scene with error handling
        const canvas = document.getElementById('crystal-canvas');
        if (canvas) {
            try {
                // Setup 3D Scene using Three.js module
                const scene3D = await setup3DScene(canvas);
                
                // Initialize scrollytelling animations
                await setupScrollytelling(scene3D);
                
            } catch (error) {
                if (window.debug && window.debug.enabled) {
                    window.debug.error('SCENE', 'INIT', `FAILED [${error.message}]`);
                } else {
                    console.error('Error initializing 3D scene:', error);
                }
            }
        } else if (window.debug && window.debug.enabled) {
            window.debug.warn('SCENE', 'CANVAS', 'NOT_FOUND [crystal-canvas]');
        }
        
        // Initialize mobile components if needed
        if (isMobile) {
            // Initialize enhanced mobile card system
            const cardSystem = new MobileCardSystem();
            cardSystem.init();
        }
        
        // Initialize other components as needed
        initializeComponents();
        
        if (window.debug && window.debug.enabled) {
            window.debug.log('APP', 'INIT', 'COMPLETE');
        }
    } catch (error) {
        if (window.debug && window.debug.enabled) {
            window.debug.error('APP', 'INIT', `FAILED [${error.message}]`);
        } else {
            console.error('Error initializing application:', error);
        }
    }
});

// Initialize other components
function initializeComponents() {
    // Initialize navigation
    const nav = document.querySelector('nav');
    if (nav) {
        nav.classList.add('initialized');
    }
    
    // Initialize contact form if it exists
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (window.debug && window.debug.enabled) {
                window.debug.log('FORM', 'SUBMIT', 'INTERCEPTED');
            }
            // Form submission logic
        });
    }
}

// Export debug tools for console access (will be tree-shaken in production)
if (DEBUG_MODE) {
    window.verifyDebugSetup = function() {
        if (window.debug && window.debug.enabled) {
            window.debug.log('SYSTEM', 'DEBUG_SETUP', 'VERIFYING');
        }
        
        const checks = [
            { name: 'Debug Controller', test: () => !!window.debugController, obj: 'window.debugController' },
            { name: 'Quick Background Fix', test: () => !!window.quickBackgroundFix, obj: 'window.quickBackgroundFix' },
            { name: 'Three Scene Debugger', test: () => !!window.threeSceneDebugger, obj: 'window.threeSceneDebugger' }
        ];
        
        checks.forEach(check => {
            const status = check.test() ? 'AVAILABLE' : 'MISSING';
            if (window.debug && window.debug.enabled) {
                window.debug.log('SYSTEM', 'DEBUG_TOOL', `${check.name}: ${status}`);
            }
        });
    };
}
