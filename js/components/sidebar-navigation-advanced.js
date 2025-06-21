/**
 * ADVANCED SECTION NAVIGATION CONTROLLER
 * State-driven, context-aware navigation with progressive disclosure
 * 
 * Technical Architecture:
 * - State Machine: Resting → Expanded → Resting
 * - Platform-Specific Interactions: Desktop (hover) vs Mobile (tap)
 * - Progressive Disclosure: Minimal by default, powerful on demand
 * - Strict Separation: HTML/CSS/JS decoupling
 */

class AdvancedSectionNavigation {
    constructor() {
        // Core navigation sections configuration
        this.sections = [
            { id: 'hero', label: 'Início', offset: 0 },
            { id: 'the-block', label: 'O Bloqueio', offset: 100 },
            { id: 'the-shift', label: 'A Transformação', offset: 100 },
            { id: 'the-guide', label: 'O Método', offset: 100 },
            { id: 'testimonials', label: 'Resultados', offset: 100 },
            { id: 'final-cta', label: 'Comece Agora', offset: 100 }
        ];
        
        // State management
        this.state = {
            current: 'resting',      // 'resting' | 'expanded'
            activeSection: 0,        // Currently active section index
            isExpanded: false,       // Quick boolean check
            isMobile: this.detectMobile(),
            isScrolling: false,      // Prevents multiple scroll triggers
            hasUserInteracted: false // Track if user has discovered the component
        };
        
        // Timing configuration
        this.timing = {
            hoverDelay: 300,         // Delay before hover collapse
            scrollThrottle: 16,      // ~60fps scroll handling
            expandDuration: 250,     // CSS transition duration
            collapseDuration: 200    // CSS transition duration
        };
        
        // DOM references
        this.elements = {
            container: null,
            links: [],
            dots: [],
            texts: [],
            progressBar: null
        };
        
        // Event handler references for cleanup
        this.boundHandlers = {
            handleMouseEnter: this.handleMouseEnter.bind(this),
            handleMouseLeave: this.handleMouseLeave.bind(this),
            handleContainerClick: this.handleContainerClick.bind(this),
            handleLinkClick: this.handleLinkClick.bind(this),
            handleDocumentClick: this.handleDocumentClick.bind(this),
            handleScroll: this.throttle(this.handleScroll.bind(this), this.timing.scrollThrottle),
            handleResize: this.debounce(this.handleResize.bind(this), 250)
        };
        
        // Timers for cleanup
        this.timers = {
            collapseTimer: null,
            scrollTimer: null
        };
        
        this.init();
    }
    
    /**
     * Initialize the navigation component
     */
    init() {
        this.cacheElements();
        
        if (!this.elements.container) {
            console.warn('AdvancedSectionNavigation: Container element not found');
            return;
        }
        
        this.setupInitialState();
        this.bindEvents();
        this.updateActiveSection();
        
        console.log('AdvancedSectionNavigation: Initialized successfully', {
            sections: this.sections.length,
            isMobile: this.state.isMobile,
            state: this.state.current
        });
    }
    
    /**
     * Cache DOM elements for performance
     */
    cacheElements() {
        this.elements.container = document.getElementById('sectionNav');
        
        if (this.elements.container) {
            this.elements.links = Array.from(this.elements.container.querySelectorAll('.sidebar-nav-link'));
            this.elements.dots = Array.from(this.elements.container.querySelectorAll('.sidebar-nav-dot'));
            this.elements.texts = Array.from(this.elements.container.querySelectorAll('.sidebar-nav-text'));
            this.elements.progressBar = this.elements.container.querySelector('.sidebar-progress');
        }
    }
    
    /**
     * Setup initial component state
     */
    setupInitialState() {
        // Add state management attributes
        this.elements.container.setAttribute('data-nav-state', this.state.current);
        this.elements.container.setAttribute('aria-label', 'Navegação por seções');
        
        // Set up ARIA attributes for accessibility
        this.elements.links.forEach((link, index) => {
            link.setAttribute('aria-label', `Ir para ${this.sections[index].label}`);
            link.setAttribute('data-section-index', index);
        });
        
        // Add interaction affordance for mobile
        if (this.state.isMobile) {
            this.elements.container.setAttribute('aria-expanded', 'false');
            this.elements.container.setAttribute('role', 'button');
            this.elements.container.setAttribute('tabindex', '0');
        }
    }
    
