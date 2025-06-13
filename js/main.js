/*
===========================================================================
   STABLE DEBUGGING BUILD v7.0 - State Injection & Authoritative Sync
===========================================================================
*/
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);

    console.clear();
    console.log('%cGSAP Stable Debug Build v7.0 Initialized.', 'color: #88c0d0; font-weight: bold;');
    
    ScrollTrigger.defaults({ markers: true });

    const ctx = gsap.context(() => {
        // --- Element Selection & Guards (Unchanged) ---
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

        if (!visualsCol || !scene3D || !textCol || !actor3D || !summaryContainer || !summaryClipper || !flipStatusEl) {
            console.error('Scrollytelling aborted: Critical elements are missing from the DOM.');
            return;
        }
        
        let isFlipped = false;

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                
                // --- 1. The Main Scrollytelling Timeline (Unchanged) ---
                gsap.set(textPillars, { autoAlpha: 0 });
                gsap.set(textPillars[0], { autoAlpha: 1 });

                const tl = gsap.timeline({
                    onUpdate: () => progressEl && (progressEl.textContent = `${tl.progress().toFixed(4)}`)
                });
                
                const states = [
                    { rotationY: 20, rotationX: -15, scale: 1.0 },
                    { rotationY: 120, rotationX: 10, scale: 1.1 },
                    { rotationY: -120, rotationX: -20, scale: 1.2 }
                ];
                
                tl.to(actor3D, { ...states[0], duration: 1 })
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

                // --- 2. The Unified Handoff Trigger (Logic inside is new) ---
                ScrollTrigger.create({
                    trigger: summaryContainer,
                    start: 'top center',
                    
                    // onEnter (Flip Down) logic is solid, no changes needed.
                    onEnter: () => {
                        if (isFlipped) return;
                        isFlipped = true;
                        
                        console.group('%cEVENT: onEnter (Handoff to Summary)', 'color: #A3BE8C; font-weight:bold;');
                        lastEventEl.textContent = 'onEnter (Flip Down)';
                        flipStatusEl.textContent = 'FLIPPED';
                        scrubStatusEl.textContent = 'DISABLED';
                        
                        mainScrub.disable();
                        const state = Flip.getState(actor3D);
                        summaryClipper.appendChild(actor3D);
                        
                        Flip.from(state, {
                            duration: 0.8, ease: 'power2.inOut', scale: true,
                            onComplete: () => { console.log('Flip DOWN complete.'); console.groupEnd(); }
                        });
                    },

                    // onLeaveBack (Return Journey) with NEW Authoritative Sync
                    onLeaveBack: () => {
                        if (!isFlipped) return;
                        
                        console.group('%cEVENT: onLeaveBack (Return to Scroller)', 'color: #EBCB8B; font-weight:bold;');
                        lastEventEl.textContent = 'onLeaveBack (Flip Up)';
                        flipStatusEl.textContent = 'TRANSITIONING...';

                        const state = Flip.getState(actor3D, {props: "transform,opacity"});
                        scene3D.appendChild(actor3D);

                        Flip.from(state, {
                            duration: 0.8, ease: 'power2.out', scale: true,
                            onComplete: () => {
                                console.log('%cFlip UP complete. Initiating Authoritative 4-Step Sync...', 'color: #BF616A; font-weight:bold');
                                
                                // THE BULLETPROOF 4-STEP SYNC
                                console.log(`SYNC 1: Clearing inline 'transform' from Flip animation.`);
                                gsap.set(actor3D, { clearProps: "transform" });

                                console.log(`SYNC 2: Re-enabling the main scrub controller.`);
                                mainScrub.enable();
                                scrubStatusEl.textContent = 'ENABLED';

                                console.log(`SYNC 3: Calculating target scroll position for 'finalState'.`);
                                // Get progress of the label (e.g., 0.7273)
                                const finalStateProgress = tl.labels.finalState / tl.duration();
                                // Calculate the exact scroll pixel value that corresponds to that progress
                                const targetScrollPos = mainScrub.start + (mainScrub.end - mainScrub.start) * finalStateProgress;
                                console.log(`   - Timeline Progress at 'finalState': ${finalStateProgress.toFixed(4)}`);
                                console.log(`   - Target Scroll Position: ${targetScrollPos.toFixed(2)}px`);
                                
                                console.log(`SYNC 4: Forcing ScrollTrigger to the target position (State Injection).`);
                                // This is the magic! We command the controller, not the animation.
                                mainScrub.scroll(targetScrollPos);
                                // For good measure, force a refresh to ensure all calculations are up-to-date.
                                ScrollTrigger.refresh();

                                isFlipped = false;
                                
                                console.log(`VERIFICATION: Current rotation is now: ${gsap.getProperty(actor3D, "rotationY").toFixed(2)}`);
                                flipStatusEl.textContent = 'In Scroller';
                                lastEventEl.textContent = 'Authoritative Sync Complete';
                                console.log('AUTHORITATIVE SYNC COMPLETE.');
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


// Your initial loader and other functions remain perfectly fine.
function initialCheck() {
    // unchanged...
    if (window.gsap && window.ScrollTrigger && window.Flip) { setupAnimations(); }
    else { let i = 0, max = 30, t = setInterval(() => { i++; if(window.gsap && window.ScrollTrigger && window.Flip) { clearInterval(t); setupAnimations(); } else if (i>=max) { clearInterval(t); console.error("GSAP load fail");}},100); }
}
document.addEventListener('DOMContentLoaded', initialCheck);
