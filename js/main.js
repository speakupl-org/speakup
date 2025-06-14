/*

THE DEFINITIVE COVENANT BUILD v43.1 - "Sovereign" Protocol (Synchronized & Fortified)

This definitive version introduces a robust diagnostic framework, "The Oracle," providing
granular, contextual, and performance-aware insights into the animation lifecycle.

It also resolves a core architectural flaw by refactoring the pillar text animations 
into a single, monolithic "Unbroken Chain" on the master timeline, ensuring absolute 
logical consistency and eliminating potential recursion or race conditions.

The Handoff Protocol is now correctly synchronized with the master timeline's
ScrollTrigger, resolving a critical state management vulnerability.

The Resize Protocol has been fortified with GSAP's context() and revert() methods,
ensuring absolute stability and eliminating state pollution on viewport changes.

*/

// Oracle v43.2 - The "Observer" Protocol Upgrade
const Oracle = {
    config: {
        verbosity: 1, // Default verbosity. ?oracle_verbosity=2 for max detail.
    },

    // NEW v43.2: Centralized group method selector for consistency.
    _getGroupMethod: function() {
        // At verbosity 1, logs are collapsed to keep the console clean.
        // At verbosity 2, logs are expanded for deep inspection.
        return this.config.verbosity >= 2 ? console.group : console.groupCollapsed;
    },
    
    performance: {
        benchmark: function(label, functionToTest) {
            if (Oracle.config.verbosity < 1) {
                functionToTest();
                return;
            }
            const group = Oracle._getGroupMethod();
            const startTime = performance.now();
            functionToTest();
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(3);
            const color = duration < 50 ? '#A3BE8C' : (duration < 200 ? '#EBCB8B' : '#BF616A');
            
            group(
                `%c[ORACLE BENCHMARK @ ${Oracle._timestamp()}: ${label}]`,
                'color: #8FBCBB; font-weight: bold;'
            );
            console.log(`%c  - Execution Time: %c${duration}ms`, 'color: #81A1C1;', `color: ${color};`);
            console.groupEnd();
        }
    },
    
    runSelfDiagnostic: function() {
        if (Oracle.config.verbosity < 1) return;
        
        const group = this._getGroupMethod();
        
        console.group(`%c[ORACLE SELF-DIAGNOSTIC (SOVEREIGN INTEGRITY PROTOCOL)]`, 'color: #D08770; font-weight: bold;');
        Oracle.updateHUD('c-validation-status', 'RUNNING...', '#EBCB8B');
        
        let allOk = true;
        const check = (condition, okMsg, failMsg) => {
            if(condition) {
                console.log(`  %c✅ ${okMsg}`, 'color: #A3BE8C;');
            } else {
                console.log(`  %c❌ ${failMsg}`, 'color: #BF616A; font-weight: bold;');
                allOk = false;
            }
            return condition;
        };

        group('%c1. Dependency Verification', 'color: #EBCB8B;');
            check(window.gsap, 'GSAP Core: FOUND', 'GSAP Core: MISSING!');
            check(window.ScrollTrigger, 'ScrollTrigger Plugin: FOUND', 'ScrollTrigger Plugin: MISSING!');
            check(window.Flip, 'Flip Plugin: FOUND', 'Flip Plugin: MISSING!');
            check(window.MorphSVGPlugin, 'MorphSVG Plugin: FOUND', 'MorphSVG Plugin: MISSING!');
        console.groupEnd();
        
        // FIX: Added DOM integrity checks. This would have caught missing pillars or handoff points.
        group('%c2. Environment Sanity Check (DOM Integrity)', 'color: #EBCB8B;');
            check(document.querySelectorAll('.pillar-text-content').length > 0, 'Pillars: FOUND', 'CRITICAL: No pillar text elements found!');
            check(document.getElementById('handoff-point'), 'Handoff Point: FOUND', 'CRITICAL: Handoff point #handoff-point is missing!');
            check(document.getElementById('actor-3d'), 'Hero Actor: FOUND', 'CRITICAL: Hero Actor #actor-3d is missing!');
            check(document.getElementById('actor-3d-stunt-double'), 'Stunt Double: FOUND', 'CRITICAL: Stunt Double is missing!');
            check(document.getElementById('morph-path'), 'Morph Target: FOUND', 'CRITICAL: SVG #morph-path is missing! The final logo will not appear.');
        console.groupEnd();

        if (allOk) {
            Oracle.updateHUD('c-validation-status', 'PASSED', '#A3BE8C');
        } else {
            Oracle.updateHUD('c-validation-status', 'FAILED', '#BF616A');
        }
        
        console.groupEnd();
    },
    
    init: function(callback) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlVerbosity = urlParams.get('oracle_verbosity');
        if (urlVerbosity !== null && !isNaN(parseInt(urlVerbosity, 10))) {
            this.config.verbosity = parseInt(urlVerbosity, 10);
        }
        
        if(callback && typeof callback === 'function') callback();
    },

    _timestamp: () => new Date().toLocaleTimeString('en-US', { hour12: false }),

    log: function(el, label) {
        // FIX: Corrected to be visible at verbosity 1 (collapsed) and 2 (expanded).
        if (this.config.verbosity < 1) return; 
        if (!el) { console.error(`[ORACLE] ERROR: Element is null for log: ${label}`); return; }
        
        const group = this._getGroupMethod();
        
        group(`%c[ORACLE LOG @ ${this._timestamp()}: ${label}]`, 'color: #D81B60; font-weight: bold;');
        const style = window.getComputedStyle(el);
        console.log(`%c  - Target:`, 'color: #81A1C1;', `${el.tagName}#${el.id || '.'+el.className.split(' ')[0]}`);
        console.log(`%c  - GSAP BBox:`, 'color: #81A1C1;', `X: ${gsap.getProperty(el, "x")}, Y: ${gsap.getProperty(el, "y")}`);
        console.log(`%c  - CSS Display:`, 'color: #81A1C1;', `Opacity: ${style.opacity}, Visibility: ${style.visibility}`);
        console.groupEnd();
    },
    
    scan: function(label, data) {
        if (this.config.verbosity < 1) return;
        const group = this._getGroupMethod();
        
        group(`%c[ORACLE SCAN @ ${this._timestamp()}: ${label}]`, 'color: #B48EAD; font-weight: normal;');
        for (const key in data) console.log(`%c  - ${key}:`, 'color: #88C0D0;', data[key]);
        console.groupEnd();
    },
    
    group: (label) => { if (Oracle.config.verbosity < 1) return; console.group(`%c[ORACLE ACTION @ ${Oracle._timestamp()}: ${label}]`, 'color: #A3BE8C; font-weight: bold;'); },
    groupEnd: () => { if (Oracle.config.verbosity < 1) return; console.groupEnd(); },

    trackScrollTrigger: function(stInstance, label) {
        // This is a high-detail log, so it ONLY runs at verbosity 2.
        if (this.config.verbosity < 2 || !stInstance) return;
        
        // FIX: Throttle this high-frequency log. Only fires when progress actually changes.
        const currentProgress = (stInstance.progress * 100).toFixed(0);
        if (currentProgress === (stInstance._lastProgress || '')) return;
        stInstance._lastProgress = currentProgress;

        const group = Oracle._getGroupMethod(); // Will always be console.group here

        group(`%c[ORACLE ST_TRACK @ ${this._timestamp()}: ${label}]`, 'color: #EBCB8B; font-weight: bold;');
        console.log(`%c  - Status:`, 'color: #88C0D0;', `Active: ${stInstance.isActive}, Direction: ${stInstance.direction === 1 ? 'DOWN' : 'UP'}`);
        console.log(`%c  - Progress:`, 'color: #88C0D0;', `${currentProgress}%`);
        console.groupEnd();
    },
    
    report: (message) => console.log(`%c[SOVEREIGN REPORT @ ${Oracle._timestamp()}]:`, 'color: #5E81AC; font-weight: bold;', message),
    warn: (message) => console.warn(`%c[SOVEREIGN WARNING @ ${Oracle._timestamp()}]:`, 'color: #D08770;', message),
    updateHUD: (id, value, color = '#E5E9F0') => {
        const el = document.getElementById(id);
        if (el) { el.textContent = value; el.style.color = color; }
    }
};

