/*

THE DEFINITIVE COVENANT BUILD v43.2 - "Sovereign" Protocol (Synchronized & Fortified)

This definitive version introduces a robust diagnostic framework, "The Oracle," providing
granular, contextual, and performance-aware insights into the animation lifecycle.

It also resolves a core architectural flaw by refactoring the pillar text animations 
into a single, monolithic "Unbroken Chain" on the master timeline, ensuring absolute 
logical consistency and eliminating potential recursion or race conditions.

NEW v43.2: The Handoff Protocol is now a reversible, state-aware sequence integrated 
directly into the master timeline's end-of-life, utilizing GSAP Flip for a seamless 
"absorption" effect followed by a MorphSVG transformation.

The Resize Protocol has been fortified with GSAP's context() and revert() methods,
ensuring absolute stability and eliminating state pollution on viewport changes.

*/

// Oracle v43.2 - The "Observer" Protocol Upgrade
const Oracle = {
    config: {
        verbosity: 1, // ?oracle_verbosity=2 for max detail.
    },
    _getGroupMethod: function() {
        return this.config.verbosity >= 2 ? console.group : console.groupCollapsed;
    },
    performance: {
        benchmark: function(label, functionToTest) {
            if (Oracle.config.verbosity < 1) { functionToTest(); return; }
            const group = Oracle._getGroupMethod();
            const startTime = performance.now();
            functionToTest();
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(3);
            const color = duration < 50 ? '#A3BE8C' : (duration < 200 ? '#EBCB8B' : '#BF616A');
            group(`%c[ORACLE BENCHMARK @ ${Oracle._timestamp()}: ${label}]`, 'color: #8FBCBB; font-weight: bold;');
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
            if (condition) { console.log(`  %c✅ ${okMsg}`, 'color: #A3BE8C;'); } 
            else { console.log(`  %c❌ ${failMsg}`, 'color: #BF616A; font-weight: bold;'); allOk = false; }
            return condition;
        };
        group('%c1. Dependency Verification', 'color: #EBCB8B;');
            check(window.gsap, 'GSAP Core: FOUND', 'GSAP Core: MISSING!');
            check(window.ScrollTrigger, 'ScrollTrigger Plugin: FOUND', 'ScrollTrigger Plugin: MISSING!');
            check(window.Flip, 'Flip Plugin: FOUND', 'Flip Plugin: MISSING!');
            check(window.MorphSVGPlugin, 'MorphSVG Plugin: FOUND', 'MorphSVG Plugin: MISSING!');
        console.groupEnd();
        group('%c2. DOM Integrity Check', 'color: #EBCB8B;');
            check(document.querySelectorAll('.pillar-text-content').length > 0, 'Pillars: FOUND', 'CRITICAL: No pillar text elements found!');
            check(document.getElementById('handoff-point'), 'Handoff Point: FOUND', 'CRITICAL: Handoff point #handoff-point is missing!');
            check(document.getElementById('actor-3d'), 'Hero Actor: FOUND', 'CRITICAL: Hero Actor #actor-3d is missing!');
            check(document.getElementById('actor-3d-stunt-double'), 'Stunt Double: FOUND', 'CRITICAL: Stunt Double is missing!');
            check(document.getElementById('summary-placeholder'), 'Placeholder: FOUND', 'CRITICAL: Absorption placeholder is missing!');
            check(document.getElementById('morph-path'), 'Morph Target: FOUND', 'CRITICAL: SVG #morph-path is missing! The final logo will not appear.');
        console.groupEnd();
        if (allOk) { Oracle.updateHUD('c-validation-status', 'PASSED', '#A3BE8C'); } 
        else { Oracle.updateHUD('c-validation-status', 'FAILED', '#BF616A'); }
        console.groupEnd();
    },
    init: function(callback) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlVerbosity = urlParams.get('oracle_verbosity');
        if (urlVerbosity !== null && !isNaN(parseInt(urlVerbosity, 10))) {
            this.config.verbosity = parseInt(urlVerbosity, 10);
        }
        if (callback && typeof callback === 'function') callback();
    },
    _timestamp: () => new Date().toLocaleTimeString('en-US', { hour12: false }),
    log: function(el, label) {
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
    trackScrollTrigger: function(stInstance, label) {
        if (this.config.verbosity < 2 || !stInstance) return;
        const currentProgress = (stInstance.progress * 100).toFixed(0);
        if (currentProgress === (stInstance._lastProgress || '')) return;
        stInstance._lastProgress = currentProgress;
        const group = this._getGroupMethod();
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

const setupHeroActor = (elements, masterTl) => {
    Oracle.report("Hero actor sequence integrated.");
    masterTl
        .to(elements.heroActor, { rotationY: 120, rotationX: 10, scale: 1.1, ease: "power2.inOut" }, 0)
        .to(elements.heroActor, { rotationY: -120, rotationX: -20, scale: 1.2, ease: "power2.inOut" }, "1");
};

const setupTextPillars = (elements, masterTl) => {
    Oracle.report("Text pillar 'Unbroken Chain' integrated.");
    gsap.set(elements.pillars, { autoAlpha: 0 });
    gsap.set(elements.pillars[0], { autoAlpha: 1 });
    gsap.set(elements.textWrappers, { y: 40, rotationX: -15 });
    gsap.set(elements.textWrappers[0], { y: 0, rotationX: 0 });

    masterTl
        .to(elements.textWrappers[0], { y: -40, rotationX: 15, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 1.0)
        .set(elements.pillars[1], { autoAlpha: 1 }, "<+=0.25")
        .from(elements.textWrappers[1], { y: 40, rotationX: -15, autoAlpha: 0, duration: 0.5, ease: "power2.out" }, "<")
        .to(elements.textWrappers[1], { y: -40, rotationX: 15, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 3.0)
        .set(elements.pillars[2], { autoAlpha: 1 }, "<+=0.25")
        .from(elements.textWrappers[2], { y: 40, rotationX: -15, autoAlpha: 0, duration: 0.5, ease: "power2.out" }, "<");
};

// NEW: The Absorption & Morph Protocol
const setupHandoff = (elements) => {
    Oracle.report("Handoff Protocol: Absorption & Morph sequence armed.");

    // This is the shape of your final logo. You can get this from a vector editor like Illustrator or Figma.
    const speakUpLogoPath = "M81.5,1.5 C37.2,1.5 1.5,37.2 1.5,81.5 C1.5,125.8 37.2,161.5 81.5,161.5 C125.8,161.5 161.5,125.8 161.5,81.5 C161.5,37.2 125.8,1.5 81.5,1.5 Z M81.5,116.5 C81.5,125.1 74.6,132 66,132 C57.4,132 50.5,125.1 50.5,116.5 L50.5,74 C50.5,65.4 57.4,58.5 66,58.5 C74.6,58.5 81.5,65.4 81.5,74 L81.5,116.5 Z M112.5,74 C112.5,65.4 105.6,58.5 97,58.5 C88.4,58.5 81.5,65.4 81.5,74 L81.5,89 C81.5,97.6 88.4,104.5 97,104.5 C105.6,104.5 112.5,97.6 112.5,89 L112.5,74 Z";

    // A separate timeline for the morph ensures it can be controlled independently.
    const morphTl = gsap.timeline({ paused: true });
    morphTl.to(elements.morphPath, {
        duration: 0.8,
        morphSVG: speakUpLogoPath,
        ease: "power3.inOut"
    });

    ScrollTrigger.create({
        trigger: elements.handoffPoint,
        start: "top bottom", // When the handoff point enters the bottom of the viewport
        end: "bottom top", // Keep it active until it leaves the top
        onToggle: self => Oracle.updateHUD('c-handoff-st-active', self.isActive ? 'ACTIVE' : 'INACTIVE', self.isActive ? '#A3BE8C' : '#BF616A'),
        
        onEnter: () => {
            Oracle.updateHUD('c-handoff-state', 'ENGAGED', '#EBCB8B');
            Oracle.updateHUD('c-event', 'ABSORPTION INITIATED');
            
            // 1. Get the current state of the Hero Actor
            const state = Flip.getState(elements.heroActor, { props: "transform,opacity" });

            // 2. Hide the Hero and place the Stunt Double in its exact spot
            gsap.set(elements.heroActor, { autoAlpha: 0 });
            gsap.set(elements.stuntActor, { autoAlpha: 1, zIndex: 100 });
            
            // This places the stunt double in the final layout but records its starting position from the state
            Flip.from(state, {
                targets: elements.stuntActor,
                duration: 1.2,
                ease: "power2.inOut",
                onStart: () => Oracle.log(elements.stuntActor, "FLIP Animation Started"),
                onComplete: () => {
                    Oracle.log(elements.morphPath, "MORPH Animation Triggered");
                    Oracle.updateHUD('c-event', 'MORPHING...');
                    morphTl.play();
                },
                // This "nested" tween runs at the same time as the Flip
                // It makes the cube "collapse" into its front face
                absolute: true, // IMPORTANT: Allows independent tweening during the flip
                nested: true,
                tween: gsap.to(elements.stuntActorFaces, {
                    autoAlpha: 0,
                    duration: 0.6,
                    stagger: 0.05
                })
            });
        },
        onLeaveBack: () => {
            Oracle.updateHUD('c-handoff-state', 'DISENGAGED', '#BF616A');
            Oracle.updateHUD('c-event', 'REVERSAL');
            
            // In reverse, just reset everything cleanly
            gsap.set(elements.heroActor, { autoAlpha: 1 });
            gsap.set(elements.stuntActor, { autoAlpha: 0, zIndex: 1 });
            gsap.to(elements.stuntActorFaces, { autoAlpha: 1, duration: 0.1 }); // Reset faces for next time
            morphTl.reverse();
        },
    });
};


// =========================================================================
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

        // ** Elements defined inside the context, accessible by all nested functions.
        const elements = {
            heroActor: getElement('#actor-3d'),
            stuntActor: getElement('#actor-3d-stunt-double'),
            stuntActorFaces: getElement('#actor-3d-stunt-double .face:not(.front)', true),
            morphPath: getElement('#morph-path'),
            placeholder: getElement('#summary-placeholder'),
            pillars: getElement('.pillar-text-content', true),
            textWrappers: getElement('.text-anim-wrapper', true),
            visualsCol: getElement('.pillar-visuals-col'),
            textCol: getElement('.pillar-text-col'),
            handoffPoint: getElement('#handoff-point'),
            masterTrigger: getElement('.scrolly-container')
        };
        
        if (Object.values(elements).some(el => !el || (Array.isArray(el) && !el.length))) {
            Oracle.warn('SOVEREIGN ABORT: Missing critical elements. Halting animation setup.');
            return;
        }
        Oracle.report("All Sovereign components verified and locked.");
        Oracle.updateHUD('c-st-instances', ScrollTrigger.getAll().length);

        // *** CRITICAL FIX: `matchMedia` is now INSIDE the GSAP context ***
        // This ensures it has access to the `elements` object and gets properly
        // cleaned up by the context's `revert()` method on resize.
        ScrollTrigger.matchMedia({
            '(min-width: 1025px)': () => {
                Oracle.report("Protocol engaged for desktop. Constructing unified timeline.");

                const triggerConfig = {
                    trigger: elements.masterTrigger,
                    start: 'top top',
                    end: 'bottom bottom-=1px', // End 1px before the absolute bottom
                    scrub: 1.5,
                };

                const masterStoryTl = gsap.timeline({
                    scrollTrigger: {
                        ...triggerConfig,
                        onUpdate: (self) => {
                            Oracle.updateHUD('c-rot-x', gsap.getProperty(elements.heroActor, "rotationX").toFixed(1));
                            Oracle.updateHUD('c-rot-y', gsap.getProperty(elements.heroActor, "rotationY").toFixed(1));
                            Oracle.updateHUD('c-scale', gsap.getProperty(elements.heroActor, "scale").toFixed(2));
                            Oracle.updateHUD('c-scroll', `${(self.progress * 100).toFixed(0)}%`);
                            Oracle.trackScrollTrigger(self, "Unified Story Controller");
                        }
                    }
                });
                
                // Pinning is a separate ScrollTrigger
                ScrollTrigger.create({
                    trigger: triggerConfig.trigger,
                    start: triggerConfig.start,
                    end: triggerConfig.end,
                    pin: elements.visualsCol,
                    pinSpacing: false,
                    onToggle: self => Oracle.updateHUD('c-master-st-active', self.isActive ? 'PIN_ACTIVE' : 'PIN_INACTIVE', self.isActive ? '#A3BE8C' : '#BF616A'),
                });

                // Assemble the animation
                setupHeroActor(elements, masterStoryTl);
                setupTextPillars(elements, masterStoryTl);
                setupHandoff(elements); // Handoff now manages its own trigger

            },
            '(max-width: 1024px)': () => {
                Oracle.report("Sovereign Protocol STANDBY. No scrollytelling on mobile view.");
                 // Ensure cube and path are in a sensible default state for mobile
                gsap.set(elements.heroActor, { autoAlpha: 1 });
                gsap.set(elements.stuntActor, { autoAlpha: 0 });
            }
        });
    }); // --- END GSAP CONTEXT ---

    return ctx; // Return the context for cleanup
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
        if (gsap && ScrollTrigger && Flip && MorphSVGPlugin) {
            if (gsapCtx) {
                gsapCtx.revert(); // THE DEFINITIVE REVERT
                Oracle.warn("SOVEREIGN REVERT: Previous GSAP context purged for resize.");
            }
            Oracle.performance.benchmark('Sovereign Animation Architecture Setup', () => {
                 gsapCtx = setupAnimations(); 
            });
        } else {
            Oracle.runSelfDiagnostic();
            Oracle.warn("CRITICAL FAILURE: GSAP libraries failed to load. Protocol aborted.");
        }
    });
}

// --- Event Listeners ---
document.addEventListener("DOMContentLoaded", setupSiteLogic);
window.addEventListener("load", initialAnimationSetup);
ScrollTrigger.addEventListener("resize", initialAnimationSetup);
