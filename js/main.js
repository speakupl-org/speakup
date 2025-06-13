/*
=================================================================
   ULTIMATE DEBUGGING BUILD v4.0 - Two Triggers & Live Dashboard
=================================================================
*/
document.addEventListener('DOMContentLoaded', () => {
    // --- Menu & Footer (unchanged) ---
    // (Your existing menu/footer code here)
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
    console.log('%cGSAP Ultimate Debug Build v4.0 Initialized.', 'color: #88c0d0; font-weight: bold;');

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

                textPillars.forEach(p => {
                    const line = p.querySelector('.pillar-line');
                    if (line) ScrollTrigger.create({ trigger: p, start: 'top 60%', onEnter: () => gsap.to(line, {scaleX: 1, duration: 0.8}) });
                });

                const tl = gsap.timeline({
                    defaults: { ease: 'power2.inOut', duration: 1 },
                    onUpdate: () => progressEl && (progressEl.textContent = `${tl.progress().toFixed(4)}`)
                });
                
                const states = [
                    { rotationY: 20, rotationX: -15, scale: 1.0 },
                    { rotationY: 120, rotationX: 10, scale: 1.1 },
                    { rotationY: -120, rotationX: -20, scale: 1.2 }
                ];

                tl.to(actor3D, states[0])
                  .to(textPillars[0], { autoAlpha: 1 }, '<')
                  .to(textPillars[0], { autoAlpha: 0 })
                  .to(textPillars[1], { autoAlpha: 1 }, '<')
                  .to(actor3D, states[1], '<')
                  .to(textPillars[1], { autoAlpha: 0 })
                  .to(textPillars[2], { autoAlpha: 1 }, '<')
                  .to(actor3D, states[2], '<')
                  .addLabel("finalState")
                  .to(textPillars[2], { autoAlpha: 0 })
                  .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1.0 }, '<');

                const mainScrub = ScrollTrigger.create({
                    trigger: textCol,
                    pin: visualsCol,
                    start: 'top top',
                    end: 'bottom bottom',
                    animation: tl,
                    scrub: 0.8,
                });

                // --- STABLE TWO-TRIGGER ARCHITECTURE ---

                // TRIGGER 1: Handles flipping DOWN.
                ScrollTrigger.create({
                    trigger: summaryContainer,
                    start: 'top center',
                    onEnter: () => {
                        console.groupCollapsed('%cEVENT: onEnter (DOWN)', 'color: #A3BE8C; font-weight:bold;');
                        if (isFlipped) { console.warn('ABORTED: isFlipped is already true.'); console.groupEnd(); return; }
                        isFlipped = true;
                        
                        // Update Dashboard
                        lastEventEl.textContent = 'onEnter (Flip Down)';
                        flipStatusEl.textContent = 'FLIPPED';
                        scrubStatusEl.textContent = 'DISABLED';

                        mainScrub.disable();
                        console.log('Scrub disabled. Timeline progress is', tl.progress().toFixed(4));
                        
                        visualsCol.classList.add('is-exiting');
                        const state = Flip.getState(actor3D, {props: "transform"});
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
                // FIX: Trigger is now based on the summary container, making it symmetrical and reliable.
                ScrollTrigger.create({
                    trigger: summaryContainer,
                    start: 'top center', 
                    onLeaveBack: () => {
                        console.group('%cEVENT: onLeaveBack (UP)', 'color: #EBCB8B; font-weight:bold;');
                        if (!isFlipped) { console.warn('ABORTED: isFlipped is already false.'); console.groupEnd(); return; }
                        
                        // Update Dashboard
                        lastEventEl.textContent = 'onLeaveBack (Flip Up)';
                        flipStatusEl.textContent = 'TRANSITIONING...';

                        visualsCol.classList.remove('is-exiting');
                        const state = Flip.getState(actor3D, {props: "transform"});
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
                                tl.seek('finalState');
                                console.log(`2. Timeline has been SEEKED to 'finalState'. Progress is now ${tl.progress().toFixed(4)}`);
                                console.log(`   (RotationY should be near -120. Actual: ${gsap.getProperty(actor3D, "rotationY").toFixed(2)})`);

                                // FINAL FIX: Forcing an update cycle and then enabling ensures the state sticks.
                                mainScrub.refresh();
                                mainScrub.enable();
                                scrubStatusEl.textContent = 'ENABLED';
                                console.log('3. Scrub re-enabled after refresh.');
                                
                                isFlipped = false;
                                flipStatusEl.textContent = 'In Scroller';
                                lastEventEl.textContent = 'Sync Complete';
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

function initialCheck() { /* Unchanged */ }
