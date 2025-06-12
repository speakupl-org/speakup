document.addEventListener('DOMContentLoaded', function() {
    // We only need GSAP and ScrollTrigger for this test
    gsap.registerPlugin(ScrollTrigger);

    // Using matchMedia is still best practice
    ScrollTrigger.matchMedia({
        "(min-width: 769px)": function() {
            
            // --- THE DIAGNOSTIC TEST ---
            // The goal is to see if we can create a 3000px scroll area
            // where the visuals column stays pinned.
            
            ScrollTrigger.create({
                trigger: ".scrolly-container", // The container for both cols
                pin: ".pillar-visuals-col",   // The element to be pinned
                start: "top top",
                end: "+=3000", // "Make this scroll last for 3000px"
                pinSpacing: true, // This is the crucial property
                markers: true // We NEED to see what GSAP is thinking
            });
            
        }
    });
});
