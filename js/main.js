document.addEventListener('DOMContentLoaded', function() {

    // --- Menu Toggle Functionality (Kept from original) ---
    const openButton = document.getElementById('menu-open-button');
    const closeButton = document.getElementById('menu-close-button');
    const menuScreen = document.getElementById('menu-screen');
    const htmlElement = document.documentElement;
    const body = document.body;

    function openMenu() {
        htmlElement.classList.add('menu-open');
        body.classList.add('menu-open');
        openButton.setAttribute('aria-expanded', 'true');
        closeButton.setAttribute('aria-expanded', 'true');
        menuScreen.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
        htmlElement.classList.remove('menu-open');
        body.classList.remove('menu-open');
        openButton.setAttribute('aria-expanded', 'false');
        closeButton.setAttribute('aria-expanded', 'false');
        menuScreen.setAttribute('aria-hidden', 'true');
    }

    if (openButton && closeButton && menuScreen) {
        openButton.addEventListener('click', openMenu);
        closeButton.addEventListener('click', closeMenu);
        menuScreen.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && body.classList.contains('menu-open')) {
                closeMenu();
            }
        });
    }

    // --- Footer Current Year (Kept from original) ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- NEW: Igloo-style Scrollytelling for "O Método" page ---
    // First, check if GSAP and the necessary elements are on the page
    if (typeof gsap !== 'undefined' && document.querySelector('.scrolly-container')) {
        
        // Register the ScrollTrigger plugin with GSAP
        gsap.registerPlugin(ScrollTrigger);

        // Select all the text sections and the visual containers
        const textSections = gsap.utils.toArray('.pillar-text-content');
        const visualItems = gsap.utils.toArray('.pillar-visual-item');

        // Loop through each text section to create a trigger for it
        textSections.forEach((section, index) => {
            const correspondingVisual = visualItems[index];

            // Create a ScrollTrigger for each section
            ScrollTrigger.create({
                trigger: section, // The element that triggers the animation
                start: "top center", // When the top of the section hits the center of the viewport
                end: "bottom center", // When the bottom of the section hits the center of the viewport
                
                // On entering the trigger area (scrolling down)
                onEnter: () => {
                    // Make the corresponding visual active
                    gsap.to(correspondingVisual, { autoAlpha: 1 });
                },

                // On leaving the trigger area (scrolling down past it)
                onLeave: () => {
                     // Fade it out
                    gsap.to(correspondingVisual, { autoAlpha: 0 });
                },

                // On re-entering the trigger area (scrolling back up)
                onEnterBack: () => {
                    // Make the corresponding visual active again
                    gsap.to(correspondingVisual, { autoAlpha: 1 });
                },

                // On leaving the trigger area (scrolling back up past it)
                onLeaveBack: () => {
                    // Fade it out
                    gsap.to(correspondingVisual, { autoAlpha: 0 });
                },
                
                // Optional: for debugging. Shows the start/end trigger points
                // markers: true 
            });
        });

        // Ensure the very first visual is visible when the page loads
        if (visualItems.length > 0) {
            ScrollTrigger.create({
                 trigger: ".scrolly-container",
                 start: "top bottom",
                 onEnter: () => gsap.set(visualItems[0], { autoAlpha: 1 }),
                 onLeaveBack: () => gsap.set(visualItems[0], { autoAlpha: 0 })
            })
        }
    }
});
