/**
 * Content Management System - Phase 2
 * Handles loading and rendering structured content from JSON files
 */

class ContentManager {
    constructor() {
        this.cache = new Map();
        this.baseUrl = '';
    }

    /**
     * Load content from JSON file
     * @param {string} contentPath - Path to the content JSON file
     * @returns {Promise<Object>} - Content object
     */
    async loadContent(contentPath) {
        if (this.cache.has(contentPath)) {
            return this.cache.get(contentPath);
        }

        try {
            const response = await fetch(`${this.baseUrl}/content/${contentPath}`);
            if (!response.ok) {
                throw new Error(`Failed to load content: ${response.status}`);
            }
            
            const content = await response.json();
            this.cache.set(contentPath, content);
            return content;
        } catch (error) {
            console.error('Error loading content:', error);
            return null;
        }
    }

    /**
     * Render homepage content
     * @param {Object} content - Homepage content object
     */
    renderHomepage(content) {
        if (!content || !content.homepage) return;

        const homepage = content.homepage;

        // Update meta tags
        this.updateMeta(homepage.meta);

        // Render hero section
        this.renderHero(homepage.hero);

        // Render problem section
        this.renderProblemSection(homepage.sections.problem);

        // Render solution section  
        this.renderSolutionSection(homepage.sections.solution);

        // Render about section
        this.renderAboutSection(homepage.sections.about);

        // Render testimonials
        this.renderTestimonials(homepage.sections.testimonials);

        // Render final CTA
        this.renderFinalCta(homepage.sections.finalCta);

        // Update navigation
        this.updateNavigation(content.navigation);

        // Update footer
        this.updateFooter(content.footer);
    }

