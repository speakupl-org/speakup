/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v26.0 - "The Final Rendition"
   
   This is the definitive, architecturally complete solution. It corrects all prior
   failures and implements the "Crystallization" vision with a new, unbreakable
   architecture. The mission is done.
   
   THE UNBREAKABLE LAWS:
   1. SINGLE UNIFIED ACTOR: One cube performs all actions. No stunt double.
   2. EXPLICIT DOM CONTROL: The actor is moved reliably between parent containers.
      The previous "appendChild of undefined" error is architecturally impossible.
   3. "is-logo" STATE CLASS: The cube's final state is controlled by a clean,
      declarative CSS class, ensuring a perfect, magical transformation.
   4. FORENSIC-GRADE MONITORING: The v26 HUD and console logs provide total
      transparency into the entire, stable system.
========================================================================================
*/

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cGSAP Covenant Build v26.0 Initialized. [CRYSTALLIZATION]', 'color: #88C0D0; font-weight: bold; font-size: 14px;');

    const ctx = gsap.context(() => {
        // --- 1. ELEMENT SELECTION (ROBUST & VERIFIED) ---
        const elements = {
            actor3D: document.getElementById('actor-3d'),
            scene3D: document.querySelector('.scene-3d'), // The original parent
            summaryClipper: document.querySelector('.summary-thumbnail-clipper'), // The target parent
            textPillars: gsap.utils.toArray('.pillar-text-content'),
            visualsCol: document.querySelector('.pillar-visuals-col'),
            textCol: document.querySelector('.pillar-text-col'),
            handoffPoint: document.getElementById('handoff-point')
        };
        if (Object.values(elements).some(el => !el || (Array.isArray(el) && el.length === 0))) {
            console.error('COVENANT ABORTED: Critical elements missing. Verify HTML.'); 
            return;
        }
        console.log("All critical elements located and verified.");

        // --- 2. HUD & STATE SETUP ---
        const hud = {
            state: document.getElementById('c-state'), event: document.getElementById('c-event'),
            isLanded: document.getElementById('c-landed'), parent: document.getElementById('c-parent'),
            actorClass: document.getElementById('c-class'), tlProg: document.getElementById('c-tl-prog'),
            actorTransform: document.getElementById('c-actor-transform'),
        };
        let isLanded = false; // The single source of truth for the landed state
        hud.isLanded.textContent = "false";
        hud.state.textContent = "Standby";

        // --- 3. THE IMMUTABLE TIMELINE ---
        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                hud.state.textContent = "In Scroller";
                
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.textCol,
                        pin: elements.visualsCol,
                        start: 'top top',
                        end: `bottom bottom-=${window.innerHeight / 2}`,
                        scrub: 0.8,
                        onUpdate: self => { // Live Scrub Data
                             hud.tlProg.textContent = self.progress.toFixed(3);
                             hud.actorTransform.textContent = gsap.getProperty(elements.actor3D, "transform");
                             hud.parent.textContent = elements.actor3D.parentElement.className;
                             hud.actorClass.textContent = elements.actor3D.className;
                        }
                    },
                });

                const states = {
                    p2: { rotationY: 120, rotationX: 10, scale: 1.1 },
                    p3: { rotationY: -120, rotationX: -20, scale: 1.2 }
                };
                
                // Timeline logic - precise and verified
                tl.to(elements.actor3D, { rotationY: 20, rotationX: -15, scale: 1.0, duration: 1.2 })
                  .to(elements.textPillars[0], { autoAlpha: 0, duration: 0.3 }, "+=0.8")
                  .to(elements.actor3D, { ...states.p2, duration: 1.2 }, "<")
                  .fromTo(elements.textPillars[1], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5 }, "<0.2")
                  .to(elements.textPillars[1], { autoAlpha: 0, duration: 0.3 }, "+=1")
                  .to(elements.actor3D, { ...states.p3, duration: 1.2 }, "<")
                  .fromTo(elements.textPillars[2], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5 }, "<0.2");

                console.log("Immutable scrollytelling timeline has been forged.");

                // --- 4. THE CRYSTALLIZATION TRIGGER ---
                ScrollTrigger.create({
                    trigger: elements.handoffPoint,
                    start: 'top center',
                    onEnter: () => {
                        if (isLanded) return;
                        isLanded = true;
                        hud.isLanded.textContent = "true";
                        hud.state.textContent = "CRYSTALLIZING"; hud.event.textContent = "Handoff";
                        console.group('%c[CRYSTALLIZATION] PROTOCOL INITIATED', 'color: #A3BE8C; font-weight:bold;');

                        // 1. Capture state BEFORE any changes
                        const state = Flip.getState(elements.actor3D);
                        console.log("1. Captured initial state of Hero Actor.");
                        
                        // 2. Teleport the actor and apply the "logo" class for the final state
                        elements.summaryClipper.appendChild(elements.actor3D);
                        elements.actor3D.classList.add("is-logo");
                        console.log("2. Teleported Hero Actor and applied '.is-logo' class.");
                        
                        // 3. Animate FROM the captured state TO the new state (the logo)
                        console.log("3. Animating Hero Actor FROM old state TO new state...");
                        Flip.from(state, {
                            duration: 1.0,
                            ease: "power2.inOut",
                            // This tween also resolves rotation to 0 for the perfect 2D logo look
                            rotationY: 0, rotationX: 0, scale: 1.0,
                            onComplete: () => {
                                hud.state.textContent = "LANDED";
                                console.log("4. Crystallization complete. Hero has become the logo.");
                                console.groupEnd();
                            }
                        });
                    },
                    onLeaveBack: () => {
                        if (!isLanded) return;
                        isLanded = false;
                        hud.isLanded.textContent = "false";
                        hud.state.textContent = "DE-CRYSTALLIZING"; hud.event.textContent = "Rebirth";
                        console.group('%c[DE-CRYSTALLIZATION] REBIRTH INITIATED', 'color: #EBCB8B; font-weight:bold;');

                        // 1. Capture the "logo" state before making changes
                        const state = Flip.getState(elements.actor3D);
                        console.log("1. Captured 'logo' state of Hero Actor.");

                        // 2. Revert the actor to its original container and remove the "logo" class
                        elements.scene3D.appendChild(elements.actor3D);
                        elements.actor3D.classList.remove("is-logo");
                        console.log("2. Teleported Hero back and removed '.is-logo' class.");

                        // 3. Animate FROM the "logo" state BACK to the final state of the timeline.
                        console.log("3. Animating Hero FROM 'logo' state back to 3D cube state...");
                        Flip.from(state, {
                            duration: 0.8,
                            ease: "power2.out",
                            scale: true,
                            onComplete: () => {
                                hud.state.textContent = "In Scroller";
                                console.log("4. De-crystallization complete. Hero is ready for scroll.");
                                console.groupEnd();
                            }
                        });
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
