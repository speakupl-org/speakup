/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v36.4 - "The Overlord" Protocol Enhanced
   
   Build v36.4 rectifies a tactical error in telemetry throttling. A new, specialized
   'telemetry' channel is established for high-frequency data, ensuring a continuous,
   unbroken stream of observation without sacrificing clarity. The system now achieves
   both flawless state management and absolute observational fidelity.
========================================================================================
*/

// Oracle v36.4 - The "Continuum Oracle" Enhanced
const Oracle = {
    log: (el, label) => { // For discrete, important events
        if (!el) {
            console.error(`%c[ORACLE LOG: ${label}]%c ERROR - Target element is null. Observation aborted.`, 'color: #D81B60; font-weight: bold;', 'color: #BF616A;');
            return;
        }
        const style = window.getComputedStyle(el);
        const transform = {
            scale: gsap.getProperty(el, "scale"),
            rotationX: gsap.getProperty(el, "rotationX"),
            rotationY: gsap.getProperty(el, "rotationY"),
            z: gsap.getProperty(el, "z")
        };
        console.log(
            `%c[ORACLE LOG: ${label}]`, 'color: #D81B60; font-weight: bold;',
            `\n  - Target: ${el.tagName}#${el.id || '(no id)'}.${el.className.split(' ').join('.')}`,
            `\n  - Transform: { RotX: ${transform.rotationX.toFixed(1)}, RotY: ${transform.rotationY.toFixed(1)}, Scale: ${transform.scale.toFixed(2)}, Z: ${transform.z.toFixed(1)} }`,
            `\n  - Style: { Opacity: ${gsap.getProperty(el, "autoAlpha").toFixed(2)}, Visibility: ${style.visibility} }`
        );
    },
    // --- NEW: Specialized channel for high-frequency updates ---
    telemetry: (el, label, st) => { // For continuous data streams like onUpdate
         const transform = {
            scale: gsap.getProperty(el, "scale"),
            rotationX: gsap.getProperty(el, "rotationX"),
            rotationY: gsap.getProperty(el, "rotationY"),
        };
        console.log(
            `%c[ORACLE TELEMETRY: ${label} @ ${(st.progress * 100).toFixed(1)}%]`, 'color: #5E81AC;',
            `{ RotX: ${transform.rotationX.toFixed(1)}, RotY: ${transform.rotationY.toFixed(1)}, Scale: ${transform.scale.toFixed(2)} }`
        );
    },
    group: (label) => console.group(`%c[ORACLE ACTION: ${label}]`, 'color: #A3BE8C; font-weight: bold;'),
    groupEnd: () => console.groupEnd(),
    report: (message) => console.log(`%c[CITADEL REPORT]`, 'color: #88C0D0; font-weight: bold;', message),
    warn: (message) => console.warn(`%c[CITADEL WARNING]`, 'color: #EBCB8B;', message),
    updateHUD: (id, value, color = '#E5E9F0') => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
            el.style.color = color;
        }
    }
};


// Utility to safely get elements
const getElement = (selector, isArray = false) => {
    try {
        const result = isArray ? gsap.utils.toArray(selector) : document.querySelector(selector);
        if (!result || (isArray && !result.length)) throw new Error(`Element(s) not found: ${selector}`);
        return result;
    } catch (e) {
        Oracle.warn(e.message);
        return null;
    }
};

// Hero actor animation setup
const setupHeroActor = (elements, masterTl) => {
    masterTl.to(elements.heroActor, {
        rotationY: 120,
        rotationX: 10,
        scale: 1.1,
        ease: "power2.inOut",
        duration: 2
    }).to(elements.heroActor, {
        rotationY: -120,
        rotationX: -20,
        scale: 1.2,
        ease: "power2.inOut",
        duration: 2
    });
};

