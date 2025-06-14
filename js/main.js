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

        // Group 1: Check external libraries
        groupMethod('%c1. Dependency Verification', 'color: #EBCB8B;');
            check(window.gsap, 'GSAP Core: FOUND', 'GSAP Core: MISSING!');
            check(window.ScrollTrigger, 'ScrollTrigger Plugin: FOUND', 'ScrollTrigger Plugin: MISSING!');
            check(window.Flip, 'Flip Plugin: FOUND', 'Flip Plugin: MISSING!');
            check(window.MorphSVGPlugin, 'MorphSVG Plugin: FOUND', 'MorphSVG Plugin: MISSING!');
        console.groupEnd();
        
        // Group 2: Check the DOM for expected elements
        groupMethod('%c2. Environment Sanity Check (DOM Integrity)', 'color: #EBCB8B;');
            const pillarCount = document.querySelectorAll('.pillar-text-content').length;
            const handoffPoint = document.getElementById('handoff-point');
            const heroActor = document.getElementById('actor-3d');
            const stuntActor = document.getElementById('actor-3d-stunt-double');
            check(pillarCount > 0, `Pillars Found: ${pillarCount}`, 'CRITICAL: No pillar text content found!');
            check(handoffPoint, 'Handoff Point: FOUND', 'CRITICAL: Handoff point element not found!');
            check(heroActor, 'Hero Actor: FOUND', 'CRITICAL: Hero Actor element not found!');
            check(stuntActor, 'Stunt Double: FOUND', 'CRITICAL: Stunt Double element not found!');
        console.groupEnd();
        
        // Group 3: Verify CSS integrity for animations
        groupMethod('%c3. CSS Protocol Verification', 'color: #EBCB8B;');
            const firstPillar = document.querySelector('.pillar-text-content');
            if(firstPillar) {
                const firstPillarOpacity = window.getComputedStyle(firstPillar).opacity;
                 check(
                    firstPillarOpacity === '1', 
                    'FOUC Fix (Pillar 1): Correctly Visible.', 
                    `FOUC Anomaly: Pillar 1 opacity is ${firstPillarOpacity}, should be 1.`
                );
            }
            const visualsCol = document.querySelector('.pillar-visuals-col');
            if(visualsCol) {
                const pointerEvents = window.getComputedStyle(visualsCol).pointerEvents;
                check(
                    pointerEvents === 'none',
                    'Interaction Fix: Visuals column has correct pointer-events.',
                    'Interaction Anomaly: Visuals column may block clicks!'
                );
            }
        console.groupEnd();

        if (allOk) {
            Oracle.updateHUD('c-validation-status', 'PASSED', '#A3BE8C');
            Oracle.report("Sovereign Integrity Protocol: All checks passed. System is nominal.");
        } else {
            Oracle.updateHUD('c-validation-status', 'FAILED', '#BF616A');
            Oracle.warn("Sovereign Integrity Protocol: One or more critical checks failed! Animation stability is compromised.");
        }
        
        console.groupEnd(); // End main diagnostic group
    },
    
    // Guaranteed Initialization Sequence
    init: (callback) => {
        const storedVerbosity = localStorage.getItem('oracleVerbosity');
        if (storedVerbosity !== null) Oracle.config.verbosity = parseInt(storedVerbosity, 10);
        
        const urlParams = new URLSearchParams(window.location.search);
        const urlVerbosity = urlParams.get('oracle_verbosity');
        if (urlVerbosity !== null && urlVerbosity !== '') {
            const parsedVerbosity = parseInt(urlVerbosity, 10);
            if (!isNaN(parsedVerbosity)) {
                Oracle.config.verbosity = parsedVerbosity;
                localStorage.setItem('oracleVerbosity', parsedVerbosity);
            }
        }
        
        if(callback && typeof callback === 'function') callback();
    },

    _timestamp: () => new Date().toLocaleTimeString('en-US', { hour12: false }),

    log: (el, label) => {
        if (Oracle.config.verbosity < 2) return;
        if (!el) { console.error(`%c[ORACLE LOG @ ${Oracle._timestamp()}: ${label}] ERROR - Element is null.`, 'color: #BF616A;'); return; }
        console.groupCollapsed(`%c[ORACLE LOG @ ${Oracle._timestamp()}: ${label}]`, 'color: #D81B60; font-weight: bold;');
        const style = window.getComputedStyle(el);
        const transform = {
            scale: gsap.getProperty(el, "scale"),
            rotationX: gsap.getProperty(el, "rotationX"),
            rotationY: gsap.getProperty(el, "rotationY"),
            x: gsap.getProperty(el, "x"),
            y: gsap.getProperty(el, "y"),
        };
        const bounds = el.getBoundingClientRect();
        console.log(`%c  - Target:`, 'color: #81A1C1;', `${el.tagName}#${el.id || '.'+el.className.split(' ')[0]}`);
        console.log(`%c  - GSAP Transform:`, 'color: #81A1C1;', `x: ${transform.x}, y: ${transform.y}, RotX: ${transform.rotationX.toFixed(2)}, RotY: ${transform.rotationY.toFixed(2)}, Scale: ${transform.scale.toFixed(2)}`);
        console.log(`%c  - CSS Style:`, 'color: #81A1C1;', `{ Opacity: ${style.opacity}, Visibility: ${style.visibility} }`);
        console.log(`%c  - Bounding Box:`, 'color: #81A1C1;', `{ X: ${bounds.left.toFixed(1)}, Y: ${bounds.top.toFixed(1)}, W: ${bounds.width.toFixed(1)}, H: ${bounds.height.toFixed(1)} }`);
        console.groupEnd();
    },
    
    scan: (label, data) => {
        if (Oracle.config.verbosity < 1) return;
        const groupMethod = Oracle.config.verbosity >= 2 ? console.group : console.groupCollapsed;
        groupMethod(`%c[ORACLE SCAN @ ${Oracle._timestamp()}: ${label}]`, 'color: #B48EAD; font-weight: normal;');
        for (const key in data) console.log(`%c  - ${key}:`, 'color: #88C0D0;', data[key]);
        console.groupEnd();
    },
    
    group: (label) => { if (Oracle.config.verbosity < 1) return; console.group(`%c[ORACLE ACTION @ ${Oracle._timestamp()}: ${label}]`, 'color: #A3BE8C; font-weight: bold;'); },
    groupEnd: () => { if (Oracle.config.verbosity < 1) return; console.groupEnd(); },

    trackScrollTrigger: (stInstance, label) => {
        if (Oracle.config.verbosity < 2 || !stInstance) return; // Only log this detailed view on highest verbosity
        console.groupCollapsed(`%c[ORACLE ST_TRACK @ ${Oracle._timestamp()}: ${label}]`, 'color: #EBCB8B; font-weight: bold;');
        const triggerEl = stInstance.trigger;
        console.log(`%c  - Status:`, 'color: #88C0D0;', `Active: ${stInstance.isActive}, Direction: ${stInstance.direction === 1 ? 'DOWN' : (stInstance.direction === -1 ? 'UP' : 'STATIC')}`);
        console.log(`%c  - Progress:`, 'color: #88C0D0;', `${(stInstance.progress * 100).toFixed(2)}%`);
        console.log(`%c  - Element:`, 'color: #88C0D0;', `${triggerEl.tagName}#${triggerEl.id || '.' + triggerEl.className.split(' ')[0]}`);
        console.log(`%c  - Range (px):`, 'color: #88C0D0;', `Start: ${stInstance.start.toFixed(0)}, End: ${stInstance.end.toFixed(0)}`);
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
    const result = isArray ? gsap.utils.toArray(selector) : document.querySelector(selector);
    if (!result || (isArray && !result.length)) {
        // This will be caught by the Oracle's diagnostic check, but is good practice.
        return isArray ? [] : null;
    }
    return result;
};


