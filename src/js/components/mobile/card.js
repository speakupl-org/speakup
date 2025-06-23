/**
 * Mobile Card Component
 */

import { BaseCard } from '../base/card.js';

class MobileCard extends BaseCard {
    constructor(element, options = {}) {
        const mobileOptions = {
            ...options,
            swipeGestures: true,
            tapFeedback: true,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };
        
        super(element, mobileOptions);
        this.initMobileFeatures();
    }

    initMobileFeatures() {
        this.setupSwipeGestures();
        this.setupTapFeedback();
        this.setupMobileAccessibility();
        this.setupViewportOptimizations();
    }

    setupSwipeGestures() {
        if (!this.options.swipeGestures) return;

        let startX = 0;
        let startY = 0;
        let distX = 0;
        let distY = 0;
        let threshold = 100; // Minimum distance for swipe
        let restraint = 50; // Maximum distance perpendicular to swipe direction

        this.element.addEventListener('touchstart', (event) => {
            const touch = event.changedTouches[0];
            startX = touch.pageX;
            startY = touch.pageY;
            this.element.classList.add('card--touching');
        });

        this.element.addEventListener('touchmove', (event) => {
            event.preventDefault(); // Prevent scrolling while swiping
        });

        this.element.addEventListener('touchend', (event) => {
            const touch = event.changedTouches[0];
            distX = touch.pageX - startX;
            distY = touch.pageY - startY;

            this.element.classList.remove('card--touching');

            // Detect swipe direction
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
                if (distX > 0) {
                    this.handleSwipeRight();
                } else {
                    this.handleSwipeLeft();
                }
            }
        });
    }

    setupTapFeedback() {
        if (!this.options.tapFeedback) return;

        this.element.addEventListener('touchstart', () => {
            // Haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }

            // Visual feedback
            this.element.style.transform = 'scale(0.98)';
            this.element.style.filter = 'brightness(1.1)';
        });

        this.element.addEventListener('touchend', () => {
            // Reset visual feedback
            setTimeout(() => {
                this.element.style.transform = '';
                this.element.style.filter = '';
            }, 150);
        });

        this.element.addEventListener('touchcancel', () => {
            // Reset on cancel
            this.element.style.transform = '';
            this.element.style.filter = '';
        });
    }

    setupMobileAccessibility() {
        // Larger touch targets
        const actionButtons = this.element.querySelectorAll('.card__action');
        actionButtons.forEach(button => {
            const currentPadding = parseFloat(getComputedStyle(button).padding) || 8;
            if (currentPadding < 12) {
                button.style.padding = '12px 16px';
                button.style.minHeight = '44px'; // iOS accessibility guidelines
            }
        });

        // Screen reader optimizations for mobile
        this.element.setAttribute('role', 'article');
        this.element.setAttribute('tabindex', '0');

        // Voice-over friendly descriptions
        const content = this.element.querySelector('.card__content');
        if (content) {
            const summary = content.textContent.substring(0, 100) + '...';
            this.element.setAttribute('aria-description', summary);
        }
    }

    setupViewportOptimizations() {
        // Observe viewport changes for mobile-specific layouts
        if ('ResizeObserver' in window) {
            this.resizeObserver = new ResizeObserver(entries => {
                entries.forEach(entry => {
                    const { width } = entry.contentRect;
                    
                    // Adjust layout based on available width
                    if (width < 300) {
                        this.element.classList.add('card--narrow');
                    } else {
                        this.element.classList.remove('card--narrow');
                    }
                });
            });
            
            this.resizeObserver.observe(this.element);
        }

        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.adjustForOrientation();
            }, 100);
        });
    }

    handleSwipeLeft() {
        // Swipe left actions (e.g., mark as read, dismiss)
        this.trackInteraction('swipe_left');
        
        // Visual feedback
        this.animateSwipeAction('left', () => {
            this.showMobileAction('Card dismissed');
        });
    }

    handleSwipeRight() {
        // Swipe right actions (e.g., save, like)
        this.trackInteraction('swipe_right');
        
        // Visual feedback
        this.animateSwipeAction('right', () => {
            this.showMobileAction('Card saved');
        });
    }

    animateSwipeAction(direction, callback) {
        const translateX = direction === 'left' ? '-100%' : '100%';
        const color = direction === 'left' ? '#ff4757' : '#2ed573';

        this.element.style.transition = 'transform 0.3s ease, background-color 0.3s ease';
        this.element.style.transform = `translateX(${translateX})`;
        this.element.style.backgroundColor = color;

        setTimeout(() => {
            if (callback) callback();
            
            // Reset position
            this.element.style.transform = '';
            this.element.style.backgroundColor = '';
            
            setTimeout(() => {
                this.element.style.transition = '';
            }, 50);
        }, 300);
    }

    adjustForOrientation() {
        const isLandscape = window.orientation === 90 || window.orientation === -90;
        
        if (isLandscape) {
            this.element.classList.add('card--landscape');
            this.element.classList.remove('card--portrait');
        } else {
            this.element.classList.add('card--portrait');
            this.element.classList.remove('card--landscape');
        }
    }

    showMobileAction(message) {
        // Mobile-friendly notification
        const notification = this.createElement('div', 'mobile-notification');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100%);
            background: var(--color-primary-vibrant);
            color: white;
            padding: 12px 24px;
            border-radius: 24px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1001;
            transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(-50%) translateY(0)';
        });

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }

    // Mobile-specific content loading with data saving considerations
    async loadContent() {
        // Check network conditions before loading
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            // Avoid loading heavy content on slow connections
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                return;
            }
        }

        await super.loadContent();
    }

    // Override tracking for mobile-specific events
    trackInteraction(type) {
        const data = {
            component: 'card',
            variant: this.options.variant,
            interaction: type,
            timestamp: new Date().toISOString(),
            platform: 'mobile',
            orientation: window.orientation || 0,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`
        };


        if (window.performanceMonitor) {
            window.performanceMonitor.trackInteraction('mobile-card', data);
        }
    }

    destroy() {
        super.destroy();
        
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }
}

// Auto-initialize mobile cards
if (window.innerWidth < 768) {
    document.addEventListener('DOMContentLoaded', () => {
        const cards = document.querySelectorAll('.card:not([data-desktop-only])');
        cards.forEach(card => {
            const options = {
                variant: card.dataset.variant || 'default',
                interactive: card.dataset.interactive !== 'false',
                swipeGestures: card.dataset.swipeGestures !== 'false'
            };
            new MobileCard(card, options);
        });
    });
}

export { MobileCard };
