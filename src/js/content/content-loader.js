/**
 * Enhanced Content Loader - Phase 2
 * Compatible with the new PageController system
 * ES6 module version
 * 
 * FEATURES:
 * - Controlled reveal system integration
 * - Professional logging (dev mode only)
 * - Graceful page transitions
 * - Error handling with fallbacks
 * - PageController orchestration support
 * - Backward compatibility mode
 */

const cache = new Map();
const baseUrl = '';

/**
 * Utility: Check if in development mode
 */
function isDevelopmentMode() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname.includes('dev');
}

/**
 * Professional console logging - only essential info
 */
function log(message, data = null) {
    // Completely silent in production
    return;
}

/**
 * Load content from JSON file
 */
async function loadContent(contentPath) {
    if (cache.has(contentPath)) {
        log(`CACHE_HIT: ${contentPath}`);
        return cache.get(contentPath);
    }

    try {
        log(`CONTENT_LOAD: ${contentPath}`);
        const response = await fetch(`${baseUrl}/content/${contentPath}`);
        if (!response.ok) {
            throw new Error(`Failed to load content: ${response.status}`);
        }
        
        const content = await response.json();
        cache.set(contentPath, content);
        log(`CONTENT_READY: ${contentPath}`);
        return content;
    } catch (error) {
        return null;
    }
}

/**
 * Update page meta tags
 */
function updateMeta(meta) {
        if (!meta) return;

        if (meta.title) {
            document.title = meta.title;
        }
        
        if (meta.description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = 'description';
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = meta.description;
        }
    }

/**
 * Safely update element content
 */
function updateElement(selector, content, isHtml = false) {
    const element = document.querySelector(selector);
    if (element && content) {
        if (isHtml) {
            element.innerHTML = content;
        } else {
            element.textContent = content;
        }
    }
}

/**
 * Update link attributes
 */
function updateLink(selector, text, href) {
    const element = document.querySelector(selector);
    if (element) {
        if (text) element.textContent = text;
        if (href) element.href = href;
    }
}

/**
 * Render testimonials section with carousel
 */
function renderTestimonials(testimonials) {
    if (!testimonials || !testimonials.testimonials) return;

    log('TESTIMONIALS_RENDER:', testimonials.testimonials.length);

    // Initialize the testimonials carousel
    if (window.TestimonialsCarousel) {
        log('TESTIMONIALS_CLASS_READY');
        // Find the carousel container
        const carouselContainer = document.querySelector('.testimonials-carousel-container');
        if (carouselContainer) {
            log('TESTIMONIALS_INIT');
            window.testimonialsCarousel = new window.TestimonialsCarousel('testimonials', testimonials.testimonials);
            log('TESTIMONIALS_READY');
        } else {
            // Error case
        }        } else {
            // Fallback: render first testimonial only
            updateElement('#testimonialsTrack', 
                `<div class="testimonial-slide active">
                    <article class="card card--testimonial card--desktop card--mobile" 
                             data-variant="testimonial" 
                             data-mobile-optimized="true"
                             role="article" 
                             aria-label="Testimonial from ${testimonials.testimonials[0].author}"
                             tabindex="0">
                        <div class="card__content">
                            ${testimonials.testimonials[0].content}
                        </div>
                        <div class="card__footer">
                            <p class="card__subtitle">- ${testimonials.testimonials[0].author}</p>
                            <span class="testimonial-badge">${testimonials.testimonials[0].role}</span>
                        </div>
                    </article>
                </div>`, 
                true
            );
        }
}

/**
 * Initialize content loading for homepage
 */
