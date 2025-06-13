/*
========================================================================================
   THE CRIME SCENE INVESTIGATION BUILD v13.0 - Forensic Trigger Zone
   
   This build diagnoses the "freeze" by creating an unambiguous trigger "Zone"
   and logging every possible entry and exit event.
   
   Core Principles:
   1. The Trigger Zone: We use an explicit start and end (`top bottom`, `bottom top`)
      on our 50vh #handoff-point to create a large, foolproof activation zone.
   2. Forensic Logging: ALL four trigger callbacks (onEnter, onLeave, onEnterBack,
      onLeaveBack) are instrumented with verbose logs to expose the exact event flow.
   3. The Proven Rebirth Protocol: The core resynchronization logic remains our
      trusted method for the return journey, but it's now triggered by the correct event.
========================================================================================
*/

/**
 * Main function to initialize all complex animations on the page.
 */
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cGSAP Crime Scene Investigation v13.0 Initialized. All events are being monitored.', 'color: #BF616A; font-weight: bold; font-size: 14px;');
    ScrollTrigger.defaults({ markers: true });

    const ctx = gsap.context(() => {
        // --- 1. ELEMENT SELECTION & GUARDS ---
        const visualsCol = document.querySelector('.pillar-visuals-col');
        const scene3D = document.querySelector('.scene-3d');
        const textCol = document.querySelector('.pillar-text-col');
        const actor3D = document.getElementById('actor-3d');
        const textPillars = gsap.utils.toArray('.pillar-text-content');
        const summaryClipper = document.querySelector('.summary-thumbnail-clipper');
        const handoffPoint = document.getElementById('handoff-point'); 

        if (!visualsCol || !scene3D || !textCol || !actor3D || !summaryClipper || !handoffPoint) {
            console.error('CSI ABORTED: One or more critical elements are missing.');
            return;
        }

        // --- Cerebro HUD Element Refs (if they exist) ---
        const cState = document.getElementById('c-state'), cEvent = document.getElementById('c-event'),
              cTlProg = document.getElementById('c-tl-prog'), cScrubProg = document.getElementById('c-scrub-prog'),
              cRotY = document.getElementById('c-roty'), cRotYTarget = document.getElementById('c-roty-target'),
              cTextAlpha = document.getElementById('c-text-alpha');

        let isFlipped = false;
        let isTransitioning = false;
        if(cState) cState.textContent = "Standby";

        // --- 2. THE MEDIA QUERY SCOPE ---
        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                if(cState) cState.textContent = "In Scroller";

                // --- 3. THE PERFECTED TIMELINE (Unchanged) ---
                const tl = gsap.timeline({ paused: true });
                const states = {
                    p3: { rotationY: -120, rotationX: -20, scale: 1.2 }
                };
                if(cRotYTarget) cRotYTarget.textContent = `${states.p3.rotationY}`;
                gsap.set(textPillars, { autoAlpha: 0 });
                
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

                // --- 4. MASTER SCRUB & CEREBRO (Unchanged) ---
                const mainScrub = ScrollTrigger.create({
                    trigger: textCol, pin: visualsCol, start: 'top top',
                    end: `bottom bottom`,
                    animation: tl, scrub: 0.8, invalidateOnRefresh: true,
                });
                gsap.ticker.add(() => { /* Cerebro update logic */ });

                // --- 5. THE FORENSIC HANDOFF TRIGGER ZONE ---
                ScrollTrigger.create({
                    trigger: handoffPoint,
                    start: 'top bottom', // Zone begins when top of trigger hits bottom of viewport
                    end: 'bottom top',   // Zone ends when bottom of trigger hits top of viewport

                    // --- FORENSIC LOGGING ---
                    onEnter: () => {
                        console.log('%cEVENT: onEnter', 'color: #A3BE8C');
                        if (isFlipped || isTransitioning) { console.log('-> ABORTED (already flipped/transitioning)'); return; }
                        isTransitioning = true;
                        isFlipped = true;
                        if(cState) cState.textContent = "FLIPPED"; if(cEvent) cEvent.textContent = "onEnter";
                        mainScrub.disable();
                        const state = Flip.getState(actor3D);
                        summaryClipper.appendChild(actor3D);
                        Flip.from(state, { 
                            duration: 0.8, ease: 'power2.inOut', scale: true,
                            onComplete: () => { isTransitioning = false; }
                        });
                    },
                    onLeave: () => { console.log('%cEVENT: onLeave', 'color: #EBCB8B'); },
                    onEnterBack: () => { console.log('%cEVENT: onEnterBack', 'color: #EBCB8B'); },
                    
                    onLeaveBack: () => {
                        console.log('%cEVENT: onLeaveBack', 'color: #A3BE8C');
                        if (!isFlipped || isTransitioning) { console.log('-> ABORTED (not flipped or is transitioning)'); return; }
                        isTransitioning = true;
                        if(cState) cState.textContent = "REBIRTHING..."; if(cEvent) cEvent.textContent = "onLeaveBack";
                        
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
                                isTransitioning = false;
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
 */
function setupSiteLogic() {
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
