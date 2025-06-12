document.addEventListener('DOMContentLoaded', function() {

    // --- Menu Toggle and Footer Code (Unchanged) ---
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
    // 3D SCROLLYTELLING - PHASE 2.5: REFINED CHOREOGRAPHY
    // =========================================================================

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.matchMedia({

        "(min-width: 769px)": function() {

            // --- 1. SETUP SELECTORS ---
            const actor3D = document.getElementById("actor-3d");
            const textSections = gsap.utils.toArray('.pillar-text-content');
            
            gsap.set(actor3D, { rotationX: -10, rotationY: 20, autoAlpha: 1 });
            
            // --- 2. CREATE THE MASTER TIMELINE ---
            const masterTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: ".scrolly-container",
                    start: "top top",
                    end: "+=6000",
                    scrub: 1.5,
                    pin: ".pillar-visuals-col",
                    pinSpacing: true,
                    // markers: true,
                }
            });

            // --- 3. BUILD THE UPGRADED ANIMATION SEQUENCE ---

            // For each text section, we create a function to generate its animation.
            // This is a more scalable and readable "modular" approach.
            textSections.forEach((section, index) => {
                const number = section.querySelector('.pillar-number');
                const line = section.querySelector('.pillar-line');
                const title = section.querySelector('.pillar-title');
                const paragraph = section.querySelector('.pillar-paragraph');
                
                // Add a label for the start of the current pillar's animations
                masterTimeline.addLabel(`act${index + 1}_start`);

                // Animate OUT the PREVIOUS text section, if it exists (i.e., if index > 0)
                if (index > 0) {
                    const prevSection = textSections[index - 1];
                    const prevElements = prevSection.querySelectorAll(".pillar-number, .pillar-line, .pillar-title, .pillar-paragraph");
                    masterTimeline.to(prevElements, { 
                        autoAlpha: 0, 
                        y: -50, 
                        stagger: 0.05, 
                        duration: 0.5 
                    }, `act${index + 1}_start`);
                }

                // Animate IN the CURRENT text section
                masterTimeline
                    .from([number, title, paragraph], {
                        autoAlpha: 0,
                        y: 60,
                        rotationX: -45, // NEW: Adds the 3D text rotation effect
                        stagger: 0.1,
                        duration: 1,
                        ease: "power2.out"
                    }, `act${index + 1}_start`)
                    .to(line, { // Animate the decorative line
                        scaleX: 1,
                        duration: 0.8,
                        ease: "power3.out"
                    }, `act${index + 1}_start+=0.2`); // Start the line animation slightly after text starts

                // Animate the 3D CUBE for each corresponding pillar
                if (index === 0) { // Act 1
                    masterTimeline.to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.2, duration: 2, ease: "power2.inOut" }, `act${index + 1}_start`);
                } else if (index === 1) { // Act 2
                    masterTimeline.to(actor3D, { rotationY: -120, rotationX: -20, scale: 1, duration: 2, ease: "power2.inOut" }, `act${index + 1}_start`);
                } else if (index === 2) { // Act 3
                    masterTimeline.to(actor3D, { rotationY: 0, rotationX: 0, scale: 1.1, duration: 2, ease: "power3.inOut" }, `act${index + 1}_start`);
                }
                
                // Add the reading pause
                masterTimeline.to({}, { duration: (index === 2) ? 2.0 : 1.5 });
            });

        },

        "(max-width: 768px)": function() {
            // Mobile fallback: No complex JS animations. Let CSS handle it.
        }

    }); // End of matchMedia

}); // End of DOMContentLoaded
