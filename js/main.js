// main.js (Final Architectural Version w/ Handoff Fix)

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

    function setupAnimations() {
        gsap.registerPlugin(ScrollTrigger, Flip);

        const ctx = gsap.context(() => {
            ScrollTrigger.matchMedia({
                "(min-width: 769px)": function () {

                    const visualsCol = document.querySelector(".pillar-visuals-col");
                    const textCol = document.querySelector(".pillar-text-col");
                    const actor3D = document.getElementById("actor-3d");
                    const textPillars = gsap.utils.toArray('.pillar-text-content');
                    const summaryContainer = document.querySelector(".method-summary");
                    const summaryClipper = document.querySelector(".summary-thumbnail-clipper");

                    if (!visualsCol || !textCol || !actor3D || textPillars.length < 3) { return; }

                    // --- PART 1: The Film Strip (The Master Timeline) ---
                    const masterTimeline = gsap.timeline({
                        defaults: { duration: 0.6, ease: "power2.inOut" }
                    });

                    // Set initial state
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
                        // **FIX:** Add a label to mark the final state BEFORE the exit.
                        // This gives us a clean state to return to.
                        .addLabel("pillar3_end");

                    // Transition to Exit State (Ready for Flip)
                    masterTimeline
                        .to(textPillars[2], { autoAlpha: 0 })
                        .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1 }, "<");


                    // --- PART 2: The Projector (A Single, Scrubbing ScrollTrigger) ---
                    // **FIX:** Store the ScrollTrigger in a variable so we can disable/enable it.
                    const mainScrubber = ScrollTrigger.create({
                        trigger: textCol,
                        pin: visualsCol,
                        start: "top top",
                        end: "bottom bottom",
                        animation: masterTimeline,
                        scrub: 0.8,
                        invalidateOnRefresh: true
                    });


                    // --- PART 3: The Igloo Exit (State Change with Handoff Logic) ---
                    let isFlipped = false;
                    ScrollTrigger.create({
                        trigger: summaryContainer,
                        start: "top center", // This trigger is for the Flip effect
                        onEnter: () => {
                            if (!isFlipped) {
                                isFlipped = true;
                                
                                // **FIX:** Disable the main scrubber to hand off control.
                                mainScrubber.disable();

                                const state = Flip.getState(actor3D, { props: "scale" });
                                summaryClipper.appendChild(actor3D);
                                visualsCol.classList.add('is-exiting');
                                Flip.from(state, {
                                    duration: 0.8,
                                    ease: "power2.inOut",
                                    scale: true,
                                });
                            }
                        },
                        onLeaveBack: () => {
                            if (isFlipped) {
                                isFlipped = false;

                                // Perform the reverse flip first.
                                const state = Flip.getState(actor3D, { props: "scale" });
                                visualsCol.appendChild(actor3D);
                                visualsCol.classList.remove('is-exiting');
                                Flip.from(state, {
                                    duration: 0.8,
                                    ease: "power2.out",
                                    scale: true,
                                    // **FIX:** On completion, reset and re-enable the scrubber.
                                    onComplete: () => {
                                        // 1. Manually reset the timeline to the correct state.
                                        masterTimeline.seek("pillar3_end");
                                        // 2. Re-enable the scrubber to give control back.
                                        mainScrubber.enable();
                                    }
                                });
                            }
                        }
                    });

                },

                "(max-width: 768px)": function () {
                    gsap.set('.pillar-text-content', { autoAlpha: 1 });
                    gsap.set('.object-3d', { clearProps: "all" });
                }
            });
        });

        return () => ctx.revert();
    }

    function initialCheck() {
        if (window.gsap && window.ScrollTrigger && window.Flip) {
            setupAnimations();
        } else {
            setTimeout(initialCheck, 100);
        }
    }

    initialCheck();
});
