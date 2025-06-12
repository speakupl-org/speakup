// File: js/main.js

document.addEventListener('DOMContentLoaded', function() {

    // --- Menu Toggle Functionality ---
    const openButton = document.getElementById('menu-open-button');
    const closeButton = document.getElementById('menu-close-button');
    const menuScreen = document.getElementById('menu-screen');
    const body = document.body;

    function openMenu() {
        body.classList.add('menu-open');
        openButton.setAttribute('aria-expanded', 'true');
        closeButton.setAttribute('aria-expanded', 'true');
        menuScreen.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
        body.classList.remove('menu-open');
        openButton.setAttribute('aria-expanded', 'false');
        closeButton.setAttribute('aria-expanded', 'false');
        menuScreen.setAttribute('aria-hidden', 'true');
    }

    if (openButton && closeButton && menuScreen) {
        openButton.addEventListener('click', openMenu);
        closeButton.addEventListener('click', closeMenu);

        // Optional: Close menu when clicking on a navigation link (for single-page apps or anchor links)
        menuScreen.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        
        // Optional: Close menu when pressing the Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && body.classList.contains('menu-open')) {
                closeMenu();
            }
        });
    }

    // --- Footer Current Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

});
