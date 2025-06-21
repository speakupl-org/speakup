/**
 * SECTION NAVIGATI    init() {
        console.log('🎯 Initializing section navigation...');
        console.log('📍 Available sections:', this.sections);
        
        this.createSidebarHTML();
        this.bindEvents();
        this.updateActiveSection();
        
        // Handle initial load and resize
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
        
        console.log('✨ Section navigation initialized successfully');
        
        // Additional debugging
        setTimeout(() => {
            const sidebar = document.getElementById('sectionNav');
            if (sidebar) {
                console.log('🔍 Sidebar element found:', sidebar);
                console.log('🎨 Sidebar computed styles:', window.getComputedStyle(sidebar).display);
                console.log('📏 Sidebar dimensions:', {
                    width: sidebar.offsetWidth,
                    height: sidebar.offsetHeight,
                    left: sidebar.offsetLeft,
                    top: sidebar.offsetTop
                });
            } else {
                console.error('❌ Sidebar element not found in DOM');
            }
        }, 500);
    }Subtle, sophisticated navigation within page sections
 */

class SectionNavigation {
    constructor() {
        this.sections = [
            { id: 'hero', label: 'Início', offset: 0 },
            { id: 'the-block', label: 'O Bloqueio', offset: 100 },
            { id: 'the-shift', label: 'A Mudança', offset: 100 },
            { id: 'the-guide', label: 'O Guia', offset: 100 },
            { id: 'testimonials', label: 'Depoimentos', offset: 100 },
            { id: 'final-cta', label: 'Conversa', offset: 100 }
        ];
        
        this.currentSection = 0;
        this.isScrolling = false;
        this.sidebar = null;
        
        this.init();
    }
    
    init() {
        console.log('🚀 Initializing Section Navigation...');
        console.log('📍 Sections to create:', this.sections);
        
        this.createSidebarHTML();
        this.bindEvents();
        this.updateActiveSection();
        
        // Handle initial load and resize
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
        
        console.log('✨ Section navigation initialized successfully');
    }
    
    createSidebarHTML() {
        const sidebarHTML = `
            <nav class="sidebar-nav" id="sectionNav" role="navigation" aria-label="Page sections">
                <div class="sidebar-progress" id="scrollProgress"></div>
                <div class="sidebar-nav-trigger"></div>
                
                <div class="sidebar-nav-menu">
                    <ul class="sidebar-nav-list">
                        ${this.sections.map((section, index) => `
                            <li class="sidebar-nav-item">
                                <a href="#${section.id}" 
                                   class="sidebar-nav-link" 
                                   data-section="${index}"
                                   aria-label="Go to ${section.label}">
                                    <div class="sidebar-nav-dot"></div>
                                    <span class="sidebar-nav-text">${section.label}</span>
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </nav>
        `;
        
        console.log('🔧 Creating sidebar navigation with sections:', this.sections);
        document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
        this.sidebar = document.getElementById('sectionNav');
        
        if (this.sidebar) {
            console.log('✅ Sidebar navigation created successfully');
        } else {
            console.error('❌ Failed to create sidebar navigation');
        }
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
        
        // Initial progress update
        this.updateProgress();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    scrollToSection(index) {
        if (index < 0 || index >= this.sections.length) return;
        
        const section = document.getElementById(this.sections[index].id);
        if (!section) return;
        
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
    
    handleResize() {
        console.log('📱 Window resized, current width:', window.innerWidth);
        // Update responsive behavior if needed
        const sidebar = document.getElementById('sectionNav');
        if (sidebar) {
            console.log('📏 Sidebar still visible after resize');
        }
    }
    
    // Public methods
    goToSection(index) {
        this.scrollToSection(index);
    }
    
    getCurrentSection() {
        return this.currentSection;
    }
    
    destroy() {
        if (this.sidebar) {
            this.sidebar.remove();
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on pages that have sections
    if (document.getElementById('hero')) {
        console.log('🎯 Hero section found, initializing section navigation...');
        window.sectionNavigation = new SectionNavigation();
    } else {
        console.log('ℹ️ Hero section not found, skipping section navigation');
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SectionNavigation;
}

// Make available globally
window.SectionNavigation = SectionNavigation;
