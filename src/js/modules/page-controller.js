/* ========================================================================
   PAGE CONTROLLER - Controlled Reveal System
   ======================================================================== */

/**
 * Master controller that orchestrates the page loading sequence
 * Implements the controlled reveal pattern to eliminate FOUC
 */

import { ContentLoader } from '../content/content-loader.js';

export class PageController {
    constructor() {
        this.isRevealed = false;
        this.loadStartTime = performance.now();
        this.contentData = null;
    }

    /**
     * Main orchestration function - Controls the entire page load sequence
     */
    async buildAndRevealPage() {
        try {

            // STEP 1: Determine page type and load appropriate content
            const pageData = await this.loadPageContent();
            
            // STEP 2: Populate the DOM with fetched content
            await this.populatePageContent(pageData);
            
            // STEP 3: Initialize all JavaScript components
            await this.initializeComponents();
            
            // STEP 4: Wait for critical resources to be ready
            await this.waitForCriticalResources();
            
            // STEP 5: The Reveal - Show the completed page
            this.revealPage();
            
            const loadTime = performance.now() - this.loadStartTime;

        } catch (error) {
            // Error: Operation failed
            this.handleLoadError(error);
        }
    }

    /**
     * Load content based on current page
     */
    async loadPageContent() {
        const pageName = this.getCurrentPageName();

        try {
            // Load the appropriate content file
            let contentFile = 'site-content.json'; // Default
            
            switch (pageName) {
                case 'o-metodo':
                    contentFile = 'metodo-content.json';
                    break;
                case 'minha-jornada':
                    contentFile = 'jornada-content.json';
                    break;
                case 'recursos':
                    contentFile = 'recursos-content.json';
                    break;
                case 'contato':
                    contentFile = 'contato-content.json';
                    break;
                default:
                    contentFile = 'site-content.json';
            }

            // Use the existing ContentLoader if available, otherwise fetch directly
            if (window.ContentLoader) {
                this.contentData = await window.ContentLoader.loadContent(contentFile);
            } else {
                const response = await fetch(`/content/${contentFile}`);
                if (!response.ok) throw new Error(`Failed to load ${contentFile}`);
                this.contentData = await response.json();
            }

            return this.contentData;
        } catch (error) {
            console.warn(`⚠️ Could not load specific content for ${pageName}, using fallback`);
            return { site: { title: 'Speak Up' } }; // Minimal fallback
        }
    }

    /**
     * Populate DOM elements with loaded content
     */
    async populatePageContent(pageData) {
        if (!pageData) return;


        // Update page title
        if (pageData.meta?.title) {
            document.title = pageData.meta.title;
        } else if (pageData.site?.title) {
            document.title = pageData.site.title;
        }

        // Update meta description
        if (pageData.meta?.description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = 'description';
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = pageData.meta.description;
        }

        // Populate dynamic content elements (page-specific)
        this.populatePageSpecificContent(pageData);
    }

    /**
     * Populate page-specific content elements
     */
    populatePageSpecificContent(pageData) {
        // Homepage content
        if (pageData.homepage) {
            const hero = pageData.homepage.hero;
            if (hero) {
                const heroTitle = document.querySelector('[data-content="hero-title"]');
                const heroSubtitle = document.querySelector('[data-content="hero-subtitle"]');
                
                if (heroTitle && hero.title) heroTitle.textContent = hero.title;
                if (heroSubtitle && hero.subtitle) heroSubtitle.textContent = hero.subtitle;
            }
        }

        // Method page content
        if (pageData.method) {
            const methodTitle = document.querySelector('[data-content="method-title"]');
            const methodDescription = document.querySelector('[data-content="method-description"]');
            
            if (methodTitle && pageData.method.title) methodTitle.textContent = pageData.method.title;
            if (methodDescription && pageData.method.description) methodDescription.textContent = pageData.method.description;
        }

        // Journey page content
        if (pageData.journey) {
            const journeyTitle = document.querySelector('[data-content="journey-title"]');
            if (journeyTitle && pageData.journey.title) journeyTitle.textContent = pageData.journey.title;
        }

        // Resources page content
        if (pageData.resources) {
            const resourcesTitle = document.querySelector('[data-content="resources-title"]');
            if (resourcesTitle && pageData.resources.title) resourcesTitle.textContent = pageData.resources.title;
        }

        // Contact page content
        if (pageData.contact) {
            const contactTitle = document.querySelector('[data-content="contact-title"]');
            if (contactTitle && pageData.contact.title) contactTitle.textContent = pageData.contact.title;
        }
    }

