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
    // 3D SCROLLYTELLING - V4: PILLAR 3 FIX
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
            gsap.set(textPillar2, { autoAlpha: 0 }); 
            gsap.set(textPillar3, { autoAlpha: 0 });

            // --- 2. THE MASTER TIMELINE ---
            const masterTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: ".scrolly-container",
                    pin: visualsCol,
                    start: "top top",
                    // *** CHANGE #1: INCREASED SCROLL DURATION ***
                    end: "+=6000",
                    scrub: 1.2,
                    // markers: true, // Keep this handy for debugging
                }
            });

            // --- 3. THE KEYFRAME ANIMATION ---

            // **KEYFRAME 1: Pillar 1 State**
            masterTimeline.to({}, { duration: 1.5 }); // A bit more reading time


            // **TRANSITION from State 1 to State 2**
            masterTimeline.add("state1_to_state2");
            masterTimeline.to(textPillar1, { autoAlpha: 0, duration: 0.5 }, "state1_to_state2");
            masterTimeline.to(textPillar2, { autoAlpha: 1, duration: 0.5 }, "state1_to_state2");
            masterTimeline.to(actor3D, { 
                rotationY: -120, 
                rotationX: -20, 
                scale: 1.2, 
                duration: 4, 
                ease: "power2.inOut"
            }, "state1_to_state2");

            masterTimeline.to({}, { duration: 1.5 });
            
            
            // **TRANSITION from State 2 to State 3**
            masterTimeline.add("state2_to_state3");
            masterTimeline.to(textPillar2, { autoAlpha: 0, duration: 0.5 }, "state2_to_state3");
            masterTimeline.to(textPillar3, { autoAlpha: 1, duration: 0.5 }, "state2_to_state3");
            masterTimeline.to(actor3D, { 
                rotationY: 0, 
                rotationX: 0, 
                scale: 1.1,
                duration: 4, 
                ease: "power3.inOut" 
            }, "state2_to_state3");
            
            // ** CHANGE #2: ADJUSTED FINAL PAUSE **
            // We ensure there's a "pause" to hold the final state.
            masterTimeline.to({}, { duration: 2.5 }); 
        },

        "(max-width: 768px)": function() {
            // Mobile view - no complex animations needed
        }
    });
});
