document.addEventListener('DOMContentLoaded', function() {

    // --- Menu Toggle Functionality (Unchanged) ---
    // (Your existing menu code remains here)
    const openButton = document.getElementById('menu-open-button');
    const closeButton = document.getElementById('menu-close-button');
    const menuScreen = document.getElementById('menu-screen');
    const htmlElement = document.documentElement;
    const body = document.body;
    function openMenu(){ /* ... */ }
    function closeMenu(){ /* ... */ }
    if (openButton) { /* ... all your menu logic ... */ }
    
    // --- Footer Current Year (Unchanged) ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) { yearSpan.textContent = new Date().getFullYear(); }


    // =========================================================================
    // "IGLOO-STYLE" SCROLLYTELLING - THE FULL IMPLEMENTATION
    // =========================================================================
    
    // First, check if we are on a page with the scrollytelling container
    const scrollyContainer = document.querySelector('.scrolly-container');
    if (scrollyContainer) {
        
        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger, Flip);

        // Use GSAP's matchMedia for responsive animations. 
        // This is the professional way to ensure complex animations only run on desktop.
        ScrollTrigger.matchMedia({

            // --- DESKTOP ANIMATIONS (screen width > 768px) ---
            "(min-width: 769px)": function() {
                
                // --- 1. SETUP & SELECTORS ---
                // Select all the key elements we need to animate
                const visualItems = gsap.utils.toArray('.pillar-visual-item');
                const imageScalers = gsap.utils.toArray('.pillar-image-scaler');
                const textSections = gsap.utils.toArray('.pillar-text-content');
                const textWrappers = gsap.utils.toArray('.text-anim-wrapper');
                
                // For the "Exit" animation
                const visualsColumn = document.querySelector('.pillar-visuals-col');
                const summarySection = document.querySelector('.method-summary');
                const placeholder = document.querySelector('.summary-thumbnail-placeholder');
                const lastVisual = visualItems[visualItems.length - 1];
                
                gsap.set(visualsColumn, { autoAlpha: 1 }); // Make sure it's visible

                // --- 2. INITIAL STATE ---
                // Set the initial visibility and positions before any animations start.
                gsap.set(visualItems.slice(1), { autoAlpha: 0 }); // Hide all visuals except the first
                gsap.set(textWrappers.slice(1), { autoAlpha: 0, y: '100%' }); // Hide and move down all text except the first

                // --- 3. NARRATIVE TRANSITIONS (The Core Timelines) ---
                
                // -- TRANSITION: From Pillar 1 to Pillar 2 (The Narrative Zoom) --
                const tl_1_to_2 = gsap.timeline({
                    scrollTrigger: {
                        trigger: textSections[1], // Pillar 2 text content
                        start: "top 80%",
                        end: "top 30%",
                        scrub: 1.5,
                        // markers: {startColor: "red", endColor: "red"},
                    }
                });

                // Set the starting state for image 2 (zoomed in to match image 1's exit)
                gsap.set(imageScalers[1], { scale: 2.5, x: '20%', y: '-10%' });

                tl_1_to_2
                    // Animate text out
                    .to(textWrappers[0], { y: '-100%', autoAlpha: 0, ease: 'power2.in' }, "start")
                    // Animate Image 1 zooming IN to the notebook detail
                    .to(imageScalers[0], { scale: 2.2, x: '-25%', y: '15%', ease: 'power2.inOut' }, "start")
                    // Fade out the entire container of image 1
                    .to(visualItems[0], { autoAlpha: 0 }, "start+=0.25")
                    // Fade IN the container for image 2
                    .to(visualItems[1], { autoAlpha: 1 }, "start+=0.25")
                    // Animate Image 2 zooming OUT to its normal state
                    .to(imageScalers[1], { scale: 1, x: '0%', y: '0%', ease: 'power2.out' }, "start+=0.25")
                    // Animate new text in
                    .to(textWrappers[1], { y: '0%', autoAlpha: 1, ease: 'power2.out' }, "start+=0.25");


                // -- TRANSITION: From Pillar 2 to Pillar 3 (A Cleaner Transition) --
                const tl_2_to_3 = gsap.timeline({
                    scrollTrigger: {
                        trigger: textSections[2], // Pillar 3 text content
                        start: "top 80%",
                        end: "top 30%",
                        scrub: 1.5,
                        // markers: {startColor: "green", endColor: "green"},
                    }
                });

                tl_2_to_3
                    .to(textWrappers[1], { y: '-100%', autoAlpha: 0, ease: 'power2.in' }, "start")
                    .to(visualItems[1], { autoAlpha: 0, scale: 0.98 }, "start") // Fade and shrink old visual
                    .fromTo(visualItems[2], { autoAlpha: 0, scale: 1.02 }, { autoAlpha: 1, scale: 1 }, "start") // Fade and grow in new visual
                    .to(textWrappers[2], { y: '0%', autoAlpha: 1, ease: 'power2.out' }, "start");


                // --- 4. DIMENSIONALITY & "FEEL" (The Mouse Parallax) ---
                const xTo = gsap.quickTo(imageScalers, "x", { duration: 0.8, ease: "power3" });
                const yTo = gsap.quickTo(imageScalers, "y", { duration: 0.8, ease: "power3" });

                visualsColumn.addEventListener("mousemove", e => {
                    const { clientX, clientY } = e;
                    const { top, left, width, height } = visualsColumn.getBoundingClientRect();
                    const x = gsap.utils.mapRange(0, width, -20, 20, clientX - left);
                    const y = gsap.utils.mapRange(0, height, -20, 20, clientY - top);
                    xTo(x);
                    yTo(y);
                });

                visualsColumn.addEventListener("mouseleave", () => {
                    xTo(0);
                    yTo(0);
                });


                // --- 5. THE "EXIT" ANIMATION (Using GSAP Flip) ---
                // This is a standalone trigger that fires when the summary section appears.
                ScrollTrigger.create({
                    trigger: summarySection,
                    start: "top center",
                    onEnter: () => {
                        // 1. Get the current state of the large, pinned image
                        const state = Flip.getState(lastVisual);
                        
                        // 2. Add a class to the original column so we can hide it,
                        // preventing a "flash" as the element moves.
                        visualsColumn.classList.add('is-exiting');

                        // 3. Move the image element into its new home in the DOM
                        placeholder.appendChild(lastVisual);

                        // 4. Animate from the old state to the new one!
                        Flip.from(state, {
                            duration: 1.0,
                            ease: "power2.inOut",
                            scale: true, // Natively animates scale and position
                            onComplete: () => {
                                // Optional: cleanup after animation if needed
                                gsap.set(lastVisual, { position: 'relative', top: 'auto', left: 'auto', width: '100%', height: '100%' });
                            }
                        });
                    },
                    onLeaveBack: () => {
                        // This handles what happens if the user scrolls back up
                        const state = Flip.getState(lastVisual);
                        visualsColumn.appendChild(lastVisual);
                        visualsColumn.classList.remove('is-exiting');
                        
                        Flip.from(state, {
                            duration: 0.8,
                            ease: "power2.inOut",
                            scale: true,
                        });
                    }
                });

            }, // end of desktop function

            // --- MOBILE SETUP (screen width <= 768px) ---
            "(max-width: 768px)": function() {
                // On mobile, we do nothing. The layout defaults to the stacked
                // version from the CSS, and no complex JS animations run.
                // GSAP automatically cleans up the desktop triggers.
            }
        });
    }

    // The rest of your menu/footer code here if it wasn't at the top
    // ...
});
