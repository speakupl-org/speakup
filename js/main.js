// js/main.js - v5.0 (Precision Targeting)

document.addEventListener('DOMContentLoaded', () => {

    // PASTE THE NEW CODE HERE

    const mainNav = document.querySelector('.main-nav');
    const navToggle = document.querySelector('.mobile-nav-toggle');

    navToggle.addEventListener('click', () => {
        const isVisible = mainNav.getAttribute('data-visible');

        if (isVisible === 'false') {
            mainNav.setAttribute('data-visible', true);
            navToggle.setAttribute('aria-expanded', true);
        } else {
            mainNav.setAttribute('data-visible', false);
            navToggle.setAttribute('aria-expanded', false);
        }
    });


    // The existing footer year code should follow
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // ...etc
});
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Only set up animations if the user has NOT requested reduced motion.
    if (!reducedMotionQuery.matches) {
        // Find ALL elements that are marked for animation.
        const animatedElements = document.querySelectorAll('.animate-me');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // When one comes into view, add the 'in-view' class to trigger the CSS animation.
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Tell the observer to watch all of the marked elements.
        animatedElements.forEach(el => observer.observe(el));
    }

    // Update Footer Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
