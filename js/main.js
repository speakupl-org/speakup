/*
=================================================================
   STABLE DEBUGGING BUILD v5.0 - Two Triggers + Full Diagnostics
=================================================================
*/
document.addEventListener('DOMContentLoaded', () => {
    // Menu & Footer logic (unchanged)
    // ...
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
    console.log('%cGSAP Stable Debug Build v5.0 Initialized.', 'color: #88c0d0; font-weight: bold;');

    // This adds visual markers to ALL scroll triggers on the page.
    ScrollTrigger.defaults({ markers: true });

    const ctx = gsap.context(() => {
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
            console.error('Scrollytelling aborted: Critical elements are missing.');
            return;
        }

        let isFlipped = false;

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                gsap.set(textPillars, { autoAlpha: 0 });
                gsap.set(textPillars[0], { autoAlpha: 1 });

                const tl = gsap.timeline({
                    onUpdate: () => progressEl && (progressEl.textContent = `${tl.progress().toFixed(4)}`)
                });
                
                // --- Timeline (same as stable version) ---
                const states = [
                    { rotationY: 20, rotationX: -15, scale: 1.0 },
                    { rotationY: 120, rotationX: 10, scale: 1.1 },
                    { rotationY: -120, rotationX: -20, scale: 1.2 }
                ];
                tl.to(actor3D, { ...states[0], duration: 1})
                  .to(textPillars[0], { autoAlpha: 1 }, '<')
                  .to(textPillars[0], { autoAlpha: 0, duration: 0.5 }, '+=0.5')
                  .to(actor3D, { ...states[1], duration: 1 }, '<')
                  .to(textPillars[1], { autoAlpha: 1, duration: 0.5 }, '<')
                  .to(textPillars[1], { autoAlpha: 0, duration: 0.5 }, '+=0.5')
                  .to(actor3D, { ...states[2], duration: 1 }, '<')
                  .to(textPillars[2], { autoAlpha: 1, duration: 0.5 }, '<')
                  .addLabel("finalState")
                  .to(textPillars[2], { autoAlpha: 0, duration: 0.5 }, '+=0.5')
                  .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1.0, duration: 1 }, '<');

                const mainScrub = ScrollTrigger.create({
                    trigger: textCol, pin: visualsCol, start: 'top top', end: 'bottom bottom',
                    animation: tl, scrub: 0.8, invalidateOnRefresh: true,
                });

                // --- STABLE TWO-TRIGGER ARCHITECTURE WITH FULL LOGGING ---

                // TRIGGER 1: Handles flipping DOWN.
                ScrollTrigger.create({
                    trigger: summaryContainer,
                    start: 'top center',
                    onEnter: () => {
                        console.group('%cEVENT: onEnter (Flip Down)', 'color: #A3BE8C; font-weight:bold;');
                        if (isFlipped) { console.warn('ABORTED: isFlipped is already true.'); console.groupEnd(); return; }
                        isFlipped = true;
                        
                        // Update Dashboard
                        lastEventEl.textContent = 'onEnter (Flip Down)';
                        flipStatusEl.textContent = 'FLIPPED';
                        scrubStatusEl.textContent = 'DISABLED';
                        
                        mainScrub.disable();
                        console.log('Scrub disabled.');
                        visualsCol.classList.add('is-exiting');
                        const state = Flip.getState(actor3D);
                        summaryClipper.appendChild(actor3D);
                        
                        Flip.from(state, {
                            duration: 0.8, ease: 'power2.inOut', scale: true,
                            onComplete: () => {
                                console.log('Flip DOWN complete.');
                                gsap.set(actor3D, { clearProps: 'all' });
                                console.groupEnd();
                            }
                        });
                    }
                });

                // TRIGGER 2: Handles flipping UP.
                ScrollTrigger.create({
                    trigger: summaryContainer, // Use symmetrical trigger
                    start: 'top center',
                    onLeaveBack: () => {
                        console.group('%cEVENT: onLeaveBack (Flip Up)', 'color: #EBCB8B; font-weight:bold;');
                        if (!isFlipped) { console.warn('ABORTED: isFlipped is already false.'); console.groupEnd(); return; }
                        
                        lastEventEl.textContent = 'onLeaveBack (Flip Up)';
                        flipStatusEl.textContent = 'TRANSITIONING...';

                        visualsCol.classList.remove('is-exiting');
                        const state = Flip.getState(actor3D);
                        scene3D.appendChild(actor3D);

                        Flip.from(state, {
                            duration: 0.8, ease: 'power2.out', scale: true,
                            onComplete: () => {
                                console.log('%cFlip UP complete. Starting 3-step sync...', 'color: #BF616A');
                                
                                // THE BULLETPROOF 3-STEP SYNC
                                console.log(`1. actor3D transform before clear: ${gsap.getProperty(actor3D, "transform")}`);
                                gsap.set(actor3D, { clearProps: "transform" });
                                console.log('1. clearProps("transform") complete.');
                                
                                console.log(`2. Timeline progress before seek: ${tl.progress().toFixed(4)}`);
                                tl.seek("finalState"); // Using the label for perfect alignment
                                console.log(`2. Timeline SEEKED to 'finalState'. Progress is now ${tl.progress().toFixed(4)}`);
                                console.log(`   (RotationY should be near -120. Actual: ${gsap.getProperty(actor3D, "rotationY").toFixed(2)})`);

                                mainScrub.enable();
                                scrubStatusEl.textContent = 'ENABLED';
                                console.log('3. Scrub re-enabled.');
                                
                                isFlipped = false;
                                flipStatusEl.textContent = 'In Scroller';
                                lastEventEl.textContent = 'Sync Complete';
                                console.log('SYNC COMPLETE');
                                console.groupEnd();
                            }
                        });
                    }
                });
            }
        });
    });
    return () => ctx.revert();
}

function initialCheck() {
    // unchanged
    if (window.gsap && window.ScrollTrigger && window.Flip) { setupAnimations(); }
    else { let i = 0, max = 30, t = setInterval(() => { i++; if(window.gsap && window.ScrollTrigger && window.Flip) { clearInterval(t); setupAnimations(); } else if (i>=max) { clearInterval(t); console.error("GSAP load fail");}},100); }
}
