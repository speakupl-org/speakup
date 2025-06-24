/**
 * Mobile Section Ring Navigation
 * 
 * A minimalistic circular progress tracker and section navigation tool for mobile devices.
 * Features:
 * - Dormant mode: Half-ring showing scroll progress
 * - Interactive mode: Full ring with section navigation (above, current, below)
 * - Smooth transitions and mobile-optimized touch interactions
 * - Integrates with website's color palette
 */

export class SectionRingNav {
    constructor() {
        this.sections = [];
        this.currentSection = 0;
        this.isExpanded = false;
        this.isInteracting = false;
        this.scrollProgress = 0;
        this.container = null;
        this.progressRing = null;
        this.sectionLabels = null;
        
        // Interaction timers
        this.interactionTimeout = null;
        this.expandTimeout = null;
        
        // Scroll tracking
        this.lastScrollY = 0;
        this.ticking = false;
        
        // Touch/wheel navigation
        this.lastTouchY = 0;
        this.touchStartY = 0;
        this.wheelDelta = 0;
    }

    init() {
        // Temporarily allow on all devices for testing
        console.log('SectionRingNav: Starting initialization, viewport width:', window.innerWidth);
        
        this.detectSections();
        if (this.sections.length === 0) {
            console.log('SectionRingNav: No sections found');
            return;
        }
        
        this.createNavigation();
        this.bindEvents();
        this.updateProgress();
        
        console.log('SectionRingNav initialized with', this.sections.length, 'sections');
    }

    detectSections() {
        // Find all main sections with IDs
        const sectionSelectors = ['#hero', '#the-block', '#the-shift', '#the-guide', '#testimonials', '#final-cta'];
        
        this.sections = sectionSelectors.map((selector, index) => {
            const element = document.querySelector(selector);
            if (!element) return null;
            
            const rect = element.getBoundingClientRect();
            const title = this.getSectionTitle(element);
            
            return {
                id: element.id,
                element,
                title,
                index,
                top: element.offsetTop,
                height: element.offsetHeight
            };
        }).filter(Boolean);
    }

    getSectionTitle(section) {
        // Create friendly section names
        const titles = {
            'hero': 'Início',
            'the-block': 'O Bloqueio', 
            'the-shift': 'A Solução',
            'the-guide': 'Seu Guia',
            'testimonials': 'Depoimentos',
            'final-cta': 'Comece Agora'
        };
        
        return titles[section.id] || section.id;
    }

    createNavigation() {
        // Create the main container
        this.container = document.createElement('div');
        this.container.className = 'section-ring-nav';
        this.container.innerHTML = `
            <div class="ring-progress">
                <svg class="ring-svg" viewBox="0 0 36 36">
                    <circle class="ring-background" cx="18" cy="18" r="16" 
                            fill="none" stroke="rgba(226, 232, 240, 0.1)" stroke-width="2"/>
                    <circle class="ring-progress-bar" cx="18" cy="18" r="16" 
                            fill="none" stroke="var(--color-primary-vibrant)" stroke-width="2"
                            stroke-dasharray="100 100" stroke-dashoffset="100"/>
                </svg>
                <div class="ring-center"></div>
            </div>
            <div class="section-labels">
                <div class="label label-above"></div>
                <div class="label label-current"></div>
                <div class="label label-below"></div>
            </div>
        `;

        this.progressRing = this.container.querySelector('.ring-progress-bar');
        this.sectionLabels = this.container.querySelector('.section-labels');
        
        document.body.appendChild(this.container);
    }

    bindEvents() {
        // Touch/click interactions
        this.container.addEventListener('click', this.handleTap.bind(this));
        this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.container.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        this.container.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
        
        // Scroll tracking
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Section label clicks
        this.sectionLabels.addEventListener('click', this.handleLabelClick.bind(this));
    }