// =========================================================================
//         SOVEREIGN BLUEPRINT: FUNCTION DEFINITIONS
// =========================================================================

// Hero actor animation setup (adds tweens to the master timeline)
const setupHeroActor = (elements, masterTl) => {
    Oracle.group("Hero Actor Animation Setup");
    masterTl
        .to(elements.heroActor, {
            rotationY: 120, rotationX: 10, scale: 1.1, ease: "power2.inOut", duration: 2
        }, 0) // Starts at time 0
        .to(elements.heroActor, {
            rotationY: -120, rotationX: -20, scale: 1.2, ease: "power2.inOut", duration: 2
        }, 2); // Starts at time 2
    Oracle.report("Hero actor rotation sequence integrated into master timeline.");
    Oracle.groupEnd();
};

// SOVEREIGN PROTOCOL: The "Unbroken Chain" for Text Pillars
const setupTextPillars = (elements, masterTl) => {
    Oracle.group("Text Pillar 'Unbroken Chain' Setup");

    // Establish Authoritative JS Initial State to prevent CSS race conditions
    gsap.set(elements.pillars, { autoAlpha: 0 }); 
    gsap.set(elements.pillars[0], { autoAlpha: 1 });
    gsap.set(elements.textWrappers, { y: 40, rotationX: -15 }); 
    gsap.set(elements.textWrappers[0], { y: 0, rotationX: 0 });
    Oracle.log(elements.pillars[0], "Pillar 1 Initial State (JS Authoritative)");

    // The single, monolithic animation chain. No ambiguity, no race conditions.
    masterTl
        // Transition 1 -> 2 (starts at timeline position 1.0s)
        .to(elements.textWrappers[0], { y: -40, rotationX: 15, duration: 0.5, ease: "power2.in" }, 1.0)
        .set(elements.pillars[0], { autoAlpha: 0 }, ">-=0.25") // Hide old
        .set(elements.pillars[1], { autoAlpha: 1 }, "<")     // Show new
        .from(elements.textWrappers[1], { y: 40, rotationX: -15, duration: 0.5, ease: "power2.out", 
            onStart: () => Oracle.log(elements.pillars[1], "Pillar 2 Activated")
        }, "<")

        // Transition 2 -> 3 (starts at timeline position 3.0s)
        .to(elements.textWrappers[1], { y: -40, rotationX: 15, duration: 0.5, ease: "power2.in" }, 3.0)
        .set(elements.pillars[1], { autoAlpha: 0 }, ">-=0.25")
        .set(elements.pillars[2], { autoAlpha: 1 }, "<")
        .from(elements.textWrappers[2], { y: 40, rotationX: -15, duration: 0.5, ease: "power2.out",
             onStart: () => Oracle.log(elements.pillars[2], "Pillar 3 Activated")
        }, "<");
    
    Oracle.report("Unbroken Chain timeline for pillars constructed.");
    Oracle.groupEnd();
};

