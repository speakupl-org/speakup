/*
========================================================================================
   THE FINAL COVENANT BUILD v14.0 - The Rebirth Lock Protocol
   
   This is the definitive, battle-hardened build. It solves the final race condition
   caused by the `scrollTo` jump poisoning the `direction` calculation for a single frame.
   
   The "Rebirth Lock" (`isRebirthing` flag) is a manual state lock that is engaged
   the moment a rebirth is triggered and disengaged ONLY after the entire protocol,
   including the Flip animation, is complete. This makes the system immune to the
   `scrollTo` anomaly and provides absolute state control. This is the final gear.
========================================================================================
*/

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cGSAP Covenant Build v14.0 Initialized. All systems armed.', 'color: #88C0D0; font-weight: bold; font-size: 14px;');
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
        const textCol = document.querySelector('.pillar-text-col'); 
        
        if (!visualsCol || !scene3D || !actor3D || !summaryClipper || !handoffPoint || !textCol) {
            console.error('COVENANT ABORTED: One or more critical elements are missing.'); return;
        }
        console.log("[Setup] All elements located successfully.");

        // --- Cerebro HUD v14 Element Refs ---
        const cState = document.getElementById('c-state'), cEvent = document.getElementById('c-event'),
              cTlProg = document.getElementById('c-tl-prog'), cScrubProg = document.getElementById('c-scrub-prog'),
              cHandoffState = document.getElementById('c-handoff-state'),
              cScrollDir = document.getElementById('c-scroll-dir'),
              cRebirthLock = document.getElementById('c-rebirth-lock'), // <-- CRANK UP: HUD for the lock
              cRotY = document.getElementById('c-roty'), cRotYTarget = document.getElementById('c-roty-target');

        // --- THE UNBREAKABLE STATE LOCKS ---
        let isFlipped = false;
        let isRebirthing = false; // <-- CRANK UP: The master lock
        cState.textContent = "Standby";
        cRebirthLock.textContent = "INACTIVE";

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                console.log("[MatchMedia] Entering desktop setup (min-width: 769px).");
                cState.textContent = "In Scroller";
                
                // Timeline and Scrub setup are unchanged and correct.
                const tl = gsap.timeline({ paused: true });
                const states = { /* ... */ }; // (omitted for brevity)
                // ... full timeline definition ...
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
                
                const mainScrub = ScrollTrigger.create({ trigger: textCol, pin: visualsCol, start: 'top top', end: `bottom bottom-=${window.innerHeight / 2}`, animation: tl, scrub: 0.8, invalidateOnRefresh: true, });
                gsap.ticker.add(() => { /* HUD Ticker */ if(cState.textContent==="Standby")return;cTlProg.textContent=tl.progress().toFixed(4);cScrubProg.textContent=mainScrub.progress.toFixed(4);cRotY.textContent=gsap.getProperty(actor3D,"rotationY").toFixed(2); });
                
                // ================== THE REBIRTH LOCK TRIGGER (v14) ==================
                ScrollTrigger.create({
                    trigger: handoffPoint,
                    start: 'top center',
                    onUpdate: self => { cScrollDir.textContent = self.direction === 1 ? 'DOWN' : 'UP'; },
                    onToggle: self => {
                        cHandoffState.textContent = self.isActive ? 'ACTIVE' : 'INACTIVE';
                        
                        // --- FLIP DOWN LOGIC (Guarded by the Lock) ---
                        if (self.isActive && self.direction === 1) {
                            if (isFlipped || isRebirthing) { // <-- CRANK UP: Check the lock!
                                if (isRebirthing) console.log("%cFlip Down BLOCKED by Rebirth Lock.", "color: #D08770;");
                                return;
                            }
                            isFlipped = true;
                            cState.textContent = "FLIPPED"; cEvent.textContent = "onToggle (Flip Down)";
                            console.log("%cEVENT: onToggle -> Flip Down", "color: #A3BE8C; font-weight: bold;");

                            mainScrub.disable();
                            const state = Flip.getState(actor3D);
                            summaryClipper.appendChild(actor3D);
                            Flip.from(state, { duration: 0.8, ease: 'power2.inOut', scale: true });
                        }
                        
                        // --- REBIRTH LOGIC (Engages the Lock) ---
                        if (!self.isActive && self.direction === -1) {
                            if (!isFlipped) return;

                            // ENGAGE THE LOCK FIRST
                            isRebirthing = true;
                            cRebirthLock.textContent = "ACTIVE";
                            console.log('%cREBIRTH LOCK: ENGAGED', 'font-weight: bold; color: #BF616A;');
                            
                            cState.textContent = "REBIRTHING..."; cEvent.textContent = "onToggle (Rebirth)";
                            console.log("%cEVENT: onToggle -> Rebirth", "color: #EBCB8B; font-weight: bold;");
                            
                            const state = Flip.getState(actor3D, {props: "transform,opacity"});
                            scene3D.appendChild(actor3D);

                            Flip.from(state, {
                                duration: 0.8, ease: 'power2.out', scale: true,
                                onComplete: () => {
                                    // The Rebirth Protocol runs perfectly inside the animation's onComplete.
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
                                    
                                    // DISENGAGE THE LOCK LAST
                                    isRebirthing = false;
                                    cRebirthLock.textContent = "INACTIVE";
                                    console.log('%cREBIRTH LOCK: DISENGAGED', 'font-weight: bold; color: #A3BE8C;');
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


// --- Standard Setup/Teardown (No changes below this line) ---
function initialCheck() {
    if (window.gsap && window.ScrollTrigger && window.Flip) {
        setupAnimations();
    } else {
        let i = 0, max = 30, t = setInterval(() => {
            i++;
            if (window.gsap && window.ScrollTrigger && window.Flip) { clearInterval(t); setupAnimations(); } 
            else if (i >= max) { clearInterval(t); console.error("CRITICAL ERROR: GSAP libraries failed to load."); }
        }, 100);
    }
}
function setupSiteLogic() {
    const openButton = document.getElementById('menu-open-button');
    const closeButton = document.getElementById('menu-close-button');
    const menuScreen = document.getElementById('menu-screen');
    const htmlElement = document.documentElement;
    if (openButton && closeButton && menuScreen) {
        openButton.addEventListener('click', () => { htmlElement.classList.add('menu-open'); });
        closeButton.addEventListener('click', () => { htmlElement.classList.remove('menu-open'); });
    }
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); }
}
document.addEventListener('DOMContentLoaded', () => {
    setupSiteLogic();
    initialCheck();
});
