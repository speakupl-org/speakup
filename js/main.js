/*

THE DEFINITIVE COVENANT BUILD v37.0 - "Sovereign" Protocol

This version transcends mere observation. The Oracle is now Sovereign, offering
unprecedented levels of telemetry for animation state, transitions, and element
properties. The handoff mechanism has been evolved into a multi-stage 'Absorption
Protocol' for a more sophisticated and visually compelling transition. Granularity
is the mandate. Every nanosecond is accounted for.

*/

// Oracle v37.0 - The "Sovereign" Protocol
const Oracle = {
    _timestamp: () => new Date().toLocaleTimeString('en-US', { hour12: false }),

    log: (el, label) => {
        if (!el) { console.error(`%c[ORACLE LOG @ ${Oracle._timestamp()}: ${label}] ERROR - Element is null.`, 'color: #BF616A;'); return; }
        
        console.groupCollapsed(`%c[ORACLE LOG @ ${Oracle._timestamp()}: ${label}]`, 'color: #D81B60; font-weight: bold;');
        const style = window.getComputedStyle(el);
        const transform = {
            scale: gsap.getProperty(el, "scale"),
            rotationX: gsap.getProperty(el, "rotationX"),
            rotationY: gsap.getProperty(el, "rotationY"),
            // --- FIX: Corrected typo from 'gsKy' to 'gsap' ---
            z: gsap.getProperty(el, "z")
        };
        const bounds = el.getBoundingClientRect();

        console.log(`%c  - Target:`, 'color: #81A1C1;', `${el.tagName}#${el.id || el.className}`);
        console.log(`%c  - Transform:`, 'color: #81A1C1;', `{ RotX: ${transform.rotationX.toFixed(2)}, RotY: ${transform.rotationY.toFixed(2)}, Scale: ${transform.scale.toFixed(2)}, Z: ${transform.z.toFixed(2)} }`);
        console.log(`%c  - Style:`, 'color: #81A1C1;', `{ Opacity: ${style.opacity}, Visibility: ${style.visibility} }`);
        console.log(`%c  - Geometry:`, 'color: #81A1C1;', `{ X: ${bounds.left.toFixed(1)}, Y: ${bounds.top.toFixed(1)}, W: ${bounds.width.toFixed(1)}, H: ${bounds.height.toFixed(1)} }`);
        console.log(`%c  - Scroll Pos:`, 'color: #81A1C1;', `${(window.scrollY / document.body.scrollHeight * 100).toFixed(1)}%`);
        console.groupEnd();
    },
    
    // NEW: High-frequency telemetry for continuous updates
    scan: (label, data) => {
        console.groupCollapsed(`%c[ORACLE SCAN @ ${Oracle._timestamp()}: ${label}]`, 'color: #B48EAD; font-weight: normal;');
        for (const key in data) {
            console.log(`%c  - ${key}:`, 'color: #88C0D0;', data[key]);
        }
        console.groupEnd();
    },
    
    group: (label) => console.group(`%c[ORACLE ACTION @ ${Oracle._timestamp()}: ${label}]`, 'color: #A3BE8C; font-weight: bold;'),
    groupEnd: () => console.groupEnd(),
    report: (message) => console.log(`%c[SOVEREIGN REPORT @ ${Oracle._timestamp()}]:`, 'color: #5E81AC; font-weight: bold;', message),
    warn: (message) => console.warn(`%c[SOVEREIGN WARNING @ ${Oracle._timestamp()}]:`, 'color: #EBCB8B;', message),
    
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

// Hero actor animation setup (unchanged)
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

// Text pillars animation with GRANULAR REPORTING
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
                    end: "bottom 70%", // Fine-tuned for better feel
                    scrub: 1.5,
                    onUpdate: (self) => {
                        const progress = self.progress.toFixed(3);
                        
                        // --- ENHANCED GRANULAR REPORTING ---
                        Oracle.scan('Pillar Text Transition', {
                            'Triggering Pillar': `#${index + 1}`,
                            'ScrollTrigger Progress': `${(progress * 100).toFixed(1)}%`,
                            'Fading Out (Wrapper)': `#${index + 1}`,
                            ' -> Opacity': gsap.getProperty(wrapper, 'autoAlpha').toFixed(2),
                            ' -> Y': gsap.getProperty(wrapper, 'y').toFixed(1) + 'px',
                            ' -> RotX': gsap.getProperty(wrapper, 'rotationX').toFixed(1) + '°',
                            'Fading In (Wrapper)': `#${index + 2}`,
                            ' -> Opacity': gsap.getProperty(nextWrapper, 'autoAlpha').toFixed(2),
                            ' -> Y': gsap.getProperty(nextWrapper, 'y').toFixed(1) + 'px',
                            ' -> RotX': gsap.getProperty(nextWrapper, 'rotationX').toFixed(1) + '°',
                        });

                        Oracle.updateHUD('c-active-pillar', `P${index + 1}`, '#A3BE8C');
                        Oracle.updateHUD('c-scroll-progress', `${(progress * 100).toFixed(0)}%`);
                    }
                }
            })
            .to(wrapper, { autoAlpha: 0, y: -40, rotationX: 15, ease: "power2.in" })
            .to(nextWrapper, { autoAlpha: 1, y: 0, rotationX: 0, ease: "power2.out" }, "<");
        }
    });
};

