// main.js (Refactored for Animation Handoff & FOUC Prevention)

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

    // --- ANIMATION LOGIC ---
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
                    // Prevent FOUC: all pillar text starts hidden via CSS, only show first
                    gsap.set(textPillars, { autoAlpha: 0 });
                    gsap.set(textPillars[0], { autoAlpha: 1 });

                    gsap.set(actor3D, { willChange: "transform" });
                    gsap.set(textPillars, { willChange: "opacity" });

                    // Master timeline
                    const masterTimeline = gsap.timeline({
                        defaults: { duration: 0.6, ease: "power2.inOut" }
                    });
                    masterTimeline
                        // Pillar 1
                        .set(textPillars, { autoAlpha: 0 })
                        .set(textPillars[0], { autoAlpha: 1 })
                        .to(actor3D, { rotationY: 20, rotationX: -15, scale: 1 })
                        // Pillar 2
                        .to(textPillars[0], { autoAlpha: 0 })
                        .to(textPillars[1], { autoAlpha: 1 }, "<")
                        .to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.1 }, "<")
                        // Pillar 3
                        .to(textPillars[1], { autoAlpha: 0 })
                        .to(textPillars[2], { autoAlpha: 1 }, "<")
                        .to(actor3D, { rotationY: -120, rotationX: -20, scale: 1.2 }, "<")
                        .addLabel("finalState")
                        // Exit
                        .to(textPillars[2], { autoAlpha: 0 })
                        .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1 }, "<");

                    // Main scrubber ScrollTrigger
                    const mainScrubber = ScrollTrigger.create({
                        trigger: textCol,
                        pin: visualsCol,
                        start: "top top",
                        end: "bottom bottom",
                        animation: masterTimeline,
                        scrub: 0.8,
                        invalidateOnRefresh: true
                    });

                    // Summary entry/exit triggers (handoff to Flip)
                    ScrollTrigger.create({
                        trigger: summaryContainer,
                        start: "top center",
                        onEnter: () => {
                            if (!isFlipped) {
                                isFlipped = true;
                                mainScrubber.disable();

                                // Record state for Flip
                                const state = Flip.getState(actor3D, { props: "scale,rotation" });
                                summaryClipper.appendChild(actor3D);
                                visualsCol.classList.add('is-exiting');

                                Flip.from(state, {
                                    duration: 0.8,
                                    ease: "power2.inOut",
                                    scale: true,
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
                                    onComplete: () => {
                                        masterTimeline.seek("finalState");
                                        mainScrubber.enable();
                                    }
                                });
                            }
                        }
                    });
                },
                // --- MOBILE CLEANUP ---
                "(max-width: 768px)": function () {
                    // Kill all triggers/animations when mobile
                    ScrollTrigger.getAll().forEach(st => st.kill());
                    gsap.killTweensOf([actor3D, textPillars]);
                    gsap.set(textPillars, { autoAlpha: 1 });
                    gsap.set(actor3D, { clearProps: "all" });

                    if (visualsCol && !visualsCol.contains(actor3D)) {
                        visualsCol.appendChild(actor3D);
                    }
                    visualsCol.classList.remove('is-exiting');
                    isFlipped = false;
                }
            });
        });

        return () => ctx.revert();
    }

    // --- Readiness Gate (unchanged) ---
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
