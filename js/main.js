/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v36.2 - "The Overlord" Protocol Enhanced
   
   Build v36.2 addresses a critical logic conflict in the handoff protocol by
   implementing a fully synchronized timeline. Telemetry is now deeper, tracking
   the discrete lifecycle of pillar animations. The result is superior stability and
   flawless operational awareness. All systems are refined for absolute sophistication.
========================================================================================
*/

// Oracle v36.2 - The "Omni-Oracle" Enhanced
const Oracle = {
    log: (el, label) => {
        if (!el) {
            console.error(`%c[ORACLE LOG: ${label}]%c ERROR - Target element is null or undefined. Observation aborted.`, 'color: #D81B60; font-weight: bold;', 'color: #BF616A;');
            return;
        }
        const style = window.getComputedStyle(el);
        const transform = {
            scale: gsap.getProperty(el, "scale"),
            rotationX: gsap.getProperty(el, "rotationX"),
            rotationY: gsap.getProperty(el, "rotationY"),
            z: gsap.getProperty(el, "z")
        };
        const box = el.getBoundingClientRect();
        console.log(
            `%c[ORACLE LOG: ${label}]`, 'color: #D81B60; font-weight: bold;',
            `\n  - Target: ${el.tagName}#${el.id || '(no id)'}.${el.className.split(' ').join('.')}`,
            `\n  - Transform: { RotX: ${transform.rotationX.toFixed(1)}, RotY: ${transform.rotationY.toFixed(1)}, Scale: ${transform.scale.toFixed(2)}, Z: ${transform.z.toFixed(1)} }`,
            `\n  - Style: { Opacity: ${style.opacity}, Visibility: ${style.visibility} }`,
            `\n  - Viewport Rect: { Top: ${box.top.toFixed(0)}, Left: ${box.left.toFixed(0)}, W: ${box.width.toFixed(0)}, H: ${box.height.toFixed(0)} }`,
            `\n  - Scroll Context: ${(window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100).toFixed(1)}%`
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

// Text pillars animation with ENHANCED 3D effects and telemetry
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
                    end: "top 30%", // Make the transition quicker
                    scrub: 1.5,
                    onEnter: () => Oracle.report(`Pillar ${index + 1} transition entering viewport.`),
                    onLeave: () => Oracle.report(`Pillar ${index + 1} transition complete.`),
                    onEnterBack: () => Oracle.report(`Pillar ${index + 1} transition re-entering viewport (reverse).`),
                    onLeaveBack: () => Oracle.report(`Pillar ${index + 1} reverse transition complete.`),
                    onUpdate: (self) => {
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

// --- REFACTOR: Handoff mechanism re-architected to a synchronized timeline ---
const setupHandoff = (elements, masterTl) => {
    // This timeline will hold the entire handoff animation. It starts paused.
    const handoffTl = gsap.timeline({
        paused: true,
        onStart: () => {
             Oracle.group('BAIT & SWITCH INITIATED');
             Oracle.updateHUD('c-swap-flag', 'TRUE', '#A3BE8C');
             Oracle.updateHUD('c-event', 'HANDOFF');
        },
        onReverseComplete: () => {
             Oracle.group('REVERSE HANDOFF COMPLETE');
             Oracle.updateHUD('c-swap-flag', 'FALSE', '#BF616A');
             Oracle.updateHUD('c-event', 'SCROLLING');
             Oracle.groupEnd();
        },
        onComplete: () => {
            Oracle.log(elements.stuntActor, "Stunt Double State (Post-Swap)");
            Oracle.updateHUD('c-event', 'LANDED');
            Oracle.groupEnd();
        }
    });

    // We define the animation sequence once.
    handoffTl
        .add(() => {
            // Disable the main scroller to prevent conflicts during the animation.
            masterTl.scrollTrigger.disable();
            Oracle.log(elements.heroActor, "Hero State (Pre-Swap)");
            const state = Flip.getState(elements.heroActor);
            
            gsap.set(elements.stuntActor, { autoAlpha: 1 });
            elements.stuntActor.classList.add('is-logo-final-state');
            
            Flip.from(state, {
                targets: elements.stuntActor,
                duration: 1.2,
                ease: 'power3.inOut',
                // Explicitly define what properties to flip for performance
                props: "x,y,scale,rotationX,rotationY",
                onStart: () => {
                    gsap.to(elements.heroActor, { autoAlpha: 0, duration: 0.3 });
                },
                onComplete: () => {
                    // Re-enable the main scroller after the animation is fully done.
                    masterTl.scrollTrigger.enable();
                }
            });
        })
        .to(elements.stuntActorFaces, { opacity: 0, duration: 0.5, ease: "power2.in" }, "-=0.7");

    // A single, simple ScrollTrigger to control the timeline.
    ScrollTrigger.create({
        trigger: elements.handoffPoint,
        start: 'top 70%',
        // Plays the timeline on enter, reverses it on leave back. No more chatter.
        toggleActions: "play none none reverse",
        animation: handoffTl
    });
};


// Main animation setup
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    Oracle.report('GSAP Covenant Build v36.2 Initialized. [THE OVERLORD ENHANCED]');

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

        // Move stunt double into placeholder at the start
        elements.placeholder.appendChild(elements.stuntActor);
        gsap.set(elements.stuntActor, { autoAlpha: 0 }); // Ensure it starts hidden

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
                            // Only log if the hero is visible to reduce console noise
                            if (gsap.getProperty(elements.heroActor, "autoAlpha") > 0) {
                                Oracle.log(elements.heroActor, "Live Hero Scrub");
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
                setupHandoff(elements, masterTl); // Pass masterTl for enable/disable control
            },
            // ... (other breakpoints remain the same)
            '(min-width: 769px) and (max-width: 1024px)': () => {
                // ... logic as before ...
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
                setupHandoff(elements, masterTl);
            },
            '(max-width: 768px)': () => {
                // ... logic as before ...
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

// Initialization (no changes here)
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
