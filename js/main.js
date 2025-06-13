// main.js (Final Architectural Version)

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
                    
                    // --- PART 1: The Film Strip ---
                    // Create the master "animation menu" timeline, paused by default.
                    // This timeline defines every possible state of the animation.
                    const masterTimeline = gsap.timeline({ paused: true });

                    masterTimeline
                        // State for Pillar 1
                        .addLabel("pillar1_start")
                        .set(textPillars, { autoAlpha: 0 }) // Reset all text
                        .set(textPillars[0], { autoAlpha: 1 }) // Show only pillar 1 text
                        .to(actor3D, { rotationY: 20, rotationX: -15, scale: 1, duration: 0.6, ease: "power2.inOut" })
                        .addLabel("pillar1_end")
                        
                        // State for Pillar 2
                        .addLabel("pillar2_start")
                        .to(textPillars[0], { autoAlpha: 0 })
                        .to(textPillars[1], { autoAlpha: 1 }, "<")
                        .to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.1, duration: 0.6, ease: "power2.inOut" }, "<")
                        .addLabel("pillar2_end")

                        // State for Pillar 3
                        .addLabel("pillar3_start")
                        .to(textPillars[1], { autoAlpha: 0 })
                        .to(textPillars[2], { autoAlpha: 1 }, "<")
                        .to(actor3D, { rotationY: -120, rotationX: -20, scale: 1.2, duration: 0.6, ease: "power2.inOut" }, "<")
                        .addLabel("pillar3_end")
                    
                        // State for Exit (Ready for Flip)
                        .addLabel("exit_start")
                        .to(textPillars[2], { autoAlpha: 0 })
                        .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1, duration: 0.6, ease: "power2.inOut" }, "<")
                        .addLabel("exit_end");


                    // --- PART 2: The Projector ---
                    // This section connects the scroll events to our "film strip".

                    // A. The Master Pin: This trigger's ONLY job is to pin the visuals. No animation.
                    ScrollTrigger.create({
                        trigger: textCol,
                        pin: visualsCol,
                        start: "top top",
                        end: "bottom bottom"
                    });

                    // B. Individual Sensors: Create a trigger for each pillar to control the timeline.
                    textPillars.forEach((pillar, i) => {
                        ScrollTrigger.create({
                            trigger: pillar,
                            start: "top center",
                            onEnter: () => masterTimeline.tweenTo(`pillar${i + 1}_end`),
                            onEnterBack: () => masterTimeline.tweenTo(`pillar${i + 1}_start`)
                        });
                    });
                    
                    // C. The Final Sensor: For the exit state.
                    ScrollTrigger.create({
                        trigger: summaryContainer,
                        start: "top bottom", // Start when summary top hits viewport bottom
                        onEnter: () => masterTimeline.tweenTo('exit_end'),
                        onEnterBack: () => masterTimeline.tweenTo('pillar3_end')
                    });


                    // --- PART 3: The Igloo Exit (State Change) ---
                    let isFlipped = false;
                    ScrollTrigger.create({
                        trigger: summaryContainer,
                        start: "top center", // This trigger is just for the Flip effect
                        onEnter: () => {
                            if (!isFlipped) {
                                isFlipped = true;
                                const state = Flip.getState(actor3D, {props: "scale"});
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
                                const state = Flip.getState(actor3D, {props: "scale"});
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
                    gsap.set('.pillar-text-content', { autoAlpha: 1 });
                    gsap.set('.object-3d', {clearProps: "all"}); 
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
