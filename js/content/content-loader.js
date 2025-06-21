/**
 * Simple Content Loader - Phase 2
 * Non-module version for direct browser use
 */

window.ContentLoader = (function() {
    'use strict';

    const cache = new Map();
    const baseUrl = '';

    /**
     * Load content from JSON file
     */
    async function loadContent(contentPath) {
        if (cache.has(contentPath)) {
            return cache.get(contentPath);
        }

        try {
            const response = await fetch(`${baseUrl}/content/${contentPath}`);
            if (!response.ok) {
                throw new Error(`Failed to load content: ${response.status}`);
            }
            
            const content = await response.json();
            cache.set(contentPath, content);
            return content;
        } catch (error) {
            console.error('Error loading content:', error);
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

        console.log('TESTIMONIALS.RENDER_START:', testimonials.testimonials.length, 'items found');

        // Initialize the testimonials carousel
        if (window.TestimonialsCarousel) {
            console.log('TESTIMONIALS.CLASS_AVAILABLE');
            // Find the carousel container
            const carouselContainer = document.querySelector('.testimonials-carousel-container');
            if (carouselContainer) {
                console.log('TESTIMONIALS.CONTAINER_FOUND, initializing...');
                window.testimonialsCarousel = new window.TestimonialsCarousel('testimonials', testimonials.testimonials);
                console.log('TESTIMONIALS.INIT_COMPLETE');
            } else {
                console.error('TESTIMONIALS.CONTAINER_FAIL: carousel container not found in DOM');
            }
        } else {
            console.warn('TestimonialsCarousel not loaded, falling back to static display');
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

            console.log('CONTENT.HOMEPAGE_LOADED');

        } catch (error) {
            console.error('CONTENT.HOMEPAGE_LOAD_ERROR:', error);
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

            console.log(`✅ ${pageName} content loaded successfully`);

        } catch (error) {
            console.error(`❌ Failed to load ${pageName} content:`, error);
        }
    }

    /**
     * Auto-initialize based on current page
     */
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

    // Public API
    return {
        loadContent,
        initHomepage,
        initPage,
        autoInit
    };

})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.ContentLoader.autoInit);
} else {
    window.ContentLoader.autoInit();
}