// --- Utility Functions ---
const getElement = (selector, isArray = false) => {
    return isArray ? gsap.utils.toArray(selector) : document.querySelector(selector);
};

// =========================================================================
//         SOVEREIGN BLUEPRINT: FUNCTION DEFINITIONS
// =========================================================================

// Hero actor animation setup
const setupHeroActor = (elements, masterTl) => {
    Oracle.group("Hero Actor Animation Setup");
    masterTl
        .to(elements.heroActor, { rotationY: 120, rotationX: 10, scale: 1.1, ease: "power2.inOut" }, 0)
        .to(elements.heroActor, { rotationY: -120, rotationX: -20, scale: 1.2, ease: "power2.inOut" }, "1");
    Oracle.report("Hero actor sequence integrated into master timeline.");
    Oracle.groupEnd();
};

// Replace this function
// SOVEREIGN PROTOCOL: The "Unbroken Chain" for Text Pillars
const setupTextPillars = (elements, masterTl) => {
    Oracle.group("Text Pillar 'Unbroken Chain' Setup");

    // Establish Authoritative JS Initial State to prevent CSS race conditions
    gsap.set(elements.pillars, { autoAlpha: 0 }); 
    gsap.set(elements.pillars[0], { autoAlpha: 1 });
    gsap.set(elements.textWrappers, { y: 40, rotationX: -15 }); 
    gsap.set(elements.textWrappers[0], { y: 0, rotationX: 0 });
    Oracle.log(elements.pillars[0], "Pillar 1 Initial State (JS Authoritative)");

    // The single, monolithic animation chain.
    // FIX v43.2: Timings are now more spaced out for a smoother feel.
    // The relative position markers '<' ensure perfect sequence.
    masterTl
        // Transition 1 -> 2 (Starts at timeline position 1.0s)
        .to(elements.textWrappers[0], { y: -40, rotationX: 15, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 1.0)
        .set(elements.pillars[1], { autoAlpha: 1 }, "<+=0.25")     // Show new
        .from(elements.textWrappers[1], { 
            y: 40, rotationX: -15, autoAlpha: 0, duration: 0.5, ease: "power2.out",
            // FIX v43.2: "Idempotent Covenant" - `once: true` ensures this log only ever fires ONCE.
            onStart: () => Oracle.log(elements.pillars[1], "Pillar 2 Activated"),
            once: true 
        }, "<")

        // Transition 2 -> 3 (Starts at timeline position 3.0s)
        .to(elements.textWrappers[1], { y: -40, rotationX: 15, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 3.0)
        .set(elements.pillars[2], { autoAlpha: 1 }, "<+=0.25")
        .from(elements.textWrappers[2], { 
            y: 40, rotationX: -15, autoAlpha: 0, duration: 0.5, ease: "power2.out",
            // FIX v43.2: "Idempotent Covenant"
             onStart: () => Oracle.log(elements.pillars[2], "Pillar 3 Activated"),
             once: true
        }, "<");
    
    // Let the animations dictate the total duration naturally.
    Oracle.report(`Unbroken Chain timeline for pillars constructed. Natural duration: ${masterTl.duration()}s`);
    Oracle.groupEnd();
};


// Replace the 'matchMedia' section inside setupAnimations()
ScrollTrigger.matchMedia({
    '(min-width: 1025px)': () => {
        Oracle.report("Protocol engaged for desktop. Constructing unified timeline.");

        // FIX v43.2: Synchronized the pin and scrub end points for perfect alignment.
        // 'bottom bottom' is the most robust way to ensure the animation lasts exactly
        // as long as the trigger element is scrolling through the viewport.
        const triggerConfig = {
            trigger: elements.textCol,
            start: 'top top',
            end: 'bottom bottom', // Use the same end for both for perfect sync
        };

        ScrollTrigger.create({
            ...triggerConfig, // Spread the shared config
            pin: elements.visualsCol,
            onToggle: self => Oracle.updateHUD('c-master-st-active', self.isActive ? 'PIN_ACTIVE' : 'PIN_INACTIVE', self.isActive ? '#A3BE8C' : '#BF616A'),
        });

        const masterStoryTl = gsap.timeline({
            scrollTrigger: {
                ...triggerConfig, // Spread the shared config
                scrub: 1.5,
                onUpdate: (self) => {
                    Oracle.updateHUD('c-rot-x', gsap.getProperty(elements.heroActor, "rotationX").toFixed(1));
                    Oracle.updateHUD('c-rot-y', gsap.getProperty(elements.heroActor, "rotationY").toFixed(1));
                    Oracle.updateHUD('c-scale', gsap.getProperty(elements.heroActor, "scale").toFixed(2));
                    Oracle.updateHUD('c-scroll', `${(self.progress * 100).toFixed(0)}%`);
                    Oracle.trackScrollTrigger(self, "Unified Story Controller");
                }
            }
        });

        setupHeroActor(elements, masterStoryTl);
        setupTextPillars(elements, masterStoryTl);
        setupHandoff(elements, masterStoryTl); 
    },
    '(max-width: 1024px)': () => {
        Oracle.report("Sovereign Protocol STANDBY. No scrollytelling animations on mobile view.");
    }
});


// =========================================================================
//         SOVEREIGN ARCHITECTURE v43.2: UNIFIED & BENCHMARKED NARRATIVE
// =========================================================================
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin);
    console.clear();
    Oracle.report(`Sovereign Build v43.2 Initialized. Verbosity: ${Oracle.config.verbosity}. Use ?oracle_verbosity=2 for max scrutiny.`);
    
    // The gsap.context(// =========================================================================
//         SOVEREIGN ARCHITECTURE v43.2: UNIFIED & BENCHMARKED NARRATIVE
// =========================================================================
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin);
    console.clear();
    Oracle.report(`Sovereign Build v43.2 Initialized. Verbosity: ${Oracle.config.verbosity}. Use ?oracle_verbosity=2 for max scrutiny.`);
    
    // The gsap.context() function is the key to robust, resize-safe animations.
    // It keeps all our selectors and animations contained.
    const ctx = gsap.context(() => {
        Oracle.runSelfDiagnostic();

        // ** 'elements' is defined HERE, inside the GSAP context. **
        // Any code that uses 'elements' must also be inside this context function.
        const elements = {
            heroActor: getElement('#actor-3d'),
            stuntActor: getElement('#actor-3d-stunt-double'),
            stuntActorFaces: getElement('#actor-3d-stunt-double .face:not(.front)', true),
            placeholder: getElement('#summary-placeholder'),
            pillars: getElement('.pillar-text-content', true),
            textWrappers: getElement('.text-anim-wrapper', true),
            visualsCol: getElement('.pillar-visuals-col'),
            textCol: getElement('.pillar-text-col'),
            handoffPoint: getElement('#handoff-point')
        };
        
        if (Object.values(elements).some(el => !el || (Array.isArray(el) && !el.length))) {
            Oracle.warn('SOVEREIGN ABORT: Missing critical elements. Halting animation setup.');
            return;
        }
        Oracle.report("All Sovereign components verified and locked.");
        Oracle.updateHUD('c-st-instances', ScrollTrigger.getAll().length);

        // ** The matchMedia call is placed HERE, correctly inside the context **
        // This gives its inner functions access to the 'elements' object defined above.
        ScrollTrigger.matchMedia({
            '(min-width: 1025px)': () => {
                Oracle.report("Protocol engaged for desktop. Constructing unified timeline.");

                // Use a shared config for the trigger and pin to ensure they are
                // perfectly synchronized for the entire scroll distance.
                const triggerConfig = {
                    trigger: elements.textCol,
                    start: 'top top',
                    end: 'bottom bottom',
                };

                ScrollTrigger.create({
                    ...triggerConfig,
                    pin: elements.visualsCol,
                    onToggle: self => Oracle.updateHUD('c-master-st-active', self.isActive ? 'PIN_ACTIVE' : 'PIN_INACTIVE', self.isActive ? '#A3BE8C' : '#BF616A'),
                });

                const masterStoryTl = gsap.timeline({
                    scrollTrigger: {
                        ...triggerConfig,
                        scrub: 1.5,
                        onUpdate: (self) => {
                            Oracle.updateHUD('c-rot-x', gsap.getProperty(elements.heroActor, "rotationX").toFixed(1));
                            Oracle.updateHUD('c-rot-y', gsap.getProperty(elements.heroActor, "rotationY").toFixed(1));
                            Oracle.updateHUD('c-scale', gsap.getProperty(elements.heroActor, "scale").toFixed(2));
                            Oracle.updateHUD('c-scroll', `${(self.progress * 100).toFixed(0)}%`);
                            Oracle.trackScrollTrigger(self, "Unified Story Controller");
                        }
                    }
                });

                // These functions will be called correctly and can access the timeline
                setupHeroActor(elements, masterStoryTl);
                setupTextPillars(elements, masterStoryTl); // This now contains the 'once: true' fix
                setupHandoff(elements, masterStoryTl); 
            },
            '(max-width: 1024px)': () => {
                Oracle.report("Sovereign Protocol STANDBY. No scrollytelling animations on mobile view.");
            }
        });
    }); // --- END GSAP CONTEXT ---

    return ctx; // Return the context so it can be cleaned up on resize
}

