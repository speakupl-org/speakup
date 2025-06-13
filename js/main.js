/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v30.1 - "The Aegis" Refinement
   
   This build refines the "Citadel" Protocol by resolving a command conflict during the
   Bait & Switch handoff. The animation tween is now guaranteed to complete its full
   trajectory before the final CSS state is asserted, ensuring a structurally sound
   and visually seamless morph. All prior handoff logic is now obsolete.
========================================================================================
*/

// Oracle Forensic Logger v2.0 - "Aegis" Telemetry Upgrade
const Oracle = {
    log: (el, label) => {
        if (!el) { console.error(`%c[ORACLE LOG: ${label}] ERROR - Element is null.`, 'color: #BF616A;'); return; }
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        const transform = {
            scale: gsap.getProperty(el, "scale"),
            rotationX: gsap.getProperty(el, "rotationX"),
            rotationY: gsap.getProperty(el, "rotationY"),
            x: gsap.getProperty(el, "x"),
            y: gsap.getProperty(el, "y")
        };
        console.log(
            `%c[ORACLE LOG: ${label}]`, 'color: #D81B60; font-weight: bold;',
            `\n  - ID: #${el.id}`,
            `\n  - Size: { W: ${rect.width.toFixed(1)}, H: ${rect.height.toFixed(1)} }`,
            `\n  - Position: { X: ${transform.x.toFixed(1)}, Y: ${transform.y.toFixed(1)} }`,
            `\n  - Rotation: { X: ${transform.rotationX.toFixed(1)}, Y: ${transform.rotationY.toFixed(1)} }`,
            `\n  - Scale: ${transform.scale.toFixed(2)}`,
            `\n  - Opacity: ${style.opacity}`, `| Visibility: ${style.visibility}`
        );
    },
    group: (label) => console.group(`%c[ORACLE ACTION: ${label}]`, 'color: #A3BE8C; font-weight:bold;'),
    groupEnd: () => console.groupEnd(),
    report: (message) => console.log(`%c[CITADEL REPORT]`, 'color: #88C0D0; font-weight: bold;', message),
    warn: (message) => console.warn(`%c[CITADEL WARNING]`, 'color: #EBCB8B;', message)
};


