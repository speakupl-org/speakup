// main.js (Final Version)

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

                    // --- 2. THE NEW, MORE ROBUST MASTER TIMELINE ---
                    const masterTimeline = gsap.timeline({
                        scrollTrigger: {
                            trigger: textCol,
                            pin: visualsCol,
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 1,
                        }
                    });
                    
                    // --- 3. REBUILT, EVENLY-PACED ANIMATION SEQUENCE ---

                    // Set initial state of ALL text pillars to invisible.
                    gsap.set(textPillars, { autoAlpha: 0 });

                    // **Pillar 1 Section**
                    masterTimeline
                        .fromTo(actor3D, 
                            { rotationY: 20, rotationX: -15, scale: 1 }, // Explicit FROM state
                            { rotationY: 120, rotationX: 10, scale: 1.1, ease: "power2.inOut" } // Explicit TO state
                        )
                        .to(textPillars[0], { autoAlpha: 1 }, "<"); // Fade in text WITH the cube animation
                    
                    // Add a "hold" section where Pillar 1 is just visible
                    masterTimeline.to({}, {duration: 0.25});

                    // **Pillar 2 Section**
                    masterTimeline
                        .to(textPillars[0], { autoAlpha: 0 }) // Fade out previous text
                        .fromTo(actor3D, 
                            { rotationY: 120, rotationX: 10, scale: 1.1 },
                            { rotationY: -120, rotationX: -20, scale: 1.2, ease: "power2.inOut" }
                        )
                        .to(textPillars[1], { autoAlpha: 1 }, "<"); // Fade in new text

                    // Add a "hold" section
                    masterTimeline.to({}, {duration: 0.25});

                    // **Pillar 3 Section**
                    masterTimeline
                        .to(textPillars[1], { autoAlpha: 0 })
                        .fromTo(actor3D, 
                            { rotationY: -120, rotationX: -20, scale: 1.2 },
                            { rotationY: 0, rotationX: 0, scale: 1, ease: "power3.inOut" } // Final "at rest" state
                        )
                        .to(textPillars[2], { autoAlpha: 1 }, "<"); // Fade in final text
                    
                    // Add a final "hold" section
                    masterTimeline.to({}, {duration: 0.25});


                    // --- 4. THE "IGLOO" EXIT/RETURN ANIMATION ---
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
                        // ** THE NEW, SEAMLESS onLeaveBack **
                        onLeaveBack: () => {
                            if (isFlipped) {
                                isFlipped = false;

                                // Hide the cube briefly to prevent the "blip"
                                gsap.set(actor3D, { autoAlpha: 0 });

                                // Instantly move the cube back to its original parent
                                visualsCol.appendChild(actor3D);
                                visualsCol.classList.remove('is-exiting');
                                
                                // Set the master timeline to its end state
                                masterTimeline.progress(1);
                                
                                // Now that the cube is in the right place and has the right
                                // transforms, reveal it again. This all happens in one frame.
                                gsap.set(actor3D, { autoAlpha: 1 });
                            }
                        }
                    });
                },

                "(max-width: 768px)": function () {
                    // On mobile, ensure everything is visible and reset any transforms.
                    gsap.set(textPillars, { autoAlpha: 1 });
                    gsap.set(actor3D, {clearProps: "all"}); 
                }
            });
        }); // end of gsap.context()

        return () => ctx.revert(); 
    }

    // --- The "Ready Check" (unchanged) ---
    function initialCheck() {
        if (window.gsap && window.ScrollTrigger && window.Flip) {
            setupAnimations();
        } else {
            setTimeout(initialCheck, 100);
        }
    }
    
    initialCheck();

});
