// main.js (Complete and Corrected)

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

    // --- The Robust Animation Setup Function ---
    function setupAnimations() {
        gsap.registerPlugin(ScrollTrigger, Flip);

        // Use gsap.context() for proper cleanup, which is best practice.
        const ctx = gsap.context(() => {
            
            ScrollTrigger.matchMedia({

                "(min-width: 769px)": function () {

                    // --- 1. SELECTORS & REFERENCES ---
                    const visualsCol = document.querySelector(".pillar-visuals-col");
                    const textCol = document.querySelector(".pillar-text-col");
                    const actor3D = document.getElementById("actor-3d");
                    const textPillars = gsap.utils.toArray('.pillar-text-content');
                    const summaryContainer = document.querySelector(".method-summary");
                    const summaryClipper = document.querySelector(".summary-thumbnail-clipper");

                    if (!visualsCol || !textCol || !actor3D || !summaryContainer || !summaryClipper) {
                        console.error("Scrollytelling elements not found. Aborting animation setup.");
                        return;
                    }

                    // --- 2. MASTER TIMELINE ARCHITECTURE ---
                    // Instead of multiple timelines, we create ONE master timeline.
                    // A single ScrollTrigger will control this entire sequence, leading
                    // to much smoother and more reliable scrubbing.
                    const masterTimeline = gsap.timeline({
                        scrollTrigger: {
                            trigger: textCol, // The scrolling text column is the trigger
                            pin: visualsCol, // Pin the visuals column
                            start: "top top",
                            end: "bottom bottom", // Animate over the full height of the text column
                            scrub: 1, // Smooth scrub (1 second catch-up time)
                        }
                    });

                    // --- 3. BUILD THE SEQUENTIAL ANIMATION ---
                    // We now add all animations to our one masterTimeline.
                    
                    // Set an initial state for the 3D actor to make the start less abrupt
                    masterTimeline.set(actor3D, { rotationY: 20, rotationX: -15 });

                    // Animate Pillar 1 text fade in/out and cube rotation
                    masterTimeline
                        .to(textPillars[0], { autoAlpha: 1 })
                        .to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.1, ease: "power2.inOut" }, "<")
                        .to(textPillars[0], { autoAlpha: 0 });

                    // Animate Pillar 2 text fade in/out and cube rotation
                    masterTimeline
                        .to(textPillars[1], { autoAlpha: 1 })
                        .to(actor3D, { rotationY: -120, rotationX: -20, scale: 1.2, ease: "power2.inOut" }, "<")
                        .to(textPillars[1], { autoAlpha: 0 });
                    
                    // Animate Pillar 3 text fade in/out and cube rotation
                    masterTimeline
                        .to(textPillars[2], { autoAlpha: 1 })
                        .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1, ease: "power3.inOut" }, "<")
                        .to(textPillars[2], { autoAlpha: 0 });


                    // --- 4. THE "IGLOO" EXIT/RETURN ANIMATION ---
                    // This is separate from the masterTimeline because Flip is a state-change animation,
                    // not part of the main scrub sequence.
                    let isFlipped = false;

                    ScrollTrigger.create({
                        trigger: summaryContainer,
                        start: "top center", // Trigger when the summary section hits the center
                        onEnter: () => {
                            if (!isFlipped) {
                                isFlipped = true;
                                const state = Flip.getState(actor3D, { props: "scale" });
                                summaryClipper.appendChild(actor3D);
                                visualsCol.classList.add('is-exiting');
                                Flip.from(state, {
                                    duration: 1.2,
                                    ease: "power2.inOut",
                                    scale: true,
                                    onComplete: () => {
                                        // Ensure final state is clean after animation
                                        gsap.set(actor3D, { clearProps: "all" });
                                    }
                                });
                            }
                        },
                        // ** THIS IS THE FIX FOR THE REVERSE SCROLL **
                        onLeaveBack: () => {
                            if (isFlipped) {
                                isFlipped = false;

                                // Step 1: Instantly move the 3D actor back to its original column.
                                visualsCol.appendChild(actor3D);
                                
                                // Step 2: Make the original column visible again.
                                visualsCol.classList.remove('is-exiting');

                                // Step 3 (CRITICAL): Manually set the master timeline's progress to 1 (the end).
                                // This ensures that when the actor reappears, its rotation and scale are
                                // exactly what they should be at the end of the main scroll sequence.
                                // The scrub will then take over seamlessly from this correct state.
                                masterTimeline.progress(1);
                            }
                        }
                    });
                },

                "(max-width: 768px)": function () {
                    // On mobile, just make sure everything is visible and transforms are cleared.
                    gsap.set('.pillar-text-content', { autoAlpha: 1 });
                    gsap.set('.object-3d', {clearProps: "all"}); 
                }
            });
        }); // end of gsap.context()

        // This would be crucial in a Single Page Application (SPA) for cleanup.
        return () => ctx.revert(); 
    }

    // --- The "Ready Check" (unchanged) ---
    // Checks if the GSAP plugins have loaded before running the animation setup.
    function initialCheck() {
        if (window.gsap && window.ScrollTrigger && window.Flip) {
            setupAnimations();
        } else {
            setTimeout(initialCheck, 100);
        }
    }
    
    // Start the check.
    initialCheck();

}); // End of DOMContentLoaded
