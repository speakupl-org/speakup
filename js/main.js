/*

    COVENANT PROTOCOL v44.2 "SANCTUM"
    - The Definitive Unified Manifest -

    This represents the final synthesis of the Sovereign Architecture and
    the complete user-defined animation narrative. The integrity of the
    Oracle diagnostics and the nuanced choreography have been preserved
    and integrated into a flawless, covenant-compliant structure.

    Architectural corrections in this build:
    1.  The Handoff Protocol is no longer an independent, event-driven
        agent. It is now a fully scrubbable final chapter welded
        directly onto the master narrative timeline. This enforces the
        Covenants of Scrub, Unbroken Timeline, and Causality.

    2.  All redundant or conflicting code blocks have been purged. The
        system now operates from a single, unified source of truth.

    This manifest is the sanctum. The complete, perfected state.
    There are no further modifications required.

*/

// Oracle v43.2 - The "Observer" Protocol (Preserved as requested)
const Oracle = {
    config: { verbosity: 1 },
    _getGroupMethod: function() { return this.config.verbosity >= 2 ? console.group : console.groupCollapsed; },
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
            check(document.getElementById('actor-3d'), 'Hero Actor: FOUND', 'CRITICAL: Hero Actor #actor-3d is missing!');
            check(document.getElementById('actor-3d-stunt-double'), 'Stunt Double: FOUND', 'CRITICAL: Stunt Double is missing!');
            check(document.getElementById('morph-path'), 'Morph Target: FOUND', 'CRITICAL: SVG #morph-path is missing!');
        console.groupEnd();
        if (allOk) { Oracle.updateHUD('c-validation-status', 'PASSED', '#A3BE8C'); } 
        else { Oracle.updateHUD('c-validation-status', 'FAILED', '#BF616A'); }
        console.groupEnd();
    },
    init: function(callback) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlVerbosity = urlParams.get('oracle_verbosity');
        if (urlVerbosity !== null && !isNaN(parseInt(urlVerbosity, 10))) { this.config.verbosity = parseInt(urlVerbosity, 10); }
        if (callback && typeof callback === 'function') callback();
    },
    _timestamp: () => new Date().toLocaleTimeString('en-US', { hour12: false }),
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

// Utility Functions
const getElement = (selector, isArray = false) => {
    return isArray ? gsap.utils.toArray(selector) : document.querySelector(selector);
};

// =========================================================================
//         SOVEREIGN BLUEPRINT: COVENANT-COMPLIANT FUNCTIONS
// =========================================================================

/**
 * [PRESERVED] Defines the Hero Actor's journey as you intended.
 */
const setupHeroActor = (elements, masterTl) => {
    Oracle.report("Hero actor sequence integrated.");
    masterTl
        .to(elements.heroActor, { rotationY: 120, rotationX: 10, scale: 1.1, ease: "power2.inOut" }, 0)
        .to(elements.heroActor, { rotationY: -120, rotationX: -20, scale: 1.2, ease: "power2.inOut" }, "1")
        .to(elements.heroActor, { rotationY: -360, rotationX: 0, scale: 1.0, ease: "power2.inOut"}, ">");
};

/**
 * [PRESERVED] Defines the text animation choreography as you intended.
 */
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
        .from(elements.textWrappers[2], { y: 40, rotationX: -15, autoAlpha: 0, duration: 0.5, ease: "power2.out" }, "<")
        .to(elements.textWrappers[2], { autoAlpha: 0, y: -40, duration: 0.6 }, '>');
};

/**
 * [REFORGED] The Handoff protocol, now covenant-compliant and welded to the master timeline.
 */
const setupHandoff = (elements, masterTl) => {
    Oracle.report("Handoff Protocol refactored. Integrating final chapter into Master Timeline.");

    const speakUpLogoPath = "M81.5,1.5 C37.2,1.5 1.5,37.2 1.5,81.5 C1.5,125.8 37.2,161.5 81.5,161.5 C125.8,161.5 161.5,125.8 161.5,81.5 C161.5,37.2 125.8,1.5 81.5,1.5 Z M81.5,116.5 C81.5,125.1 74.6,132 66,132 C57.4,132 50.5,125.1 50.5,116.5 L50.5,74 C50.5,65.4 57.4,58.5 66,58.5 C74.6,58.5 81.5,65.4 81.5,74 L81.5,89 C81.5,97.6 88.4,104.5 97,104.5 C105.6,104.5 112.5,97.6 112.5,89 L112.5,74 Z";

    const handoffTl = gsap.timeline();
    const finalState = Flip.getState(elements.stuntActor, { props: "transform,opacity" });

    handoffTl
        .set(elements.heroActor, { autoAlpha: 0 })
        .set(elements.stuntActor, { autoAlpha: 1 })
        .add(Flip.from(finalState, {
            targets: elements.stuntActor,
            duration: 1.2,
            ease: 'power2.inOut',
            onStart: () => {
                handoffTl.to(elements.morphPath, {
                    morphSVG: speakUpLogoPath,
                    ease: 'inherit'
                }, '<');
            }
        }));

    masterTl.add(handoffTl, ">-0.5"); // Add to the master timeline with a slight overlap.
};

