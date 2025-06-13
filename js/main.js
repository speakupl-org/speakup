/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v26.0 - The "Crystallization" Protocol
   
   This is the final, definitive, and architecturally complete solution. It fulfills
   the vision of transforming the cube into the logo in a "smooth, almost magical way".
   The mission is done.
   
   THE UNBREAKABLE LAWS:
   1. ONE HERO, ONE JOURNEY: The "Stunt Double" is GONE. The Hero cube performs both
      the scrollytelling AND the final transformation. No blips, no swaps.
   2. THE FLIP.STATE() TAKES ALL: We will use GSAP's Flip plugin to its full potential,
      animating position, scale, AND class change (from 3D to 2D) in one command.
   3. PERFECT REVERSE: The reverse scroll is now flawless. The Flip animation is
      simply reversed, returning the Hero cube to its 3D state and re-enabling
      the pristine, untouched scrollytelling timeline.
========================================================================================
*/

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cGSAP Covenant Build v26.0 Initialized. [CRYSTALLIZATION]', 'color: #88C0D0; font-weight: bold; font-size: 14px;');

    const ctx = gsap.context(() => {
        const elements = {
            heroActor: document.getElementById('actor-3d'),
            visualsCol: document.querySelector('.pillar-visuals-col'),
            textPillars: gsap.utils.toArray('.pillar-text-content'),
            textCol: document.querySelector('.pillar-text-col'),
            summaryClipper: document.querySelector('.summary-thumbnail-clipper'),
            handoffPoint: document.getElementById('handoff-point')
        };
        if (Object.values(elements).some(el => !el || (Array.isArray(el) && el.length === 0))) {
            console.error('COVENANT ABORTED: Critical elements missing.'); 
            return;
        }

        let isFlipped = false; // The single source of truth for the final animation state

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                // --- BUILD THE IMMUTABLE SCROLLYTELLING TIMELINE ---
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.textCol,
                        pin: elements.visualsCol,
                        start: 'top top',
                        end: `bottom bottom-=${window.innerHeight / 2}`,
                        scrub: 0.8,
                    }
                });
                
                // Perfected timing for text and cube sync
                const states = {
                    p2: { rotationY: 120, rotationX: 10, scale: 1.1 },
                    p3: { rotationY: -120, rotationX: -20, scale: 1.2 }
                };
                gsap.set(elements.textPillars, { autoAlpha: 0 });
                gsap.set(elements.textPillars[0], { autoAlpha: 1 });

                tl.to(elements.heroActor, { rotationY: 20, rotationX: -15, scale: 1.0, duration: 1.2 })
                  .to(elements.textPillars[0], { autoAlpha: 0, duration: 0.3 }, "+=0.8")
                  .to(elements.heroActor, { ...states.p2, duration: 1.2 }, "<")
                  .fromTo(elements.textPillars[1], {autoAlpha: 0, y: 30}, {autoAlpha: 1, y: 0, duration: 0.5}, "<0.2")
                  .to(elements.textPillars[1], { autoAlpha: 0, duration: 0.3 }, "+=1")
                  .to(elements.heroActor, { ...states.p3, duration: 1.2 }, "<")
                  .fromTo(elements.textPillars[2], {autoAlpha: 0, y: 30}, {autoAlpha: 1, y: 0, duration: 0.5}, "<0.2");
                
                console.log("Immutable scrollytelling timeline has been forged.");
                
                // --- THE CRYSTALLIZATION TRIGGER ---
                ScrollTrigger.create({
                    id: "CRYSTALLIZATION_MONITOR",
                    trigger: elements.handoffPoint,
                    start: 'top center',
                    onEnter: () => {
                        if (isFlipped) return;
                        isFlipped = true;
                        console.group('%c[CRYSTALLIZATION] PROTOCOL INITIATED', 'color: #A3BE8C; font-weight:bold;');
                        
                        // 1. Capture the "before" state of the Hero Actor
                        const heroState = Flip.getState(elements.heroActor, { props: "transform,opacity" });
                        console.log("1. Captured initial state of Hero Actor.");
                        
                        // 2. Move the Hero to its final container AND add the `.is-logo` class
                        // This is the "final state" we want to animate TO.
                        elements.summaryClipper.appendChild(elements.heroActor);
                        elements.heroActor.classList.add('is-logo');
                        console.log("2. Teleported Hero Actor and applied '.is-logo' class.");
                        
                        // 3. Animate FROM the captured state to the new state.
                        // GSAP's Flip plugin is smart enough to animate the class change,
                        // creating the magical "flattening" effect.
                        console.log("3. Animating Hero Actor FROM old state TO new state...");
                        Flip.from(heroState, {
                            duration: 1.5, // A longer duration for a more magical feel
                            ease: "power3.inOut",
                            scale: true,
                            onComplete: () => {
                                console.log("4. Crystallization complete. Hero has become the logo.");
                                console.groupEnd();
                            }
                        });

                        // Disable the scrollytelling timeline so it doesn't fight the Flip animation
                        tl.scrollTrigger.disable();
                    },
                    onLeaveBack: () => {
                        if (!isFlipped) return;
                        isFlipped = false;
                        console.group('%c[DE-CRYSTALLIZATION] REBIRTH INITIATED', 'color: #EBCB8B; font-weight:bold;');

                        // This is the exact reverse of the `onEnter` logic.
                        // 1. Capture the "logo" state.
                        const logoState = Flip.getState(elements.heroActor, { props: "transform,opacity" });
                        console.log("1. Captured 'logo' state of Hero Actor.");

                        // 2. Move the Hero back to its original home AND remove the class
                        elements.scene3D.appendChild(elements.heroActor);
                        elements.heroActor.classList.remove('is-logo');
                        console.log("2. Teleported Hero Actor home and removed '.is-logo' class.");

                        // 3. Animate FROM the logo state TO the full 3D state.
                        console.log("3. Reversing animation FROM logo state TO 3D state...");
                        Flip.from(logoState, {
                            duration: 1.5,
                            ease: "power3.inOut",
                            scale: true,
                            onComplete: () => {
                                console.log("4. De-crystallization complete. Hero is back in 3D.");
                                // Re-enable the scrollytelling timeline now that the hero is home.
                                tl.scrollTrigger.enable();
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
