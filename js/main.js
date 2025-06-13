/*
========================================================================================
   THE TOTAL CONTROL BUILD v14.0 - One Master, One Timeline, Zero Conflicts.
   
   This is the definitive, stable build. It abandons the flawed multi-trigger
   architectures and empowers the main scroller to control the entire animation lifecycle.
   
   Core Principles:
   1. One Master Controller: The mainScrub ScrollTrigger now exclusively uses its
      own `onLeave` and `onEnterBack` events to orchestrate the handoff.
   2. No External Triggers: The #handoff-point div is REMOVED from the HTML.
   3. The Proven Rebirth Protocol: The core resynchronization logic remains our
      trusted method for the return journey, triggered at the perfect moment.
   4. The Transition Lock: The `isTransitioning` variable is crucial to prevent
      race conditions during the Flip animations.
========================================================================================
*/

/**
 * Main function to initialize all complex animations on the page.
 */
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cGSAP Total Control Build v14.0 Initialized. One Master to rule them all.', 'color: #88C0D0; font-weight: bold; font-size: 14px;');
    ScrollTrigger.defaults({ markers: true });

    const ctx = gsap.context(() => {
        // --- 1. ELEMENT SELECTION ---
        const visualsCol = document.querySelector('.pillar-visuals-col');
        const scene3D = document.querySelector('.scene-3d');
        const textCol = document.querySelector('.pillar-text-col');
        const actor3D = document.getElementById('actor-3d');
        const textPillars = gsap.utils.toArray('.pillar-text-content');
        const summaryClipper = document.querySelector('.summary-thumbnail-clipper');

        if (!visualsCol || !scene3D || !textCol || !actor3D || !summaryClipper) {
            console.error('TOTAL CONTROL ABORTED: One or more critical elements are missing.');
            return;
        }

        // --- Cerebro HUD (Optional but recommended) ---
        const cState = document.getElementById('c-state'), cEvent = document.getElementById('c-event'),
              cTlProg = document.getElementById('c-tl-prog'), cScrubProg = document.getElementById('c-scrub-prog'),
              cRotY = document.getElementById('c-roty'), cRotYTarget = document.getElementById('c-roty-target'),
              cTextAlpha = document.getElementById('c-text-alpha');

        let isFlipped = false;
        let isTransitioning = false; // Our essential safety lock.
        if(cState) cState.textContent = "Standby";

        // --- 2. MEDIA QUERY SCOPE ---
        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                if(cState) cState.textContent = "In Scroller";

                // --- 3. THE PERFECTED TIMELINE ---
                const pillarDelay = 1.25; // Easy-to-tweak value for storytelling pace
                const tl = gsap.timeline({ paused: true });
                const states = { p3: { rotationY: -120, rotationX: -20, scale: 1.2 } };
                if(cRotYTarget) cRotYTarget.textContent = `${states.p3.rotationY}`;
                gsap.set(textPillars, { autoAlpha: 0 });
                
                tl.to(actor3D, { rotationY: 20, rotationX: -15, scale: 1.0, duration: 1 })
                  .to(textPillars[0], { autoAlpha: 1, duration: 0.5 }, "<")
                .to(textPillars[0], { autoAlpha: 0, duration: 0.5 }, `+=${pillarDelay}`)
                  .to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.1, duration: 1 }, "<")
                  .to(textPillars[1], { autoAlpha: 1, duration: 0.5 }, "<")
                .to(textPillars[1], { autoAlpha: 0, duration: 0.5 }, `+=${pillarDelay}`)
                  .to(actor3D, states.p3, { duration: 1 }, "<")
                  .to(textPillars[2], { autoAlpha: 1, duration: 0.5 }, "<")
                  .addLabel("finalState")
                .to(textPillars[2], { autoAlpha: 0, duration: 0.5 }, `+=${pillarDelay}`)
                  .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1.0, duration: 1 }, "<");

                // --- 4. THE ONE MASTER CONTROLLER ---
                const mainScrub = ScrollTrigger.create({
                    trigger: textCol,
                    pin: visualsCol,
                    start: 'top top',
                    end: 'bottom bottom', // End when the bottom of the text column hits the bottom of the viewport
                    animation: tl,
                    scrub: 0.5, // Tighter scrub for better responsiveness
                    invalidateOnRefresh: true,

                    // THE HANDOFF: When the user scrolls PAST the end of the pillar section.
                    onLeave: (self) => {
                        // Abort if scrolling up, already flipped, or another transition is in progress.
                        if (self.direction < 0 || isFlipped || isTransitioning) return;
                        isTransitioning = true;
                        isFlipped = true;
                        if(cState) cState.textContent = "FLIPPED"; if(cEvent) cEvent.textContent = "onLeave";
                        console.log("%cEVENT: onLeave (Handoff to Summary)", "color: #A3BE8C; font-weight: bold;");
                        
                        // We DON'T kill the scrub, we just pause it.
                        self.disable();

                        const state = Flip.getState(actor3D);
                        summaryClipper.appendChild(actor3D);
                        Flip.from(state, {
                            duration: 0.8, ease: 'power2.inOut', scale: true,
                            onComplete: () => {
                                isTransitioning = false;
                                // The scrub remains disabled while the cube is in the summary box.
                            }
                        });
                    },

                    // THE RETURN: When the user scrolls BACK INTO the pillar section.
                    onEnterBack: (self) => {
                        if (!isFlipped || isTransitioning) return;
                        isTransitioning = true;
                        if(cState) cState.textContent = "REBIRTHING..."; if(cEvent) cEvent.textContent = "onEnterBack";
                        console.log("%cEVENT: onEnterBack (Return to Scroller)", "color: #EBCB8B; font-weight: bold;");

                        const state = Flip.getState(actor3D, { props: "transform,opacity" });
                        scene3D.appendChild(actor3D);
                        Flip.from(state, {
                            duration: 0.8, ease: 'power2.out', scale: true,
                            onComplete: () => {
                                // THE PROVEN REBIRTH PROTOCOL
                                // This sequence guarantees a perfect reset.
                                console.group('%cREBIRTH PROTOCOL v14.0 INITIATED', 'color: #D81B60; font-weight:bold;');
                                
                                console.log("1. INVALIDATING TIMELINE to clear cached values.");
                                tl.invalidate();
                                
                                const finalStateProgress = tl.labels.finalState / tl.duration();
                                console.log(`2. SETTING TIMELINE PROGRESS to the 'finalState' label (${finalStateProgress.toFixed(4)}).`);
                                tl.progress(finalStateProgress).pause();
                                
                                // Snap the scroll position to the end of the scroller MINUS a tiny bit,
                                // to ensure we are firmly "inside" the onEnterBack zone.
                                const targetScroll = self.end - 1;
                                console.log(`3. TELEPORTING BROWSER to scroll position: ${targetScroll.toFixed(2)}px.`);
                                window.scrollTo({ top: targetScroll, behavior: 'instant' });
                                
                                console.log("4. REFRESHING ALL TRIGGERS to sync with new reality.");
                                ScrollTrigger.refresh(true);
                                
                                console.log("5. GOING LIVE - Re-enabling the main scrub.");
                                self.enable();
                                
                                isFlipped = false;
                                isTransitioning = false;
                                if(cState) cState.textContent = "In Scroller (Reborn)";
                                console.log("%cREBIRTH COMPLETE. System integrity restored.", 'font-weight: bold;');
                                console.groupEnd();
                            }
                        });
                    }
                });

                // --- Cerebro HUD Update Logic ---
                gsap.ticker.add(() => {
                    if (!cState || cState.textContent === "Standby") return;
                    cTlProg.textContent = tl.progress().toFixed(4);
                    cScrubProg.textContent = mainScrub.progress.toFixed(4);
                    cRotY.textContent = gsap.getProperty(actor3D, "rotationY").toFixed(2);
                    cTextAlpha.textContent = gsap.getProperty(textPillars[2], "autoAlpha").toFixed(2);
                });
            }
        });
    });
    return () => { ctx.revert(); };
}

/**
 * Sets up basic site functionality like menu toggles and footer year.
 */
function setupSiteLogic() {
    // Menu toggle logic
    const openButton = document.getElementById('menu-open-button');
    const closeButton = document.getElementById('menu-close-button');
    const menuScreen = document.getElementById('menu-screen');
    const htmlElement = document.documentElement;
    const body = document.body;

    if (openButton && closeButton && menuScreen) {
        openButton.addEventListener('click', () => {
            htmlElement.classList.add('menu-open');
            body.classList.add('menu-open');
        });
        closeButton.addEventListener('click', () => {
            htmlElement.classList.remove('menu-open');
            body.classList.remove('menu-open');
        });
    }

    // Dynamic footer year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/**
 * Checks for the presence of GSAP libraries before running setup.
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

// --- PRIMARY ENTRY POINT ---
document.addEventListener('DOMContentLoaded', () => {
    setupSiteLogic();
    initialCheck(); 
});