async function initHomepage() {
    try {
        const content = await loadContent('site-content.json');
        if (!content || !content.homepage) return;

        const homepage = content.homepage;

        // Update meta
        updateMeta(homepage.meta);

        // Update hero section
        updateElement('.hero-title', homepage.hero.title);
        updateElement('.hero-subtitle', homepage.hero.subtitle);
        updateElement('.hero-description', homepage.hero.description);
        
        if (homepage.hero.cta.primary) {
            updateLink('.cta-button', homepage.hero.cta.primary.text, homepage.hero.cta.primary.href);
        }
        
        if (homepage.hero.cta.secondary) {
            updateLink('.secondary-button', homepage.hero.cta.secondary.text, homepage.hero.cta.secondary.href);
        }

        // Update testimonials
        updateElement('#testimonials .section-title', homepage.sections.testimonials.title, true);
        renderTestimonials(homepage.sections.testimonials);

        // Update final CTA
        updateElement('.final-cta-title', homepage.sections.finalCta.title);
        updateElement('.reassurance-text', homepage.sections.finalCta.description);
        updateLink('.final-cta-button', homepage.sections.finalCta.cta.text, homepage.sections.finalCta.cta.href);

        log('HOMEPAGE_READY');

    } catch (error) {
        return;
    }
}

/**
 * Initialize content loading for other pages
 */
async function initPage(pageName) {
    try {
        const [siteContent, pageContent] = await Promise.all([
            loadContent('site-content.json'),
            loadContent(`${pageName}-content.json`)
        ]);

        if (pageContent && pageContent.meta) {
            updateMeta(pageContent.meta);
        }

        log(`PAGE_READY: ${pageName}`);

    } catch (error) {
        return;
    }
}

/**
 * Controlled reveal-compatible content loading
 * Returns a promise that resolves when content is fully loaded and DOM is populated
 */
async function loadAndPopulateContent(pageName = null) {
    try {
        // Determine page name if not provided
        if (!pageName) {
            const path = window.location.pathname;
            pageName = path.split('/').pop().replace('.html', '') || 'index';
        }

        log(`CONTENT_ORCHESTRATION: ${pageName}`);

        // Load content based on page type
        let content;
        if (pageName === 'index') {
            content = await loadContent('site-content.json');
            if (content && content.homepage) {
                await populateHomepage(content.homepage);
            }
        } else {
            // Load both site content and page-specific content
            const [siteContent, pageContent] = await Promise.all([
                loadContent('site-content.json'),
                loadContent(`${getContentFileName(pageName)}`)
            ]);

            if (pageContent) {
                await populatePage(pageContent, siteContent);
            }
        }

        log(`CONTENT_POPULATED: ${pageName}`);
        return true;

    } catch (error) {
        return false;
    }
}

/**
 * Get content file name for page
 */
function getContentFileName(pageName) {
    const contentMap = {
        'o-metodo': 'metodo-content.json',
        'minha-jornada': 'jornada-content.json',
        'recursos': 'recursos-content.json',
        'contato': 'contato-content.json'
    };
    return contentMap[pageName] || 'site-content.json';
}

/**
 * Populate homepage with content - returns promise for orchestration
 */
async function populateHomepage(homepage) {
    return new Promise((resolve) => {
        // Update meta
        updateMeta(homepage.meta);

        // Update hero section
        updateElement('.hero-title', homepage.hero.title);
        updateElement('.hero-subtitle', homepage.hero.subtitle);
        updateElement('.hero-description', homepage.hero.description);
        
        if (homepage.hero.cta.primary) {
            updateLink('.cta-button', homepage.hero.cta.primary.text, homepage.hero.cta.primary.href);
        }
        
        if (homepage.hero.cta.secondary) {
            updateLink('.secondary-button', homepage.hero.cta.secondary.text, homepage.hero.cta.secondary.href);
        }

        // Update testimonials
        updateElement('#testimonials .section-title', homepage.sections.testimonials.title, true);
        renderTestimonials(homepage.sections.testimonials);

        // Update final CTA
        updateElement('.final-cta-title', homepage.sections.finalCta.title);
        updateElement('.reassurance-text', homepage.sections.finalCta.description);
        updateLink('.final-cta-button', homepage.sections.finalCta.cta.text, homepage.sections.finalCta.cta.href);

        // Resolve immediately for now - in future could wait for specific elements
        resolve();
    });
}

/**
 * Populate other pages with content - returns promise for orchestration
 */
