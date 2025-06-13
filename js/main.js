/*
=================================================================
   DEBUGGING BUILD v2.0 - With Live On-Screen Dashboard
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

    // --- GSAP Animations ---
    setupAnimations();
});

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);

    console.clear();
    console.log('%cGSAP Debugging Build v2.0 Initialized.', 'color: #88c0d0; font-weight: bold;');

    const ctx = gsap.context(() => {
        // --- 1. Element & Variable Declarations ---
        const visualsCol = document.querySelector('.pillar-visuals-col');
        const scene3D = document.querySelector('.scene-3d');
        const textCol = document.querySelector('.pillar-text-col');
        const actor3D = document.getElementById('actor-3d');
        const textPillars = gsap.utils.toArray('.pillar-text-content');
        const summaryContainer = document.querySelector('.method-summary');
        const summaryClipper = document.querySelector('.summary-thumbnail-clipper');

        // --- Live Dashboard Elements ---
        const flipStatusEl = document.getElementById('debug-flip-status');
        const progressEl = document.getElementById('debug-timeline-progress');

        if (!visualsCol || !scene3D || !textCol || !actor3D || !summaryContainer || !summaryClipper || !textPillars.length || !flipStatusEl) {
            console.error('Scrollytelling animations aborted: One or more required elements are missing.');
            return;
        }

        let isFlipped = false;

        ScrollTrigger.matchMedia({
            // --- DESKTOP ANIMATIONS ---
            '(min-width: 769px)': () => {
                gsap.set(textPillars, { autoAlpha: 0 });
                gsap.set(textPillars[0], { autoAlpha: 1 });

                // Line animations are fine
                textPillars.forEach(pillar => {
                    const line = pillar.querySelector('.pillar-line');
                    if (!line) return;
                    ScrollTrigger.create({
                        trigger: pillar,
                        start: 'top 60%',
                        end: 'bottom 40%',
                        onEnter: () => gsap.to(line, { scaleX: 1, duration: 0.8, ease: 'power4.out' }),
                        onLeave: () => gsap.to(line, { scaleX: 0, transformOrigin: 'right', duration: 0.6, ease: 'power4.in' }),
                        onEnterBack:() => gsap.to(line, { scaleX: 1, transformOrigin: 'left',  duration: 0.8, ease: 'power4.out' }),
                        onLeaveBack:() => gsap.to(line, { scaleX: 0, duration: 0.6, ease: 'power4.in' }),
                    });
                });
                
                // The main timeline
                const tl = gsap.timeline({
                    defaults: { duration: 1, ease: 'power2.inOut' },
                    onUpdate: () => { // Update the live progress on the dashboard
                        if (progressEl) progressEl.textContent = `Timeline Progress: ${tl.progress().toFixed(4)}`;
                    }
                });

                const states = [
                    { rotationY: 20, rotationX: -15, scale: 1.0 },
                    { rotationY: 120, rotationX: 10, scale: 1.1 },
                    { rotationY: -120, rotationX: -20, scale: 1.2 }
                ];
                
                tl
                    .to(actor3D, states[0])
                    .to(textPillars[0], { autoAlpha: 1 }, '<')
                    .to(textPillars[0], { autoAlpha: 0 })
                    .to(textPillars[1], { autoAlpha: 1 }, '<')
                    .to(actor3D, states[1], '<')
                    .to(textPillars[1], { autoAlpha: 0 })
                    .to(textPillars[2], { autoAlpha: 1 }, '<')
                    .to(actor3D, states[2], '<')
                    .addLabel('finalState') // A precise label before the final move
                    .to(textPillars[2], { autoAlpha: 0, duration: 0.5 })
                    .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1.0, duration: 0.5 }, '<');

                const mainScrub = ScrollTrigger.create({
                    trigger: textCol,
                    pin: visualsCol,
                    start: 'top top',
                    end: 'bottom bottom',
                    animation: tl,
                    scrub: 0.8,
                    invalidateOnRefresh: true,
                });

                // The Handoff Trigger
                ScrollTrigger.create({
                    trigger: summaryContainer,
                    start: 'top center',
                    onEnter: () => {
                        console.groupCollapsed('%c[onEnter] -> Firing', 'color: #A3BE8C; font-weight:bold;');
                        if (isFlipped) {
                            console.warn('ABORTED: isFlipped is already true.');
                            console.groupEnd();
                            return;
                        }
                        isFlipped = true;
                        flipStatusEl.textContent = 'Flip Status: Flipped to Summary';
                        flipStatusEl.style.color = '#A3BE8C';
                        console.log('Set isFlipped = true. Disabling main scrub.');
                        
                        mainScrub.disable();
                        visualsCol.classList.add('is-exiting');
                        
                        const state = Flip.getState(actor3D);
                        summaryClipper.appendChild(actor3D);
                        
                        Flip.from(state, {
                            duration: 0.8,
                            ease: 'power2.inOut',
                            scale: true,
                            onComplete: () => {
                                console.log('Flip to summary COMPLETE.');
                                gsap.set(actor3D, { clearProps: 'all' });
                            }
                        });
                        console.groupEnd();
                    },
                    onLeaveBack: () => {
                        console.group('%c[onLeaveBack] <- Firing', 'color: #EBCB8B; font-weight:bold;');
                        if (!isFlipped) {
                            console.warn('ABORTED: isFlipped is already false.');
                            console.groupEnd();
                            return;
                        }
                        // We set this to a "transitioning" state immediately
                        // to prevent re-triggering, but only finalize after the animation.
                        isFlipped = false; 
                        flipStatusEl.textContent = 'Flip Status: Transitioning back...';
                        flipStatusEl.style.color = '#EBCB8B';
                        
                        visualsCol.classList.remove('is-exiting');
                        const state = Flip.getState(actor3D);
                        scene3D.appendChild(actor3D);

                        Flip.from(state, {
                            duration: 0.8,
                            ease: 'power2.out',
                            scale: true,
                            onComplete: () => {
                                console.log('Flip back to scroller COMPLETE. Syncing...');

                                // 1. Clear styles set by Flip
                                gsap.set(actor3D, { clearProps: "transform" });
                                console.log('Step 1: clearProps("transform") done.');

                                // 2. FORCE the timeline progress to 1 (its absolute end state).
                                // This is more robust than seeking a label.
                                tl.progress(1);
                                console.log(`Step 2: Timeline progress FORCED to ${tl.progress()}`);

                                // 3. Re-enable scrub AFTER a tiny delay.
                                // This is a crucial trick to avoid race conditions where the browser
                                // is still processing the scroll event.
                                gsap.delayedCall(0.01, () => {
                                    mainScrub.enable();
                                    console.log('Step 3: mainScrub re-enabled after delay.');
                                    flipStatusEl.textContent = 'Flip Status: In Scroller';
                                    flipStatusEl.style.color = 'white';
                                    console.log('SYNC COMPLETE');
                                    console.groupEnd();
                                });
                            }
                        });
                    }
                });
            },
            '(max-width: 768px)': () => { /* Mobile cleanup */ }
        });
    });

    return () => ctx.revert();
}

function initialCheck() { /* Unchanged */ }
