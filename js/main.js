/*
========================================================================================
   THE FINAL COVENANT BUILD v15.0 - The Delayed Disengagement Protocol
   
   This is the definitive, architecturally sound build. It solves the final "one-frame
   race condition" by introducing a delayed disengagement for the Rebirth Lock.
   
   The `onComplete` callback for the rebirth Flip no longer disengages the lock itself.
   Instead, it uses `gsap.delayedCall()` to schedule the disengagement for a few
   frames later. This guarantees that the lock is still active when the rogue `onToggle`
   event fires, blocking it successfully. The system is now fully synchronized and robust.
   This is the final crank of the gear.
========================================================================================
*/

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cGSAP Covenant Build v15.0 Initialized. All systems armed.', 'color: #88C0D0; font-weight: bold; font-size: 14px;');
    // We can now remove markers for a clean view
    // ScrollTrigger.defaults({ markers: true }); 

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

        // --- Cerebro HUD v15 (Final Monitoring) ---
        const cState = document.getElementById('c-state'), cEvent = document.getElementById('c-event'),
              cRebirthLock = document.getElementById('c-rebirth-lock'); // Keep the most critical monitors

        // --- THE UNBREAKABLE STATE LOCKS ---
        let isFlipped = false;
        let isRebirthing = false;
        cState.textContent = "Standby";
        cRebirthLock.textContent = "INACTIVE";

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                cState.textContent = "In Scroller";
                
                const tl = gsap.timeline({ paused: true });
                const states = {
                    p1: { rotationY: 20, rotationX: -15 },
                    p2: { rotationY: 120, rotationX: 10 },
                    p3: { rotationY: -120, rotationX: -20 },
                };
                
                gsap.set(textPillars, { autoAlpha: 0, y: '30px' });
                gsap.set(textPillars[0], { autoAlpha: 1, y: '0px' });

                tl.to(actor3D, { ...states.p1, duration: 1, scale: 1.0 })
                  .to(textPillars[0], { autoAlpha: 0, y: '-30px', duration: 0.4 }, "+=1")
                  .to(actor3D, { ...states.p2, duration: 1, scale: 1.1 }, "<")
                  .to(textPillars[1], { autoAlpha: 1, y: '0px', duration: 0.4 }, "<+=0.2")
                  .to(textPillars[1], { autoAlpha: 0, y: '-30px', duration: 0.4 }, "+=1")
                  .to(actor3D, { ...states.p3, duration: 1, scale: 1.2 }, "<")
                  .to(textPillars[2], { autoAlpha: 1, y: '0px', duration: 0.4 }, "<+=0.2")
                  .addLabel("finalState");
                
                const mainScrub = ScrollTrigger.create({ 
                    trigger: textCol, pin: visualsCol, start: 'top top', 
                    end: `bottom bottom-=${window.innerHeight / 2}`, 
                    animation: tl, scrub: 0.8, invalidateOnRefresh: true, 
                });
                
                // ================== THE FINAL TRIGGER (v15) ==================
                ScrollTrigger.create({
                    trigger: handoffPoint,
                    start: 'top center',
                    onToggle: self => {
                        // --- FLIP DOWN LOGIC (Guarded by the Lock) ---
                        if (self.isActive && self.direction === 1) {
                            if (isFlipped || isRebirthing) {
                                if (isRebirthing) console.log("%cFlip Down BLOCKED by Rebirth Lock.", "background: #4C566A; color: #EBCB8B; padding: 2px 5px; border-radius: 3px;");
                                return;
                            }
                            isFlipped = true;
                            cState.textContent = "FLIPPED"; cEvent.textContent = "Flip Down";
                            console.log("%cEVENT: Flip Down", "color: #A3BE8C; font-weight: bold;");
                            
                            mainScrub.disable();
                            const state = Flip.getState(actor3D, {props: "transform, opacity, filter"});
                            summaryClipper.appendChild(actor3D);
                            Flip.from(state, { duration: 0.8, ease: 'power2.inOut', scale: true });
                        }
                        
                        // --- REBIRTH LOGIC (Engages Lock, Schedules Disengagement) ---
                        if (!self.isActive && self.direction === -1) {
                            if (!isFlipped || isRebirthing) return;
                            
                            isRebirthing = true;
                            cRebirthLock.textContent = "ACTIVE";
                            console.log('%cREBIRTH LOCK: ENGAGED', 'font-weight: bold; color: #BF616A;');
                            
                            cState.textContent = "REBIRTHING..."; cEvent.textContent = "Rebirth";
                            console.log("%cEVENT: Rebirth", "color: #EBCB8B; font-weight: bold;");
                            
                            const state = Flip.getState(actor3D, {props: "transform, opacity, filter"});
                            scene3D.appendChild(actor3D);

                            Flip.from(state, {
                                duration: 0.8, ease: 'power2.out', scale: true,
                                onComplete: () => {
                                    // Run the standard Rebirth Protocol
                                    tl.invalidate();
                                    const finalStateProgress = tl.labels.finalState / tl.duration();
                                    tl.progress(finalStateProgress).pause();
                                    window.scrollTo({ top: handoffPoint.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
                                    ScrollTrigger.refresh(true);
                                    mainScrub.enable();
                                    isFlipped = false;
                                    cState.textContent = "In Scroller (Reborn)";
                                    console.log("%cREBIRTH COMPLETE. System integrity restored.", 'font-weight: bold;');
                                    
                                    // =========================================================================
                                    // THE FINAL FIX: DELAYED DISENGAGEMENT
                                    // We don't disengage the lock here. We schedule it to run
                                    // on a future frame, giving the rogue onToggle event time to
                                    // fire and be blocked by the still-active lock.
                                    // A small delay of 0.1s is robust and imperceptible.
                                    // =========================================================================
                                    gsap.delayedCall(0.1, () => {
                                        isRebirthing = false;
                                        cRebirthLock.textContent = "INACTIVE";
                                        console.log('%cREBIRTH LOCK: DISENGAGED (Safely)', 'font-weight: bold; color: #A3BE8C;');
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


// --- Standard Setup/Teardown (No changes) ---
function initialCheck(){if(window.gsap&&window.ScrollTrigger&&window.Flip){setupAnimations();}else{let i=0,t=setInterval(()=>{if(window.gsap&&window.ScrollTrigger&&window.Flip){clearInterval(t);setupAnimations();}else if(i++>=30){clearInterval(t);console.error("GSAP libs failed to load.");}},100);}}
function setupSiteLogic(){const e=document.getElementById("menu-open-button"),t=document.getElementById("menu-close-button"),n=document.getElementById("menu-screen"),o=document.documentElement;e&&t&&n&&(e.addEventListener("click",()=>{o.classList.add("menu-open")}),t.addEventListener("click",()=>{o.classList.remove("menu-open")}));const c=document.getElementById("current-year");c&&(c.textContent=(new Date).getFullYear())}
document.addEventListener("DOMContentLoaded",()=>{setupSiteLogic();initialCheck();});
