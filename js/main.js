/*
========================================================================
   THE FINAL BUILD v10.0 - The Covenant (Perfected Timeline)
========================================================================
*/
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cGSAP Final Build v10.0 Initialized.', 'color: #A3BE8C; font-weight: bold; font-size: 14px;');
    ScrollTrigger.defaults({ markers: true });

    const ctx = gsap.context(() => {
        // --- Element Selection & Guards ---
        const visualsCol = document.querySelector('.pillar-visuals-col');
        const scene3D = document.querySelector('.scene-3d');
        const textCol = document.querySelector('.pillar-text-col');
        const actor3D = document.getElementById('actor-3d');
        const textPillars = gsap.utils.toArray('.pillar-text-content');
        const summaryContainer = document.querySelector('.method-summary');
        const summaryClipper = document.querySelector('.summary-thumbnail-clipper');
        if (!visualsCol || !scene3D || !textCol || !actor3D || !summaryContainer || !summaryClipper) {
            console.error('Scrollytelling aborted: Critical elements missing.');
            return;
        }

        let isFlipped = false;

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                
                // --- 1. THE COVENANT TIMELINE (The Fix) ---
                // The structure is now clean and unambiguous.
                const tl = gsap.timeline();
                
                // Intro and Pillar 1
                tl.to(actor3D, { rotationY: 20, rotationX: -15, scale: 1.0, duration: 1 })
                  .from(textPillars[0], { autoAlpha: 0 })
                  .to(textPillars[0], { autoAlpha: 1, duration: 0.5 }, '<');

                // Pillar 2
                tl.to(textPillars[0], { autoAlpha: 0, duration: 0.5 }, "+=1")
                  .to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.1, duration: 1 }, "<")
                  .to(textPillars[1], { autoAlpha: 1, duration: 0.5 }, "<");

                // Pillar 3
                tl.to(textPillars[1], { autoAlpha: 0, duration: 0.5 }, "+=1")
                  .to(actor3D, { rotationY: -120, rotationX: -20, scale: 1.2, duration: 1 }, "<")
                  .to(textPillars[2], { autoAlpha: 1, duration: 0.5 }, "<")
                  
                  // THE CRITICAL CHANGE: The finalState label now marks a clean, uncontested point.
                  .addLabel("finalState"); 

                // The "Exit" animation now happens *after* finalState, in its own logical block.
                tl.to(textPillars[2], { autoAlpha: 0, duration: 0.5 }, "+=1")
                  .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1, duration: 1}, "<");


                const mainScrub = ScrollTrigger.create({
                    trigger: textCol, pin: visualsCol, start: 'top top', end: 'bottom bottom',
                    animation: tl, scrub: 0.8, invalidateOnRefresh: true
                });

                // --- 2. The Handoff Trigger (The Relay Zone) ---
                ScrollTrigger.create({
                    trigger: summaryContainer,
                    start: 'top center',
                    
                    onEnter: () => {
                        if (isFlipped) return;
                        isFlipped = true;
                        mainScrub.disable();
                        const state = Flip.getState(actor3D);
                        summaryClipper.appendChild(actor3D);
                        Flip.from(state, { duration: 0.8, ease: 'power2.inOut', scale: true });
                    },

                    // The clean, simple, and now CORRECT "Covenant Sync"
                    onLeaveBack: () => {
                        if (!isFlipped) return;

                        const state = Flip.getState(actor3D);
                        scene3D.appendChild(actor3D);

                        Flip.from(state, {
                            duration: 0.8, ease: 'power2.out', scale: true,
                            onComplete: () => {
                                console.log('%cCOVENANT SYNC INITIATED', 'color: #88c0d0; font-weight: bold;');
                                // THE 3-STEP COVENANT
                                // 1. Clean the element so the timeline has full control.
                                gsap.set(actor3D, { clearProps: "all" });
                                // 2. Seek the timeline to the exact, now-correct state.
                                tl.seek("finalState");
                                // 3. Enable the controller, which now correctly reads the timeline's state.
                                mainScrub.enable();
                                isFlipped = false;
                                console.log('Relay Race is perfectly reset.');
                            }
                        });
                    }
                });
            }
        });
    });

    return () => ctx.revert();
}

function initialCheck() {
    if (window.gsap && window.ScrollTrigger && window.Flip) { setupAnimations(); }
    else { let i = 0, max = 30, t = setInterval(() => { i++; if(window.gsap && window.ScrollTrigger && window.Flip) { clearInterval(t); setupAnimations(); } else if (i>=max) { clearInterval(t); console.error("GSAP load fail");}},100); }
}
document.addEventListener('DOMContentLoaded', initialCheck);
