/* ===============================================
   COMPONENT SYSTEM: MOBILE-SPECIFIC CARD ENHANCEMENTS
   Touch-optimized interactions for mobile devices
   =============================================== */

// Unified Mobile Card Component with all functionality
class MobileCard {
    constructor(element) {
        this.element = element;
        this.touchStartY = 0;
        this.touchStartTime = 0;
        this.touchStartPos = { x: 0, y: 0 };
        this.isDragging = false;
        this.isExpanded = false;
        this.originalHeight = null;
        this.animationFrame = null;
        this.intersectionObserver = null;
        
        // Bind all event handlers to maintain proper context
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleTouchCancel = this.handleTouchCancel.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleExpandClick = this.handleExpandClick.bind(this);
        
        this.init();
    }

    init() {
        if (!this.isMobile()) return;
        
        this.setupMobileEnhancements();
        this.setupTouchInteractions();
        this.setupAccessibility();
        this.setupViewportObserver();
        
        // Store reference for cleanup
        this.element.cardInstance = this;
        
        console.log('Mobile card initialized for element');
    }

    setupMobileEnhancements() {
        // Add mobile-specific attributes
        this.element.classList.add('card--mobile');
        this.element.setAttribute('role', 'button');
        this.element.setAttribute('tabindex', '0');
        
        // Enhanced testimonial cards with "Read more" functionality
        if (this.element.classList.contains('card--testimonial')) {
            this.enhanceTestimonialCard();
        }
        
        // Setup responsive touch targets
        this.setupTouchTargets();
    }

    enhanceTestimonialCard() {
        const content = this.element.querySelector('.card__content');
        if (!content) return;
        
        const originalText = content.textContent;
        const maxLength = 120; // Mobile-optimized length
        
        if (originalText.length > maxLength) {
            const truncated = originalText.substring(0, maxLength) + '...';
            content.setAttribute('data-full-text', originalText);
            content.textContent = truncated;
            
            // Add expand button after content, not at end of card
            const expandBtn = document.createElement('button');
            expandBtn.className = 'card__expand-btn';
            expandBtn.textContent = 'Read more';
            expandBtn.setAttribute('aria-expanded', 'false');
            
            content.parentNode.insertBefore(expandBtn, content.nextSibling);
            
            expandBtn.addEventListener('click', this.handleExpandClick);
            this.expandButton = expandBtn; // Store reference for cleanup
        }
    }

    handleExpandClick(e) {
        e.stopPropagation();
        const content = this.element.querySelector('.card__content');
        const button = e.target;
        
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        const fullText = content.getAttribute('data-full-text');
        const truncatedText = fullText.substring(0, 120) + '...';
        
        if (isExpanded) {
            content.textContent = truncatedText;
            button.textContent = 'Read more';
            button.setAttribute('aria-expanded', 'false');
            this.element.classList.remove('card--expanded');
        } else {
            content.textContent = fullText;
            button.textContent = 'Read less';
            button.setAttribute('aria-expanded', 'true');
            this.element.classList.add('card--expanded');
        }
    }

    setupTouchTargets() {
        // Use CSS classes for touch target sizing instead of inline styles
        const buttons = this.element.querySelectorAll('button, a, [role="button"]');
        buttons.forEach(button => {
            const rect = button.getBoundingClientRect();
            if (rect.height < 44 || rect.width < 44) {
                button.classList.add('touch-target--large');
            }
        });
    }

    setupTouchInteractions() {
        // Use bound methods for proper cleanup
        this.element.addEventListener('touchstart', this.handleTouchStart, { passive: true });
        this.element.addEventListener('touchmove', this.handleTouchMove, { passive: true });
        this.element.addEventListener('touchend', this.handleTouchEnd, { passive: true });
        this.element.addEventListener('touchcancel', this.handleTouchCancel, { passive: true });
    }

    handleTouchStart(e) {
        if (e.target.closest('.card__expand-btn')) return;
        
        this.touchStartTime = Date.now();
        this.touchStartPos = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
        
        this.element.classList.add('card--touch-active');
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    }

    handleTouchMove(e) {
        const currentPos = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };

        const distance = Math.sqrt(
            Math.pow(currentPos.x - this.touchStartPos.x, 2) + 
            Math.pow(currentPos.y - this.touchStartPos.y, 2)
        );

