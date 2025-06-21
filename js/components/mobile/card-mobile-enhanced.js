/* ===============================================
   COMPONENT SYSTEM: MOBILE-SPECIFIC CARD ENHANCEMENTS
   Touch-optimized interactions for mobile devices
   =============================================== */

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
        console.log('📱 Enhanced Mobile Card System initialized');
    }

    isMobile() {
        return window.innerWidth <= 767;
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
        const content = card.querySelector('.card__content');
        const footer = card.querySelector('.card__footer');
        
        if (content && footer) {
            // Add mobile-specific classes
            content.classList.add('testimonial-content--mobile');
            footer.classList.add('testimonial-footer--mobile');

            // Truncate long testimonials on mobile
            if (this.isMobile()) {
                this.addReadMoreFunctionality(card, content);
            }
        }
    }

    addReadMoreFunctionality(card, content) {
        const text = content.textContent.trim();
        
        if (text.length > 120) {
            const truncatedText = text.substring(0, 120) + '...';
            const fullText = text;
            
            content.textContent = truncatedText;
            
            const readMoreBtn = document.createElement('button');
            readMoreBtn.className = 'read-more-btn';
            readMoreBtn.textContent = 'Ler mais';
            readMoreBtn.setAttribute('aria-expanded', 'false');
            
            content.appendChild(readMoreBtn);
            
            readMoreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanded = readMoreBtn.getAttribute('aria-expanded') === 'true';
                
                if (isExpanded) {
                    content.firstChild.textContent = truncatedText;
                    readMoreBtn.textContent = 'Ler mais';
                    readMoreBtn.setAttribute('aria-expanded', 'false');
                } else {
                    content.firstChild.textContent = fullText;
                    readMoreBtn.textContent = 'Ler menos';
                    readMoreBtn.setAttribute('aria-expanded', 'true');
                }
            });
        }
    }

    setupTouchInteractions() {
        this.cards.forEach(cardData => {
            const card = cardData.element;
            
            // Touch start
            card.addEventListener('touchstart', (e) => {
                this.touchStartY = e.touches[0].clientY;
                this.touchStartTime = Date.now();
                this.activeCard = cardData;
                
                card.classList.add('card--touching');
                
                // Haptic feedback if available
                if ('vibrate' in navigator) {
                    navigator.vibrate(10);
                }
            }, { passive: true });

            // Touch end
            card.addEventListener('touchend', (e) => {
                const touchEndY = e.changedTouches[0].clientY;
                const touchDuration = Date.now() - this.touchStartTime;
                const touchDistance = Math.abs(touchEndY - this.touchStartY);
                
                card.classList.remove('card--touching');
                
                // Detect tap vs scroll
                if (touchDuration < 300 && touchDistance < 10) {
                    this.handleCardTap(cardData);
                }
                
                this.activeCard = null;
            }, { passive: true });

            // Touch cancel
            card.addEventListener('touchcancel', () => {
                card.classList.remove('card--touching');
                this.activeCard = null;
            });

            // Focus interactions for accessibility
            card.addEventListener('focus', () => {
                card.classList.add('card--focused');
            });

            card.addEventListener('blur', () => {
                card.classList.remove('card--focused');
            });

            // Keyboard interactions
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleCardTap(cardData);
                }
            });
        });
    }

    handleCardTap(cardData) {
        const card = cardData.element;
        
        // Add interaction animation
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);

        // Handle different card types
        if (card.classList.contains('card--testimonial')) {
            this.handleTestimonialTap(cardData);
        }

        // Trigger custom event for analytics
        card.dispatchEvent(new CustomEvent('cardInteraction', {
            detail: {
                cardType: this.getCardType(card),
                index: cardData.index,
                timestamp: Date.now()
            }
        }));

        console.log('📱 Card tapped:', cardData.index);
    }

    handleTestimonialTap(cardData) {
        const card = cardData.element;
        
        // Add highlight effect
        card.classList.add('card--highlighted');
        setTimeout(() => {
            card.classList.remove('card--highlighted');
        }, 2000);
    }

    getCardType(card) {
        if (card.classList.contains('card--testimonial')) return 'testimonial';
        if (card.classList.contains('card--highlighted')) return 'highlighted';
        return 'default';
    }

    setupViewportObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const card = entry.target;
                    
                    if (entry.isIntersecting) {
                        card.classList.add('card--in-viewport', 'card--animated');
                        
                        // Stagger animation for multiple cards
                        const delay = parseInt(card.dataset.mobileIndex || 0) * 100;
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, delay);
                    } else {
                        card.classList.remove('card--in-viewport');
                    }
                });
            }, {
                threshold: 0.2,
                rootMargin: '50px'
            });

            this.cards.forEach(cardData => {
                observer.observe(cardData.element);
            });
        }
    }

    setupAccessibility() {
        // Announce dynamic content changes
        this.cards.forEach(cardData => {
            const card = cardData.element;
            
            card.addEventListener('cardInteraction', (e) => {
                // Announce interaction to screen readers
                const announcement = document.createElement('div');
                announcement.setAttribute('aria-live', 'polite');
                announcement.setAttribute('aria-atomic', 'true');
                announcement.className = 'sr-only';
                announcement.textContent = `Card ${e.detail.index + 1} activated`;
                
                document.body.appendChild(announcement);
                setTimeout(() => document.body.removeChild(announcement), 1000);
            });
        });
    }

    // Method to handle orientation change
    handleOrientationChange() {
        setTimeout(() => {
            this.cards.forEach(cardData => {
                const card = cardData.element;
                
                if (window.innerWidth <= 767) {
                    card.classList.add('card--mobile');
                    card.classList.remove('card--desktop');
                } else {
                    card.classList.remove('card--mobile');
                    card.classList.add('card--desktop');
                }
            });
        }, 100);
    }

    // Performance optimization: cleanup when not needed
    destroy() {
        this.cards.forEach(cardData => {
            const card = cardData.element;
            // Remove event listeners
            card.removeAttribute('data-mobile-index');
            card.removeAttribute('role');
            card.removeAttribute('tabindex');
        });
        console.log('📱 Mobile Card System destroyed');
    }
}

// Auto-initialize on mobile devices
let mobileCardSystem;

document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 767) {
        mobileCardSystem = new MobileCardSystem();
    }
});

// Handle orientation changes
window.addEventListener('orientationchange', () => {
    if (mobileCardSystem) {
        mobileCardSystem.handleOrientationChange();
    }
});

// Handle resize events
window.addEventListener('resize', () => {
    if (window.innerWidth <= 767 && !mobileCardSystem) {
        mobileCardSystem = new MobileCardSystem();
    } else if (window.innerWidth > 767 && mobileCardSystem) {
        mobileCardSystem.destroy();
        mobileCardSystem = null;
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (mobileCardSystem) {
        mobileCardSystem.destroy();
    }
});

export { MobileCardSystem };
