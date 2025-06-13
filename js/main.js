/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v30.2 - "Keystone" Correction
   
   This build corrects the primary document architecture and refines the "Aegis"
   protocol to guarantee final-state visibility. The system is now structurally
   and functionally complete.
========================================================================================
*/

// Oracle Forensic Logger v2.0 - "Aegis" Telemetry Upgrade
const Oracle = {
    log: (el, label) => { /* ... no changes here ... */ },
    group: (label) => { /* ... no changes here ... */ },
    groupEnd: () => { /* ... no changes here ... */ },
    report: (message) => { /* ... no changes here ... */ },
    warn: (message) => { /* ... no changes here ... */ }
};


function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    Oracle.report('GSAP Covenant Build v30.2 Initialized. [KEYSTONE CORRECTION]');

    const ctx = gsap.context(() => {
        const elements = {
            heroActor: document.getElementById('actor-3d'),
            stuntActor: document.getElementById('actor-3d-stunt-double'),
            placeholder: document.getElementById('summary-placeholder'),
            textPillars: gsap.utils.toArray('.pillar-text-content'),
            visualsCol: document.querySelector('.pillar-visuals-col'),
            textCol: document.querySelector('.pillar-text-col'),
            handoffPoint: document.getElementById('handoff-point'),
            stuntActorFaces: gsap.utils.toArray('#actor-3d-stunt-double .face:not(.front)')
        };

        if (Object.values(elements).some(el => !el || (Array.isArray(el) && !el.length))) {
            Oracle.warn('CITADEL ABORT: Critical elements missing from DOM.');
            return;
        }
        Oracle.report("Citadel reports all elements located and verified.");

        let isSwapped = false;

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.textCol,
                        pin: elements.visualsCol,
                        start: 'top top',
                        end: `bottom bottom-=${window.innerHeight * 0.8}`,
                        scrub: 0.8,
                        onUpdate: (self) => {
                            if (self.progress > 0 && self.progress < 1) {
                                Oracle.log(elements.heroActor, "Live Hero Scrub");
                            }
                        }
                    }
                });
                tl.to(elements.heroActor, { rotationY: 120, rotationX: 10, scale: 1.1, ease: "none" }, 0)
                  /* ... rest of timeline is unchanged ... */
                  .to(elements.textPillars[0], { autoAlpha: 0, y: -30 }, 0)
                  .from(elements.textPillars[1], { autoAlpha: 0, y: 30 }, 0)
                  .to(elements.heroActor, { rotationY: -120, rotationX: -20, scale: 1.2, ease: "none" }, 1)
                  .to(elements.textPillars[1], { autoAlpha: 0, y: -30 }, 1)
                  .from(elements.textPillars[2], { autoAlpha: 0, y: 30 }, 1);
                Oracle.report("Immutable timeline forged.");

                ScrollTrigger.create({
                    trigger: elements.handoffPoint,
                    start: 'top 70%',
                    onEnter: () => {
                        if (isSwapped) return;
                        isSwapped = true;
                        Oracle.group('AEGIS BAIT & SWITCH INITIATED');
                        
                        const startState = Flip.getState(elements.heroActor);
                        Oracle.log(elements.heroActor, "1. Hero State at Handoff");
                        
                        gsap.set(elements.heroActor, { autoAlpha: 0 });
                        Oracle.report("--> Hero actor hidden.");

                        elements.placeholder.appendChild(elements.stuntActor);
                        const endState = Flip.getState(elements.stuntActor, {props: "transform,opacity"});

                        Oracle.log(elements.stuntActor, "2. Stunt Double Pre-Animation State");
                        Oracle.report("3. Initiating surgical FLIP animation...");

                        // --- KEYSTONE CORRECTION ---
                        // Ensure the stunt double is and remains visible throughout the animation.
                        gsap.set(elements.stuntActor, { autoAlpha: 1 });
                        
                        Flip.from(endState, {
                            targets: elements.stuntActor,
                            duration: 1.2,
                            ease: 'expo.inOut',
                            onEnter: targets => gsap.from(targets, {
                                scale: startState.scale,
                                rotationX: startState.rotationX,
                                rotationY: startState.rotationY
                            }),
                            onComplete: () => {
                                Oracle.report("4. Trajectory complete. Applying final state.");
                                elements.stuntActor.classList.add('is-logo-final-state');
                                Oracle.log(elements.stuntActor, "5. Final Landed State (Post-Morph)");
                                Oracle.groupEnd();
                            }
                        });

                        gsap.to(elements.stuntActorFaces, {
                            opacity: 0,
                            duration: 0.4,
                            ease: "power1.in",
                            delay: 0.6
                        });
                    },
                    onLeaveBack: () => {
                        if (!isSwapped) return;
                        isSwapped = false;
                        Oracle.group('AEGIS REVERSE INITIATED');
                        
                        elements.stuntActor.classList.remove('is-logo-final-state');
                        gsap.set(elements.stuntActorFaces, { opacity: 1 });
                        gsap.set(elements.stuntActor, { autoAlpha: 0 }); // Use autoAlpha for consistency
                        
                        gsap.set(elements.heroActor, { autoAlpha: 1 });
                        
                        Oracle.log(elements.stuntActor, "Stunt Double Reset & Hidden");
                        Oracle.log(elements.heroActor, "Hero Actor Restored");
                        Oracle.groupEnd();
                    }
                });
            }
        });
    });

    return ctx;
}