// ENHANCED "ABSORPTION PROTOCOL" HANDOFF
const setupHandoff = (elements, masterTl) => {
    let isSwapped = false;
    Oracle.updateHUD('c-swap-flag', 'FALSE', '#BF616A');

    ScrollTrigger.create({
        trigger: elements.handoffPoint,
        start: 'top 70%',
        onToggle: self => Oracle.updateHUD('c-handoff-st-active', self.isActive ? 'TRUE' : 'FALSE', self.isActive ? '#A3BE8C' : '#BF616A'),
        onEnter: () => {
            if (isSwapped) return;
            isSwapped = true;
            
            Oracle.group('ABSORPTION PROTOCOL INITIATED');
            Oracle.updateHUD('c-swap-flag', 'TRUE', '#A3BE8C');
            Oracle.updateHUD('c-event', 'ABSORPTION');
            
            Oracle.log(elements.heroActor, "Hero State (Pre-Absorption)");
            masterTl.scrollTrigger.disable();

            const stuntDouble = elements.stuntActor;
            const placeholder = elements.placeholder;
            
            // Phase 1: Pre-Positioning and State Capture
            Oracle.report('Phase 1: Capturing state vectors.');
            const state = Flip.getState(stuntDouble, { props: "transform, opacity" });
            gsap.set(stuntDouble, {
                autoAlpha: 1,
                x: elements.heroActor.getBoundingClientRect().left - placeholder.getBoundingClientRect().left,
                y: elements.heroActor.getBoundingClientRect().top - placeholder.getBoundingClientRect().top,
                scale: gsap.getProperty(elements.heroActor, "scale"),
                rotationX: gsap.getProperty(elements.heroActor, "rotationX"),
                rotationY: gsap.getProperty(elements.heroActor, "rotationY")
            });
            Oracle.log(stuntDouble, "Stunt Double State (Teleported & Matched)");
            
            // Phase 2: The Absorption Timeline
            const absorptionTl = gsap.timeline({
                onComplete: () => {
                    stuntDouble.classList.add('is-logo-final-state');
                    Oracle.updateHUD('c-event', 'STABILIZED');
                    Oracle.log(stuntDouble, "Stunt Double State (Post-Absorption)");
                    Oracle.groupEnd();
                }
            });

            Oracle.report('Phase 2: Initiating travel and absorption sequence.');

            // The main travel using Flip for a seamless position match
            absorptionTl.add(
                Flip.from(state, {
                    targets: stuntDouble,
                    duration: 1.5,
                    ease: 'power3.inOut',
                    onUpdate: function() {
                        Oracle.scan('Absorption Vector Trace', {
                            'Target': 'Stunt Double',
                            'Progress': `${(this.progress() * 100).toFixed(1)}%`,
                            'X': gsap.getProperty(stuntDouble, 'x').toFixed(1),
                            'Y': gsap.getProperty(stuntDouble, 'y').toFixed(1),
                            'Scale': gsap.getProperty(stuntDouble, 'scale').toFixed(2),
                            'RotY': gsap.getProperty(stuntDouble, 'rotationY').toFixed(1)
                        });
                    }
                })
            );

            // Simultaneous visual effects for "absorption"
            absorptionTl
                .to(elements.heroActor, { autoAlpha: 0, scale: '-=0.1', duration: 0.4, ease: "power2.in" }, 0)
                .to(elements.stuntActorFaces, { opacity: 0, duration: 0.6, ease: "power2.in", stagger: 0.05 }, 0.6)
                // The 'gulp' effect: container shrinks and expands
                .to(elements.placeholderClipper, { 
                    clipPath: "inset(20% 20% 20% 20%)",
                    duration: 0.6,
                    ease: 'expo.in'
                }, 0.7)
                // The cube 'squashes' as it enters the placeholder
                .to(stuntDouble, { scaleX: 1.2, scaleY: 0.8, duration: 0.4, ease: 'circ.in' }, 0.9)
                .to(elements.placeholderClipper, {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.5)'
                }, 1.3)
                // The cube stabilizes back to its normal shape
                .to(stuntDouble, { scaleX: 1, scaleY: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }, 1.3);

        },
        onLeaveBack: () => {
            if (!isSwapped) return;
            isSwapped = false;
            
            Oracle.group('REVERSE PROTOCOL INITIATED');
            Oracle.updateHUD('c-swap-flag', 'FALSE', '#BF616A');
            Oracle.updateHUD('c-event', 'REVERSING');
            
            elements.stuntActor.classList.remove('is-logo-final-state');
            // Use clearProps for robust state clearing
            gsap.set(elements.stuntActor, { autoAlpha: 0, clearProps: "all" });
            gsap.set(elements.stuntActorFaces, { clearProps: "opacity" });
            gsap.set(elements.heroActor, { clearProps: "autoAlpha, scale" });
            
            masterTl.scrollTrigger.enable();
            masterTl.scrollTrigger.update(); // Force immediate update
            
            Oracle.updateHUD('c-event', 'SCROLLING');
            Oracle.log(elements.heroActor, "Hero State (Restored)");
            Oracle.groupEnd();
        }
    });
};


