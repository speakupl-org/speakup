// js/main.js - v5.1 (Final Transition-Based)

document.addEventListener('DOMContentLoaded', () => {

    const reducedMotionQuery = window.matchMedia('(container { display: flex; align-items: center; gap: 60px; }
.teacher-photo-area { flex-basis: 300px; flex-shrink: 0; }
.teacher-face-svg { width: 100%; height: auto; object-fit: cover; border-radius: 50%; border: 3px solid var(--color-accent); box-shadow: var(--shadow-glow-lg);}
#testimonials .testimonial-grid { display: grid; grid-template-columns: repeat(prefers-reduced-motion: reduce)');

    // Only set up animations if the user has NOT requested reduced motion.
    if (!reducedMotionQuery.matches) {
        
        const animatedElements = document.querySelectorAll('.animate-me');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.addauto-fit, minmax(320px, 1fr)); gap: 30px; }
.testimonial-card {
    background: var(--color-surface-dark); padding: 40px; border-radius: var(--border-radius);
    border: 1px solid rgba(255, 255, 255, 0.1); position: relative;
}
.testimonial-card('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));


        // STAGGERING LOGIC FOR LISTS
        // Set a CSS variable for transition-delay on specific .polished-quote { position: absolute; top: 15px; right: 25px; font-size: 6rem; line-height: 1; color: var(--color-primary-vibrant); opacity: 0.05;}
.testimonial-quote-text { margin-bottom: 1.5rem; color: var(--color-text-muted); font-size: 1.1rem;}
 list items
        const benefits = document.querySelectorAll('.benefit-item.animate-me');
        benefits.forEach((item, index) => {
            // The first item (index 0) has no delay. The second (index 1).testimonial-author { font-weight: 600; color: var(--color-heading); }
#final-cta, .post-quiz-cta-container { text-align: center; }
.reassurance-text, .button-subtext { opacity: 0.8; margin-top: 1. gets 0.15s, etc.
            const delay = index * 0.15; 
            item.style.setProperty('--stagger-delay', `${delay}s`);
        });

        const testimonials = document.querySelectorAll('.testimonial-card.animate-me');
        testimonials.forEach((card, index) => {
            const5rem; }

/* --- 6. Footer --- */
.site-footer { background: #000; color: var(--color-text-muted); padding: 40px 0; text-align: center; }
.site-footer a,
.site-footer a:visited { /* FIX: Target visited links */
    color: var(--color-text-main);
    text-decoration: none; 
}
 delay = index * 0.15;
            card.style.setProperty('--stagger-delay', `${delay}s`);
        });

    } else {
        // If reduced motion is on, make all elements immediately visible without animation.
        // We handle this in CSS now with a @media query for simplicity.
    .site-footer a:hover { color: var(--color-accent); }

/* --- 7. Animation System --- */
/* Set the starting state for all elements that will animate. */
.animate-me {
    opacity}

    // UPDATE FOOTER YEAR
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
```: 0;
    transform: translateY(20px);
    transition: opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1), 
                

These files represent a truly professional and robust implementation. The structure is clean, the code is performant, the animationstransform 0.8s cubic-bezier(0.19, 1, 0.22, 1);
    /* Giving the browser a hint about what will change for better performance */
    will-change: opacity are smooth and bug-free, and it respects user accessibility preferences. This is a solid foundation you can be proud of.
