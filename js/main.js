// js/main.js - v5.0 Lightweight Final

document.addEventListener('DOMContentLoaded', () => {

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Only set up the animation observer if the user has NOT requested reduced motion.
    if (!reducedMotionQuery.matches) {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
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

    // Update Footer Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
