/**
 * SECTION NAVIGATION CONTROLLER
 * Clean implementation with precision debugging
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
        this.debug = true; // Toggle for debugging
        
        this.init();
    }
    
    log(action, data = null) {
        if (!this.debug) return;
        const timestamp = performance.now().toFixed(1);
        const prefix = `[${timestamp}ms] NAV.${action}:`;
        
        if (data) {
            console.log(prefix, data);
        } else {
            console.log(prefix);
        }
    }
    
    init() {
        this.sidebar = document.getElementById('sectionNav');
        
        if (!this.sidebar) {
            this.log('INIT_FAIL', 'element#sectionNav not found');
            return;
        }
        
        this.log('INIT_START', {
            sections: this.sections.length,
            element: this.sidebar.tagName
        });
        
        this.bindEvents();
        this.validateSections();
        this.updateActiveSection();
        this.updateProgress();
        
        this.log('INIT_COMPLETE');
    }
    
    validateSections() {
        const missing = [];
        this.sections.forEach((section, index) => {
            const element = document.getElementById(section.id);
            if (!element) {
                missing.push(`${index}:${section.id}`);
            }
        });
        
        if (missing.length > 0) {
            this.log('VALIDATION_FAIL', `missing sections: ${missing.join(', ')}`);
        } else {
            this.log('VALIDATION_PASS', `all ${this.sections.length} sections found`);
        }
    }
    
    bindEvents() {
        // Click handler
        this.sidebar.addEventListener('click', (e) => {
            e.preventDefault();
            const link = e.target.closest('.sidebar-nav-link');
            
            if (link) {
                const sectionIndex = parseInt(link.dataset.section);
                this.log('CLICK', `target=${sectionIndex} current=${this.currentSection}`);
                this.scrollToSection(sectionIndex);
            } else {
                this.log('CLICK_MISS', `target="${e.target.className}"`);
            }
        });
        
        // Scroll handler - only update when actually needed
        let lastKnownScroll = window.pageYOffset;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Only process if scroll actually changed significantly
            if (Math.abs(currentScroll - lastKnownScroll) > 10 && !this.isScrolling) {
                this.updateActiveSection();
                this.updateProgress();
                lastKnownScroll = currentScroll;
            }
        }, { passive: true });
        
        // Keyboard navigation
        this.sidebar.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
                const direction = e.key === 'ArrowUp' ? -1 : 1;
                const newIndex = Math.max(0, Math.min(this.sections.length - 1, this.currentSection + direction));
                this.log('KEYBOARD', `${e.key} ${this.currentSection}→${newIndex}`);
                this.scrollToSection(newIndex);
            }
        });
        
        this.log('EVENTS_BOUND', 'click|scroll|keyboard');
    }
    
    scrollToSection(index) {
        if (index < 0 || index >= this.sections.length) {
            this.log('SCROLL_BOUNDS_ERROR', `index=${index} max=${this.sections.length - 1}`);
            return;
        }
        
        const targetId = this.sections[index].id;
        const section = document.getElementById(targetId);
        
        if (!section) {
            this.log('SCROLL_ELEMENT_ERROR', `section#${targetId} not found in DOM`);
            return;
        }
        
        // Force layout recalculation
        section.offsetHeight;
        
        // Get positions using offsetTop for more reliable measurement
        const currentY = window.pageYOffset;
        let targetY = 0;
        
        // Use offsetTop which is more reliable than getBoundingClientRect
        let element = section;
        while (element) {
            targetY += element.offsetTop;
            element = element.offsetParent;
        }
        
        // Apply the offset
        targetY -= this.sections[index].offset;
        
        // Ensure we don't scroll to negative positions
        targetY = Math.max(0, targetY);
        
        // Diagnostic data
        const rect = section.getBoundingClientRect();
        const diagnostic = {
            target_id: targetId,
            target_index: index,
            current_scroll: Math.round(currentY),
            element_offsetTop: section.offsetTop,
            element_offsetParent: section.offsetParent?.tagName || 'null',
            calculated_absolute: Math.round(targetY + this.sections[index].offset),
            final_target: Math.round(targetY),
            rect_top: Math.round(rect.top),
            offset_applied: this.sections[index].offset,
            will_move: Math.round(targetY - currentY)
        };
        
        this.log('SCROLL_DIAGNOSTIC', diagnostic);
        
        this.isScrolling = true;
        this.currentSection = index;
        
        // Try multiple scroll methods for maximum compatibility
        try {
            // Check if Lenis smooth scroll is active and use it
            if (window.lenis && typeof window.lenis.scrollTo === 'function') {
                window.lenis.scrollTo(targetY, {
                    duration: 1.2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
                this.log('SCROLL_METHOD', 'using Lenis');
            } else {
                // Method 1: Modern scrollTo with behavior
                window.scrollTo({
                    top: targetY,
                    behavior: 'smooth'
                });
                this.log('SCROLL_METHOD', 'using window.scrollTo smooth');
                
                // Method 2: Fallback for older browsers or if smooth fails
                setTimeout(() => {
                    if (Math.abs(window.pageYOffset - currentY) < 10) {
                        // Smooth scroll didn't work, try instant scroll
                        window.scrollTo(0, targetY);
                        this.log('SCROLL_FALLBACK', 'used instant scroll');
                    }
                }, 200);
                
                // Method 3: Force scroll using document element
                setTimeout(() => {
                    if (Math.abs(window.pageYOffset - currentY) < 10) {
                        document.documentElement.scrollTop = targetY;
                        document.body.scrollTop = targetY; // For Safari
                        this.log('SCROLL_FALLBACK', 'used direct scrollTop');
                    }
                }, 500);
            }
            
        } catch (error) {
            this.log('SCROLL_ERROR', error.message);
            // Emergency fallback
            document.documentElement.scrollTop = targetY;
        }
        
        this.updateActiveLink();
        
        // Verify after scroll completes
        setTimeout(() => {
            const finalY = window.pageYOffset;
            const success = Math.abs(finalY - targetY) < 50; // 50px tolerance
            
            this.log('SCROLL_RESULT', {
                expected: Math.round(targetY),
                actual: Math.round(finalY),
                difference: Math.round(finalY - targetY),
                success: success
            });
            
            this.isScrolling = false;
        }, 1000);
    }
    
    updateActiveSection() {
        const currentScroll = window.pageYOffset;
        const viewportMiddle = currentScroll + (window.innerHeight / 2);
        
        let newActiveSection = 0;
        
        // Find which section the viewport middle is currently in
        for (let i = 0; i < this.sections.length; i++) {
            const element = document.getElementById(this.sections[i].id);
            if (!element) continue;
            
            const rect = element.getBoundingClientRect();
            const sectionTop = currentScroll + rect.top;
            const sectionBottom = sectionTop + rect.height;
            
            // If viewport middle is within this section, this is our active section
            if (viewportMiddle >= sectionTop && viewportMiddle < sectionBottom) {
                newActiveSection = i;
                break;
            }
            
            // If viewport middle is past this section, keep this as candidate
            if (viewportMiddle >= sectionTop) {
                newActiveSection = i;
            }
        }
        
        // Only update if section actually changed
        if (newActiveSection !== this.currentSection) {
            this.log('SECTION_CHANGE', {
                from: this.sections[this.currentSection].id,
                to: this.sections[newActiveSection].id,
                scroll: Math.round(currentScroll),
                viewport_middle: Math.round(viewportMiddle)
            });
            
            this.currentSection = newActiveSection;
            this.updateActiveLink();
        }
    }
    
    updateActiveLink() {
        const links = this.sidebar.querySelectorAll('.sidebar-nav-link');
        let activeCount = 0;
        
        links.forEach(link => {
            const wasActive = link.classList.contains('active');
            link.classList.remove('active');
            if (wasActive) activeCount++;
        });
        
        const activeLink = this.sidebar.querySelector(`[data-section="${this.currentSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            this.log('ACTIVE_SET', `section=${this.currentSection} cleared=${activeCount}`);
        } else {
            this.log('ACTIVE_FAIL', `no link for section=${this.currentSection}`);
        }
    }
    
    updateProgress() {
        const progress = document.getElementById('scrollProgress');
        if (!progress) {
            this.log('PROGRESS_FAIL', 'element#scrollProgress not found');
            return;
        }
        
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = Math.min((scrollTop / docHeight) * 100, 100);
        
        // Fix: Use CSS custom property instead of height
        progress.style.setProperty('--progress', `${scrollProgress}%`);
        
        if (scrollProgress % 25 === 0) { // Log every 25%
            this.log('PROGRESS', `${Math.round(scrollProgress)}%`);
        }
    }
    
    // Public API with diagnostics
    goToSection(index) {
        this.log('API_CALL', `goToSection(${index})`);
        this.scrollToSection(index);
    }
    
    getCurrentSection() {
        return this.currentSection;
    }
    
    toggleDebug() {
        this.debug = !this.debug;
        this.log('DEBUG_TOGGLE', this.debug ? 'enabled' : 'disabled');
        return this.debug;
    }
    
    getStats() {
        return {
            currentSection: this.currentSection,
            totalSections: this.sections.length,
            isScrolling: this.isScrolling,
            scrollY: Math.round(window.pageYOffset)
        };
    }
    
    // Emergency diagnostic - run this to see all sections
    diagnoseAllSections() {
        console.log('=== SECTION DIAGNOSTIC REPORT ===');
        this.sections.forEach((section, index) => {
            const element = document.getElementById(section.id);
            if (element) {
                // Force layout recalculation
                element.offsetHeight;
                
                const rect = element.getBoundingClientRect();
                let absoluteTop = 0;
                let current = element;
                while (current) {
                    absoluteTop += current.offsetTop;
                    current = current.offsetParent;
                }
                
                console.log(`${index}: #${section.id}`);
                console.log(`  offsetTop: ${element.offsetTop}`);
                console.log(`  absoluteTop: ${Math.round(absoluteTop)}`);
                console.log(`  rect.top: ${Math.round(rect.top)}`);
                console.log(`  height: ${Math.round(rect.height)}`);
                console.log(`  offsetParent: ${element.offsetParent?.tagName || 'null'}`);
                console.log(`  target would be: ${Math.round(absoluteTop - section.offset)}`);
            } else {
                console.log(`${index}: #${section.id} | MISSING FROM DOM`);
            }
        });
        console.log('Current scroll:', Math.round(window.pageYOffset));
        console.log('Document height:', Math.round(document.documentElement.scrollHeight));
        console.log('Viewport height:', Math.round(window.innerHeight));
        console.log('=== END DIAGNOSTIC ===');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('sectionNav')) {
        window.sectionNavigation = new SectionNavigation();
        
        // Development helper
        if (window.location.hostname === 'localhost') {
            console.log('NAV.DEV_MODE: Use sectionNavigation.toggleDebug() to control logging');
            console.log('NAV.DEV_MODE: Use sectionNavigation.getStats() for current state');
        }
    }
});

// Module exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SectionNavigation;
}

window.SectionNavigation = SectionNavigation;
