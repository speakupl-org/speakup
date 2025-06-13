/*
========================================================================================
   THE UNBREAKABLE VOW v16.0 - Permanent Pinner, Ephemeral Animation.
   
   This is the definitive build. It solves the final layout-shift bug.
   
   Core Principles:
   1. The Permanent Pinner: A simple, animation-less ScrollTrigger's ONLY job is
      to pin the visuals column, providing a stable layout foundation that never dies.
   2. The Phoenix Animation: A *separate* ScrollTrigger controls the animation. It is
      annihilated on handoff and rebuilt from scratch on return, ensuring a clean state.
   3. Two Simple, Non-Conflicting Triggers: One for the handoff, one for the return.
      They cannot conflict because the animation trigger destroys itself.
========================================================================================
*/

// --- 1. GLOBAL STATE & SETUP ---

gsap.registerPlugin(ScrollTrigger, Flip);
console.clear();
console.log('%cGSAP Unbreakable Vow v16.0 Initialized. The final architecture.', 'color: #0077c2; font-weight: bold; font-size: 14px;');
ScrollTrigger.defaults({ markers: true });

// A global object to hold only the animation instance that needs to be killed.
const ephemeralAnimation = {
    scrub: null,
};

// --- 2. THE CORE FUNCTIONS ---

/**
 * Builds ONLY the animation-scrubbing ScrollTrigger. The pinner is separate and permanent.
 */
function buildAnimationScrub(actor3D, textPillars, textCol, summaryClipper) {
    if (ephemeralAnimation.scrub) return; // Guard against multiple instances
    
    console.log('%cBUILD: Creating new animation instance.', 'color: #A3BE8C; font-weight: bold');
    gsap.defaults({ ease: "none" }); // Use "none" for purest scrub control

    const tl = gsap.timeline();
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
            console.log("%cEVENT: onLeave -> Handoff & Annihilation.", "color: #BF616A; font-weight: bold;");
            
            const state = Flip.getState(actor3D);
            summaryClipper.appendChild(actor3D);
            Flip.from(state, {
                duration: 0.8, ease: 'power2.inOut', scale: true,
                onComplete: () => {
                    console.log('%cKILL: Destroying animation scrub instance.', 'color: #BF616A');
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
        console.error("Vow Aborted: Critical elements missing.");
        return;
    }

    // --- THE PERMANENT PINNER ---
    // This trigger's ONLY job is to pin the visuals column. It has no animation.
    // It is created once and never destroyed, providing a stable layout.
    ScrollTrigger.create({
        trigger: textCol,
        pin: visualsCol,
        start: 'top top',
        end: 'bottom bottom',
        // No animation, no scrub. Just pinning.
    });
    
    // Initial build of the animation scroller.
    buildAnimationScrub(actor3D, textPillars, textCol, summaryClipper);

    // --- THE RECREATION TRIGGER ---
    // This simple trigger's ONLY job is to listen for the return journey.
    ScrollTrigger.create({
        trigger: summaryContainer,
        start: "top bottom", // As soon as it enters the viewport from the bottom

        onLeaveBack: () => {
            // Only fire if the animation has been killed.
            if (ephemeralAnimation.scrub) return;

            console.log("%cEVENT: onLeaveBack -> Rebirth.", "color: #A3BE8C; font-weight: bold;");

            const state = Flip.getState(actor3D, { props: "transform,opacity" });
            scene3D.appendChild(actor3D);
            Flip.from(state, {
                duration: 0.8, ease: "power2.out", scale: true,
                onComplete: () => {
                    console.log("-> Rebirth Flip Complete. Rebuilding animation...");
                    // Rebuild the animation system from scratch.
                    buildAnimationScrub(actor3D, textPillars, textCol, summaryClipper);
                    
                    // Force the new ScrollTrigger to read the page and snap to the correct progress.
                    ScrollTrigger.refresh();
                }
            });
        }
    });
}

// --- BOILERPLATE & ENTRY POINT (Unchanged) ---
function setupSiteLogic() {
    const openButton = document.getElementById('menu-open-button');
    const closeButton = document.getElementById('menu-close-button');
    const menuScreen = document.getElementById('menu-screen');
    const htmlElement = document.documentElement;
    const body = document.body;

    if (openButton && closeButton && menuScreen) {
        openButton.addEventListener('click', () => {
            htmlElement.classList.add('menu-open');
            body.classList.add('menu-open');
        });
        closeButton.addEventListener('click', () => {
            htmlElement.classList.remove('menu-open');
            body.classList.remove('menu-open');
        });
    }
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

function initialCheck() {
    if (window.gsap && window.ScrollTrigger && window.Flip) {
        setupAnimations();
    } else {
        let i = 0, max = 30, t = setInterval(() => {
            i++;
            if (window.gsap && window.ScrollTrigger && window.Flip) {
                clearInterval(t); setupAnimations();
            } else if (i >= max) {
                clearInterval(t); console.error("CRITICAL ERROR: GSAP load fail");
            }
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupSiteLogic();
    initialCheck(); 
});
