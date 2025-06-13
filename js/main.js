/*
========================================================================================
   THE TOTAL CONTROL BUILD v14.0 - OneScrollTrigger.defaults({ markers: true });

// A global object to hold our animation instances.
// This gives Master, One Timeline, Zero Conflicts.
   
   This is the definitive, stable build. It abandons the us a handle to control and destroy them from anywhere.
const scrollytelling = {
    timeline: null,
     secondary "handoff trigger"
   and empowers the main scroller to control the entire animation lifecycle.
   
mainScrub: null
};

// --- 2. THE CORE FUNCTIONS: INIT & KILL ---

/**
 * Builds   Core Principles:
   1. One Master Controller: The mainScrub ScrollTrigger now exclusively uses its
      own the entire scrollytelling timeline and its master ScrollTrigger from scratch.
 * This is our "creation" function.
 `onLeave` and `onEnterBack` events to orchestrate the handoff.
   2. No External */
function initScrollytelling(actor3D, textPillars, textCol, visualsCol) {
 Triggers: The #handoff-point div is REMOVED from the HTML.
   3. The Proven    console.log('%cINIT: Building new scrollytelling instance.', 'color: #A3BE8C');
 Rebirth Protocol: The core resynchronization logic remains our
      trusted method for the return journey, triggered at the perfect moment.    
    // Smoothness upgrade: Tighter scrub and a smoother default ease.
    gsap.defaults({
   4. The Transition Lock: The `isTransitioning` variable is more crucial than
      ever to prevent ease: "power1.inOut" });

    const tl = gsap.timeline();
    
    // The race conditions during the Flip animations.
========================================================================================
*/

/**
 * Main function to initialize all complex animations on the page.
 */
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger timeline definition remains the same proven logic.
    tl.to(actor3D, { rotationY: 20, rotationX: -15, scale: 1.0, duration: 1 })
      .to(, Flip);
    console.clear();
    console.log('%cGSAP Total Control Build v14.textPillars[0], { autoAlpha: 1, duration: 0.5 }, "<")
0 Initialized. One Master to rule them all.', 'color: #88C0D0; font-    .to(textPillars[0], { autoAlpha: 0, duration: 0.5weight: bold; font-size: 14px;');
    ScrollTrigger.defaults({ markers: true });

    const ctx = gsap.context(() => {
        // --- 1. ELEMENT SELECTION ---
         }, "+=1.5")
      .to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.1, duration: 1 }, "<")
      const visualsCol = document.querySelector('.pillar-visuals-col');
        const scene3D = document.querySelector('.scene-3d');
        const textCol = document.querySelector('.pillar-text-col');
.to(textPillars[1], { autoAlpha: 1, duration: 0.5 }, "<")
    .to(textPillars[1], { autoAlpha: 0, duration: 0.5 }, "+=1.5")
      .to(actor3D, { rotationY: -        const actor3D = document.getElementById('actor-3d');
        const textPillars = gsap.utils.toArray('.pillar-text-content');
        const summaryClipper = document.querySelector('.summary-thumbnail-clipper');

        if (!visualsCol || !scene3D || !textCol || !actor120, rotationX: -20, scale: 1.2, duration: 1 }, "<")
      .to(textPillars[2], { autoAlpha: 1, duration: 0.5 }, "<")
      .addLabel("finalState")
    .to(textPillars[2], { autoAlpha: 0, duration: 0.5 }, "+=1.5")
      3D || !summaryClipper) {
            console.error('TOTAL CONTROL ABORTED: One or more critical elements are missing.');
            return;
        }

        // --- Cerebro HUD (Unchanged but essential) ---
        const cState = document.getElementById('c-state'), cEvent = document.getElementById('c-event'),
              cTlProg = document.getElementById('c-tl-prog'), cScrubProg =.to(actor3D, { rotationY: 0, rotationX: 0, scale: 1.0, duration: 1 }, "<");
    
    // Create the master scrub trigger.
    const mainScrub = ScrollTrigger.create({
        trigger: textCol,
        pin: visualsCol,
        start: document.getElementById('c-scrub-prog'),
              cRotY = document.getElementById('c-roty'), cRotYTarget = document.getElementById('c-roty-target'),
              cTextAlpha = document.getElementById('c-text-alpha');

        let isFlipped = false;
        let isTransitioning = false; // Our essential safety lock.
        if(cState) cState.textContent = "Standby";

 'top top',
        end: 'bottom bottom',
        animation: tl,
        scrub: 0.2, // Smoothness upgrade: much more responsive
        invalidateOnRefresh: true,
    });
    
    // Store the new instances in our global state object.
    scrollytelling.timeline = tl;
    sc        // --- 2. THE MEDIA QUERY SCOPE ---
        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                if(cState) cState.textContent = "In Scroller";

                // --- 3. THE PERFECTED TIMELINE ---
                const pillarDelay = 1rollytelling.mainScrub = mainScrub;
}

/**
 * Finds and completely destroys the scrollytelling instances and their listeners.
 * This is our "annihilation" function.
 */
