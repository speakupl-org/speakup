/*

THE DEFINITIVE COVENANT BUILD v44 - "Omniscient" Protocol (Synchronized & Fortified)

This definitive version introduces a robust diagnostic framework, "The Oracle," providing
granular, contextual, and performance-aware insights into the animation lifecycle.

It resolves core architectural flaws by:
1.  Refactoring pillar text animations into a monolithic "Unbroken Chain" for logical consistency.
2.  Implementing a fully state-aware "Absorption & Morph" handoff protocol with a graceful
    reversal on scroll-back (`onLeaveBack`).
3.  Ensuring absolute resize robustness through a strict "Revert & Re-init" context management cycle.
4.  Adding Omniscient-level logging to trace object states, morphing, and state transitions.

*/

// Oracle v44.0 - The "Omniscient" Upgrade
const Oracle = {
    config: {
        verbosity: 1, // Default verbosity. 0=Silent, 1=Standard, 2=Scrutiny
    },

    // Centralized group method selector for consistency.
    _getGroupMethod: (level) => (level === 2 ? console.group : console.groupCollapsed),

    init: function (callback) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlVerbosity = urlParams.get('oracle_verbosity');
        if (urlVerbosity !== null && !isNaN(parseInt(urlVerbosity, 10))) {
            this.config.verbosity = parseInt(urlVerbosity, 10);
        }
        this.report(`Omniscient Protocol Initialized. Verbosity: ${this.config.verbosity}. Use ?oracle_verbosity=2 for max scrutiny.`);
        if (callback && typeof callback === 'function') callback();
    },

    _timestamp: () => new Date().toLocaleTimeString('en-US', { hour12: false }),
    
    // OMNISCIENT UPGRADE: More structured and informative logging groups.
    group: function(label) {
        if (this.config.verbosity < 1) return;
        this._getGroupMethod(1)(`%c[SOVEREIGN ACTION @ ${this._timestamp()}]%c ${label}`, 'color: #A3BE8C; font-weight: bold;', 'color: #ECEFF4;');
    },
    groupEnd: function() { if (this.config.verbosity < 1) console.groupEnd(); },

    // OMNISCIENT UPGRADE: Clearer separation of scan/log and better formatting.
    log: function(label, el) {
        if (this.config.verbosity < 2) return; // High-detail, only at level 2
        if (!el) { this.error(`Element is null for log: "${label}"`); return; }
        
        this._getGroupMethod(2)(`%c[ORACLE LOG @ ${this._timestamp()}: ${label}]`, 'color: #D81B60;');
        const style = window.getComputedStyle(el);
        const box = el.getBoundingClientRect();
        console.log(`%c  - Target:`, 'color: #81A1C1;', el);
        console.log(`%c  - GSAP BBox:`, 'color: #81A1C1;', `X: ${gsap.getProperty(el, "x")}, Y: ${gsap.getProperty(el, "y")}`);
        console.log(`%c  - DOM BBox:`, 'color: #81A1C1;', `L: ${box.left.toFixed(1)}, T: ${box.top.toFixed(1)}, W: ${box.width.toFixed(1)}, H: ${box.height.toFixed(1)}`);
        console.log(`%c  - CSS Display:`, 'color: #81A1C1;', `Opacity: ${style.opacity}, Visibility: ${style.visibility}, Display: ${style.display}`);
        console.groupEnd();
    },

    scan: function(label, data) {
        if (this.config.verbosity < 1) return;
        this._getGroupMethod(1)(`%c[ORACLE SCAN @ ${this._timestamp()}: ${label}]`, 'color: #B48EAD;');
        for (const key in data) {
          if(data.hasOwnProperty(key)) {
            console.log(`%c  - ${key}:`, 'color: #88C0D0;', data[key]);
          }
        }
        console.groupEnd();
    },

    trackScrollTrigger: function(stInstance, label) {
        if (this.config.verbosity < 2 || !stInstance) return;
        const currentProgress = (stInstance.progress * 100).toFixed(0);
        // FIX: Throttle log to prevent console spam. Only log on integer progress change.
        if (currentProgress !== stInstance._lastProgress) {
             this._getGroupMethod(2)(`%c[ORACLE ST_TRACK @ ${this._timestamp()}: ${label}]`, 'color: #EBCB8B; font-weight: bold;');
             console.log(`%c  - Status:`, 'color: #88C0D0;', `Active: ${stInstance.isActive}, Direction: ${stInstance.direction === 1 ? 'DOWN' : 'UP'}`);
             console.log(`%c  - Progress:`, 'color: #88C0D0;', `${(stInstance.progress * 100).toFixed(2)}%`);
             console.groupEnd();
             stInstance._lastProgress = currentProgress;
        }
    },

    // OMNISCIENT UPGRADE: Dedicated reporting methods.
    report: (message) => console.log(`%c[SOVEREIGN REPORT @ ${Oracle._timestamp()}]:`, 'color: #5E81AC; font-weight: bold;', message),
    warn: (message) => console.warn(`%c[SOVEREIGN WARNING @ ${Oracle._timestamp()}]:`, 'color: #D08770;', message),
    error: (message) => console.error(`%c[SOVEREIGN CRITICAL @ ${Oracle._timestamp()}]:`, 'color: #BF616A; font-weight: bold;', message),
    
    updateHUD: (id, value, color = '#E5E9F0') => {
        const el = document.getElementById(id);
        if (el) { el.textContent = value; el.style.color = color; }
    },
    
    runSelfDiagnostic: function(elements) {
        this.group('Running Self-Diagnostic (Omniscient Integrity Protocol)');
        this.updateHUD('c-validation-status', 'RUNNING...', '#EBCB8B');
        
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

        console.groupCollapsed('%c1. Dependency Verification', 'color: #EBCB8B;');
            check(window.gsap, 'GSAP Core: FOUND', 'GSAP Core: MISSING!');
            check(window.ScrollTrigger, 'ScrollTrigger Plugin: FOUND', 'ScrollTrigger Plugin: MISSING!');
            check(window.Flip, 'Flip Plugin: FOUND', 'Flip Plugin: MISSING!');
            check(window.MorphSVGPlugin, 'MorphSVG Plugin: FOUND', 'MorphSVG Plugin: MISSING!');
        console.groupEnd();
        
        console.groupCollapsed('%c2. DOM Integrity Check (Critical Elements)', 'color: #EBCB8B;');
            for (const key in elements) {
                const el = elements[key];
                const exists = Array.isArray(el) ? el.length > 0 : !!el;
                check(exists, `${key}: FOUND`, `CRITICAL: ${key} is missing!`);
            }
        console.groupEnd();
        
        this.updateHUD('c-validation-status', allOk ? 'PASSED' : 'FAILED', allOk ? '#A3BE8C' : '#BF616A');
        this.groupEnd();
        return allOk;
    }
};

