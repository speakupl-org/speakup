// Component System: Base Card Component
// This will be the foundation for our monorepo ui-core package

class BaseCard {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            variant: 'default',
            interactive: true,
            loadingDelay: 300,
            ...options
        };
        
        this.init();
    }

    init() {
        this.setupVariant();
        this.setupInteractivity();
        this.setupAccessibility();
        this.setupObserver();
    }

    setupVariant() {
        // Add variant classes based on options
        if (this.options.variant !== 'default') {
            this.element.classList.add(`card--${this.options.variant}`);
        }

        // Add device-specific classes based on viewport
        if (window.innerWidth >= 768) {
            this.element.classList.add('card--desktop');
        } else {
            this.element.classList.add('card--mobile');
        }
    }

    setupInteractivity() {
        if (!this.options.interactive) return;

        // Enhanced click handling for better UX
        this.element.addEventListener('click', this.handleClick.bind(this));
        
        // Touch device optimizations
        if ('ontouchstart' in window) {
            this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));
            this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
        }

        // Keyboard navigation
        if (this.element.tabIndex >= 0) {
            this.element.addEventListener('keydown', this.handleKeydown.bind(this));
        }
    }

    setupAccessibility() {
        // Ensure proper ARIA attributes
        if (!this.element.getAttribute('role')) {
            this.element.setAttribute('role', 'article');
        }

        // Add focus management
        if (this.options.interactive && !this.element.tabIndex) {
            this.element.tabIndex = 0;
        }

        // Screen reader enhancements
        const title = this.element.querySelector('.card__title');
        if (title && !this.element.getAttribute('aria-labelledby')) {
            title.id = title.id || `card-title-${Date.now()}`;
            this.element.setAttribute('aria-labelledby', title.id);
        }
    }

    setupObserver() {
        // Intersection observer for lazy loading and animations
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                { threshold: 0.1, rootMargin: '50px' }
            );
            this.observer.observe(this.element);
        }
    }

    handleClick(event) {
        // Find and trigger the primary action
        const primaryAction = this.element.querySelector('.card__action');
        if (primaryAction && !event.target.closest('.card__action')) {
            event.preventDefault();
            primaryAction.click();
        }

        // Analytics tracking
        this.trackInteraction('click');
    }

    handleTouchStart(event) {
        this.element.style.transform = 'scale(0.98)';
    }

    handleTouchEnd(event) {
        this.element.style.transform = '';
    }

    handleKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.handleClick(event);
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.element.classList.add('card--visible');
                this.loadContent();
                this.observer.unobserve(this.element);
            }
        });
    }

    // Loading states for dynamic content
    setLoading(isLoading = true) {
        if (isLoading) {
            this.element.classList.add('card--loading');
            this.element.setAttribute('aria-busy', 'true');
        } else {
            this.element.classList.remove('card--loading');
            this.element.removeAttribute('aria-busy');
        }
    }

    // Dynamic content loading (for future CMS integration)
    async loadContent() {
        const contentUrl = this.element.dataset.contentUrl;
        if (!contentUrl) return;

        this.setLoading(true);

        try {
            // Simulate API call (will be real in monorepo phase)
            await new Promise(resolve => setTimeout(resolve, this.options.loadingDelay));
            
            // This will be replaced with actual content loading
            
        } catch (error) {
            console.error('Failed to load card content:', error);
            this.handleError(error);
        } finally {
            this.setLoading(false);
        }
    }

    handleError(error) {
        // Graceful error handling
        const errorMessage = this.element.querySelector('.card__error') || 
                           this.createElement('div', 'card__error', 'Conteúdo temporariamente indisponível');
        
        if (!this.element.contains(errorMessage)) {
            this.element.appendChild(errorMessage);
        }
    }

    trackInteraction(type) {
        // Prepare for Edge analytics
        const data = {
            component: 'card',
            variant: this.options.variant,
            interaction: type,
            timestamp: new Date().toISOString(),
            viewport: window.innerWidth >= 768 ? 'desktop' : 'mobile'
        };

        if (window.performanceMonitor) {
            window.performanceMonitor.trackInteraction('card', data);
        }
    }

    // Utility method
    createElement(tag, className, textContent) {
        const element = document.createElement(tag);
        element.className = className;
        if (textContent) element.textContent = textContent;
        return element;
    }

    // Public API for external control
    setVariant(variant) {
        // Remove old variant classes
        this.element.classList.remove(`card--${this.options.variant}`);
        
        // Add new variant
        this.options.variant = variant;
        this.element.classList.add(`card--${variant}`);
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        // Remove event listeners
        this.element.removeEventListener('click', this.handleClick);
        this.element.removeEventListener('touchstart', this.handleTouchStart);
        this.element.removeEventListener('touchend', this.handleTouchEnd);
        this.element.removeEventListener('keydown', this.handleKeydown);
    }
}

// Auto-initialize cards on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        // Get options from data attributes
        const options = {
            variant: card.dataset.variant || 'default',
            interactive: card.dataset.interactive !== 'false',
            loadingDelay: parseInt(card.dataset.loadingDelay) || 300
        };

        new BaseCard(card, options);
    });
});

// Export for future monorepo use
export { BaseCard };
