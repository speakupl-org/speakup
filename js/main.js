// js/main.js - v4.0 Final Performance Build

document.addEventListener('DOMContentLoaded', () => {

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    /* --- REVEAL ON SCROLL --- */
    // Only run animations if the user has NOT requested reduced motion.
    if (!reducedMotionQuery.matches) {
        const animatedElements = document.querySelectorAll(
            '.hero-title, .hero-subtitle, .hero-cta, .empathetic-text, .section-title, ' +
            '.benefit-item, .about-teacher-container, .testimonial-card, .tally-form-wrapper, ' +
            '.post-quiz-cta-container, .final-cta-title, .reassurance-text'
        );
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));
    }

    /* --- UPDATE FOOTER YEAR --- */
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
