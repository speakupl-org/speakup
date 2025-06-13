// main.js (Architectural Refactor)

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
                    // This timeline defines the entire sequence of animations.
                    // It will be controlled by a single "scrubbing" ScrollTrigger.
                    const masterTimeline = gsap.timeline({
                        // Setting defaults for all tweens in this timeline
                        defaults: { duration: 0.6, ease: "power2.inOut" }
                    });

                    // Set initial state
                    masterTimeline
                        .set(textPillars, { autoAlpha: 0 })
                        .set(textPillars[0], { autoAlpha: 1 })
                        .to(actor3D, { rotationY: 20, rotationX: -15, scale: 1 }); // State for Pillar 1

                    // Transition to Pillar 2
                    masterTimeline
                        .to(textPillars[0], { autoAlpha: 0 })
                        .to(textPillars[1], { autoAlpha: 1 }, "<") // Text fades happen at the same time as...
                        .to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.1 }, "<"); // ...the 3D actor animation starts.

                    // Transition to Pillar 3
                    masterTimeline
                        .to(textPillars[1], { autoAlpha: 0 })
                        .to(textPillars[2], { autoAlpha: 1 }, "<")
                        .to(actor3D, { rotationY: -120, rotationX: -20, scale: 1.2 }, "<");

                    // Transition to Exit State (Ready for Flip)
                    masterTimeline
                        .to(textPillars[2], { autoAlpha: 0 })
                        .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1 }, "<");


                    // --- PART 2: The Projector (A Single, Scrubbing ScrollTrigger) ---
                    // This is the core fix. One trigger to rule them all.
                    // It pins the visuals and links the scroll position directly to the masterTimeline's progress.
                    ScrollTrigger.create({
                        trigger: textCol,       // The element that drives the animation
                        pin: visualsCol,        // The element to pin
                        start: "top top",       // Start when the top of textCol hits the top of the viewport
                        end: "bottom bottom", // End when the bottom of textCol hits the bottom of the viewport
                        animation: masterTimeline, // The timeline to control
                        scrub: 0.8,             // Smoothly link scrollbar to animation (e.g., 0.8s "catch-up" time)
                        invalidateOnRefresh: true // Recalculate on viewport resize
                    });


                    // --- PART 3: The Igloo Exit (State Change) ---
                    // This logic was already correct and is well-suited for a discrete trigger.
                    // It remains unchanged as it handles a specific state change (DOM reparenting) at a precise scroll point.
                    let isFlipped = false;
                    ScrollTrigger.create({
                        trigger: summaryContainer,
                        start: "top center", // Trigger the Flip effect
                        onEnter: () => {
                            if (!isFlipped) {
                                isFlipped = true;
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
                                const state = Flip.getState(actor3D, { props: "scale" });
                                visualsCol.appendChild(actor3D);
                                visualsCol.classList.remove('is-exiting');
                                Flip.from(state, {
                                    duration: 0.8,
                                    ease: "power2.out",
                                    scale: true,
                                });
                            }
                        }
                    });

                },

                "(max-width: 768px)": function () {
                    // This cleanup logic is correct.
                    gsap.set('.pillar-text-content', { autoAlpha: 1 });
                    gsap.set('.object-3d', { clearProps: "all" });
                }
            });
        });

        return () => ctx.revert();
    }

    // --- Readiness Gate (Unchanged) ---
    function initialCheck() {
        if (window.gsap && window.ScrollTrigger && window.Flip) {
            setupAnimations();
        } else {
            setTimeout(initialCheck, 100);
        }
    }

    initialCheck();

});
