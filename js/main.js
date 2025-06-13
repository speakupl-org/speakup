// main.js (Final Architectural Version, based on evidence)

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

                    if (!visualsCol || !textCol || !actor3D) { return; }
                    
                    // --- 1. DECOUPLED PINNING ---
                    // This trigger's ONLY job is to pin the visuals column. No animation.
                    ScrollTrigger.create({
                        trigger: textCol,
                        pin: visualsCol,
                        start: "top top",
                        end: "bottom bottom"
                    });
                    
                    // --- 2. THE MASTER "ANIMATION MENU" TIMELINE (PAUSED) ---
                    const masterTimeline = gsap.timeline({ paused: true });

                    masterTimeline
                        // State for Pillar 1
                        .addLabel("pillar1")
                        .to(textPillars[0], { autoAlpha: 1 })
                        .fromTo(actor3D, { rotationY: 20, rotationX: -15, scale: 1 }, { rotationY: 120, rotationX: 10, scale: 1.1, ease: "power1.inOut" }, "<")

                        // State for Pillar 2
                        .addLabel("pillar2")
                        .to(textPillars[0], { autoAlpha: 0 })
                        .to(textPillars[1], { autoAlpha: 1 }, "<")
                        .to(actor3D, { rotationY: -120, rotationX: -20, scale: 1.2, ease: "power1.inOut" }, "<")
                        
                        // State for Pillar 3
                        .addLabel("pillar3")
                        .to(textPillars[1], { autoAlpha: 0 })
                        .to(textPillars[2], { autoAlpha: 1 }, "<")
                        .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1, ease: "power1.inOut" }, "<");
                    
                    // --- 3. INDIVIDUAL TRIGGERS FOR EACH PILLAR ---
                    // This is the core of the new architecture.
                    textPillars.forEach((pillar, i) => {
                        ScrollTrigger.create({
                            trigger: pillar,
                            start: "top center",
                            end: "bottom center",
                            onEnter: () => masterTimeline.tweenTo(`pillar${i + 1}`, {duration: 0.8, ease: "power1.inOut"}),
                            onEnterBack: () => masterTimeline.tweenTo(`pillar${i + 1}`, {duration: 0.8, ease: "power1.inOut"})
                        });
                    });

                    // --- 4. The "Igloo" Exit Animation ---
                    let isFlipped = false;
                    ScrollTrigger.create({
                        trigger: summaryContainer,
                        start: "top center",
                        onEnter: () => {
                            if (!isFlipped) {
                                isFlipped = true;
                                masterTimeline.pause(); // Pause the main timeline to prevent conflicts
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
                                const state = Flip.getState(actor3D);
                                visualsCol.appendChild(actor3D);
                                visualsCol.classList.remove('is-exiting');
                                Flip.from(state, {
                                    duration: 0.8,
                                    ease: "power2.out",
                                    onComplete: () => {
                                        // Resume the master timeline and sync it to the last pillar state
                                        masterTimeline.play().tweenTo("pillar3");
                                    }
                                });
                            }
                        }
                    });

                },

                "(max-width: 768px)": function () {
                    // On mobile, just make sure everything is visible and reset.
                    gsap.set(textPillars, { autoAlpha: 1 });
                    gsap.set(actor3D, { clearProps: "all" });
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