function killScrollytelling() {
    if (scrollytelling.mainScrub) {
        console.log('%cKILL:.25; // Easy-to-tweak value for storytelling pace
                const tl = gsap.timeline({ paused: true });
                const states = { p3: { rotationY: -120, rotationX: -2 Destroying mainScrub instance.', 'color: #BF616A');
        scrollytelling.mainScrub.kill();
        scrollytelling.mainScrub = null;
    }
    0, scale: 1.2 } };
                if(cRotYTarget) cRotYTarget.textContent = `${states.p3.rotationY}`;
                gsap.set(textPillars, { autoAlpha: 0 });
                
                tl.to(actor3D, { rotationY: 2if (scrollytelling.timeline) {
        console.log('%cKILL: Destroying timeline instance.', 'color: #BF616A');
        scrollytelling.timeline.kill();
        scrollytelling.timeline = null;
    }
}


// --- 3. THE MAIN SETUP FUNCTION ---

function0, rotationX: -15, scale: 1.0, duration: 1 })
                  .to(textPillars[0], { autoAlpha: 1, duration: 0.5 }, "<")
                .to(textPillars[0], { autoAlpha: 0, duration: 0 setupPage() {
    // Select all elements once.
    const visualsCol = document.querySelector('.pillar-visuals-col');
    const scene3D = document.querySelector('.scene-3d');
    const textCol = document.querySelector('.pillar-text-col');
    const actor3D = document.getElementById('.5 }, `+=${pillarDelay}`)
                  .to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.1, duration: 1 }, "<")
                  .to(textPillars[1], { autoAlpha: 1, duration: 0.5actor-3d');
    const textPillars = gsap.utils.toArray('.pillar-text-content');
    const summaryContainer = document.querySelector('.method-summary');
    const summaryClipper = document.querySelector('.summary-thumbnail-clipper');
    const handoffPoint = document.getElementById('handoff-point }, "<")
                .to(textPillars[1], { autoAlpha: 0, duration: 0.5 }, `+=${pillarDelay}`)
                  .to(actor3D, states.p3, { duration: 1 }, "<")
                  .to(textPillars[2], { autoAlpha: 1, duration: 0.5 }, "<")
                  .addLabel("finalState")
                ');

    if (!visualsCol || !actor3D || !summaryContainer || !handoffPoint) {
        console.error("Nuclear Winter Aborted: Critical elements missing.");
        return;
    }
    
    gsap.set(textPillars, { autoAlpha: 0 });

    // Initial creation of the sc.to(textPillars[2], { autoAlpha: 0, duration: 0.5 }, `+=${pillarDelay}`)
                  .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1.0, duration: 1 }, "<");

                // --- 4rollytelling experience.
    initScrollytelling(actor3D, textPillars, textCol, visualsCol);

    // --- THE SEPARATE & NON-CONFLICTING TRIGGERS ---

    //. THE ONE MASTER CONTROLLER ---
                const mainScrub = ScrollTrigger.create({
                    trigger: textCol,
                    pin: visualsCol,
                    start: 'top top',
                    end: 'bottom bottom',
                    animation: tl,
                    scrub: 0.8,
                    invalidateOnRefresh: true,

 TRIGGER A: The Executioner. Watches the end of the pillars.
    ScrollTrigger.create({
        trigger: handoffPoint,
        start: "top center",
        onEnter: () => {
            console.                    // THE HANDOFF: When the user scrolls past the end of the pillar section.
                    onLeave: (self) => {
                        if (self.direction < 0 || isFlipped || isTransitioning) returngroup("EVENT: Executioner Trigger (onEnter)");
            killScrollytelling();
            const state = Flip.getState(actor3D, {props: "transform,opacity"});
            summaryClipper.appendChild(actor3; // Only fire when scrolling down
                        isTransitioning = true;
                        isFlipped = true;
                        if(D);
            Flip.from(state, {
                duration: 1.0,
                ease: "power2.inOut",
                scale: true
            });
            console.groupEnd();
        cState) cState.textContent = "FLIPPED"; if(cEvent) cEvent.textContent = "onLeave";
                        console.log("%cEVENT: onLeave (Handoff to Summary)", "color: #A}
    });

    // TRIGGER B: The Creator. Watches the summary section itself.
    ScrollTrigger.create({
        trigger: summaryContainer,
        start: "top bottom", // Fires as soon as the summary section top3BE8C; font-weight: bold;");
                        
                        // Temporarily disable the scroller so it doesn't fight the Flip animation.
                        self.disable();

                        const state = Flip.getState( touches the bottom of the viewport
        onLeaveBack: () => {
            console.group("EVENT: Creator Triggeractor3D);
                        summaryClipper.appendChild(actor3D);
                        Flip.from(state, {
                             (onLeaveBack)");
            const state = Flip.getState(actor3D, {props: "transform,opacity"});
            scene3D.appendChild(actor3D);
            Flip.from(state, {
duration: 0.8, ease: 'power2.inOut', scale: true,
                            onComplete: () => {
                                isTransitioning = false;
                                // We leave the scrub disabled while it's in the                duration: 1.0,
                ease: "power2.out",
                scale: true,
                onComplete: () => {
                    console.log("-> Creator Flip Complete. Rebuilding scrollytelling system summary section.
                            }
                        });
                    },

                    // THE RETURN: When the user scrolls back into.");
                    // After the cube has landed, rebuild the entire animation system.
                    gsap.set(actor3D, the pillar section.
                    onEnterBack: (self) => {
                        if (!isFlipped || isTransitioning) { clearProps: "all" });
                    initScrollytelling(actor3D, textPillars return; // Only fire if it's flipped
                        isTransitioning = true;
                        if(cState) cState.textContent = "REBIRTHING..."; if(cEvent) cEvent.textContent = "onEnterBack";
, textCol, visualsCol);

                    // Force the new ScrollTrigger to read the page and snap to the correct progress                        console.log("%cEVENT: onEnterBack (Return to Scroller)", "color: #EBCB8B.
                    ScrollTrigger.refresh();
                    
                    // Teleport the user to the correct scroll position to match the re; font-weight: bold;");

                        const state = Flip.getState(actor3D, { props: "transform,opacity" });
                        scene3D.appendChild(actor3D);
                        Flip.from(state, {-created animation state.
                    const finalStateProgress = scrollytelling.timeline.labels.finalState / scrollytelling.timeline.duration();
                    const targetScrollPos = scrollytelling.mainScrub
                            duration: 0.8, ease: 'power2.out', scale: true,
                            onComplete: () => {
                                // THE PROVEN REBIRTH PROTOCOL
                                // This sequence is GOLD. It guarantees a.start + (scrollytelling.mainScrub.end - scrollytelling.mainScrub.start) * finalStateProgress;
                    window.scrollTo({ top: targetScrollPos, behavior: 'instant' perfect reset.
                                console.group('%cREBIRTH PROTOCOL v14.0 INITIATED', 'color });
                    
                    console.log("-> REBUILD COMPLETE.");
                    console.groupEnd();
                }
            });
        }
    });

    // Standard site logic
    setupSiteLogic();
}

: #D81B60; font-weight:bold;');
                                
                                console.log("1. INVALIDATING TIMELINE.");
                                tl.invalidate();
                                
                                const finalStateProgress = tl.labels./**
 * Sets up basic site functionality like menu toggles and footer year.
 */
function setupSiteLogic() {
    const openButton = document.getElementById('menu-open-button');
    const closeButton = document.finalState / tl.duration();
                                console.log(`2. SETTING TIMELINE PROGRESS to ${finalStateProgress.toFixed(4)}.`);
                                tl.progress(finalStateProgress).pause();
                                
                                // WegetElementById('menu-close-button');
    const menuScreen = document.getElementById('menu-screen');
    const htmlElement = document.documentElement;
    const body = document.body;

    if (openButton && snap the scroll position to the end of the scroller MINUS a tiny bit,
                                // to ensure we are firmly closeButton && menuScreen) {
        openButton.addEventListener('click', () => {
            htmlElement. "inside" the onEnterBack zone.
                                const targetScroll = self.end - 1;
                               classList.add('menu-open');
            body.classList.add('menu-open');
        });
        closeButton.addEventListener('click', () => {
            htmlElement.classList.remove('menu-open'); console.log(`3. TELEPORTING BROWSER to scroll position: ${targetScroll.toFixed(2)}px.`);
                                window.scrollTo({ top: targetScroll, behavior: 'instant' });
                                
                                console.log("4
            body.classList.remove('menu-open');
        });
    }

    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new. REFRESHING ALL TRIGGERS.");
                                ScrollTrigger.refresh(true);
                                
                                console.log("5. GOING LIVE - Re-enabling the main scrub.");
                                self.enable();
                                 Date().getFullYear();
    }
}


// --- PRIMARY ENTRY POINT ---
document.addEventListener('DOMContentLoaded', setup
                                isFlipped = false;
                                isTransitioning = false;
                                if(cState) cState.textContent = "In Scroller (Reborn)";
                                console.log("%cREBIRTH COMPLETE. System integrity restored.", 'font-weight: bold;');
                                console.groupEnd();
                            }
                        });
                    }
                });

                // --- Cerebro HUD Update Logic ---
                gsap.ticker.add(() => {
                    if (!cState || cState.textContent === "Standby") return;
                    cTlProg.textContent = tl.progress().toFixed(4);
                    cScrubProg.textContent = mainScrub.progress.toFixed(4);
                    cRotY.textContent = gsap.getProperty(actor3D, "rotationY").toFixed(2);
                    cTextAlpha.textContent = gsap.getProperty(textPillars[2], "autoAlpha").toFixed(2);
                });
            }
        });
    });
    return () => { ctx.revert(); };
}


/**
 * Sets up basic site functionality like menu toggles and footer year.
 */
function setupSiteLogic() {
    const openButton = document.getElementById('menu-open-button');
    const closeButton = document.getElementById('menu-close-button');
    const menuScreen = document.getElementById('Page);