async function populatePage(pageContent, siteContent) {
    return new Promise((resolve) => {
        if (pageContent && pageContent.meta) {
            updateMeta(pageContent.meta);
        }
        
        // Add any page-specific content population here
        // This can be expanded based on your page structures
        
        resolve();
    });
}

/**
 * Setup graceful page transitions - intercepts navigation and adds fade effects
 */
function setupPageTransitions() {
    // Intercept all internal navigation links
    document.addEventListener('click', function(event) {
        const link = event.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // Only handle internal links (not external or anchors)
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) {
            return;
        }
        
        // Prevent default navigation
        event.preventDefault();
        
        // Fade out current page
        document.body.style.opacity = '0';
        
        // Navigate after fade-out completes
        setTimeout(() => {
            window.location.href = href;
        }, 400); // Matches CSS transition duration
    });
}

/**
 * Reveal the page after all content is loaded and components are initialized
 */
function revealPage() {
    // Add reveal class and set opacity
    document.body.classList.add('page-revealed');
    document.body.classList.remove('content-loading');
    document.body.classList.add('content-loaded');
    document.body.style.opacity = '1';
}

/**
 * Handle page load errors with graceful fallback
 */
function handleLoadError(error) {
    // Show basic error state
    document.body.innerHTML = `
        <div style="
            display: flex; 
            align-items: center; 
            justify-content: center; 
            height: 100vh; 
            font-family: system-ui, sans-serif;
            text-align: center;
            padding: 20px;
        ">
            <div>
                <h1>Loading Error</h1>
                <p>Page could not be loaded. Please refresh or try again.</p>
                <button onclick="window.location.reload()" style="
                    margin-top: 20px;
                    padding: 10px 20px;
                    background: #007acc;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">Refresh Page</button>
            </div>
        </div>
    `;
    
    // Reveal the error message
    document.body.style.opacity = '1';
}

/**
 * Initialize content loading based on environment
 * Works with both standalone mode and PageController orchestration
 */
function initializeContentSystem() {
    // Only initialize once
    if (window.contentSystemInitialized) return;
    window.contentSystemInitialized = true;
    
    // Mark body as loading to prevent scrolling
    document.body.classList.add('content-loading');
    
    // Check if we're in a controlled reveal environment
    if (window.PageController || document.querySelector('script[src*="page-controller"]')) {
        // PageController will handle the orchestration - do nothing
        return;
    }
    
    // Setup page transitions for standalone mode
    setupPageTransitions();
    
    // Auto-initialize content loading
    ContentLoader.autoInit();
}

// Auto-initialize based on current page
function autoInit() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '') || 'index';

    if (page === 'index') {
        initHomepage();
    } else if (page === 'o-metodo') {
        initPage('metodo');
    } else if (page === 'minha-jornada') {
        initPage('jornada');
    } else if (page === 'recursos') {
        initPage('recursos');
    } else if (page === 'contato') {
        initPage('contato');
    }
}

/**
 * Master function for PageController integration
 * Handles the complete content loading and population sequence
 */
async function orchestrateContentLoad() {
    try {
        log('CONTENT_ORCHESTRATION_START');
        
        // Load and populate content for current page
        const success = await loadAndPopulateContent();
        
        if (!success) {
            throw new Error('Content loading failed');
        }
        
        // Wait a minimal time to ensure DOM updates are complete
        await new Promise(resolve => setTimeout(resolve, 50));
        
        log('CONTENT_ORCHESTRATION_COMPLETE');
        return true;
        
    } catch (error) {
        return false;
    }
}

// ES6 Module Exports
export const ContentLoader = {
    loadContent,
    loadAndPopulateContent,
    orchestrateContentLoad,
    setupPageTransitions,
    revealPage,
    handleLoadError,
    initializeContentSystem,
    initHomepage,
    initPage,
    autoInit
};

// For backward compatibility, also attach to window
window.ContentLoader = ContentLoader;

// Initialize the content system when DOM is ready - ONLY if not using PageController
if (!window.PageController && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeContentSystem);
} else if (!window.PageController && document.readyState !== 'loading') {
    setTimeout(initializeContentSystem, 0);
}