// --- Utility Function ---
const getElement = (selector, isArray = false) => {
    return isArray ? gsap.utils.toArray(selector) : document.querySelector(selector);
};

// =========================================================================
//         SOVEREIGN BLUEPRINT: FUNCTION DEFINITIONS
// =========================================================================

const setupHeroActor = (elements, masterTl) => {
    Oracle.group("Hero Actor Animation Setup");
    masterTl
        .to(elements.heroActor, { rotationY: 120, rotationX: 10, scale: 1.1, ease: "power2.inOut" }, 0)
        .to(elements.heroActor, { rotationY: -120, rotationX: -20, scale: 1.2, ease: "power2.inOut" }, "2");
    Oracle.report("Hero actor sequence integrated.");
    Oracle.groupEnd();
};

const setupTextPillars = (elements, masterTl) => {
    Oracle.group("Text Pillar 'Unbroken Chain' Setup");
    // FIX: FOUC (Flash of Unstyled Content) is primarily a CSS concern now.
    // JS just needs to handle the animations. We set initial states for the animation itself.
    gsap.set(elements.textWrappers, { y: 40, rotationX: -15 }); 
    gsap.set(elements.textWrappers[0], { y: 0, rotationX: 0 });

    masterTl
        // Transition 1 -> 2
        .to(elements.textWrappers[0], { y: -40, rotationX: 15, duration: 0.5, ease: "power2.in" }, 1.0)
        .set(elements.pillars[0], { autoAlpha: 0 }, ">-=0.25")
        .set(elements.pillars[1], { autoAlpha: 1 }, "<")
        .from(elements.textWrappers[1], { y: 40, rotationX: -15, duration: 0.5, ease: "power2.out" }, "<")

        // Transition 2 -> 3
        .to(elements.textWrappers[1], { y: -40, rotationX: 15, duration: 0.5, ease: "power2.in" }, 3.0)
        .set(elements.pillars[1], { autoAlpha: 0 }, ">-=0.25")
        .set(elements.pillars[2], { autoAlpha: 1 }, "<")
        .from(elements.textWrappers[2], { y: 40, rotationX: -15, duration: 0.5, ease: "power2.out" }, "<");
    
    Oracle.report("Unbroken Chain timeline for pillars constructed.");
    Oracle.groupEnd();
};

