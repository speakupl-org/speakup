/* ===============================================
   COMPONENT SYSTEM: MOBILE-SPECIFIC CARD ENHANCEMENTS
   Touch-optimized interactions for mobile devices
   =============================================== */

import { BaseCard } from '../base/card.js';

// Enhanced Mobile Card Component System
class MobileCardSystem {
    constructor() {
        this.cards = [];
        this.touchStartY = 0;
        this.touchStartTime = 0;
        this.activeCard = null;
        this.init();
    }

    init() {
        this.setupCards();
        this.setupTouchInteractions();
        this.setupViewportObserver();
        this.setupAccessibility();
        console.log('MOBILE_CARDS.INIT_COMPLETE');
    }

    setupCards() {
        const cardElements = document.querySelectorAll('.card');
        
        cardElements.forEach((card, index) => {
            // Add mobile-specific attributes
            if (this.isMobile()) {
                card.classList.add('card--mobile');
                card.setAttribute('data-mobile-index', index);
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
            } else {
                card.classList.add('card--desktop');
            }

            // Enhanced testimonial cards
            if (card.classList.contains('card--testimonial')) {
                this.enhanceTestimonialCard(card);
            }

            this.cards.push({
                element: card,
                index: index,
                isExpanded: false,
                originalHeight: null
            });
        });
    }

    enhanceTestimonialCard(card) {
        // Add mobile-specific enhancements for testimonial cards
        const content = card.querySelector('.card__content');
        if (content) {
            // Truncate long testimonials on mobile
            const originalText = content.textContent;
            const maxLength = this.isMobile() ? 120 : 200;
            
            if (originalText.length > maxLength) {
                const truncated = originalText.substring(0, maxLength) + '...';
                content.setAttribute('data-full-text', originalText);
                content.textContent = truncated;
                
                // Add expand button
                const expandBtn = document.createElement('button');
                expandBtn.className = 'card__expand-btn';
                expandBtn.textContent = 'Read more';
                expandBtn.setAttribute('aria-expanded', 'false');
                
                card.appendChild(expandBtn);
                
                expandBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleTestimonialExpansion(card, content, expandBtn);
                });
            }
        }
    }

    toggleTestimonialExpansion(card, content, button) {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        const fullText = content.getAttribute('data-full-text');
        const truncatedText = fullText.substring(0, 120) + '...';
        
        if (isExpanded) {
            content.textContent = truncatedText;
            button.textContent = 'Read more';
            button.setAttribute('aria-expanded', 'false');
            card.classList.remove('card--expanded');
        } else {
            content.textContent = fullText;
            button.textContent = 'Read less';
            button.setAttribute('aria-expanded', 'true');
            card.classList.add('card--expanded');
        }
    }

    setupTouchInteractions() {
        this.cards.forEach(({ element }) => {
            let touchStartTime = 0;
            let touchStartPos = { x: 0, y: 0 };
            let isDragging = false;

            // Touch start
            element.addEventListener('touchstart', (e) => {
                if (e.target.closest('.card__expand-btn')) return;
                
                touchStartTime = Date.now();
                touchStartPos = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                };
                
                element.classList.add('card--touch-active');
                this.activeCard = element;
                
                // Haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            }, { passive: true });

            // Touch move
            element.addEventListener('touchmove', (e) => {
                const currentPos = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                };

                const distance = Math.sqrt(
                    Math.pow(currentPos.x - touchStartPos.x, 2) + 
                    Math.pow(currentPos.y - touchStartPos.y, 2)
                );

                if (distance > 10) {
                    isDragging = true;
                    element.classList.remove('card--touch-active');
                }
            }, { passive: true });

            // Touch end
            element.addEventListener('touchend', (e) => {
                const touchDuration = Date.now() - touchStartTime;
                
                element.classList.remove('card--touch-active');
                
                if (!isDragging && touchDuration < 300) {
                    this.handleCardTap(element, e);
                }
                
                isDragging = false;
                this.activeCard = null;
            }, { passive: true });

            // Touch cancel
            element.addEventListener('touchcancel', () => {
                element.classList.remove('card--touch-active');
                this.activeCard = null;
                isDragging = false;
            }, { passive: true });
        });
    }

    handleCardTap(card, event) {
        event.preventDefault();
        
        // Visual feedback
        card.classList.add('card--tapped');
        setTimeout(() => {
            card.classList.remove('card--tapped');
        }, 150);

        // Find primary action
        const primaryAction = card.querySelector('.card__action, .btn, a[href]');
        if (primaryAction && !event.target.closest('.card__expand-btn')) {
            primaryAction.click();
        }
        
        // Analytics
        if (window.gtag) {
            window.gtag('event', 'card_interaction', {
                'card_type': card.classList.contains('card--testimonial') ? 'testimonial' : 'content'
            });
        }
    }

    setupViewportObserver() {
        if (!('IntersectionObserver' in window)) return;

        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('card--in-viewport');
                } else {
                    entry.target.classList.remove('card--in-viewport');
                }
            });
        }, options);

        this.cards.forEach(({ element }) => {
            observer.observe(element);
        });
    }

    setupAccessibility() {
        this.cards.forEach(({ element }) => {
            // Keyboard navigation
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleCardTap(element, e);
                }
            });

            // Focus management
            element.addEventListener('focus', () => {
                element.classList.add('card--focused');
            });

            element.addEventListener('blur', () => {
                element.classList.remove('card--focused');
            });
        });
    }

    isMobile() {
        return window.innerWidth <= 767 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
}

