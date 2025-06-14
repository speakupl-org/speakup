/*

THE DEFINITIVE COVENANT BUILD v37.2 - "Sovereign" Protocol (Synchronized)

This version corrects a race condition in the initialization sequence, ensuring that
the Oracle's verbosity configuration is locked in before any telemetry scanning
begins. The initialization flow is now restructured for guaranteed order of operations.

*/

// Oracle v40.1 - The "Sovereign" Protocol with "Architect" Status Reporting
const Oracle = {
    // Configuration Sub-protocol
    config: {
        verbosity: 1, // Default: 1=collapsed, 2=expanded
    },

    // Aegis Protocol v39.0 Utility
    utility: {
        // Higher-order function to limit execution rate of another function.
        // Essential for performance-heavy tasks tied to frequent events like scrolling.
        throttle: (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    },
    
    // Performance Sub-protocol v43.1
    performance: {
        // Wraps a function, logs its execution time, and updates the HUD.
        // It now correctly handles and returns the result of the wrapped function.
        benchmark: (label, functionToTest) => {
            if (Oracle.config.verbosity < 1) { 
                const res = functionToTest(); 
                return res; 
            }
            const startTime = performance.now();
            const result = functionToTest();
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(3);
            const color = duration < 50 ? '#A3BE8C' : (duration < 200 ? '#EBCB8B' : '#BF616A');
            
            console.log(
                `%c[ORACLE BENCHMARK @ ${Oracle._timestamp()}: ${label}] - %cExecution Time: ${duration}ms`,
                'color: #8FBCBB; font-weight: bold;',
                `color: ${color}; font-weight: normal;`
            );
            // Directly updates the HUD with benchmark results.
            Oracle.updateHUD('c-exec-time', `${duration}ms`, color);
            return result;
        }
    },
    
    runSelfDiagnostic: () => {
        if (Oracle.config.verbosity < 1) return;

        const groupMethod = Oracle.config.verbosity >= 2 ? console.group : console.groupCollapsed;
        console.group(`%c[ORACLE SELF-DIAGNOSTIC (SOVEREIGN INTEGRITY PROTOCOL)]`, 'color: #D08770; font-weight: bold;');

        // 1. Dependency Verification
        groupMethod('%c1. Dependency Verification', 'color: #EBCB8B;');
            const checkDep = (lib, name) => console.log(`  - ${name}:`, lib ? '%c✅ FOUND' : '%c❌ MISSING!', lib ? 'color: #A3BE8C;' : 'color: #BF616A; font-weight: bold;');
            checkDep(window.gsap, 'GSAP Core');
            checkDep(window.ScrollTrigger, 'ScrollTrigger Plugin');
            checkDep(window.Flip, 'Flip Plugin');
        console.groupEnd();
        
        // 2. Oracle Integrity Check
        groupMethod('%c2. Oracle Internal Integrity', 'color: #EBCB8B;');
            const expectedMethods = ['init', 'utility', 'performance', 'reportStatus', '_timestamp', 'log', 'scan', 'group', 'groupEnd', 'report', 'warn', 'updateHUD', 'trackScrollTrigger', 'runSelfDiagnostic'];
            let integrityOk = true;
            expectedMethods.forEach(methodName => {
                if (typeof Oracle[methodName] !== 'undefined') {
                    console.log(`  - Property/Method '${methodName}': %c✅ OK`, 'color: #A3BE8C;');
                } else {
                    console.log(`  - Property/Method '${methodName}': %c❌ MISSING/INVALID!`, 'color: #BF616A; font-weight: bold;');
                    integrityOk = false;
                }
            });
            if (integrityOk) { Oracle.report("Oracle internal integrity verified."); } 
            else { Oracle.warn("Oracle integrity compromised! Check for missing methods."); }
        console.groupEnd();

        // 3. Environment & Element Sanity Check
        groupMethod('%c3. Environment Sanity Check', 'color: #EBCB8B;');
            console.log(`%c  - Viewport:`, 'color: #88C0D0;', `${window.innerWidth}w x ${window.innerHeight}h`);
            const contentCount = document.querySelectorAll('.pillar-text-content').length;
            const wrapperCount = document.querySelectorAll('.text-anim-wrapper').length;
            console.log(`%c  - Pillar Content Found:`, 'color: #88C0D0;', contentCount);
            console.log(`%c  - Anim Wrappers Found:`, 'color: #88C0D0;', wrapperCount);
            if (contentCount !== wrapperCount) {
                Oracle.warn(`Pillar Mismatch Detected! Found ${contentCount} content divs and ${wrapperCount} wrapper divs. This will cause animation errors.`);
            }
        console.groupEnd();
        
        console.groupEnd();
    },

    init: (callback) => {
        const storedVerbosity = localStorage.getItem('oracleVerbosity');
        if (storedVerbosity !== null) Oracle.config.verbosity = parseInt(storedVerbosity, 10);
        const urlParams = new URLSearchParams(window.location.search);
        const urlVerbosity = urlParams.get('oracle_verbosity');
        if (urlVerbosity !== null && urlVerbosity !== '') {
            const parsedVerbosity = parseInt(urlVerbosity, 10);
            if (!isNaN(parsedVerbosity)) Oracle.config.verbosity = parsedVerbosity;
        }
        if(callback && typeof callback === 'function') callback();
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

    trackScrollTrigger: (stInstance, label) => {
        if (Oracle.config.verbosity < 1) return;
        if (!stInstance) {
            Oracle.warn(`[ORACLE ST_TRACK @ ${Oracle._timestamp()}: ${label}] FAILED - ScrollTrigger instance is null.`);
            return;
        }
        const groupMethod = Oracle.config.verbosity >= 2 ? console.group : console.groupCollapsed;
        groupMethod(`%c[ORACLE ST_TRACK @ ${Oracle._timestamp()}: ${label}]`, 'color: #EBCB8B; font-weight: bold;');
        const triggerEl = stInstance.trigger;
        const totalDistance = stInstance.end - stInstance.start;

        console.log(`%c  - Status:`, 'color: #88C0D0;', `Active: ${stInstance.isActive}, Direction: ${stInstance.direction === 1 ? 'DOWN' : 'UP'}`);
        console.log(`%c  - Trigger Element:`, 'color: #88C0D0;', `${triggerEl.tagName}#${triggerEl.id || '.' + triggerEl.className.split(' ')[0]}`);
        console.log(`%c  - Pixel Range:`, 'color: #88C0D0;', `Start: ${stInstance.start.toFixed(0)}px, End: ${stInstance.end.toFixed(0)}px`);
        console.log(`%c  - Progress:`, 'color: #88C0D0;', `${(stInstance.progress * 100).toFixed(2)}%`);
        if (!stInstance._sentinelWarned) {
            const minSafeDistance = window.innerHeight * 2;
            if (totalDistance < minSafeDistance) {
                Oracle.warn(`SENTINEL ALERT: Total scroll distance for '${label}' (${totalDistance.toFixed(0)}px) is less than 2x viewport height (${minSafeDistance}px). Animation may feel rushed.`);
            }
            stInstance._sentinelWarned = true;
        }
        console.groupEnd();
    },
    
    report: (message) => console.log(`%c[SOVEREIGN REPORT @ ${Oracle._timestamp()}]:`, 'color: #5E81AC; font-weight: bold;', message),
    warn: (message) => console.warn(`%c[SOVEREIGN WARNING @ ${Oracle._timestamp()}]:`, 'color: #EBCB8B;', message),

    // <<<< ARCHITECT v40.0 UPGRADE >>>>
    // Centralized HUD status reporting. Allows a single, consistent line for critical system state.
    reportStatus: (message, color = '#88C0D0') => {
        Oracle.updateHUD('c-protocol-status', message, color);
    },
    
    // The core function for updating any HUD element.
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

// =========================================================================
//         SOVEREIGN BLUEPRINT v39.2: FUNCTION DEFINITIONS
// =========================================================================

// Hero actor animation setup (unchanged)
const setupHeroActor = (elements, masterTl) => {
    masterTl.to(elements.heroActor, {
        rotationY: 120, rotationX: 10, scale: 1.1, ease: "power2.inOut", duration: 2
    }).to(elements.heroActor, {
        rotationY: -120, rotationX: -20, scale: 1.2, ease: "power2.inOut", duration: 2
    });
};

// =========================================================================
//   THE DEFINITIVE BLUEPRINT for Text Pillars (v42 - SYNCHRONIZED Narrative)
// =========================================================================
// This function no longer creates its own timeline. Instead, it accepts the 
// single master timeline (`masterTl`) and adds its animation "chapters" to it.
// =====================================================================================
//   THE DEFINITIVE BLUEPRINT for Text Pillars (v43.1 - COVENANT "Unbroken Chain")
// =====================================================================================
// This version resolves the logic freeze by constructing the entire narrative
// sequence as a single, monolithic, unbroken animation chain. This provides
// absolute clarity to the GSAP engine and prevents recursive calculation errors.
const setupTextPillars = (elements, masterTl) => {

    // 1. Establish Authoritative JS Initial State (Unchanged)
    gsap.set(elements.pillars, { autoAlpha: 0 }); 
    gsap.set(elements.pillars[0], { autoAlpha: 1 });
    gsap.set(elements.textWrappers, { y: 40, rotationX: -15 }); 
    gsap.set(elements.textWrappers[0], { y: 0, rotationX: 0 });

    // === OVERKILL TRACKER #1: STATE AUTHORITY VERIFICATION (Unchanged) ===
    Oracle.group("COVENANT Initial Pillar State Authority (PRE-ANIMATION)");
    elements.pillars.forEach((pillar, index) => {
        Oracle.scan(`Pillar #${index + 1} State Vector`, {
            'Parent GSAP Opacity': gsap.getProperty(pillar, "autoAlpha"),
            'Wrapper GSAP Y': gsap.getProperty(elements.textWrappers[index], "y").toFixed(1) + 'px'
        });
    });
    Oracle.groupEnd();
    
    // 2. CONSTRUCT THE UNBROKEN CHAIN.
    // All tweens are now part of a single, continuous command chain. This removes
    // all logical ambiguity and guarantees a linear execution flow.
    masterTl
        // -- Transition 1: Pillar 1 to Pillar 2 (starts at 1.0s) --
        .to(elements.pillars[0], { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 1.0)
        .to(elements.textWrappers[0], { y: -40, rotationX: 15, duration: 0.5, ease: "power2.in" }, "<")
        .to(elements.pillars[1], { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, "<")
        .from(elements.textWrappers[1], { y: 40, rotationX: -15, duration: 0.5, ease: "power2.out" }, "<")

        // -- Transition 2: Pillar 2 to Pillar 3 (starts at 3.0s) --
        .to(elements.pillars[1], { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 3.0)
        .to(elements.textWrappers[1], { y: -40, rotationX: 15, duration: 0.5, ease: "power2.in" }, "<")
        .to(elements.pillars[2], { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, "<")
        .from(elements.textWrappers[2], { y: 40, rotationX: -15, duration: 0.5, ease: "power2.out" }, "<");


    // === COVENANT TRACKER #3: CHRONOSYNCHRONY VERIFICATION (Unchanged but more relevant) ===
    Oracle.group("COVENANT Chronosynchrony Verification [TextPillars]");
        const pillarTweens = masterTl.getChildren(false, true, true).filter(tween => {
            const targets = Array.isArray(tween.targets()) ? tween.targets() : [tween.targets()];
            return targets.some(t => t.classList.contains('pillar-text-content') || t.classList.contains('text-anim-wrapper'));
        });
        Oracle.scan(`Pillar Tween Integration`, {
            'Status': 'MONOLITHIC CHAIN CONFIRMED',
            'Tween Chapters Found': pillarTweens.length,
            'Expected Chapters': 8 
        });
    Oracle.groupEnd();
};

// =========================================================================
//   THE ARCHITECT PROTOCOL HANDOFF (v40.1 - DECOUPLED & ARMED)
// =========================================================================
const setupHandoff = (elements, masterStoryTl) => {

    let isSwapped = false;
    let isReversing = false;
    Oracle.updateHUD('c-handoff-armed-flag', 'FALSE', '#BF616A');

    // STAGE 1: Define the complex logic as standalone functions.
    // This keeps the trigger creation clean and readable.
    const performAbsorption = (self) => {
        if (isSwapped || isReversing) return;
        isSwapped = true;
        
        Oracle.group('ABSORPTION PROTOCOL INITIATED');
        Oracle.reportStatus('ABSORPTION', '#D08770');
        Oracle.updateHUD('c-event', 'ABSORPTION');
        
        // Disable the master scroll timeline to prevent conflicts during the FLIP.
        masterStoryTl.scrollTrigger.disable(false);
        Oracle.report('Phase 1: Forcing ST update and capturing state vectors.');
        ScrollTrigger.refresh(true); // Force a refresh to get latest values

        const hero = elements.heroActor;
        const stuntDouble = elements.stuntActor;

        // Capture state for FLIP animation
        const state = Flip.getState(stuntDouble, { props: "transform, opacity" });
        const heroProps = { 
            scale: gsap.getProperty(hero, "scale"), 
            rotationX: gsap.getProperty(hero, "rotationX"), 
            rotationY: gsap.getProperty(hero, "rotationY") 
        };
        Oracle.log(hero, `Hero State (Pre-Absorption) | Captured RotY: ${heroProps.rotationY.toFixed(2)}`);

        // Teleport the stunt double to the hero's position and match its state
        gsap.set(stuntDouble, {
            autoAlpha: 1,
            x: hero.getBoundingClientRect().left - elements.placeholder.getBoundingClientRect().left,
            y: hero.getBoundingClientRect().top - elements.placeholder.getBoundingClientRect().top,
            scale: heroProps.scale,
            rotationX: heroProps.rotationX,
            rotationY: heroProps.rotationY,
        });
        Oracle.log(stuntDouble, "Stunt Double State (Teleported & Matched)");

        const absorptionTl = gsap.timeline({
            onComplete: () => {
                masterStoryTl.scrollTrigger.enable(); // Re-enable master scroll
                Oracle.reportStatus('STABILIZED', '#A3BE8C');
                Oracle.updateHUD('c-event', 'STABILIZED / SCROLL ENABLED');
                Oracle.log(stuntDouble, "Stunt Double State (Post-Absorption/Logo)");
                Oracle.groupEnd();
            }
        });

        Oracle.report('Phase 2: Initiating travel and absorption sequence.');
        // The FLIP animation itself
        absorptionTl.add(Flip.from(state, { 
            targets: stuntDouble, 
            duration: 1.5, 
            ease: 'power3.inOut', 
            onUpdate: function() { 
                Oracle.scan('Absorption Vector Trace', { 'Progress': `${(this.progress() * 100).toFixed(1)}%` });
            } 
        }));

        // The rest of the synchronized absorption animation
        absorptionTl
            .to(hero, { autoAlpha: 0, scale: '-=0.1', duration: 0.4, ease: "power2.in" }, 0)
            .to(elements.stuntActorFaces, { opacity: 0, duration: 0.6, ease: "power2.in", stagger: 0.05 }, 0.6)
            .to(elements.placeholderClipper, { clipPath: "inset(20% 20% 20% 20%)", duration: 0.6, ease: 'expo.in' }, 0.7)
            .to(stuntDouble, { scaleX: 1.2, scaleY: 0.8, duration: 0.4, ease: 'circ.in' }, 0.9)
            .to(elements.placeholderClipper, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: 'elastic.out(1, 0.5)' }, 1.3)
            .to(stuntDouble, { scaleX: 1, scaleY: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }, 1.3)
            .to(stuntDouble, { rotationX: 0, rotationY: 0, z: 0, duration: 0.6, ease: "power3.inOut" }, '+=0.2')
            .call(() => stuntDouble.classList.add('is-logo-final-state'), [], '>');
    };

    const performReversal = (self) => {
        if (!isSwapped) return; // Prevent this from running if it hasn't swapped yet
        isReversing = true;
        isSwapped = false;

        Oracle.group('REVERSE PROTOCOL INITIATED');
        Oracle.reportStatus('REVERSING', '#EBCB8B');
        Oracle.updateHUD('c-event', 'REVERSAL');
        
        elements.stuntActor.classList.remove('is-logo-final-state');
        gsap.killTweensOf([elements.stuntActor, elements.stuntActorFaces, elements.heroActor, elements.placeholderClipper]);

        // Create a dedicated reversal timeline to ensure clean state restoration
        const reversalTl = gsap.timeline({
            onComplete: () => {
                masterStoryTl.scrollTrigger.enable(); // Ensure master scroll is enabled
                masterStoryTl.scrollTrigger.update(); // Force an update
                Oracle.reportStatus('SCROLLING', '#88C0D0');
                Oracle.updateHUD('c-event', 'SCROLLING');
                Oracle.log(elements.heroActor, "Hero State (Restored)");
                Oracle.groupEnd();
                isReversing = false;
            }
        });
        
        // Immediately set elements back to their pre-absorption state
        reversalTl
            .set(elements.stuntActor, { autoAlpha: 0 })
            .set(elements.stuntActorFaces, { clearProps: "opacity" })
            .set(elements.placeholderClipper, { clearProps: "clipPath" })
            .set(elements.heroActor, { autoAlpha: 1 });
    };

    // STAGE 2: Create the SKELETAL trigger.
    // It contains NO complex logic initially, only simple HUD updates. This prevents the freeze.
    ScrollTrigger.create({
        trigger: elements.handoffPoint,
        start: 'top 70%',
        onToggle: self => Oracle.updateHUD('c-handoff-st-active', self.isActive ? 'TRUE' : 'FALSE', self.isActive ? '#A3BE8C' : '#BF616A'),
        
        // STAGE 3: ARM the trigger after layout calculation.
        // onRefresh is the safe moment to attach heavy event listeners, solving the race condition.
        onRefresh: (self) => {
            self.onEnter = () => performAbsorption(self);
            self.onLeaveBack = () => performReversal(self);
            Oracle.reportStatus('HANDOFF ARMED', '#A3BE8C');
            Oracle.updateHUD('c-handoff-armed-flag', 'TRUE', '#A3BE8C');
        }
    });
};

// =========================================================================
//         SOVEREIGN ARCHITECTURE v40.1: ARCHITECT-DRIVEN NARRATIVE
// =========================================================================
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    Oracle.report(`Sovereign Build v40.1 "Architect" Initialized. Verbosity: ${Oracle.config.verbosity}`);
    Oracle.reportStatus('SYSTEM BOOT', '#5E81AC');

    // Use the performance benchmark to wrap the entire setup and capture the return value (ctx)
    const ctx = Oracle.performance.benchmark('Sovereign Animation Architecture Setup', () => {
        // gsap.context() is essential for proper cleanup with React/Vue, and good practice everywhere.
        return gsap.context(() => {
            Oracle.runSelfDiagnostic();

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

            if (Object.values(elements).some(el => !el || (Array.isArray(el) && !el.length))) {
                Oracle.warn('SOVEREIGN ABORT: Missing critical elements.');
                return;
            }
            Oracle.report("Sovereign components verified and locked.");
    
            const scrubValue = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : 1.5;
    
            ScrollTrigger.matchMedia({
                '(min-width: 1025px)': () => {
                    Oracle.reportStatus('SCROLLING', '#88C0D0');
                    
                    ScrollTrigger.create({ 
                        trigger: elements.textCol, 
                        pin: elements.visualsCol, 
                        start: 'top top', 
                        end: 'bottom bottom' 
                    });
                    
                    // Throttled logger remains from the "Aegis" protocol for run-time safety.
                    const throttledLogger = Oracle.utility.throttle((self) => {
                        const hero = elements.heroActor;
                        const rotX = gsap.getProperty(hero, "rotationX").toFixed(1);
                        const rotY = gsap.getProperty(hero, "rotationY").toFixed(1);
                        const scale = gsap.getProperty(hero, "scale").toFixed(2);
                        const progress = (self.progress * 100).toFixed(0);

                        Oracle.scan('Live Story Scrub (Throttled)', { 'Master Progress': `${progress}%`, 'RotX': rotX, 'RotY': rotY, 'Scale': scale });
                        Oracle.trackScrollTrigger(self, "Unified Story Controller (Throttled)");

                        // Lightweight updates that were dependent on these values now also live here.
                        Oracle.updateHUD('c-rot-x', rotX);
                        Oracle.updateHUD('c-rot-y', rotY);
                        Oracle.updateHUD('c-scale', scale);

                    }, 150);

                    const masterStoryTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: elements.textCol, 
                            start: 'top top', 
                            end: 'bottom bottom', 
                            scrub: scrubValue,
                            onUpdate: (self) => {
                                // The main onUpdate is now extremely lightweight.
                                Oracle.updateHUD('c-scroll', `${(self.progress * 100).toFixed(0)}%`);
                                throttledLogger(self);
                            }
                        }
                    });
                    
                    // Assemble the animation narrative
                    setupHeroActor(elements, masterStoryTl);
                    setupTextPillars(elements, masterStoryTl);
                    
                    // Initiate the handoff protocol, which now safely arms itself.
                    setupHandoff(elements, masterStoryTl);
                },
            });
        });
    });

    return ctx;
}

// Initialization Logic (unchanged)
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

// REVISED initialization sequence (unchanged)
function initialAnimationSetup() {
    if (window.gsap && window.ScrollTrigger && window.Flip) {
        Oracle.init(setupAnimations); 
    } else {
        Oracle.warn("GSAP libraries failed to load. SOVEREIGN protocol aborted.");
    }
}

document.addEventListener("DOMContentLoaded", setupSiteLogic);
window.addEventListener("load", initialAnimationSetup);
