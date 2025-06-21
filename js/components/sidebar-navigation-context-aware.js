/* ===============================================
   ADVANCED CONTEXT-AWARE NAVIGATION CONTROLLER v2.0
   State-driven architecture with progressive disclosure
   Platform-specific interaction models
   =============================================== */

class AdvancedSectionNavigation {
    constructor() {
        // Core elements
        this.nav = null;
        this.navList = null;
        this.links = [];
        this.sections = [];
        this.progressIndicator = null;
        
        // State management
        this.currentState = 'resting'; // 'resting' | 'expanded'
        this.activeSection = 0;
        this.isTouch = this.detectTouchDevice();
        this.isExpanded = false;
        
        // Interaction management
        this.expandTimeout = null;
        this.collapseTimeout = null;
        this.debounceTimeout = null;
        
        // Performance optimization
        this.ticking = false;
        this.lastScrollY = 0;
        
        // Bound methods for proper cleanup
        this.handleScroll = this.handleScroll.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleNavigationClick = this.handleNavigationClick.bind(this);
        this.handleLinkClick = this.handleLinkClick.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleResize = this.handleResize.bind(this);
        
        this.init();
    }
    
    /* ===== 1.0 INITIALIZATION ===== */
    
    init() {
        this.findElements();
        if (!this.validateSetup()) return;
        
        this.setupSections();
        this.setupInitialState();
        this.bindEvents();
        this.updateActiveSection();
        
        console.log('Advanced Context-Aware Navigation initialized', {
            state: this.currentState,
            isTouch: this.isTouch,
            sections: this.sections.length
        });
    }
    
    findElements() {
        this.nav = document.querySelector('.sidebar-nav');
        this.navList = document.querySelector('.sidebar-nav-list');
        this.links = Array.from(document.querySelectorAll('.sidebar-nav-link'));
        this.progressIndicator = document.querySelector('.sidebar-progress');
    }
    
    validateSetup() {
        if (!this.nav || !this.navList || this.links.length === 0) {
            console.warn('Advanced Navigation: Required elements not found');
            return false;
        }
        return true;
    }
    
    setupSections() {
        this.sections = this.links.map(link => {
            const href = link.getAttribute('href');
            const sectionId = href ? href.substring(1) : null;
            const element = sectionId ? document.getElementById(sectionId) : null;
            
            return {
                id: sectionId,
                element: element,
                link: link,
                isVisible: false
            };
        }).filter(section => section.element);
    }
    
    setupInitialState() {
        // Set initial state attributes
        this.nav.setAttribute('data-nav-state', 'resting');
        this.nav.setAttribute('aria-expanded', 'false');
        this.nav.setAttribute('aria-label', 'Page section navigation');
        
        // Add platform-specific classes
        if (this.isTouch) {
            this.nav.classList.add('nav--touch');
        } else {
            this.nav.classList.add('nav--pointer');
        }
    }
    
    /* ===== 2.0 STATE MANAGEMENT ===== */
    
    transitionToState(newState, reason = '') {
        if (this.currentState === newState) return;
        
        const previousState = this.currentState;
        this.currentState = newState;
        
        // Update DOM state
        this.nav.setAttribute('data-nav-state', newState);
        this.nav.setAttribute('aria-expanded', newState === 'expanded' ? 'true' : 'false');
        
        // Update internal flag
        this.isExpanded = newState === 'expanded';
        
        // Handle progressive disclosure
        this.updateTextVisibility();
        
        console.log(`Navigation state: ${previousState} → ${newState}`, { reason });
    }
    
    updateTextVisibility() {
        this.links.forEach((link, index) => {
            const textElement = link.querySelector('.sidebar-nav-text');
            if (!textElement) return;
            
            if (this.currentState === 'expanded') {
                // All labels visible in expanded state
                textElement.style.pointerEvents = 'auto';
            } else if (this.currentState === 'resting') {
                // Only active label visible in resting state (CSS handles this)
                textElement.style.pointerEvents = index === this.activeSection ? 'auto' : 'none';
            }
        });
    }
    
    /* ===== 3.0 INTERACTION HANDLERS ===== */
    
    bindEvents() {
        // Scroll-based updates (universal)
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        
        // Platform-specific interaction models
        if (this.isTouch) {
            this.setupTouchInteractions();
        } else {
            this.setupPointerInteractions();
        }
        
        // Universal interactions
        this.setupUniversalInteractions();
    }
    
    setupPointerInteractions() {
        // Desktop: Hover-driven expansion
        this.nav.addEventListener('mouseenter', this.handleMouseEnter);
        this.nav.addEventListener('mouseleave', this.handleMouseLeave);
    }
    
    setupTouchInteractions() {
        // Mobile: Tap-driven expansion
        this.nav.addEventListener('click', this.handleNavigationClick);
        document.addEventListener('click', this.handleOutsideClick);
    }
    
    setupUniversalInteractions() {
        // Link navigation (both platforms)
        this.links.forEach(link => {
            link.addEventListener('click', this.handleLinkClick);
        });
        
        // Keyboard navigation
        this.nav.addEventListener('keydown', this.handleKeyDown);
        
        // Responsive updates
        window.addEventListener('resize', this.debounce(this.handleResize, 250));
    }
    
    /* ===== 4.0 DESKTOP INTERACTION MODEL ===== */
    
    handleMouseEnter() {
        if (this.isTouch) return;
        
        clearTimeout(this.collapseTimeout);
        this.transitionToState('expanded', 'desktop hover');
    }
    
    handleMouseLeave() {
        if (this.isTouch) return;
        
        // Debounced collapse to prevent premature closure
        this.collapseTimeout = setTimeout(() => {
            this.transitionToState('resting', 'desktop hover end');
        }, 300);
    }
    
