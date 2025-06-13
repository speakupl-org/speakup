// main.js (Final Production Version)

document.addEventListener('DOMContentLoaded', function () {
    // --- Menu & Footer code (unchanged) ---
    const openButton = document.getElementById('menu-open-button');
    const closeButton = document.getElementById('menu-close-button');
    const menuScreen = document.getElementById('menu-screen');
    const htmlElement = document.documentElement;
    const body = document.body;

    function openMenu() {
        htmlElement.classList.add('menu-open');
        body.classList.add('menu-open');
        menuScreen.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
        htmlElement.classList.remove('menu-open');
        body.classList.remove('menu-open');
        menuScreen.setAttribute('aria-hidden', 'true');
    }

    if (openButton && closeButton && menuScreen) {
        openButton.addEventListener('click', openMenu);
        closeButton.addEventListener('click', closeMenu);
    }

    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- REFACTORED ANIMATION LOGIC ---
    function setupAnimations() {
        gsap.registerPlugin(ScrollTrigger, Flip);

        const ctx = gsap.context(() => {
            
            // --- Element Validation ---
            const visualsCol = document.querySelector(".pillar-visuals-col");
            const textCol = document.querySelector(".pillar-text-col");
            const actor3D = document.getElementById("actor-3d");
            const textPillars = gsap.utils.toArray('.pillar-text-content');
            const summaryContainer = document.querySelector(".method-summary");
            const summaryClipper = document.querySelector(".summary-thumbnail-clipper");

            if (!visualsCol || !textCol || !actor3D || !summaryContainer || !summaryClipper || textPillars.length === 0) {
                console.error("Scrollytelling animations aborted: One or more required elements are missing from the DOM.");
                return;
            }
            
            // Shared state variable must be inside the context
            let isFlipped = false;

            ScrollTrigger.matchMedia({

                // --- DESKTOP ANIMATIONS ---
                "(min-width: 769px)": function () {

                    // Performance: Hint to the browser what will animate
                    gsap.set(actor3D, { willChange: "transform" });
                    gsap.set(textPillars, { willChange: "opacity" });
                    
                    // --- PART 1: The Master Timeline ("The Film Strip") ---
                    const masterTimeline = gsap.timeline({
                        defaults: { duration: 0.6, ease: "power2.inOut" }
                    });

                    // State for Pillar 1
                    masterTimeline
                        .set(textPillars, { autoAlpha: 0 })
                        .set(textPillars[0], { autoAlpha: 1 })
                        .to(actor3D, { rotationY: 20, rotationX: -15, scale: 1 });

                    // Transition to Pillar 2
                    masterTimeline
                        .to(textPillars[0], { autoAlpha: 0 })
                        .to(textPillars[1], { autoAlpha: 1 }, "<")
                        .to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.1 }, "<");

                    // Transition to Pillar 3
                    masterTimeline
                        .to(textPillars[1], { autoAlpha: 0 })
                        .to(textPillars[2], { autoAlpha: 1 }, "<")
                        .to(actor3D, { rotationY: -120, rotationX: -20, scale: 1.2 }, "<")
                        // Add a label to mark the final, stable state before exiting. This is our rewind point.
                        .addLabel("finalState");

                    // Transition to Exit State (Cube resets rotation, ready for Flip)
                    masterTimeline
                        .to(textPillars[2], { autoAlpha: 0 })
                        .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1 }, "<");

                    // --- PART 2: The Main Controller ("The Director") ---
                    const mainScrubber = ScrollTrigger.create({
                        trigger: textCol,
                        pin: visualsCol,
                        start: "top top",
                        end: "bottom bottom",
                        animation: masterTimeline,
                        scrub: 0.8,
                        invalidateOnRefresh: true
                    });

                    // --- PART 3: The State Change ("The Stunt Coordinator") ---
                    ScrollTrigger.create({
                        trigger: summaryContainer,
                        start: "top center",
                        onEnter: () => {
                            if (!isFlipped) {
                                isFlipped = true;
                                
                                // HANDOFF: Pause the main controller
                                mainScrubber.disable();
                                
                                const state = Flip.getState(actor3D, { props: "scale,rotation" });
                                summaryClipper.appendChild(actor3D);
                                visualsCol.classList.add('is-exiting');
                                
                                Flip.from(state, {
                                    duration: 0.8,
                                    ease: "power2.inOut",
                                    scale: true,
                                    // CRITICAL: Clean up Flip's inline styles to prevent conflict.
                                    onComplete: () => gsap.set(actor3D, { clearProps: "transform" })
                                });
                            }
                        },
                        onLeaveBack: () => {
                            if (isFlipped) {
                                isFlipped = false;
                                
                                const state = Flip.getState(actor3D, { props: "scale,rotation" });
                                visualsCol.appendChild(actor3D);
                                visualsCol.classList.remove('is-exiting');
                                
                                Flip.from(state, {
                                    duration: 0.8,
                                    ease: "power2.out",
                                    scale: true,
                                    // HANDOFF: After flip-back, reset state and give control back to main scrubber.
                                    onComplete: () => {
                                        // 1. Manually reset the timeline to the last good state.
                                        masterTimeline.seek("finalState");
                                        // 2. Re-enable the main controller.
                                        mainScrubber.enable();
                                    }
                                });
                            }
                        }
                    });

                },

                // --- MOBILE CLEANUP ---
                "(max-width: 768px)": function () {
                    // When switching to mobile, ensure a clean state by killing all animations and triggers.
                    // This prevents GSAP from getting confused if the user resizes mid-animation.
                    ScrollTrigger.getAll().forEach(st => st.kill());
                    gsap.killTweensOf([actor3D, textPillars]);
                    gsap.set(textPillars, { autoAlpha: 1 });
                    gsap.set(actor3D, { clearProps: "all" });
                    
                    // Also ensure the element is back in its original container if it was flipped
                    if (visualsCol && !visualsCol.contains(actor3D)) {
                         visualsCol.appendChild(actor3D);
                    }
                    visualsCol.classList.remove('is-exiting');

                    isFlipped = false;
                }
            });
        });

        return () => ctx.revert(); // GSAP cleanup function
    }

    // --- Readiness Gate (Unchanged) ---
    function initialCheck() {
        if (window.gsap && window.ScrollTrigger && window.Flip) {
            setupAnimations();
        } else {
            // Optional: More robustly check for up to 3 seconds.
            let attempts = 0;
            const maxAttempts = 30;
            const interval = setInterval(() => {
                attempts++;
                if (window.gsap && window.ScrollTrigger && window.Flip) {
                    clearInterval(interval);
                    setupAnimations();
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    console.error("GSAP plugins failed to load in time.");
                }
            }, 100);
        }
    }
    
    initialCheck();

});