// SOVEREIGN PROTOCOL: The "Absorption & Morph" Handoff (State-Aware)
const setupHandoff = (elements, masterStoryTl) => {
    Oracle.group("Handoff Protocol Setup ('Absorption & Morph')");

    // The shape of your final logo. A circle is a good example.
    const logoPathData = "M81.5,1.5 C125.8,1.5 161.5,37.2 161.5,81.5 C161.5,125.8 125.8,161.5 81.5,161.5 C37.2,161.5 1.5,125.8 1.5,81.5 C1.5,37.2 37.2,1.5 81.5,1.5 Z";
    const initialPathData = elements.morphPath.getAttribute('d'); // Read the initial state
    
    let handoffTl; // Timeline for the handoff animation itself
    
    // OMNISCIENT FIX: Centralized reset function for perfect state reversal.
    const resetHandoffState = () => {
        Oracle.group("Executing Handoff REVERSE Protocol");
        if(handoffTl) handoffTl.kill(); // Kill any active handoff animation
        
        // Reset the stunt double to its default hidden state
        gsap.set(elements.stuntActor, { autoAlpha: 0 });
        gsap.set(elements.morphPath, { morphSVG: initialPathData }); // Revert the morph
        
        // Make the hero visible again and remove the 'hiding' class
        gsap.set(elements.heroActor, { autoAlpha: 1 });
        elements.visualsCol.classList.remove('is-handing-off');
        
        // Re-enable the master scroll trigger so scrubbing works again
        if (masterStoryTl && masterStoryTl.scrollTrigger) {
             masterStoryTl.scrollTrigger.enable();
             Oracle.report('Master ScrollTrigger RE-ENABLED.');
        }

        Oracle.updateHUD('c-swap-flag', 'HERO', '#A3BE8C');
        Oracle.updateHUD('c-event', 'HERO RESTORED');
        Oracle.log("Hero Actor (Restored)", elements.heroActor);
        Oracle.groupEnd();
    };

    ScrollTrigger.create({
        trigger: elements.handoffPoint,
        start: 'top 80%', 
        onToggle: self => Oracle.updateHUD('c-handoff-st-active', self.isActive ? 'ACTIVE' : 'INACTIVE', self.isActive ? '#A3BE8C' : '#BF616A'),
        
        onEnter: () => {
            Oracle.group('ABSORPTION PROTOCOL INITIATED');
            Oracle.updateHUD('c-swap-flag', 'ABSORBED', '#EBCB8B');
            
            // Disable master scroll trigger during the automated handoff animation
            masterStoryTl.scrollTrigger.disable();
            Oracle.warn('Master ScrollTrigger DISABLED for handoff.');

            // Get hero's current state from the master timeline
            const heroState = {
                scale: gsap.getProperty(elements.heroActor, "scale"),
                rotationX: gsap.getProperty(elements.heroActor, "rotationX"),
                rotationY: gsap.getProperty(elements.heroActor, "rotationY"),
            };
            Oracle.scan('Hero Actor State Vector (Pre-Absorption)', heroState);
            
            // OMNISCIENT FIX: Hide the original Hero smoothly.
            // By adding the class first, we ensure it's hidden before the Flip calculation.
            elements.visualsCol.classList.add('is-handing-off');
            
            const state = Flip.getState(elements.stuntActor, { props: "transform, opacity" });
            
            // Move stunt double to placeholder, but give it the Hero's current transform state
            elements.placeholder.appendChild(elements.stuntActor);
            gsap.set(elements.stuntActor, {
                autoAlpha: 1,
                scale: heroState.scale,
                rotationX: heroState.rotationX,
                rotationY: heroState.rotationY,
                x: 0, y: 0, // Reset any previous transforms
            });

            Oracle.log("Stunt Double Pre-FLIP (Teleported)", elements.stuntActor);

            // The handoff animation timeline
            handoffTl = gsap.timeline({
                onComplete: () => {
                    Oracle.updateHUD('c-event', 'STABILIZED / LOGO');
                    Oracle.log("Stunt Double (Handoff Complete)", elements.stuntActor);
                    Oracle.groupEnd(); // End the "ABSORPTION PROTOCOL" group
                }
            });
            
            Oracle.report('Phase 2: FLIP travel, morph, and stabilization.');
            
            // FIX: The Flawless Morph & Absorption
            // Choreograph all tweens to happen together for a smooth transition.
            handoffTl
                .add(Flip.from(state, { 
                    targets: elements.stuntActor, 
                    duration: 1.2, 
                    ease: 'power3.inOut',
                }))
                // Animate rotation to 0 (flat) and hide non-front faces
                .to(elements.stuntActor, { rotationX: 0, rotationY: 0, scale: 1, duration: 1.0, ease: "power3.inOut" }, 0)
                .to(elements.stuntActorFaces, { opacity: 0, duration: 0.4 }, 0)
                // MORPH the path from a square to the logo shape
                .to(elements.morphPath, { morphSVG: logoPathData, duration: 0.8, ease: 'power3.inOut' }, 0.2);
        },

        // FIX: The State-Aware onLeaveBack
        onLeaveBack: () => {
            resetHandoffState();
        },
    });
    Oracle.groupEnd();
};