        if (distance > 10) {
            this.isDragging = true;
            this.element.classList.remove('card--touch-active');
        }
    }

    handleTouchEnd(e) {
        const touchDuration = Date.now() - this.touchStartTime;
        
        this.element.classList.remove('card--touch-active');
        
        if (!this.isDragging && touchDuration < 300) {
            this.handleCardTap(e);
        }
        
        this.isDragging = false;
    }

    handleTouchCancel() {
        this.element.classList.remove('card--touch-active');
        this.isDragging = false;
    }

    handleCardTap(event) {
        event.preventDefault();
        
        // Visual feedback
        this.element.classList.add('card--tapped');
        setTimeout(() => {
            this.element.classList.remove('card--tapped');
        }, 150);

        // Find primary action (excluding expand buttons)
        const primaryAction = this.element.querySelector('.card__action, .btn, a[href]');
        if (primaryAction && !event.target.closest('.card__expand-btn')) {
            primaryAction.click();
        }
        
        // Analytics
        if (window.gtag) {
            window.gtag('event', 'card_interaction', {
                'card_type': this.element.classList.contains('card--testimonial') ? 'testimonial' : 'content'
            });
        }
    }

    setupAccessibility() {
        // Use bound methods for proper cleanup
        this.element.addEventListener('keydown', this.handleKeyDown);
        this.element.addEventListener('focus', this.handleFocus);
        this.element.addEventListener('blur', this.handleBlur);
    }

    handleKeyDown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleCardTap(e);
        }
    }

    handleFocus() {
        this.element.classList.add('card--focused');
    }

    handleBlur() {
        this.element.classList.remove('card--focused');
    }

    setupViewportObserver() {
        if (!('IntersectionObserver' in window)) return;

        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('card--in-viewport');
                } else {
                    entry.target.classList.remove('card--in-viewport');
                }
            });
        }, options);

        this.intersectionObserver.observe(this.element);
    }

    // Accessibility enhancements
    enableReducedMotion() {
        this.element.classList.add('card--reduced-motion');
    }

    enableHighContrast() {
        this.element.classList.add('card--high-contrast');
    }

    // Utility methods
    isMobile() {
        return window.innerWidth <= 767 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    destroy() {
        // Cancel any pending animation frames
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        // Remove touch event listeners
        this.element.removeEventListener('touchstart', this.handleTouchStart);
        this.element.removeEventListener('touchmove', this.handleTouchMove);
        this.element.removeEventListener('touchend', this.handleTouchEnd);
        this.element.removeEventListener('touchcancel', this.handleTouchCancel);
        
        // Remove accessibility event listeners
        this.element.removeEventListener('keydown', this.handleKeyDown);
        this.element.removeEventListener('focus', this.handleFocus);
        this.element.removeEventListener('blur', this.handleBlur);
        
        // Remove expand button event listener if it exists
        if (this.expandButton) {
            this.expandButton.removeEventListener('click', this.handleExpandClick);
            this.expandButton = null;
        }
        
        // Clean up intersection observer
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
            this.intersectionObserver = null;
        }
        
        // Clean up element references
        this.element.cardInstance = null;
        this.element = null;
        
        console.log('Mobile card destroyed and cleaned up');
    }
}

// Responsive initialization system
const MobileCardManager = {
    instances: new Map(),
    
    init() {
        this.initializeCards();
        this.setupResponsiveListeners();
    },
    
    initializeCards() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            if (this.shouldEnhanceCard(card)) {
                this.enhanceCard(card);
            } else {
                this.removeEnhancement(card);
            }
        });
    },
    
    shouldEnhanceCard(card) {
        return window.innerWidth < 768 && 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    enhanceCard(card) {
        if (!this.instances.has(card)) {
            const instance = new MobileCard(card);
            this.instances.set(card, instance);
        }
    },
    
    removeEnhancement(card) {
        const instance = this.instances.get(card);
        if (instance) {
            instance.destroy();
            this.instances.delete(card);
        }
    },
    
    setupResponsiveListeners() {
        // Use ResizeObserver for better performance than resize events
        if ('ResizeObserver' in window) {
            const resizeObserver = new ResizeObserver(() => {
                this.initializeCards();
            });
            resizeObserver.observe(document.body);
        } else {
            // Fallback to resize event with debouncing
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    this.initializeCards();
                }, 250);
            });
        }
        
        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.initializeCards();
            }, 100);
        });
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    MobileCardManager.init();
});

export { MobileCard, MobileCardManager };
