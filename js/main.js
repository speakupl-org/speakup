/*
========================================================================================
   THE MANHATTAN PROJECT v17.0 - Absolute State Purification & Controlled Detonation.
   
   This is the final build. It addresses the element state contamination that persisted
   through previous rebuild protocols.
   
   Core Principles:
   1. The Permanent Pinner: A stable layout foundation. UNCHANGED.
   2. The Ephemeral Animation: The kill-and-rebuild protocol. UNCHANGED.
   3. The State Purification Protocol: A new, unbreakable sequence that purges all
      element-level state contamination BEFORE rebuilding the animation, then forces
      the new instance and the viewport into perfect, manual synchronization.
========================================================================================
*/

// --- 1. GLOBAL STATE & SETUP ---

gsap.registerPlugin(ScrollTrigger, Flip);
console.clear();
console.log('%cGSAP Manhattan Project v17.0 Initialized. State purification protocols engaged.', 'color: #cddc39; font-weight: bold; font-size: 14px;');
ScrollTrigger.defaults({ markers: true });

// A global object to hold only the animation instance that needs to be killed.
const ephemeralAnimation = {
    scrub: null,
};

// --- 2. THE CORE FUNCTIONS ---

/**
 * Builds ONLY the animation-scrubbing ScrollTrigger.
 */
function buildAnimationScrub(actor3D, textPillars, textCol, summaryClipper) {
    if (ephemeralAnimation.scrub) {
        console.warn("BUILD ABORTED: Animation instance already exists.");
        return;
    }
    
    console.log('%cBUILD: Creating new animation instance.', 'color: #A3BE8C');
    gsap.defaults({ ease: "none" });

    const tl = gsap.timeline();
    // Proven timeline logic...
    tl.to(actor3D, { rotationY: 20, rotationX: -15, scale: 1.0, duration: 1 })
      .to(textPillars[0], { autoAlpha: 1, duration: 0.5 }, "<")
    .to(textPillars[0], { autoAlpha: 0, duration: 0.5 }, "+=1.25")
      .to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.1, duration: 1 }, "<")
      .to(textPillars[1], { autoAlpha: 1, duration: 0.5 }, "<")
    .to(textPillars[1], { autoAlpha: 0, duration: 0.5 }, "+=1.25")
      .to(actor3D, { rotationY: -120, rotationX: -20, scale: 1.2, duration: 1 }, "<")
      .to(textPillars[2], { autoAlpha: 1, duration: 0.5 }, "<")
      .addLabel("finalState")
    .to(textPillars[2], { autoAlpha: 0, duration: 0.5 }, "+=1.25")
      .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1.0, duration: 1 }, "<");
    
    ephemeralAnimation.scrub = ScrollTrigger.create({
        trigger: textCol,
        start: 'top top',
        end: 'bottom bottom',
        animation: tl,
        scrub: 0.5,

        onLeave: (self) => {
            if (self.direction < 0) return;
            const state = Flip.getState(actor3D);
            summaryClipper.appendChild(actor3D);
            Flip.from(state, {
                duration: 0.8, ease: 'power2.inOut', scale: true,
                onComplete: () => {
                    console.log('%cKILL: Annihilating animation scrub instance.', 'color: #BF616A');
                    self.kill();
                    ephemeralAnimation.scrub = null;
                }
            });
        }
    });
}

