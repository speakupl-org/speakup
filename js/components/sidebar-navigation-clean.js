/**
 * SECTION NAVIGATION SIDEBAR
 * Handles functionality for the static HTML sidebar
 */

class SectionNavigation {
    constructor() {
        this.sections = [
            { id: 'hero', offset: 0 },
            { id: 'the-block', offset: 100 },
            { id: 'the-shift', offset: 100 },
            { id: 'the-guide', offset: 100 },
            { id: 'testimonials', offset: 100 },
            { id: 'final-cta', offset: 100 }
        ];
        
        this.currentSection = 0;
        this.isScrolling = false;
        this.sidebar = null;
        
        this.init();
    }
    
    init() {
        // Get the existing sidebar from HTML
        this.sidebar = document.getElementById('sectionNav');
        
        if (!this.sidebar) {
            console.warn('Section navigation sidebar not found in HTML');
            return;
        }
        
        console.log('✨ Section navigation found, binding events...');
        
        this.bindEvents();
        this.updateActiveSection();
        this.updateProgress();
        
        console.log('✅ Section navigation initialized successfully');
    }
    
    bindEvents() {
        // Smooth scroll to sections
        this.sidebar.addEventListener('click', (e) => {
            e.preventDefault();
            const link = e.target.closest('.sidebar-nav-link');
            if (link) {
                const sectionIndex = parseInt(link.dataset.section);
                this.scrollToSection(sectionIndex);
            }
        });
        
        // Update active section on scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (!this.isScrolling) {
                    this.updateActiveSection();
                    this.updateProgress();
                }
            }, 50);
        }, { passive: true });
        
        // Keyboard navigation
        this.sidebar.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
                const direction = e.key === 'ArrowUp' ? -1 : 1;
                const newIndex = Math.max(0, Math.min(this.sections.length - 1, this.currentSection + direction));
                this.scrollToSection(newIndex);
            }
        });
    }
    
    scrollToSection(index) {
        if (index < 0 || index >= this.sections.length) return;
        
        const section = document.getElementById(this.sections[index].id);
        if (!section) {
            console.warn(`Section ${this.sections[index].id} not found`);
            return;
        }
        
        console.log(`📍 Scrolling to section: ${this.sections[index].id}`);
        
        this.isScrolling = true;
        this.currentSection = index;
        
        const rect = section.getBoundingClientRect();
        const offsetTop = window.pageYOffset + rect.top - this.sections[index].offset;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Update immediately for smooth interaction
        this.updateActiveLink();
        
        // Reset scrolling flag after animation
        setTimeout(() => {
            this.isScrolling = false;
        }, 1000);
    }
    
    updateActiveSection() {
        let activeIndex = 0;
        const scrollPosition = window.pageYOffset + 200; // Offset for better detection
        
        for (let i = this.sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(this.sections[i].id);
            if (section) {
                const rect = section.getBoundingClientRect();
                const sectionTop = window.pageYOffset + rect.top;
                
                if (scrollPosition >= sectionTop) {
                    activeIndex = i;
                    break;
                }
            }
        }
        
        if (activeIndex !== this.currentSection) {
            this.currentSection = activeIndex;
            this.updateActiveLink();
        }
    }
    
    updateActiveLink() {
        // Remove all active classes
        this.sidebar.querySelectorAll('.sidebar-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current section
        const activeLink = this.sidebar.querySelector(`[data-section="${this.currentSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            console.log(`🎯 Active section: ${this.sections[this.currentSection].id}`);
        }
    }
    
    updateProgress() {
        const progress = document.getElementById('scrollProgress');
        if (!progress) return;
        
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = Math.min((scrollTop / docHeight) * 100, 100);
        
        progress.style.height = `${scrollProgress}%`;
    }
    
    // Public methods
    goToSection(index) {
        this.scrollToSection(index);
    }
    
    getCurrentSection() {
        return this.currentSection;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, checking for section navigation...');
    
    // Only initialize on pages that have the sidebar
    if (document.getElementById('sectionNav')) {
        window.sectionNavigation = new SectionNavigation();
    } else {
        console.log('ℹ️ No section navigation found on this page');
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SectionNavigation;
}

// Make available globally
window.SectionNavigation = SectionNavigation;
