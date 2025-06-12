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
    // 3D SCROLLYTELLING - V3: CORRECTED CHOREOGRAPHY
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

            // --- 3. BUILD THE ROBUST ANIMATION SEQUENCE ---
            // Animate IN the first text section
            const firstSectionElements = textSections[0].querySelectorAll(".pillar-number, .pillar-line, .pillar-title, .pillar-paragraph");
            masterTimeline
                .to(textSections[0].querySelector('.pillar-line'), { scaleX: 1, duration: 0.8, ease: "power3.out" })
                .from(firstSectionElements, {
                    autoAlpha: 0, y: 60, rotationX: -45, stagger: 0.1, duration: 1, ease: "power2.out"
                }, "<"); // Start at the same time as the line animation

            // Animate the CUBE for Act 1
            masterTimeline.to(actor3D, { 
                rotationY: 120, rotationX: 10, scale: 1.2, duration: 2, ease: "power2.inOut" 
            }, "<"); // Also start at the same time

            masterTimeline.to({}, { duration: 1.5 }); // Reading Pause


            // Animate the transition between Pillar 1 and Pillar 2
            const secondSectionElements = textSections[1].querySelectorAll(".pillar-number, .pillar-line, .pillar-title, .pillar-paragraph");
            masterTimeline.addLabel("p1_to_p2");
            masterTimeline.to(firstSectionElements, { autoAlpha: 0, y: -50, stagger: 0.05, duration: 0.5 }, "p1_to_p2");
            masterTimeline.to(actor3D, { rotationY: -120, rotationX: -20, scale: 1, duration: 2, ease: "power2.inOut" }, "p1_to_p2");
            masterTimeline.to(textSections[1].querySelector('.pillar-line'), { scaleX: 1, duration: 0.8, ease: "power3.out" }, "p1_to_p2+=1");
            masterTimeline.from(secondSectionElements, { autoAlpha: 0, y: 60, rotationX: -45, stagger: 0.1, duration: 1, ease: "power2.out" }, "<");
            
            masterTimeline.to({}, { duration: 1.5 }); // Reading Pause

            
            // Animate the transition between Pillar 2 and Pillar 3
            const thirdSectionElements = textSections[2].querySelectorAll(".pillar-number, .pillar-line, .pillar-title, .pillar-paragraph");
            masterTimeline.addLabel("p2_to_p3");
            masterTimeline.to(secondSectionElements, { autoAlpha: 0, y: -50, stagger: 0.05, duration: 0.5 }, "p2_to_p3");
            masterTimeline.to(actor3D, { rotationY: 0, rotationX: 0, scale: 1.1, duration: 2, ease: "power3.inOut" }, "p2_to_p3");
            masterTimeline.to(textSections[2].querySelector('.pillar-line'), { scaleX: 1, duration: 0.8, ease: "power3.out" }, "p2_to_p3+=1");
            masterTimeline.from(thirdSectionElements, { autoAlpha: 0, y: 60, rotationX: -45, stagger: 0.1, duration: 1, ease: "power2.out" }, "<");
            
            masterTimeline.to({}, { duration: 2.0 }); // Final reading pause
        },

        "(max-width: 768px)": function() {
            // Mobile fallback: No complex JS animations. Let CSS handle it.
        }

    }); // End of matchMedia

}); // End of DOMContentLoaded
