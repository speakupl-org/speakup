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
            
            // --- FIX: State flag to prevent animations from re-triggering ---
            let isFlipped = false;

            ScrollTrigger.matchMedia({
                // --- DESKTOP ANIMATIONS ---
                "(min-width: 769px)": function () {
                    // Note: The CSS now handles the initial FOUC prevention.
                    // This JS just reinforces the state for the animation logic.
                    gsap.set(textPillars, { autoAlpha: 0 });
                    gsap.set(textPillars[0], { autoAlpha: 1 });

                    // Animate the decorative lines when a pillar becomes active
                    textPillars.forEach((pillar, index) => {
                        const line = pillar.querySelector('.pillar-line');
                        if (line) {
                           ScrollTrigger.create({
                                trigger: pillar,
                                start: "top 60%",
                                end: "bottom 40%",
                                onEnter: () => gsap.to(line, { scaleX: 1, duration: 0.8, ease: "power4.out" }),
                                onLeave: () => gsap.to(line, { scaleX: 0, transformOrigin: 'right', duration: 0.6, ease: "power4.in" }),
                                onEnterBack: () => gsap.to(line, { scaleX: 1, transformOrigin: 'left', duration: 0.8, ease: "power4.out" }),
                                onLeaveBack: () => gsap.to(line, { scaleX: 0, duration: 0.6, ease: "power4.in" })
                           });
                        }
                    });

                    // Master timeline for the 3D cube and text fades
                    const masterTimeline = gsap.timeline({
                        defaults: { duration: 1, ease: "power2.inOut" }
                    });
                    
                    masterTimeline
                        // Pillar 1 (initial state)
                        .to(actor3D, { rotationY: 20, rotationX: -15, scale: 1.0 })
                        .to(textPillars[0], { autoAlpha: 1 }, "<") // Ensure first is visible
                        
                        // Pillar 2
                        .to(textPillars[0], { autoAlpha: 0 })
                        .to(textPillars[1], { autoAlpha: 1 }, "<")
                        .to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.1 }, "<")
                        
                        // Pillar 3
                        .to(textPillars[1], { autoAlpha: 0 })
                        .to(textPillars[2], { autoAlpha: 1 }, "<")
                        .to(actor3D, { rotationY: -120, rotationX: -20, scale: 1.2 }, "<")
                        
                        // Add a label to easily return to this point
                        .addLabel("finalState")
                        
                        // Exit state (back to neutral)
                        .to(textPillars[2], { autoAlpha: 0 })
                        .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1.0 }, "<");

                    // Main scrubber ScrollTrigger that controls the master timeline
                    const mainScrubber = ScrollTrigger.create({
                        trigger: textCol,
                        pin: visualsCol,
                        start: "top top",
                        end: "bottom bottom",
                        animation: masterTimeline,
                        scrub: 0.8,
                        invalidateOnRefresh: true,
                    });

                    // --- FIXES #2 & #3: Smooth Handoff Logic ---
                    ScrollTrigger.create({
                        trigger: summaryContainer,
                        start: "top center",
                        onEnter: () => {
                            if (!isFlipped) {
                                isFlipped = true;
                                mainScrubber.disable(); // Prevent conflicting animations

                                const state = Flip.getState(actor3D, { props: "scale" });
                                summaryClipper.appendChild(actor3D);
                                visualsCol.classList.add('is-exiting'); // Hide original column

                                Flip.from(state, {
                                    duration: 0.8,
                                    ease: "power2.inOut",
                                    scale: true,
                                    // Reset transform so CSS can take over positioning
                                    onComplete: () => gsap.set(actor3D, { clearProps: "transform" }) 
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
                                    onComplete: () => {
                                        // "Rewind" the timeline to the end state before re-enabling
                                        masterTimeline.seek("finalState");
                                        mainScrubber.enable();
                                    }
                                });
                            }
                        }
                    });
                },
                
                // --- MOBILE/RESIZE CLEANUP & FIX ---
                "(max-width: 768px)": function () {
                    // Kill all GSAP animations and triggers to prevent conflicts
                    ScrollTrigger.getAll().forEach(st => st.kill());
                    gsap.killTweensOf([actor3D, ...textPillars, '.pillar-line']);
                    
                    // Reset all element styles to their default CSS state
                    gsap.set(textPillars, { clearProps: "all" });
                    gsap.set(actor3D, { clearProps: "all" });
                    gsap.set('.pillar-line', { clearProps: "all" });

                    // --- ROBUSTNESS FIX ---
                    // If the cube is in the summary clipper when resizing to mobile, put it back.
                    if (visualsCol && !visualsCol.contains(actor3D)) {
                        visualsCol.appendChild(actor3D);
                    }
                    visualsCol.classList.remove('is-exiting');
                    isFlipped = false; // Reset the state flag
                }
            });
        });

        // Return a cleanup function for GSAP context
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
