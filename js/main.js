// js/main.js - THE FINAL VERSION

document.addEventListener('DOMContentLoaded', () => {

    // --- Definitive Mobile Navigation System --- //
    const mainNav = document.getElementById('primary-navigation');
    const navToggle = document.querySelector('.mobile-nav-toggle');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const isVisible = mainNav.hasAttribute('data-visible');
    
            if (!isVisible) {
                mainNav.setAttribute('data-visible', 'true');
                navToggle.setAttribute('aria-expanded', 'true');
                document.body.classList.add('no-scroll'); // CRITICAL: Stop body scroll
            } else {
                mainNav.removeAttribute('data-visible');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('no-scroll'); // CRITICAL: Allow body scroll again
            }
        });
    }

    // --- Other scripts like animations or footer year would go here --- //
    // --- Update Footer Year --- //
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
