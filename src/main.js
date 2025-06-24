// src/main.js

// 1. Import styles. Vite handles the bundling.
import './css/main.css';

// 2. Import necessary libraries and modules.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { MobileCardSystem } from './js/components/mobile/card-mobile-enhanced.js';
import { SectionRingNav } from './js/components/mobile/section-ring-nav.js';
import { ContentLoader } from './js/content/content-loader.js';

gsap.registerPlugin(ScrollTrigger);

// 3. Define the initialization logic.
async function initializePage() {
    // Initialize content loading based on the current page
    const currentPage = window.location.pathname;
    if (currentPage.includes('o-metodo.html')) {
        await ContentLoader.initPage('metodo');
    } else if (currentPage.includes('minha-jornada.html')) {
        await ContentLoader.initPage('jornada');
    } else if (currentPage.includes('recursos.html')) {
        await ContentLoader.initPage('recursos');
    } else if (currentPage.includes('contato.html')) {
        await ContentLoader.initPage('contato');
    } else {
        await ContentLoader.initHomepage();
    }
    
    // Initialize smooth scrolling
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    // Initialize mobile-specific components
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
        new MobileCardSystem().init();
    }
    
    // Initialize section ring navigation (always for testing)
    const sectionRingNav = new SectionRingNav();
    sectionRingNav.init();
    
    // Initialize testimonials carousel only if testimonials section exists
    if (document.querySelector('.testimonials-section')) {
        await import('./js/components/testimonials-carousel.js');
    }

    // Initialize mobile menu functionality
    initializeMobileMenu();

    // Initialize logo navigation behavior
    initializeLogoNavigation();

    // After all setup, reveal the page.
    document.body.classList.add('page-revealed');
}

// Mobile menu functionality
function initializeMobileMenu() {
    const menuOpenButton = document.getElementById('menu-open-button');
    const menuCloseButton = document.getElementById('menu-close-button');
    const menuScreen = document.getElementById('menu-screen');

    if (!menuOpenButton || !menuCloseButton || !menuScreen) {
        return; // Elements not found, skip menu initialization
    }

    // Force menu closed state immediately (prevents flash)
    document.body.classList.remove('menu-open');
    menuScreen.style.cssText = 'opacity: 0; visibility: hidden; pointer-events: none;';
    menuScreen.setAttribute('aria-hidden', 'true');

    // Open menu handler
    menuOpenButton.addEventListener('click', () => {
        document.body.classList.add('menu-open');
        menuScreen.style.cssText = ''; // Clear inline styles, let CSS take over
        menuScreen.setAttribute('aria-hidden', 'false');
        menuOpenButton.setAttribute('aria-expanded', 'true');
        menuCloseButton.setAttribute('aria-expanded', 'true');
    });

    // Close menu handler
    menuCloseButton.addEventListener('click', () => {
        document.body.classList.remove('menu-open');
        menuScreen.style.cssText = 'opacity: 0; visibility: hidden; pointer-events: none;';
        menuScreen.setAttribute('aria-hidden', 'true');
        menuOpenButton.setAttribute('aria-expanded', 'false');
        menuCloseButton.setAttribute('aria-expanded', 'false');
    });

    // Close menu when clicking on menu links
    const menuLinks = menuScreen.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('menu-open');
            menuScreen.style.cssText = 'opacity: 0; visibility: hidden; pointer-events: none;';
            menuScreen.setAttribute('aria-hidden', 'true');
            menuOpenButton.setAttribute('aria-expanded', 'false');
            menuCloseButton.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
            document.body.classList.remove('menu-open');
            menuScreen.style.cssText = 'opacity: 0; visibility: hidden; pointer-events: none;';
            menuScreen.setAttribute('aria-hidden', 'true');
            menuOpenButton.setAttribute('aria-expanded', 'false');
            menuCloseButton.setAttribute('aria-expanded', 'false');
        }
    });
}

// Logo navigation behavior
function initializeLogoNavigation() {
    const logoLinks = document.querySelectorAll('.logo-area, .logo-area-footer');
    const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    
    if (isIndexPage) {
        logoLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }
}

// 4. Execute.
// We run the initialization logic.
// Using `requestAnimationFrame` ensures the first paint has occurred.
requestAnimationFrame(initializePage);