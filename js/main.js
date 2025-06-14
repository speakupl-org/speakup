/*

THE DEFINITIVE COVENANT BUILD v37.2 - "Sovereign" Protocol (Synchronized)

This version corrects a race condition in the initialization sequence, ensuring that
the Oracle's verbosity configuration is locked in before any telemetry scanning
begins. The initialization flow is now restructured for guaranteed order of operations.

*/

// Oracle v42.0 - The "Sovereign" Protocol with "Eschaton" Architectural Awareness
const Oracle = {
    // Configuration Sub-protocol
    config: {
        verbosity: 1, // Default: 1=collapsed, 2=expanded
    },
    // Aegis Protocol v39.0 Utility
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
    // Performance Sub-protocol v43.1
    performance: {
        benchmark: (label, functionToTest) => {
            if (Oracle.config.verbosity < 1) { const res = functionToTest(); return res; }
            const startTime = performance.now();
            const result = functionToTest();
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(3);
            const color = duration < 50 ? '#A3BE8C' : (duration < 200 ? '#EBCB8B' : '#BF616A');
            
            if(Oracle.config.verbosity > 0){
                console.log(`%c[ORACLE BENCHMARK @ ${Oracle._timestamp()}: ${label}] - %cExecution Time: ${duration}ms`, 'color: #8FBCBB; font-weight: bold;', `color: ${color};`); 
                Oracle.updateHUD('c-exec-time',`${duration}ms`,color);
            } 
            return result;
        }
    },
    
    runSelfDiagnostic: () => {
        if (Oracle.config.verbosity < 1) return;
        const groupMethod = Oracle.config.verbosity >= 2 ? console.group : console.groupCollapsed;
        console.group(`%c[ORACLE SELF-DIAGNOSTIC (SOVEREIGN INTEGRITY PROTOCOL)]`, 'color: #D08770; font-weight: bold;');
        
        groupMethod('%c1. Dependency Verification', 'color: #EBCB8B;');
            const checkDep = (lib, name) => console.log(`  - ${name}:`, lib ? '%c✅ FOUND' : '%c❌ MISSING!', lib ? 'color: #A3BE8C;' : 'color: #BF616A; font-weight: bold;');
            checkDep(window.gsap, 'GSAP Core');
            checkDep(window.ScrollTrigger, 'ScrollTrigger Plugin');
            checkDep(window.Flip, 'Flip Plugin');
        console.groupEnd();
        
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
        
        // <<<< ESCHATON v42 UPGRADE >>>>
        groupMethod('%c3. Architectural & Environmental Sanity Check', 'color: #EBCB8B;');
            // Normal environment checks
            console.log(`%c  - Viewport:`, 'color: #88C0D0;', `${window.innerWidth}w x ${window.innerHeight}h`);

            // Critical Architectural Check for the Layout Paradox
            const handoff = document.getElementById('handoff-point');
            const textCol = document.querySelector('.pillar-text-col');
            if (handoff && textCol) {
                if (textCol.contains(handoff)) {
                    Oracle.warn("CRITICAL ARCHITECTURAL FAILURE: #handoff-point CANNOT be a child of .pillar-text-col. This causes a layout paradox. Move it to be a sibling of the .method-pillars section. SYSTEM WILL FREEZE.");
                    console.log(`  - Handoff Architecture: %c❌ PARADOX DETECTED!`, 'color: #BF616A; font-weight: bold;');
                } else {
                    console.log(`  - Handoff Architecture: %c✅ DECOUPLED`, 'color: #A3BE8C;');
                }
            } else {
                 console.log(`  - Handoff Architecture: %c⚠️ UNVERIFIED (elements missing)`, 'color: #D08770;');
            }
        console.groupEnd();
        console.groupEnd();
    },

    init: (callback) => {
        const storedVerbosity = localStorage.getItem('oracleVerbosity');
        if (storedVerbosity !== null) Oracle.config.verbosity = parseInt(storedVerbosity, 10);
        const urlParams = new URLSearchParams(window.location.search);
        const urlVerbosity = urlParams.get('oracle_verbosity');
        if (urlVerbosity !== null && urlVerbosity !== '') { const parsedVerbosity = parseInt(urlVerbosity, 10); if (!isNaN(parsedVerbosity)) Oracle.config.verbosity = parsedVerbosity; }
        if(callback && typeof callback === 'function') callback();
    },
    _timestamp: () => new Date().toLocaleTimeString('en-US', { hour12: false }),
    log: (el, label) => { if (Oracle.config.verbosity < 1 || !el) return; const groupMethod = Oracle.config.verbosity >= 2 ? console.group : console.groupCollapsed; groupMethod(`%c[ORACLE LOG @ ${Oracle._timestamp()}: ${label}]`, 'color: #D81B60; font-weight: bold;'); const style = window.getComputedStyle(el); const transform = {scale:gsap.getProperty(el,"scale"),rotationX:gsap.getProperty(el,"rotationX"),rotationY:gsap.getProperty(el,"rotationY"),z:gsap.getProperty(el,"z")}; const bounds = el.getBoundingClientRect(); console.log(`%c  - Target:`, 'color: #81A1C1;',`${el.tagName}#${el.id||el.className}`); console.log(`%c  - Transform:`, 'color: #81A1C1;',`{ RotX: ${transform.rotationX.toFixed(2)}, RotY: ${transform.rotationY.toFixed(2)}, Scale: ${transform.scale.toFixed(2)}, Z: ${transform.z.toFixed(2)} }`); console.log(`%c  - Style:`, 'color: #81A1C1;',`{ Opacity: ${style.opacity}, Visibility: ${style.visibility} }`); console.log(`%c  - Geometry:`, 'color: #81A1C1;',`{ X: ${bounds.left.toFixed(1)}, Y: ${bounds.top.toFixed(1)}, W: ${bounds.width.toFixed(1)}, H: ${bounds.height.toFixed(1)} }`); console.groupEnd(); },
    scan: (label, data) => { if(Oracle.config.verbosity < 1) return; const groupMethod = Oracle.config.verbosity >= 2 ? console.group : console.groupCollapsed; groupMethod(`%c[ORACLE SCAN @ ${Oracle._timestamp()}: ${label}]`, 'color: #B48EAD;'); for(const key in data) { console.log(`%c  - ${key}:`, 'color: #88C0D0;', data[key]); } console.groupEnd(); },
    group: (label) => { if(Oracle.config.verbosity < 1) return; console.group(`%c[ORACLE ACTION @ ${Oracle._timestamp()}: ${label}]`, 'color: #A3BE8C; font-weight: bold;'); },
    groupEnd: () => { if (Oracle.config.verbosity < 1) return; console.groupEnd(); },
    trackScrollTrigger: (stInstance, label) => { if(Oracle.config.verbosity<1 || !stInstance)return; const groupMethod=Oracle.config.verbosity>=2?console.group:console.groupCollapsed; groupMethod(`%c[ORACLE ST_TRACK @ ${Oracle._timestamp()}: ${label}]`,'color:#EBCB8B;'); const t=stInstance.trigger; console.log(`%c  - Status:`,`color:#88C0D0;`,`Active: ${stInstance.isActive}, Dir: ${stInstance.direction===1?'DOWN':'UP'}`); console.log(`%c  - Progress:`,`color:#88C0D0;`,`${(stInstance.progress*100).toFixed(2)}%`); console.groupEnd(); },
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
//         ESCHATON ARCHITECTURE v42: Decoupled Causality & Unified Trigger
// =========================================================================
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    Oracle.report(`Sovereign Build v42 "Eschaton" Initialized. Verbosity: ${Oracle.config.verbosity}`);
    Oracle.reportStatus('SYSTEM BOOT', '#5E81AC');

    // Use the performance benchmark to wrap the entire setup and capture the return value (ctx)
    const ctx = Oracle.performance.benchmark('Sovereign Animation Architecture Setup', () => {
        // gsap.context() is essential for proper cleanup and is a best-practice container.
        return gsap.context(() => {
            // The new diagnostic will now verify the HTML architecture before proceeding.
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
                // ARCHITECTURAL FIX: A new master trigger element is defined for stability.
                scrollyScene: getElement('.method-pillars'), 
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
                    
                    // ARCHITECTURAL UNIFICATION: Both the pin and the master scrub
                    // now use the same parent `scrollyScene` as their trigger.
                    // This creates a single, unambiguous source of truth for the animation's duration.
                    ScrollTrigger.create({ 
                        trigger: elements.scrollyScene, 
                        pin: elements.visualsCol, 
                        start: 'top top', 
                        end: 'bottom bottom' 
                    });
                    
                    // The Aegis throttled logger remains the optimal solution for run-time performance.
                    const throttledLogger = Oracle.utility.throttle((self) => {
                        const hero = elements.heroActor;
                        const rotX = gsap.getProperty(hero, "rotationX").toFixed(1);
                        const rotY = gsap.getProperty(hero, "rotationY").toFixed(1);
                        const scale = gsap.getProperty(hero, "scale").toFixed(2);
                        
                        Oracle.scan('Live Story Scrub (Throttled)', { 
                            'Master Progress': `${(self.progress * 100).toFixed(0)}%`, 
                            'RotX': rotX, 
                            'RotY': rotY, 
                            'Scale': scale 
                        });
                        Oracle.trackScrollTrigger(self, "Unified Story Controller (Throttled)");

                        // Lightweight HUD updates that rely on the same values can live here too.
                        Oracle.updateHUD('c-rot-x', rotX);
                        Oracle.updateHUD('c-rot-y', rotY);
                        Oracle.updateHUD('c-scale', scale);

                    }, 150);

                    const masterStoryTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: elements.scrollyScene, // Using the unified trigger.
                            start: 'top top', 
                            end: 'bottom bottom', 
                            scrub: scrubValue,
                            onUpdate: (self) => {
                                // The main onUpdate remains extremely lightweight for max performance.
                                Oracle.updateHUD('c-scroll', `${(self.progress * 100).toFixed(0)}%`);
                                throttledLogger(self);
                            }
                        }
                    });
                    
                    // Assemble the full animation narrative by calling the component functions.
                    setupHeroActor(elements, masterStoryTl);
                    setupTextPillars(elements, masterStoryTl);
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
