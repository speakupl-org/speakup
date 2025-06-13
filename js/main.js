/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v32.0 - "The Monolith" Protocol
   
   All previous protocols are obsolete. The "Monolith" rebuilds the animation
   logic on the principle of a SINGLE, UNIFIED TIMELINE controlling all scrollytelling
   elements. The concepts of disabling/enabling triggers, killing tweens, and
   multiple competing timelines have been purged. The system is now a single,
eamless, and structurally pure state machine driven only by the scrollbar.
   This is the final, definitive form.
========================================================================================
*/

// Oracle v3.2 - Streamlined for Monolith architecture
const Oracle = {
    group: (label) => console.group(`%c[ORACLE ACTION: ${label}]`, 'color: #A3BE8C; font-weight:bold;'),
    groupEnd: () => console.groupEnd(),
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
    Oracle.report('GSAP Covenant Build v32.0 Initialized. [THE MONOLITH]');

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
        
        // Prepare for FLIP by putting stunt double in its final resting place
        elements.placeholder.appendChild(elements.stuntActor);
        gsap.set(elements.stuntActor, {
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'
        });

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                
                // --- THE MONOLITH TIMELINE ---
                // One timeline to rule them all. It lasts the entire height of the text column.
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.textCol,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1.2,
                        pin: elements.visualsCol,
                        onUpdate: (self) => {
                             // HUD Live transform data
                            Oracle.updateHUD('c-rot-x', gsap.getProperty(elements.heroActor, "rotationX").toFixed(1));
                            Oracle.updateHUD('c-rot-y', gsap.getProperty(elements.heroActor, "rotationY").toFixed(1));
                            Oracle.updateHUD('c-scale', gsap.getProperty(elements.heroActor, "scale").toFixed(2));
                            Oracle.updateHUD('c-tl-progress', self.progress.toFixed(3));
                        }
                    }
                });

                // --- STAGE 1: Animate through Pillar 1 & 2 ---
                tl.from(elements.textWrappers[0], { autoAlpha: 0, y: 30 })
                  .to(elements.heroActor, { rotationY: 180, rotationX: 20, scale: 1.1, ease: "power1.inOut" }, "<")
                  
                  .to(elements.textWrappers[0], { autoAlpha: 0, y: -30 })
                  .from(elements.textWrappers[1], { autoAlpha: 0, y: 30 }, "<")
                  .to(elements.heroActor, { rotationY: -180, rotationX: -20, scale: 1.2, ease: "power1.inOut" }, "<")

                  .to(elements.textWrappers[1], { autoAlpha: 0, y: -30 })
                  .from(elements.textWrappers[2], { autoAlpha: 0, y: 30 }, "<");

                // --- STAGE 2: The Final Handoff - Integrated into the Monolith ---
                
                // Get the final state of the stunt double IN the placeholder
                const endState = Flip.getState(elements.stuntActor, { props: "opacity,transform" });

                // Set the stunt double to MATCH the hero actor at this point in the timeline
                tl.set(elements.stuntActor, {
                    // Match hero's current transform state
                    rotationX: () => gsap.getProperty(elements.heroActor, "rotationX"),
                    rotationY: () => gsap.getProperty(elements.heroActor, "rotationY"),
                    scale: () => gsap.getProperty(elements.heroActor, "scale"),
                    autoAlpha: 1 // Make it visible
                }, "handoff")
                .set(elements.heroActor, { autoAlpha: 0 }, "handoff"); // Hide the original hero
                
                // Add the Flip animation directly into the master timeline
                tl.add(Flip.from(endState, {
                    targets: elements.stuntActor,
                    duration: tl.duration() * 0.2, // Duration is a percentage of the timeline
                    ease: "power2.inOut",
                    onComplete: () => { // On MONOLITH completion, set final state
                         elements.stuntActor.classList.add('is-logo-final-state');
                         Oracle.updateHUD('c-event', 'LANDED');
                    },
                    onReverseComplete: () => { // On MONOLITH reversal, remove final state
                        elements.stuntActor.classList.remove('is-logo-final-state');
                        Oracle.updateHUD('c-event', 'SCROLLING');
                    }
                }), "handoff");

                // Integrate the face-fade into the Monolith
                tl.to(elements.stuntActorFaces, {
                    opacity: 0,
                    duration: tl.duration() * 0.1,
                    ease: "power1.in"
                }, "handoff+=0.05");

                Oracle.report("Monolith timeline forged. All systems unified.");
            }
        });
    });

    return ctx;
}


// --- HTML & INITIALIZATION ---
// You will need to slightly adjust your HUD HTML for the new Panopticon v32
/*
<!-- ======================= CEREBRO ORACLE HUD v32.0 "MONOLITH" ======================= -->
<div id="cerebro-hud">
    <h4>CEREBRO-HUD v32.0 [MONOLITH]</h4>
    <div><span class="label">EVENT:</span><span id="c-event">SCROLLING</span></div>
    <div class="divider"></div>
    <div class="label" style="text-align:center;">- Monolith Progress -</div>
    <div><span class="label">Timeline:</span><span id="c-tl-progress">0.000</span></div>
    <div class="divider"></div>
    <div class="label" style="text-align:center;">- Live Transform (Hero) -</div>
    <div><span class="label">Rot X:</span><span id="c-rot-x">--</span></div>
    <div><span class="label">Rot Y:</span><span id="c-rot-y">--</span></div>
    <div><span class="label">Scale:</span><span id="c-scale">--</span></div>
</div>
<!-- ====================================================================================== -->
*/

// --- Initialization Protocol v32.0 ---
function setupSiteLogic() {
    // ... No changes here. Your existing function is fine.
}

function initialAnimationSetup() {
    if (window.gsap && window.ScrollTrigger && window.Flip) {
        setupAnimations();
        ScrollTrigger.refresh();
        Oracle.report("ScrollTrigger recalibrated to final document layout.");
    } else {
        Oracle.warn("GSAP libraries failed to load. Animations aborted.");
    }
}
document.addEventListener("DOMContentLoaded", setupSiteLogic);
window.addEventListener("load", initialAnimationSetup);
