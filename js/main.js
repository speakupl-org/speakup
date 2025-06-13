/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v36.0 - "The Overlord" Protocol Enhanced
   
   Building on v35.0, this version introduces deeper telemetry, advanced animations,
   and modular architecture. The Oracle v36.0 now tracks scroll position, active pillars,
   and more, with enhanced HUD and console reporting. Only sophistication—no shortcuts.
========================================================================================
*/

// Oracle v36.0 - The "Omni-Oracle" Enhanced
const Oracle = {
    log: (el, label) => {
        if (!el) { console.error(`%c[ORACLE LOG: ${label}] ERROR - Element is null.`, 'color: #BF616A;'); return; }
        const style = window.getComputedStyle(el);
        const transform = {
            scale: gsap.getProperty(el, "scale"),
            rotationX: gsap.getProperty(el, "rotationX"),
            rotationY: gsap.getProperty(el, "rotationY"),
            z: gsKy.getProperty(el, "z")
        };
        console.log(
            `%c[ORACLE LOG: ${label}]`, 'color: #D81B60; font-weight: bold;',
            `\n  - ID: ${el.id || el.className}`,
            `\n  - Transform: { RotX: ${transform.rotationX.toFixed(1)}, RotY: ${transform.rotationY.toFixed(1)}, Scale: ${transform.scale.toFixed(2)}, Z: ${transform.z.toFixed(1)} }`,
            `\n  - Opacity: ${style.opacity}`, `| Visibility: ${style.visibility}`,
            `\n  - Scroll: ${(window.scrollY / document.body.scrollHeight * 100).toFixed(1)}%`
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

// Text pillars animation with 3D effects
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
                    end: "+=120%",
                    scrub: 1.5,
                    onUpdate: (self) => {
                        const progress = self.progress.toFixed(2);
                        Oracle.updateHUD(`c-pillar${index+1}-opacity`, gsap.getProperty(wrapper, 'autoAlpha').toFixed(2));
                        Oracle.updateHUD(`c-pillar${index+2}-opacity`, gsap.getProperty(nextWrapper, 'autoAlpha').toFixed(2));
                        Oracle.updateHUD('c-active-pillar', `P${index + 1}`, '#A3BE8C');
                        Oracle.updateHUD('c-scroll-progress', `${(self.progress * 100).toFixed(0)}%`);
                    }
                }
            })
            .to(wrapper, { autoAlpha: 0, y: -40, rotationX: 15, ease: "power2.in" })
            .to(nextWrapper, { autoAlpha: 1, y: 0, rotationX: 0, ease: "power2.out" }, "<");
        }
    });
};

// Handoff mechanism with enhanced transition
const setupHandoff = (elements, masterTl) => {
    let isSwapped = false;
    Oracle.updateHUD('c-swap-flag', 'FALSE', '#BF616A');

    ScrollTrigger.create({
        trigger: elements.handoffPoint,
        start: 'top 70%',
        onEnter: () => {
            if (isSwapped) return;
            isSwapped = true;
            Oracle.updateHUD('c-swap-flag', 'TRUE', '#A3BE8C');
            Oracle.updateHUD('c-event', 'HANDOFF');
            Oracle.group('BAIT & SWITCH INITIATED');

            masterTl.scrollTrigger.disable();

            const startState = Flip.getState(elements.heroActor);
            const endState = Flip.getState(elements.stuntActor);
            Oracle.log(elements.heroActor, "Hero State (Pre-Swap)");

            gsap.set(elements.stuntActor, { autoAlpha: 1 });
            Flip.from(endState, {
                targets: elements.stuntActor,
                duration: 1.8,
                ease: 'power4.inOut',
                onStart: () => gsap.to(elements.heroActor, { autoAlpha: 0, scale: 0.95, duration: 0.5 }),
                onEnter: targets => gsap.from(targets, { ...startState, rotationY: '+=30' }),
                onComplete: () => {
                    elements.stuntActor.classList.add('is-logo-final-state');
                    Oracle.updateHUD('c-event', 'LANDED');
                    Oracle.groupEnd();
                }
            });
            gsap.to(elements.stuntActorFaces, { opacity: 0, duration: 0.6, ease: "power2.in", delay: 0.8 });
        },
        onLeaveBack: () => {
            if (!isSwapped) return;
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
    });
};

// Main animation setup
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    Oracle.report('GSAP Covenant Build v36.0 Initialized. [THE OVERLORD ENHANCED]');

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

        // Respect reduced motion preferences
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
                            Oracle.log(elements.heroActor, "Live Hero Scrub");
                            Oracle.updateHUD('c-rot-x', gsap.getProperty(elements.heroActor, "rotationX").toFixed(1));
                            Oracle.updateHUD('c-rot-y', gsap.getProperty(elements.heroActor, "rotationY").toFixed(1));
                            Oracle.updateHUD('c-scale', gsap.getProperty(elements.heroActor, "scale").toFixed(2));
                            Oracle.updateHUD('c-scroll', `${(self.progress * 100).toFixed(0)}%`);
                        }
                    }
                });

                setupHeroActor(elements, masterTl);
                setupTextPillars(elements);
                elements.placeholder.appendChild(elements.stuntActor);
                setupHandoff(elements, masterTl);
            },
            '(min-width: 769px) and (max-width: 1024px)': () => {
                const masterTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.textCol,
                        pin: elements.visualsCol,
                        start: 'top 10%',
                        end: 'bottom bottom',
                        scrub: scrubValue
                    }
                });
                masterTl.to(elements.heroActor, { rotationY: 90, scale: 1, ease: "power1.inOut" });
                setupTextPillars(elements);
                elements.placeholder.appendChild(elements.stuntActor);
                setupHandoff(elements, masterTl);
            },
            '(max-width: 768px)': () => {
                const masterTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.textCol,
                        start: 'top 20%',
                        end: 'bottom bottom',
                        scrub: scrubValue
                    }
                });
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