    /**
     * Initialize all page components
     */
    async initializeComponents() {
        // Debug: Operation completed

        // Initialize navigation
        this.initializeNavigation();

        // Initialize forms
        this.initializeForms();

        // Initialize any interactive elements
        this.initializeInteractiveElements();

        // Give components a moment to settle
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    /**
     * Initialize navigation components
     */
    initializeNavigation() {
        const nav = document.querySelector('nav');
        const menuToggle = document.querySelector('.menu-toggle-button');
        
        if (nav) nav.classList.add('initialized');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                // Handle mobile menu toggle
                document.body.classList.toggle('menu-open');
            });
        }
    }

    /**
     * Initialize form components
     */
    initializeForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Handle form submission
            });
        });
    }

    /**
     * Initialize interactive elements
     */
    initializeInteractiveElements() {
        // Initialize any carousels, modals, etc.
        const interactiveElements = document.querySelectorAll('[data-interactive]');
        interactiveElements.forEach(el => {
            el.classList.add('interactive-ready');
        });
    }

    /**
     * Wait for critical resources to be ready
     */
    async waitForCriticalResources() {

        // Wait for fonts to load
        if (document.fonts) {
            await document.fonts.ready;
        }

        // Wait for critical images to load
        const criticalImages = document.querySelectorAll('img[data-critical]');
        if (criticalImages.length > 0) {
            await Promise.all(
                Array.from(criticalImages).map(img => {
                    if (img.complete) return Promise.resolve();
                    return new Promise(resolve => {
                        img.onload = resolve;
                        img.onerror = resolve; // Don't fail on image errors
                    });
                })
            );
        }

        // Minimum load time to prevent flashing (feel more intentional)
        const elapsed = performance.now() - this.loadStartTime;
        const minLoadTime = 300; // Minimum 300ms
        if (elapsed < minLoadTime) {
            await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsed));
        }
    }

    /**
     * Reveal the page with elegant fade-in
     */
    revealPage() {
        if (this.isRevealed) return;


        document.body.classList.remove('content-loading');
        document.body.classList.add('content-loaded', 'page-revealed');
        
        this.isRevealed = true;

        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('pageRevealed', {
            detail: { contentData: this.contentData }
        }));
    }

    /**
     * Handle loading errors gracefully
     */
    handleLoadError(error) {
        console.error('💥 Page load failed:', error);

        // Show a graceful error message
        document.body.innerHTML = `
            <div style="
                display: flex; 
                align-items: center; 
                justify-content: center; 
                height: 100vh; 
                font-family: Inter, sans-serif;
                text-align: center;
                padding: 20px;
            ">
                <div>
                    <h1 style="color: #333; margin-bottom: 20px;">Oops!</h1>
                    <p style="color: #666; margin-bottom: 20px;">Algo deu errado ao carregar a página.</p>
                    <button onclick="window.location.reload()" style="
                        background: #007bff; 
                        color: white; 
                        border: none; 
                        padding: 10px 20px; 
                        border-radius: 5px; 
                        cursor: pointer;
                    ">Tentar Novamente</button>
                </div>
            </div>
        `;

        // Still reveal the page (with error content)
        document.body.style.opacity = '1';
    }

    /**
     * Get current page name from URL
     */
    getCurrentPageName() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        return filename.replace('.html', '') || 'index';
    }
}

/**
 * Setup graceful page transitions for navigation
 */
export function setupPageTransitions() {

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        
        // Only handle internal navigation links
        if (!link || 
            link.hostname !== window.location.hostname ||
            link.getAttribute('href').startsWith('#') ||
            link.hasAttribute('download') ||
            link.target === '_blank') {
            return;
        }

        e.preventDefault();
        

        // Fade out current page
        document.body.style.opacity = '0';
        
        // Navigate after fade completes
        setTimeout(() => {
            window.location.href = link.href;
        }, 400); // Match CSS transition duration
    });
}
