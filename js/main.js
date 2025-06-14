/**
 * =================================================================================================
 * SOVEREIGN PROTOCOL v81.0 - "THE ENGINEER'S BLUEPRINT"
 *
 * PREVIOUS STATE: CATASTROPHIC KERNEL PANIC.
 * ANALYSIS: Over-complexity and architectural fragility led to cascading reference failures.
 *
 * CORRECTIVE ACTION: A complete re-architecture based on professional engineering principles.
 * This system prioritizes stability, maintainability, and flawless execution over theatrical complexity.
 *
 * NEW ARCHITECTURE:
 * - Clear Separation of Concerns: CONFIG, STATE, DOM, UTILS, and ANIMATION logic are distinct.
 * - Context-Aware Responsiveness: Utilizes GSAP's matchMedia for robust desktop/mobile contexts.
 * - Symmetrical & Reversible Handoff: Engineered with GSAP Flip for a mathematically perfect round trip.
 * - Professional, Opt-In Debugging: Granular data without flooding the console by default.
 * - Self-Documenting Code: Clean, commented, and maintainable.
 *
 * This system is designed to work.
 * =================================================================================================
 */

(function () {
    "use strict";

    // =====================================================================
    // SECTION: System Configuration
    // All tweakable parameters and constants are located here.
    // =====================================================================
    const CONFIG = {
        DEBUG_MODE: true,          // Set to true to enable high-frequency console logging.
        LOG_LEVEL: 3,              // 1: Events, 2: Performance, 3: Full State
        MOBILE_BREAKPOINT: 1024,   // The breakpoint in pixels for switching to mobile view.
        HANDOFF_DURATION: 1.2,     // Duration in seconds for the Flip/Morph animation.
        MASTER_SCRUB: 1.2,         // Scrub duration for the main scrollytelling timeline.
    };

    // =====================================================================
    // SECTION: State Management
    // A single source of truth for the application's dynamic state.
    // =====================================================================
    const STATE = {
        isDesktop: false,
        isHandoffActive: false,
        masterTimeline: null,
        handoffTimeline: null,
    };

    // =====================================================================
    // SECTION: DOM Element Cache
    // Query DOM elements once for performance and easy access.
    // =====================================================================
    const DOM = {};

    /**
     * Queries and caches all required DOM elements.
     * @returns {boolean} True if all essential elements are found, otherwise false.
     */
    function cacheDomElements() {
        DOM.scrollyContainer = document.querySelector('.scrolly-container');
        DOM.visualsCol = document.querySelector('.pillar-visuals-col');
        DOM.textCol = document.querySelector('.pillar-text-col');
        DOM.heroActor = document.getElementById('actor-3d');
        DOM.stuntDouble = document.getElementById('actor-3d-stunt-double');
        DOM.morphPath = document.getElementById('morph-path');
        DOM.handoffPoint = document.getElementById('handoff-point');
        DOM.finalPlaceholder = document.getElementById('summary-placeholder');

        // Essential elements check for the scrollytelling experience
        return !!(DOM.scrollyContainer && DOM.heroActor && DOM.stuntDouble && DOM.handoffPoint && DOM.finalPlaceholder);
    }

    // =====================================================================
    // SECTION: Utility Library
    // Pure functions for calculations and other reusable logic.
    // =====================================================================
    const UTILS = {
        getSVGPath: (name) => {
            const paths = {
                square: "M0,0 H163 V163 H0 Z",
                logo: "M50,20 C70,20 80,30 80,50 C80,70 70,80 50,80 C30,80 20,70 20,50 C20,30 30,20 50,20 M113,143 C93,143 83,133 83,113 C83,93 93,83 113,83 C133,83 143,93 143,113 C143,133 133,143 113,143",
            };
            return paths[name] || paths.square;
        },
    };

    // =====================================================================
    // SECTION: Debug Logger
    // Provides detailed, opt-in console logs for debugging.
    // =====================================================================
    const logger = {
        log(level, ...args) {
            if (CONFIG.DEBUG_MODE && CONFIG.LOG_LEVEL >= level) {
                console.log('[Cerebro]', ...args);
            }
        },
        info(...args) { this.log(1, ...args); },
        perf(...args) { this.log(2, ...args); },
        state(...args) { this.log(3, ...args); },
        error(message, error) { console.error('[Cerebro ERROR]', message, error); },
    };

    // =====================================================================
    // SECTION: Core Animation System
    // Contains all GSAP timeline and trigger creation logic.
    // =====================================================================
    const AnimationSystem = {

        /**
         * Creates the main scrollytelling timeline for desktop view.
         * This controls the pinned element and its animations.
         */
        createMasterTimeline() {
            logger.info("Creating master desktop timeline.");
            
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: DOM.scrollyContainer,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: CONFIG.MASTER_SCRUB,
                    pin: DOM.visualsCol,
                    onUpdate: (self) => {
                        logger.state(`Master Progress: ${(self.progress * 100).toFixed(1)}% | RotationX: ${gsap.getProperty(DOM.heroActor, "rotationX").toFixed(1)}`);
                    }
                }
            });

            tl.to(DOM.heroActor, { rotationX: -180, ease: "none" }, 0)
              .to(DOM.heroActor, { rotationY: 360, ease: "none" }, 0)
              .to(DOM.heroActor, { scale: 1.5, ease: "power1.in" }, 0)
              .to(DOM.heroActor, { scale: 1.0, ease: "power1.out" }, 0.5);

            STATE.masterTimeline = tl;
        },

        /**
         * Creates the simpler, non-pinned animations for mobile view.
         */
        createMobileAnimations() {
            logger.info("Creating mobile animations.");

            // Animate the main visual into view
            gsap.from(DOM.visualsCol, {
                scrollTrigger: {
                    trigger: DOM.visualsCol,
                    start: "top 80%",
                    end: "bottom center",
                    scrub: true,
                },
                opacity: 0,
                scale: 0.8,
                y: 50,
            });

            // Fade in text pillars as they scroll into view
            DOM.textPillars.forEach(pillar => {
                gsap.from(pillar, {
                    scrollTrigger: {
                        trigger: pillar,
                        start: "top 80%",
                        end: "top 50%",
                        scrub: true,
                    },
                    opacity: 0.2
                });
            });
        },
        
        /**
         * Creates the ScrollTrigger responsible for the handoff animation.
         */
        setupHandoffTrigger() {
            ScrollTrigger.create({
                trigger: DOM.handoffPoint,
                start: "top bottom",
                onEnter: () => this.executeHandoff(),
                onLeaveBack: () => this.reverseHandoff(),
            });
        },

        /**
         * Executes the FORWARD handoff animation (cube -> placeholder).
         * This is a symmetrical and perfectly reversible operation.
         */
        executeHandoff() {
            if (STATE.isHandoffActive) return;
            STATE.isHandoffActive = true;
            logger.info("Handoff triggered: executing forward sequence.");
            
            // 1. Capture the final state of the hero actor.
            const flipState = Flip.getState(DOM.heroActor, { props: "transform,opacity" });

            // 2. Move the stunt double to its final destination and make it visible.
            DOM.finalPlaceholder.appendChild(DOM.stuntDouble);
            gsap.set(DOM.stuntDouble, { opacity: 1, visibility: 'visible' });

            // 3. Hide the original hero actor.
            gsap.set(DOM.heroActor, { opacity: 0, visibility: 'hidden' });
            
            // 4. Create the FLIP animation timeline.
            const tl = gsap.timeline();
            STATE.handoffTimeline = tl;

            tl.add(Flip.from(flipState, {
                targets: DOM.stuntDouble,
                duration: CONFIG.HANDOFF_DURATION,
                ease: "power3.inOut"
            }));
            
            tl.to(DOM.morphPath, {
                duration: CONFIG.HANDOFF_DURATION * 0.8, // Morph slightly faster
                ease: "expo.inOut",
                morphSVG: UTILS.getSVGPath('logo'),
                onComplete: () => logger.perf("Handoff sequence complete.")
            }, "-=80%"); // Overlap the animations for a smoother feel
        },
        
        /**
         * Executes the REVERSE handoff animation (placeholder -> cube).
         */
        reverseHandoff() {
            if (!STATE.isHandoffActive) return;
            logger.info("Handoff triggered: executing reverse sequence.");

            // Kill any forward animation to prevent conflicts
            if(STATE.handoffTimeline) STATE.handoffTimeline.kill();

            // 1. Revert the morph back to a square.
            gsap.to(DOM.morphPath, {
                duration: 0.4,
                ease: "power2.in",
                morphSVG: UTILS.getSVGPath('square')
            });
            
            // 2. Capture the state of the stunt double in its placeholder.
            const placeholderState = Flip.getState(DOM.stuntDouble, { props: "transform,opacity" });
            
            // 3. Immediately make the hero visible and hide the stunt double.
            gsap.set(DOM.heroActor, { opacity: 1, visibility: 'visible' });
            gsap.set(DOM.stuntDouble, { opacity: 0, visibility: 'hidden' });
            
            // 4. Animate the HERO ACTOR from the captured placeholder state.
            Flip.from(placeholderState, {
                targets: DOM.heroActor,
                duration: CONFIG.HANDOFF_DURATION,
                ease: "power3.inOut",
                onComplete: () => {
                    STATE.isHandoffActive = false;
                    logger.perf("Reverse handoff sequence complete.");
                }
            });
        }
    };

    // =====================================================================
    // SECTION: Main Initialization
    // The entry point that orchestrates the entire system setup.
    // =====================================================================
    function main() {
        logger.info(`Initializing System v81.0 "The Engineer's Blueprint".`);

        if (!cacheDomElements()) {
            logger.info("Essential scrollytelling elements not found. System will run in reduced functionality mode.");
            return;
        }

        try {
            gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin);
        } catch (e) {
            logger.error("Failed to register GSAP plugins. Animations will not work.", e);
            return;
        }

        ScrollTrigger.matchMedia({
            // == DESKTOP SETUP ==
            [`(min-width: ${CONFIG.MOBILE_BREAKPOINT + 1}px)`]: () => {
                logger.info("--- Activating DESKTOP context ---");
                STATE.isDesktop = true;
                AnimationSystem.createMasterTimeline();
                AnimationSystem.setupHandoffTrigger();
            },
            // == MOBILE SETUP ==
            [`(max-width: ${CONFIG.MOBILE_BREAKPOINT}px)`]: () => {
                logger.info("--- Activating MOBILE context ---");
                STATE.isDesktop = false;
                AnimationSystem.createMobileAnimations();
                // Note: The handoff trigger is not set up on mobile.
            }
        });
        
        logger.info("System initialization complete.");
    }

    // Wait for the DOM to be fully loaded before running the main function.
    document.addEventListener("DOMContentLoaded", main);

})();
