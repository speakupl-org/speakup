/*
========================================================================================
   THE FINAL COVENANT BUILD v11.0 - The Rebirth Protocol Meets the Perfected Timeline
   
   This is the definitive, stable build for the "Relay Race" animation.
   It incorporates all learned lessons from the debugging process.
   
   Core Principles:
   1. Unambiguous Trigger: A dedicated #handoff-point div to orchestrate the transition.
   2. Covenant Timeline: A timeline structure with deliberate pauses, creating a "safe zone"
      for the handoff to occur at the "finalState" label.
   3. The Rebirth Protocol: A sequence of `invalidate`, `progress`, `scrollTo`, and `refresh`
      that completely resets and resynchronizes the animation state, curing all amnesia.
   4. Cerebro HUD: A live, on-screen diagnostics panel to provide constant visibility
      into the state of every critical component.
========================================================================================
*/

/**
 * Main function to initialize all page animations.
 */
function setupAnimations() {
    // Register the necessary GSAP plugins.
    gsap.registerPlugin(ScrollTrigger, Flip);

    console.clear();
    console.log('%cGSAP Covenant Build v11.0 Initialized. All systems armed.', 'color: #A3BE8C; font-weight: bold; font-size: 14px;');
    
    // Set GSAP markers for all ScrollTriggers on the page for easy visual debugging.
    ScrollTrigger.defaults({ markers: true });

    // Use GSAP Context for proper setup and teardown. This is best practice.
    const ctx = gsap.context(() => {
        // --- 1. ELEMENT SELECTION & GUARDS ---
        // Every piece of the machine, meticulously accounted for.
        console.log("[Setup] Selecting all required DOM elements.");
        const visualsCol = document.querySelector('.pillar-visuals-col');
        const scene3D = document.querySelector('.scene-3d');
        const textCol = document.querySelector('.pillar-text-col');
        const actor3D = document.getElementById('actor-3d');
        const textPillars = gsap.utils.toArray('.pillar-text-content');
        const summaryClipper = document.querySelector('.summary-thumbnail-clipper');
        const handoffPoint = document.getElementById('handoff-point'); // <-- CRUCIAL TRIGGER

        // A robust guard clause that stops execution if a critical element is not found.
        if (!visualsCol || !scene3D || !textCol || !actor3D || !summaryClipper || !handoffPoint) {
            console.error('COVENANT ABORTED: One or more critical elements are missing from the DOM.');
            return;
        }
        console.log("[Setup] All elements located successfully.");

        // --- Cerebro HUD Element Refs for live data ---
        const cState = document.getElementById('c-state'), cEvent = document.getElementById('c-event'),
              cTlProg = document.getElementById('c-tl-prog'), cScrubProg = document.getElementById('c-scrub-prog'),
              cRotY = document.getElementById('c-roty'), cRotYTarget = document.getElementById('c-roty-target'),
              cTextAlpha = document.getElementById('c-text-alpha');

        let isFlipped = false; // The master state of the relay race.
        cState.textContent = "Standby";

        // --- 2. THE MEDIA QUERY SCOPE ---
        // This ensures the complex scrollytelling logic only runs on larger screens.
        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                console.log("[MatchMedia] Entering desktop setup (min-width: 769px).");
                cState.textContent = "In Scroller";

                // --- 3. THE COVENANT TIMELINE ---
                // This timeline structure creates a "safe zone" for the handoff.
                const tl = gsap.timeline({ paused: true }); // Start paused to prevent premature firing

                // Define the key visual states in an object for clarity and maintainability.
                const states = {
                    p1: { rotationY: 20, rotationX: -15, scale: 1.0 },
                    p2: { rotationY: 120, rotationX: 10, scale: 1.1 },
                    p3: { rotationY: -120, rotationX: -20, scale: 1.2 }, // The target state for the handoff
                    exit: { rotationY: 0, rotationX: 0, scale: 1.0 }
                };

                // Update the HUD with our target rotation for easy comparison.
                cRotYTarget.textContent = `${states.p3.rotationY}`;

                // Set initial state of text pillars to be invisible.
                gsap.set(textPillars, { autoAlpha: 0 });

                // Build the timeline sequence logically, with deliberate pauses.
                tl.to(actor3D, { ...states.p1, duration: 1 })
                  .to(textPillars[0], { autoAlpha: 1, duration: 0.5 }, "<") // Animate text in with cube
                
                .to(textPillars[0], { autoAlpha: 0, duration: 0.5 }, "+=1") // Delay before transitioning to pillar 2
                  .to(actor3D, { ...states.p2, duration: 1 }, "<")
                  .to(textPillars[1], { autoAlpha: 1, duration: 0.5 }, "<")

                .to(textPillars[1], { autoAlpha: 0, duration: 0.5 }, "+=1") // Delay before transitioning to pillar 3
                  .to(actor3D, { ...states.p3, duration: 1 }, "<")
                  .to(textPillars[2], { autoAlpha: 1, duration: 0.5 }, "<")
                  
                  // The "finalState" label is at the PEAK of the Pillar 3 animation.
                  // The cube and text are perfectly synced and visually stable here.
                  // This is our sacred synchronization point.
                  .addLabel("finalState")
                  
                // The final part of the timeline happens AFTER a long delay, ensuring the
                // handoff is safe and does not conflict with the timeline's natural end.
                .to(textPillars[2], { autoAlpha: 0, duration: 0.5 }, "+=1")
                  .to(actor3D, { ...states.exit, duration: 1 }, "<");
                
                console.log(`[Timeline] Covenant Timeline created. Total duration: ${tl.duration().toFixed(2)}s. 'finalState' is at ${((tl.labels.finalState / tl.duration())*100).toFixed(1)}%`);

                // --- 4. THE MASTER SCRUB CONTROLLER ---
                // This ScrollTrigger connects the timeline's progress to the scrollbar.
                const mainScrub = ScrollTrigger.create({
                    trigger: textCol,
                    pin: visualsCol,
                    start: 'top top',
                    end: `bottom bottom-=${window.innerHeight / 2}`, // End scrub with room to spare
                    animation: tl,
                    scrub: 0.8,
                    invalidateOnRefresh: true, // Crucial for responsive resizing
                });

                // --- CEREBRO LIVE UPDATE ENGINE ---
                // Use GSAP's optimized ticker for smooth, continuous updates to the HUD.
                gsap.ticker.add(() => {
                    if (cState.textContent === "Standby") return; // Don't run if not initialized
                    cTlProg.textContent = tl.progress().toFixed(4);
                    cScrubProg.textContent = mainScrub.progress.toFixed(4);
                    cRotY.textContent = gsap.getProperty(actor3D, "rotationY").toFixed(2);
                    cTextAlpha.textContent = gsap.getProperty(textPillars[2], "autoAlpha").toFixed(2);
                });

                // --- 5. THE HANDOFF TRIGGER ---
                // This is the single, authoritative trigger that orchestrates the relay race.
                ScrollTrigger.create({
                    trigger: handoffPoint,
                    start: 'top center',

                    // SCROLLING DOWN: Hand the baton to the summary section.
                    onEnter: () => {
                        if (isFlipped) return; // Prevent multiple fires
                        isFlipped = true;
                        cState.textContent = "FLIPPED"; cEvent.textContent = "onEnter (Flip Down)";
                        console.log("%cEVENT: onEnter (Flip Down)", "color: #A3BE8C; font-weight: bold;");

                        mainScrub.disable(); // Take the scroll-linked animation offline.
                        const state = Flip.getState(actor3D);
                        summaryClipper.appendChild(actor3D); // Move the cube in the DOM
                        Flip.from(state, { duration: 0.8, ease: 'power2.inOut', scale: true });
                    },

                    // SCROLLING UP: Reclaim the baton and restart the scrollytelling.
                    onLeaveBack: () => {
                        if (!isFlipped) return; // Prevent multiple fires
                        cState.textContent = "REBIRTHING..."; cEvent.textContent = "onLeaveBack";
                        
                        // Start the Flip animation to return the cube to its home.
                        const state = Flip.getState(actor3D, {props: "transform,opacity"});
                        scene3D.appendChild(actor3D);

                        Flip.from(state, {
                            duration: 0.8, ease: 'power2.out', scale: true,
                            onComplete: () => {
                                // =============== THE REBIRTH PROTOCOL ===============
                                // This is the final, definitive solution to state synchronization.
                                console.group('%cREBIRTH PROTOCOL INITIATED', 'color: #D81B60; font-weight:bold;');
                                
                                // STEP 1: INVALIDATE - Purge the timeline's corrupted cache of starting values.
                                console.log("1. INVALIDATING TIMELINE - Forcing it to forget all cached values.");
                                tl.invalidate();

                                // STEP 2: RE-RENDER - Set progress to our safe "finalState". Because the timeline is
                                // invalidated, it re-reads the cube's clean DOM state and calculates the correct rotation.
                                const finalStateProgress = tl.labels.finalState / tl.duration();
                                console.log(`2. SETTING PROGRESS to ${finalStateProgress.toFixed(4)}. Timeline will now re-render from a clean state.`);
                                tl.progress(finalStateProgress).pause(); // Set progress AND pause it there to be safe
                                
                                console.log(`   - VERIFICATION (Rotation): ${gsap.getProperty(actor3D, 'rotationY').toFixed(2)} (Target: ${states.p3.rotationY})`);
                                console.log(`   - VERIFICATION (Text Alpha): ${gsap.getProperty(textPillars[2], 'autoAlpha').toFixed(2)} (Target: 1)`);
                                
                                // STEP 3: TELEPORT - Physically move the viewport to the handoff point for a seamless user experience.
                                const handoffPointTop = handoffPoint.getBoundingClientRect().top + window.scrollY;
                                console.log(`3. TELEPORTING BROWSER to scrollY: ${handoffPointTop.toFixed(2)}px.`);
                                window.scrollTo({ top: handoffPointTop, behavior: 'instant' });
                                
                                // STEP 4: REFRESH ALL - Force ALL ScrollTriggers to re-calculate their positions based on the new reality.
                                console.log("4. REFRESHING ALL TRIGGERS to sync with the new scroll position.");
                                ScrollTrigger.refresh(true); // 'true' forces an immediate, synchronous recalculation.

                                // STEP 5: GO LIVE - The system is perfectly synced. Re-enable the master controller.
                                console.log("5. GOING LIVE - Re-enabling the main scrub.");
                                mainScrub.enable();
                                
                                isFlipped = false;
                                cState.textContent = "In Scroller (Reborn)";
                                cEvent.textContent = "Rebirth Complete";
                                console.log("%cREBIRTH COMPLETE. System integrity restored.", 'font-weight: bold;');
                                console.groupEnd();
                            }
                        });
                    }
                });
            }
        });
    });

    // Return the cleanup function from the GSAP context.
    return () => {
        console.log("[Cleanup] Reverting GSAP context to clear all animations and listeners.");
        ctx.revert();
    };
}

/**
 * Checks for the presence of GSAP libraries before running setup.
 * Prevents errors if scripts load out of order.
 */
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
                console.error("CRITICAL ERROR: GSAP libraries failed to load after 3 seconds.");
            }
        }, 100);
    }
}

// Add any other page logic here, outside the animation setup.
function setupSiteLogic() {
    const openButton = document.getElementById('menu-open-button');
    const closeButton = document.getElementById('menu-close-button');
    const menuScreen = document.getElementById('menu-screen');
    const htmlElement = document.documentElement;

    if (openButton && closeButton && menuScreen) {
        openButton.addEventListener('click', () => {
            htmlElement.classList.add('menu-open');
        });
        closeButton.addEventListener('click', () => {
            htmlElement.classList.remove('menu-open');
        });
    }

    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}


// Primary entry point for all JavaScript when the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    setupSiteLogic();
    initialCheck(); // This now specifically handles the animation setup.
});