    handleTap(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (!this.isExpanded) {
            this.expand();
        } else {
            // If tapped on center, scroll to current section
            const rect = this.container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
            );
            
            if (distance < 20) {
                this.navigateToSection(this.currentSection);
                this.collapse();
            }
        }
    }

    handleTouchStart(e) {
        if (e.touches.length === 1) {
            this.touchStartY = e.touches[0].clientY;
            this.lastTouchY = this.touchStartY;
            e.preventDefault();
        }
    }

    handleTouchMove(e) {
        if (e.touches.length === 1 && this.isExpanded) {
            const touchY = e.touches[0].clientY;
            const deltaY = this.lastTouchY - touchY;
            
            if (Math.abs(deltaY) > 10) {
                if (deltaY > 0 && this.currentSection < this.sections.length - 1) {
                    this.navigateToSection(this.currentSection + 1);
                    this.collapse();
                } else if (deltaY < 0 && this.currentSection > 0) {
                    this.navigateToSection(this.currentSection - 1);
                    this.collapse();
                }
                this.lastTouchY = touchY;
            }
            e.preventDefault();
        }
    }

    handleTouchEnd(e) {
        this.touchStartY = 0;
        this.lastTouchY = 0;
    }

    handleWheel(e) {
        if (this.isExpanded) {
            e.preventDefault();
            this.wheelDelta += e.deltaY;
            
            if (Math.abs(this.wheelDelta) > 50) {
                if (this.wheelDelta > 0 && this.currentSection < this.sections.length - 1) {
                    this.navigateToSection(this.currentSection + 1);
                } else if (this.wheelDelta < 0 && this.currentSection > 0) {
                    this.navigateToSection(this.currentSection - 1);
                }
                this.wheelDelta = 0;
                this.collapse();
            }
        }
    }

    handleLabelClick(e) {
        const label = e.target.closest('.label');
        if (!label) return;
        
        e.stopPropagation();
        
        if (label.classList.contains('label-above') && this.currentSection > 0) {
            this.navigateToSection(this.currentSection - 1);
        } else if (label.classList.contains('label-below') && this.currentSection < this.sections.length - 1) {
            this.navigateToSection(this.currentSection + 1);
        } else if (label.classList.contains('label-current')) {
            this.navigateToSection(this.currentSection);
        }
        
        this.collapse();
    }

    handleScroll() {
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.updateProgress();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    handleResize() {
        // Re-initialize if switching between mobile/desktop
        if (window.innerWidth >= 768 && this.container) {
            this.destroy();
        } else if (window.innerWidth < 768 && !this.container) {
            this.init();
        }
    }

    updateProgress() {
        // Calculate scroll progress
        const scrollTop = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        this.scrollProgress = documentHeight > 0 ? Math.min(scrollTop / documentHeight, 1) : 0;
        
        // Update progress ring (stroke-dashoffset: 100 = empty, 0 = full)
        const dashOffset = 100 - (this.scrollProgress * 100);
        this.progressRing.style.strokeDashoffset = dashOffset;
        
        // Update current section
        this.updateCurrentSection();
        
        // Update labels if expanded
        if (this.isExpanded) {
            this.updateSectionLabels();
        }
    }

    updateCurrentSection() {
        const viewportCenter = window.scrollY + window.innerHeight / 2;
        let newCurrentSection = 0;
        
        for (let i = 0; i < this.sections.length; i++) {
            const section = this.sections[i];
            if (viewportCenter >= section.top) {
                newCurrentSection = i;
            }
        }
        
        if (newCurrentSection !== this.currentSection) {
            this.currentSection = newCurrentSection;
            if (this.isExpanded) {
                this.updateSectionLabels();
            }
        }
    }

    updateSectionLabels() {
        const labels = {
            above: this.container.querySelector('.label-above'),
            current: this.container.querySelector('.label-current'),
            below: this.container.querySelector('.label-below')
        };
        
        // Above section
        if (this.currentSection > 0) {
            labels.above.textContent = this.sections[this.currentSection - 1].title;
            labels.above.style.opacity = '1';
            labels.above.style.pointerEvents = 'auto';
        } else {
            labels.above.style.opacity = '0.3';
            labels.above.style.pointerEvents = 'none';
            labels.above.textContent = '';
        }
        
        // Current section
        labels.current.textContent = this.sections[this.currentSection].title;
        
        // Below section
        if (this.currentSection < this.sections.length - 1) {
            labels.below.textContent = this.sections[this.currentSection + 1].title;
            labels.below.style.opacity = '1';
            labels.below.style.pointerEvents = 'auto';
        } else {
            labels.below.style.opacity = '0.3';
            labels.below.style.pointerEvents = 'none';
            labels.below.textContent = '';
        }
    }

    expand() {
        if (this.isExpanded) return;
        
        this.isExpanded = true;
        this.container.classList.add('expanded');
        this.updateSectionLabels();
        this.wheelDelta = 0; // Reset wheel delta
        
        // Auto-collapse after 4 seconds
        clearTimeout(this.expandTimeout);
        this.expandTimeout = setTimeout(() => {
            this.collapse();
        }, 4000);
    }

    collapse() {
        if (!this.isExpanded) return;
        
        this.isExpanded = false;
        this.container.classList.remove('expanded');
        
        clearTimeout(this.expandTimeout);
    }

    navigateToSection(index) {
        if (index < 0 || index >= this.sections.length) return;
        
        const section = this.sections[index];
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 75;
        const targetTop = section.top - headerHeight - 20;
        
        // Smoother navigation with easing
        const startTime = performance.now();
        const startPosition = window.scrollY;
        const distance = Math.max(0, targetTop) - startPosition;
        const duration = Math.min(800, Math.abs(distance) * 0.5 + 300);
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Smooth easing function
            const easeProgress = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            const currentPosition = startPosition + (distance * easeProgress);
            window.scrollTo(0, currentPosition);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
        this.currentSection = index;
    }

    destroy() {
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        
        clearTimeout(this.interactionTimeout);
        clearTimeout(this.expandTimeout);
        
        window.removeEventListener('scroll', this.handleScroll.bind(this));
        window.removeEventListener('resize', this.handleResize.bind(this));
    }
}
