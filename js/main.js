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

                    // --- THE MASTER TIMELINE ---
                    // This single timeline controls the entire pillar sequence.
                    const masterTimeline = gsap.timeline({
                        scrollTrigger: {
                            trigger: textCol,
                            pin: visualsCol,
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 1, // Using a smooth scrub value
                        }
                    });

                    // Set initial state of ALL text pillars to invisible.
                    gsap.set(textPillars, { autoAlpha: 0 });

                    // --- THE PERFECTLY PACED ANIMATION SEQUENCE ---

                    // **Pillar 1: Define explicit FROM and TO states for perfect alignment.**
                    masterTimeline
                        .to(textPillars[0], { autoAlpha: 1 }) // 1. Fade in text
                        .fromTo(actor3D, // 2. Animate cube at the SAME TIME
                            { rotationY: 20, rotationX: -15, scale: 1 },
                            { rotationY: 120, rotationX: 10, scale: 1.1, ease: "power1.inOut" },
                            "<" // The "<" ensures this starts with the text fade-in
                        );
                    
                    // **Pillar 2: Transition from Pillar 1's state to Pillar 2's state.**
                    masterTimeline
                        .to(textPillars[0], { autoAlpha: 0 }) // 1. Fade out previous text
                        .to(textPillars[1], { autoAlpha: 1 }, "<+=0.1") // 2. Fade in new text slightly after
                        .fromTo(actor3D, // 3. Animate cube at the SAME TIME as the fade out
                            { rotationY: 120, rotationX: 10, scale: 1.1 },
                            { rotationY: -120, rotationX: -20, scale: 1.2, ease: "power1.inOut" },
                            "<"
                        );

                    // **Pillar 3: Transition from Pillar 2's state to the final "at rest" state.**
                    masterTimeline
                        .to(textPillars[1], { autoAlpha: 0 }) // 1. Fade out previous text
                        .to(textPillars[2], { autoAlpha: 1 }, "<+=0.1") // 2. Fade in final text
                        .fromTo(actor3D, // 3. Animate cube at the SAME TIME
                            { rotationY: -120, rotationX: -20, scale: 1.2 },
                            { rotationY: 0, rotationX: 0, scale: 1, ease: "power1.inOut" },
                            "<"
                        );
                    
                    // Add a final "hold" at the end so Pillar 3 text is readable before the section ends.
                    masterTimeline.to({}, { duration: 0.2 });

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
                        // ** THE SEAMLESS "NO-BLIP" onLeaveBack **
                        onLeaveBack: () => {
                            if (isFlipped) {
                                isFlipped = false;
                                // Hide the cube for one frame to prevent the browser "blip"
                                gsap.set(actor3D, { autoAlpha: 0 });
                                
                                // Instantly do all DOM and state changes while it's hidden
                                visualsCol.appendChild(actor3D);
                                visualsCol.classList.remove('is-exiting');
                                masterTimeline.progress(1); // Set scrub to the correct end-state
                                
                                // Reveal the cube again. This all happens in the same frame.
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
