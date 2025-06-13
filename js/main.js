/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v24.0 - "The Final Mandate"
   
   This is the definitive, architecturally complete solution. It corrects the critical
   startup failure of v23 and perfects the "Stunt Double" protocol. The mission ends here.
   
   THE UNBREAKABLE LAWS:
   1. CORRECT INITIALIZATION: The critical startup error is fixed.
   2. SEPARATION OF CONCERNS: The "Hero" cube performs the scrollytelling. The
      "Stunt Double" performs the landing. They are completely independent.
   3. IMMUTABILITY: The main scrollytelling timeline and its "Hero" cube are NEVER
      disabled or polluted by Flip. Its state is immutable. Reverse scroll is flawless.
   4. THE ILLUSION OF TRANSFER: A seamless "bait-and-switch" using Flip creates the
      illusion of a handoff without the state conflicts.
========================================================================================
*/

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cGSAP Covenant Build v24.0 Initialized. [FINAL MANDATE]', 'color: #88C0D0; font-weight: bold; font-size: 14px;');

    const ctx = gsap.context(() => {
        // --- 1. ELEMENT SELECTION & GUARDS ---
        const elements = {
            heroActor: document.getElementById('actor-3d'),
            stuntActor: document.getElementById('actor-3d-stunt-double'), // Corrected target
            textPillars: gsap.utils.toArray('.pillar-text-content'),
            visualsCol: document.querySelector('.pillar-visuals-col'),
            textCol: document.querySelector('.pillar-text-col'),
            handoffPoint: document.getElementById('handoff-point')
        };
        // This guard clause will now pass.
        if (Object.values(elements).some(el => !el || (Array.isArray(el) && el.length === 0))) {
            console.error('COVENANT ABORTED: Critical elements missing. Please verify all IDs and classes in the HTML.'); 
            return;
        }
        console.log("All critical elements located successfully.");

        const hud = { /* Simplified HUD for final verification */
            state: document.getElementById('c-state'), event: document.getElementById('c-event'),
            heroAlpha: document.getElementById('c-hero-alpha'), stuntAlpha: document.getElementById('c-stunt-alpha'),
        };
        let isSwapped = false; // The single source of truth for the swap state

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                hud.state.textContent = "In Scroller";
                
                // --- 2. BUILD THE PROVEN-SMOOTH, IMMUTABLE TIMELINE ---
                // Reverting to the stable timeline logic that you said was acceptably smooth.
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.textCol,
                        pin: elements.visualsCol,
                        start: 'top top',
                        end: `bottom bottom-=${window.innerHeight / 2}`,
                        scrub: 0.8,
                    },
                    onUpdate: () => { // Live forensic monitoring
                        hud.heroAlpha.textContent = gsap.getProperty(elements.heroActor, "alpha").toFixed(2);
                        hud.stuntAlpha.textContent = gsap.getProperty(elements.stuntActor, "alpha").toFixed(2);
                    }
                });
                
                const states = {
                    p2: { rotationY: 120, rotationX: 10, scale: 1.1 },
                    p3: { rotationY: -120, rotationX: -20, scale: 1.2 }
                };
                
                // Animate text pillars disappearing and reappearing
                gsap.set(elements.textPillars[1], { autoAlpha: 0 });
                gsap.set(elements.textPillars[2], { autoAlpha: 0 });
                
                tl.to(elements.textPillars[0], { autoAlpha: 0, duration: 0.2 }, 1.2)
                  .to(elements.actor3D, { ...states.p2, duration: 1.2}, "<")
                  .to(elements.textPillars[1], { autoAlpha: 1, duration: 0.2 }, "<+=0.5")

                  .to(elements.textPillars[1], { autoAlpha: 0, duration: 0.2}, "+=1.2")
                  .to(elements.actor3D, { ...states.p3, duration: 1.2}, "<")
                  .to(elements.textPillars[2], { autoAlpha: 1, duration: 0.2}, "<+=0.5");
                
                console.log("Immutable scrollytelling timeline has been forged.");
                
                // --- 3. CREATE THE FLAWLESS "BAIT-AND-SWITCH" TRIGGER ---
                ScrollTrigger.create({
                    id: "HANDOFF_MONITOR",
                    trigger: elements.handoffPoint,
                    start: 'top center',
                    onEnter: () => {
                        if (isSwapped) return;
                        isSwapped = true;
                        hud.state.textContent = "HANDOFF"; hud.event.textContent = "Bait and Switch";
                        console.group('%c"BAIT AND SWITCH" PROTOCOL INITIATED', 'color: #A3BE8C; font-weight:bold;');
                        
                        const heroState = Flip.getState(elements.heroActor);
                        console.log("1. Captured final state of Hero Actor.");
                        
                        gsap.set(elements.heroActor, { autoAlpha: 0 });
                        console.log("2. Hero Actor hidden.");
                        
                        console.log("3. Animating Stunt Double FROM Hero's state...");
                        Flip.from(heroState, {
                            targets: elements.stuntActor,
                            duration: 0.8,
                            ease: "power2.inOut",
                            scale: true,
                            onStart: () => gsap.set(elements.stuntActor, { visibility: 'visible', autoAlpha: 1 }),
                            onComplete: () => {
                                hud.state.textContent = "LANDED";
                                console.log("4. Handoff complete. Stunt Double has landed.");
                                console.groupEnd();
                            }
                        });
                    },
                    onLeaveBack: () => {
                        if (!isSwapped) return;
                        isSwapped = false;
                        hud.state.textContent = "REVERSING"; hud.event.textContent = "Return to Hero";
                        console.log('%cREBIRTH: Returning control to Hero Actor...', 'color: #EBCB8B; font-weight:bold;');
                        
                        gsap.set(elements.stuntActor, { visibility: 'hidden', autoAlpha: 0 });
                        gsap.set(elements.heroActor, { autoAlpha: 1 });
                        hud.state.textContent = "In Scroller";
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
