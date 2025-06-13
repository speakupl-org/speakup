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

                        /*
                        ===================================================================================
                           TOTAL ANNIHILATION BUILD v10.0 - Rebirth Protocol & Cerebro HUD
                        ===================================================================================
                        */
                        function setupAnimations() {
                            gsap.registerPlugin(ScrollTrigger, Flip);
                        
                            console.clear();
                            console.log('%cGSAP Total Annihilation Build v10.0 Initialized.', 'color: #D81B60; font-weight: bold;');
                            ScrollTrigger.defaults({ markers: true });
                        
                            const ctx = gsap.context(() => {
                                // --- Element Selection & Guards ---
                                const visualsCol = document.querySelector('.pillar-visuals-col');
                                const scene3D = document.querySelector('.scene-3d');
                                const textCol = document.querySelector('.pillar-text-col');
                                const actor3D = document.getElementById('actor-3d');
                                const textPillars = gsap.utils.toArray('.pillar-text-content');
                                const handoffPoint = document.getElementById('handoff-point'); // <-- NEW
                                const summaryClipper = document.querySelector('.summary-thumbnail-clipper');
                        
                                if (!visualsCol || !scene3D || !actor3D || !handoffPoint || !summaryClipper) {
                                    console.error('Scrollytelling aborted: Critical elements missing.'); return;
                                }
                                
                                // --- Cerebro HUD Element Refs ---
                                const cState = document.getElementById('c-state'),
                                      cEvent = document.getElementById('c-event'),
                                      cTlProg = document.getElementById('c-tl-prog'),
                                      cScrubProg = document.getElementById('c-scrub-prog'),
                                      cRotY = document.getElementById('c-roty'),
                                      cRotX = document.getElementById('c-rotx'),
                                      cScale = document.getElementById('c-scale');
                        
                                let isFlipped = false;
                                cState.textContent = "In Scroller";
                        
                                ScrollTrigger.matchMedia({
                                    '(min-width: 769px)': () => {
                                        const tl = gsap.timeline(); // Note: onUpdate is now handled by Cerebro
                        
                                        // --- Timeline (Structure remains the same) ---
                                        // ... (your states and timeline definition is fine, no changes needed) ...
                                         const states = [
                                            { rotationY: 20, rotationX: -15, scale: 1.0 },
                                            { rotationY: 120, rotationX: 10, scale: 1.1 },
                                            { rotationY: -120, rotationX: -20, scale: 1.2 } // This is our target state
                                        ];
                                        tl.to(actor3D, { ...states[0], duration: 1})
                                          .to(textPillars[0], { autoAlpha: 1 }, '<')
                                          .to(textPillars[0], { autoAlpha: 0, duration: 0.5 }, '+=0.5')
                                          .to(actor3D, { ...states[1], duration: 1 }, '<')
                                          .to(textPillars[1], { autoAlpha: 1, duration: 0.5 }, '<')
                                          .to(textPillars[1], { autoAlpha: 0, duration: 0.5 }, '+=0.5')
                                          .to(actor3D, { ...states[2], duration: 1 }, '<')
                                          .to(textPillars[2], { autoAlpha: 1, duration: 0.5 }, '<')
                                          .addLabel("finalState")
                                          // THE CRITICAL CHANGE: The final text fade happens AFTER the handoff point
                                          .to(textPillars[2], { autoAlpha: 0, duration: 0.5 }, '+=0.5')
                                          .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1.0, duration: 1 }, '<');
                                        
                        
                                        const mainScrub = ScrollTrigger.create({
                                            trigger: textCol,
                                            pin: visualsCol,
                                            start: 'top top',
                                            end: `bottom bottom-=${window.innerHeight}`, // End scrub before viewport hits absolute bottom
                                            animation: tl,
                                            scrub: 0.8,
                                            invalidateOnRefresh: true,
                                        });
                                        
                                        // CEREBRO: The Live Update Engine
                                        gsap.ticker.add(() => {
                                            cTlProg.textContent = tl.progress().toFixed(4);
                                            cScrubProg.textContent = mainScrub.progress.toFixed(4);
                                            cRotY.textContent = gsap.getProperty(actor3D, "rotationY").toFixed(2);
                                            cRotX.textContent = gsap.getProperty(actor3D, "rotationX").toFixed(2);
                                            cScale.textContent = gsap.getProperty(actor3D, "scale").toFixed(2);
                                        });
                        
                                        // --- Unified Trigger using our NEW #handoff-point element ---
                                        ScrollTrigger.create({
                                            trigger: handoffPoint,
                                            start: 'top center', 
                        
                                            onEnter: () => {
                                                if (isFlipped) return;
                                                isFlipped = true;
                                                cState.textContent = "FLIPPED";
                                                cEvent.textContent = "onEnter (Flip Down)";
                                                
                                                mainScrub.disable();
                                                const state = Flip.getState(actor3D);
                                                summaryClipper.appendChild(actor3D);
                                                Flip.from(state, { duration: 0.8, ease: 'power2.inOut', scale: true });
                                            },
                        
                                            onLeaveBack: () => {
                                                if (!isFlipped) return;
                                                cState.textContent = "TRANSITIONING...";
                                                cEvent.textContent = "onLeaveBack (v10 REBIRTH)";
                        
                                                // Start the journey back...
                                                const state = Flip.getState(actor3D, {props: "transform,opacity"});
                                                scene3D.appendChild(actor3D);
                        
                                                Flip.from(state, {
                                                    duration: 0.8, ease: 'power2.out', scale: true,
                                                    onComplete: () => {
                                                        // =============== REBIRTH PROTOCOL ===============
                                                        console.group('%cREBIRTH PROTOCOL v10.0 INITIATED', 'color: #D81B60; font-weight:bold;');
                        
                                                        // STEP 1: INVALIDATE - Nuke the timeline's corrupted cache.
                                                        console.log("1. INVALIDATING TIMELINE - Forcing it to forget all cached values.");
                                                        tl.invalidate();
                        
                                                        // STEP 2: RE-RENDER - Set progress. It will now calculate correctly.
                                                        const finalStateProgress = tl.labels.finalState / tl.duration();
                                                        console.log(`2. SETTING PROGRESS to ${finalStateProgress.toFixed(4)}. Timeline will re-render from clean state.`);
                                                        tl.progress(finalStateProgress);
                                                        
                                                        console.log(`   - VERIFICATION (Rotation): ${gsap.getProperty(actor3D, 'rotationY').toFixed(2)} / should be ${states[2].rotationY}`);
                                                        console.log(`   - VERIFICATION (Text Alpha): ${gsap.getProperty(textPillars[2], 'autoAlpha')} / should be 1`);
                        
                                                        // STEP 3: TELEPORT - Control the browser directly.
                                                        const handoffPointTop = handoffPoint.getBoundingClientRect().top + window.scrollY;
                                                        console.log(`3. TELEPORTING BROWSER to scrollY: ${handoffPointTop.toFixed(2)}px.`);
                                                        window.scrollTo({ top: handoffPointTop, behavior: 'instant' });
                                                        
                                                        // STEP 4: REFRESH ALL - Force all ScrollTriggers to acknowledge the new reality.
                                                        console.log("4. REFRESHING ALL TRIGGERS to sync with new scroll position.");
                                                        ScrollTrigger.refresh(true);
                        
                                                        // STEP 5: GO LIVE
                                                        console.log("5. GOING LIVE - Re-enabling the main scrub.");
                                                        mainScrub.enable();
                                                        
                                                        isFlipped = false;
                                                        cState.textContent = "In Scroller (REBORN)";
                                                        console.log("REBIRTH COMPLETE. System integrity restored.");
                                                        console.groupEnd();
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
