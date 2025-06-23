// /js/global.js

// Initialize Lenis for smooth scrolling on every page
function initializeSmoothScroll() {
    // Only run if the Lenis library is present
    if (typeof Lenis === 'undefined') {
        // Lenis library not found, skipping smooth scroll setup
        return;
    }

    const lenis = new Lenis();

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Global smooth scroll initialized
}

// Run the initialization logic on page load
initializeSmoothScroll();