// SOVEREIGN PROTOCOL: The "Absorption & Morph" Handoff
const setupHandoff = (elements, masterStoryTl) => {
    Oracle.group("Handoff Protocol Setup ('Absorption & Morph')");

    let isAbsorbed = false;
    // The final SVG path shape for the logo
    const logoPathData = "M81.5,1.5 C125.8,1.5 161.5,37.2 161.5,81.5 C161.5,125.8 125.8,161.5 81.5,161.5 C37.2,161.5 1.5,125.8 1.5,81.5 C1.5,37.2 37.2,1.5 81.5,1.5 Z";

    ScrollTrigger.create({
        trigger: elements.handoffPoint,
        start: 'top 70%', 
        onToggle: self => Oracle.updateHUD('c-handoff-st-active', self.isActive ? 'ACTIVE' : 'INACTIVE', self.isActive ? '#A3BE8C' : '#BF616A'),
        
        onEnter: () => {
            if (isAbsorbed) return;
            isAbsorbed = true;
            
            Oracle.group('ABSORPTION PROTOCOL INITIATED');
            Oracle.updateHUD('c-swap-flag', 'ABSORBED', '#EBCB8B');
            Oracle.updateHUD('c-event', 'STATE CAPTURE & TELEPORT');

            masterStoryTl.scrollTrigger.disable(false); // Disable scrub, but keep position
            Oracle.warn('Master ScrollTrigger DISABLED for handoff.');
            
            ScrollTrigger.refresh(true);
            
            // 1. Capture the exact state of the Hero Actor
            const heroState = {
                scale: gsap.getProperty(elements.heroActor, "scale"),
                rotationX: gsap.getProperty(elements.heroActor, "rotationX"),
                rotationY: gsap.getProperty(elements.heroActor, "rotationY"),
            };
            Oracle.scan('Hero Actor State Vector (Pre-Absorption)', heroState);
            
            // 2. Capture the destination state using Flip
            const state = Flip.getState(elements.stuntActor, { props: "transform, opacity" });
            
            // 3. Teleport the Stunt Double and match Hero's state
            gsap.set(elements.stuntActor, {
                autoAlpha: 1,
                x: elements.heroActor.getBoundingClientRect().left - elements.placeholder.getBoundingClientRect().left,
                y: elements.heroActor.getBoundingClientRect().top - elements.placeholder.getBoundingClientRect().top,
                scale: heroState.scale,
                rotationX: heroState.rotationX,
                rotationY: heroState.rotationY,
            });
            Oracle.log(elements.stuntActor, "Stunt Double State (Teleported & Matched)");
            gsap.to(elements.heroActor, { autoAlpha: 0, duration: 0.1 });
            
            // 4. Create the multi-stage absorption timeline
            const absorptionTl = gsap.timeline({
                onComplete: () => {
                    Oracle.report('Absorption & Morph Complete. System Stabilized.');
                    Oracle.updateHUD('c-event', 'STABILIZED / LOGO');
                    Oracle.groupEnd();
                }
            });

            Oracle.report('Phase 2: Initiating FLIP travel, morph, and stabilization.');
            absorptionTl
                // Travel from hero's position to the placeholder
                .add(Flip.from(state, { 
                    targets: elements.stuntActor, 
                    duration: 1.2, 
                    ease: 'power3.inOut',
                    onUpdate: function() { // Provides the "absurd scrutiny" on the animation path
                         Oracle.scan('Absorption Vector Trace', { 
                            'Progress': `${(this.progress() * 100).toFixed(1)}%`,
                            'X': gsap.getProperty(elements.stuntActor, 'x').toFixed(1),
                            'Y': gsap.getProperty(elements.stuntActor, 'y').toFixed(1),
                            'Scale': gsap.getProperty(elements.stuntActor, 'scale').toFixed(2),
                            'RotY': gsap.getProperty(elements.stuntActor, 'rotationY').toFixed(1) 
                        });
                    } 
                }))
                // While travelling, flatten the 3D rotation and morph into the logo
                .to(elements.stuntActor, { rotationX: 0, rotationY: 0, z: 0, duration: 0.8, ease: "power3.inOut" }, 0.2)
                .to('#morph-path', { morphSVG: logoPathData, duration: 0.8, ease: 'power3.inOut' }, 0.2)
                .to(elements.stuntActorFaces, { opacity: 0, duration: 0.4, stagger: 0.05 }, 0.1);
        },

        onLeaveBack: () => {
            if (!isAbsorbed) return;
            isAbsorbed = false;

            Oracle.group('REVERSE PROTOCOL INITIATED (FORCED RESET)');
            Oracle.updateHUD('c-swap-flag', 'REVERSING', '#BF616A');
            Oracle.updateHUD('c-event', 'RESTORING HERO');

            gsap.killTweensOf([elements.stuntActor, '#morph-path', elements.heroActor]);
            
            // Forcefully reset everything to its starting state
            gsap.set(elements.stuntActor, { autoAlpha: 0, clearProps: "all" });
            gsap.set(elements.heroActor, { autoAlpha: 1 });
            gsap.set('#morph-path', { morphSVG: "M0,0 H200 V200 H0 Z" }); // Reset to square
            
            masterStoryTl.scrollTrigger.enable();
            Oracle.warn('Master ScrollTrigger RE-ENABLED.');
            Oracle.log(elements.heroActor, "Hero Actor State (Forcefully Restored)");

            Oracle.groupEnd();
        },
    });
    Oracle.groupEnd();
};

