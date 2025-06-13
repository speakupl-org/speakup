/*

THE DEFINITIVE COVENANT BUILD v37.2 - "Sovereign" Protocol (Synchronized)

This version corrects a race condition in the initialization sequence, ensuring that
the Oracle's verbosity configuration is locked in before any telemetry scanning
begins. The initialization flow is now restructured for guaranteed order of operations.

*/

// Oracle v37.2 - The "Sovereign" Protocol with Synchronized Initialization
const Oracle = {
    // Configuration Sub-protocol
    config: {
        verbosity: 1, // Default: 1=collapsed, 2=expanded
    },
    
    // REVISED: init now accepts a callback to guarantee execution order
    init: (callback) => {
        // Set verbosity from localStorage first
        const storedVerbosity = localStorage.getItem('oracleVerbosity');
        if (storedVerbosity !== null) {
            Oracle.config.verbosity = parseInt(storedVerbosity, 10);
        }

        // Override with URL parameter if present
        const urlParams = new URLSearchParams(window.location.search);
        const urlVerbosity = urlParams.get('oracle_verbosity');
        if (urlVerbosity !== null && urlVerbosity !== '') {
            const parsedVerbosity = parseInt(urlVerbosity, 10);
            if (!isNaN(parsedVerbosity)) {
                Oracle.config.verbosity = parsedVerbosity;
            }
        }
        
        // CRITICAL: Execute the main logic ONLY after configuration is set
        if(callback && typeof callback === 'function') {
            callback();
        }
    },

    _timestamp: () => new Date().toLocaleTimeString('en-US', { hour12: false }),

    log: (el, label) => {
        if (Oracle.config.verbosity < 1) return;
        if (!el) { console.error(`%c[ORACLE LOG @ ${Oracle._timestamp()}: ${label}] ERROR - Element is null.`, 'color: #BF616A;'); return; }
        
        const groupMethod = Oracle.config.verbosity >= 2 ? console.group : console.groupCollapsed;

        groupMethod(`%c[ORACLE LOG @ ${Oracle._timestamp()}: ${label}]`, 'color: #D81B60; font-weight: bold;');
        const style = window.getComputedStyle(el);
        const transform = {
            scale: gsap.getProperty(el, "scale"),
            rotationX: gsap.getProperty(el, "rotationX"),
            rotationY: gsap.getProperty(el, "rotationY"),
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
    
    // CLEANED: Diagnostic probes removed.
    scan: (label, data) => {
        if (Oracle.config.verbosity < 1) return;
        
        const groupMethod = Oracle.config.verbosity >= 2 ? console.group : console.groupCollapsed;
        
        groupMethod(`%c[ORACLE SCAN @ ${Oracle._timestamp()}: ${label}]`, 'color: #B48EAD; font-weight: normal;');
        for (const key in data) {
            console.log(`%c  - ${key}:`, 'color: #88C0D0;', data[key]);
        }
        console.groupEnd();
    },
    
    group: (label) => {
        if (Oracle.config.verbosity < 1) return;
        console.group(`%c[ORACLE ACTION @ ${Oracle._timestamp()}: ${label}]`, 'color: #A3BE8C; font-weight: bold;');
    },
    
    groupEnd: () => {
        if (Oracle.config.verbosity < 1) return;
        console.groupEnd();
    },

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

// --- The rest of your functions are here, unmodified ---

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
        rotationY: 120, rotationX: 10, scale: 1.1, ease: "power2.inOut", duration: 2
    }).to(elements.heroActor, {
        rotationY: -120, rotationX: -20, scale: 1.2, ease: "power2.inOut", duration: 2
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
                    trigger: pillar, start: "top 80%", end: "bottom 70%", scrub: 1.5,
                    onUpdate: (self) => {
                        const progress = self.progress.toFixed(3);
                        Oracle.scan('Pillar Text Transition', {
                            'Triggering Pillar': `#${index + 1}`,
                            'ScrollTrigger Progress': `${(progress * 100).toFixed(1)}%`,
                            'Fading Out (Wrapper)': `#${index + 1}`, // This is the CURRENT pillar, which is fading out
                            ' -> Opacity': (1 - gsap.getProperty(nextWrapper, 'autoAlpha')).toFixed(2), // Its opacity is the inverse of the next one
                            ' -> Y': gsap.getProperty(wrapper, 'y').toFixed(1) + 'px',
                            ' -> RotX': gsap.getProperty(wrapper, 'rotationX').toFixed(1) + '°',
                            'Fading In (Wrapper)': `#${index + 2}`, // This is the NEXT pillar, which is fading in
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

// ENHANCED "ABSORPTION PROTOCOL" HANDOFF (v37.3 - STABILIZED)
const setupHandoff = (elements, masterTl) => {
    let isSwapped = false;
    let isReversing = false; // Lock to prevent state thrashing
    Oracle.updateHUD('c-swap-flag', 'FALSE', '#BF616A');

    // Define these variables once in the top scope of the function
    const hero = elements.heroActor;
    const stuntDouble = elements.stuntActor;
    const placeholder = elements.placeholder;
    const placeholderClipper = elements.placeholderClipper;
    const stuntActorFaces = elements.stuntActorFaces;

    ScrollTrigger.create({
        trigger: elements.handoffPoint,
        start: 'top 70%',
        onToggle: self => Oracle.updateHUD('c-handoff-st-active', self.isActive ? 'TRUE' : 'FALSE', self.isActive ? '#A3BE8C' : '#BF616A'),
        
        onEnter: () => {
            if (isSwapped || isReversing) return;
            isSwapped = true;
            
            Oracle.group('ABSORPTION PROTOCOL INITIATED');
            Oracle.updateHUD('c-swap-flag', 'TRUE', '#A3BE8C');
            Oracle.updateHUD('c-event', 'ABSORPTION');
            
            masterTl.scrollTrigger.disable();

            // --- FIX FOR ANOMALY #1: State Matching ---
            Oracle.report('Phase 1: Forcing ST update and capturing state vectors.');
            ScrollTrigger.refresh(true); // Force ScrollTrigger to render the latest scrub values

            const heroProps = {
                scale: gsap.getProperty(hero, "scale"),
                rotationX: gsap.getProperty(hero, "rotationX"),
                rotationY: gsap.getProperty(hero, "rotationY")
            };
            Oracle.log(hero, `Hero State (Pre-Absorption) | Captured RotY: ${heroProps.rotationY.toFixed(2)}`);

            const state = Flip.getState(stuntDouble, { props: "transform, opacity" });
            gsap.set(stuntDouble, {
                autoAlpha: 1,
                x: hero.getBoundingClientRect().left - placeholder.getBoundingClientRect().left,
                y: hero.getBoundingClientRect().top - placeholder.getBoundingClientRect().top,
                scale: heroProps.scale,
                rotationX: heroProps.rotationX,
                rotationY: heroProps.rotationY,
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

            absorptionTl
                .to(hero, { autoAlpha: 0, scale: '-=0.1', duration: 0.4, ease: "power2.in" }, 0)
                .to(stuntActorFaces, { opacity: 0, duration: 0.6, ease: "power2.in", stagger: 0.05 }, 0.6)
                .to(placeholderClipper, { 
                    clipPath: "inset(20% 20% 20% 20%)",
                    duration: 0.6,
                    ease: 'expo.in'
                }, 0.7)
                .to(stuntDouble, { scaleX: 1.2, scaleY: 0.8, duration: 0.4, ease: 'circ.in' }, 0.9)
                .to(placeholderClipper, {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.5)'
                }, 1.3)
                .to(stuntDouble, { scaleX: 1, scaleY: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }, 1.3);
        },

        // --- FIX FOR ANOMALY #2: State Corruption ---
        onLeaveBack: () => {
            if (!isSwapped) return;
            
            isReversing = true;
            isSwapped = false;
            
            Oracle.group('REVERSE PROTOCOL INITIATED');
            Oracle.updateHUD('c-swap-flag', 'FALSE', '#BF616A');
            Oracle.updateHUD('c-event', 'REVERSING');
            
            stuntDouble.classList.remove('is-logo-final-state');
            
            gsap.killTweensOf([stuntDouble, stuntActorFaces, hero, placeholderClipper]);

            const reversalTl = gsap.timeline({
                onComplete: () => {
                    masterTl.scrollTrigger.enable();
                    masterTl.scrollTrigger.update();
                    
                    Oracle.updateHUD('c-event', 'SCROLLING');
                    Oracle.log(hero, "Hero State (Restored)");
                    Oracle.groupEnd();
                    
                    isReversing = false;
                }
            });

            reversalTl
                .set(stuntDouble, { autoAlpha: 0 })
                .set(stuntActorFaces, { clearProps: "opacity" })
                .set(placeholderClipper, { clearProps: "clipPath" })
                .set(hero, { autoAlpha: 1 });
        }
    });
};

// REVISED Main animation setup
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    // New report confirms the final verbosity level
    Oracle.report(`Covenant Build v37.2 Initialized. Verbosity Level: ${Oracle.config.verbosity} [SOVEREIGN ONLINE]`);

    const ctx = gsap.context(() => {
        const elements = {
            heroActor: getElement('#actor-3d'),
            stuntActor: getElement('#actor-3d-stunt-double'),
            placeholder: getElement('#summary-placeholder'),
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
                        trigger: elements.textCol, pin: elements.visualsCol, start: 'top top', end: 'bottom bottom', scrub: scrubValue,
                        onToggle: self => Oracle.updateHUD('c-master-st-active', self.isActive ? 'TRUE' : 'FALSE', self.isActive ? '#A3BE8C' : '#BF616A'),
                        onUpdate: (self) => {
                            const hero = elements.heroActor;
                            const rotX = gsap.getProperty(hero, "rotationX").toFixed(1);
                            const rotY = gsap.getProperty(hero, "rotationY").toFixed(1);
                            const scale = gsap.getProperty(hero, "scale").toFixed(2);
                            const progress = (self.progress * 100).toFixed(0);
                            Oracle.scan('Live Hero Actor Scrub', {
                                'Master ScrollTrigger': `${progress}%`, 'RotX': rotX, 'RotY': rotY, 'Scale': scale
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
                setupHandoff(elements, masterTl);
            },
            '(min-width: 769px) and (max-width: 1024px)': () => {
                const masterTl = gsap.timeline({ scrollTrigger: { trigger: elements.textCol, pin: elements.visualsCol, start: 'top 10%', end: 'bottom bottom', scrub: scrubValue } });
                masterTl.to(elements.heroActor, { rotationY: 90, scale: 1, ease: "power1.inOut" });
                setupTextPillars(elements);
                setupHandoff(elements, masterTl);
            },
            '(max-width: 768px)': () => {
                const masterTl = gsap.timeline({ scrollTrigger: { trigger: elements.textCol, start: 'top 20%', end: 'bottom bottom', scrub: scrubValue } });
                masterTl.to(elements.heroActor, { scale: 0.9, ease: "none" });
                setupTextPillars(elements);
                gsap.set(elements.stuntActor, { display: 'none' });
            }
        });
    });
    return ctx;
}

// Initialization Logic
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

// REVISED initialization sequence to fix race condition
function initialAnimationSetup() {
    if (window.gsap && window.ScrollTrigger && window.Flip) {
        // Oracle.init will now call setupAnimations after it's done configuring.
        Oracle.init(setupAnimations); 
    } else {
        Oracle.warn("GSAP libraries failed to load. SOVEREIGN protocol aborted.");
    }
}

document.addEventListener("DOMContentLoaded", setupSiteLogic);
window.addEventListener("load", initialAnimationSetup);
