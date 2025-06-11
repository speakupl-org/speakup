// js/main.js - v4.1 (with FOUC Fix)

document.addEventListener('DOMContentLoaded', () => {

    // --- REVEAL THE PAGE (FOUC FIX) ---
    // This removes the inline style from the <head>, making the page visible.
    // The transition in the inline style makes it fade in smoothly.
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';


    // --- ACCESSIBILITY CHECK ---
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');


    // --- REVEAL ON SCROLL ANIMATION LOGIC ---
    // Only set up the animation observer if the user has NOT requested reduced motion.
    if (!reducedMotionQuery.matches) {
        const animatedElements = document.querySelectorAll(
            '.hero-title, .hero-subtitle, .hero-cta, .empathetic-text, .section-title, ' +
            '.benefit-item, .about-teacher-container, .testimonial-card, .tally-form-wrapper, ' +
            '.post-quiz-cta-container, .final-cta-title, .reassurance-text'
        );
        
        // This is the Intersection Observer that triggers the 'in-view' class
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target); // Stop observing after animation
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

        // Tell the observer to watch each of the selected elements
        animatedElements.forEach(el => observer.observe(el));
    }

    // --- UPDATE FOOTER YEAR ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