// Text pillars animation with hyper-granular telemetry
const setupTextPillars = (elements) => {
    elements.pillars.forEach((pillar, index) => {
        const wrapper = elements.textWrappers[index];
        if (index > 0) gsap.set(wrapper, { autoAlpha: 0, y: 40, rotationX: -15 });

        if (index < elements.pillars.length - 1) {
            const nextWrapper = elements.textWrappers[index + 1];
            gsap.timeline({
                scrollTrigger: {
                    trigger: pillar,
                    start: "top 80%",
                    end: "top 30%",
                    scrub: 1.5,
                    onEnter: () => {
                        Oracle.group(`PILLAR ${index + 1} <> ${index + 2} TRANSITION SEQUENCE`);
                        Oracle.log(wrapper, `Pillar ${index + 1} State (Start)`);
                        Oracle.log(nextWrapper, `Pillar ${index + 2} State (Start)`);
                        Oracle.groupEnd();
                    },
                    onLeave: () => Oracle.report(`Pillar ${index + 1}>${index+2} sequence complete.`),
                    onUpdate: (self) => {
                        Oracle.updateHUD(`c-pillar${index+1}-opacity`, gsap.getProperty(wrapper, 'autoAlpha').toFixed(2));
                        Oracle.updateHUD(`c-pillar${index+2}-opacity`, gsap.getProperty(nextWrapper, 'autoAlpha').toFixed(2));
                        Oracle.updateHUD('c-active-pillar', `P${index + 1} > P${index + 2}`, '#A3BE8C');
                        Oracle.updateHUD('c-scroll-progress', `${(self.progress * 100).toFixed(0)}%`);
                    }
                }
            })
            .to(wrapper, { autoAlpha: 0, y: -40, rotationX: 15, ease: "power2.in" })
            .to(nextWrapper, { autoAlpha: 1, y: 0, rotationX: 0, ease: "power2.out" }, "<");
        }
    });
};

// Re-architected Handoff mechanism with forensic logging and state-aware reset
const setupHandoff = (elements, masterTl) => {
    const handoffTl = gsap.timeline({
        paused: true,
        onStart: () => {
            Oracle.group('BAIT & SWITCH: INITIATED');
            masterTl.scrollTrigger.disable(false); // a soft disable
            Oracle.log(elements.heroActor, "Hero State (Pre-Swap)");
            Oracle.updateHUD('c-swap-flag', 'ACTIVE', '#A3BE8C');
            Oracle.updateHUD('c-event', 'HANDOFF');
        },
        onComplete: () => {
            Oracle.log(elements.stuntActor, "Stunt Double State (Post-Swap)");
            Oracle.updateHUD('c-event', 'LANDED');
            Oracle.groupEnd();
        },
        onReverseStart: () => {
            Oracle.group('BAIT & SWITCH: REVERSING');
            Oracle.log(elements.stuntActor, "Stunt Double State (Pre-Reverse)");
            masterTl.scrollTrigger.disable(false); // ensure it stays disabled during reversal
            Oracle.updateHUD('c-event', 'REVERSING');
        },
        onReverseComplete: () => {
            Oracle.report('SYSTEM RESET: Reverting all actors to initial state.');
            elements.stuntActor.classList.remove('is-logo-final-state');
            gsap.set(elements.heroActor, { autoAlpha: 1 });
            gsap.set(elements.stuntActor, { autoAlpha: 0 });
            gsap.set(elements.stuntActorFaces, { clearProps: "opacity" });
            
            Oracle.log(elements.heroActor, "Hero State (Post-Reverse / RESET)");
            Oracle.log(elements.stuntActor, "Stunt Double State (Post-Reverse / RESET)");
            
            masterTl.scrollTrigger.enable();
            Oracle.updateHUD('c-swap-flag', 'INACTIVE', '#BF616A');
            Oracle.updateHUD('c-event', 'SCROLLING');
            Oracle.groupEnd();
        }
    });

    handoffTl.add(() => {
        const state = Flip.getState(elements.heroActor, { props: "x,y,scale,rotationX,rotationY" });
        gsap.set(elements.stuntActor, { autoAlpha: 1 });
        elements.stuntActor.classList.add('is-logo-final-state');
        
        Oracle.log(elements.stuntActor, "Stunt Double (Pre-Flip)");
        
        Flip.from(state, {
            targets: elements.stuntActor,
            duration: 1.2,
            ease: 'power3.inOut',
        });
        
        gsap.to(elements.heroActor, { autoAlpha: 0, duration: 0.3 });
    }).to(elements.stuntActorFaces, { opacity: 0, duration: 0.5, ease: "power2.in" }, 0.5);

    ScrollTrigger.create({
        trigger: elements.handoffPoint,
        start: 'top 70%',
        toggleActions: "play none none reverse",
        animation: handoffTl,
    });
};


