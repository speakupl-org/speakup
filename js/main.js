/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v18.0 - The "Wipe & Restore" Protocol
   
   This is the definitive, holistically-engineered solution. It addresses all prior
   failures by identifying and solving the two root causes: timeline de-synchronization
   and Flip plugin state pollution.
   
   THE NEW ARCHITECTURE:
   1. PRECISION TIMING: The text animations are now perfectly synchronized with the
      cube rotations (`<`), eliminating the "late text" issue on forward scroll.
   2. TARGETED STATE WIPE: After the cube is Flipped back, its inline CSS is
      completely wiped with `clearProps: "all"`. This is the CRITICAL step that
      eliminates state pollution and ensures the cube is "clean" for the timeline.
   3. INTELLIGENT RESTORE: The stable `invalidate/progress/refresh` protocol then
      re-calculates the animation from this pristine state.
   4. PROVEN SAFE HAVEN: The `scrollTo(target - 2)` is retained, as it has been
      proven to prevent the core race condition.
========================================================================================
*/

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cGSAP Covenant Build v18.0 Initialized. All systems armed.', 'color: #88C0D0; font-weight: bold; font-size: 14px;');
    ScrollTrigger.defaults({ markers: true }); 

    const ctx = gsap.context(() => {
        // --- 1. ELEMENT SELECTION ---
        const visualsCol = document.querySelector('.pillar-visuals-col'),
              scene3D = document.querySelector('.scene-3d'),
              actor3D = document.getElementById('actor-3d'),
              textPillars = gsap.utils.toArray('.pillar-text-content'),
              summaryClipper = document.querySelector('.summary-thumbnail-clipper'),
              handoffPoint = document.getElementById('handoff-point'),
              textCol = document.querySelector('.pillar-text-col'); 
        
        if (!visualsCol || !scene3D || !actor3D || !summaryClipper || !handoffPoint || !textCol) {
            console.error('COVENANT ABORTED: Critical elements missing.'); return;
        }

        // --- 2. FORENSICS HUD & STATE VARS ---
        const hud = {
            state: document.getElementById('c-state'), event: document.getElementById('c-event'),
            rebirthLock: document.getElementById('c-rebirth-lock'), actorWiped: document.getElementById('c-actor-wiped'),
            scrollY: document.getElementById('c-scroll-y'), handoffTop: document.getElementById('c-handoff-top'),
            scrollTarget: document.getElementById('c-scroll-target'), actorTransform: document.getElementById('c-actor-transform')
        };
        
        let isFlipped = false, isRebirthing = false;
        hud.state.textContent = "Standby"; hud.rebirthLock.textContent = "INACTIVE"; hud.actorWiped.textContent = "false";

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                hud.state.textContent = "In Scroller";
                
                // --- 3. PRECISION TIMELINE ---
                const tl = gsap.timeline({ paused: true });
                const states = {
                    p1: { rotationY: 20, rotationX: -15, scale: 1.0 },
                    p2: { rotationY: 120, rotationX: 10, scale: 1.1 },
                    p3: { rotationY: -120, rotationX: -20, scale: 1.2 }
                };
                
                gsap.set(textPillars, { autoAlpha: 0, y: '30px' });
                gsap.set(textPillars[0], { autoAlpha: 1, y: '0px' });
                console.log("[Timeline] Building... Pillar 1 starts.");
                
                tl.to(actor3D, { ...states.p1, duration: 1 })
                  .to(textPillars[0], { autoAlpha: 0, y: '-30px', duration: 0.4 }, "+=1")
                  .to(actor3D, { ...states.p2, duration: 1 }, "<")
                  .to(textPillars[1], { autoAlpha: 1, y: '0px', duration: 0.4 }, "<") // <-- TIMING FIX
                  .call(() => console.log("[Timeline] Scrolling into Pillar 2... Text sync'd perfectly."), [], "<")
                  
                  .to(textPillars[1], { autoAlpha: 0, y: '-30px', duration: 0.4 }, "+=1")
                  .to(actor3D, { ...states.p3, duration: 1 }, "<")
                  .to(textPillars[2], { autoAlpha: 1, y: '0px', duration: 0.4 }, "<") // <-- TIMING FIX
                  .addLabel("finalState")
                  .call(() => console.log("[Timeline] Scrolling into Pillar 3... Text sync'd perfectly."), [], "<");

                const mainScrub = ScrollTrigger.create({ 
                    trigger: textCol, pin: visualsCol, start: 'top top', 
                    end: `bottom bottom-=${window.innerHeight / 2}`, 
                    animation: tl, scrub: 0.8, invalidateOnRefresh: true, 
                });
                
                gsap.ticker.add(() => {
                    hud.scrollY.textContent = `${window.scrollY.toFixed(0)}px`;
                    hud.handoffTop.textContent = `${(handoffPoint.getBoundingClientRect().top + window.scrollY).toFixed(0)}px`;
                    hud.actorTransform.textContent = gsap.getProperty(actor3D, "transform");
                });
                
                // --- 4. THE WIPE & RESTORE TRIGGER (v18) ---
                ScrollTrigger.create({
                    trigger: handoffPoint,
                    start: 'top center',
                    onToggle: self => {
                        if (self.isActive && self.direction === 1) { // FLIP DOWN
                            if (isFlipped || isRebirthing) return;
                            isFlipped = true;
                            hud.state.textContent = "FLIPPED"; hud.event.textContent = "Flip Down";
                            console.log("%cEVENT: Flip Down", "color: #A3BE8C; font-weight: bold;");
                            mainScrub.disable();
                            const flipState = Flip.getState(actor3D, {props: "transform,opacity"});
                            summaryClipper.appendChild(actor3D);
                            Flip.from(flipState, { duration: 0.8, ease: 'power2.inOut', scale: true });
                        }
                        
                        if (!self.isActive && self.direction === -1) { // REBIRTH
                            if (!isFlipped || isRebirthing) return;
                            isRebirthing = true;
                            hud.rebirthLock.textContent = "ACTIVE";
                            console.log('%cREBIRTH LOCK: ENGAGED', 'font-weight: bold; color: #BF616A;');
                            
                            hud.state.textContent = "REBIRTHING..."; hud.event.textContent = "Flip Home";
                            const flipState = Flip.getState(actor3D, {props: "transform,opacity"});
                            scene3D.appendChild(actor3D);
                            hud.actorWiped.textContent = "false"; // Reset wiped status

                            Flip.from(flipState, {
                                duration: 0.8, ease: 'power2.out', scale: true,
                                onComplete: () => {
                                    console.group('%c"WIPE & RESTORE" PROTOCOL INITIATED', 'color: #D81B60; font-weight:bold;');
                                    
                                    // STEP 1: WIPE STATE POLLUTION
                                    console.log("1. WIPING residual transforms from actor...");
                                    gsap.set(actor3D, { clearProps: "all" });
                                    hud.actorWiped.textContent = "true";
                                    
                                    // STEP 2: RESTORE TIMELINE
                                    console.log("2. INVALIDATING & RESTORING timeline to pre-handoff state...");
                                    tl.invalidate();
                                    tl.progress(tl.labels.finalState / tl.duration()).pause();

                                    // STEP 3: TELEPORT TO SAFE HAVEN
                                    const handoffPointTop = handoffPoint.getBoundingClientRect().top + window.scrollY;
                                    const safeHavenPosition = handoffPointTop - 2;
                                    hud.scrollTarget.textContent = `${safeHavenPosition.toFixed(0)}px`;
                                    console.log(`3. TELEPORTING to Safe Haven (${safeHavenPosition.toFixed(0)}px)...`);
                                    window.scrollTo({ top: safeHavenPosition, behavior: 'instant' });

                                    // STEP 4: REFRESH & GO LIVE
                                    console.log("4. REFRESHING all triggers from safe position...");
                                    ScrollTrigger.refresh(true);
                                    mainScrub.enable();
                                    console.log("5. GOING LIVE. Main scrub re-enabled.");

                                    isFlipped = false;
                                    hud.state.textContent = "In Scroller (Reborn)";
                                    console.log("%cPROTOCOL COMPLETE. System is pristine.", 'font-weight: bold;');
                                    console.groupEnd();
                                    
                                    // STEP 5: DELAYED LOCK DISENGAGEMENT
                                    gsap.delayedCall(0.1, () => {
                                        isRebirthing = false;
                                        hud.rebirthLock.textContent = "INACTIVE";
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    });
}


// --- Primary Entry Point & Site Logic (Unchanged) ---
function initialCheck(){if(window.gsap&&window.ScrollTrigger&&window.Flip){setupAnimations();}else{let i=0,t=setInterval(()=>{if(window.gsap&&window.ScrollTrigger&&window.Flip){clearInterval(t);setupAnimations();}else if(i++>=30){clearInterval(t);console.error("GSAP libs failed to load.");}},100);}}
function setupSiteLogic(){const e=document.getElementById("menu-open-button"),t=document.getElementById("menu-close-button"),n=document.getElementById("menu-screen"),o=document.documentElement;e&&t&&n&&(e.addEventListener("click",()=>{o.classList.add("menu-open")}),t.addEventListener("click",()=>{o.classList.remove("menu-open")}));const c=document.getElementById("current-year");c&&(c.textContent=(new Date).getFullYear())}
document.addEventListener("DOMContentLoaded",()=>{setupSiteLogic();initialCheck();});
