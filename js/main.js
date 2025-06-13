/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v35.0 - "The Overlord" Protocol
   
   All subsequent and prior protocols are superseded. The "Overlord" restores
   and perfects the v33.0 "Pantheon" multi-trigger architecture. The Oracle is
   upgraded to v35.0, providing unprecedented console AND HUD telemetry for
   every critical system, including granular text visibility. The text animation
   and handoff logic have been reinforced and perfected. This is the final and
   most advanced form. We only go higher from here.
========================================================================================
*/

// Oracle v35.0 - The "Omni-Oracle"
const Oracle = {
    // RESTORED: Full, verbose console logger
    log: (el, label) => {
        if (!el) { console.error(`%c[ORACLE LOG: ${label}] ERROR - Element is null.`, 'color: #BF616A;'); return; }
        const style = window.getComputedStyle(el);
        const transform = {
            scale: gsap.getProperty(el, "scale"),
            rotationX: gsap.getProperty(el, "rotationX"),
            rotationY: gsap.getProperty(el, "rotationY"),
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
    warn: (message) => console.warn(`%c[CITADEL WARNING]`, 'color: #EBCB8B;', message),

    // NEW: Function to update any text field in the HUD
    updateHUD: (id, value, color = '#E5E9F0') => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
            el.style.color = color;
        }
    }
};

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    Oracle.report('GSAP Covenant Build v35.0 Initialized. [THE OVERLORD]');

    const ctx = gsap.context(() => {
        const elements = {
            heroActor: document.getElementById('actor-3d'),
            stuntActor: document.getElementById('actor-3d-stunt-double'),
            placeholder: document.getElementById('summary-placeholder'),
            pillars: gsap.utils.toArray('.pillar-text-content'),
            textWrappers: gsap.utils.toArray('.text-anim-wrapper'),
            visualsCol: document.querySelector('.pillar-visuals-col'),
            textCol: document.querySelector('.pillar-text-col'),
            handoffPoint: document.getElementById('handoff-point'),
            stuntActorFaces: gsap.utils.toArray('#actor-3d-stunt-double .face:not(.front)')
        };

        for (const [key, el] of Object.entries(elements)) {
            if (!el || (Array.isArray(el) && !el.length)) {
                Oracle.warn(`OVERLORD ABORT: Critical element "${key}" not found.`); return;
            }
        }
        Oracle.report("Overlord components verified.");

        let isSwapped = false;
        Oracle.updateHUD('c-swap-flag', 'FALSE', '#BF616A');

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                
                // --- OVERLORD SYSTEM 1: The 3D Actor ---
                const masterTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.textCol, pin: elements.visualsCol,
                        start: 'top top', end: 'bottom bottom', scrub: 1,
                        onUpdate: () => {
                            Oracle.log(elements.heroActor, "Live Hero Scrub");
                            Oracle.updateHUD('c-rot-x', gsap.getProperty(elements.heroActor, "rotationX").toFixed(1));
                            Oracle.updateHUD('c-rot-y', gsap.getProperty(elements.heroActor, "rotationY").toFixed(1));
                            Oracle.updateHUD('c-scale', gsap.getProperty(elements.heroActor, "scale").toFixed(2));
                        }
                    }
                });
                masterTl.to(elements.heroActor, { rotationY: 120, rotationX: 10, scale: 1.1, ease: "none" })
                        .to(elements.heroActor, { rotationY: -120, rotationX: -20, scale: 1.2, ease: "none" });

                // --- OVERLORD SYSTEM 2: The Text Pillars ---
                elements.pillars.forEach((pillar, index) => {
                    const pillarWrapper = elements.textWrappers[index];
                    if (index > 0) { // All pillars except the first start invisible
                        gsap.set(pillarWrapper, { autoAlpha: 0, y: 40 });
                    }

                    if (index < elements.pillars.length - 1) {
                        const nextPillarWrapper = elements.textWrappers[index + 1];
                        gsap.timeline({
                            scrollTrigger: {
                                trigger: pillar,
                                start: "center center", // Trigger at the center of the pillar
                                end: "+=100%", // Animate over the full height of the pillar
                                scrub: true,
                                onUpdate: () => {
                                    // Live HUD updates for each text pillar's opacity
                                    Oracle.updateHUD(`c-pillar${index+1}-opacity`, gsap.getProperty(pillarWrapper, 'alpha').toFixed(2));
                                    Oracle.updateHUD(`c-pillar${index+2}-opacity`, gsap.getProperty(nextPillarWrapper, 'alpha').toFixed(2));
                                }
                            }
                        })
                        .to(pillarWrapper, { autoAlpha: 0, y: -40, ease: "power1.in" })
                        .to(nextPillarWrapper, { autoAlpha: 1, y: 0, ease: "power1.out" }, "<");
                    }
                });
                
                Oracle.report("Overlord animation systems forged and telemetry online.");
                
                elements.placeholder.appendChild(elements.stuntActor);

                // --- OVERLORD SYSTEM 3: The Handoff Governor ---
                ScrollTrigger.create({
                    trigger: elements.handoffPoint, start: 'top 70%',
                    onEnter: () => {
                        if (isSwapped) return; isSwapped = true;
                        Oracle.updateHUD('c-swap-flag', 'TRUE', '#A3BE8C');
                        Oracle.updateHUD('c-event', 'HANDOFF');
                        Oracle.group('BAIT & SWITCH INITIATED');
                        
                        masterTl.scrollTrigger.disable();

                        const startState = Flip.getState(elements.heroActor);
                        const endState = Flip.getState(elements.stuntActor);
                        Oracle.log(elements.heroActor, "1. Hero State (Frozen)");

                        gsap.set(elements.stuntActor, { autoAlpha: 1 });
                        Flip.from(endState, {
                            targets: elements.stuntActor,
                            duration: 1.5, ease: 'power4.inOut',
                            onStart: () => gsap.set(elements.heroActor, { autoAlpha: 0 }),
                            onEnter: targets => gsap.from(targets, { ...startState }),
                            onComplete: () => {
                                elements.stuntActor.classList.add('is-logo-final-state');
                                Oracle.updateHUD('c-event', 'LANDED');
                                Oracle.groupEnd();
                            }
                        });
                        gsap.to(elements.stuntActorFaces, { opacity: 0, duration: 0.5, ease: "power2.in", delay: 0.7 });
                    },
                    onLeaveBack: () => {
                        if (isSwapped) {
                            isSwapped = false;
                            Oracle.updateHUD('c-swap-flag', 'FALSE', '#BF616A');
                            Oracle.updateHUD('c-event', 'REVERSING');
                            Oracle.group('REVERSE HANDOFF INITIATED');
                            
                            elements.stuntActor.classList.remove('is-logo-final-state');
                            gsap.set(elements.stuntActorFaces, { clearProps: "all" });
                            gsap.set(elements.stuntActor, { autoAlpha: 0 });
                            
                            masterTl.scrollTrigger.enable();
                            masterTl.scrollTrigger.update();
                            
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


// --- HTML & INITIALIZATION PROTOCOL ---
// You will need to update your HUD for the Overlord's advanced telemetry
/*
<!-- ======================= CEREBRO ORACLE HUD v35.0 "OVERLORD" ======================= -->
<div id="cerebro-hud">
    <h4>CEREBRO-HUD v35.0 [OVERLORD]</h4>
    <div><span class="label">EVENT:</span><span id="c-event">AWAITING</span></div>
    <div><span class="label">SWAP FLAG:</span><span id="c-swap-flag">FALSE</span></div>
    <div class="divider"></div>
    <div class="label" style="text-align:center;">- Live Transform (Hero) -</div>
    <div><span class="label">Rot X:</span><span id="c-rot-x">--</span></div>
    <div><span class="label">Rot Y:</span><span id="c-rot-y">--</span></div>
    <div><span class="label">Scale:</span><span id="c-scale">--</span></div>
    <div class="divider"></div>
    <div class="label" style="text-align:center;">- Live Pillar Opacity -</div>
    <div><span class="label">Pillar 1:</span><span id="c-pillar1-opacity">1.00</span></div>
    <div><span class="label">Pillar 2:</span><span id="c-pillar2-opacity">0.00</span></div>
    <div><span class="label">Pillar 3:</span><span id="c-pillar3-opacity">0.00</span></div>
</div>
<!-- ====================================================================================== -->
*/


// --- INITIALIZATION (v35.0) ---
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
    } else {
        Oracle.warn("GSAP libraries failed to load. Animations aborted.");
    }
}
document.addEventListener("DOMContentLoaded",setupSiteLogic);
window.addEventListener("load",initialAnimationSetup);