    /**
     * Bind all event listeners
     */
    bindEvents() {
        const { container, links } = this.elements;
        
        if (this.state.isMobile) {
            // Mobile: Tap-based interaction model
            container.addEventListener('click', this.boundHandlers.handleContainerClick);
            document.addEventListener('click', this.boundHandlers.handleDocumentClick);
            
            // Individual link clicks for navigation
            links.forEach(link => {
                link.addEventListener('click', this.boundHandlers.handleLinkClick);
            });
        } else {
            // Desktop: Hover-based interaction model
            container.addEventListener('mouseenter', this.boundHandlers.handleMouseEnter);
            container.addEventListener('mouseleave', this.boundHandlers.handleMouseLeave);
            
            // Link clicks for immediate navigation
            links.forEach(link => {
                link.addEventListener('click', this.boundHandlers.handleLinkClick);
            });
        }
        
        // Universal scroll tracking
        window.addEventListener('scroll', this.boundHandlers.handleScroll, { passive: true });
        window.addEventListener('resize', this.boundHandlers.handleResize);
    }
    
    /**
     * Desktop: Handle mouse enter (expand state)
     */
    handleMouseEnter() {
        if (this.state.isMobile) return;
        
        this.clearTimer('collapseTimer');
        this.expandNavigation();
    }
    
    /**
     * Desktop: Handle mouse leave (collapse state with delay)
     */
    handleMouseLeave() {
        if (this.state.isMobile) return;
        
        this.scheduleCollapse();
    }
    
    /**
     * Mobile: Handle container click (discovery tap)
     */
    handleContainerClick(event) {
        // Only handle clicks on the container itself, not on links
        if (event.target.closest('.sidebar-nav-link')) return;
        
        event.preventDefault();
        event.stopPropagation();
        
        if (this.state.isExpanded) {
            this.collapseNavigation();
        } else {
            this.expandNavigation();
            this.state.hasUserInteracted = true;
        }
    }
    
    /**
     * Handle link clicks (navigation)
     */
    handleLinkClick(event) {
        event.preventDefault();
        event.stopPropagation();
        
        const link = event.currentTarget;
        const sectionIndex = parseInt(link.getAttribute('data-section-index'), 10);
        
        if (isNaN(sectionIndex)) return;
        
        // Navigate to section
        this.scrollToSection(sectionIndex);
        
        // On mobile, collapse after navigation
        if (this.state.isMobile && this.state.isExpanded) {
            setTimeout(() => {
                this.collapseNavigation();
            }, 100);
        }
    }
    
    /**
     * Mobile: Handle document click (dismissal tap)
     */
    handleDocumentClick(event) {
        if (!this.state.isMobile || !this.state.isExpanded) return;
        
        // Check if click is outside navigation
        if (!this.elements.container.contains(event.target)) {
            this.collapseNavigation();
        }
    }
    
    /**
     * Handle scroll events to update active section
     */
    handleScroll() {
        if (this.state.isScrolling) return;
        
        this.updateActiveSection();
        this.updateScrollProgress();
    }
    
    /**
     * Handle resize events
     */
    handleResize() {
        const wasMobile = this.state.isMobile;
        this.state.isMobile = this.detectMobile();
        
        // If mobile state changed, rebind events
        if (wasMobile !== this.state.isMobile) {
            this.unbindEvents();
            this.bindEvents();
            this.setupInitialState();
        }
    }
    
    /**
     * Expand navigation (show all labels)
     */
    expandNavigation() {
        if (this.state.isExpanded) return;
        
        this.state.current = 'expanded';
        this.state.isExpanded = true;
        
        // Update DOM state
        this.elements.container.setAttribute('data-nav-state', 'expanded');
        this.elements.container.classList.add('is-expanded');
        
        if (this.state.isMobile) {
            this.elements.container.setAttribute('aria-expanded', 'true');
        }
        
        console.log('Navigation expanded');
    }
    
    /**
     * Collapse navigation (hide labels, show only active)
     */
    collapseNavigation() {
        if (!this.state.isExpanded) return;
        
        this.state.current = 'resting';
        this.state.isExpanded = false;
        
        // Update DOM state
        this.elements.container.setAttribute('data-nav-state', 'resting');
        this.elements.container.classList.remove('is-expanded');
        
        if (this.state.isMobile) {
            this.elements.container.setAttribute('aria-expanded', 'false');
        }
        
        console.log('Navigation collapsed');
    }
    
    /**
     * Schedule collapse with delay (for desktop hover)
     */
    scheduleCollapse() {
        this.clearTimer('collapseTimer');
        
        this.timers.collapseTimer = setTimeout(() => {
            this.collapseNavigation();
        }, this.timing.hoverDelay);
    }
    
    /**
     * Update active section based on scroll position
     */
    updateActiveSection() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        let newActiveSection = 0;
        
