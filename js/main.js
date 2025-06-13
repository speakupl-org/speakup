function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cGSAP Seal of Integrity Build v12.1 Initialized. All systems locked and loaded.', 'color: #5E81AC; font-weight: bold; font-size: 14px;');
    
    // Set GSAP markers for all ScrollTriggers on the page for easy visual debugging.
    ScrollTrigger.defaults({ markers: true });

    // Use GSAP Context for proper setup and teardown. This is best practice for React/Vue,
    // and excellent for preventing memory leaks in vanilla JS.
    const ctx = gsap.context(() => {
        // --- 1. ELEMENT SELECTION ---
        // A single, central place for all element queries.
        const visualsCol = document.querySelector('.pillar-visuals-col');
        const scene3D = document.querySelector('.scene-3d');
        const textCol = document.querySelector('.pillar-text-col');
        const actor3D = document.getElementById('actor-3d');
        const textPillars = gsap.utils.toArray('.pillar-text-content');
        const summaryClipper = document.querySelector('.summary-thumbnail-clipper');
        const handoffPoint = document.getElementById('handoff-point'); // This is now the 50vh tall buffer div

        // A robust guard clause to prevent the script from running if the page structure is wrong.
        if (!visualsCol || !scene3D || !textCol || !actor3D || !summaryClipper || !handoffPoint) {
            console.error('SEAL OF INTEGRITY ABORTED: One or more critical animation elements are missing.');
            return;
        }

        // --- Cerebro HUD Element Refs (if they exist) ---
        const cState = document.getElementById('c-state'), cEvent = document.getElementById('c-event'),
              cTlProg = document.getElementById('c-tl-prog'), cScrubProg = document.getElementById('c-scrub-prog'),
              cRotY = document.getElementById('c-roty'), cRotYTarget = document.getElementById('c-roty-target'),
              cTextAlpha = document.getElementById('c-text-alpha');

        // The two master state variables for the entire animation.
        let isFlipped = false;
        let isTransitioning = false; // The final safety lock against race conditions.
        if(cState) cState.textContent = "Standby";

        // --- 2. THE MEDIA QUERY SCOPE ---
        // This ensures the complex scrollytelling logic only runs on larger screens.
        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                if(cState) cState.textContent = "In Scroller";

                // --- 3. THE PERFECTED TIMELINE ---
                const tl = gsap.timeline({ paused: true });
                const states = {
                    p3: { rotationY: -120, rotationX: -20, scale: 1.2 }
                };
                if(cRotYTarget) cRotYTarget.textContent = `${states.p3.rotationY}`;
                gsap.set(textPillars, { autoAlpha: 0 });
                
                // Timeline with generous delays for a better storytelling rhythm.
                tl.to(actor3D, { rotationY: 20, rotationX: -15, scale: 1.0, duration: 1 })
                  .to(textPillars[0], { autoAlpha: 1, duration: 0.5 }, "<")
                .to(textPillars[0], { autoAlpha: 0, duration: 0.5 }, "+=1.5")
                  .to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.1, duration: 1 }, "<")
                  .to(textPillars[1], { autoAlpha: 1, duration: 0.5 }, "<")
                .to(textPillars[1], { autoAlpha: 0, duration: 0.5 }, "+=1.5")
                  .to(actor3D, states.p3, { duration: 1 }, "<")
                  .to(textPillars[2], { autoAlpha: 1, duration: 0.5 }, "<")
                  .addLabel("finalState")
                .to(textPillars[2], { autoAlpha: 0, duration: 0.5 }, "+=1.5")
                  .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1.0, duration: 1 }, "<");

                // --- 4. MASTER SCRUB & CEREBRO ---
                const mainScrub = ScrollTrigger.create({
                    trigger: textCol, pin: visualsCol, start: 'top top',
                    end: `bottom bottom`, // Let it scroll to the absolute end of the text column
                    animation: tl, scrub: 0.8, invalidateOnRefresh: true,
                });

                // Continuously update the HUD if it exists.
                gsap.ticker.add(() => {
                    if (!cState || cState.textContent === "Standby") return;
                    cTlProg.textContent = tl.progress().toFixed(4);
                    cScrubProg.textContent = mainScrub.progress.toFixed(4);
                    cRotY.textContent = gsap.getProperty(actor3D, "rotationY").toFixed(2);
                    cTextAlpha.textContent = gsap.getProperty(textPillars[2], "autoAlpha").toFixed(2);
                });

                // --- 5. THE FINAL, UNBREAKABLE HANDOFF TRIGGER ---
                ScrollTrigger.create({
                    trigger: handoffPoint, // Now triggering on the 50vh tall div
                    start: 'top center',   // The robust and correct trigger point
                    onEnter: () => {
                        if (isFlipped || isTransitioning) return;
                        isTransitioning = true; // Engage lock
                        isFlipped = true;
                        if(cState) cState.textContent = "FLIPPED";
                        if(cEvent) cEvent.textContent = "onEnter";
                        mainScrub.disable();
                        const state = Flip.getState(actor3D);
                        summaryClipper.appendChild(actor3D);
                        Flip.from(state, { 
                            duration: 0.8, 
                            ease: 'power2.inOut', 
                            scale: true,
                            onComplete: () => { isTransitioning = false; } // Release lock
                        });
                    },

                    onLeaveBack: () => {
                        if (!isFlipped || isTransitioning) return;
                        isTransitioning = true; // Engage the safety lock
                        if(cState) cState.textContent = "REBIRTHING...";
                        if(cEvent) cEvent.textContent = "onLeaveBack";
                        
                        const state = Flip.getState(actor3D, {props: "transform,opacity"});
                        scene3D.appendChild(actor3D);

                        Flip.from(state, {
                            duration: 0.8, ease: 'power2.out', scale: true,
                            onComplete: () => {
                                // THE PROVEN REBIRTH PROTOCOL
                                tl.invalidate();
                                const finalStateProgress = tl.labels.finalState / tl.duration();
                                tl.progress(finalStateProgress).pause();
                                const handoffPointTop = handoffPoint.getBoundingClientRect().top + window.scrollY;
                                window.scrollTo({ top: handoffPointTop, behavior: 'instant' });
                                ScrollTrigger.refresh(true);
                                mainScrub.enable();
                                isFlipped = false;
                                isTransitioning = false; // Release the safety lock
                                if(cState) cState.textContent = "In Scroller (Reborn)";
                            }
                        });
                    }
                });
            }
        });
    });
    return () => { ctx.revert(); };
}

/**
 * Sets up basic site functionality like menu toggles and footer year.
 * This function does not depend on GSAP.
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
 * This is a safety mechanism to prevent errors if scripts load out of order.
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
// This is the first thing that runs after the HTML document is fully loaded and parsed.
document.addEventListener('DOMContentLoaded', () => {
    // Set up basic site functionality first.
    setupSiteLogic();
    // Then, initialize the complex animations.
    initialCheck(); 
});
