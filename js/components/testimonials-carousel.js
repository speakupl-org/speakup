/**
 * TESTIMONIALS CAROUSEL
 * Sophisticated, accessible carousel with subtle navigation
 */

class TestimonialsCarousel {
    constructor(sectionSelector, testimonials) {
        this.section = typeof sectionSelector === 'string' ? document.querySelector(`#${sectionSelector}`) : sectionSelector;
        this.testimonials = testimonials;
        this.currentIndex = 0;
        this.isAutoPlaying = true;
        this.autoPlayInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    init() {
        console.log('CAROUSEL.INIT_START');
        
        if (!this.section || !this.testimonials.length) {
            console.error('CAROUSEL.INIT_FAIL: Missing section or testimonials data', {
                section: this.section,
                testimonialsCount: this.testimonials?.length || 0
            });
            return;
        }
        
        this.container = this.section.querySelector('.testimonials-carousel-container');
        if (!this.container) {
            console.error('CAROUSEL.CONTAINER_FAIL: carousel container not found');
            return;
        }
        
        this.track = this.container.querySelector('.testimonials-track');
        this.indicators = this.container.querySelector('.carousel-indicators');
        this.navPrev = this.container.querySelector('.carousel-nav-prev');
        this.navNext = this.container.querySelector('.carousel-nav-next');
        
        console.log('CAROUSEL.ELEMENTS_FOUND:', {
            track: !!this.track,
            indicators: !!this.indicators,
            navPrev: !!this.navPrev,
            navNext: !!this.navNext
        });
        
        this.render();
        this.bindEvents();
        this.startAutoPlay();
        
        console.log('CAROUSEL.INIT_COMPLETE');
    }
    
    render() {
        // Clear existing content
        this.track.innerHTML = '';
        this.indicators.innerHTML = '';
        
        // Render testimonial slides
        this.testimonials.forEach((testimonial, index) => {
            const slide = this.createTestimonialSlide(testimonial, index);
            this.track.appendChild(slide);
            
            // Create indicator dot
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
            dot.setAttribute('data-index', index);
            this.indicators.appendChild(dot);
        });
        
        // Set initial active slide
        this.updateActiveSlide();
    }
    
    createTestimonialSlide(testimonial, index) {
        const slide = document.createElement('div');
        slide.className = `testimonial-slide ${index === 0 ? 'active' : ''}`;
        slide.setAttribute('data-index', index);
        
        slide.innerHTML = `
            <article class="card card--testimonial card--desktop card--mobile" 
                     data-variant="testimonial" 
                     data-mobile-optimized="true"
                     role="article" 
                     aria-label="Testimonial from ${testimonial.author}"
                     tabindex="0">
                <div class="card__content">
                    ${testimonial.content}
                </div>
                <div class="card__footer">
                    <p class="card__subtitle">- ${testimonial.author}</p>
                    <span class="testimonial-badge">${testimonial.role}</span>
                </div>
            </article>
        `;
        
        return slide;
    }
    
    bindEvents() {
        // Navigation clicks
        if (this.navPrev) {
            this.navPrev.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.navNext) {
            this.navNext.addEventListener('click', () => this.nextSlide());
        }
        
        // Indicator clicks
        this.indicators.addEventListener('click', (e) => {
            if (e.target.classList.contains('carousel-dot')) {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.goToSlide(index);
            }
        });
        
        // Pause auto-play on hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Touch events for mobile swipe
        this.track.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
            this.pauseAutoPlay();
        });
        
        this.track.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
            this.startAutoPlay();
        });
        
        // Keyboard navigation
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            }
        });
        
        // Pause auto-play when any element in carousel is focused
        this.container.addEventListener('focusin', () => this.pauseAutoPlay());
        this.container.addEventListener('focusout', () => this.startAutoPlay());
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.updateActiveSlide();
        this.resetAutoPlay();
    }
    
    prevSlide() {
        this.currentIndex = this.currentIndex === 0 ? this.testimonials.length - 1 : this.currentIndex - 1;
        this.updateActiveSlide();
        this.resetAutoPlay();
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.testimonials.length) {
            this.currentIndex = index;
            this.updateActiveSlide();
            this.resetAutoPlay();
        }
    }
    
    updateActiveSlide() {
        // Update slides
        const slides = this.track.querySelectorAll('.testimonial-slide');
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentIndex);
        });
        
        // Update indicators
        const dots = this.indicators.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
        
        // Update track position (for smoother animation)
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        
        // Update ARIA labels
        this.updateAriaLabels();
    }
    
    updateAriaLabels() {
        const activeSlide = this.track.querySelector('.testimonial-slide.active');
        if (activeSlide) {
            // Announce to screen readers
            const announcement = `Showing testimonial ${this.currentIndex + 1} of ${this.testimonials.length}`;
            this.announceToScreenReaders(announcement);
        }
    }
    
    announceToScreenReaders(message) {
        // Create or update live region for announcements
        let liveRegion = document.getElementById('carousel-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'carousel-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        }
        
        liveRegion.textContent = message;
    }
    
    startAutoPlay() {
        if (!this.isAutoPlaying) return;
        
        this.pauseAutoPlay(); // Clear any existing interval
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 6000); // 6 seconds per slide
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resetAutoPlay() {
        this.pauseAutoPlay();
        setTimeout(() => this.startAutoPlay(), 1000); // Brief pause after manual navigation
    }
    
    // Public methods for external control
    pause() {
        this.isAutoPlaying = false;
        this.pauseAutoPlay();
    }
    
    play() {
        this.isAutoPlaying = true;
        this.startAutoPlay();
    }
    
    destroy() {
        this.pauseAutoPlay();
        // Remove event listeners and clean up
        const liveRegion = document.getElementById('carousel-live-region');
        if (liveRegion) {
            liveRegion.remove();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestimonialsCarousel;
}

// Make available globally
window.TestimonialsCarousel = TestimonialsCarousel;