    /* ===== 5.0 MOBILE INTERACTION MODEL ===== */
    
    handleNavigationClick(e) {
        if (!this.isTouch) return;
        
        // Check if click was on a navigation link
        const clickedLink = e.target.closest('.sidebar-nav-link');
        if (clickedLink) return; // Let link handler manage this
        
        // Discovery tap - expand to show labels
        if (this.currentState === 'resting') {
            e.preventDefault();
            e.stopPropagation();
            this.transitionToState('expanded', 'mobile discovery tap');
        }
    }
    
    handleOutsideClick(e) {
        if (!this.isTouch) return;
        
        // Dismiss when clicking outside expanded navigation
        if (this.currentState === 'expanded' && !this.nav.contains(e.target)) {
            this.transitionToState('resting', 'mobile dismissal tap');
        }
    }
    
    /* ===== 6.0 LINK NAVIGATION ===== */
    
    handleLinkClick(e) {
        const link = e.currentTarget;
        const href = link.getAttribute('href');
        
        if (!href || !href.startsWith('#')) return;
        
        e.preventDefault();
        
        // Execute navigation
        const sectionId = href.substring(1);
        this.scrollToSection(sectionId);
        
        // Mobile: Collapse after navigation
        if (this.isTouch && this.currentState === 'expanded') {
            setTimeout(() => {
                this.transitionToState('resting', 'mobile navigation complete');
            }, 100);
        }
    }
    
    scrollToSection(sectionId) {
        const targetElement = document.getElementById(sectionId);
        if (!targetElement) return;
        
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        // Use Lenis if available, otherwise fallback to native
        if (window.lenis) {
            window.lenis.scrollTo(offsetPosition, {
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        } else {
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    /* ===== 7.0 SCROLL-BASED UPDATES ===== */
    
    handleScroll() {
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.updateActiveSection();
                this.updateProgressIndicator();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }
    
    updateActiveSection() {
        let newActiveSection = 0;
        const scrollPosition = window.pageYOffset + 100;
        
        // Find the current section
        for (let i = this.sections.length - 1; i >= 0; i--) {
            const section = this.sections[i];
            if (section.element && section.element.offsetTop <= scrollPosition) {
                newActiveSection = i;
                break;
            }
        }
        
        // Update active state if changed
        if (newActiveSection !== this.activeSection) {
            this.setActiveSection(newActiveSection);
        }
    }
    
    setActiveSection(index) {
        // Remove previous active state
        if (this.sections[this.activeSection]) {
            this.sections[this.activeSection].link.classList.remove('is-active');
        }
        
        // Set new active state
        this.activeSection = index;
        if (this.sections[this.activeSection]) {
            this.sections[this.activeSection].link.classList.add('is-active');
        }
        
        // Update text visibility for hybrid active state
        this.updateTextVisibility();
    }
    
    updateProgressIndicator() {
        if (!this.progressIndicator) return;
        
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = window.pageYOffset / scrollHeight;
        const progressPercentage = Math.min(100, Math.max(0, scrollProgress * 100));
        
        this.progressIndicator.style.setProperty('--progress', `${progressPercentage}%`);
    }
    
    /* ===== 8.0 ACCESSIBILITY & KEYBOARD NAVIGATION ===== */
    
    handleKeyDown(e) {
        switch (e.key) {
            case 'Enter':
            case ' ':
                if (this.currentState === 'resting') {
                    e.preventDefault();
                    this.transitionToState('expanded', 'keyboard activation');
                }
                break;
            case 'Escape':
                if (this.currentState === 'expanded') {
                    e.preventDefault();
                    this.transitionToState('resting', 'keyboard dismissal');
                }
                break;
        }
    }
    
    /* ===== 9.0 RESPONSIVE BEHAVIOR ===== */
    
    handleResize() {
        const wasTouch = this.isTouch;
        this.isTouch = this.detectTouchDevice();
        
        // Reinitialize if interaction model changed
        if (wasTouch !== this.isTouch) {
            this.removeEventListeners();
            this.setupInitialState();
            
            if (this.isTouch) {
                this.setupTouchInteractions();
            } else {
                this.setupPointerInteractions();
            }
        }
    }
    
    /* ===== 10.0 UTILITY METHODS ===== */
    
    detectTouchDevice() {
        return ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) || 
               (navigator.msMaxTouchPoints > 0) ||
               window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    }
    
    debounce(func, wait) {
        return (...args) => {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    
    /* ===== 11.0 CLEANUP ===== */
    
    removeEventListeners() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        
        this.nav.removeEventListener('mouseenter', this.handleMouseEnter);
        this.nav.removeEventListener('mouseleave', this.handleMouseLeave);
        this.nav.removeEventListener('click', this.handleNavigationClick);
        this.nav.removeEventListener('keydown', this.handleKeyDown);
        
        document.removeEventListener('click', this.handleOutsideClick);
        
        this.links.forEach(link => {
            link.removeEventListener('click', this.handleLinkClick);
        });
    }
    
    destroy() {
        this.removeEventListeners();
        
        clearTimeout(this.expandTimeout);
        clearTimeout(this.collapseTimeout);
        clearTimeout(this.debounceTimeout);
        
        // Reset DOM state
        this.nav.removeAttribute('data-nav-state');
        this.nav.removeAttribute('aria-expanded');
        this.nav.classList.remove('nav--touch', 'nav--pointer');
        
        console.log('Advanced Context-Aware Navigation destroyed');
    }
}

/* ===== 12.0 AUTO-INITIALIZATION ===== */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const existingNav = document.querySelector('.sidebar-nav');
    if (existingNav) {
        window.advancedNavigation = new AdvancedSectionNavigation();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedSectionNavigation;
}
