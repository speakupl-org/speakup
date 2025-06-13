/*
========================================================================
   STABLE DEBUGGING BUILD v6.0 - Unified Trigger + Perfected Sync
========================================================================
*/
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);

    console.clear();
    console.log('%cGSAP Stable Debug Build v6.0 Initialized.', 'color: #88c0d0; font-weight: bold;');
    
    // Enabling markers is great for debugging the trigger points.
    ScrollTrigger.defaults({ markers: true });

    const ctx = gsap.context(() => {
        // --- Element Selection & Guards ---
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
        
        // This is our master state variable. It's the traffic cop for the relay race.
        let isFlipped = false;

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                
                // --- 1. The Main Scrollytelling Timeline (The "Scrub") ---
                // This part remains the same as your logic.
                gsap.set(textPillars, { autoAlpha: 0 });
                gsap.set(textPillars[0], { autoAlpha: 1 });

                const tl = gsap.timeline({
                    onUpdate: () => progressEl && (progressEl.textContent = `${tl.progress().toFixed(4)}`)
                });
                
                const states = [
                    { rotationY: 20, rotationX: -15, scale: 1.0 }, // Start state after intro
                    { rotationY: 120, rotationX: 10, scale: 1.1 },  // Pillar 2
                    { rotationY: -120, rotationX: -20, scale: 1.2 } // Pillar 3
                ];

                tl.to(actor3D, { ...states[0], duration: 1 })
                  .to(textPillars[0], { autoAlpha: 1 }, '<')
                  .to(textPillars[0], { autoAlpha: 0, duration: 0.5 }, '+=0.5')
                  .to(actor3D, { ...states[1], duration: 1 }, '<')
                  .to(textPillars[1], { autoAlpha: 1, duration: 0.5 }, '<')
                  .to(textPillars[1], { autoAlpha: 0, duration: 0.5 }, '+=0.5')
                  .to(actor3D, { ...states[2], duration: 1 }, '<')
                  .to(textPillars[2], { autoAlpha: 1, duration: 0.5 }, '<')
                  .addLabel("finalState") // CRUCIAL label for the sync process
                  .to(textPillars[2], { autoAlpha: 0, duration: 0.5 }, '+=0.5')
                  .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1.0, duration: 1 }, '<');

                const mainScrub = ScrollTrigger.create({
                    trigger: textCol,
                    pin: visualsCol,
                    start: 'top top',
                    end: 'bottom bottom',
                    animation: tl,
                    scrub: 0.8,
                    invalidateOnRefresh: true,
                });

                // --- 2. The Handoff Trigger (The "Relay Zone") ---
                // This is our UNIFIED trigger. It handles both going down and coming back up.
                ScrollTrigger.create({
                    trigger: summaryContainer,
                    start: 'top center', // Fires when the top of summary hits the center of the viewport
                    // We can add an end to define a "zone", but for onEnter/onLeaveBack, start is often enough.
                    // Let's keep it simple first. end: 'bottom center' 

                    // PHASE 2: The Handoff (Scrolling Down)
                    onEnter: () => {
                        console.group('%cEVENT: onEnter (Handoff to Summary)', 'color: #A3BE8C; font-weight:bold;');
                        if (isFlipped) { 
                            console.warn('ABORTED: Animation is already flipped. No action taken.');
                            console.groupEnd(); 
                            return; 
                        }
                        isFlipped = true; // Set state immediately to prevent race conditions
                        
                        // Update Dashboard
                        lastEventEl.textContent = 'onEnter (Flip Down)';
                        flipStatusEl.textContent = 'FLIPPED';
                        scrubStatusEl.textContent = 'DISABLED';
                        
                        console.log('1. Disabling main scrub.');
                        mainScrub.disable();
                        
                        console.log('2. Recording FLIP state and moving element in DOM.');
                        const state = Flip.getState(actor3D);
                        summaryClipper.appendChild(actor3D);
                        
                        console.log('3. Initiating FLIP animation.');
                        Flip.from(state, {
                            duration: 0.8,
                            ease: 'power2.inOut',
                            scale: true, // Important to animate scale as well as transform
                            onComplete: () => {
                                console.log('4. Flip DOWN complete.');
                                // After flipping, the cube is controlled by normal CSS in the thumbnail.
                                // We can clear props to be safe, but Flip is usually good about this.
                                console.groupEnd();
                            }
                        });
                    },

                    // PHASE 3: The Return Journey (Scrolling Up)
                    onLeaveBack: () => {
                        console.group('%cEVENT: onLeaveBack (Return to Scroller)', 'color: #EBCB8B; font-weight:bold;');
                        if (!isFlipped) {
                            console.warn('ABORTED: Animation is not in flipped state. No action taken.');
                            console.groupEnd();
                            return;
                        }
                        
                        // Update Dashboard
                        lastEventEl.textContent = 'onLeaveBack (Flip Up)';
                        flipStatusEl.textContent = 'TRANSITIONING...';

                        console.log('1. Recording FLIP state and moving element back to scroller DOM.');
                        const state = Flip.getState(actor3D, {props: "transform,opacity"}); // only grab what's needed
                        scene3D.appendChild(actor3D);

                        console.log('2. Initiating FLIP animation (return trip).');
                        Flip.from(state, {
                            duration: 0.8,
                            ease: 'power2.out',
                            scale: true,
                            onComplete: () => {
                                console.log('%c3. Flip UP complete. Initiating the 3-Step-Sync.', 'color: #BF616A; font-weight:bold');
                                
                                // YOUR PERFECT 3-STEP SYNC LOGIC
                                console.log(`   SYNC 1: Clearing inline transform styles left by Flip.`);
                                // Flip leaves a `transform` style on the element. We MUST clear it
                                // so that the GSAP timeline can take full control again.
                                gsap.set(actor3D, { clearProps: "transform" });

                                console.log(`   SYNC 2: Seeking master timeline to the correct 'finalState'.`);
                                // This is the magic. We force the timeline to the exact progress
                                // it should be at when the handoff happens. No more jumps.
                                tl.seek("finalState");

                                console.log(`   SYNC 3: Re-enabling the main scrub now that state is synced.`);
                                mainScrub.enable();
                                
                                isFlipped = false; // The baton has been passed back. Update the state.

                                // Update Dashboard
                                scrubStatusEl.textContent = 'ENABLED';
                                flipStatusEl.textContent = 'In Scroller';
                                lastEventEl.textContent = 'Sync Complete';
                                
                                console.log('SYNC COMPLETE: The relay race is ready for another lap.');
                                console.groupEnd();
                            }
                        });
                    }
                });
            }
        });
    });

    // Return a cleanup function that GSAP will call when the context is reverted
    return () => ctx.revert();
}

// Keep your initial loader logic as it is perfectly fine.
function initialCheck() {
    if (window.gsap && window.ScrollTrigger && window.Flip) {
        setupAnimations();
    } else {
        let i = 0, max = 30, t = setInterval(() => {
            i++;
            if (window.gsap && window.ScrollTrigger && window.Flip) {
                clearInterval(t);
                setupAnimations();
            } else if (i >= max) {
                clearInterval(t);
                console.error("GSAP libraries failed to load after 3 seconds.");
            }
        }, 100);
    }
}
document.addEventListener('DOMContentLoaded', initialCheck);

// You can keep the menu/footer JS as is, it doesn't interfere.
// The code here focuses only on the animation setup.
