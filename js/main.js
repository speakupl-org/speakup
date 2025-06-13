/*
========================================================================================
   THE FINAL COVENANT BUILD v12.0 - The Shielded Rebirth Protocol
   
   This build solves the reverse-scroll race condition by introducing a "Trigger Shield".
   The handoff trigger is temporarily disabled during the state reset, preventing it from
   re-firing prematurely. This ensures a flawless and smooth two-way transition.
   
   Key Upgrades:
   1. Named Trigger: The handoff ScrollTrigger is assigned to a variable.
   2. Trigger Shield: The trigger is disabled/enabled during the `onLeaveBack` sequence.
   3. Enhanced HUD: Now monitors the Handoff Trigger's state for perfect visibility.
   4. Polished Text: Text pillars now animate with a subtle slide-up for more finesse.
========================================================================================
*/

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cGSAP Covenant Build v12.0 Initialized. All systems armed.', 'color: #88C0D0; font-weight: bold; font-size: 14px;');
    ScrollTrigger.defaults({ markers: true });

    const ctx = gsap.context(() => {
        // --- 1. ELEMENT SELECTION ---
        console.log("[Setup] Selecting all required DOM elements.");
        const visualsCol = document.querySelector('.pillar-visuals-col');
        const scene3D = document.querySelector('.scene-3d');
        const textCol = document.querySelector('.pillar-text-col');
        const actor3D = document.getElementById('actor-3d');
        const textPillars = gsap.utils.toArray('.pillar-text-content');
        const summaryClipper = document.querySelector('.summary-thumbnail-clipper');
        const handoffPoint = document.getElementById('handoff-point');

        if (!visualsCol || !scene3D || !textCol || !actor3D || !summaryClipper || !handoffPoint) {
            console.error('COVENANT ABORTED: One or more critical elements are missing.');
            return;
        }
        console.log("[Setup] All elements located successfully.");

        // --- Cerebro HUD v12 Element Refs ---
        const cState = document.getElementById('c-state'), cEvent = document.getElementById('c-event'),
              cTlProg = document.getElementById('c-tl-prog'), cScrubProg = document.getElementById('c-scrub-prog'),
              cHandoffState = document.getElementById('c-handoff-state'), // <-- CRANK UP: HUD element
              cRotY = document.getElementById('c-roty'), cRotYTarget = document.getElementById('c-roty-target'),
              cTextAlpha = document.getElementById('c-text-alpha');

        let isFlipped = false;
        cState.textContent = "Standby";

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                console.log("[MatchMedia] Entering desktop setup (min-width: 769px).");
                cState.textContent = "In Scroller";
                
                const tl = gsap.timeline({ paused: true });

                const states = {
                    p1: { rotationY: 20, rotationX: -15, scale: 1.0 },
                    p2: { rotationY: 120, rotationX: 10, scale: 1.1 },
                    p3: { rotationY: -120, rotationX: -20, scale: 1.2 },
                    exit: { rotationY: 0, rotationX: 0, scale: 1.0 }
                };
                cRotYTarget.textContent = `${states.p3.rotationY}`;
                
                // Set initial state of text pillars for animation
                gsap.set(textPillars, { autoAlpha: 0, y: '30px' });
                // Make first pillar visible on load
                gsap.set(textPillars[0], { autoAlpha: 1, y: '0px' });

                tl.to(actor3D, { ...states.p1, duration: 1 })
                  // Text for pillar 1 already visible, we don't animate it in
                
                .to(textPillars[0], { autoAlpha: 0, y: '-30px', duration: 0.4 }, "+=1")
                  .to(actor3D, { ...states.p2, duration: 1 }, "<")
                  .to(textPillars[1], { autoAlpha: 1, y: '0px', duration: 0.4 }, "<+=0.2") // <-- CRANK UP: Polished text anim

                .to(textPillars[1], { autoAlpha: 0, y: '-30px', duration: 0.4 }, "+=1")
                  .to(actor3D, { ...states.p3, duration: 1 }, "<")
                  .to(textPillars[2], { autoAlpha: 1, y: '0px', duration: 0.4 }, "<+=0.2") // <-- CRANK UP: Polished text anim
                  
                  .addLabel("finalState")
                  
                .to(textPillars[2], { autoAlpha: 0, y: '-30px', duration: 0.4 }, "+=1")
                  .to(actor3D, { ...states.exit, duration: 1 }, "<");
                
                console.log(`[Timeline] Covenant Timeline created. Total duration: ${tl.duration().toFixed(2)}s. 'finalState' is at ${((tl.labels.finalState / tl.duration())*100).toFixed(1)}%`);

                const mainScrub = ScrollTrigger.create({
                    trigger: textCol,
                    pin: visualsCol,
                    start: 'top top',
                    end: `bottom bottom-=${window.innerHeight / 2}`,
                    animation: tl,
                    scrub: 0.8,
                    invalidateOnRefresh: true,
                });

                gsap.ticker.add(() => {
                    if (cState.textContent === "Standby") return;
                    cTlProg.textContent = tl.progress().toFixed(4);
                    cScrubProg.textContent = mainScrub.progress.toFixed(4);
                    cRotY.textContent = gsap.getProperty(actor3D, "rotationY").toFixed(2);
                    cTextAlpha.textContent = gsap.getProperty(textPillars[2], "autoAlpha").toFixed(2);
                });
                
                // <-- CRANK UP: Give the handoff trigger a name!
                const handoffTrigger = ScrollTrigger.create({
                    trigger: handoffPoint,
                    start: 'top center',
                    onUpdate: self => { // <-- CRANK UP: Live monitoring
                         cHandoffState.textContent = self.isActive ? "ACTIVE" : "Enabled";
                    },
                    onEnter: () => {
                        if (isFlipped) return;
                        isFlipped = true;
                        cState.textContent = "FLIPPED"; cEvent.textContent = "onEnter (Flip Down)";
                        console.log("%cEVENT: onEnter (Flip Down)", "color: #A3BE8C; font-weight: bold;");

                        mainScrub.disable();
                        const state = Flip.getState(actor3D);
                        summaryClipper.appendChild(actor3D);
                        Flip.from(state, { duration: 0.8, ease: 'power2.inOut', scale: true });
                    },
                    onLeaveBack: () => {
                        if (!isFlipped) return;
                        
                        // ================== TRIGGER SHIELD: ENGAGE! ==================
                        console.log('%cSHIELD ENGAGED: Handoff Trigger Disabled', 'color: #EBCB8B;');
                        handoffTrigger.disable(); // <-- CRANK UP: The core fix!
                        cHandoffState.textContent = "DISABLED (Rebirthing)";
                        // =============================================================

                        cState.textContent = "REBIRTHING..."; cEvent.textContent = "onLeaveBack";
                        
                        const state = Flip.getState(actor3D, {props: "transform,opacity"});
                        scene3D.appendChild(actor3D);

                        Flip.from(state, {
                            duration: 0.8, ease: 'power2.out', scale: true,
                            onComplete: () => {
                                console.group('%cREBIRTH PROTOCOL INITIATED', 'color: #D81B60; font-weight:bold;');
                                
                                console.log("1. INVALIDATING TIMELINE...");
                                tl.invalidate();

                                const finalStateProgress = tl.labels.finalState / tl.duration();
                                console.log(`2. SETTING PROGRESS to ${finalStateProgress.toFixed(4)}.`);
                                tl.progress(finalStateProgress).pause();
                                
                                console.log(`   - VERIFICATION (Rotation): ${gsap.getProperty(actor3D, 'rotationY').toFixed(2)} (Target: ${states.p3.rotationY})`);
                                console.log(`   - VERIFICATION (Text Alpha): ${gsap.getProperty(textPillars[2], 'autoAlpha').toFixed(2)} (Target: 1)`);
                                
                                const handoffPointTop = handoffPoint.getBoundingClientRect().top + window.scrollY;
                                console.log(`3. TELEPORTING BROWSER to scrollY: ${handoffPointTop.toFixed(2)}px.`);
                                window.scrollTo({ top: handoffPointTop, behavior: 'instant' });
                                
                                console.log("4. REFRESHING ALL TRIGGERS...");
                                ScrollTrigger.refresh(true);

                                console.log("5. GOING LIVE - Re-enabling main scrub.");
                                mainScrub.enable();
                                
                                // ================== TRIGGER SHIELD: DISENGAGE! ==================
                                console.log('%cSHIELD DISENGAGED: Handoff Trigger Re-enabled', 'color: #A3BE8C;');
                                handoffTrigger.enable(); // <-- CRANK UP: Lower the shield
                                // ================================================================

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

    return () => {
        console.log("[Cleanup] Reverting GSAP context.");
        ctx.revert();
    };
}

// Initial check and other logic remains the same...

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

document.addEventListener('DOMContentLoaded', () => {
    setupSiteLogic();
    initialCheck();
});
