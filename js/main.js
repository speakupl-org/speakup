document.addEventListener('DOMContentLoaded', function() {

    // --- Menu Toggle and Footer Code (Unchanged) ---
    // (Your existing menu code and footer year code should remain here)
    // ...

    // =========================================================================
    // "IGLOO-STYLE" SCROLLYTELLING - REFINED FOR SMOOTH SCRUBBING
    // =========================================================================
    
    const scrollyContainer = document.querySelector('.scrolly-container');
    if (scrollyContainer) {
        
        gsap.registerPlugin(ScrollTrigger, Flip);

        ScrollTrigger.matchMedia({

            // --- DESKTOP ANIMATIONS (screen width > 768px) ---
            "(min-width: 769px)": function() {
                
                // --- 1. SETUP & SELECTORS ---
                const visualItems = gsap.utils.toArray('.pillar-visual-item');
                const imageScalers = gsap.utils.toArray('.pillar-image-scaler');
                const textSections = gsap.utils.toArray('.pillar-text-content');
                const textWrappers = gsap.utils.toArray('.text-anim-wrapper');
                
                const visualsColumn = document.querySelector('.pillar-visuals-col');
                const summarySection = document.querySelector('.method-summary');
                const placeholder = document.querySelector('.summary-thumbnail-placeholder');
                const lastVisual = visualItems[visualItems.length - 1];
                
                gsap.set(visualsColumn, { autoAlpha: 1 });

                // --- 2. INITIAL STATE ---
                gsap.set(visualItems.slice(1), { autoAlpha: 0 });
                gsap.set(textWrappers, { yPercent: 0, autoAlpha: 1 }); // Start all text visible
                gsap.set(textWrappers.slice(1), { autoAlpha: 0 }); // Then hide all but the first

                // --- 3. REFINED NARRATIVE TRANSITIONS ---
                // We will create a single, master timeline to control the main pillar transitions.
                // This gives us more control and prevents conflicting animations.
                
                const masterTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: scrollyContainer,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1.2, // This single scrub value controls the whole sequence
                        // markers: true,
                    }
                });

                // -- TRANSITION 1: From Pillar 1 to 2 --
                masterTimeline
                    // A) Hold the first scene while scrolling through the first text block
                    .to({}, { duration: 1 }) // This empty tween creates a pause/duration
                    
                    // B) Animate from Pillar 1 to 2
                    .to(textWrappers[0], { yPercent: -100, autoAlpha: 0, ease: 'power2.in' }, "scene1_end")
                    .to(imageScalers[0], { scale: 2.2, x: '-25%', y: '15%', ease: 'power2.inOut' }, "scene1_end")
                    .to(visualItems[0], { autoAlpha: 0 }, "scene1_end+=0.3")
                    
                    .set(imageScalers[1], { scale: 2.5, x: '20%', y: '-10%' }) // Set initial state of incoming image
                    .to(visualItems[1], { autoAlpha: 1 }, "scene1_end+=0.3")
                    .to(imageScalers[1], { scale: 1, x: '0%', y: '0%', ease: 'power2.out' }, "scene1_end+=0.3")
                    .from(textWrappers[1], { yPercent: 100, autoAlpha: 0, ease: 'power2.out' }, "scene1_end");
                    
                // -- TRANSITION 2: From Pillar 2 to 3 --
                masterTimeline
                    // A) Hold the second scene
                    .to({}, { duration: 1 })
                    
                    // B) Animate from Pillar 2 to 3
                    .to(textWrappers[1], { yPercent: -100, autoAlpha: 0, ease: 'power2.in' }, "scene2_end")
                    .to(visualItems[1], { autoAlpha: 0, scale: 0.98 }, "scene2_end")
                    .from(visualItems[2], { autoAlpha: 0, scale: 1.02 }, "scene2_end")
                    .from(textWrappers[2], { yPercent: 100, autoAlpha: 0, ease: 'power2.out' }, "scene2_end");

                // --- 4. REFINED "FEEL" & "EXIT" ---
                
                // MOUSE PARALLAX (This was working well, kept as is)
                // ... (your mousemove code here) ...

                // THE "EXIT" ANIMATION (THE CRITICAL FIX)
                // We create a separate timeline specifically for the exit, and we SCRUB it.
                const exitTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: summarySection,
                        start: "top 80%", // Start when the summary section is 80% from the top
                        end: "top top",   // End when it reaches the top
                        scrub: 1,         // CRITICAL: This scrubs the animation
                        // markers: {startColor: "purple", endColor: "purple"}
                    }
                });

                // Get the state of the image BEFORE the animation starts
                const state = Flip.getState(lastVisual, { props: "transform,opacity" });
                
                // Temporarily move the element to its final container to calculate the end state
                placeholder.appendChild(lastVisual);
                
                // Run the Flip animation INSIDE our new scrubbable timeline
                exitTimeline.add(
                    Flip.from(state, {
                        // We remove duration because scrub is now controlling the time
                        scale: true,
                        ease: "power1.inOut",
                        onEnter: () => visualsColumn.classList.add('is-exiting'), // Hide original container
                        onLeaveBack: () => visualsColumn.classList.remove('is-exiting') // Show it again on scroll up
                    })
                );

            }, // end of desktop function
            
            "(max-width: 768px)": function() { /* Mobile remains empty */ }
        });
    }

    // --- Menu Toggle and Footer Code (Unchanged) ---
    // Make sure your menu code is here if it wasn't at the top
    const openButton = document.getElementById('menu-open-button');
    const closeButton = document.getElementById('menu-close-button');
    const menuScreen = document.getElementById('menu-screen');
    const htmlElement = document.documentElement;
    const body = document.body;
    function openMenu(){ htmlElement.classList.add('menu-open'); body.classList.add('menu-open'); }
    function closeMenu(){ htmlElement.classList.remove('menu-open'); body.classList.remove('menu-open'); }
    if (openButton) { openButton.addEventListener('click', openMenu); closeButton.addEventListener('click', closeMenu); }
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); }
});