// --- 3. THE MAIN SETUP FUNCTION ---
function setupAnimations() {
    // Select all elements once.
    const visualsCol = document.querySelector('.pillar-visuals-col');
    const scene3D = document.querySelector('.scene-3d');
    const textCol = document.querySelector('.pillar-text-col');
    const actor3D = document.getElementById('actor-3d');
    const textPillars = gsap.utils.toArray('.pillar-text-content');
    const summaryContainer = document.querySelector('.method-summary');
    const summaryClipper = document.querySelector('.summary-thumbnail-clipper');

    if (!visualsCol || !textCol || !actor3D || !summaryContainer) {
        console.error("Manhattan Project Aborted: Critical elements missing.");
        return;
    }

    // --- THE PERMANENT PINNER ---
    ScrollTrigger.create({
        trigger: textCol,
        pin: visualsCol,
        start: 'top top',
        end: 'bottom bottom',
    });
    
    // Initial build of the animation scroller.
    buildAnimationScrub(actor3D, textPillars, textCol, summaryClipper);

    // --- THE RECREATION TRIGGER ---
    ScrollTrigger.create({
        trigger: summaryContainer,
        start: "top bottom",

        onLeaveBack: () => {
            if (ephemeralAnimation.scrub) return;

            console.log("%cEVENT: onLeaveBack -> Rebirth Initiated.", "color: #0077c2; font-weight: bold;");

            const state = Flip.getState(actor3D, { props: "transform,opacity" });
            scene3D.appendChild(actor3D);
            Flip.from(state, {
                duration: 0.8, ease: "power2.out", scale: true,
                onComplete: () => {
                    // =================================================================
                    //                THE STATE PURIFICATION PROTOCOL
                    // =================================================================
                    console.group('%cMANHATTAN PROTOCOL: Engaging state purification...', 'color: #cddc39; font-weight: bold;');
                    
                    // STEP 1: SCORCHED EARTH - Purge all inline styles from the element left by Flip.
                    console.log(`[1] PRE-PURGE TRANSFORM: ${gsap.getProperty(actor3D, "transform")}`);
                    gsap.set(actor3D, { clearProps: "all" });
                    console.log(`[1] POST-PURGE TRANSFORM: ${gsap.getProperty(actor3D, "transform")}`);

                    // STEP 2: REBUILD - Create the new animation instance. It will temporarily
                    // sync to the wrong scroll position, which is EXPECTED.
                    console.log("[2] REBUILDING animation instance. Expect temporary visual mismatch.");
                    buildAnimationScrub(actor3D, textPillars, textCol, summaryClipper);
                    
                    const newScrub = ephemeralAnimation.scrub;
                    const newTimeline = newScrub.animation;
                    
                    // STEP 3: MANUAL OVERRIDE - We will now force the new instance into the state we desire.
                    console.log("[3] MANUAL OVERRIDE INITIATED...");
                    
                    // 3a. Calculate the target progress for our 'finalState' label.
                    const finalStateProgress = newTimeline.labels.finalState / newTimeline.duration();
                    console.log(`    - Target Progress for 'finalState': ${finalStateProgress.toFixed(4)}`);

                    // 3b. Force the timeline's progress to that state INSTANTLY.
                    console.log(`    - Current Timeline Progress: ${newTimeline.progress().toFixed(4)}`);
                    newTimeline.progress(finalStateProgress);
                    console.log(`    - FORCED Timeline Progress: ${newTimeline.progress().toFixed(4)}`);
                    
                    // 3c. VERIFY the visual state. This is the moment of truth.
                    const finalRotation = gsap.getProperty(actor3D, "rotationY");
                    console.log(`    - VERIFICATION - Rotation is now: ${finalRotation.toFixed(2)} (Should be -120)`);
                    if (Math.abs(finalRotation - -120) < 1) {
                        console.log('%c    -> ROTATION SYNC SUCCESSFUL', 'color: #A3BE8C');
                    } else {
                        console.error('%c    -> ROTATION SYNC FAILED', 'color: #BF616A');
                    }
                    
                    // 3d. Calculate the corresponding scroll position for this state.
                    const targetScrollPos = newScrub.start + (newScrub.end - newScrub.start) * finalStateProgress;
                    console.log(`    - Calculated Scroll Position for this state: ${targetScrollPos.toFixed(2)}px`);
                    
                    // STEP 4: TELEPORT VIEWPORT - Snap the user's viewport to the correct position.
                    console.log("[4] TELEPORTING viewport to match animation state.");
                    window.scrollTo({ top: targetScrollPos, behavior: 'instant' });
                    
                    // STEP 5: FINAL REFRESH - A final refresh to ensure all ScrollTrigger markers
                    // and calculations are perfectly aligned after our manual teleport.
                    console.log("[5] FINAL REFRESH of all ScrollTriggers.");
                    ScrollTrigger.refresh();

                    console.log('%cMANHATTAN PROTOCOL COMPLETE. System is pristine.', 'color: #cddc39; font-weight: bold;');
                    console.groupEnd();
                }
            });
        }
    });
}

// --- BOILERPLATE & ENTRY POINT (Unchanged) ---
function setupSiteLogic() { /* ... your menu/footer code ... */ }
function initialCheck() { /* ... the GSAP library checker ... */ }
document.addEventListener('DOMContentLoaded', () => {
    setupSiteLogic();
    initialCheck(); 
});
