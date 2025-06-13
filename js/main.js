/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v30.3 - "Synch-Lock" Protocol
   
   This build implements the Synch-Lock initialization sequence to guarantee
   all page assets are loaded and the DOM is stable before animation setup.
   This protocol eliminates layout-shift-based calculation errors and
   provides more robust error reporting for missing elements. The system
   is now architecturally sound from initialization to execution.
========================================================================================
*/

// Oracle Forensic Logger v2.0 - With live parsing from getProperty
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
    Oracle.report('GSAP Covenant Build v30.3 Initialized. [SYNCH-LOCK]');

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

        // --- SYNCH-LOCK UPGRADE: Enhanced Element Verification ---
        for (const [key, el] of Object.entries(elements)) {
            if (!el || (Array.isArray(el) && !el.length)) {
                Oracle.warn(`CITADEL ABORT: Critical element "${key}" not found in DOM.`);
                return; // Halt execution
            }
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
                        if (isSwapped) return;
                        isSwapped = false;
                        Oracle.group('AEGIS REVERSE INITIATED');
                        
                        elements.stuntActor.classList.remove('is-logo-final-state');
                        gsap.set(elements.stuntActorFaces, { opacity: 1 });
                        gsap.set(elements.stuntActor, { autoAlpha: 0 });
                        
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


// --- CITADEL v30.3 - SYNCH-LOCK INITIALIZATION PROTOCOL ---

function setupSiteLogic(){
    const e = document.getElementById("menu-open-button"),
          t = document.getElementById("menu-close-button"),
          n = document.getElementById("menu-screen"),
          o = document.documentElement;

    if(e && t && n){
        e.addEventListener("click", () => o.classList.add("menu-open"));
        t.addEventListener("click", () => o.classList.remove("menu-open"));
    }
    
    const c = document.getElementById("current-year");
    if(c) c.textContent = (new Date).getFullYear();
    
    Oracle.report("Site logic initialized.");
}

function initialAnimationSetup() {
    // We confirm the libraries are present on the window object one last time.
    if (window.gsap && window.ScrollTrigger && window.Flip) {
        setupAnimations();
        
        // Redundant but powerful: command a final recalibration after setup is complete.
        ScrollTrigger.refresh();
        Oracle.report("ScrollTrigger recalibrated to final document layout.");
    } else {
        Oracle.warn("GSAP libraries failed to load. Animations aborted.");
    }
}

// 1. Setup non-animation logic as soon as the DOM is ready.
document.addEventListener("DOMContentLoaded", setupSiteLogic);

// 2. Wait for EVERYTHING (images, fonts, etc.) to fully load before setting up complex animations.
// This prevents layout shifts from breaking ScrollTrigger's initial calculations.
window.addEventListener("load", initialAnimationSetup);
