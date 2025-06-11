// js/main.js - Professional Dark Theme v3.0

document.addEventListener('DOMContentLoaded', () => {

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animationsEnabled = !reducedMotionQuery.matches;

    reducedMotionQuery.addEventListener('change', () => {
        animationsEnabled = !reducedMotionQuery.matches;
    });

    /* --- REVEAL ON SCROLL --- */
    const animatedElements = document.querySelectorAll(
        '.hero-title, .hero-subtitle, .hero-cta, .empathetic-text, .section-title, ' +
        '.benefit-item, .about-teacher-container, .testimonial-card, .tally-form-wrapper, ' +
        '.post-quiz-cta-container, .final-cta-title, .reassurance-text'
    );
    
    // Create one observer for all elements
    if (animationsEnabled && animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target); // Unobserve after animating
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));
    } else {
        animatedElements.forEach(el => el.classList.add('in-view')); // Make visible without animation
    }
    
    /* --- INTERACTIVE PARALLAX --- */
    const body = document.body;

    function handleScroll() {
        if (!animationsEnabled) return;
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        
        // You can tweak these values to change the speed and direction of the blobs
        body.style.setProperty('--blob-x', `${scrollPercent * -50}vw`);
        body.style.setProperty('--blob-y', `${scrollPercent * 30}vh`);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    /* --- UPDATE FOOTER YEAR --- */
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
