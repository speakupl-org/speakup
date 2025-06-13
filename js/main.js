/*
========================================================================================
   THE PHOENIX PROTOCOL v15.0 - Annihilate & Rebuild.
   
   This is the definitive build. It abandons all attempts to "reuse" animation
   instances. Instead, it destroys the scrollytelling system on handoff and rebuilds
   it from scratch upon return. This is the only way to guarantee a 100% clean state.
========================================================================================
*/

// --- 1. GLOBAL STATE & SETUP ---

gsap.registerPlugin(ScrollTrigger, Flip);
console.clear();
console.log('%cGSAP Phoenix Protocol v15.0 Initialized. Rebuilding from the ashes.', 'color: #E65100; font-weight: bold; font-size: 14px;');
ScrollTrigger.defaults({ markers: true });

// A global object to hold our animation instances.
// This gives us a handle to control and destroy them from anywhere.
const scrollytelling = {
    timeline: null,
    mainScrub: null
};

// --- 2. THE CORE FUNCTIONS: BUILD & KILL ---

/**
 * Builds the entire scrollytelling timeline and its master ScrollTrigger from scratch.
 * This function is the "Rise from the Ashes" part of the protocol.
 */
function buildScrollytelling(actor3D, textPillars, textCol, visualsCol, summaryClipper, scene3D) {
    // A robust guard to prevent building if it already exists.
    if (scrollytelling.mainScrub) {
        console.warn("BUILD aorted: Scrollytelling instance already exists.");
        return;
    }
    
    console.log('%cBUILD: Creating new scrollytelling instance.', 'color: #A3BE8C; font-weight: bold');
    gsap.defaults({ ease: "power1.inOut" });

    const tl = gsap.timeline();
    
    // The proven timeline logic.
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
    
    // Create the master scrub trigger with the "kill" instruction.
    const mainScrub = ScrollTrigger.create({
        trigger: textCol,
        pin: visualsCol,
        start: 'top top',
        end: 'bottom bottom',
        animation: tl,
        scrub: 0.5,
        invalidateOnRefresh: true,

        // THE ANNIHILATION: When the user scrolls past the end.
        onLeave: (self) => {
            if (self.direction < 0) return; // Only fire when scrolling down
            
            console.log("%cEVENT: onLeave -> Initiating Annihilation.", "color: #BF616A; font-weight: bold;");
            
            // Perform the handoff animation FIRST.
            const state = Flip.getState(actor3D);
            summaryClipper.appendChild(actor3D);
            Flip.from(state, {
                duration: 0.8,
                ease: 'power2.inOut',
                scale: true,
                onComplete: () => {
                    // AFTER the flip is done, kill the scroller.
                    // The page is now clean.
                    killScrollytelling();
                }
            });
        }
    });
    
    scrollytelling.timeline = tl;
    scrollytelling.mainScrub = mainScrub;
}

/**
 * Finds and completely destroys the scrollytelling instances and their listeners.
 * This is the "Return to Ash" part of the protocol.
 */
function killScrollytelling() {
    if (scrollytelling.mainScrub) {
        console.log('%cKILL: Destroying mainScrub instance.', 'color: #BF616A');
        scrollytelling.mainScrub.kill();
        scrollytelling.mainScrub = null;
    }
    if (scrollytelling.timeline) {
        console.log('%cKILL: Destroying timeline instance.', 'color: #BF616A');
        scrollytelling.timeline.kill();
        scrollytelling.timeline = null;
    }
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

    if (!visualsCol || !actor3D || !summaryContainer) {
        console.error("Phoenix Protocol Aborted: Critical elements missing.");
        return;
    }
    
    // Initial creation of the scrollytelling experience on page load.
    buildScrollytelling(actor3D, textPillars, textCol, visualsCol, summaryClipper, scene3D);

    // THE REBIRTH TRIGGER: A simple, separate trigger that ONLY watches for the return journey.
    ScrollTrigger.create({
        trigger: summaryContainer,
        start: "top bottom", // Fires as soon as summary container top enters from bottom

        onLeaveBack: () => {
            // Only fire if the scroller has been killed.
            if (scrollytelling.mainScrub) {
                console.log("Rebirth aborted: Scroller still exists.");
                return;
            }

            console.log("%cEVENT: onLeaveBack -> Initiating Rebirth.", "color: #A3BE8C; font-weight: bold;");

            const state = Flip.getState(actor3D, { props: "transform,opacity" });
            scene3D.appendChild(actor3D);
            Flip.from(state, {
                duration: 0.8,
                ease: "power2.out",
                scale: true,
                onComplete: () => {
                    console.log("-> Rebirth Flip Complete. Rebuilding scrollytelling system...");
                    // After the cube has landed, rebuild the entire animation system.
                    buildScrollytelling(actor3D, textPillars, textCol, visualsCol, summaryClipper, scene3D);
                    
                    // The new instance will automatically sync to the current scroll position.
                    // This is clean and robust.
                    console.log("-> REBUILD COMPLETE.");
                }
            });
        }
    });

    // We can also add Cerebro HUD logic here if needed, but the core logic is what matters.
}

// --- All other non-animation JS can live below ---

function setupSiteLogic() { /* ... your menu/footer code ... */ }
function initialCheck() { /* ... the GSAP library checker ... */ }

document.addEventListener('DOMContentLoaded', () => {
    // setupSiteLogic(); // Call your other setup functions
    initialCheck(); // The safety checker that calls setupAnimations
});