        // Check each section to find the currently visible one
        for (let i = this.sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(this.sections[i].id);
            if (!section) continue;
            
            const rect = section.getBoundingClientRect();
            const sectionTop = scrollTop + rect.top;
            
            // Section is active if we've scrolled past its start point
            if (scrollTop >= sectionTop - this.sections[i].offset) {
                newActiveSection = i;
                break;
            }
        }
        
        // Special case: if we're at the bottom, activate the last section
        if (scrollTop + windowHeight >= documentHeight - 100) {
            newActiveSection = this.sections.length - 1;
        }
        
        if (newActiveSection !== this.state.activeSection) {
            this.setActiveSection(newActiveSection);
        }
    }
    
    /**
     * Set the active section
     */
    setActiveSection(index) {
        if (index < 0 || index >= this.sections.length) return;
        
        // Remove active state from previous section
        if (this.elements.links[this.state.activeSection]) {
            this.elements.links[this.state.activeSection].classList.remove('is-active');
            this.elements.links[this.state.activeSection].setAttribute('aria-current', 'false');
        }
        
        // Add active state to new section
        this.state.activeSection = index;
        
        if (this.elements.links[index]) {
            this.elements.links[index].classList.add('is-active');
            this.elements.links[index].setAttribute('aria-current', 'page');
        }
        
        console.log('Active section updated:', this.sections[index].label);
    }
    
    /**
     * Update scroll progress indicator
     */
    updateScrollProgress() {
        if (!this.elements.progressBar) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        
        const scrollableHeight = documentHeight - windowHeight;
        const progress = Math.min((scrollTop / scrollableHeight) * 100, 100);
        
        this.elements.progressBar.style.setProperty('--progress', `${progress}%`);
    }
    
    /**
     * Scroll to specific section
     */
    scrollToSection(index) {
        if (index < 0 || index >= this.sections.length) return;
        
        const sectionId = this.sections[index].id;
        const targetElement = document.getElementById(sectionId);
        
        if (!targetElement) {
            console.warn(`Section element #${sectionId} not found`);
            return;
        }
        
        this.state.isScrolling = true;
        
        const rect = targetElement.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetPosition = scrollTop + rect.top - this.sections[index].offset;
        
        // Use smooth scrolling with fallbacks
        this.smoothScrollTo(targetPosition).then(() => {
            this.state.isScrolling = false;
            this.setActiveSection(index);
        });
        
        console.log('Navigating to section:', this.sections[index].label);
    }
    
    /**
     * Smooth scroll implementation with multiple fallbacks
     */
    smoothScrollTo(targetPosition) {
        return new Promise((resolve) => {
            // Try Lenis first (if available)
            if (window.lenis && typeof window.lenis.scrollTo === 'function') {
                window.lenis.scrollTo(targetPosition);
                setTimeout(resolve, 1000);
                return;
            }
            
            // Try native smooth scroll
            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                setTimeout(resolve, 1000);
                return;
            }
            
            // Fallback to instant scroll
            window.scrollTo(0, targetPosition);
            resolve();
        });
    }
    
    /**
     * Detect if device is mobile
     */
    detectMobile() {
        return window.innerWidth < 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    /**
     * Utility: Throttle function calls
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    /**
     * Utility: Debounce function calls
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Clear specific timer
     */
    clearTimer(timerName) {
        if (this.timers[timerName]) {
            clearTimeout(this.timers[timerName]);
            this.timers[timerName] = null;
        }
    }
    
    /**
     * Unbind all event listeners
     */
    unbindEvents() {
        const { container, links } = this.elements;
        
        if (container) {
            container.removeEventListener('click', this.boundHandlers.handleContainerClick);
            container.removeEventListener('mouseenter', this.boundHandlers.handleMouseEnter);
            container.removeEventListener('mouseleave', this.boundHandlers.handleMouseLeave);
        }
        
        links.forEach(link => {
            link.removeEventListener('click', this.boundHandlers.handleLinkClick);
        });
        
        document.removeEventListener('click', this.boundHandlers.handleDocumentClick);
        window.removeEventListener('scroll', this.boundHandlers.handleScroll);
        window.removeEventListener('resize', this.boundHandlers.handleResize);
    }
    
    /**
     * Destroy the navigation component
     */
    destroy() {
        this.unbindEvents();
        
        // Clear all timers
        Object.keys(this.timers).forEach(timer => {
            this.clearTimer(timer);
        });
        
        // Reset DOM state
        if (this.elements.container) {
            this.elements.container.classList.remove('is-expanded');
            this.elements.container.removeAttribute('data-nav-state');
        }
        
        console.log('AdvancedSectionNavigation: Destroyed');
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.advancedNavigation = new AdvancedSectionNavigation();
});

export { AdvancedSectionNavigation };
