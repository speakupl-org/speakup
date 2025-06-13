// main.js

document.addEventListener('DOMContentLoaded', function () {
    // --- Your Menu & Footer code remains untouched ---
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

        // We use gsap.context() for proper cleanup, which is best practice.
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
                    
                    // Set initial state for the 3D actor
                    masterTimeline.set(actor3D, { rotationY: 20, rotationX: -15 });

                    // Animate Pillar 1
                    masterTimeline
                        .to(textPillars[0], { autoAlpha: 1 })
                        .to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.1, ease: "power2.inOut" }, "<")
                        .to(textPillars[0], { autoAlpha: 0 });

                    // Animate Pillar 2
                    masterTimeline
                        .to(textPillars[1], { autoAlpha: 1 })
                        .to(actor3D, { rotationY: -120, rotationX: -20, scale: 1.2, ease: "power2.inOut" }, "<")
                        .to(textPillars[1], { autoAlpha: 0 });
                    
                    // Animate Pillar 3
                    masterTimeline
                        .to(textPillars[2], { autoAlpha: 1 })
                        .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1, ease: "power3.inOut" }, "<")
                        .to(textPillars[2], { autoAlpha: 0 });


                    // --- 4. THE "IGLOO" EXIT/RETURN ANIMATION (Kept separate for reliability) ---
                    // Your logic here was excellent. We'll keep it separate because Flip
                    // is a state-change animation, not part of the main scrub sequence.
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
                        onLeaveBack: () => {
                            if (isFlipped) {
                                isFlipped = false;
                                const state = Flip.getState(actor3D, { props: "scale" });
                                visualsCol.appendChild(actor3D);
                                visualsCol.classList.remove('is-exiting');
                                Flip.from(state, {
                                    duration: 1.2,
                                    ease: "power2.inOut",
                                    scale: true,
                                    onStart: () => {
                                        // Restore the rotations from the end of the master timeline
                                        masterTimeline.progress(1);
                                    }
                                });
                            }
                        }
                    });
                },

                "(max-width: 768px)": function () {
                    // On mobile, just make sure everything is visible.
                    gsap.set('.pillar-text-content', { autoAlpha: 1 });
                    gsap.set('.object-3d', {clearProps: "all"}); // reset any 3D transforms
                }
            });
        }); // end of gsap.context()

        // It's good practice to have a cleanup function, even if not strictly needed in this simple case
        // This would be crucial in a Single Page Application (SPA).
        return () => ctx.revert(); 
    }

    // --- THE "READY CHECK" ---
    // Your ready check is solid, we'll keep it as is.
    function initialCheck() {
        if (window.gsap && window.ScrollTrigger && window.Flip) {
            setupAnimations();
        } else {
            setTimeout(initialCheck, 100);
        }
    }
    
    initialCheck();

}); // End of DOMContentLoaded
