// js/main.js (Corrected Version)

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

    // --- GSAP ANIMATION LOGIC ---
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

            let isFlipped = false;

            ScrollTrigger.matchMedia({
                // --- DESKTOP ANIMATIONS ---
                "(min-width: 769px)": function () {
                    // --- ANIMATION SETUP ---
                    // Set will-change for performance
                    gsap.set(actor3D, { willChange: "transform" });
                    gsap.set(textPillars, { willChange: "opacity, transform" });

                    // --- MASTER TIMELINE ---
                    // This timeline controls the main scrollytelling sequence.
                    const masterTimeline = gsap.timeline({
                        defaults: { duration: 0.8, ease: "power2.inOut" }
                    });

                    // Build the animation sequence for each pillar
                    masterTimeline
                        // Pillar 1 (Initial State is set by default CSS)
                        .to(actor3D, { rotationY: 20, rotationX: -15, scale: 1.0 })
                        .to('.pillar-line', { scaleX: 1 }, 0) // Animate first line immediately
                        
                        // Pillar 2
                        .to(textPillars[0], { autoAlpha: 0 })
                        .to(textPillars[1], { autoAlpha: 1 }, "<")
                        .to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.1 }, "<")
                        
                        // Pillar 3
                        .to(textPillars[1], { autoAlpha: 0 })
                        .to(textPillars[2], { autoAlpha: 1 }, "<")
                        .to(actor3D, { rotationY: -120, rotationX: -20, scale: 1.2 }, "<")

                        // Add a label to mark the final state before the handoff. This is CRITICAL for the return animation.
                        .addLabel("finalState")
                        
                        // Exit Sequence (fade out last text and reset cube)
                        .to(textPillars[2], { autoAlpha: 0 })
                        .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1 }, "<");

                    // --- MAIN SCROLLTRIGGER (The Scrubber) ---
                    const mainScrubber = ScrollTrigger.create({
                        trigger: textCol,
                        pin: visualsCol,
                        start: "top top",
                        end: "bottom bottom",
                        animation: masterTimeline,
                        scrub: 0.8,
                        invalidateOnRefresh: true
                    });

                    // --- FLIP TRANSITION (The Handoff) ---
                    ScrollTrigger.create({
                        trigger: summaryContainer,
                        start: "top center",
                        onEnter: () => {
                            if (isFlipped) return;
                            isFlipped = true;
                            
                            // Pause the main scrubbing animation so it doesn't fight with Flip
                            mainScrubber.disable();

                            // **FIX:** Let Flip capture the full state (size, position, rotation).
                            const state = Flip.getState(actor3D);
                            
                            // Move the element in the DOM
                            summaryClipper.appendChild(actor3D);
                            visualsCol.classList.add('is-exiting');

                            // Animate from the captured state to the new one.
                            Flip.from(state, {
                                duration: 0.8,
                                ease: "power2.inOut",
                                scale: true, // **FIX:** Use scale for a smooth size change.
                                onComplete: () => {
                                    // Remove GSAP's inline styles so CSS can take over.
                                    gsap.set(actor3D, { clearProps: "all" });
                                }
                            });
                        },
                        onLeaveBack: () => {
                            if (!isFlipped) return;
                            isFlipped = false;
                            
                            // **FIX:** Capture the state from the thumbnail position.
                            const state = Flip.getState(actor3D);

                            // Move the element back to its original parent.
                            visualsCol.appendChild(actor3D);
                            visualsCol.classList.remove('is-exiting');

                            // Animate back from the thumbnail state.
                            Flip.from(state, {
                                duration: 0.8,
                                ease: "power2.out",
                                scale: true, // **FIX:** Again, use scale for smoothness.
                                onComplete: () => {
                                    // **CRITICAL FIX:**
                                    // 1. Reset the master timeline to its final visual state.
                                    masterTimeline.seek("finalState");
                                    // 2. NOW it's safe to re-enable the scrubbing.
                                    mainScrubber.enable();
                                }
                            });
                        }
                    });
                },
                
                // --- MOBILE CLEANUP ---
                "(max-width: 768px)": function () {
                    // Kill all triggers and animations to prevent conflicts
                    ScrollTrigger.getAll().forEach(st => st.kill());
                    gsap.killTweensOf([actor3D, textPillars, ".pillar-line"]);
                    
                    // Reset all element styles to their defaults
                    gsap.set([textPillars, actor3D, ".pillar-line"], { clearProps: "all" });

                    // Ensure the 3D actor is in its original container
                    if (visualsCol && !visualsCol.contains(actor3D)) {
                        visualsCol.appendChild(actor3D);
                    }
                    visualsCol.classList.remove('is-exiting');
                    isFlipped = false;
                }
            });
        });

        // Cleanup function
        return () => ctx.revert();
    }

    // --- Readiness Gate (checks if GSAP is loaded) ---
    function initialCheck() {
        if (window.gsap && window.ScrollTrigger && window.Flip) {
            setupAnimations();
        } else {
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
