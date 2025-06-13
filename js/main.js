// in main.js

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);

    const ctx = gsap.context(() => {
        ScrollTrigger.matchMedia({
            "(min-width: 769px)": function () {

                // --- 1. SELECTORS (Unchanged) ---
                const visualsCol = document.querySelector(".pillar-visuals-col");
                const textCol = document.querySelector(".pillar-text-col");
                const actor3D = document.getElementById("actor-3d");
                const textPillars = gsap.utils.toArray('.pillar-text-content');
                const summaryContainer = document.querySelector(".method-summary");
                const summaryClipper = document.querySelector(".summary-thumbnail-clipper");

                if (!visualsCol || !textCol || !actor3D) { return; }

                // --- 2. ESTABLISH THE INITIAL STATE ---
                // Set the starting visual state before any animation happens.
                // This guarantees the page loads with Pillar 1's text visible and the cube correctly rotated.
                gsap.set(textPillars[0], { autoAlpha: 1 });
                gsap.set(textPillars.slice(1), { autoAlpha: 0 }); // Hide others
                gsap.set(actor3D, { rotationY: 20, rotationX: -15, scale: 1 });


                // --- 3. CREATE THE MASTER "ANIMATION MENU" TIMELINE ---
                // This is the core of our new architecture. It's paused by default.
                // It does NOT have a scrollTrigger. It's just a definition of states.
                // We use .to() tweens with absolute positions for perfect state control.
                const masterTimeline = gsap.timeline({ paused: true });

                // --- Scene 1: Transition to Pillar 1 state ---
                // We add a label to mark the start of this scene's animation.
                masterTimeline
                    .addLabel("pillar1")
                    .to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.1, ease: "power1.inOut" }, 0)
                    .to(textPillars[0], { autoAlpha: 1 }, 0);


                // --- Scene 2: Transition to Pillar 2 state ---
                masterTimeline
                    .addLabel("pillar2")
                    // The '1' below is an absolute position. This animation starts at the 1-second mark of the timeline.
                    .to(actor3D, { rotationY: -120, rotationX: -20, scale: 1.2, ease: "power1.inOut" }, 1) 
                    .to(textPillars[0], { autoAlpha: 0 }, 1) // Fade out old text
                    .to(textPillars[1], { autoAlpha: 1 }, 1); // Fade in new text


                // --- Scene 3: Transition to Pillar 3 state ---
                masterTimeline
                    .addLabel("pillar3")
                    .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1, ease: "power1.inOut" }, 2)
                    .to(textPillars[1], { autoAlpha: 0 }, 2)
                    .to(textPillars[2], { autoAlpha: 1 }, 2);

                
                // ---- WE WILL STOP HERE FOR NOW ----
                // The next steps will be to add the decoupled pin and the individual triggers
                // that will control this masterTimeline. But first, we must have a perfect "menu" of animations.


            }, // End of desktop matchMedia

            "(max-width: 768px)": function () {
                // ... (mobile code remains the same)
            }
        });
    });

    return () => ctx.revert();
}
