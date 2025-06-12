// js/main.js - FULL AND CORRECTED FILE

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation System --- //
    const mainNav = document.getElementById('primary-navigation');
    const navToggle = document.querySelector('.mobile-nav-toggle');

    if (navToggle) { // Check if the toggle exists before adding a listener
        navToggle.addEventListener('click', () => {
            const isVisible = mainNav.getAttribute('data-visible');
    
            if (isVisible === 'false' || isVisible === null) {
                mainNav.setAttribute('data-visible', true);
                navToggle.setAttribute('aria-expanded', true);
            } else {
                mainNav.setAttribute('data-visible', false);
                navToggle.setAttribute('aria-expanded', false);
            }
        });
    }


    // --- Fix for Horizontal Scroll on Mobile --- //
    // I believe this might be missing or incorrect in your CSS,
    // we will double check it in the CSS section below.


    // --- Animation Logic --- //
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!reducedMotionQuery.matches) {
        const animatedElements = document.querySelectorAll('.animate-me');
        
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


    // --- Update Footer Year --- //
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