// =========================================================================
//         SOVEREIGN ARCHITECTURE v43.1: UNIFIED & BENCHMARKED NARRATIVE
// =========================================================================
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin);
    console.clear();
    Oracle.report(`Sovereign Build v43.1 Initialized. Verbosity: ${Oracle.config.verbosity}. Use ?oracle_verbosity=2 for max scrutiny.`);
    let ctx;
    
    Oracle.performance.benchmark('Sovereign Animation Architecture Setup', () => {
        ctx = gsap.context(() => {
            Oracle.runSelfDiagnostic();

            const elements = {
                heroActor: getElement('#actor-3d'),
                stuntActor: getElement('#actor-3d-stunt-double'),
                placeholder: getElement('#summary-placeholder'),
                stuntActorFaces: getElement('#actor-3d-stunt-double .face:not(.front)', true),
                pillars: getElement('.pillar-text-content', true),
                textWrappers: getElement('.text-anim-wrapper', true),
                visualsCol: getElement('.pillar-visuals-col'),
                textCol: getElement('.pillar-text-col'),
                handoffPoint: getElement('#handoff-point')
            };
            
            // Halts if diagnostic checks fail (e.g., missing elements)
            if (Object.values(elements).some(el => !el || (Array.isArray(el) && !el.length))) {
                Oracle.warn('SOVEREIGN ABORT: Missing critical elements. Halting animation setup.');
                return;
            }
            Oracle.report("All Sovereign components verified and locked.");
            Oracle.updateHUD('c-st-instances', ScrollTrigger.getAll().length);

            ScrollTrigger.matchMedia({
                '(min-width: 1025px)': () => {
                    Oracle.report("Protocol engaged for desktop. Constructing unified timeline.");

                    // Pinner for the visuals
                    ScrollTrigger.create({
                        trigger: elements.textCol,
                        pin: elements.visualsCol,
                        start: 'top top',
                        end: 'bottom bottom',
                        onToggle: self => Oracle.updateHUD('c-master-st-active', self.isActive ? 'PIN_ACTIVE' : 'PIN_INACTIVE', self.isActive ? '#A3BE8C' : '#BF616A'),
                    });

                    // The Master Timeline that controls the entire story
                    const masterStoryTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: elements.textCol,
                            start: 'top top',
                            end: 'bottom bottom',
                            scrub: 1.5,
                            onUpdate: (self) => {
                                // Update HUD with real-time data from the animating hero
                                Oracle.updateHUD('c-rot-x', gsap.getProperty(elements.heroActor, "rotationX").toFixed(1));
                                Oracle.updateHUD('c-rot-y', gsap.getProperty(elements.heroActor, "rotationY").toFixed(1));
                                Oracle.updateHUD('c-scale', gsap.getProperty(elements.heroActor, "scale").toFixed(2));
                                Oracle.updateHUD('c-scroll', `${(self.progress * 100).toFixed(0)}%`);
                                Oracle.trackScrollTrigger(self, "Unified Story Controller");
                            }
                        }
                    });

                    // Add animation chapters to the master timeline
                    setupHeroActor(elements, masterStoryTl);
                    setupTextPillars(elements, masterStoryTl);
                    setupHandoff(elements, masterStoryTl); // Handoff now listens independently but is aware of the master
                },
                '(max-width: 1024px)': () => {
                    Oracle.report("Sovereign Protocol STANDBY. No scrollytelling animations on mobile view.");
                }
            });
            
        }); // End GSAP Context
    }); // End Performance Benchmark
    return ctx; // Return context for cleanup if needed
}

// --- INITIALIZATION SEQUENCE ---

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

// Ensure Oracle config is ready FIRST, then run animations
function initialAnimationSetup() {
    // We initialize the Oracle, and PASS the main animation function
    // as a callback. This guarantees order of operations.
    Oracle.init(() => {
        if (window.gsap && window.ScrollTrigger && window.Flip && window.MorphSVGPlugin) {
            setupAnimations(); 
        } else {
            Oracle.runSelfDiagnostic(); // Run diagnostic even on failure to report what's missing
            Oracle.warn("CRITICAL FAILURE: GSAP libraries failed to load. SOVEREIGN protocol aborted.");
        }
    });
}

// Bind Listeners
document.addEventListener("DOMContentLoaded", setupSiteLogic);
window.addEventListener("load", initialAnimationSetup);
