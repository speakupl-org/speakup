/*

THE DEFINITIVE COVENANT BUILD v43.1 - "Sovereign" Protocol (Synchronized & Fortified)

This definitive version introduces a robust diagnostic framework, "The Oracle," providing
granular, contextual, and performance-aware insights into the animation lifecycle.

It also resolves a core architectural flaw by refactoring the pillar text animations 
into a single, monolithic "Unbroken Chain" on the master timeline, ensuring absolute 
logical consistency and eliminating potential recursion or race conditions.

The Handoff Protocol is now correctly synchronized with the master timeline's
ScrollTrigger, resolving a critical state management vulnerability.

*/

// Oracle v43.1 - The "Sovereign" Protocol with Performance, Integrity & Covenant Sub-protocols
const Oracle = {
    // Configuration Sub-protocol
    config: {
        verbosity: 1, // Default: 0=silent, 1=collapsed logs, 2=expanded logs
    },

    // <<<< NEW SOVEREIGN PROTOCOL UPGRADE >>>>
    // The Performance Sub-protocol for monitoring execution bottlenecks.
    performance: {
        benchmark: (label, functionToTest) => {
            // If verbosity is 0, just run the function without measurement.
            if (Oracle.config.verbosity < 1) {
                functionToTest();
                return;
            }
            const startTime = performance.now();
            functionToTest(); // Execute the function
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(3);
            const color = duration < 50 ? '#A3BE8C' : (duration < 200 ? '#EBCB8B' : '#BF616A');
            
            console.log(
                `%c[ORACLE BENCHMARK @ ${Oracle._timestamp()}: ${label}] - %cExecution Time: ${duration}ms`,
                'color: #8FBCBB; font-weight: bold;',
                `color: ${color}; font-weight: normal;`
            );
        }
    },
    
    // Integrity Protocol for environment and dependency verification.
    runSelfDiagnostic: () => {
        if (Oracle.config.verbosity < 1) return;

        const groupMethod = Oracle.config.verbosity >= 2 ? console.group : console.groupCollapsed;
        // Main group for the entire diagnostic
        console.group(`%c[ORACLE SELF-DIAGNOSTIC (SOVEREIGN INTEGRITY PROTOCOL)]`, 'color: #D08770; font-weight: bold;');

        // Group 1: Check external libraries
        groupMethod('%c1. Dependency Verification', 'color: #EBCB8B;');
            const checkDep = (lib, name) => console.log(`  - ${name}:`, lib ? '%c✅ FOUND' : '%c❌ MISSING!', lib ? 'color: #A3BE8C;' : 'color: #BF616A; font-weight: bold;');
            checkDep(window.gsap, 'GSAP Core');
            checkDep(window.ScrollTrigger, 'ScrollTrigger Plugin');
            checkDep(window.Flip, 'Flip Plugin');
        console.groupEnd();
        
        // Group 2: Check Oracle's own methods
        groupMethod('%c2. Oracle Internal Integrity', 'color: #EBCB8B;');
            const expectedMethods = ['init', '_timestamp', 'log', 'scan', 'group', 'groupEnd', 'report', 'warn', 'updateHUD', 'trackScrollTrigger', 'runSelfDiagnostic', 'performance'];
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

        // Group 3: Check the DOM for expected elements
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
        
        console.groupEnd(); // End main diagnostic group
    },
    
    // Guaranteed Initialization Sequence
    init: (callback) => {
        // Priority: URL parameter > localStorage > Default
        const storedVerbosity = localStorage.getItem('oracleVerbosity');
        if (storedVerbosity !== null) Oracle.config.verbosity = parseInt(storedVerbosity, 10);
        
        const urlParams = new URLSearchParams(window.location.search);
        const urlVerbosity = urlParams.get('oracle_verbosity');
        if (urlVerbosity !== null && urlVerbosity !== '') {
            const parsedVerbosity = parseInt(urlVerbosity, 10);
            if (!isNaN(parsedVerbosity)) Oracle.config.verbosity = parsedVerbosity;
        }
        
        // Now that config is locked, execute the main application logic
        if(callback && typeof callback === 'function') callback();
    },

    _timestamp: () => new Date().toLocaleTimeString('en-US', { hour12: false }),

    // Detailed element state logger
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
        console.log(`%c  - Target:`, 'color: #81A1C1;', `${el.tagName}#${el.id || '.'+el.className.split(' ')[0]}`);
        console.log(`%c  - GSAP Transform:`, 'color: #81A1C1;', `{ RotX: ${transform.rotationX.toFixed(2)}, RotY: ${transform.rotationY.toFixed(2)}, Scale: ${transform.scale.toFixed(2)}, Z: ${transform.z.toFixed(2)} }`);
        console.log(`%c  - CSS Style:`, 'color: #81A1C1;', `{ Opacity: ${style.opacity}, Visibility: ${style.visibility} }`);
        console.log(`%c  - Bounding Box:`, 'color: #81A1C1;', `{ X: ${bounds.left.toFixed(1)}, Y: ${bounds.top.toFixed(1)}, W: ${bounds.width.toFixed(1)}, H: ${bounds.height.toFixed(1)} }`);
        console.log(`%c  - Page Scroll:`, 'color: #81A1C1;', `${(window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100).toFixed(1)}%`);
        console.groupEnd();
    },
    
    // Simple key-value data logger
    scan: (label, data) => {
        if (Oracle.config.verbosity < 1) return;
        const groupMethod = Oracle.config.verbosity >= 2 ? console.group : console.groupCollapsed;
        groupMethod(`%c[ORACLE SCAN @ ${Oracle._timestamp()}: ${label}]`, 'color: #B48EAD; font-weight: normal;');
        for (const key in data) console.log(`%c  - ${key}:`, 'color: #88C0D0;', data[key]);
        console.groupEnd();
    },
    
    // Grouping for narrative flow in console
    group: (label) => {
        if (Oracle.config.verbosity < 1) return;
        console.group(`%c[ORACLE ACTION @ ${Oracle._timestamp()}: ${label}]`, 'color: #A3BE8C; font-weight: bold;');
    },
    
    groupEnd: () => { if (Oracle.config.verbosity < 1) return; console.groupEnd(); },

    // Dedicated ScrollTrigger instance tracker
    trackScrollTrigger: (stInstance, label) => {
        if (Oracle.config.verbosity < 1 || !stInstance) return;
        const groupMethod = Oracle.config.verbosity >= 2 ? console.group : console.groupCollapsed;
        groupMethod(`%c[ORACLE ST_TRACK @ ${Oracle._timestamp()}: ${label}]`, 'color: #EBCB8B; font-weight: bold;');
        const triggerEl = stInstance.trigger;
        const totalDistance = stInstance.end - stInstance.start;
        console.log(`%c  - Status:`, 'color: #88C0D0;', `Active: ${stInstance.isActive}, Direction: ${stInstance.direction === 1 ? 'DOWN' : (stInstance.direction === -1 ? 'UP' : 'STATIC')}`);
        console.log(`%c  - Trigger Element:`, 'color: #88C0D0;', `${triggerEl.tagName}#${triggerEl.id || '.' + triggerEl.className.split(' ')[0]}`);
        console.log(`%c  - Pixel Range:`, 'color: #88C0D0;', `Start: ${stInstance.start.toFixed(0)}px, End: ${stInstance.end.toFixed(0)}px`);
        console.log(`%c  - Total Distance:`, 'color: #88C0D0;', `${totalDistance.toFixed(0)}px`);
        console.log(`%c  - Progress:`, 'color: #88C0D0;', `${(stInstance.progress * 100).toFixed(2)}%`);
        // Sentinel Warning System
        if (!stInstance._sentinelWarned) {
            const minSafeDistance = window.innerHeight * 1.5; // Warning if scroll area is less than 1.5x viewport height
            if (totalDistance < minSafeDistance && totalDistance > 0) {
                Oracle.warn(`SENTINEL ALERT for '${label}': Total scroll distance (${totalDistance.toFixed(0)}px) is less than 1.5x viewport height (${minSafeDistance.toFixed(0)}px). Animation may feel rushed or be difficult to control.`);
            }
            stInstance._sentinelWarned = true; // Only warn once per instance
        }
        console.groupEnd();
    },
    
    // General reporting and warnings
    report: (message) => console.log(`%c[SOVEREIGN REPORT @ ${Oracle._timestamp()}]:`, 'color: #5E81AC; font-weight: bold;', message),
    warn: (message) => console.warn(`%c[SOVEREIGN WARNING @ ${Oracle._timestamp()}]:`, 'color: #D08770;', message),
    
    // HUD updater utility
    updateHUD: (id, value, color = '#E5E9F0') => {
        const el = document.getElementById(id);
        if (el) { el.textContent = value; el.style.color = color; }
    }
};

