// Desktop-specific Card Component
// Future: This will be packages/ui-desktop/src/Card/Card.js

import { BaseCard } from '../base/card.js';

class DesktopCard extends BaseCard {
    constructor(element, options = {}) {
        const desktopOptions = {
            ...options,
            animations: true,
            hoverEffects: true,
            contextMenu: true
        };
        
        super(element, desktopOptions);
        this.initDesktopFeatures();
    }

    initDesktopFeatures() {
        this.setupHoverEffects();
        this.setupContextMenu();
        this.setupKeyboardShortcuts();
        this.setupDesktopAnimations();
    }

    setupHoverEffects() {
        if (!this.options.hoverEffects) return;

        let hoverTimeout;

        this.element.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
            this.element.classList.add('card--hover');
            
            // Preload content on hover for better UX
            this.preloadContent();
        });

        this.element.addEventListener('mouseleave', () => {
            hoverTimeout = setTimeout(() => {
                this.element.classList.remove('card--hover');
            }, 150);
        });

        // Enhanced focus states for keyboard navigation
        this.element.addEventListener('focus', () => {
            this.element.classList.add('card--focused');
        });

        this.element.addEventListener('blur', () => {
            this.element.classList.remove('card--focused');
        });
    }

    setupContextMenu() {
        if (!this.options.contextMenu) return;

        this.element.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            this.showContextMenu(event.clientX, event.clientY);
        });
    }

    setupKeyboardShortcuts() {
        this.element.addEventListener('keydown', (event) => {
            // Desktop-specific shortcuts
            if (event.ctrlKey || event.metaKey) {
                switch (event.key) {
                    case 'c':
                        event.preventDefault();
                        this.copyCardContent();
                        break;
                    case 's':
                        event.preventDefault();
                        this.saveCard();
                        break;
                }
            }
        });
    }

    setupDesktopAnimations() {
        // GSAP animations for desktop (leveraging existing GSAP)
        if (typeof gsap !== 'undefined') {
            // Entrance animation
            gsap.set(this.element, { y: 20, opacity: 0 });
            
            // Animate in when visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        gsap.to(this.element, {
                            y: 0,
                            opacity: 1,
                            duration: 0.6,
                            ease: "power2.out",
                            delay: Math.random() * 0.2 // Stagger effect
                        });
                        observer.unobserve(this.element);
                    }
                });
            });
            observer.observe(this.element);
        }
    }

    showContextMenu(x, y) {
        // Create context menu for desktop interactions
        const menu = this.createElement('div', 'card-context-menu');
        menu.innerHTML = `
            <button class="context-menu-item" data-action="share">
                <span class="icon">🔗</span> Compartilhar
            </button>
            <button class="context-menu-item" data-action="save">
                <span class="icon">💾</span> Salvar
            </button>
            <button class="context-menu-item" data-action="copy">
                <span class="icon">📋</span> Copiar Link
            </button>
        `;

        menu.style.cssText = `
            position: fixed;
            top: ${y}px;
            left: ${x}px;
            background: var(--color-surface-dark);
            border: 1px solid var(--color-primary-vibrant);
            border-radius: 8px;
            padding: 0.5rem 0;
            box-shadow: var(--shadow-subtle);
            z-index: 1000;
        `;

        document.body.appendChild(menu);

        // Handle menu clicks
        menu.addEventListener('click', (event) => {
            const action = event.target.closest('[data-action]')?.dataset.action;
            if (action) {
                this.handleContextMenuAction(action);
            }
            this.closeContextMenu(menu);
        });

        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', () => this.closeContextMenu(menu), { once: true });
        }, 0);
    }

    closeContextMenu(menu) {
        if (menu && menu.parentNode) {
            menu.parentNode.removeChild(menu);
        }
    }

    handleContextMenuAction(action) {
        switch (action) {
            case 'share':
                this.shareCard();
                break;
            case 'save':
                this.saveCard();
                break;
            case 'copy':
                this.copyCardContent();
                break;
        }
    }

    preloadContent() {
        // Preload related content on hover for faster navigation
        const relatedLinks = this.element.querySelectorAll('a[href]');
        relatedLinks.forEach(link => {
            if (link.href.startsWith(window.location.origin)) {
                // Preload internal links
                const preloadLink = document.createElement('link');
                preloadLink.rel = 'prefetch';
                preloadLink.href = link.href;
                document.head.appendChild(preloadLink);
            }
        });
    }

    shareCard() {
        if (navigator.share) {
            const cardTitle = this.element.querySelector('.card__title')?.textContent;
            const cardContent = this.element.querySelector('.card__content')?.textContent;
            
            navigator.share({
                title: cardTitle || 'Speak Up',
                text: cardContent?.substring(0, 200) + '...',
                url: window.location.href
            });
        } else {
            this.copyCardContent();
        }
    }

    saveCard() {
        // Future: Save to user's collection
        console.log('💾 Card saved for later reading');
        this.showNotification('Card salvo com sucesso!');
    }

    copyCardContent() {
        const cardTitle = this.element.querySelector('.card__title')?.textContent;
        const cardContent = this.element.querySelector('.card__content')?.textContent;
        const content = `${cardTitle}\n\n${cardContent}\n\n${window.location.href}`;
        
        navigator.clipboard.writeText(content).then(() => {
            this.showNotification('Conteúdo copiado!');
        });
    }

    showNotification(message) {
        const notification = this.createElement('div', 'desktop-notification');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-primary-vibrant);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: var(--shadow-subtle);
            z-index: 1001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Auto-initialize desktop cards
if (window.innerWidth >= 768) {
    document.addEventListener('DOMContentLoaded', () => {
        const cards = document.querySelectorAll('.card:not([data-mobile-only])');
        cards.forEach(card => {
            const options = {
                variant: card.dataset.variant || 'default',
                interactive: card.dataset.interactive !== 'false'
            };
            new DesktopCard(card, options);
        });
    });
}

export { DesktopCard };
