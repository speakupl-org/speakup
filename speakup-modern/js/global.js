// /js/global.js

// Initialize Lenis for smooth scrolling on every page
function initializeSmoothScroll() {
    // Only run if the Lenis library is present
    if (typeof Lenis === 'undefined') {
        console.log("Lenis library not found. Skipping smooth scroll setup.");
        return;
    }

    const lenis = new Lenis();

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    console.log("Global smooth scroll initialized.");
}

// Run the initialization logic on page load
initializeSmoothScroll();