// =========================================================================
//         SOVEREIGN ARCHITECTURE v44: UNIFIED & BENCHMARKED
// =========================================================================
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin);
    
    let ctx;
    ctx = gsap.context(() => {
        const elements = {
            heroActor: getElement('#actor-3d'),
            stuntActor: getElement('#actor-3d-stunt-double'),
            placeholder: getElement('#summary-placeholder'),
            morphPath: getElement('#morph-path'), // CRITICAL: Target for MorphSVG
            stuntActorFaces: getElement('#actor-3d-stunt-double .face:not(.front)', true),
            pillars: getElement('.pillar-text-content', true),
            textWrappers: getElement('.text-anim-wrapper', true),
            visualsCol: getElement('.pillar-visuals-col'),
            textCol: getElement('.pillar-text-col'),
            handoffPoint: getElement('#handoff-point')
        };
        
        if (!Oracle.runSelfDiagnostic(elements)) {
            Oracle.error('SOVEREIGN ABORT: Critical elements missing. Halting setup.');
            return;
        }

        ScrollTrigger.matchMedia({
            '(min-width: 1025px)': () => {
                Oracle.report("Engaging Omniscient Protocol for desktop...");

                ScrollTrigger.create({
                    trigger: elements.textCol,
                    pin: elements.visualsCol,
                    start: 'top top',
                    end: 'bottom bottom',
                    onToggle: self => Oracle.updateHUD('c-master-st-active', self.isActive ? 'PIN_ACTIVE' : 'INACTIVE', self.isActive ? '#A3BE8C' : '#BF616A'),
                });

                const masterStoryTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.textCol,
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1.5,
                        onUpdate: (self) => {
                            Oracle.trackScrollTrigger(self, "Unified Story Controller");
                            Oracle.updateHUD('c-scroll', `${(self.progress * 100).toFixed(0)}%`);
                            if (self.isActive) {
                                Oracle.updateHUD('c-rot-x', gsap.getProperty(elements.heroActor, "rotationX").toFixed(1));
                                Oracle.updateHUD('c-rot-y', gsap.getProperty(elements.heroActor, "rotationY").toFixed(1));
                                Oracle.updateHUD('c-scale', gsap.getProperty(elements.heroActor, "scale").toFixed(2));
                            }
                        }
                    }
                });

                setupHeroActor(elements, masterStoryTl);
                setupTextPillars(elements, masterStoryTl);
                setupHandoff(elements, masterStoryTl);
                Oracle.report("Omniscient timeline fully constructed and deployed.");
            },
            '(max-width: 1024px)': () => {
                Oracle.report("Omniscient Protocol STANDBY. Mobile view detected.");
            }
        });
        
    }); // end gsap.context
    
    return ctx;
}

// --- INITIALIZATION SEQUENCE (RESIZE-ROBUST) ---

let gsapCtx; // Global variable to hold our GSAP context

function initialAnimationSetup() {
    Oracle.init(() => {
        // FIX: The Ironclad Resize & Context Purity
        if (gsapCtx) {
            Oracle.warn("SOVEREIGN REVERT: Purging previous GSAP context for resize/re-init.");
            gsapCtx.revert();
        }
        gsapCtx = setupAnimations();
    });
}

// Bind listeners
window.addEventListener("load", initialAnimationSetup);
ScrollTrigger.addEventListener("resize", initialAnimationSetup);
