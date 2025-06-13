/*
=================================================================
   Definitive Version 5.0 (Architectural Fix)
   This version uses two separate triggers to eliminate race conditions.
=================================================================
*/
document.addEventListener('DOMContentLoaded', () => {
    // --- Menu & Footer (unchanged) ---
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

    initialCheck();
});

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);

    const ctx = gsap.context(() => {
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
            '(min-width: 769px)': () => {
                gsap.set(textPillars, { autoAlpha: 0 });
                gsap.set(textPillars[0], { autoAlpha: 1 });

                // Line animations are fine
                textPillars.forEach(pillar => {
                    const line = pillar.querySelector('.pillar-line');
                    if (!line) return;
                    ScrollTrigger.create({
                        trigger: pillar, start: 'top 60%', end: 'bottom 40%',
                        onEnter: () => gsap.to(line, { scaleX: 1, duration: 0.8, ease: 'power4.out' }),
                        onLeave: () => gsap.to(line, { scaleX: 0, transformOrigin: 'right', duration: 0.6, ease: 'power4.in' }),
                        onEnterBack:() => gsap.to(line, { scaleX: 1, transformOrigin: 'left',  duration: 0.8, ease: 'power4.out' }),
                        onLeaveBack:() => gsap.to(line, { scaleX: 0, duration: 0.6, ease: 'power4.in' }),
                    });
                });

                const states = [
                    { rotationY: 20, rotationX: -15, scale: 1.0 },
                    { rotationY: 120, rotationX: 10, scale: 1.1 },
                    { rotationY: -120, rotationX: -20, scale: 1.2 }
                ];

                const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power2.inOut' } });
                tl.to(actor3D, states[0])
                    .to(textPillars[0], { autoAlpha: 1 }, '<') 
                    .to(textPillars[0], { autoAlpha: 0 })
                    .to(textPillars[1], { autoAlpha: 1 }, '<')
                    .to(actor3D, states[1], '<')
                    .to(textPillars[1], { autoAlpha: 0 })
                    .to(textPillars[2], { autoAlpha: 1 }, '<')
                    .to(actor3D, states[2], '<')
                    // This label marks the exact state for Pillar 3 alignment
                    .addLabel('finalState') 
                    .to(textPillars[2], { autoAlpha: 0 })
                    .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1.0 }, '<');

                const mainScrub = ScrollTrigger.create({
                    trigger: textCol, pin: visualsCol, start: 'top top', end: 'bottom bottom',
                    animation: tl, scrub: 0.8, invalidateOnRefresh: true,
                });

                // --- ARCHITECTURAL FIX: TWO SEPARATE TRIGGERS FOR STABILITY ---
                
                // TRIGGER 1: Handles flipping DOWN into the summary.
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
                            duration: 0.8, ease: 'power2.inOut', scale: true,
                            onComplete: () => gsap.set(actor3D, { clearProps: 'all' })
                        });
                    }
                });

                // TRIGGER 2: Handles flipping UP back into the scroller.
                // It triggers when the BOTTOM of the text column re-enters the viewport.
                ScrollTrigger.create({
                    trigger: textCol,
                    start: 'bottom bottom', 
                    onEnterBack: () => {
                        if (!isFlipped) return;
                        isFlipped = false;
                        
                        visualsCol.classList.remove('is-exiting');
                        const state = Flip.getState(actor3D);
                        scene3D.appendChild(actor3D);

                        Flip.from(state, {
                            duration: 0.8, ease: 'power2.out', scale: true,
                            onComplete: () => {
                                // THE BULLETPROOF 3-STEP SYNC FOR PERFECT ALIGNMENT
                                // Step 1: Clear Flip's transform styles.
                                gsap.set(actor3D, { clearProps: "transform" });
                                // Step 2: Set the timeline to the Pillar 3 state.
                                tl.seek('finalState');
                                // Step 3: Re-enable the scroller.
                                mainScrub.enable();
                            }
                        });
                    }
                });
            },

            '(max-width: 768px)': () => {
                ScrollTrigger.getAll().forEach(st => st.kill());
                gsap.killTweensOf([actor3D, ...textPillars, '.pillar-line']);
                gsap.set([actor3D, ...textPillars, '.pillar-line'], { clearProps: 'all' });
                if (scene3D && !scene3D.contains(actor3D)) {
                    if (summaryClipper) summaryClipper.innerHTML = '';
                    scene3D.appendChild(actor3D);
                }
                if (visualsCol) visualsCol.classList.remove('is-exiting');
                isFlipped = false;
            }
        });
    });
    return () => ctx.revert();
}

function initialCheck() {
    if (window.gsap && window.ScrollTrigger && window.Flip) {
        setupAnimations();
    } else {
        let attempts = 0, maxAttempts = 30;
        const interval = setInterval(() => {
            attempts++;
            if (window.gsap && window.ScrollTrigger && window.Flip) {
                clearInterval(interval);
                setupAnimations();
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
                console.error("GSAP plugins failed to load in time.");
            }
        }, 100);
    }
}