    /**
     * Update page meta tags
     * @param {Object} meta - Meta information
     */
    updateMeta(meta) {
        if (meta.title) {
            document.title = meta.title;
        }
        
        if (meta.description) {
            let metaDesc = document.querySelector('meta[name=\"description\"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = 'description';
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = meta.description;
        }
    }

    /**
     * Render hero section
     * @param {Object} hero - Hero content
     */
    renderHero(hero) {
        const heroSection = document.querySelector('#hero');
        if (!heroSection) return;

        // Update title
        const titleEl = heroSection.querySelector('.hero-title');
        if (titleEl) titleEl.textContent = hero.title;

        // Update subtitle
        const subtitleEl = heroSection.querySelector('.hero-subtitle');
        if (subtitleEl) subtitleEl.textContent = hero.subtitle;

        // Update description
        const descEl = heroSection.querySelector('.hero-description');
        if (descEl) descEl.textContent = hero.description;

        // Update CTAs
        if (hero.cta.primary) {
            const primaryCta = heroSection.querySelector('.cta-button');
            if (primaryCta) {
                primaryCta.textContent = hero.cta.primary.text;
                primaryCta.href = hero.cta.primary.href;
            }
        }

        if (hero.cta.secondary) {
            const secondaryCta = heroSection.querySelector('.secondary-button');
            if (secondaryCta) {
                secondaryCta.textContent = hero.cta.secondary.text;
                secondaryCta.href = hero.cta.secondary.href;
            }
        }
    }

    /**
     * Render problem section
     * @param {Object} problem - Problem section content
     */
    renderProblemSection(problem) {
        const section = document.querySelector('#problem-section');
        if (!section) return;

        // Update title
        const titleEl = section.querySelector('.section-title');
        if (titleEl) titleEl.textContent = problem.title;

        // Update subtitle
        const subtitleEl = section.querySelector('.section-subtitle');
        if (subtitleEl) subtitleEl.textContent = problem.subtitle;

        // Update problem points
        const pointsContainer = section.querySelector('.problem-grid');
        if (pointsContainer && problem.points) {
            pointsContainer.innerHTML = problem.points.map(point => `
                <div class="problem-item">
                    <img src="${point.icon}" alt="" class="problem-icon">
                    <h3 class="problem-title">${point.title}</h3>
                    <p>${point.description}</p>
                </div>
            `).join('');
        }
    }

    /**
     * Render solution section
     * @param {Object} solution - Solution section content
     */
    renderSolutionSection(solution) {
        const section = document.querySelector('#solution-section');
        if (!section) return;

        // Update title and subtitle
        const titleEl = section.querySelector('.section-title');
        if (titleEl) titleEl.textContent = solution.title;

        const subtitleEl = section.querySelector('.section-subtitle');
        if (subtitleEl) subtitleEl.textContent = solution.subtitle;

        // Update shifts
        const shiftsContainer = section.querySelector('.shifts-grid');
        if (shiftsContainer && solution.shifts) {
            shiftsContainer.innerHTML = solution.shifts.map(shift => `
                <div class="shift-item">
                    <img src="${shift.icon}" alt="" class="shift-icon">
                    <h3 class="shift-title">${shift.title}</h3>
                    <p>${shift.description}</p>
                </div>
            `).join('');
        }

        // Update CTA
        if (solution.cta) {
            const ctaEl = section.querySelector('.secondary-button');
            if (ctaEl) {
                ctaEl.textContent = solution.cta.text;
                ctaEl.href = solution.cta.href;
            }
        }
    }

    /**
     * Render about section
     * @param {Object} about - About section content
     */
    renderAboutSection(about) {
        const section = document.querySelector('#the-guide');
        if (!section) return;

        // Update photo
        const photoEl = section.querySelector('.teacher-face-svg');
        if (photoEl) {
            photoEl.src = about.photo;
            photoEl.alt = about.photoAlt;
        }

        // Update quote
        const quoteEl = section.querySelector('blockquote');
        if (quoteEl) quoteEl.textContent = `"${about.quote}"`;

        // Update attribution
        const attrEl = section.querySelector('.bio-link-area');
        if (attrEl) {
            attrEl.innerHTML = `
                - ${about.attribution} <br>
                <a href="${about.cta.href}" class="link-subtle">${about.cta.text}</a>
            `;
        }
    }

    /**
     * Render testimonials section
     * @param {Object} testimonials - Testimonials content
     */
    renderTestimonials(testimonials) {
        const section = document.querySelector('#testimonials');
        if (!section) return;

        // Update title
        const titleEl = section.querySelector('.section-title');
        if (titleEl) titleEl.innerHTML = testimonials.title;

        // Update testimonials grid
        const gridEl = section.querySelector('.testimonial-grid');
        if (gridEl && testimonials.testimonials) {
            gridEl.innerHTML = testimonials.testimonials.map((testimonial, index) => `
                <article class="card card--testimonial card--desktop card--mobile" 
                         data-variant="testimonial" 
                         data-mobile-optimized="true"
                         role="article" 
                         aria-label="Testimonial from ${testimonial.author}"
                         tabindex="0">
                    <div class="card__content">
                        ${testimonial.content}
                    </div>
                    <div class="card__footer">
                        <p class="card__subtitle">- ${testimonial.author}</p>
                        <span class="testimonial-badge">${testimonial.role}</span>
                    </div>
                </article>
            `).join('');
        }
    }

    /**
     * Render final CTA section
     * @param {Object} finalCta - Final CTA content
     */
    renderFinalCta(finalCta) {
        const section = document.querySelector('#final-cta');
        if (!section) return;

        // Update title
        const titleEl = section.querySelector('.final-cta-title');
        if (titleEl) titleEl.textContent = finalCta.title;

        // Update description
        const descEl = section.querySelector('.reassurance-text');
        if (descEl) descEl.textContent = finalCta.description;

        // Update CTA button
        const ctaEl = section.querySelector('.final-cta-button');
        if (ctaEl) {
            ctaEl.textContent = finalCta.cta.text;
            ctaEl.href = finalCta.cta.href;
        }
    }

    /**
     * Update navigation
     * @param {Object} navigation - Navigation content
     */
    updateNavigation(navigation) {
        const navEl = document.querySelector('.desktop-nav ul');
        if (navEl && navigation.main) {
            navEl.innerHTML = navigation.main.map(item => `
                <li><a href="${item.href}" ${item.active ? 'class="active"' : ''}>${item.label}</a></li>
            `).join('');
        }
    }

    /**
     * Update footer
     * @param {Object} footer - Footer content
     */
    updateFooter(footer) {
        const footerEl = document.querySelector('.site-footer');
        if (!footerEl) return;

        // Update copyright
        const copyrightEl = footerEl.querySelector('.footer-copyright');
        if (copyrightEl) copyrightEl.textContent = footer.copyright;

        // Update links
        const linksEl = footerEl.querySelector('.footer-links');
        if (linksEl && footer.links) {
            linksEl.innerHTML = footer.links.map(link => `
                <a href="${link.href}">${link.text}</a>
            `).join('');
        }
    }

    /**
     * Initialize content loading for current page
     */
    async init() {
        const currentPage = this.getCurrentPage();
        
        try {
            // Always load site content first
            const siteContent = await this.loadContent('site-content.json');
            
            if (currentPage === 'index') {
                this.renderHomepage(siteContent);
            } else {
                // Load page-specific content
                const pageContent = await this.loadContent(`${currentPage}-content.json`);
                if (pageContent) {
                    this.renderPage(pageContent, siteContent);
                }
            }
        } catch (error) {
            console.error('Failed to initialize content:', error);
        }
    }

    /**
     * Get current page identifier
     * @returns {string} - Page identifier
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '') || 'index';
        return page;
    }

    /**
     * Render any page with its content
     * @param {Object} pageContent - Page-specific content
     * @param {Object} siteContent - Site-wide content
     */
    renderPage(pageContent, siteContent) {
        // Update meta
        this.updateMeta(pageContent.meta);
        
        // Update navigation (from site content)
        if (siteContent.navigation) {
            this.updateNavigation(siteContent.navigation);
        }
        
        // Update footer (from site content)
        if (siteContent.footer) {
            this.updateFooter(siteContent.footer);
        }
        
        // Page-specific rendering logic can be added here
        console.log('Page content loaded:', pageContent);
    }
}

// Export for use in other modules
export { ContentManager };
