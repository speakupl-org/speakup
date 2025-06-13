// main.js (Final Polished Version)

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

        const ctx = gsap.context(() => {
            
            ScrollTrigger.matchMedia({

                "(min-width: 769px)": function () {

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

                    const masterTimeline = gsap.timeline({
                        scrollTrigger: {
                            trigger: textCol,
                            pin: visualsCol,
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 1,
                        }
                    });

                    // Set initial state of ALL text pillars to invisible.
                    gsap.set(textPillars, { autoAlpha: 0 });

                    // **Pillar 1: Explicit From/To for perfect alignment**
                    masterTimeline
                        .to(textPillars[0], { autoAlpha: 1 })
                        .fromTo(actor3D, 
                            { rotationY: 20, rotationX: -15, scale: 1 },
                            { rotationY: 120, rotationX: 10, scale: 1.1, ease: "power2.inOut" },
                            "<" // The key is to start the cube animation WITH the text fade-in
                        );

                    // **Pillar 2**
                    masterTimeline
                        .to(textPillars[0], { autoAlpha: 0 })
                        .to(textPillars[1], { autoAlpha: 1 }, "<+=0.2") // Overlap the fades slightly
                        .fromTo(actor3D,
                            { rotationY: 120, rotationX: 10, scale: 1.1 },
                            { rotationY: -120, rotationX: -20, scale: 1.2, ease: "power2.inOut" },
                            "<"
                        );

                    // **Pillar 3**
                    masterTimeline
                        .to(textPillars[1], { autoAlpha: 0 })
                        .to(textPillars[2], { autoAlpha: 1 }, "<+=0.2")
                        .fromTo(actor3D,
                            { rotationY: -120, rotationX: -20, scale: 1.2 },
                            { rotationY: 0, rotationX: 0, scale: 1, ease: "power3.inOut" },
                            "<"
                        );
                    
                    // Final hold to ensure Pillar 3 text is readable at the end of the scroll
                     masterTimeline.to(textPillars[2], { autoAlpha: 0, delay: 0.5 });


                    // --- The "Igloo" Exit/Return Animation ---
                    let isFlipped = false;

                    ScrollTrigger.create({
                        trigger: summaryContainer,
                        start: "top center",
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
                                        gsap.set(actor3D, { clearProps: "all" });
                                    }
                                });
                            }
                        },
                        onLeaveBack: () => {
                            if (isFlipped) {
                                isFlipped = false;
                                gsap.set(actor3D, { autoAlpha: 0 });
                                visualsCol.appendChild(actor3D);
                                visualsCol.classList.remove('is-exiting');
                                masterTimeline.progress(1);
                                gsap.set(actor3D, { autoAlpha: 1 });
                            }
                        }
                    });
                },

                "(max-width: 768px)": function () {
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
