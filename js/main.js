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
    // 3D SCROLLYTELLING - V5: LABEL-DRIVEN ARCHITECTURE
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
            
            // Set initial states explicitly for clarity.
            // Pillar 1 is visible, the others are not.
            gsap.set(actor3D, { rotationX: 0, rotationY: 0, scale: 1 });
            gsap.set(textPillar1, { autoAlpha: 1 });
            gsap.set(textPillar2, { autoAlpha: 0 }); 
            gsap.set(textPillar3, { autoAlpha: 0 });

            // --- 2. THE MASTER TIMELINE ---
            const masterTimeline = gsap.timeline({
                // The ScrollTrigger setup is the same, as the diagnostic proved it works.
                scrollTrigger: {
                    trigger: ".scrolly-container",
                    pin: visualsCol,
                    start: "top top",
                    end: "+=4000", // A sufficient but not excessive length.
                    scrub: 1.2,
                    // markers: true,
                }
            });

            // --- 3. THE LABEL-DRIVEN CHOREOGRAPHY ---

            // --- SCENE 1: DIAGNOSIS ---
            masterTimeline
                .addLabel("scene1")
                // The initial animation state for the cube for scene 1
                .to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.2, ease: "power2.inOut" })
                // This empty tween creates a "pause" or "hold" for reading.
                // It makes the timeline longer, giving the user time to scroll.
                .to({}, {duration: 1});


            // --- SCENE 2: CONVERSATION ---
            masterTimeline
                .addLabel("scene2")
                // The transition to scene 2: fade out old text, fade in new text
                .to(textPillar1, { autoAlpha: 0 }, "scene2")
                .to(textPillar2, { autoAlpha: 1 }, "scene2")
                // While the text cross-fades, the cube animates to its new state
                .to(actor3D, { rotationY: -120, rotationX: -20, scale: 1.0, ease: "power2.inOut" }, "scene2")
                .to({}, {duration: 1});


            // --- SCENE 3: EVOLUTION ---
            masterTimeline
                .addLabel("scene3")
                .to(textPillar2, { autoAlpha: 0 }, "scene3")
                .to(textPillar3, { autoAlpha: 1 }, "scene3")
                // The cube resolves to its final hero state
                .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1.1, ease: "power3.inOut" }, "scene3")
                .to({}, {duration: 1.5}); // A longer final hold
        },

        "(max-width: 768px)": function() {
            // Mobile view - no complex animations needed
        }
    });
});
