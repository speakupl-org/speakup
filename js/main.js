/* =========================================================================

    COVENANT PROTOCOL v44.1 "SOUL"
    - The Unified Narrative Manifest -

    This is the absolute definitive state, integrating the flawless "Aura"
    architecture with the complete, intended narrative animation for the
    Hero Actor. It adheres to all Covenants while ensuring no
    choreography or nuance is lost.

    The Hero Actor's animation is now defined in its own sovereign
    function, `createHeroActorJourney`, ensuring a clear, continuous,
    and unbroken character arc from the first scroll movement to the
    final hand-off.

    The architecture is perfect. The narrative is complete.
    There are no remaining fragments. There are no regrets.

========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * Register GSAP plugins only once to make them available globally.
     */
    gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin);

    /**
     * The main entry point for all site logic.
     * Keeps the global scope clean and organizes initialization.
     */
    const main = () => {
        setupStaticLogic();
        setupScrollAnimations();
    };

    /**
     * Handles non-scrolling, static UI elements.
     */
    const setupStaticLogic = () => {
        const menuOpenButton = document.querySelector('#menu-open-button');
        const menuCloseButton = document.querySelector('#menu-close-button');
        const yearElement = document.querySelector('#current-year');

        if (menuOpenButton && menuCloseButton) {
            menuOpenButton.addEventListener('click', () => document.documentElement.classList.add('menu-open'));
            menuCloseButton.addEventListener('click', () => document.documentElement.classList.remove('menu-open'));
        }
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear().toString();
        }
    };

    /**
     * The core architecture for all scroll-based animations.
     */
    const setupScrollAnimations = () => {
        const ctx = gsap.context(() => {

            const elements = {
                scrollyContainer: document.querySelector('.scrolly-container'),
                visualsColumn: document.querySelector('.pillar-visuals-col'),
                heroActor: document.querySelector('#actor-3d'),
                textPillars: gsap.utils.toArray('.pillar-text-content'),
                stuntActor: document.querySelector('#actor-3d-stunt-double'),
                morphPath: document.querySelector('#morph-path'),
            };

            if (!elements.scrollyContainer || !elements.visualsColumn || !elements.heroActor || !elements.textPillars.length) {
                console.error("Covenant Protocol Aborted: Missing critical scrollytelling elements.");
                return;
            }

            ScrollTrigger.matchMedia({
                '(min-width: 1025px)': () => {
                    const masterTimeline = createMasterTimeline(elements);
                    // THE UNIFIED NARRATIVE SEQUENCE:
                    createHeroActorJourney(masterTimeline, elements); // Defines the cube's full motion.
                    createPillarSequence(masterTimeline, elements);      // Defines only the text animations.
                    createHandoffSequence(masterTimeline, elements);     // Defines the final transformation.
                },
                '(max-width: 1024px)': () => {
                    gsap.set([elements.heroActor, ...elements.textPillars], { autoAlpha: 1, y: 0 });
                    gsap.set(elements.stuntActor, { autoAlpha: 0 });
                },
            });

        });
        return ctx;
    };

    /**
     * Creates and configures the Master Timeline and the pinning mechanism.
     */
    const createMasterTimeline = (elements) => {
        ScrollTrigger.create({
            trigger: elements.scrollyContainer,
            start: 'top top',
            end: 'bottom bottom',
            pin: elements.visualsColumn,
        });
        return gsap.timeline({
            scrollTrigger: {
                trigger: elements.scrollyContainer,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.2,
            },
        });
    };

    /**
     * NEW: Creates the full, nuanced journey for the Hero Actor.
     * This is the cube's complete emotional and physical arc on the timeline.
     */
    const createHeroActorJourney = (timeline, elements) => {
        timeline
            // Overture: An initial, engaging movement.
            .to(elements.heroActor, {
                rotationY: 120,
                rotationX: 10,
                scale: 1.1,
                duration: 1.5,
                ease: "power2.inOut"
            }, 0)
            // Act 2: Reacts to the first text change.
            .to(elements.heroActor, {
                rotationY: -120,
                rotationX: -20,
                scale: 1.2,
                duration: 2,
                ease: "power2.inOut"
            }, ">") // Using '>' places this immediately after the previous animation.
            // Finale: The final, settling rotation before the hand-off.
            .to(elements.heroActor, {
                rotationY: -360,
                rotationX: 0,
                scale: 1,
                duration: 2.5,
                ease: "power2.inOut"
            }, ">");
    };


    /**
     * Creates the sequence of text pillars.
     * This function now *only* handles the text, as its rightful responsibility.
     */
    const createPillarSequence = (timeline, elements) => {
        gsap.set(elements.textPillars, { autoAlpha: 0, y: 40 });
        gsap.set(elements.textPillars[0], { autoAlpha: 1, y: 0 });

        elements.textPillars.forEach((pillar, index) => {
            const position = index * 1.8; // Position tweens evenly along the timeline
            if (index > 0) {
                timeline.to(pillar, { autoAlpha: 1, y: 0, duration: 0.6 }, position);
            }
            // Fade out this pillar slightly after it has appeared.
            if (index < elements.textPillars.length - 1) {
                 timeline.to(pillar, { autoAlpha: 0, y: -40, duration: 0.6 }, position + 1.2);
            }
        });
        
         // Fade out the very last pillar before the hand-off.
        timeline.to(elements.textPillars[elements.textPillars.length - 1], { autoAlpha: 0, y: -40, duration: 0.6}, '>');
    };

    /**
     * Creates the final, seamless hand-off and morph sequence.
     */
    const createHandoffSequence = (timeline, elements) => {
        const logoPathShape = "M81.5,1.5 C37.2,1.5 1.5,37.2 1.5,81.5 C1.5,125.8 37.2,161.5 81.5,161.5 C125.8,161.5 161.5,125.8 161.5,81.5 C161.5,37.2 125.8,1.5 81.5,1.5 Z M81.5,116.5 C81.5,125.1 74.6,132 66,132 C57.4,132 50.5,125.1 50.5,116.5 L50.5,74 C50.5,65.4 57.4,58.5 66,58.5 C74.6,58.5 81.5,65.4 81.5,74 L81.5,89 C81.5,97.6 88.4,104.5 97,104.5 C105.6,104.5 112.5,97.6 112.5,89 L112.5,74 Z";
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
                        morphSVG: logoPathShape,
                        ease: 'inherit'
                    }, '<');
                }
            }));
        timeline.add(handoffTl, ">");
    };

    // --- Initiate Covenant ---
    main();
});
