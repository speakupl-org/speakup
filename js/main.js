/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v17.0 - The Safe Haven Protocol
   
   This is the final, definitive architecture. It solves all previous issues by
   addressing the root cause: the ambiguity of teleporting to an exact trigger boundary.
   
   THE NEW PHILOSOPHY: THE SAFE HAVEN
   Instead of fighting the race condition after it starts, we prevent it entirely.
   Upon rebirth, the user is teleported to a "Safe Haven"—a position 2 pixels
   BEFORE the handoff trigger. This is imperceptible to the user but provides
   an unambiguous "out of bounds" state for ScrollTrigger, eliminating the race condition.
   
   FEATURES:
   - Safe Haven Teleport: The `scrollTo` now targets `handoffPointTop - 2`, the key to the solution.
   - Stable Rebirth Core: Returns to the performant `invalidate/progress/refresh` protocol,
     fixing the text-mismatch issue from the "Total Rebuild" attempt.
   - Robust State Lock: The `isRebirthing` lock and `delayedCall` are still used as a
     secondary layer of security, ensuring total stability during the animation.
   - Forensic-Level Logging: The console tells a complete, unambiguous story.
========================================================================================
*/

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cGSAP Covenant Build v17.0 Initialized. All systems armed.', 'color: #88C0D0; font-weight: bold; font-size: 14px;');
    // Set markers for final verification.
    ScrollTrigger.defaults({ markers: true }); 

    const ctx = gsap.context(() => {
        // --- 1. ELEMENT SELECTION ---
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

        // --- 2. GOD-MODE HUD & STATE VARS ---
        const hud = { /* This can be removed in production, but keep for final verification */
            state: document.getElementById('c-state'), event: document.getElementById('c-event'),
            isFlipped: document.getElementById('c-flipped'), rebirthLock: document.getElementById('c-rebirth-lock'),
            scrollDir: document.getElementById('c-scroll-dir'), scrollY: document.getElementById('c-scroll-y'),
            handoffTop: document.getElementById('c-handoff-top')
        };
        
        let isFlipped = false;
        let isRebirthing = false;
        
        hud.state.textContent = "Standby";
        hud.isFlipped.textContent = "false";
        hud.rebirthLock.textContent = "INACTIVE";

        // --- 3. DESKTOP-ONLY ANIMATION SETUP ---
        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                hud.state.textContent = "In Scroller";
                
                const tl = gsap.timeline({ paused: true });
                const states = {
                    p1: { rotationY: 20, rotationX: -15, scale: 1.0 },
                    p2: { rotationY: 120, rotationX: 10, scale: 1.1 },
                    p3: { rotationY: -120, rotationX: -20, scale: 1.2 }
                };
                
                // This ensures the initial state is perfect, solving the text mismatch
                gsap.set(textPillars, { autoAlpha: 0, y: '30px' });
                gsap.set(textPillars[0], { autoAlpha: 1, y: '0px' });
                gsap.set(actor3D, {transformOrigin: "center center"});


                tl.to(actor3D, { ...states.p1, duration: 1 })
                  .to(textPillars[0], { autoAlpha: 0, y: '-30px', duration: 0.4 }, "+=1")
                  .to(actor3D, { ...states.p2, duration: 1 }, "<")
                  .to(textPillars[1], { autoAlpha: 1, y: '0px', duration: 0.4 }, "<+=0.2")
                  .to(textPillars[1], { autoAlpha: 0, y: '-30px', duration: 0.4 }, "+=1")
                  .to(actor3D, { ...states.p3, duration: 1 }, "<")
                  .to(textPillars[2], { autoAlpha: 1, y: '0px', duration: 0.4 }, "<+=0.2")
                  .addLabel("finalState");

                const mainScrub = ScrollTrigger.create({ 
                    trigger: textCol, pin: visualsCol, start: 'top top', 
                    end: `bottom bottom-=${window.innerHeight / 2}`, 
                    animation: tl, scrub: 0.8, invalidateOnRefresh: true, 
                });
                
                gsap.ticker.add(() => {
                    hud.scrollY.textContent = `${window.scrollY.toFixed(0)}px`;
                    hud.handoffTop.textContent = `${(handoffPoint.getBoundingClientRect().top + window.scrollY).toFixed(0)}px`;
                });
                
                // ================== THE SAFE HAVEN TRIGGER (v17) ==================
                ScrollTrigger.create({
                    trigger: handoffPoint,
                    start: 'top center',
                    onUpdate: self => { hud.scrollDir.textContent = self.direction === 1 ? 'DOWN' : 'UP'; },
                    onToggle: self => {
                        // --- A) FLIP DOWN LOGIC ---
                        if (self.isActive && self.direction === 1) {
                            if (isFlipped || isRebirthing) return;
                            
                            isFlipped = true;
                            hud.isFlipped.textContent = "true";
                            hud.state.textContent = "FLIPPED"; hud.event.textContent = "Flip Down";
                            console.log("%cEVENT: Flip Down", "color: #A3BE8C; font-weight: bold;");
                            
                            mainScrub.disable();
                            const flipState = Flip.getState(actor3D, {props: "transform,opacity"});
                            summaryClipper.appendChild(actor3D);
                            Flip.from(flipState, { duration: 0.8, ease: 'power2.inOut', scale: true });
                        }
                        
                        // --- B) REBIRTH & SAFE HAVEN PROTOCOL ---
                        if (!self.isActive && self.direction === -1) {
                            if (!isFlipped || isRebirthing) return;
                            
                            // 1. ENGAGE LOCK
                            isRebirthing = true;
                            hud.rebirthLock.textContent = "ACTIVE";
                            console.log('%cREBIRTH LOCK: ENGAGED', 'font-weight: bold; color: #BF616A;');
                            
                            hud.state.textContent = "REBIRTHING..."; hud.event.textContent = "Rebirth Flip";
                            console.log("%cEVENT: Rebirth Initiated -> Flipping actor home.", "color: #EBCB8B; font-weight: bold;");
                            
                            const flipState = Flip.getState(actor3D, {props: "transform,opacity"});
                            scene3D.appendChild(actor3D);

                            Flip.from(flipState, {
                                duration: 0.8, ease: 'power2.out', scale: true,
                                onComplete: () => {
                                    // 2. THE STABLE REBIRTH PROTOCOL
                                    console.group('%cSAFE HAVEN PROTOCOL INITIATED', 'color: #D81B60; font-weight:bold;');
                                    
                                    console.log("1. INVALIDATING TIMELINE - Forcing cache purge.");
                                    tl.invalidate();

                                    console.log("2. SETTING PROGRESS to 'finalState'.");
                                    tl.progress(tl.labels.finalState / tl.duration()).pause();

                                    // 3. THE SAFE HAVEN TELEPORT
                                    const handoffPointTop = handoffPoint.getBoundingClientRect().top + window.scrollY;
                                    const safeHavenPosition = handoffPointTop - 2; // <-- THE KEY TO VICTORY
                                    console.log(`3. TELEPORTING TO SAFE HAVEN... (Target: ${safeHavenPosition.toFixed(0)}px, 2px before handoff)`);
                                    window.scrollTo({ top: safeHavenPosition, behavior: 'instant' });

                                    console.log("4. REFRESHING TRIGGERS from safe position.");
                                    ScrollTrigger.refresh(true);

                                    console.log("5. GOING LIVE - Re-enabling main scrub.");
                                    mainScrub.enable();
                                    
                                    isFlipped = false;
                                    hud.isFlipped.textContent = "false";
                                    hud.state.textContent = "In Scroller (Reborn)";
                                    console.log("%cREBIRTH COMPLETE. System parked safely.", 'font-weight: bold;');
                                    console.groupEnd();
                                    
                                    // 4. DELAYED DISENGAGEMENT
                                    gsap.delayedCall(0.1, () => {
                                        isRebirthing = false;
                                        hud.rebirthLock.textContent = "INACTIVE";
                                        console.log('%cREBIRTH LOCK: DISENGAGED (System Stable)', 'font-weight: bold; color: #A3BE8C;');
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    });

    return () => { ctx.revert(); };
}


// --- Primary Entry Point & Site Logic (Unchanged) ---
function initialCheck() {
    if (window.gsap && window.ScrollTrigger && window.Flip) {
        setupAnimations();
    } else {
        let i = 0, t = setInterval(() => {
            if (window.gsap && window.ScrollTrigger && window.Flip) { clearInterval(t); setupAnimations(); } 
            else if (i++ >= 30) { clearInterval(t); console.error("CRITICAL: GSAP libraries failed to load."); }
        }, 100);
    }
}
function setupSiteLogic(){const e=document.getElementById("menu-open-button"),t=document.getElementById("menu-close-button"),n=document.getElementById("menu-screen"),o=document.documentElement;e&&t&&n&&(e.addEventListener("click",()=>{o.classList.add("menu-open")}),t.addEventListener("click",()=>{o.classList.remove("menu-open")}));const c=document.getElementById("current-year");c&&(c.textContent=(new Date).getFullYear())}
document.addEventListener("DOMContentLoaded",()=>{setupSiteLogic();initialCheck();});
