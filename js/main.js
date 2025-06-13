/*
===========================================================================
   STABLE DEBUGGING BUILD v7.0 - State Injection & Authoritative Sync
===========================================================================
*/
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);

    console.clear();
    console.log('%cGSAP Stable Debug Build v7.0 Initialized.', 'color: #88c0d0; font-weight: bold;');
    
    ScrollTrigger.defaults({ markers: true });

    const ctx = gsap.context(() => {
        // --- Element Selection & Guards (Unchanged) ---
        const visualsCol = document.querySelector('.pillar-visuals-col');
        const scene3D = document.querySelector('.scene-3d');
        const textCol = document.querySelector('.pillar-text-col');
        const actor3D = document.getElementById('actor-3d');
        const textPillars = gsap.utils.toArray('.pillar-text-content');
        const summaryContainer = document.querySelector('.method-summary');
        const summaryClipper = document.querySelector('.summary-thumbnail-clipper');

        // Dashboard Elements
        const flipStatusEl = document.getElementById('debug-flip-status');
        const scrubStatusEl = document.getElementById('debug-scrub-status');
        const progressEl = document.getElementById('debug-timeline-progress');
        const lastEventEl = document.getElementById('debug-last-event');

        if (!visualsCol || !scene3D || !textCol || !actor3D || !summaryContainer || !summaryClipper || !flipStatusEl) {
            console.error('Scrollytelling aborted: Critical elements are missing from the DOM.');
            return;
        }
        
        let isFlipped = false;

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                
                // --- 1. The Main Scrollytelling Timeline (Unchanged) ---
                gsap.set(textPillars, { autoAlpha: 0 });
                gsap.set(textPillars[0], { autoAlpha: 1 });

                const tl = gsap.timeline({
                    onUpdate: () => progressEl && (progressEl.textContent = `${tl.progress().toFixed(4)}`)
                });
                
                const states = [
                    { rotationY: 20, rotationX: -15, scale: 1.0 },
                    { rotationY: 120, rotationX: 10, scale: 1.1 },
                    { rotationY: -120, rotationX: -20, scale: 1.2 }
                ];
                
                tl.to(actor3D, { ...states[0], duration: 1 })
                  .to(textPillars[0], { autoAlpha: 1 }, '<')
                  .to(textPillars[0], { autoAlpha: 0, duration: 0.5 }, '+=0.5')
                  .to(actor3D, { ...states[1], duration: 1 }, '<')
                  .to(textPillars[1], { autoAlpha: 1, duration: 0.5 }, '<')
                  .to(textPillars[1], { autoAlpha: 0, duration: 0.5 }, '+=0.5')
                  .to(actor3D, { ...states[2], duration: 1 }, '<')
                  .to(textPillars[2], { autoAlpha: 1, duration: 0.5 }, '<')
                  .addLabel("finalState")
                  .to(textPillars[2], { autoAlpha: 0, duration: 0.5 }, '+=0.5')
                  .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1.0, duration: 1 }, '<');

                const mainScrub = ScrollTrigger.create({
                    trigger: textCol, pin: visualsCol, start: 'top top', end: 'bottom bottom',
                    animation: tl, scrub: 0.8, invalidateOnRefresh: true,
                });

                // --- 2. The Unified Handoff Trigger (Logic inside is new) ---
                ScrollTrigger.create({
                    trigger: summaryContainer,
                    start: 'top center',
                    
                    // onEnter (Flip Down) logic is solid, no changes needed.
                    onEnter: () => {
                        if (isFlipped) return;
                        isFlipped = true;
                        
                        console.group('%cEVENT: onEnter (Handoff to Summary)', 'color: #A3BE8C; font-weight:bold;');
                        lastEventEl.textContent = 'onEnter (Flip Down)';
                        flipStatusEl.textContent = 'FLIPPED';
                        scrubStatusEl.textContent = 'DISABLED';
                        
                        mainScrub.disable();
                        const state = Flip.getState(actor3D);
                        summaryClipper.appendChild(actor3D);
                        
                        Flip.from(state, {
                            duration: 0.8, ease: 'power2.inOut', scale: true,
                            onComplete: () => { console.log('Flip DOWN complete.'); console.groupEnd(); }
                        });
                    },

                                               // PHASE 3: The Return Journey with THE NUCLEAR OPTION
                        onLeaveBack: () => {
                            if (!isFlipped) {
                                console.warn('NUCLEAR SYNC ABORTED: Already in scroller state.');
                                return;
                            }
                            
                            console.group('%cEVENT: onLeaveBack (Initiating v9.0 NUCLEAR SYNC)', 'color: #D81B60; font-weight:bold; font-size: 16px; text-transform: uppercase;');
                            lastEventEl.textContent = 'onLeaveBack (v9.0)';
                            flipStatusEl.textContent = 'TRANSITIONING...';
                        
                            const state = Flip.getState(actor3D, {props: "transform,opacity"});
                            scene3D.appendChild(actor3D);
                        
                            Flip.from(state, {
                                duration: 0.8,
                                ease: 'power2.out',
                                scale: true,
                                // ============================ ONCOMPLETE STARTS HERE ============================
                                onComplete: () => {
                                    console.log('%c[v9.0] Flip UP complete. Beginning silent state-reconstruction protocol...', 'color: #BF616A; font-weight:bold; font-size: 12px;');
                                    
                                    // THE UNCOMPROMISING 7-STEP "NUCLEAR SYNC"
                                    
                                    // --- PRE-SYNC STATE DIAGNOSTICS ---
                                    console.groupCollapsed('Pre-Sync Diagnostics');
                                    console.log(`Initial actor3D transform: ${gsap.getProperty(actor3D, "transform")}`);
                                    console.log(`Timeline (tl) progress: ${tl.progress().toFixed(4)}`);
                                    console.log(`Controller (mainScrub) progress: ${mainScrub.progress.toFixed(4)}`);
                                    console.groupEnd();
                                    
                                    // STEP 1: MAINTAIN STEALTH - Controller remains disabled. No action needed, but we verify.
                                    console.log(`%cSTEP 1: CONFIRM STEALTH MODE - Main scrub is disabled: ${!mainScrub.enabled}`, 'color: #8FBCBB');
                        
                                    // STEP 2: PREP THE FIELD - Clean up the element.
                                    console.log(`%cSTEP 2: PREP THE FIELD - Clearing all props from actor3D.`, 'color: #8FBCBB');
                                    gsap.set(actor3D, { clearProps: "all" });
                        
                                    // STEP 3: COMMAND THE TIMELINE DIRECTLY - This will sync BOTH cube AND text.
                                    const finalStateProgress = tl.labels.finalState / tl.duration();
                                    console.log(`%cSTEP 3: COMMAND TIMELINE - Forcing timeline progress to 'finalState' (${finalStateProgress.toFixed(4)})`, 'color: #88C0D0');
                                    tl.progress(finalStateProgress);
                                    console.log(`   - VERIFICATION: Actor rotation is now: ${gsap.getProperty(actor3D, "rotationY").toFixed(2)}`);
                                    console.log(`   - VERIFICATION: Pillar 3 alpha is now: ${gsap.getProperty(textPillars[2], "autoAlpha")}`);
                        
                                    // STEP 4: SILENTLY SYNC THE CONTROLLER
                                    const targetScrollPos = mainScrub.start + (mainScrub.end - mainScrub.start) * finalStateProgress;
                                    console.log(`%cSTEP 4: INFILTRATE CONTROLLER - Silently setting disabled scrub's scroll to ${targetScrollPos.toFixed(2)}px`, 'color: #88C0D0');
                                    mainScrub.scroll(targetScrollPos);
                                    
                                    // STEP 5: FULL SYSTEM VERIFICATION - The most important check before going live.
                                    console.group('%cSTEP 5: FULL SYSTEM VERIFICATION (PRE-ENABLE)', 'color: #EBCB8B');
                                    console.log(`   - TARGET PROGRESS: ${finalStateProgress.toFixed(4)}`);
                                    console.log(`   - Timeline (tl) progress:  ${tl.progress().toFixed(4)}`);
                                    console.log(`   - Controller (mainScrub) progress: ${mainScrub.progress.toFixed(4)}`);
                                    console.log(`   - Cube Rotation (should be -120): ${gsap.getProperty(actor3D, "rotationY").toFixed(2)}`);
                                    console.log(`   - Text Alpha (should be 1): ${gsap.getProperty(textPillars[2], "autoAlpha")}`);
                                    const isSynced = Math.abs(tl.progress() - mainScrub.progress) < 0.0001;
                                    console.log(`   - IS SYSTEM SYNCED? -> %c${isSynced}`, `color: ${isSynced ? '#A3BE8C' : '#BF616A'}`);
                                    console.groupEnd();
                        
                                    // STEP 6: GO LIVE
                                    console.log('%cSTEP 6: GO LIVE - Re-enabling the main scrub controller.', 'color: #A3BE8C');
                                    mainScrub.enable();
                                    scrubStatusEl.textContent = 'ENABLED';
                                    
                                    // STEP 7: SYNCHRONIZE THE UNIVERSE
                                    console.log(`%cSTEP 7: SYNCHRONIZE UI - Snapping window scroll to ${targetScrollPos.toFixed(2)}px to match state.`, 'color: #A3BE8C');
                                    window.scrollTo({ top: targetScrollPos, behavior: 'instant' });
                        
                                    isFlipped = false;
                                    
                                    // --- FINAL POST-MORTEM ---
                                    console.log('%cNUCLEAR SYNC COMPLETE. All systems nominal.', 'color: #D81B60; font-weight: bold;');
                                    flipStatusEl.textContent = 'In Scroller';
                                    lastEventEl.textContent = 'Nuclear Sync Complete';
                                    console.groupEnd(); // End the main v9.0 event group
                                }
                            });
                        }
                });
            }
        });
    });

    return () => ctx.revert();
}


// Your initial loader and other functions remain perfectly fine.
function initialCheck() {
    // unchanged...
    if (window.gsap && window.ScrollTrigger && window.Flip) { setupAnimations(); }
    else { let i = 0, max = 30, t = setInterval(() => { i++; if(window.gsap && window.ScrollTrigger && window.Flip) { clearInterval(t); setupAnimations(); } else if (i>=max) { clearInterval(t); console.error("GSAP load fail");}},100); }
}
document.addEventListener('DOMContentLoaded', initialCheck);
