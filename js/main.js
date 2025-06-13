/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v23.0 - The "Immutability & Stunt Double" Protocol
   
   This is the final, definitive, and architecturally complete solution. It abandons
   all prior attempts to manage a mutable state. The mission is done.
   
   THE UNBREAKABLE LAWS:
   1. SEPARATION OF CONCERNS: The "Hero" cube performs the scrollytelling. A new,
      identical "Stunt Double" performs the landing. They never interact.
   2. IMMUTABILITY: The main scrollytelling timeline and its "Hero" cube are NEVER
      disabled, killed, or polluted by Flip. Its state is immutable.
   3. THE ILLUSION OF TRANSFER: A seamless "bait-and-switch" animation creates the
      illusion of a handoff, replacing the unstable `Flip` transfer.
========================================================================================
*/

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cGSAP Covenant Build v23.0 Initialized. [FINAL COVENANT]', 'color: #88C0D0; font-weight: bold; font-size: 14px;');

    const ctx = gsap.context(() => {
        const elements = {
            heroActor: document.getElementById('actor-3d'),
            stuntActor: document.getElementById('actor-3d-stunt-double'), // New element
            textPillars: gsap.utils.toArray('.pillar-text-content'),
            visualsCol: document.querySelector('.pillar-visuals-col'),
            textCol: document.querySelector('.pillar-text-col'),
            handoffPoint: document.getElementById('handoff-point')
        };
        if (Object.values(elements).some(el => !el || (Array.isArray(el) && el.length === 0))) {
            console.error('COVENANT ABORTED: Critical elements missing.'); return;
        }

        const hud = { // Overwatch HUD v23
            state: document.getElementById('c-state'), event: document.getElementById('c-event'),
            heroAlpha: document.getElementById('c-hero-alpha'), stuntAlpha: document.getElementById('c-stunt-alpha'),
            tlProg: document.getElementById('c-tl-prog'), heroRot: document.getElementById('c-hero-rot'),
            textAlpha: document.getElementById('c-text-alpha')
        };

        let isFlipped = false; // This now only tracks if the "illusion" is active

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                hud.state.textContent = "In Scroller";
                gsap.set(elements.textPillars, { autoAlpha: 0 });
                gsap.set(elements.textPillars[0], { autoAlpha: 1 });
                
                // --- 1. BUILD THE IMMUTABLE SCROLLYTELLING INSTANCE ---
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.textCol,
                        pin: elements.visualsCol,
                        start: 'top top',
                        end: `bottom bottom-=${window.innerHeight / 2}`,
                        scrub: 0.8,
                        invalidateOnRefresh: true,
                    },
                    onUpdate: function() { // Live forensic monitoring
                        hud.tlProg.textContent = this.progress().toFixed(3);
                        hud.heroRot.textContent = gsap.getProperty(elements.heroActor, "rotationY").toFixed(1);
                        hud.textAlpha.textContent = gsap.getProperty(elements.textPillars[2], "autoAlpha").toFixed(2);
                        hud.heroAlpha.textContent = gsap.getProperty(elements.heroActor, "autoAlpha").toFixed(2);
                        hud.stuntAlpha.textContent = gsap.getProperty(elements.stuntActor, "autoAlpha").toFixed(2);
                    }
                });
                
                // This timeline will now animate perfectly in both directions, because it is NEVER tampered with.
                tl.fromTo(elements.textPillars[0], {y:0},{ autoAlpha: 0, y: -30, duration: 0.4 }, 1.5)
                  .fromTo(elements.heroActor, {rotationY: 0, rotationX: 0, scale: 1}, {rotationY: 120, rotationX: 10, scale: 1.1, duration: 1.2}, "<")
                  .fromTo(elements.textPillars[1], {autoAlpha: 0, y: 30}, {autoAlpha: 1, y: 0, duration: 0.6}, "<")
                  
                  .to(elements.textPillars[1], {autoAlpha: 0, y: -30, duration: 0.4}, "+=1.2")
                  .to(elements.heroActor, {rotationY: -120, rotationX: -20, scale: 1.2, duration: 1.2}, "<")
                  .fromTo(elements.textPillars[2], {autoAlpha: 0, y: 30}, {autoAlpha: 1, y: 0, duration: 0.6}, "<")
                  .addLabel("finalState"); // Label marks the perfect handoff point
                
                console.log("Immutable scrollytelling timeline has been forged.");
                
                // --- 2. CREATE THE HANDOFF "BAIT-AND-SWITCH" TRIGGER ---
                ScrollTrigger.create({
                    id: "HANDOFF_MONITOR",
                    trigger: elements.handoffPoint,
                    start: 'top center',
                    onToggle: self => {
                        // A) HANDOFF TO STUNT DOUBLE
                        if (self.isActive && !isFlipped) {
                            isFlipped = true;
                            hud.state.textContent = "HANDOFF"; hud.event.textContent = "Bait and Switch";
                            console.group('%c"BAIT AND SWITCH" PROTOCOL INITIATED', 'color: #A3BE8C; font-weight:bold;');
                            
                            // 1. Get the final state of the Hero cube
                            const heroState = Flip.getState(elements.heroActor, {props: "transform"});
                            console.log("1. Captured final state of Hero Actor.");
                            
                            // 2. Hide the Hero
                            gsap.set(elements.heroActor, { autoAlpha: 0 });
                            console.log("2. Hero Actor hidden.");

                            // 3. Perform the "Flip" FROM the Hero's state TO the Stunt Double's natural state
                            console.log("3. Animating Stunt Double FROM Hero's state...");
                            Flip.from(heroState, {
                                targets: elements.stuntActor,
                                duration: 0.8,
                                ease: "power2.inOut",
                                scale: true, // Also animate scale for a perfect match
                                onStart: () => {
                                    gsap.set(elements.stuntActor, {autoAlpha: 1}); // Reveal the stunt double at the start
                                    console.log("   - Stunt Double revealed, animation begins.");
                                },
                                onComplete: () => {
                                    hud.state.textContent = "LANDED";
                                    console.log("4. Handoff complete. Stunt Double has landed.");
                                    console.groupEnd();
                                }
                            });
                        }
                        
                        // B) REBIRTH (RETURN TO HERO)
                        if (!self.isActive && isFlipped) {
                            isFlipped = false;
                            hud.state.textContent = "REBIRTHING"; hud.event.textContent = "Return to Hero";
                            console.log('%cREBIRTH: Returning control to Hero Actor...', 'color: #EBCB8B; font-weight:bold;');
                            
                            // It's this simple: hide the stunt double, show the hero.
                            // The immutable timeline will handle the rest perfectly.
                            gsap.set(elements.stuntActor, { autoAlpha: 0 });
                            gsap.set(elements.heroActor, { autoAlpha: 1 });
                            hud.state.textContent = "In Scroller";
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