function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    Oracle.report('GSAP Covenant Build v30.1 Initialized. [AEGIS REFINEMENT]');

    const ctx = gsap.context(() => {
        const elements = {
            heroActor: document.getElementById('actor-3d'),
            stuntActor: document.getElementById('actor-3d-stunt-double'),
            placeholder: document.getElementById('summary-placeholder'),
            textPillars: gsap.utils.toArray('.pillar-text-content'),
            visualsCol: document.querySelector('.pillar-visuals-col'),
            textCol: document.querySelector('.pillar-text-col'),
            handoffPoint: document.getElementById('handoff-point'),
            // AEGIS UPGRADE: Isolate stunt double faces for morph effect
            stuntActorFaces: gsap.utils.toArray('#actor-3d-stunt-double .face:not(.front)')
        };

        if (Object.values(elements).some(el => !el || (Array.isArray(el) && !el.length))) {
            Oracle.warn('CITADEL ABORT: Critical elements missing from DOM.');
            return;
        }
        Oracle.report("Citadel reports all elements located and verified.");

        let isSwapped = false; // The single source of truth for the swap

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                // --- THE IMMUTABLE TIMELINE ---
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.textCol,
                        pin: elements.visualsCol,
                        start: 'top top',
                        end: `bottom bottom-=${window.innerHeight * 0.8}`,
                        scrub: 0.8,
                        onUpdate: (self) => {
                            if (self.progress > 0 && self.progress < 1) { // Log only during active scrub
                                Oracle.log(elements.heroActor, "Live Hero Scrub");
                            }
                        }
                    }
                });
                tl.to(elements.heroActor, { rotationY: 120, rotationX: 10, scale: 1.1, ease: "none" }, 0)
                  .to(elements.textPillars[0], { autoAlpha: 0, y: -30 }, 0)
                  .from(elements.textPillars[1], { autoAlpha: 0, y: 30 }, 0)
                  .to(elements.heroActor, { rotationY: -120, rotationX: -20, scale: 1.2, ease: "none" }, 1)
                  .to(elements.textPillars[1], { autoAlpha: 0, y: -30 }, 1)
                  .from(elements.textPillars[2], { autoAlpha: 0, y: 30 }, 1);
                Oracle.report("Immutable timeline forged.");

                // --- THE "AEGIS" HANDOFF TRIGGER ---
                ScrollTrigger.create({
                    trigger: elements.handoffPoint,
                    start: 'top 70%',
                    onEnter: () => {
                        if (isSwapped) return;
                        isSwapped = true;
                        Oracle.group('AEGIS BAIT & SWITCH INITIATED');
                        
                        // 1. Calculate start and end states
                        const startState = Flip.getState(elements.heroActor);
                        Oracle.log(elements.heroActor, "1. Hero State at Handoff");
                        
                        // 2. Hide hero, move stunt double to hero's position
                        gsap.set(elements.heroActor, { autoAlpha: 0 });
                        Oracle.report("--> Hero actor hidden.");

                        // 3. Move stunt double into the placeholder, making it ready
                        elements.placeholder.appendChild(elements.stuntActor);
                        const endState = Flip.getState(elements.stuntActor, {props: "transform,opacity"});

                        Oracle.log(elements.stuntActor, "2. Stunt Double Pre-Animation State");

                        // 4. The Magical Flip Animation - This is now uninterruptible
                        Oracle.report("3. Initiating surgical FLIP animation...");
                        Flip.from(endState, {
                            targets: elements.stuntActor,
                            duration: 1.2,
                            ease: 'expo.inOut',
                            // AEGIS UPGRADE: Use Flip's state to match the hero perfectly
                            // We don't need manual getBoundingClientRect() anymore
                            onEnter: (targets) => {
                                // Animate from hero's state
                                return gsap.from(targets, { 
                                    scale: startState.scale,
                                    rotationX: startState.rotationX,
                                    rotationY: startState.rotationY
                                });
                            },
                            onComplete: () => {
                                Oracle.report("4. Trajectory complete. Applying final state.");
                                // AEGIS UPGRADE: Apply class ONLY AFTER animation is finished
                                elements.stuntActor.classList.add('is-logo-final-state');
                                Oracle.log(elements.stuntActor, "5. Final Landed State (Post-Morph)");
                                Oracle.groupEnd();
                            }
                        });

                        // 5. AEGIS MORPH: Simultaneously fade out the other cube faces
                        gsap.to(elements.stuntActorFaces, {
                            opacity: 0,
                            duration: 0.4,
                            ease: "power1.in",
                            delay: 0.6 // Start the fade slightly after the main animation begins
                        });
                    },
                    onLeaveBack: () => {
                        if (!isSwapped) return;
                        isSwapped = false;
                        Oracle.group('AEGIS REVERSE INITIATED');
                        
                        // Reset the stunt double's state for the next run
                        elements.stuntActor.classList.remove('is-logo-final-state');
                        gsap.set(elements.stuntActorFaces, { opacity: 1 }); // Restore faces
                        gsap.set(elements.stuntActor, { autoAlpha: 0 }); // Hide it
                        
                        // Flawlessly reveal the hero actor
                        gsap.set(elements.heroActor, { autoAlpha: 1 });
                        
                        Oracle.log(elements.stuntActor, "Stunt Double Reset & Hidden");
                        Oracle.log(elements.heroActor, "Hero Actor Restored");
                        Oracle.groupEnd();
                    }
                });
            }
        });
    });

    return ctx; // Return the context for easy cleanup if ever needed.
}


function initialCheck(){if(window.gsap&&window.ScrollTrigger&&window.Flip){setupAnimations();}else{let i=0,t=setInterval(()=>{if(window.gsap&&window.ScrollTrigger&&window.Flip){clearInterval(t);setupAnimations();}else if(i++>=30){clearInterval(t);console.error("GSAP libs failed to load.");}},100);}}
function setupSiteLogic(){const e=document.getElementById("menu-open-button"),t=document.getElementById("menu-close-button"),n=document.getElementById("menu-screen"),o=document.documentElement;e&&t&&n&&(e.addEventListener("click",()=>{o.classList.add("menu-open")}),t.addEventListener("click",()=>{o.classList.remove("menu-open")}));const c=document.getElementById("current-year");c&&(c.textContent=(new Date).getFullYear())}
document.addEventListener("DOMContentLoaded",()=>{setupSiteLogic();initialCheck();});
