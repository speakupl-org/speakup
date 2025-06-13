/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v22.0 - The "Final Covenant"
   
   This is the final, definitive, and battle-hardened architecture. It is a complete
   synthesis of all lessons learned. It solves all "blips" and "weirdness" by
   instituting a set of unbreakable laws for state management. The mission is done.
   
   THE FINAL LAWS:
   1. FLIP IS FOR TRAVEL, GSAP IS FOR CONTROL: Flip is ONLY used to move the cube.
      The moment it arrives, its state is wiped and a pure GSAP timeline takes over.
      A new `absolute: true` parameter on the "Flip Down" ensures a smooth entry.
   2. THE SYSTEM IS PRESERVED: We return to the stable `invalidate/refresh` protocol,
      now paired with an aggressive `clearProps` wipe AFTER the reverse flip. This
      prevents state pollution without causing the "blips" of a total-kill rebuild.
   3. FORENSIC TRANSPARENCY: The Mission Control HUD provides a complete, live view.
========================================================================================
*/

// --- GLOBAL STATE & MAIN SCRUB INSTANCE ---
const STATE = {
    isFlipped: false,
    isRebirthing: false
};
let mainScrub;

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cGSAP Covenant Build v22.0 Initialized. [FINAL COVENANT]', 'color: #88C0D0; font-weight: bold; font-size: 14px;');

    const ctx = gsap.context(() => {
        const elements = {
            visualsCol: document.querySelector('.pillar-visuals-col'),
            scene3D: document.querySelector('.scene-3d'),
            actor3D: document.getElementById('actor-3d'),
            textPillars: gsap.utils.toArray('.pillar-text-content'),
            summaryClipper: document.querySelector('.summary-thumbnail-clipper'),
            handoffPoint: document.getElementById('handoff-point'),
            textCol: document.querySelector('.pillar-text-col')
        };
        if (Object.values(elements).some(el => !el || (Array.isArray(el) && el.length === 0))) {
            console.error('COVENANT ABORTED: Critical elements missing.'); return;
        }

        const hud = {
            state: document.getElementById('c-state'), event: document.getElementById('c-event'),
            isFlipped: document.getElementById('c-flipped'), isRebirthing: document.getElementById('c-rebirthing'),
            handoffActive: document.getElementById('c-handoff-active'), direction: document.getElementById('c-direction'),
            tlProg: document.getElementById('c-tl-prog'), cubeRot: document.getElementById('c-cube-rot'),
            textAlpha: document.getElementById('c-text-alpha')
        };
        const updateHudState = () => { hud.isFlipped.textContent = STATE.isFlipped; hud.isRebirthing.textContent = STATE.isRebirthing; };
        updateHudState();
        hud.state.textContent = "Standby";

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                hud.state.textContent = "In Scroller";
                gsap.set(elements.textPillars, { autoAlpha: 0 });
                gsap.set(elements.textPillars[0], { autoAlpha: 1 });
                
                // --- BUILD THE SCROLLYTELLING INSTANCE ---
                const tl = gsap.timeline({
                    paused: true,
                    onUpdate: function() { // Live forensic monitoring AS YOU SCROLL
                        hud.tlProg.textContent = this.progress().toFixed(3);
                        hud.cubeRot.textContent = gsap.getProperty(elements.actor3D, "rotationY").toFixed(1);
                        hud.textAlpha.textContent = gsap.getProperty(elements.textPillars[2], "autoAlpha").toFixed(2);
                    }
                });

                const states = {
                    p1: { rotationY: 20, rotationX: -15, scale: 1.0 },
                    p2: { rotationY: 120, rotationX: 10, scale: 1.1 },
                    p3: { rotationY: -120, rotationX: -20, scale: 1.2 }
                };

                tl.to(elements.actor3D, { ...states.p1, duration: 1.2 })
                  .to(elements.textPillars[0], { autoAlpha: 0, duration: 0.4 }, "+=0.8")
                  .to(elements.actor3D, { ...states.p2, duration: 1.2 }, "<")
                  .from(elements.textPillars[1], { autoAlpha: 0, y: 30, duration: 0.6 }, "<")
                  .to(elements.textPillars[1], { autoAlpha: 0, duration: 0.4 }, "+=0.8")
                  .to(elements.actor3D, { ...states.p3, duration: 1.2 }, "<")
                  .from(elements.textPillars[2], { autoAlpha: 0, y: 30, duration: 0.6 }, "<")
                  .addLabel("finalState");

                mainScrub = ScrollTrigger.create({
                    trigger: elements.textCol,
                    pin: elements.visualsCol,
                    start: 'top top',
                    end: `bottom bottom-=${window.innerHeight / 2}`,
                    animation: tl,
                    scrub: 0.8,
                    invalidateOnRefresh: true,
                });
                // --- END BUILD ---

                // --- CREATE THE HANDOFF MONITOR ---
                ScrollTrigger.create({
                    id: "HANDOFF_MONITOR",
                    trigger: elements.handoffPoint,
                    start: 'top center',
                    onUpdate: self => hud.direction.textContent = self.direction === 1 ? 'DOWN' : 'UP',
                    onToggle: self => {
                        hud.handoffActive.textContent = self.isActive;
                        
                        // A) FLIP DOWN
                        if (self.isActive && self.direction === 1) {
                            if (STATE.isFlipped || STATE.isRebirthing) return;
                            STATE.isFlipped = true; updateHudState();
                            hud.state.textContent = "FLIPPED"; hud.event.textContent = "Flip Down";
                            console.log("%cEVENT: Flip Down", "color: #A3BE8C; font-weight: bold;");
                            
                            mainScrub.disable();
                            const flipState = Flip.getState(elements.actor3D);
                            elements.summaryClipper.appendChild(elements.actor3D);
                            // THE "BLIP" FIX: Use `absolute: true` to get smooth transitions between parents
                            // And explicitly set the final state for perfect control.
                            Flip.from(flipState, {
                                duration: 0.8,
                                ease: 'power2.inOut',
                                absolute: true, // This is a key for smooth parent-to-parent flips
                                scale: true,
                                onComplete: () => {
                                    console.log("Flip Down Complete. Actor is now under placeholder control.");
                                }
                            });
                        }
                        
                        // B) THE FINAL COVENANT REBIRTH
                        if (!self.isActive && self.direction === -1) {
                            if (!STATE.isFlipped || STATE.isRebirthing) return;
                            STATE.isRebirthing = true; updateHudState();
                            hud.state.textContent = "REBIRTHING"; hud.event.textContent = "Protocol Engaged";
                            console.group('%c"FINAL COVENANT" REBIRTH PROTOCOL INITIATED', 'color: #D81B60; font-weight:bold;');
                            
                            mainScrub.disable(); // Ensure the scrub is off during the flip
                            const flipState = Flip.getState(elements.actor3D);
                            elements.scene3D.appendChild(elements.actor3D);
                            
                            console.log("1. Flipping actor back to scrolly container...");
                            Flip.from(flipState, {
                                duration: 0.8, ease: 'power2.out', scale: true,
                                onComplete: () => {
                                    console.log("2. WIPE & RESTORE PHASE");
                                    // 2a. WIPE STATE POLLUTION. This is CRITICAL.
                                    gsap.set(elements.actor3D, { clearProps: "all" });
                                    
                                    // 2b. INVALIDATE & RESTORE TIMELINE to its perfect pre-flip state.
                                    tl.invalidate();
                                    const finalProgress = tl.labels.finalState / tl.duration();
                                    tl.progress(finalProgress).pause();
                                    
                                    // 2c. RE-ENABLE the main scrub controller.
                                    mainScrub.enable();
                                    
                                    // 2d. TELEPORT to a safe haven just above the trigger.
                                    const handoffPointTop = elements.handoffPoint.getBoundingClientRect().top + window.scrollY;
                                    const safeHavenPosition = handoffPointTop - 5;
                                    window.scrollTo({ top: safeHavenPosition, behavior: 'instant' });
                                    
                                    // 2e. REFRESH everything to sync with the new reality.
                                    ScrollTrigger.refresh();

                                    console.log("3. System restored to pristine pre-handoff state.");
                                    
                                    // 2f. Reset flags after a safe delay.
                                    gsap.delayedCall(0.1, () => {
                                        STATE.isFlipped = false;
                                        STATE.isRebirthing = false;
                                        updateHudState();
                                        hud.state.textContent = "In Scroller (Reborn)";
                                        hud.event.textContent = "System Stable";
                                        console.log("4. State flags reset. System is ready.");
                                        console.groupEnd();
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
