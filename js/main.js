/*
========================================================================================
   THE FINAL COVENANT BUILD v13.0 - The Directional Lock Protocol
   
   This is the definitive build. It replaces the "Trigger Shield" with a more robust
   and elegant "Directional Lock". The handoff trigger now uses `onToggle` to check
   the scroll direction, ensuring the flip-down and rebirth animations ONLY fire
   when scrolling in the correct direction. This completely eliminates the race condition.
   
   Key Upgrades:
   1. Directional Logic: `onEnter` & `onLeaveBack` are replaced with a single `onToggle`.
   2. Absolute Robustness: Actions are now tied to user intent (scroll direction).
   3. Cleaner Code: The `disable()`/`enable()` shield is no longer necessary.
   4. Ultimate Diagnostics: The Cerebro-HUD v13 now monitors scroll direction.
========================================================================================
*/

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cGSAP Covenant Build v13.0 Initialized. All systems armed.', 'color: #88C0D0; font-weight: bold; font-size: 14px;');
    ScrollTrigger.defaults({ markers: true });

    const ctx = gsap.context(() => {
        // --- 1. ELEMENT SELECTION ---
        console.log("[Setup] Selecting all required DOM elements.");
        const visualsCol = document.querySelector('.pillar-visuals-col');
        const scene3D = document.querySelector('.scene-3d');
        const actor3D = document.getElementById('actor-3d');
        const textPillars = gsap.utils.toArray('.pillar-text-content');
        const summaryClipper = document.querySelector('.summary-thumbnail-clipper');
        const handoffPoint = document.getElementById('handoff-point');
        if (!visualsCol || !scene3D || !actor3D || !summaryClipper || !handoffPoint) {
            console.error('COVENANT ABORTED: One or more critical elements are missing.');
            return;
        }
        console.log("[Setup] All elements located successfully.");

        // --- Cerebro HUD v13 Element Refs ---
        const cState = document.getElementById('c-state'), cEvent = document.getElementById('c-event'),
              cTlProg = document.getElementById('c-tl-prog'), cScrubProg = document.getElementById('c-scrub-prog'),
              cHandoffState = document.getElementById('c-handoff-state'),
              cScrollDir = document.getElementById('c-scroll-dir'), // <-- CRANK UP: HUD element
              cRotY = document.getElementById('c-roty'), cRotYTarget = document.getElementById('c-roty-target');

        let isFlipped = false;
        cState.textContent = "Standby";

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                console.log("[MatchMedia] Entering desktop setup (min-width: 769px).");
                cState.textContent = "In Scroller";
                
                // Timeline setup is unchanged
                const tl = gsap.timeline({ paused: true });
                const states = {
                    p1: { rotationY: 20, rotationX: -15, scale: 1.0 },
                    p2: { rotationY: 120, rotationX: 10, scale: 1.1 },
                    p3: { rotationY: -120, rotationX: -20, scale: 1.2 },
                    exit: { rotationY: 0, rotationX: 0, scale: 1.0 }
                };
                cRotYTarget.textContent = `${states.p3.rotationY}`;
                gsap.set(textPillars, { autoAlpha: 0, y: '30px' });
                gsap.set(textPillars[0], { autoAlpha: 1, y: '0px' });
                tl.to(actor3D, { ...states.p1, duration: 1 })
                  .to(textPillars[0], { autoAlpha: 0, y: '-30px', duration: 0.4 }, "+=1")
                  .to(actor3D, { ...states.p2, duration: 1 }, "<")
                  .to(textPillars[1], { autoAlpha: 1, y: '0px', duration: 0.4 }, "<+=0.2")
                  .to(textPillars[1], { autoAlpha: 0, y: '-30px', duration: 0.4 }, "+=1")
                  .to(actor3D, { ...states.p3, duration: 1 }, "<")
                  .to(textPillars[2], { autoAlpha: 1, y: '0px', duration: 0.4 }, "<+=0.2")
                  .addLabel("finalState")
                  .to(textPillars[2], { autoAlpha: 0, y: '-30px', duration: 0.4 }, "+=1")
                  .to(actor3D, { ...states.exit, duration: 1 }, "<");
                console.log(`[Timeline] Covenant Timeline created. Total duration: ${tl.duration().toFixed(2)}s.`);

                // Master scrub setup is unchanged
                const mainScrub = ScrollTrigger.create({
                    trigger: textCol,
                    pin: visualsCol,
                    start: 'top top',
                    end: `bottom bottom-=${window.innerHeight / 2}`,
                    animation: tl,
                    scrub: 0.8,
                    invalidateOnRefresh: true,
                });
                
                // HUD Ticker is unchanged (but we'll update it inside the trigger)
                gsap.ticker.add(() => {
                    if (cState.textContent === "Standby") return;
                    cTlProg.textContent = tl.progress().toFixed(4);
                    cScrubProg.textContent = mainScrub.progress.toFixed(4);
                    cRotY.textContent = gsap.getProperty(actor3D, "rotationY").toFixed(2);
                });
                
                // ================== THE DIRECTIONAL LOCK TRIGGER (v13) ==================
                // This is the final, most robust version.
                ScrollTrigger.create({
                    trigger: handoffPoint,
                    start: 'top center',
                    onUpdate: self => { // Continuously monitor the direction for the HUD
                        cScrollDir.textContent = self.direction === 1 ? 'DOWN' : 'UP';
                    },
                    // `onToggle` fires whenever the trigger's `isActive` state changes.
                    // `self.isActive` is true when inside, false when outside.
                    // `self.direction` is 1 when scrolling down, -1 when scrolling up.
                    onToggle: self => {
                        cHandoffState.textContent = self.isActive ? 'ACTIVE' : 'INACTIVE';
                        
                        // CONDITION 1: We ENTERED the trigger zone (`isActive` is true)
                        // AND we were scrolling DOWN (`direction` is 1)
                        if (self.isActive && self.direction === 1) {
                            if (isFlipped) return;
                            isFlipped = true;
                            cState.textContent = "FLIPPED"; cEvent.textContent = "onToggle (Flip Down)";
                            console.log("%cEVENT: onToggle -> Flip Down (Direction: " + self.direction + ")", "color: #A3BE8C; font-weight: bold;");

                            mainScrub.disable();
                            const state = Flip.getState(actor3D);
                            summaryClipper.appendChild(actor3D);
                            Flip.from(state, { duration: 0.8, ease: 'power2.inOut', scale: true });
                        }
                        
                        // CONDITION 2: We LEFT the trigger zone (`isActive` is false)
                        // AND we were scrolling UP (`direction` is -1)
                        if (!self.isActive && self.direction === -1) {
                            if (!isFlipped) return;
                            
                            cState.textContent = "REBIRTHING..."; cEvent.textContent = "onToggle (Rebirth)";
                            console.log("%cEVENT: onToggle -> Rebirth (Direction: " + self.direction + ")", "color: #EBCB8B; font-weight: bold;");
                            
                            const state = Flip.getState(actor3D, {props: "transform,opacity"});
                            scene3D.appendChild(actor3D);

                            Flip.from(state, {
                                duration: 0.8, ease: 'power2.out', scale: true,
                                onComplete: () => {
                                    // The Rebirth Protocol is unchanged, it's perfect.
                                    console.group('%cREBIRTH PROTOCOL INITIATED', 'color: #D81B60; font-weight:bold;');
                                    tl.invalidate();
                                    const finalStateProgress = tl.labels.finalState / tl.duration();
                                    tl.progress(finalStateProgress).pause();
                                    const handoffPointTop = handoffPoint.getBoundingClientRect().top + window.scrollY;
                                    window.scrollTo({ top: handoffPointTop, behavior: 'instant' });
                                    ScrollTrigger.refresh(true);
                                    mainScrub.enable();
                                    isFlipped = false;
                                    cState.textContent = "In Scroller (Reborn)";
                                    cEvent.textContent = "Rebirth Complete";
                                    console.log("%cREBIRTH COMPLETE. System integrity restored.", 'font-weight: bold;');
                                    console.groupEnd();
                                }
                            });
                        }
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


// NO CHANGES BELOW THIS LINE - Standard Setup/Teardown
// ... (initialCheck, setupSiteLogic, DOMContentLoaded listener remain the same) ...

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
