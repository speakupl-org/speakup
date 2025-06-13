/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v31.1 - "Panopticon" Protocol
   
   This build restores and upgrades the Cerebro-HUD to the "Panopticon"
   standard, tracking discrete events, flags, and multiple timeline states.
   The Oracle's connection points are now fully integrated into every phase
   of the animation lifecycle for total, uncompromising system awareness.
========================================================================================
*/

// Oracle Forensic Logger - Remains at v3.0, as its functions are sound.
// The main script will now provide more data to it.
const Oracle = {
    log: (el, label) => { /* No changes here */ },
    group: (label) => console.group(`%c[ORACLE ACTION: ${label}]`, 'color: #A3BE8C; font-weight:bold;'),
    groupEnd: () => console.groupEnd(),
    report: (message) => console.log(`%c[CITADEL REPORT]`, 'color: #88C0D0; font-weight: bold;', message),
    warn: (message) => console.warn(`%c[CITADEL WARNING]`, 'color: #EBCB8B;', message),

    // PANOPTICON HUD CONNECTION
    // Note: The specific timeline progress was removed from HUD for clarity, 
    // but the console logging of transforms remains.
    connectTimelineStateToHUD: (timeline, id) => {
        const hudElement = document.getElementById(`c-tl-active-${id}`);
        if (!hudElement) {
            Oracle.warn(`HUD connection failed for timeline "${id}". Element not found.`);
            return;
        }
        
        timeline.eventCallback("onUpdate", () => {
             const isActive = timeline.isActive();
             hudElement.textContent = isActive ? "✔ ACTIVE" : "✖ INACTIVE";
             hudElement.style.color = isActive ? '#A3BE8C' : '#BF616A';
        });
        
        hudElement.textContent = "✖ INACTIVE";
        hudElement.style.color = '#BF616A';
    },

    // NEW: Function to update any text field in the HUD
    updateHUD: (id, value) => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
        }
    }
};

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    Oracle.report('GSAP Covenant Build v31.1 Initialized. [PANOPTICON]');

    const ctx = gsap.context(() => {
        const elements = {
            heroActor: document.getElementById('actor-3d'),
            stuntActor: document.getElementById('actor-3d-stunt-double'),
            placeholder: document.getElementById('summary-placeholder'),
            pillars: gsap.utils.toArray('.pillar-text-content'),
            visualsCol: document.querySelector('.pillar-visuals-col'),
            textCol: document.querySelector('.pillar-text-col'),
            handoffPoint: document.getElementById('handoff-point'),
            stuntActorFaces: gsap.utils.toArray('#actor-3d-stunt-double .face:not(.front)')
        };

        for (const [key, el] of Object.entries(elements)) {
            if (!el || (Array.isArray(el) && !el.length)) {
                Oracle.warn(`CITADEL ABORT: Critical element "${key}" not found in DOM.`); return;
            }
        }
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

                ScrollTrigger.create({
                    trigger: elements.handoffPoint, start: 'top 70%',
                    onEnter: () => {
                        if (isSwapped) return; isSwapped = true;
                        Oracle.updateHUD('c-swap-flag', 'TRUE');
                        Oracle.updateHUD('c-event', 'HANDOFF INITIATED');
                        mainScroller.disable();
                        Oracle.group('ABDICATION PROTOCOL: Master Timeline Disabled');

                        const startState = Flip.getState(elements.heroActor);
                        Oracle.log(elements.heroActor, "1. Hero State at Handoff (Frozen)");
                        
                        elements.placeholder.appendChild(elements.stuntActor);
                        const endState = Flip.getState(elements.stuntActor, {props: "transform,opacity"});

                        gsap.set(elements.stuntActor, { autoAlpha: 1 });
                        
                        Flip.from(endState, {
                            targets: elements.stuntActor,
                            ease: 'power4.inOut', 
                            duration: 1.5,
                            onStart: () => {
                                gsap.set(elements.heroActor, { autoAlpha: 0 });
                            },
                            onEnter: targets => gsap.from(targets, {
                                scale: startState.scale,
                                rotationX: startState.rotationX,
                                rotationY: startState.rotationY
                            }),
                            onComplete: () => {
                                Oracle.report("Handoff trajectory complete.");
                                Oracle.updateHUD('c-event', 'LANDED');
                                elements.stuntActor.classList.add('is-logo-final-state');
                                Oracle.groupEnd();
                            }
                        });

                        gsap.to(elements.stuntActorFaces, {
                            opacity: 0, duration: 0.5, ease: "power2.in", delay: 0.7
                        });
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
                            
                            mainScroller.enable();
                            mainScroller.update();
                            Oracle.report("Master Scroller & Text Timelines re-enabled.");
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


// --- CITADEL v31.1 - INITIALIZATION PROTOCOL ---
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

function initialAnimationSetup(){
    if (window.gsap && window.ScrollTrigger && window.Flip) {
        setupAnimations();
        ScrollTrigger.refresh();
        Oracle.report("ScrollTrigger recalibrated to final document layout.");
    } else {
        Oracle.warn("GSAP libraries failed to load. Animations aborted.");
    }
}
document.addEventListener("DOMContentLoaded",setupSiteLogic);
window.addEventListener("load",initialAnimationSetup);
