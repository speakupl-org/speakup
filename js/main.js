/*
=================================================================
   ULTIMATE DEBUGGING BUILD v3.0 - With Live Dashboard
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

    console.clear();
    console.log('%cGSAP Ultimate Debug Build v3.0 Initialized.', 'color: #88c0d0; font-weight: bold;');

    const ctx = gsap.context(() => {
        // --- Element & Dashboard Declarations ---
        const visualsCol = document.querySelector('.pillar-visuals-col');
        const scene3D = document.querySelector('.scene-3d');
        const textCol = document.querySelector('.pillar-text-col');
        const actor3D = document.getElementById('actor-3d');
        const textPillars = gsap.utils.toArray('.pillar-text-content');
        const summaryContainer = document.querySelector('.method-summary');
        const summaryClipper = document.querySelector('.summary-thumbnail-clipper');

        // Dashboard Elements
        const flipStatusEl = document.getElementById('debug-flip-status');
        const scrubStatusEl = document.getElementById('debug-scrub-status');
        const progressEl = document.getElementById('debug-timeline-progress');
        const lastEventEl = document.getElementById('debug-last-event');

        if (!visualsCol || !textCol || !actor3D || !summaryContainer || !flipStatusEl) {
            console.error('Scrollytelling aborted: One or more required elements are missing.');
            return;
        }

        let isFlipped = false;

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                // Standard setup
                gsap.set(textPillars, { autoAlpha: 0 });
                gsap.set(textPillars[0], { autoAlpha: 1 });

                // Line animations (unchanged)
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

                // Main timeline with dashboard update
                const tl = gsap.timeline({
                    onUpdate: () => {
                        if (progressEl) progressEl.textContent = `${tl.progress().toFixed(4)}`;
                    }
                });
                
                const states = [
                    { rotationY: 20, rotationX: -15, scale: 1.0 },
                    { rotationY: 120, rotationX: 10, scale: 1.1 },
                    { rotationY: -120, rotationX: -20, scale: 1.2 }
                ];
                
                tl.to(actor3D, states[0], 0)
                  .to(textPillars[0], { autoAlpha: 1 }, 0)
                  .to(textPillars[0], { autoAlpha: 0 }, 1)
                  .to(actor3D, { ...states[1], duration: 1}, 1)
                  .to(textPillars[1], { autoAlpha: 1 }, 1)
                  .to(textPillars[1], { autoAlpha: 0 }, 2)
                  .to(actor3D, { ...states[2], duration: 1 }, 2)
                  .to(textPillars[2], { autoAlpha: 1 }, 2)
                  .addLabel("finalState", 3) // Add label at 3 seconds
                  .to(textPillars[2], { autoAlpha: 0 }, 3)
                  .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1.0, duration: 1 }, 3);

                const mainScrub = ScrollTrigger.create({
                    trigger: textCol,
                    pin: visualsCol,
                    start: 'top top',
                    end: `+=${tl.duration() * 500}`, // End based on timeline duration
                    animation: tl,
                    scrub: 0.8,
                    invalidateOnRefresh: true,
                });

                // --- ARCHITECTURAL FIX: TWO SEPARATE TRIGGERS ---
                // This prevents the onEnter/onLeaveBack race condition.

                // TRIGGER 1: Handles flipping DOWN into the summary.
                ScrollTrigger.create({
                    trigger: summaryContainer,
                    start: 'top 80%', // Trigger earlier to give Flip time
                    onEnter: () => {
                        console.groupCollapsed('%cEVENT: onEnter (DOWN)', 'color: #A3BE8C; font-weight:bold;');
                        lastEventEl.textContent = 'onEnter (Down)';
                        if (isFlipped) {
                            console.warn('ABORTED: isFlipped is already true.');
                            console.groupEnd();
                            return;
                        }
                        isFlipped = true;
                        flipStatusEl.textContent = 'FLIPPED';

                        mainScrub.disable();
                        scrubStatusEl.textContent = 'DISABLED';
                        console.log('Scrub disabled.');
                        
                        visualsCol.classList.add('is-exiting');
                        const state = Flip.getState(actor3D);
                        summaryClipper.appendChild(actor3D);
                        
                        Flip.from(state, {
                            duration: 0.8, ease: 'power2.inOut', scale: true,
                            onComplete: () => {
                                gsap.set(actor3D, { clearProps: 'all' });
                                console.log('Flip DOWN complete.');
                                console.groupEnd();
                            }
                        });
                    }
                });

                // TRIGGER 2: Handles flipping UP back into the scroller.
                ScrollTrigger.create({
                    trigger: summaryContainer, // Use the same element for symmetry
                    start: 'top 80%',
                    onLeaveBack: () => {
                        console.group('%cEVENT: onLeaveBack (UP)', 'color: #EBCB8B; font-weight:bold;');
                        lastEventEl.textContent = 'onLeaveBack (Up)';
                        if (!isFlipped) {
                            console.warn('ABORTED: isFlipped is already false.');
                            console.groupEnd();
                            return;
                        }
                        isFlipped = false;
                        flipStatusEl.textContent = 'TRANSITIONING...';

                        visualsCol.classList.remove('is-exiting');
                        const state = Flip.getState(actor3D);
                        scene3D.appendChild(actor3D);

                        Flip.from(state, {
                            duration: 0.8, ease: 'power2.out', scale: true,
                            onComplete: () => {
                                console.log('Flip UP complete. Starting 3-step sync.');
                                
                                // THE BULLETPROOF 3-STEP SYNC
                                console.log(`1. actor3D transform before clear: ${gsap.getProperty(actor3D, "transform")}`);
                                gsap.set(actor3D, { clearProps: "transform" });
                                console.log('1. clearProps("transform") complete.');
                                
                                console.log(`2. Timeline progress before force: ${tl.progress().toFixed(4)}`);
                                tl.progress(1); // Force progress to the end
                                console.log(`2. Timeline progress FORCED to ${tl.progress().toFixed(4)}`);

                                mainScrub.enable();
                                scrubStatusEl.textContent = 'ENABLED';
                                console.log('3. Scrub re-enabled.');
                                
                                flipStatusEl.textContent = 'In Scroller';
                                console.log('SYNC COMPLETE');
                                console.groupEnd();
                            }
                        });
                    }
                });
            },
            '(max-width: 768px)': () => { /* mobile cleanup */ }
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
