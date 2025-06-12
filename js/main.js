// js/main.js - FINAL "BRAND WORLD" BUILD

document.addEventListener('DOMContentLoaded', () => {

    const menuToggleButtons = document.querySelectorAll('.mobile-nav-toggle');
    const body = document.body;

    menuToggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Toggle the master class on the body
            body.classList.toggle('menu-is-open');
            
            // Toggle ARIA attributes for accessibility
            const isOpened = body.classList.contains('menu-is-open');
            button.setAttribute('aria-expanded', isOpened);

            // Set the ARIA attribute on the close button's sibling toggle
            // to ensure they stay in sync.
            menuToggleButtons.forEach(b => b.setAttribute('aria-expanded', isOpened));
        });
    });

    // Update Footer Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
