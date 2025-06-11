document.addEventListener('DOMContentLoaded', () => {

    // A list of all elements that should animate when scrolled into view
    const animatedElements = document.querySelectorAll(
        '.animated-title, .animated-text, .benefit-item, .testimonial-card, ' +
        '.tally-form-wrapper, .blockage-element, .animated-teacher-frame, .final-cta-button, ' +
        '.post-quiz-cta-container, .quote-mark-animated'
    );

    // This observer will add the 'in-view' class to elements when they become visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Stop observing after animation runs once
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // Tell the observer to watch each animated element
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Tally Form Loader Script
    var d=document,w="https://tally.so/widgets/embed.js",v=function(){"undefined"!=typeof Tally?Tally.loadEmbeds():d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((function(e){e.src=e.dataset.tallySrc}))};if("undefined"!=typeof Tally)v();else if(d.querySelector('script[src="'+w+'"]')==null){var s=d.createElement("script");s.src=w,s.onload=v,s.onerror=v,d.body.appendChild(s);}

    // Update Copyright Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
       yearSpan.textContent = new Date().getFullYear();
    }
});