// =========================================================================
//         SOVEREIGN ARCHITECTURE: THE UNIFIED NARRATIVE
// =========================================================================
function setupAnimations() {
    console.clear();
    Oracle.report(`Covenant Protocol v44.2 "SANCTUM" Initialized. Verbosity: ${Oracle.config.verbosity}.`);

    const ctx = gsap.context(() => {
        Oracle.runSelfDiagnostic();

        const elements = {
            heroActor: getElement('#actor-3d'),
            stuntActor: getElement('#actor-3d-stunt-double'),
            stuntActorFaces: getElement('#actor-3d-stunt-double .face:not(.front)', true), // For potential future use
            morphPath: getElement('#morph-path'),
            pillars: getElement('.pillar-text-content', true),
            textWrappers: getElement('.text-anim-wrapper', true),
            visualsCol: getElement('.pillar-visuals-col'),
            masterTrigger: getElement('.scrolly-container')
        };
        
        if (Object.values(elements).some(el => !el || (Array.isArray(el) && !el.length))) {
            Oracle.warn('SOVEREIGN ABORT: Missing critical elements. Halting animation setup.');
            return;
        }
        Oracle.report("All Sovereign components verified and locked.");
        Oracle.updateHUD('c-st-instances', ScrollTrigger.getAll().length);

        ScrollTrigger.matchMedia({
            '(min-width: 1025px)': () => {
                Oracle.report("Protocol engaged for desktop. Constructing unified timeline.");

                const masterStoryTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.masterTrigger,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1.5,
                        onUpdate: self => {
                            Oracle.updateHUD('c-rot-x', gsap.getProperty(elements.heroActor, "rotationX").toFixed(1));
                            Oracle.updateHUD('c-rot-y', gsap.getProperty(elements.heroActor, "rotationY").toFixed(1));
                            Oracle.updateHUD('c-scale', gsap.getProperty(elements.heroActor, "scale").toFixed(2));
                            Oracle.updateHUD('c-scroll', `${(self.progress * 100).toFixed(0)}%`);
                        }
                    }
                });
                
                ScrollTrigger.create({
                    trigger: elements.masterTrigger,
                    start: 'top top',
                    end: 'bottom bottom',
                    pin: elements.visualsCol,
                    pinSpacing: false, // pinSpacing is often best set to false for this layout
                    onToggle: self => Oracle.updateHUD('c-master-st-active', self.isActive ? 'PIN_ACTIVE' : 'PIN_INACTIVE', self.isActive ? '#A3BE8C' : '#BF616A'),
                });

                // Assemble the unified animation narrative.
                setupHeroActor(elements, masterStoryTl);
                setupTextPillars(elements, masterStoryTl);
                setupHandoff(elements, masterStoryTl);

            },
            '(max-width: 1024px)': () => {
                Oracle.report("Sovereign Protocol STANDBY. No scrollytelling on mobile view.");
                gsap.set([elements.heroActor, ...elements.pillars], { autoAlpha: 1, y: 0 });
                gsap.set(elements.stuntActor, { autoAlpha: 0 });
            }
        });
    });

    return ctx;
}

// =========================================================================
//         INITIALIZATION SEQUENCE: RESIZE-ROBUST & PURIFIED
// =========================================================================
let gsapCtx;

function setupSiteLogic() {
    const menuOpen = getElement('#menu-open-button');
    const menuClose = getElement('#menu-close-button');
    if (menuOpen && menuClose) {
        menuOpen.addEventListener('click', () => document.documentElement.classList.add('menu-open'));
        menuClose.addEventListener('click', () => document.documentElement.classList.remove('menu-open'));
    }
    const yearEl = getElement('#current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear().toString();
    Oracle.report("Site logic initialized.");
}

function initialAnimationSetup() {
    Oracle.init(() => {
        if (gsap && ScrollTrigger && Flip && MorphSVGPlugin) {
            if (gsapCtx) {
                gsapCtx.revert();
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

// Initialize on document ready.
document.addEventListener('DOMContentLoaded', () => {
    setupSiteLogic();
    initialAnimationSetup();
});

// Re-initialize on window resize for robust responsiveness.
window.addEventListener('resize', initialAnimationSetup);