// --- Utility Functions ---

const getElement = (selector, isArray = false) => {
    try {
        const result = isArray ? gsap.utils.toArray(selector) : document.querySelector(selector);
        if (!result || (isArray && !result.length)) throw new Error(`Element(s) not found for selector: ${selector}`);
        return result;
    } catch (e) {
        Oracle.warn(e.message);
        return isArray ? [] : null;
    }
};

// =========================================================================
//         SOVEREIGN BLUEPRINT: FUNCTION DEFINITIONS
// =========================================================================

// Hero actor animation setup (adds tweens to the master timeline)
const setupHeroActor = (elements, masterTl) => {
    masterTl
        .to(elements.heroActor, {
            rotationY: 120, rotationX: 10, scale: 1.1, ease: "power2.inOut", duration: 2
        })
        .to(elements.heroActor, {
            rotationY: -120, rotationX: -20, scale: 1.2, ease: "power2.inOut", duration: 2
        });
};


// =====================================================================================
//   THE DEFINITIVE BLUEPRINT for Text Pillars (v43.1 - COVENANT "Unbroken Chain")
// =====================================================================================
// This version resolves the logic freeze by constructing the entire narrative
// sequence as a single, monolithic, unbroken animation chain. This provides
// absolute clarity to the GSAP engine and prevents recursive calculation errors.
const setupTextPillars = (elements, masterTl) => {
    Oracle.group("Text Pillar Animation Setup");

    // 1. Establish Authoritative JS Initial State
    gsap.set(elements.pillars, { autoAlpha: 0, visibility: 'hidden' }); 
    gsap.set(elements.pillars[0], { autoAlpha: 1, visibility: 'visible' });
    gsap.set(elements.textWrappers, { y: 40, rotationX: -15 }); 
    gsap.set(elements.textWrappers[0], { y: 0, rotationX: 0 });

    Oracle.report("Initial pillar states set by JS.");
    
    // 2. CONSTRUCT THE UNBROKEN CHAIN.
    // All tweens are now part of a single, continuous command chain added to the master timeline.
    // This removes all logical ambiguity and guarantees a linear execution flow.
    masterTl
        // -- Transition 1: Pillar 1 to Pillar 2 (starts at timeline position 1.0s) --
        .to(elements.textWrappers[0], { y: -40, rotationX: 15, duration: 0.5, ease: "power2.in" }, 1.0)
        .set(elements.pillars[0], { autoAlpha: 0, visibility: 'hidden'}, '>-=0.25') // Hide old pillar
        .set(elements.pillars[1], { autoAlpha: 1, visibility: 'visible'}, '<') // Show new pillar
        .from(elements.textWrappers[1], { y: 40, rotationX: -15, duration: 0.5, ease: "power2.out" }, "<")

        // -- Transition 2: Pillar 2 to Pillar 3 (starts at timeline position 3.0s) --
        .to(elements.textWrappers[1], { y: -40, rotationX: 15, duration: 0.5, ease: "power2.in" }, 3.0)
        .set(elements.pillars[1], { autoAlpha: 0, visibility: 'hidden'}, '>-=0.25')
        .set(elements.pillars[2], { autoAlpha: 1, visibility: 'visible'}, '<')
        .from(elements.textWrappers[2], { y: 40, rotationX: -15, duration: 0.5, ease: "power2.out" }, "<");
    
    Oracle.report("Unbroken Chain timeline for pillars constructed and integrated.");
    Oracle.groupEnd();
};

