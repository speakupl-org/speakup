/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v32.1 - "Contextual Integrity" Protocol
   
   This build corrects a critical flaw in the Monolith v32.0 implementation
   by restoring the GSAP Context's persistence. The previous version failed
   to return the context, causing immediate garbage collection of all animations
   and a total loss of telemetry and motion. This version ensures the Monolith
   timeline persists and executes as designed.
========================================================================================
*/

// Oracle v3.2 - Streamlined for Monolith architecture
const Oracle = {
    report: (message) => console.log(`%c[CITADEL REPORT]`, 'color: #88C0D0; font-weight: bold;', message),
    warn: (message) => console.warn(`%c[CITADEL WARNING]`, 'color: #EBCB8B;', message),
    updateHUD: (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }
};

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    Oracle.report('GSAP Covenant Build v32.1 Initialized. [CONTEXTUAL INTEGRITY]');

    // CONTEXTUAL INTEGRITY FIX: The 'ctx' variable MUST be returned by this function
    // to prevent GSAP from immediately cleaning up all the animations inside it.
    const ctx = gsap.context(() => {
        const elements = {
            heroActor: document.getElementById('actor-3d'),
            stuntActor: document.getElementById('actor-3d-stunt-double'),
            placeholder: document.getElementById('summary-placeholder'),
            pillars: gsap.utils.toArray('.pillar-text-content'),
            textWrappers: gsap.utils.toArray('.text-anim-wrapper'),
            visualsCol: document.querySelector('.pillar-visuals-col'),
            textCol: document.querySelector('.pillar-text-col'),
            stuntActorFaces: gsap.utils.toArray('#actor-3d-stunt-double .face:not(.front)')
        };

        for (const [key, el] of Object.entries(elements)) {
            if (!el || (Array.isArray(el) && !el.length)) {
                Oracle.warn(`MONOLITH ABORT: Critical element "${key}" not found.`);
                return;
            }
        }
        Oracle.report("Monolith components verified.");
        
        elements.placeholder.appendChild(elements.stuntActor);
        gsap.set(elements.stuntActor, {
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'
        });

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.textCol,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1.2,
                        pin: elements.visualsCol,
                        onUpdate: (self) => {
                            Oracle.updateHUD('c-rot-x', gsap.getProperty(elements.heroActor, "rotationX").toFixed(1));
                            Oracle.updateHUD('c-rot-y', gsap.getProperty(elements.heroActor, "rotationY").toFixed(1));
                            Oracle.updateHUD('c-scale', gsap.getProperty(elements.heroActor, "scale").toFixed(2));
                            Oracle.updateHUD('c-tl-progress', self.progress.toFixed(3));
                        },
                        // Ensure the HUD updates to LANDED if the user scrolls past the end
                        onLeave: () => Oracle.updateHUD('c-event', 'LANDED'),
                        onEnterBack: () => Oracle.updateHUD('c-event', 'SCROLLING')
                    }
                });

                tl.from(elements.textWrappers[0], { autoAlpha: 0, y: 30 })
                  .to(elements.heroActor, { rotationY: 180, rotationX: 20, scale: 1.1, ease: "power1.inOut" }, "<")
                  
                  .to(elements.textWrappers[0], { autoAlpha: 0, y: -30 })
                  .from(elements.textWrappers[1], { autoAlpha: 0, y: 30 }, "<")
                  .to(elements.heroActor, { rotationY: -180, rotationX: -20, scale: 1.2, ease: "power1.inOut" }, "<")

                  .to(elements.textWrappers[1], { autoAlpha: 0, y: -30 })
                  .from(elements.textWrappers[2], { autoAlpha: 0, y: 30 }, "<");

                const endState = Flip.getState(elements.stuntActor, { props: "opacity,transform" });

                tl.set(elements.stuntActor, {
                    rotationX: () => gsap.getProperty(elements.heroActor, "rotationX"),
                    rotationY: () => gsap.getProperty(elements.heroActor, "rotationY"),
                    scale: () => gsap.getProperty(elements.heroActor, "scale"),
                    autoAlpha: 1
                }, "handoff")
                .set(elements.heroActor, { autoAlpha: 0 }, "handoff");
                
                tl.add(Flip.from(endState, {
                    targets: elements.stuntActor,
                    duration: tl.duration() * 0.2,
                    ease: "power2.inOut",
                    onComplete: () => elements.stuntActor.classList.add('is-logo-final-state'),
                    onReverseComplete: () => elements.stuntActor.classList.remove('is-logo-final-state')
                }), "handoff");

                tl.to(elements.stuntActorFaces, {
                    opacity: 0,
                    duration: tl.duration() * 0.1,
                    ease: "power1.in"
                }, "handoff+=0.05");

                Oracle.report("Monolith timeline forged. All systems unified.");
                // Set initial HUD state
                Oracle.updateHUD('c-rot-x', '0.0');
                Oracle.updateHUD('c-rot-y', '0.0');
                Oracle.updateHUD('c-scale', '1.00');
            }
        });
    });

    // CONTEXTUAL INTEGRITY FIX: This return statement is CRITICAL.
    return ctx;
}

// --- INITIALIZATION PROTOCOL v32.1 ---
function setupSiteLogic(){
    const e=document.getElementById("menu-open-button"),t=document.getElementById("menu-close-button"),n=document.getElementById("menu-screen"),o=document.documentElement;
    if(e && t && n){
        e.addEventListener("click",()=>o.classList.add("menu-open"));
        t.addEventListener("click",()=>o.classList.remove("menu-open"));
    }
    const c=document.getElementById("current-year");
    if(c)c.textContent=(new Date).getFullYear();
    Oracle.report("Site logic initialized.");
}

function initialAnimationSetup() {
    if (window.gsap && window.ScrollTrigger && window.Flip) {
        setupAnimations();
        // This is no longer necessary with the Monolith, but harmless as a failsafe
        ScrollTrigger.refresh();
        Oracle.report("ScrollTrigger recalibrated to final document layout.");
    } else {
        Oracle.warn("GSAP libraries failed to load. Animations aborted.");
    }
}
document.addEventListener("DOMContentLoaded", setupSiteLogic);
window.addEventListener("load", initialAnimationSetup);
