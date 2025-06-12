document.addEventListener('DOMContentLoaded', function() {

    // --- Menu & Footer code remains here ---
    const openButton = document.getElementById('menu-open-button');
    const closeButton = document.getElementById('menu-close-button');
    const menuScreen = document.getElementById('menu-screen');
    const htmlElement = document.documentElement;
    const body = document.body;
    function openMenu(){ htmlElement.classList.add('menu-open'); body.classList.add('menu-open'); menuScreen.setAttribute('aria-hidden', 'false'); }
    function closeMenu(){ htmlElement.classList.remove('menu-open'); body.classList.remove('menu-open'); menuScreen.setAttribute('aria-hidden', 'true'); }
    if(openButton && closeButton && menuScreen){ openButton.addEventListener('click', openMenu); closeButton.addEventListener('click', closeMenu); }
    const yearSpan = document.getElementById('current-year');
    if(yearSpan){ yearSpan.textContent = new Date().getFullYear(); }

    // =========================================================================
    // 3D SCROLLYTELLING - V6: THE DEFINITIVE ARCHITECTURE
    // =========================================================================

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.matchMedia({

        "(min-width: 769px)": function() {

            // --- 1. SETUP & INITIAL STATE ---
            const visualsCol = document.querySelector(".pillar-visuals-col");
            const actor3D = document.getElementById("actor-3d");
            const textPillars = gsap.utils.toArray('.pillar-text-content');
            
            // Set the scene. Pillar 1's text is visible, the others are not.
            // This is done with .set(), which happens instantly and is perfect for setup.
            gsap.set(textPillars[0], { autoAlpha: 1 });
            gsap.set(textPillars.slice(1), { autoAlpha: 0 }); // Hide pillars 2 and 3

            // --- 2. THE MASTER TIMELINE & PINNING ---
            // This setup has been proven to work. We create a long scroll area
            // and pin the visual column to it.
            const masterTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: ".scrolly-container",
                    pin: visualsCol,
                    start: "top top",
                    end: "+=4000", // A generous but reasonable scroll distance
                    scrub: 1.2,
                    // markers: true,
                }
            });

            // --- 3. THE SCENE-BASED CHOREOGRAPHY ---
            // We build the animation as a series of transitions between defined scenes.

            // == SCENE 1: DIAGNOSIS ==
            // Hold the initial state for a moment to allow reading.
            masterTimeline
                .addLabel("scene1_hold")
                .to(actor3D, { rotationY: 120, rotationX: 10, ease: "power2.inOut", duration: 2 })
                .to({}, { duration: 1 }); // Reading pause duration


            // == TRANSITION: SCENE 1 TO SCENE 2 ==
            masterTimeline
                .addLabel("scene1_to_2")
                // Fade out text of Pillar 1
                .to(textPillars[0], { autoAlpha: 0, duration: 1 }, "scene1_to_2")
                // Fade in text of Pillar 2, slightly overlapping for smoothness
                .to(textPillars[1], { autoAlpha: 1, duration: 1 }, "scene1_to_2+=0.25")
                // Simultaneously, animate the cube to its Scene 2 state
                .to(actor3D, { 
                    rotationY: -120, 
                    rotationX: -20, 
                    scale: 1.2, 
                    ease: "power2.inOut",
                    duration: 2.5 
                }, "scene1_to_2");


            // == SCENE 2: CONVERSATION ==
            // Hold the second state for reading.
            masterTimeline.to({}, { duration: 1 });


            // == TRANSITION: SCENE 2 TO SCENE 3 ==
            masterTimeline
                .addLabel("scene2_to_3")
                .to(textPillars[1], { autoAlpha: 0, duration: 1 }, "scene2_to_3")
                .to(textPillars[2], { autoAlpha: 1, duration: 1 }, "scene2_to_3+=0.25")
                // Simultaneously, animate the cube to its final "hero" state
                .to(actor3D, { 
                    rotationY: 0, 
                    rotationX: 0, 
                    scale: 1, 
                    ease: "power3.inOut",
                    duration: 2.5
                }, "scene2_to_3");

            
            // == SCENE 3: EVOLUTION ==
            // Final hold.
            masterTimeline.to({}, { duration: 2 });
        },

        "(max-width: 768px)": function() {
            // Mobile view - no complex animations needed
        }
    });
});
