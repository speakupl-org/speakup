document.addEventListener('DOMContentLoaded', function () {
    // --- Menu & Footer code ---
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

    // --- Animation Setup ---
    function setupAnimations() {
        // Validate required plugins
        if (!window.gsap || !window.ScrollTrigger || !window.Flip) {
            console.error("Required GSAP plugins not loaded");
            return;
        }

        gsap.registerPlugin(ScrollTrigger, Flip);

        // Set default GSAP properties for better performance
        gsap.defaults({
            ease: "power2.inOut",
            duration: 0.6
        });

        const ctx = gsap.context(() => {
            // Get all required elements
            const elements = {
                visualsCol: document.querySelector(".pillar-visuals-col"),
                textCol: document.querySelector(".pillar-text-col"),
                actor3D: document.getElementById("actor-3d"),
                textPillars: gsap.utils.toArray('.pillar-text-content'),
                summaryContainer: document.querySelector(".method-summary"),
                summaryClipper: document.querySelector(".summary-thumbnail-clipper")
            };

            // Validate all required elements exist
            const missingElements = Object.entries(elements)
                .filter(([key, value]) => !value)
                .map(([key]) => key);

            if (missingElements.length > 0) {
                console.error("Missing required elements:", missingElements);
                return;
            }

            // Destructure elements for easier access
            const { visualsCol, textCol, actor3D, textPillars, summaryContainer, summaryClipper } = elements;

            // Set up responsive animations
            ScrollTrigger.matchMedia({
                "(min-width: 769px)": function () {
                    // Optimize performance with will-change
                    gsap.set([actor3D, ...textPillars], {
                        willChange: "transform, opacity"
                    });

                    // --- PART 1: Master Timeline Setup ---
                    const masterTimeline = gsap.timeline({
                        defaults: { duration: 0.6, ease: "power2.inOut" }
                    });

                    // Initial state
                    masterTimeline
                        .set(textPillars, { autoAlpha: 0 })
                        .set(textPillars[0], { autoAlpha: 1 })
                        .to(actor3D, { 
                            rotationY: 20, 
                            rotationX: -15, 
                            scale: 1,
                            duration: 1
                        });

                    // Pillar 2 transition
                    masterTimeline
                        .to(textPillars[0], { autoAlpha: 0 })
                        .to(textPillars[1], { autoAlpha: 1 }, "<")
                        .to(actor3D, { 
                            rotationY: 120, 
                            rotationX: 10, 
                            scale: 1.1,
                            duration: 1
                        }, "<");

                    // Pillar 3 transition
                    masterTimeline
                        .to(textPillars[1], { autoAlpha: 0 })
                        .to(textPillars[2], { autoAlpha: 1 }, "<")
                        .to(actor3D, { 
                            rotationY: -120, 
                            rotationX: -20, 
                            scale: 1.2,
                            duration: 1
                        }, "<")
                        .addLabel("pillar3_end");

                    // Exit state preparation
                    masterTimeline
                        .to(textPillars[2], { autoAlpha: 0 })
                        .to(actor3D, { 
                            rotationY: 0, 
                            rotationX: 0, 
                            scale: 1,
                            duration: 1
                        }, "<")
                        .addLabel("finalState");

                    // --- PART 2: Main ScrollTrigger Setup ---
                    const mainScrubber = ScrollTrigger.create({
                        trigger: textCol,
                        pin: visualsCol,
                        start: "top top",
                        end: "bottom bottom",
                        animation: masterTimeline,
                        scrub: 0.8,
                        invalidateOnRefresh: true,
                        onUpdate: (self) => {
                            // Update progress for debugging
                            // console.log("Progress:", self.progress.toFixed(3));
                        }
                    });

                    // --- PART 3: Flip Animation Setup ---
                    let isFlipped = false;
                    let flipInProgress = false;

                    ScrollTrigger.create({
                        trigger: summaryContainer,
                        start: "top center",
                        onEnter: () => {
                            if (!isFlipped && !flipInProgress) {
                                isFlipped = true;
                                flipInProgress = true;

                                // Disable main scrubber before flip
                                mainScrubber.disable();

                                const state = Flip.getState(actor3D, {
                                    props: "scale,rotation,transform"
                                });

                                // Move actor to new container
                                summaryClipper.appendChild(actor3D);
                                visualsCol.classList.add('is-exiting');

                                Flip.from(state, {
                                    duration: 0.8,
                                    ease: "power2.inOut",
                                    scale: true,
                                    rotation: true,
                                    onComplete: () => {
                                        flipInProgress = false;
                                        gsap.set(actor3D, { clearProps: "transform" });
                                    }
                                });
                            }
                        },
                        onLeaveBack: () => {
                            if (isFlipped && !flipInProgress) {
                                isFlipped = false;
                                flipInProgress = true;

                                const state = Flip.getState(actor3D, {
                                    props: "scale,rotation,transform"
                                });

                                // Move actor back to original container
                                visualsCol.appendChild(actor3D);
                                visualsCol.classList.remove('is-exiting');

                                Flip.from(state, {
                                    duration: 0.8,
                                    ease: "power2.out",
                                    scale: true,
                                    rotation: true,
                                    onComplete: () => {
                                        flipInProgress = false;
                                        // Reset to final pillar state
                                        masterTimeline.seek("finalState");
                                        mainScrubber.enable();
                                        gsap.set(actor3D, { clearProps: "transform" });
                                    }
                                });
                            }
                        }
                    });

                    // Clean up will-change on leave
                    ScrollTrigger.create({
                        trigger: textCol,
                        start: "top top",
                        end: "bottom bottom",
                        onLeave: () => {
                            gsap.set([actor3D, ...textPillars], {
                                willChange: "auto"
                            });
                        }
                    });
                },

                // Mobile Layout
                "(max-width: 768px)": function () {
                    // Kill any active tweens and ScrollTriggers
                    gsap.killTweensOf(actor3D);
                    ScrollTrigger.getAll().forEach(st => st.kill());

                    // Reset all elements to default state
                    gsap.set('.pillar-text-content', { autoAlpha: 1 });
                    gsap.set(actor3D, { clearProps: "all" });
                    
                    // Reset state flags
                    isFlipped = false;
                }
            });
        });

        return () => ctx.revert();
    }

    // --- Initialize Animations ---
    function initialCheck() {
        if (window.gsap && window.ScrollTrigger && window.Flip) {
            setupAnimations();
        } else {
            setTimeout(initialCheck, 100);
        }
    }

    initialCheck();
});
