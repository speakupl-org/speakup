// File: js/main.js (UPDATED)

document.addEventListener('DOMContentLoaded', function() {

    // --- Menu Toggle Functionality ---
    const openButton = document.getElementById('menu-open-button');
    const closeButton = document.getElementById('menu-close-button');
    const menuScreen = document.getElementById('menu-screen');
    const htmlElement = document.documentElement; // Get the <html> element
    const body = document.body;

    function openMenu() {
        // Add the class to BOTH <html> and <body>
        htmlElement.classList.add('menu-open');
        body.classList.add('menu-open');
        
        openButton.setAttribute('aria-expanded', 'true');
        closeButton.setAttribute('aria-expanded', 'true');
        menuScreen.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
        // Remove the class from BOTH <html> and <body>
        htmlElement.classList.remove('menu-open');
        body.classList.remove('menu-open');
        
        openButton.setAttribute('aria-expanded', 'false');
        closeButton.setAttribute('aria-expanded', 'false');
        menuScreen.setAttribute('aria-hidden', 'true');
    }

    if (openButton && closeButton && menuScreen) {
        openButton.addEventListener('click', openMenu);
        closeButton.addEventListener('click', closeMenu);

        // Optional: Close menu when clicking on a navigation link
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