// Main animation setup
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    Oracle.report('GSAP Covenant Build v36.4 Initialized. [THE OVERLORD ENHANCED]');

    const ctx = gsap.context(() => {
        const elements = {
            heroActor: getElement('#actor-3d'),
            stuntActor: getElement('#actor-3d-stunt-double'),
            placeholder: getElement('#summary-placeholder'),
            pillars: getElement('.pillar-text-content', true),
            textWrappers: getElement('.text-anim-wrapper', true),
            visualsCol: getElement('.pillar-visuals-col'),
            textCol: getElement('.pillar-text-col'),
            handoffPoint: getElement('#handoff-point'),
            stuntActorFaces: getElement('#actor-3d-stunt-double .face:not(.front)', true)
        };

        if (Object.values(elements).some(el => !el)) {
            Oracle.warn('OVERLORD ABORT: Missing critical elements.');
            return;
        }
        Oracle.report("Overlord components verified.");

        elements.placeholder.appendChild(elements.stuntActor);
        gsap.set(elements.stuntActor, { autoAlpha: 0 });

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const scrubValue = prefersReducedMotion ? false : 1.5;

        ScrollTrigger.matchMedia({
            '(min-width: 1025px)': () => {
                const masterTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.textCol,
                        pin: elements.visualsCol,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: scrubValue,
                        onUpdate: (self) => {
                            // --- CONTINUOUS TELEMETRY REINSTATED & ENHANCED ---
                            if (gsap.getProperty(elements.heroActor, "autoAlpha") > 0) {
                                Oracle.telemetry(elements.heroActor, "Live Hero Scrub", self);
                            }
                            Oracle.updateHUD('c-rot-x', gsap.getProperty(elements.heroActor, "rotationX").toFixed(1));
                            Oracle.updateHUD('c-rot-y', gsap.getProperty(elements.heroActor, "rotationY").toFixed(1));
                            Oracle.updateHUD('c-scale', gsap.getProperty(elements.heroActor, "scale").toFixed(2));
                            Oracle.updateHUD('c-scroll', `${(self.progress * 100).toFixed(0)}%`);
                        }
                    }
                });

                setupHeroActor(elements, masterTl);
                setupTextPillars(elements);
                setupHandoff(elements, masterTl);
            },
            '(min-width: 769px) and (max-width: 1024px)': () => {
                const masterTl = gsap.timeline({ scrollTrigger: { trigger: elements.textCol, pin: elements.visualsCol, start: 'top 10%', end: 'bottom bottom', scrub: scrubValue }});
                masterTl.to(elements.heroActor, { rotationY: 90, scale: 1, ease: "power1.inOut" });
                setupTextPillars(elements);
                setupHandoff(elements, masterTl);
            },
            '(max-width: 768px)': () => {
                const masterTl = gsap.timeline({ scrollTrigger: { trigger: elements.textCol, start: 'top 20%', end: 'bottom bottom', scrub: scrubValue }});
                masterTl.to(elements.heroActor, { scale: 0.9, ease: "none" });
                setupTextPillars(elements);
            }
        });
    });

    return ctx;
}

// Initialization
function setupSiteLogic() {
    const menuOpen = getElement('#menu-open-button');
    const menuClose = getElement('#menu-close-button');
    const menuScreen = getElement('#menu-screen');
    const root = document.documentElement;

    if (menuOpen && menuClose && menuScreen) {
        menuOpen.addEventListener('click', () => root.classList.add('menu-open'));
        menuClose.addEventListener('click', () => root.classList.remove('menu-open'));
    }

    const yearEl = getElement('#current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    Oracle.report("Site logic initialized.");
}

function initialAnimationSetup() {
    if (window.gsap && window.ScrollTrigger && window.Flip) {
        setupAnimations();
    } else {
        Oracle.warn("GSAP libraries failed to load. Animations aborted.");
    }
}

document.addEventListener("DOMContentLoaded", setupSiteLogic);
window.addEventListener("load", initialAnimationSetup);
