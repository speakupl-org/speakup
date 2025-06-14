/*

THE DEFINITIVE COVENANT BUILD v37.2 - "Sovereign" Protocol (Synchronized)

This version corrects a race condition in the initialization sequence, ensuring that
the Oracle's verbosity configuration is locked in before any telemetry scanning
begins. The initialization flow is now restructured for guaranteed order of operations.

*/

// Oracle v45.0 - The "Sovereign" Protocol with "Sisyphus" Pre-Flight Validation
const Oracle = {
    config: { verbosity: 1, },
    
    utility: { 
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
    
    performance: { 
        benchmark: (label, functionToTest) => { 
            const s = performance.now(); 
            const r = functionToTest(); 
            const e = performance.now(); 
            const d = (e-s).toFixed(3); 
            const c = d < 50 ? '#A3BE8C' : (d < 200 ? '#EBCB8B' : '#BF616A'); 
            if(Oracle.config.verbosity > 0) {
                console.log(`%c[ORACLE BENCHMARK @ ${Oracle._timestamp()}: ${label}] - %cExecution Time: ${d}ms`, 'color: #8FBCBB; font-weight: bold;',`color: ${c};`); 
                Oracle.updateHUD('c-exec-time',`${d}ms`,c);
            } 
            return r;
        }
    },

    // <<<< SISYPHUS v45 UPGRADE: PRE-FLIGHT VALIDATION >>>>
    // This function runs BEFORE animation setup to catch critical DOM errors.
    validate: (elements) => {
        let isValid = true;
        const groupMethod = Oracle.config.verbosity >= 2 ? console.group : console.groupCollapsed;
        groupMethod('%c[ORACLE PRE-FLIGHT VALIDATION]', 'color: #D08770; font-weight: bold;');
        
        // 1. Pillar-Wrapper Integrity Check
        const contentCount = elements.pillars?.length || 0;
        const wrapperCount = elements.textWrappers?.length || 0;
        if (contentCount !== wrapperCount) {
            console.error(`%c  - Pillar Integrity: ❌ FAILED! Mismatch detected.`, 'color: #BF616A; font-weight: bold;');
            console.log(`    - Found ${contentCount} '.pillar-text-content' elements.`);
            console.log(`    - Found ${wrapperCount} '.text-anim-wrapper' elements.`);
            Oracle.updateHUD('c-validation-status', 'PILLAR FAIL', '#BF616A');
            isValid = false;
        } else {
            console.log(`%c  - Pillar Integrity: ✅ OK (${contentCount} pairs found)`, 'color: #A3BE8C;');
        }
        
        // Add any future critical DOM checks here. For example:
        // if (!elements.heroActor) { /* ... fail validation ... */ }
        
        console.groupEnd();
        
        // Throw a blocking error if validation fails, preventing the freeze.
        if (!isValid) {
            throw new Error("Sovereign Validation Failed: Critical DOM structure error detected. Halting execution to prevent system freeze.");
        }
        
        Oracle.report("All Pre-Flight checks passed.");
        Oracle.updateHUD('c-validation-status', 'PASS', '#A3BE8C');
    },

    init: (callback) => {
        const storedVerbosity = localStorage.getItem('oracleVerbosity');
        if (storedVerbosity !== null) Oracle.config.verbosity = parseInt(storedVerbosity, 10);
        const urlParams = new URLSearchParams(window.location.search);
        const urlVerbosity = urlParams.get('oracle_verbosity');
        if (urlVerbosity !== null && urlVerbosity !== '') { const parsedVerbosity = parseInt(urlVerbosity, 10); if (!isNaN(parsedVerbosity)) Oracle.config.verbosity = parsedVerbosity; }
        if(callback && typeof callback === 'function') callback();
    },
    
    _timestamp: () => new Date().toLocaleTimeString('en-US', {hour12: false}),
    
    log: (el, label) => { if (Oracle.config.verbosity < 1 || !el) return; const groupMethod = Oracle.config.verbosity >= 2 ? console.group : console.groupCollapsed; groupMethod(`%c[ORACLE LOG @ ${Oracle._timestamp()}: ${label}]`, 'color: #D81B60; font-weight: bold;'); const style = window.getComputedStyle(el); const transform = {scale:gsap.getProperty(el,"scale"),rotationX:gsap.getProperty(el,"rotationX"),rotationY:gsap.getProperty(el,"rotationY"),z:gsap.getProperty(el,"z")}; const bounds = el.getBoundingClientRect(); console.log(`%c  - Target:`, 'color: #81A1C1;',`${el.tagName}#${el.id||el.className.split(' ')[0]}`); console.log(`%c  - Transform:`, 'color: #81A1C1;',`{ RotX: ${transform.rotationX.toFixed(2)}, RotY: ${transform.rotationY.toFixed(2)}, Scale: ${transform.scale.toFixed(2)}, Z: ${transform.z.toFixed(2)} }`); console.log(`%c  - Style:`, 'color: #81A1C1;',`{ Opacity: ${style.opacity}, Visibility: ${style.visibility} }`); console.log(`%c  - Geometry:`, 'color: #81A1C1;',`{ X: ${bounds.left.toFixed(1)}, Y: ${bounds.top.toFixed(1)}, W: ${bounds.width.toFixed(1)}, H: ${bounds.height.toFixed(1)} }`); console.groupEnd(); },
    
    scan: (label, data) => { if(Oracle.config.verbosity < 1) return; const groupMethod = Oracle.config.verbosity >= 2 ? console.group : console.groupCollapsed; groupMethod(`%c[ORACLE SCAN @ ${Oracle._timestamp()}: ${label}]`, 'color: #B48EAD; font-weight: normal;'); for(const key in data) { console.log(`%c  - ${key}:`, 'color: #88C0D0;', data[key]); } console.groupEnd(); },
    
    group: (label) => { if(Oracle.config.verbosity < 1) return; console.group(`%c[ORACLE ACTION @ ${Oracle._timestamp()}: ${label}]`, 'color: #A3BE8C; font-weight: bold;'); },
    
    groupEnd: () => { if (Oracle.config.verbosity < 1) return; console.groupEnd(); },
    
    report: (message) => console.log(`%c[SOVEREIGN REPORT @ ${Oracle._timestamp()}]:`, 'color: #5E81AC; font-weight: bold;', message),
    
    warn: (message) => console.warn(`%c[SOVEREIGN WARNING @ ${Oracle._timestamp()}]:`, 'color: #EBCB8B;', message),
    
    reportStatus: (message, color = '#88C0D0') => { Oracle.updateHUD('c-protocol-status', message, color); },
    
    updateHUD: (id, value, color = '#E5E9F0') => { const el = document.getElementById(id); if(el){el.textContent=value;el.style.color=color;} }
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
//   ESCHATON HANDOFF (v42 - Architecturally Sound & Direct)
// =========================================================================
const setupHandoff = (elements, masterStoryTl) => {

    let isSwapped = false;
    Oracle.updateHUD('c-handoff-armed-flag', 'FALSE', '#BF616A');

    const performAbsorption = (self) => {
        if (isSwapped) return;
        isSwapped = true;
        
        Oracle.group('ABSORPTION PROTOCOL INITIATED (ESCHATON)');
        Oracle.reportStatus('ABSORPTION', '#D08770');
        Oracle.updateHUD('c-event', 'ABSORPTION');
        
        masterStoryTl.scrollTrigger.disable(false);

        const hero = elements.heroActor;
        const stuntDouble = elements.stuntActor;

        const state = Flip.getState(stuntDouble, { props: "transform, opacity" });
        const heroProps = { 
            scale: gsap.getProperty(hero, "scale"), 
            rotationX: gsap.getProperty(hero, "rotationX"), 
            rotationY: gsap.getProperty(hero, "rotationY") 
        };

        gsap.set(stuntDouble, {
            autoAlpha: 1,
            x: hero.getBoundingClientRect().left - elements.placeholder.getBoundingClientRect().left,
            y: hero.getBoundingClientRect().top - elements.placeholder.getBoundingClientRect().top,
            scale: heroProps.scale, rotationX: heroProps.rotationX, rotationY: heroProps.rotationY,
        });

        const absorptionTl = gsap.timeline({
            onComplete: () => {
                masterStoryTl.scrollTrigger.enable();
                Oracle.reportStatus('STABILIZED', '#A3BE8C');
                Oracle.groupEnd();
            }
        });

        absorptionTl.add(Flip.from(state, { targets: stuntDouble, duration: 1.5, ease: 'power3.inOut' }));
        absorptionTl
            .to(hero, { autoAlpha: 0, duration: 0.4 }, 0)
            .to(elements.stuntActorFaces, { opacity: 0, duration: 0.6, stagger: 0.05 }, 0.6)
            .to(stuntDouble, { rotationX: 0, rotationY: 0, duration: 0.8, ease: "power3.inOut" }, ">-0.5")
            .call(() => stuntDouble.classList.add('is-logo-final-state'), [], '>');
    };

    const performReversal = (self) => {
        if (!isSwapped) return;
        isSwapped = false;

        Oracle.group('REVERSAL PROTOCOL INITIATED (ESCHATON)');
        Oracle.reportStatus('REVERSING', '#EBCB8B');
        
        elements.stuntActor.classList.remove('is-logo-final-state');
        gsap.killTweensOf([elements.stuntActor, elements.heroActor, elements.stuntActorFaces]);
        
        gsap.set(elements.stuntActor, { autoAlpha: 0 });
        gsap.set(elements.heroActor, { autoAlpha: 1 });
        
        masterStoryTl.scrollTrigger.enable();
        masterStoryTl.scrollTrigger.update(); // Nudge the master ST to recognize its state
        Oracle.reportStatus('SCROLLING', '#88C0D0');
        Oracle.groupEnd();
    };

    // The "Architect" protocol remains the correct way to attach events.
    ScrollTrigger.create({
        trigger: elements.handoffPoint,
        start: 'top 80%', // This trigger position works well with the new decoupled architecture.
        onToggle: self => Oracle.updateHUD('c-handoff-st-active', self.isActive ? 'TRUE' : 'FALSE', self.isActive ? '#A3BE8C' : '#BF616A'),
        
        onRefresh: (self) => {
            self.onEnter = () => performAbsorption(self);
            self.onLeaveBack = () => performReversal(self);
            Oracle.reportStatus('HANDOFF ARMED', '#A3BE8C');
            Oracle.updateHUD('c-handoff-armed-flag', 'TRUE', '#A3BE8C');
        }
    });
};

// =========================================================================
//         SISYPHUS ARCHITECTURE v45: Pre-Flight Validation
// =========================================================================
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    Oracle.report(`Sovereign Build v45 "Sisyphus" Initialized. Verbosity: ${Oracle.config.verbosity}`);
    Oracle.updateHUD('c-oracle-version', 'SISYPHUS', '#D08770');
    Oracle.reportStatus('SYSTEM BOOT', '#5E81AC');
    
    // Step 1: Get all elements FIRST, outside of any GSAP context or benchmark.
    // This makes them available for validation.
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
    
    // Step 2: Perform Pre-Flight Validation.
    // The try/catch block ensures that if validation fails, the script halts gracefully
    // instead of proceeding to a guaranteed freeze.
    try {
        Oracle.validate(elements);
    } catch (e) {
        Oracle.warn(e.message);
        Oracle.reportStatus('VALIDATION HALT', '#BF616A');
        return; // Halt all further execution cleanly.
    }

    // Step 3: Proceed with animation setup only if validation passes.
    const ctx = Oracle.performance.benchmark('Sovereign Animation Architecture Setup', () => {
        return gsap.context(() => {
            // All code inside this block now runs with the certainty that the DOM is structured correctly.
            
            const scrubValue = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : 1.5;
    
            ScrollTrigger.matchMedia({
                '(min-width: 1025px)': () => {
                    // Decoupled Pin & Animation pattern is the correct and stable approach.
                    ScrollTrigger.create({ trigger: elements.textCol, pin: elements.visualsCol, start: 'top top', end: 'bottom bottom' });

                    const throttledLogger = Oracle.utility.throttle((self) => {
                        const hero = elements.heroActor;
                        const rotX = gsap.getProperty(hero, "rotationX").toFixed(1);
                        const rotY = gsap.getProperty(hero, "rotationY").toFixed(1);
                        const scale = gsap.getProperty(hero, "scale").toFixed(2);
                        Oracle.scan('Live Story Scrub (Throttled)', { 'Progress': `${(self.progress * 100).toFixed(0)}%`, 'RotX': rotX, 'RotY': rotY, 'Scale': scale });
                        Oracle.updateHUD('c-rot-x', rotX);
                        Oracle.updateHUD('c-rot-y', rotY);
                        Oracle.updateHUD('c-scale', scale);
                    }, 150);

                    const masterStoryTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: elements.textCol, start: 'top top', end: 'bottom bottom', scrub: scrubValue,
                            onUpdate: (self) => {
                                Oracle.updateHUD('c-scroll', `${(self.progress * 100).toFixed(0)}%`);
                                throttledLogger(self);
                            },
                        }
                    });
                    
                    setupHeroActor(elements, masterStoryTl);
                    setupTextPillars(elements, masterStoryTl);
                    setupHandoff(elements, masterStoryTl);
                },
            });

             // --- Final Holistic Telemetry Update ---
            Oracle.updateHUD('c-gsap-targets', gsap.context.get().targets().length);
            Oracle.updateHUD('c-st-instances', ScrollTrigger.getAll().length);
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
