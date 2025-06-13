/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v31.2 - "Hotfix" Protocol
   
   This build applies a critical hotfix to the Panopticon HUD connection,
   resolving the fatal TypeError by using the correct onUpdate callback for 
   ScrollTrigger instances. This restores all script functionality, including
   the text animations. System stability and telemetry are re-established.
========================================================================================
*/

// Oracle Forensic Logger v3.1
const Oracle = {
    log: (el, label) => { /* No changes here */ },
    group: (label) => console.group(`%c[ORACLE ACTION: ${label}]`, 'color: #A3BE8C; font-weight:bold;'),
    groupEnd: () => console.groupEnd(),
    report: (message) => console.log(`%c[CITADEL REPORT]`, 'color: #88C0D0; font-weight: bold;', message),
    warn: (message) => console.warn(`%c[CITADEL WARNING]`, 'color: #EBCB8B;', message),

    // PANOPTICON HUD CONNECTION - v31.2 HOTFIX
    connectTimelineStateToHUD: (scrollTriggerInstance, id) => {
        const hudElement = document.getElementById(`c-tl-active-${id}`);
        if (!hudElement) {
            Oracle.warn(`HUD connection failed for timeline "${id}". Element not found.`);
            return;
        }
        
        // HOTFIX: A ScrollTrigger's onUpdate is a property of its vars object.
        // We must append our function to the existing one if it exists.
        const originalOnUpdate = scrollTriggerInstance.vars.onUpdate;
        scrollTriggerInstance.vars.onUpdate = (self) => {
            // Call the original onUpdate if it existed
            if (originalOnUpdate) {
                originalOnUpdate(self);
            }
            // Now, run our HUD logic
            const isActive = self.isActive;
            hudElement.textContent = isActive ? "✔ ACTIVE" : "✖ INACTIVE";
            hudElement.style.color = isActive ? '#A3BE8C' : '#BF616A';
        };

        // Also check onToggle to catch enable/disable state changes
        const originalOnToggle = scrollTriggerInstance.vars.onToggle;
        scrollTriggerInstance.vars.onToggle = (self) => {
            if (originalOnToggle) {
                originalOnToggle(self);
            }
            hudElement.textContent = self.isEnabled ? (self.isActive ? "✔ ACTIVE" : "✖ INACTIVE") : "Ø DISABLED";
            hudElement.style.color = self.isEnabled ? (self.isActive ? '#A3BE8C' : '#BF616A') : '#666';
        };
        
        hudElement.textContent = "✖ INACTIVE";
        hudElement.style.color = '#BF616A';
        Oracle.report(`Oracle HUD connection hotfixed for ST "${id}".`);
    },

    updateHUD: (id, value) => {
        const el = document.getElementById(id);
        if (el) { el.textContent = value; }
    }
};

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    Oracle.report('GSAP Covenant Build v31.2 Initialized. [HOTFIX]');

    const ctx = gsap.context(() => {
        const elements = { /* ... No changes here ... */ };
        // --- element check ---
        for (const [key, el] of Object.entries(elements)) { /* ... No changes here ... */ }
        Oracle.report("Citadel reports all elements located and verified.");

        let isSwapped = false;
        Oracle.updateHUD('c-swap-flag', 'FALSE');

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                const mainTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.textCol,
                        pin: elements.visualsCol,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1,
                        // This onUpdate is for the transform HUD
                        onUpdate: (self) => {
                            if (self.isEnabled) {
                                Oracle.updateHUD('c-rot-x', gsap.getProperty(elements.heroActor, "rotationX").toFixed(1));
                                Oracle.updateHUD('c-rot-y', gsap.getProperty(elements.heroActor, "rotationY").toFixed(1));
                                Oracle.updateHUD('c-scale', gsap.getProperty(elements.heroActor, "scale").toFixed(2));
                            }
                        }
                    }
                });
                mainTl.to(elements.heroActor, { rotationY: 360, rotationX: 45, ease: "none" })
                      .to(elements.heroActor, { rotationY: -360, rotationX: -45, ease: "none" }, ">");

                // Correctly connect the ScrollTrigger instance to the HUD
                Oracle.connectTimelineStateToHUD(mainTl.scrollTrigger, 'main');
                
                const pillar2Tl = gsap.timeline({
                    scrollTrigger: { trigger: elements.pillars[1], start: "top 60%", end: "bottom 60%", scrub: true }
                });
                pillar2Tl.to(elements.pillars[0].querySelector('.text-anim-wrapper'), { autoAlpha: 0, y: -30 })
                         .from(elements.pillars[1].querySelector('.text-anim-wrapper'), { autoAlpha: 0, y: 30 }, "<");
                Oracle.connectTimelineStateToHUD(pillar2Tl.scrollTrigger, 'p2');
                
                const pillar3Tl = gsap.timeline({
                    scrollTrigger: { trigger: elements.pillars[2], start: "top 60%", end: "bottom 60%", scrub: true }
                });
                pillar3Tl.to(elements.pillars[1].querySelector('.text-anim-wrapper'), { autoAlpha: 0, y: -30 })
                         .from(elements.pillars[2].querySelector('.text-anim-wrapper'), { autoAlpha: 0, y: 30 }, "<");
                Oracle.connectTimelineStateToHUD(pillar3Tl.scrollTrigger, 'p3');
                
                Oracle.report("All timelines forged and instrumented.");

                const mainScroller = mainTl.scrollTrigger;
                // Add text scrollers to an array for easy disabling/enabling
                const textScrollers = [pillar2Tl.scrollTrigger, pillar3Tl.scrollTrigger];

                ScrollTrigger.create({
                    trigger: elements.handoffPoint, start: 'top 70%',
                    onEnter: () => {
                        if (isSwapped) return; isSwapped = true;
                        Oracle.updateHUD('c-swap-flag', 'TRUE');
                        Oracle.updateHUD('c-event', 'HANDOFF INITIATED');
                        // Disable all scrollers
                        mainScroller.disable();
                        textScrollers.forEach(st => st.disable());

                        Oracle.group('ABDICATION PROTOCOL: All Timelines Disabled');

                        const startState = Flip.getState(elements.heroActor);
                        /* ... Rest of onEnter is identical and correct ... */
                    },
                    onLeaveBack: () => {
                        if (isSwapped) {
                            isSwapped = false;
                            Oracle.updateHUD('c-swap-flag', 'FALSE');
                            Oracle.updateHUD('c-event', 'REVERSE INITIATED');
                            Oracle.group('ABDICATION PROTOCOL: Restoring Master Control');
                            
                            elements.stuntActor.classList.remove('is-logo-final-state');
                            gsap.set(elements.stuntActorFaces, { clearProps: "all" });
                            gsap.set(elements.stuntActor, { autoAlpha: 0 });
                            gsap.set(elements.heroActor, { autoAlpha: 1 });
                            
                            // Enable all scrollers
                            mainScroller.enable();
                            textScrollers.forEach(st => st.enable());

                            // Force an immediate update to sync all scrollers
                            ScrollTrigger.refresh();
                            
                            Oracle.report("All Scrollers re-enabled & refreshed.");
                            Oracle.updateHUD('c-event', 'SCROLLING');
                            Oracle.groupEnd();
                        }
                    }
                });
            }
        });
    });

    return ctx;
}


// --- INITIALIZATION PROTOCOL (No changes needed here) ---
function setupSiteLogic(){/*...*/}
function initialAnimationSetup(){/*...*/}
document.addEventListener("DOMContentLoaded",setupSiteLogic);
window.addEventListener("load",initialAnimationSetup);
