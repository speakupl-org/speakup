/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v33.0 - "The Pantheon" Protocol
   
   The Monolith architecture is purged. The Pantheon restores the multi-trigger
   paradigm, acknowledging that specialized systems are superior. One master timeline
   governs the 3D actor, while discrete, independent ScrollTriggers now govern
   each text transition, resolving all previous animation failures. The Oracle is
   upgraded to v3.3, with new sensors to monitor text visibility, ensuring total
   system awareness. The stable handoff protocol from v30.3.1 is restored.
========================================================================================
*/

// Oracle Forensic Logger v3.3 - "The Pantheon" Edition
const Oracle = {
    log: (el, label) => {
        if (!el) { console.error(`%c[ORACLE LOG: ${label}] ERROR - Element is null.`, 'color: #BF616A;'); return; }
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        const transform = {
            scale: gsap.getProperty(el, "scale"),
            rotationX: gsap.getProperty(el, "rotationX"),
            rotationY: gsap.getProperty(el, "rotationY")
        };
        console.log(
            `%c[ORACLE LOG: ${label}]`, 'color: #D81B60; font-weight: bold;',
            `\n  - ID: ${el.id || el.className}`,
            `\n  - Transform: { RotX: ${transform.rotationX.toFixed(1)}, RotY: ${transform.rotationY.toFixed(1)}, Scale: ${transform.scale.toFixed(2)} }`,
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
    Oracle.report('GSAP Covenant Build v33.0 Initialized. [THE PANTHEON]');

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
                Oracle.warn(`PANTHEON ABORT: Critical element "${key}" not found.`); return;
            }
        }
        Oracle.report("Pantheon components verified.");

        let isSwapped = false;

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                // --- PANTHEON DEITY 1: The 3D Actor Master ---
                const masterTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.textCol,
                        pin: elements.visualsCol,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1,
                        onUpdate: () => {
                             // This trigger is now solely responsible for the 3D actor
                            Oracle.log(elements.heroActor, "Live Hero Scrub");
                        }
                    }
                });
                masterTl.to(elements.heroActor, { rotationY: 120, rotationX: 10, scale: 1.1, ease: "none" })
                        .to(elements.heroActor, { rotationY: -120, rotationX: -20, scale: 1.2, ease: "none" });

                // --- PANTHEON DEITY 2 & 3: The Text Transition Gods ---
                elements.pillars.forEach((pillar, index) => {
                    if (index < elements.pillars.length - 1) {
                        const nextPillar = elements.pillars[index + 1];
                        gsap.timeline({
                            scrollTrigger: {
                                trigger: nextPillar,
                                start: "top 80%", // Animate when the next pillar is 80% from the top
                                end: "top 40%", // Finish when it's 40%
                                scrub: true,
                                onUpdate: (self) => {
                                    console.groupCollapsed(`Text Transition Log (Pillar ${index+1} -> ${index+2})`);
                                    Oracle.log(pillar, `Pillar ${index+1}`);
                                    Oracle.log(nextPillar, `Pillar ${index+2}`);
                                    console.groupEnd();
                                }
                            }
                        })
                        .to(pillar, { autoAlpha: 0, y: -40, ease: "power1.in" })
                        .from(nextPillar, { autoAlpha: 0, y: 40, ease: "power1.in" }, "<");
                    }
                });

                Oracle.report("Pantheon of timelines forged and telemetry online.");
                
                elements.placeholder.appendChild(elements.stuntActor);

                // --- PANTHEON DEITY 4: The Handoff Governor ---
                ScrollTrigger.create({
                    trigger: elements.handoffPoint,
                    start: 'top 70%',
                    onEnter: () => {
                        if (isSwapped) return; isSwapped = true;
                        Oracle.group('BAIT & SWITCH INITIATED');
                        
                        masterTl.scrollTrigger.disable();

                        const startState = Flip.getState(elements.heroActor);
                        Oracle.log(elements.heroActor, "1. Hero State at Handoff (Frozen)");
                        
                        const endState = Flip.getState(elements.stuntActor, { props: "transform,opacity" });
                        Oracle.log(elements.stuntActor, "2. Stunt Double Pre-Animation State");

                        Oracle.report("3. Initiating surgical FLIP animation...");
                        gsap.set(elements.stuntActor, { autoAlpha: 1 });
                        
                        Flip.from(endState, {
                            targets: elements.stuntActor,
                            duration: 1.5,
                            ease: 'power4.inOut',
                            onStart: () => gsap.set(elements.heroActor, { autoAlpha: 0 }),
                            onEnter: targets => gsap.from(targets, {
                                scale: startState.scale,
                                rotationX: startState.rotationX,
                                rotationY: startState.rotationY
                            }),
                            onComplete: () => {
                                Oracle.report("4. Handoff complete.");
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
                            Oracle.group('REVERSE HANDOFF INITIATED');
                            
                            elements.stuntActor.classList.remove('is-logo-final-state');
                            gsap.set(elements.stuntActorFaces, { clearProps: "all" });
                            gsap.set(elements.stuntActor, { autoAlpha: 0 });
                            
                            masterTl.scrollTrigger.enable();
                            masterTl.scrollTrigger.update();

                            Oracle.log(elements.stuntActor, "Stunt Double Reset & Hidden");
                            Oracle.log(elements.heroActor, "Hero Actor control returned to timeline");
                            Oracle.groupEnd();
                        }
                    }
                });
            }
        });
    });

    return ctx;
}


// --- INITIALIZATION PROTOCOL (v33.0) ---
function setupSiteLogic(){
    const e=document.getElementById("menu-open-button"),t=document.getElementById("menu-close-button"),n=document.getElementById("menu-screen"),o=document.documentElement;
    if(e && t && n){e.addEventListener("click",()=>o.classList.add("menu-open"));t.addEventListener("click",()=>o.classList.remove("menu-open"));}
    const c=document.getElementById("current-year");
    if(c)c.textContent=(new Date).getFullYear();
    Oracle.report("Site logic initialized.");
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
document.addEventListener("DOMContentLoaded",setupSiteLogic);
window.addEventListener("load",initialAnimationSetup);
