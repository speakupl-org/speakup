/*
========================================================================================
   THE FINAL COVENANT SEAL BUILD v12.0 - The Buffer Zone & Final Polish
========================================================================================
*/
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cGSAP Covenant Seal Build v12.0 Initialized. The Relay is Perfected.', 'color: #5E81AC; font-weight: bold; font-size: 14px;');
    ScrollTrigger.defaults({ markers: true });

    const ctx = gsap.context(() => {
        // --- 1. ELEMENT SELECTION ---
        const visualsCol = document.querySelector('.pillar-visuals-col');
        const scene3D = document.querySelector('.scene-3d');
        const textCol = document.querySelector('.pillar-text-col');
        const actor3D = document.getElementById('actor-3d');
        const textPillars = gsap.utils.toArray('.pillar-text-content');
        const summaryClipper = document.querySelector('.summary-thumbnail-clipper');
        const handoffPoint = document.getElementById('handoff-point'); 

        if (!visualsCol || !scene3D || !textCol || !actor3D || !summaryClipper || !handoffPoint) {
            console.error('COVENANT ABORTED: One or more critical elements are missing.');
            return;
        }

        // --- Cerebro HUD (Unchanged) ---
        const cState = document.getElementById('c-state'), cEvent = document.getElementById('c-event'),
              cTlProg = document.getElementById('c-tl-prog'), cScrubProg = document.getElementById('c-scrub-prog'),
              cRotY = document.getElementById('c-roty'), cRotYTarget = document.getElementById('c-roty-target'),
              cTextAlpha = document.getElementById('c-text-alpha');

        let isFlipped = false;
        let isTransitioning = false; // New safety lock to prevent any overlap
        cState.textContent = "Standby";

        // --- 2. THE MEDIA QUERY SCOPE ---
        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                cState.textContent = "In Scroller";

                // --- 3. THE PERFECTED TIMELINE ---
                const tl = gsap.timeline({ paused: true });
                const states = {
                    p1: { rotationY: 20, rotationX: -15, scale: 1.0 },
                    p2: { rotationY: 120, rotationX: 10, scale: 1.1 },
                    p3: { rotationY: -120, rotationX: -20, scale: 1.2 },
                    exit: { rotationY: 0, rotationX: 0, scale: 1.0 }
                };
                cRotYTarget.textContent = `${states.p3.rotationY}`;

                gsap.set(textPillars, { autoAlpha: 0 });
                
                // Generous delays ("+=1.5") give the story more breathing room.
                tl.to(actor3D, { ...states.p1, duration: 1 })
                  .to(textPillars[0], { autoAlpha: 1, duration: 0.5 }, "<")
                
                .to(textPillars[0], { autoAlpha: 0, duration: 0.5 }, "+=1.5")
                  .to(actor3D, { ...states.p2, duration: 1 }, "<")
                  .to(textPillars[1], { autoAlpha: 1, duration: 0.5 }, "<")

                .to(textPillars[1], { autoAlpha: 0, duration: 0.5 }, "+=1.5")
                  .to(actor3D, { ...states.p3, duration: 1 }, "<")
                  .to(textPillars[2], { autoAlpha: 1, duration: 0.5 }, "<")
                  
                  .addLabel("finalState") // The sacred synchronization point
                  
                .to(textPillars[2], { autoAlpha: 0, duration: 0.5 }, "+=1.5")
                  .to(actor3D, { ...states.exit, duration: 1 }, "<");

                // --- 4. MASTER SCRUB & CEREBRO ---
                const mainScrub = ScrollTrigger.create({
                    trigger: textCol, pin: visualsCol, start: 'top top',
                    end: `bottom bottom-=${window.innerHeight / 2}`,
                    animation: tl, scrub: 0.8, invalidateOnRefresh: true,
                });

                gsap.ticker.add(() => { /* ... Cerebro update logic is unchanged ... */ });

                // --- 5. THE FINAL HANDOFF TRIGGER ---
                ScrollTrigger.create({
                    trigger: handoffPoint,
                    start: 'bottom center', // Trigger when the BOTTOM of the buffer hits the center

                    onEnter: () => {
                        if (isFlipped || isTransitioning) return;
                        isFlipped = true;
                        cState.textContent = "FLIPPED"; cEvent.textContent = "onEnter";
                        mainScrub.disable();
                        const state = Flip.getState(actor3D);
                        summaryClipper.appendChild(actor3D);
                        Flip.from(state, { duration: 0.8, ease: 'power2.inOut', scale: true });
                    },

                    onLeaveBack: () => {
                        if (!isFlipped || isTransitioning) return;
                        isTransitioning = true; // Engage the safety lock
                        cState.textContent = "REBIRTHING..."; cEvent.textContent = "onLeaveBack";
                        
                        const state = Flip.getState(actor3D, {props: "transform,opacity"});
                        scene3D.appendChild(actor3D);

                        Flip.from(state, {
                            duration: 0.8, ease: 'power2.out', scale: true,
                            onComplete: () => {
                                console.group('%cREBIRTH PROTOCOL v12.0 INITIATED', 'color: #D81B60; font-weight:bold;');
                                tl.invalidate();
                                const finalStateProgress = tl.labels.finalState / tl.duration();
                                tl.progress(finalStateProgress).pause();
                                const handoffPointTop = handoffPoint.getBoundingClientRect().top + window.scrollY;
                                window.scrollTo({ top: handoffPointTop, behavior: 'instant' });
                                ScrollTrigger.refresh(true);
                                mainScrub.enable();
                                isFlipped = false;
                                isTransitioning = false; // Release the safety lock
                                cState.textContent = "In Scroller (Reborn)";
                                console.log("%cREBIRTH COMPLETE. System integrity restored.", 'font-weight: bold;');
                                console.groupEnd();
                            }
                        });
                    }
                });
            }
        });
    });
    return () => { ctx.revert(); };
}

// All other JS (initialCheck, setupSiteLogic, DOMContentLoaded) remains the same.
// Just ensure this setupAnimations function is called correctly.
