document.addEventListener('DOMContentLoaded', function() {

    // --- Menu & Footer code should go here (I've removed it for brevity) ---
    // ...

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.matchMedia({
        "(min-width: 769px)": function() {

            // --- 1. SETUP ---
            const visualsCol = document.querySelector(".pillar-visuals-col");
            const actor3D = document.getElementById("actor-3d");
            const textSections = gsap.utils.toArray('.pillar-text-content');
            
            gsap.set(actor3D, { rotationX: -10, rotationY: 20 });
            gsap.set(textSections, { autoAlpha: 0 }); // Hide all text initially

            // --- 2. THE MASTER TIMELINE ---
            // This is the SAME setup as our successful diagnostic test.
            const masterTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: ".scrolly-container",
                    pin: visualsCol,
                    start: "top top",
                    end: "+=6000", // Ample scroll distance
                    scrub: 1.5,
                    // markers: true,
                }
            });

            // --- 3. THE MODULAR CHOREOGRAPHY ---

            // ** Act 1: Diagnosis **
            masterTimeline
                .add("act1") // Start of Act 1
                .to(textSections[0], { autoAlpha: 1, duration: 0.5 }, "act1")
                .to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.2, duration: 4, ease: "power2.inOut" }, "act1")
                .to({}, { duration: 1 }) // Reading Pause
                // Animate OUT Act 1's text
                .to(textSections[0], { autoAlpha: 0, duration: 0.5 });
            
            // ** Act 2: Dialogue **
            masterTimeline
                .add("act2")
                .to(textSections[1], { autoAlpha: 1, duration: 0.5 }, "act2")
                .to(actor3D, { rotationY: -120, rotationX: -20, scale: 1, duration: 4, ease: "power2.inOut" }, "act2")
                .to({}, { duration: 1 }) // Reading Pause
                // Animate OUT Act 2's text
                .to(textSections[1], { autoAlpha: 0, duration: 0.5 });
            
            // ** Act 3: Evolution **
            masterTimeline
                .add("act3")
                .to(textSections[2], { autoAlpha: 1, duration: 0.5 }, "act3")
                .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1.1, duration: 4, ease: "power3.inOut" }, "act3")
                .to({}, { duration: 2 }); // Final reading pause
        }
    });
});