// =========================================================================
//         INITIALIZATION SEQUENCE (RESIZE-ROBUST)
// =========================================================================
let gsapCtx; // Global variable to hold our GSAP context

function setupSiteLogic() {
    const menuOpen = getElement('#menu-open-button');
    const menuClose = getElement('#menu-close-button');
    if (menuOpen && menuClose) {
        menuOpen.addEventListener('click', () => document.documentElement.classList.add('menu-open'));
        menuClose.addEventListener('click', () => document.documentElement.classList.remove('menu-open'));
    }
    const yearEl = getElement('#current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    Oracle.report("Site logic initialized.");
}

function initialAnimationSetup() {
    Oracle.init(() => {
        if (window.gsap && window.ScrollTrigger && window.Flip && window.MorphSVGPlugin) {
            
            // THE DEFINITIVE FIX: REVERT & CLEANUP
            // Before we set up new animations, we revert any old ones from a
            // previous state (like after a page resize). This prevents state
            // pollution and ensures all calculations are fresh and correct.
            if (gsapCtx) {
                gsapCtx.revert();
                Oracle.warn("SOVEREIGN REVERT: Previous GSAP context purged for resize.");
            }
            
            // Now we run the setup fresh and store the new context in our variable.
            Oracle.performance.benchmark('Sovereign Animation Architecture Setup', () => {
                 gsapCtx = setupAnimations(); 
            });

        } else {
            Oracle.runSelfDiagnostic();
            Oracle.warn("CRITICAL FAILURE: GSAP libraries failed to load. SOVEREIGN protocol aborted.");
        }
    });
}

// --- Event Listeners ---
document.addEventListener("DOMContentLoaded", setupSiteLogic);
window.addEventListener("load", initialAnimationSetup);

// THE DEFINITIVE RESIZE FIX: Use ScrollTrigger's built-in, debounced resize event
// to re-run the entire setup. This is efficient and robust.
ScrollTrigger.addEventListener("resize", initialAnimationSetup);
