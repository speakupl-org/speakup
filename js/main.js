/*
========================================================================================
   THE FINAL CODE - Based on First Principles.
   
   This is it. No more theories. No more complex architectures. This is the simplest,
   most robust solution, built on the lessons of every past failure.
   
   Core Principles:
   1. One Master Trigger: The main animation scroller controls everything.
   2. No Helper HTML: The page structure is clean.
   3. Simple Sleep/Wake Cycle: The scroller is temporarily disabled, not killed.
   4. The Bulletproof Sync Protocol: A perfect 4-step sequence purifies the state
      while the scroller is asleep, preventing all conflicts.
========================================================================================
*/

/**
 * Main function to initialize all animations.
 */
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cFinal Build Initialized. Logic based on first principles.', 'color: #0d47a1; font-weight: bold; font-size: 14px;');
    ScrollTrigger.defaults({ markers: true });

    const ctx = gsap.context(() => {
        // --- 1. ELEMENT SELECTION & GUARDS ---
        const visualsCol = document.querySelector('.pillar-visuals-col');
        const scene3D = document.querySelector('.scene-3d');
        const textCol = document.querySelector('.pillar-text-col');
        const actor3D = document.getElementById('actor-3d');
        const textPillars = gsap.utils.toArray('.pillar-text-content');
        const summaryClipper = document.querySelector('.summary-thumbnail-clipper');

        if (!visualsCol || !scene3D || !textCol || !actor3D || !summaryClipper) {
            console.error('FINAL BUILD ABORTED: One or more critical elements are missing.');
            return;
        }

        let isFlipped = false;
        let isTransitioning = false; // Our essential safety lock.

        // --- 2. MEDIA QUERY SCOPE ---
        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                
                // --- 3. THE MASTER TIMELINE ---
                const tl = gsap.timeline({ paused: true });
                gsap.set(textPillars, { autoAlpha: 0 });
                
                tl.to(actor3D, { rotationY: 20, rotationX: -15, scale: 1.0, duration: 1 })
                  .to(textPillars[0], { autoAlpha: 1, duration: 0.5 }, "<")
                .to(textPillars[0], { autoAlpha: 0, duration: 0.5 }, "+=1.25")
                  .to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.1, duration: 1 }, "<")
                  .to(textPillars[1], { autoAlpha: 1, duration: 0.5 }, "<")
                .to(textPillars[1], { autoAlpha: 0, duration: 0.5 }, "+=1.25")
                  .to(actor3D, { rotationY: -120, rotationX: -20, scale: 1.2, duration: 1 }, "<")
                  .to(textPillars[2], { autoAlpha: 1, duration: 0.5 }, "<")
                  .addLabel("finalState")
                .to(textPillars[2], { autoAlpha: 0, duration: 0.5 }, "+=1.25")
                  .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1.0, duration: 1 }, "<");

                // --- 4. THE ONE MASTER CONTROLLER ---
                const mainScrub = ScrollTrigger.create({
                    trigger: textCol,
                    pin: visualsCol,
                    start: 'top top',
                    end: 'bottom bottom',
                    animation: tl,
                    scrub: 0.5,
                    invalidateOnRefresh: true,

                    // THE HANDOFF: When the user scrolls PAST the end of the pillar section.
                    onLeave: (self) => {
                        if (self.direction < 0 || isFlipped || isTransitioning) return;
                        isTransitioning = true;
                        isFlipped = true;
                        console.log("%cEVENT: onLeave -> Putting scroller to sleep.", "color: #A3BE8C;");
                        self.disable();

                        const state = Flip.getState(actor3D);
                        summaryClipper.appendChild(actor3D);
                        Flip.from(state, {
                            duration: 0.8, ease: 'power2.inOut', scale: true,
                            onComplete: () => { isTransitioning = false; }
                        });
                    },

                    // THE RETURN: When the user scrolls BACK INTO the pillar section.
                    onEnterBack: (self) => {
                        if (!isFlipped || isTransitioning) return;
                        isTransitioning = true;
                        console.log("%cEVENT: onEnterBack -> Initiating Return.", "color: #EBCB8B;");

                        const state = Flip.getState(actor3D, { props: "transform,opacity" });
                        scene3D.appendChild(actor3D);
                        Flip.from(state, {
                            duration: 0.8, ease: 'power2.out', scale: true,
                            onComplete: () => {
                                // =======================================================
                                //        THE BULLETPROOF SYNC PROTOCOL
                                // This runs while the scroller is safely disabled.
                                // =======================================================
                                console.group('%cSYNC PROTOCOL: Resynchronizing state...', 'color: #0d47a1; font-weight:bold;');
                                
                                // STEP 1: PURGE element styles left by Flip.
                                console.log("[1] PURGE: Clearing all props from actor.");
                                gsap.set(actor3D, { clearProps: "all" });

                                // STEP 2: INVALIDATE the timeline to forget cached values.
                                console.log("[2] INVALIDATE: Forcing timeline to re-read state.");
                                tl.invalidate();
                                
                                // STEP 3: FORCE a new state.
                                const finalStateProgress = tl.labels.finalState / tl.duration();
                                console.log(`[3] FORCE: Setting timeline progress to ${finalStateProgress.toFixed(4)}.`);
                                tl.progress(finalStateProgress);

                                const finalRotation = gsap.getProperty(actor3D, "rotationY");
                                console.log(`    - VERIFICATION -> Rotation: ${finalRotation.toFixed(2)} | Text Alpha: ${gsap.getProperty(textPillars[2], "autoAlpha").toFixed(2)}`);

                                // STEP 4: TELEPORT the viewport to match the new state.
                                const targetScroll = self.start + (self.end - self.start) * finalStateProgress;
                                console.log(`[4] TELEPORT: Snapping viewport to ${targetScroll.toFixed(2)}px.`);
                                window.scrollTo({ top: targetScroll, behavior: 'instant' });
                                
                                console.log("[5] AWAKEN: Waking up the scroller.");
                                self.enable();
                                isFlipped = false;
                                isTransitioning = false;
                                console.log('%cSYNC COMPLETE. System is pristine.', 'font-weight: bold;');
                                console.groupEnd();
                            }
                        });
                    }
                });
            }
        });
    });
    return () => { ctx.revert(); };
}

// --- ALL OTHER BOILERPLATE JAVASCRIPT ---

function setupSiteLogic() {
    const openButton = document.getElementById('menu-open-button');
    const closeButton = document.getElementById('menu-close-button');
    const menuScreen = document.getElementById('menu-screen');
    const htmlElement = document.documentElement;
    const body = document.body;
    if (openButton && closeButton && menuScreen) {
        openButton.addEventListener('click', () => { htmlElement.classList.add('menu-open'); body.classList.add('menu-open'); });
        closeButton.addEventListener('click', () => { htmlElement.classList.remove('menu-open'); body.classList.remove('menu-open'); });
    }
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

function initialCheck() {
    if (window.gsap && window.ScrollTrigger && window.Flip) {
        setupAnimations();
    } else {
        let i = 0, max = 30, t = setInterval(() => {
            i++;
            if (window.gsap && window.ScrollTrigger && window.Flip) {
                clearInterval(t); setupAnimations();
            } else if (i >= max) {
                clearInterval(t); console.error("CRITICAL ERROR: GSAP load fail");
            }
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupSiteLogic();
    initialCheck();
});