// =========================================================================
//   REVISED "ABSORPTION PROTOCOL" HANDOFF (v43.1 - SYNCHRONIZED)
// =========================================================================
const setupHandoff = (elements, masterStoryTl) => {

    let isSwapped = false;
    let isReversing = false;
    Oracle.updateHUD('c-swap-flag', 'FALSE', '#BF616A');

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

            // THE FIX: Correctly disable the MASTER scrollTrigger instance.
            // This prevents the main scroll from interfering with our handoff animation.
            masterStoryTl.scrollTrigger.disable(false); // false = don't kill it
            Oracle.warn('Master ScrollTrigger DISABLED for handoff.');

            Oracle.report('Phase 1: Forcing ST update and capturing state vectors.');
            ScrollTrigger.refresh(true);

            const heroProps = {
                scale: gsap.getProperty(elements.heroActor, "scale"),
                rotationX: gsap.getProperty(elements.heroActor, "rotationX"),
                rotationY: gsap.getProperty(elements.heroActor, "rotationY")
            };
            Oracle.log(elements.heroActor, `Hero State (Pre-Absorption) | Captured RotY: ${heroProps.rotationY.toFixed(2)}`);

            const state = Flip.getState(elements.stuntActor, { props: "transform, opacity" });
            
            // Teleport stunt double to hero's position and match its transforms
            gsap.set(elements.stuntActor, {
                autoAlpha: 1,
                x: elements.heroActor.getBoundingClientRect().left - elements.placeholder.getBoundingClientRect().left,
                y: elements.heroActor.getBoundingClientRect().top - elements.placeholder.getBoundingClientRect().top,
                scale: heroProps.scale,
                rotationX: heroProps.rotationX,
                rotationY: heroProps.rotationY,
            });
            Oracle.log(elements.stuntActor, "Stunt Double State (Teleported & Matched)");
            
            const absorptionTl = gsap.timeline({
                onComplete: () => {
                    // THE FIX: Re-enable the MASTER scrollTrigger.
                    masterStoryTl.scrollTrigger.enable();
                    Oracle.report('Master ScrollTrigger RE-ENABLED.');
                    Oracle.updateHUD('c-event', 'STABILIZED / SCROLL ENABLED');
                    Oracle.log(elements.stuntActor, "Stunt Double State (Post-Absorption/Logo)");
                    Oracle.groupEnd(); // End "ABSORPTION PROTOCOL" group
                }
            });

            Oracle.report('Phase 2: Initiating travel and absorption sequence.');
            absorptionTl
                .add(Flip.from(state, { 
                    targets: elements.stuntActor, 
                    duration: 1.5, 
                    ease: 'power3.inOut',
                    onUpdate: function() {
                        Oracle.scan('Absorption Vector Trace', { 
                            'Target': 'Stunt Double', 
                            'Progress': `${(this.progress() * 100).toFixed(1)}%`,
                            'X': gsap.getProperty(elements.stuntActor, 'x').toFixed(1),
                            'Y': gsap.getProperty(elements.stuntActor, 'y').toFixed(1),
                            'Scale': gsap.getProperty(elements.stuntActor, 'scale').toFixed(2),
                            'RotY': gsap.getProperty(elements.stuntActor, 'rotationY').toFixed(1) 
                        });
                    } 
                }))
                .to(elements.heroActor, { autoAlpha: 0, scale: '-=0.1', duration: 0.4, ease: "power2.in" }, 0)
                .to(elements.stuntActorFaces, { opacity: 0, duration: 0.6, ease: "power2.in", stagger: 0.05 }, 0.6)
                .to(elements.placeholderClipper, { clipPath: "inset(20% 20% 20% 20%)", duration: 0.6, ease: 'expo.in' }, 0.7)
                .to(elements.stuntActor, { scaleX: 1.2, scaleY: 0.8, duration: 0.4, ease: 'circ.in' }, 0.9)
                .to(elements.placeholderClipper, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: 'elastic.out(1, 0.5)' }, 1.3)
                .to(elements.stuntActor, { scaleX: 1, scaleY: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }, 1.3)
                .to(elements.stuntActor, { rotationX: 0, rotationY: 0, z: 0, duration: 0.6, ease: "power3.inOut", onStart: () => Oracle.report('Phase 3: Initiating logo transformation.') }, '+=0.2')
                .call(() => {
                    elements.stuntActor.classList.add('is-logo-final-state');
                    Oracle.log(elements.stuntActor, "AEGIS Protocol Complete: Stunt Double is now the final logo.");
                }, [], '>');
        },

        onLeaveBack: () => {
            if (!isSwapped) return;
            isReversing = true; isSwapped = false;
            
            Oracle.group('REVERSE PROTOCOL INITIATED');
            Oracle.updateHUD('c-swap-flag', 'FALSE', '#BF616A');
            Oracle.updateHUD('c-event', 'REVERSING');
            elements.stuntActor.classList.remove('is-logo-final-state');
            
            // Kill any active tweens on the elements to prevent conflicts.
            gsap.killTweensOf([elements.stuntActor, elements.stuntActorFaces, elements.heroActor, elements.placeholderClipper]);
            
            Oracle.warn('Active handoff tweens terminated for reversal.');
            
            // Just snap back to the beginning state.
            const reversalTl = gsap.timeline({
                onComplete: () => {
                    isReversing = false;
                    masterStoryTl.scrollTrigger.update(); // Force an update to sync scroll position
                    Oracle.log(elements.heroActor, "Hero State (Restored)");
                    Oracle.groupEnd(); // End "REVERSE PROTOCOL" group
                }
            });

            // Clean up properties and visibility
            reversalTl
                .set(elements.stuntActor, { autoAlpha: 0 })
                .set(elements.stuntActorFaces, { clearProps: "opacity" })
                .set(elements.placeholderClipper, { clearProps: "clipPath" })
                .set(elements.heroActor, { autoAlpha: 1 });
        }
    });
};


