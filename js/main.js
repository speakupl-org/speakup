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
                "(min-width: 769px)": function () {
                    gsap.set(textPillars, { autoAlpha: 0 });
                    gsap.set(textPillars[0], { autoAlpha: 1 });

                    textPillars.forEach((pillar) => {
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

                    // Define the key animation states
                    const pillar1State = { rotationY: 20, rotationX: -15, scale: 1.0 };
                    const pillar2State = { rotationY: 120, rotationX: 10, scale: 1.1 };
                    const pillar3State = { rotationY: -120, rotationX: -20, scale: 1.2 };
                    const exitState = { rotationY: 0, rotationX: 0, scale: 1.0 };

                    const masterTimeline = gsap.timeline({
                        defaults: { duration: 1, ease: "power2.inOut" }
                    });
                    
                    masterTimeline
                        .to(actor3D, pillar1State)
                        .to(textPillars[0], { autoAlpha: 1 }, "<")
                        
                        .to(textPillars[0], { autoAlpha: 0 })
                        .to(textPillars[1], { autoAlpha: 1 }, "<")
                        .to(actor3D, pillar2State, "<")
                        
                        // Add label at the START of the Pillar 3 animation
                        .addLabel("finalState")
                        .to(textPillars[1], { autoAlpha: 0 })
                        .to(textPillars[2], { autoAlpha: 1 }, "<")
                        .to(actor3D, pillar3State, "<")
                                                
                        .to(textPillars[2], { autoAlpha: 0 })
                        .to(actor3D, exitState, "<");

                    const mainScrubber = ScrollTrigger.create({
                        trigger: textCol,
                        pin: visualsCol,
                        start: "top top",
                        end: "bottom bottom",
                        animation: masterTimeline,
                        scrub: 0.8,
                        invalidateOnRefresh: true,
                    });

                    ScrollTrigger.create({
                        trigger: summaryContainer,
                        start: "top center",
                        onEnter: () => {
                            if (!isFlipped) {
                                isFlipped = true;
                                mainScrubber.disable(); 

                                const state = Flip.getState(actor3D, { props: "scale, rotation" });
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
                                
                                const state = Flip.getState(actor3D, { props: "scale, rotation" });
                                visualsCol.appendChild(actor3D);
                                visualsCol.classList.remove('is-exiting');

                                // THE FIX: Animate TO the correct state in a single tween
                                Flip.from(state, {
                                    duration: 0.8,
                                    ease: "power2.out",
                                    // Animate scale, rotation, etc. TO the Pillar 3 values
                                    scale: true, // Let Flip handle the size change
                                    rotationY: pillar3State.rotationY, // Animate TO this rotation
                                    rotationX: pillar3State.rotationX, // Animate TO this rotation
                                    onComplete: () => {
                                        // Sync the timeline to the correct spot
                                        masterTimeline.seek("finalState");
                                        // Then re-enable scrubbing
                                        mainScrubber.enable();
                                    }
                                });
                            }
                        }
                    });
                },
                
                "(max-width: 768px)": function () {
                    ScrollTrigger.getAll().forEach(st => st.kill());
                    gsap.killTweensOf([actor3D, ...textPillars, '.pillar-line']);
                    
                    gsap.set([textPillars, actor3D, '.pillar-line'], { clearProps: "all" });

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
