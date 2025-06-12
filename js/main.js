document.addEventListener('DOMContentLoaded', function() {

    // --- Menu & Footer code should remain here ---
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
    // 3D SCROLLYTELLING - THE STABLE KEYFRAME ARCHITECTURE
    // =========================================================================

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.matchMedia({

        "(min-width: 769px)": function() {

            // --- 1. SETUP ---
            const visualsCol = document.querySelector(".pillar-visuals-col");
            const actor3D = document.getElementById("actor-3d");
            const textPillar1 = document.querySelector('[data-pillar="1"]');
            const textPillar2 = document.querySelector('[data-pillar="2"]');
            const textPillar3 = document.querySelector('[data-pillar="3"]');
            
            // Initial states
            gsap.set(actor3D, { rotationX: -10, rotationY: 20, scale: 1 });
            gsap.set(textPillar2, { autoAlpha: 0 }); // Hide 2 and 3
            gsap.set(textPillar3, { autoAlpha: 0 });

            // --- 2. THE MASTER TIMELINE ---
            const masterTimeline = gsap.timeline({
                // This ScrollTrigger configuration is PROVEN to work from our diagnostic test.
                scrollTrigger: {
                    trigger: ".scrolly-container",
                    pin: visualsCol,
                    start: "top top",
                    end: "+=5000", // A generous scroll length
                    scrub: 1.2,
                    // markers: true,
                }
            });

            // --- 3. THE KEYFRAME ANIMATION ---

            // **KEYFRAME 1: Pillar 1 is fully visible and in its state.**
            // We just need a pause here for the user to read before the transition starts.
            masterTimeline.to({}, { duration: 1 });


            // **TRANSITION from State 1 to State 2**
            masterTimeline.add("state1_to_state2"); // Label the transition
            // Animate OUT the text of Pillar 1
            masterTimeline.to(textPillar1, { autoAlpha: 0, duration: 1 }, "state1_to_state2");
            // Animate IN the text of Pillar 2 at the same time
            masterTimeline.to(textPillar2, { autoAlpha: 1, duration: 1 }, "state1_to_state2");
            // Simultaneously, animate the CUBE to its Pillar 2 state
            masterTimeline.to(actor3D, { 
                rotationY: -120, 
                rotationX: -20, 
                scale: 1.2, 
                duration: 4, // Make the cube turn over a longer period
                ease: "power2.inOut"
            }, "state1_to_state2");

            // Pause for reading Pillar 2
            masterTimeline.to({}, { duration: 1 });
            
            
            // **TRANSITION from State 2 to State 3**
            masterTimeline.add("state2_to_state3");
            // Animate OUT Pillar 2 text
            masterTimeline.to(textPillar2, { autoAlpha: 0, duration: 1 }, "state2_to_state3");
            // Animate IN Pillar 3 text
            masterTimeline.to(textPillar3, { autoAlpha: 1, duration: 1 }, "state2_to_state3");
            // Simultaneously, animate the CUBE to its final "hero" state
            masterTimeline.to(actor3D, { 
                rotationY: 0, 
                rotationX: 0, 
                scale: 1.1,
                duration: 4, 
                ease: "power3.inOut" 
            }, "state2_to_state3");
            
            // Final pause
            masterTimeline.to({}, { duration: 2 });
        },

        "(max-width: 768px)": function() {
            // Mobile view - no complex animations needed
        }
    });
});