// =========================================================================
//         SOVEREIGN ARCHITECTURE v43.1: UNIFIED & BENCHMARKED NARRATIVE
// =========================================================================

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    Oracle.report(`Sovereign Build v43.1 Initialized. Verbosity: ${Oracle.config.verbosity}. To change, use ?oracle_verbosity=2 in the URL.`);

    let ctx; 

    // WRAP ENTIRE SETUP IN THE NEW PERFORMANCE BENCHMARK
    Oracle.performance.benchmark('Sovereign Animation Architecture Setup', () => {
        
        ctx = gsap.context(() => {
            Oracle.runSelfDiagnostic();

            const elements = {
                heroActor: getElement('#actor-3d'), stuntActor: getElement('#actor-3d-stunt-double'),
                placeholder: getElement('#summary-placeholder'), placeholderClipper: getElement('.summary-thumbnail-clipper'),
                pillars: getElement('.pillar-text-content', true), textWrappers: getElement('.text-anim-wrapper', true),
                visualsCol: getElement('.pillar-visuals-col'), textCol: getElement('.pillar-text-col'),
                handoffPoint: getElement('#handoff-point'), stuntActorFaces: getElement('#actor-3d-stunt-double .face:not(.front)', true)
            };
            
            if (Object.values(elements).some(el => !el || (Array.isArray(el) && !el.length))) {
                Oracle.warn('SOVEREIGN ABORT: Missing critical elements. Halting animation setup.'); 
                return;
            }
            Oracle.report("All required Sovereign components verified and locked.");
    
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const scrubValue = prefersReducedMotion ? false : 1.5;
    
            ScrollTrigger.matchMedia({
                '(min-width: 1025px)': () => {
                    Oracle.report("Protocol (v43.1 - UNIFIED) engaged for desktop.");
                    
                    // The pinning ScrollTrigger is kept separate from the animation one. This is good.
                    ScrollTrigger.create({
                        trigger: elements.textCol, 
                        pin: elements.visualsCol,
                        start: 'top top', 
                        end: 'bottom bottom',
                        onToggle: self => Oracle.updateHUD('c-master-st-active', self.isActive ? 'PIN_ACTIVE' : 'PIN_INACTIVE', self.isActive ? '#A3BE8C' : '#BF616A'),
                    });
    
                    // === THE ONE MASTER STORY TIMELINE ===
                    // All scroll-based animations will be sequenced on this single timeline.
                    const masterStoryTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: elements.textCol,
                            start: 'top top',
                            end: 'bottom bottom',
                            scrub: scrubValue,
                            // This one onUpdate callback controls all primary logging.
                            onUpdate: (self) => {
                                // Update HUD with live values from hero actor
                                Oracle.updateHUD('c-rot-x', gsap.getProperty(elements.heroActor, "rotationX").toFixed(1));
                                Oracle.updateHUD('c-rot-y', gsap.getProperty(elements.heroActor, "rotationY").toFixed(1));
                                Oracle.updateHUD('c-scale', gsap.getProperty(elements.heroActor, "scale").toFixed(2));
                                Oracle.updateHUD('c-scroll', `${(self.progress * 100).toFixed(0)}%`);
    
                                // Throttle detailed logging for performance
                                if (self.progress.toFixed(2) !== (self._lastProgress || '')) {
                                     Oracle.trackScrollTrigger(self, "Unified Story Controller");
                                     self._lastProgress = self.progress.toFixed(2);
                                }
                            }
                        }
                    });
                    
                    // Call the "recipe" functions and feed them the ONE master timeline.
                    setupHeroActor(elements, masterStoryTl);
                    setupTextPillars(elements, masterStoryTl); // Now uses the corrected "Unbroken Chain" logic.
                    
                    // The handoff logic remains separate (as it's event-based), but it is
                    // given the master timeline so it knows what to disable/enable.
                    setupHandoff(elements, masterStoryTl); 
                },
                '(max-width: 1024px)': () => {
                    Oracle.report("Sovereign Protocol STANDBY. No animations on tablet/mobile view.");
                    // No animations for tablet/mobile, everything should just stack normally.
                }
            });
        });
    });

    return ctx;
}

// --- INITIALIZATION SEQUENCE ---

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

// REVISED sequence to ensure Oracle config is ready first.
function initialAnimationSetup() {
    if (window.gsap && window.ScrollTrigger && window.Flip) {
        // We initialize the Oracle, and PASS the main animation function
        // as a callback. This guarantees order of operations.
        Oracle.init(setupAnimations); 
    } else {
        Oracle.warn("CRITICAL FAILURE: GSAP libraries failed to load. SOVEREIGN protocol aborted.");
    }
}

// Bind listeners
document.addEventListener("DOMContentLoaded", setupSiteLogic);
window.addEventListener("load", initialAnimationSetup);