// Main animation setup
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    Oracle.report('GSAP Covenant Build v37.0 Initialized. [SOVEREIGN PROTOCOL ONLINE]');

    const ctx = gsap.context(() => {
        const elements = {
            heroActor: getElement('#actor-3d'),
            stuntActor: getElement('#actor-3d-stunt-double'),
            placeholder: getElement('#summary-placeholder'),
            // NEW: Added a reference to the clipper for the absorption effect
            placeholderClipper: getElement('.summary-thumbnail-clipper'), 
            pillars: getElement('.pillar-text-content', true),
            textWrappers: getElement('.text-anim-wrapper', true),
            visualsCol: getElement('.pillar-visuals-col'),
            textCol: getElement('.pillar-text-col'),
            handoffPoint: getElement('#handoff-point'),
            stuntActorFaces: getElement('#actor-3d-stunt-double .face:not(.front)', true)
        };

        if (Object.values(elements).some(el => !el)) {
            Oracle.warn('SOVEREIGN ABORT: Missing critical elements.');
            return;
        }
        Oracle.report("Sovereign components verified and locked.");

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
                        onToggle: self => Oracle.updateHUD('c-master-st-active', self.isActive ? 'TRUE' : 'FALSE', self.isActive ? '#A3BE8C' : '#BF616A'),
                        onUpdate: (self) => {
                            const hero = elements.heroActor;
                            const rotX = gsap.getProperty(hero, "rotationX").toFixed(1);
                            const rotY = gsap.getProperty(hero, "rotationY").toFixed(1);
                            const scale = gsap.getProperty(hero, "scale").toFixed(2);
                            const progress = (self.progress * 100).toFixed(0);

                            // Log detailed movement scan for every frame of the scroll
                            Oracle.scan('Live Hero Actor Scrub', {
                                'Master ScrollTrigger': `${progress}%`,
                                'RotX': rotX,
                                'RotY': rotY,
                                'Scale': scale
                            });

                            Oracle.updateHUD('c-rot-x', rotX);
                            Oracle.updateHUD('c-rot-y', rotY);
                            Oracle.updateHUD('c-scale', scale);
                            Oracle.updateHUD('c-scroll', `${progress}%`);
                        }
                    }
                });

                setupHeroActor(elements, masterTl);
                setupTextPillars(elements);
                // Stunt actor is already in the placeholder via HTML, we don't need to append it.
                setupHandoff(elements, masterTl);
            },
            '(min-width: 769px) and (max-width: 1024px)': () => {
                const masterTl = gsap.timeline({ scrollTrigger: { trigger: elements.textCol, pin: elements.visualsCol, start: 'top 10%', end: 'bottom bottom', scrub: scrubValue } });
                masterTl.to(elements.heroActor, { rotationY: 90, scale: 1, ease: "power1.inOut" });
                setupTextPillars(elements);
                setupHandoff(elements, masterTl);
            },
            '(max-width: 768px)': () => {
                // Handoff is not feasible on mobile, simplify gracefully.
                const masterTl = gsap.timeline({ scrollTrigger: { trigger: elements.textCol, start: 'top 20%', end: 'bottom bottom', scrub: scrubValue } });
                masterTl.to(elements.heroActor, { scale: 0.9, ease: "none" });
                setupTextPillars(elements);
                // On mobile, the stunt double is never shown. We hide it for safety.
                gsap.set(elements.stuntActor, { display: 'none' });
            }
        });
    });

    return ctx;
}

// Initialization Logic (largely unchanged)
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
        Oracle.warn("GSAP libraries failed to load. SOVEREIGN protocol aborted.");
    }
}

document.addEventListener("DOMContentLoaded", setupSiteLogic);
window.addEventListener("load", initialAnimationSetup);
