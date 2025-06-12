document.addEventListener('DOMContentLoaded', function() {

    // --- Menu Toggle Functionality (Kept from original, no changes needed) ---
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

    // --- Footer Current Year (Kept from original, no changes needed) ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // =========================================================================
    // NEW: "IGLOO-STYLE" SCROLLYTELLING FOR "O MÉTODO" PAGE
    // This logic replaces the old onEnter/onLeave triggers.
    // =========================================================================

    // First, check if GSAP and the necessary container exist on the page
    if (typeof gsap !== 'undefined' && document.querySelector('.scrolly-container')) {
        
        // Register the ScrollTrigger plugin with GSAP
        gsap.registerPlugin(ScrollTrigger);

        // Select all the pillar text sections and the corresponding visual items
        const textSections = gsap.utils.toArray('.pillar-text-content');
        const visualItems = gsap.utils.toArray('.pillar-visual-item');

        // ==== Initial State ====
        // Set the first pillar to be visible initially, and all others to be invisible.
        // We use autoAlpha for performance (it handles both opacity and visibility).
        gsap.set(visualItems[0], { autoAlpha: 1 });
        gsap.set(visualItems.slice(1), { autoAlpha: 0 });


        // Create a unique transition animation for each pillar text section
        textSections.forEach((section, index) => {
            // We only need to create transitions INTO sections 2 and 3. Section 1 is the starting point.
            if (index > 0) {

                // Create a GSAP Timeline for the specific transition
                const timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: section, // The element that triggers the animation (e.g., Pillar 2's text)
                        start: "top 80%", // The animation starts when the top of the section is 80% down the viewport
                        end: "top 30%",   // The animation is complete when the top is 30% down the viewport
                        
                        // THIS IS THE KEY: `scrub` links the animation progress directly to the scrollbar.
                        scrub: true,
                        
                        // Uncomment the line below to see the start/end trigger points for debugging
                        // markers: true,
                    }
                });

                // ==== Define the Animation Sequence ====
                // Use the timeline to choreograph the transition.
                timeline
                    // 1. Fade OUT the PREVIOUS pillar's visual and subtly scale it down.
                    .to(visualItems[index - 1], {
                        autoAlpha: 0, 
                        scale: 0.98 
                    })
                    // 2. Fade IN the CURRENT pillar's visual. Start it slightly scaled up for a feeling of depth.
                    // The '<' position parameter means "start at the same time as the previous animation".
                    .fromTo(visualItems[index], 
                        { autoAlpha: 0, scale: 1.02 }, 
                        { autoAlpha: 1, scale: 1 }, 
                        '<'
                    );
            }
        });
    }
});
