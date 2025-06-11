// js/main.js - v3.1 Performance-Tuned

document.addEventListener('DOMContentLoaded', () => {

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animationsEnabled = !reducedMotionQuery.matches;

    reducedMotionQuery.addEventListener('change', () => {
        animationsEnabled = !reducedMotionQuery.matches;
    });

    /* --- REVEAL ON SCROLL (Observer) --- */
    const animatedElements = document.querySelectorAll(
        '.hero-title, .hero-subtitle, .hero-cta, .empathetic-text, .section-title, ' +
        '.benefit-item, .about-teacher-container, .testimonial-card, .tally-form-wrapper, ' +
        '.post-quiz-cta-container, .final-cta-title, .reassurance-text'
    );
    
    if (animationsEnabled) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));
    } else {
        animatedElements.forEach(el => el.classList.add('in-view'));
    }
    
    /* --- OPTIMIZED PARALLAX WITH requestAnimationFrame --- */
    const body = document.body;
    let lastScrollY = window.scrollY;
    let ticking = false;

    function handleParallax() {
        if (!animationsEnabled) return;

        // Calculate how much to move based on the last known scroll position
        const scrollPercent = lastScrollY / (document.documentElement.scrollHeight - window.innerHeight);
        
        const blobX = scrollPercent * -50;
        const blobY = scrollPercent * 30;
        
        body.style.setProperty('--blob-x', `${blobX}vw`);
        body.style.setProperty('--blob-y', `${blobY}vh`);
    }

    // This function will be called on every scroll, but it's very cheap
    function onScroll() {
        lastScrollY = window.scrollY; // Update our scroll position

        // If a frame request isn't already scheduled, schedule one.
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleParallax(); // Run our expensive function
                ticking = false; // Allow the next frame to be requested
            });
            ticking = true; // Mark that we have a frame request pending
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    /* --- UPDATE FOOTER YEAR --- */
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