// Simple MobileCard class for individual card instances
class MobileCard {
    constructor(element) {
        this.element = element;
        this.touchStartTime = 0;
        this.touchStartPos = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.setupTouchHandlers();
        this.setupTouchTargets();
        this.setupMobileAccessibility();
        this.setupPerformanceOptimizations();
    }

    setupTouchHandlers() {
        let touchStartTime, touchStartPos;

        this.element.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchStartPos = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };

            // Immediate touch feedback
            this.element.classList.add('card--touch-active');
            this.element.style.transform = 'scale(0.98)';
            
            // Haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        }, { passive: true });

        this.element.addEventListener('touchmove', (e) => {
            const currentPos = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };

            const distance = Math.sqrt(
                Math.pow(currentPos.x - touchStartPos.x, 2) + 
                Math.pow(currentPos.y - touchStartPos.y, 2)
            );

            // Cancel touch if moved too far
            if (distance > 10) {
                this.element.classList.remove('card--touch-active');
                this.element.style.transform = '';
            }
        }, { passive: true });

        this.element.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            
            // Remove touch feedback
            this.element.classList.remove('card--touch-active');
            this.element.style.transform = '';

            // Handle tap if it was quick and didn't move much
            if (touchDuration < 500) {
                this.handleMobileTap(e);
            }
        }, { passive: true });
    }

    setupTouchTargets() {
        // Ensure all interactive elements meet 44px minimum
        const actions = this.element.querySelectorAll('.card__action, button, a');
        actions.forEach(action => {
            const styles = getComputedStyle(action);
            const height = parseInt(styles.height);
            const width = parseInt(styles.width);

            if (height < 44) {
                action.style.minHeight = '44px';
                action.style.paddingTop = '12px';
                action.style.paddingBottom = '12px';
            }

            if (width < 44) {
                action.style.minWidth = '44px';
                action.style.paddingLeft = '12px';
                action.style.paddingRight = '12px';
            }
        });
    }

    setupMobileAccessibility() {
        // Enhanced focus indicators for mobile
        this.element.setAttribute('role', 'button');
        this.element.setAttribute('tabindex', '0');
        
        // Add accessible labels
        if (!this.element.getAttribute('aria-label')) {
            const label = this.generateAccessibleLabel();
            this.element.setAttribute('aria-label', label);
        }
    }

    generateAccessibleLabel() {
        const title = this.element.querySelector('.card__title')?.textContent || 'Card';
        const type = this.element.classList.contains('card--testimonial') ? 'testimonial' : 'content';
        return `${title} ${type} card, tap to interact`;
    }

    setupPerformanceOptimizations() {
        // Use passive listeners where possible
        // Already implemented in touch handlers
        
        // Optimize animations for mobile
        if (this.element.animate) {
            this.element.style.willChange = 'transform, opacity';
        }

        // Reduce motion for users who prefer it
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.enableReducedMotion();
        }

        // High contrast mode support
        if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
            this.enableHighContrast();
        }
    }

    handleMobileTap(event) {
        event.preventDefault();
        
        // Add visual feedback
        this.element.classList.add('card--tapped');
        setTimeout(() => {
            this.element.classList.remove('card--tapped');
        }, 150);

        // Find and trigger the primary action
        const primaryAction = this.element.querySelector('.card__action, .btn, a');
        if (primaryAction) {
            // Simulate click for compatibility
            primaryAction.click();
        }

        // Analytics or tracking could go here
        if (window.gtag) {
            window.gtag('event', 'card_tap', {
                'card_type': this.element.classList.contains('card--testimonial') ? 'testimonial' : 'content',
                'card_title': this.element.querySelector('.card__title')?.textContent || 'unknown'
            });
        }
    }

    enableReducedMotion() {
        this.element.classList.add('card--reduced-motion');
    }

    enableHighContrast() {
        this.element.classList.add('card--high-contrast');
    }

    destroy() {
        // Clean up event listeners and references
        this.element.removeAttribute('data-mobile-card');
        this.element.classList.remove('card--touch-active', 'card--tapped', 'card--loading');
    }
}

// Auto-initialize on mobile devices
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth < 768) {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            if (!card.dataset.cardInitialized) {
                new MobileCard(card);
                card.dataset.cardInitialized = 'true';
            }
        });
    }
});

// Export for use in main.js
export { MobileCardSystem, MobileCard };
