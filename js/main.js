/*
=================================================================
   Definitive Version 2.1 - With Scrollytelling Pacing & Handoff Fix
=================================================================
*/

// --- Wait for the DOM to be fully loaded before running any script ---
document.addEventListener('DOMContentLoaded', () => {
    // --- Menu & Footer (Unchanged) ---
    const openButton = document.getElementById('menu-open-button');
    const closeButton = document.getElementById('menu-close-button');
    const menuScreen = document.getElementById('menu-screen');
    const htmlElement = document.documentElement;
    const body = document.body;

    function openMenu() {
        htmlElement.classList.add('menu-open');
        body.classList.add('menu-open');
        menuScreen.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
        htmlElement.classList.remove('menu-open');
        body.classList.remove('menu-open');
        menuScreen.setAttribute('aria-hidden', 'true');
    }

    if (openButton && closeButton && menuScreen) {
        openButton.addEventListener('click', openMenu);
        closeButton.addEventListener('click', closeMenu);
    }

    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // --- GSAP Animations Start Here ---
    // The initialCheck function will handle calling setupAnimations
    initialCheck();
});


/**
 * The main function to set up all GSAP scrollytelling animations.
 * This contains the corrected timeline and Flip handoff logic.
 */
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);

    const ctx = gsap.context(() => {
        // --- 1. Element & Variable Declarations (Unchanged) ---
        const visualsCol = document.querySelector('.pillar-visuals-col');
        const scene3D = document.querySelector('.scene-3d');
        const textCol = document.querySelector('.pillar-text-col');
        const actor3D = document.getElementById('actor-3d');
        const textPillars = gsap.utils.toArray('.pillar-text-content');
        const summaryContainer = document.querySelector('.method-summary');
        const summaryClipper = document.querySelector('.summary-thumbnail-clipper');

        if (!visualsCol || !scene3D || !textCol || !actor3D || !summaryContainer || !summaryClipper || !textPillars.length) {
            console.error('Scrollytelling animations aborted: One or more required elements are missing.');
            return;
        }

        let isFlipped = false;

        ScrollTrigger.matchMedia({
            // --- DESKTOP ANIMATIONS ---
            '(min-width: 769px)': () => {
                gsap.set(textPillars, { autoAlpha: 0 });
                gsap.set(textPillars[0], { autoAlpha: 1 });

                // Line animations (Unchanged)
                textPillars.forEach(pillar => {
                    const line = pillar.querySelector('.pillar-line');
                    if (!line) return;
                    ScrollTrigger.create({
                        trigger: pillar,
                        start: 'top 60%',
                        end: 'bottom 40%',
                        onEnter:    () => gsap.to(line, { scaleX: 1, duration: 0.8, ease: 'power4.out' }),
                        onLeave:    () => gsap.to(line, { scaleX: 0, transformOrigin: 'right', duration: 0.6, ease: 'power4.in' }),
                        onEnterBack:() => gsap.to(line, { scaleX: 1, transformOrigin: 'left',  duration: 0.8, ease: 'power4.out' }),
                        onLeaveBack:() => gsap.to(line, { scaleX: 0, duration: 0.6, ease: 'power4.in' }),
                    });
                });

                const states = [
                    { rotationY: 20,   rotationX: -15, scale: 1.0 },
                    { rotationY: 120,  rotationX: 10,  scale: 1.1 },
                    { rotationY: -120, rotationX: -20, scale: 1.2 }
                ];

                // =============================================================
                //  SOLUTION 1: RESTRUCTURED TIMELINE FOR BETTER PACING
                // =============================================================
                const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power2.inOut' } });
                tl
                    .to(actor3D, states[0])
                    .to(textPillars[0], { autoAlpha: 1 }, '<') 
                    .to(textPillars[0], { autoAlpha: 0 })
                    .to(textPillars[1], { autoAlpha: 1 }, '<')
                    .to(actor3D, states[1], '<')
                    .to(textPillars[1], { autoAlpha: 0 })
                    .to(textPillars[2], { autoAlpha: 1 }, '<')
                    .to(actor3D, states[2], '<')

                    // --- FIX FOR PILLAR 3 TIMING ---
                    // This "dwell time" tween prevents the exit animation from starting too early.
                    .to({}, { duration: 0.5 }) 

                    .addLabel('finalState')
                    // Now, the exit animation starts
                    .to(textPillars[2], { autoAlpha: 0, duration: 0.5 })
                    .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1.0 }, '<');

                const mainScrub = ScrollTrigger.create({
                    trigger: textCol,
                    pin: visualsCol,
                    start: 'top top',
                    end: 'bottom bottom',
                    animation: tl,
                    scrub: 0.8,
                    invalidateOnRefresh: true,
                });
                
                // --- Flip Handoff Animation ---
                ScrollTrigger.create({
                    trigger: summaryContainer,
                    start: 'top center',
                    onEnter: () => {
                        if (isFlipped) return;
                        isFlipped = true;
                        mainScrub.disable();
                        visualsCol.classList.add('is-exiting');
                        const state = Flip.getState(actor3D);
                        summaryClipper.appendChild(actor3D);
                        Flip.from(state, {
                            duration: 0.8,
                            ease: 'power2.inOut',
                            scale: true,
                            onComplete: () => gsap.set(actor3D, { clearProps: 'all' })
                        });
                    },
                    onLeaveBack: () => {
                        if (!isFlipped) return;
                        isFlipped = false;
                        visualsCol.classList.remove('is-exiting');
                        const state = Flip.getState(actor3D);
                        scene3D.appendChild(actor3D);
                        Flip.from(state, {
                            duration: 0.8,
                            ease: 'power2.out',
                            scale: true,
                            // =============================================================
                            //  SOLUTION 2: CORRECTED onComplete LOGIC FOR SCROLL-BACK
                            // =============================================================
                            onComplete: () => {
                                // 1. Clear styles from Flip
                                gsap.set(actor3D, { clearProps: "transform" });
                                
                                // 2. (THE FIX) Sync timeline progress to the absolute end. This prevents the "jump".
                                tl.progress(1);
                                
                                // 3. Re-enable the main scroll-driven animation
                                mainScrub.enable();
                            }
                        });
                    }
                });
            },

            // --- MOBILE CLEANUP (Unchanged) ---
            '(max-width: 768px)': () => {
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                gsap.killTweensOf([actor3D, textPillars, '.pillar-line']);
                gsap.set([actor3D, textPillars, '.pillar-line'], { clearProps: 'all' });
                if (scene3D && !scene3D.contains(actor3D)) { // Add check for scene3D
                    scene3D.appendChild(actor3D);
                }
                if (visualsCol) visualsCol.classList.remove('is-exiting'); // Add check for visualsCol
                isFlipped = false;
            }
        });
    });

    // Return the context's revert function for potential cleanup
    return () => ctx.revert();
}


/**
 * Checks if GSAP and its plugins are loaded before running animations.
 * This prevents errors if the CDN scripts load after the main.js file.
 * (Unchanged)
 */
function initialCheck() {
    if (window.gsap && window.ScrollTrigger && window.Flip) {
        setupAnimations();
    } else {
        let attempts = 0;
        const maxAttempts = 30; // Wait for up to 3 seconds
        const interval = setInterval(() => {
            attempts++;
            if (window.gsap && window.ScrollTrigger && window.Flip) {
                clearInterval(interval);
                setupAnimations();
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
                console.error("GSAP plugins failed to load in time. Animations will not run.");
            }
        }, 100);
    }
}
