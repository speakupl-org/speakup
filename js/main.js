
// main.js

// This function will run once the entire HTML document has been loaded.
document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================================
       1. REVEAL ELEMENTS ON SCROLL (THE FIX FOR YOUR PROBLEM)
       ========================================================================= */
    
    // Select all the elements that have one of the "animated" classes.
    const animatedElements = document.querySelectorAll(
        '.animated-title, .animated-text, .benefit-item, .testimonial-card, ' +
        '.tally-form-wrapper, .post-quiz-cta-container, .blockage-element, ' +
        '.animated-teacher-frame, .final-cta-button, .testimonial-card .quote-mark-animated'
    );

    // If there are no elements to animate, we don't need to do anything else.
    if (animatedElements.length > 0) {
        // Set up the Intersection Observer to watch for when elements enter the screen.
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // If the element is now visible in the viewport...
                if (entry.isIntersecting) {
                    // Add the '.in-view' class to it. This triggers the CSS animation.
                    entry.target.classList.add('in-view');
                    // Stop observing the element so the animation only happens once.
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // The animation will trigger when 10% of the element is visible.
        });

        // Tell the observer to start watching each of the animated elements.
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }


    /* =========================================================================
       2. AUTOMATICALLY UPDATE THE YEAR IN THE FOOTER
       ========================================================================= */

    // Find the <span> element with the id "current-year".
    const yearSpan = document.getElementById('current-year');
    
    // If the element exists, set its text content to the current year.
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
});
