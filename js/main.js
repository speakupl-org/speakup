document.addEventListener('DOMContentLoaded', function() {

    // --- Menu Toggle and Footer Year Code (Unchanged) ---
    const openButton = document.getElementById('menu-open-button');
    const closeButton = document.getElementById('menu-close-button');
    const menuScreen = document.getElementById('menu-screen');
    const htmlElement = document.documentElement;
    const body = document.body;

    function openMenu() {
        htmlElement.classList.add('menu-open');
        body.classList.add('menu-open');
        menuScreen.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
        htmlElement.classList.remove('menu-open');
        body.classList.remove('menu-open');
        menuScreen.setAttribute('aria-hidden', 'true');
    }

    if (openButton && closeButton && menuScreen) {
        openButton.addEventListener('click', openMenu);
        closeButton.addEventListener('click', closeMenu);
    }
    
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new new Date().getFullYear();
    }


    // =========================================================================
    // "IGLOO-STYLE" SCROLLYTELLING - DEPLOYED REFINEMENTS
    // =========================================================================
    const scrollyContainer = document.querySelector('.scrolly-container');
    if (scrollyContainer) {
        
        gsap.registerPlugin(ScrollTrigger, Flip);

        ScrollTrigger.matchMedia({

            // --- DESKTOP ANIMATIONS (screen width > 768px) ---
            "(min-width: 769px)": function() {
                
                // --- 1. SETUP & SELECTORS ---
                const visualItems = gsap.utils.toArray('.pillar-visual-item');
                const textSections = gsap.utils.toArray('.pillar-text-content');
                
                // Set initial states. All images are hidden except the first.
                gsap.set(visualItems, { autoAlpha: 0, zIndex: 0 });
                gsap.set(visualItems[0], { autoAlpha: 1, zIndex: 1 });

                // --- 2. MAIN NARRATIVE TRANSITIONS (Pillar to Pillar) ---
                // We create a separate timeline for EACH transition. This gives us
                // isolated control and prevents animation conflicts.
                
                // Loop through each text section to create a trigger for it
                textSections.forEach((section, i) => {
                    // We don't need a trigger for the very last section, as it will be
                    // handled by the final "Exit" animation.
                    if (i < textSections.length - 1) {
                        
                        const textWrapper = section.querySelector('.text-anim-wrapper');
                        const currentVisual = visualItems[i];
                        const nextVisual = visualItems[i + 1];

                        // Create a timeline for the transition from section i to i+1
                        const tl = gsap.timeline({
                            scrollTrigger: {
                                trigger: section,
                                start: "bottom bottom", // Start when the bottom of the text hits the bottom of the screen
                                end: "bottom top",    // End when the bottom of the text hits the top
                                scrub: 1,
                                // markers: true, // Uncomment to debug
                            }
                        });

                        // Animate OUT the current content
                        tl.to(textWrapper, { 
                              yPercent: -20, 
                              autoAlpha: 0, 
                              ease: "power1.in" 
                          }, 0) // The '0' at the end means "start at the beginning of the timeline"
                          .to(currentVisual, { 
                              autoAlpha: 0,
                              zIndex: 0,
                              duration: 0.3 // A quick fade
                          }, 0);

                        // Animate IN the next visual
                        if (nextVisual) {
                            tl.to(nextVisual, {
                                autoAlpha: 1,
                                zIndex: 1, // Bring the new visual to the front
                                duration: 0.3
                            }, 0.05); // Start this slightly after the fade out begins for a smooth cross-fade
                        }
                    }
                });


                // --- 3. THE "EXIT" ANIMATION (The Flip) ---
                const visualsColumn = document.querySelector('.pillar-visuals-col');
                const summarySection = document.querySelector('.method-summary');
                const placeholder = document.querySelector('.summary-thumbnail-placeholder');
                const lastVisual = visualItems[visualItems.length - 1];

                // Create a dedicated timeline for the exit animation
                const exitTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: summarySection,
                        start: "top 85%", // Start when the summary section is nearing the viewport
                        end: "top top",   // End when the top of the section hits the top of the viewport
                        scrub: 1,
                        // markers: {startColor: "purple", endColor: "purple"} // Uncomment to debug
                    }
                });

                // Get the state of the image BEFORE we move it
                const state = Flip.getState(lastVisual, { props: "transform,opacity" });
                
                // Move the image to its final container so Flip can calculate the end state
                placeholder.appendChild(lastVisual);
                
                // Animate from the previous state to the new one
                exitTimeline.add(
                    Flip.from(state, {
                        scale: true,
                        ease: "power2.inOut",
                        // THE CRITICAL FIX: Use callbacks to hide the original container
                        // during the animation to prevent a "ghost" image.
                        onEnter: () => visualsColumn.classList.add('is-exiting'),
                        onLeaveBack: () => visualsColumn.classList.remove('is-exiting')
                    })
                );

            }, // end of desktop function
            
            "(max-width: 768px)": function() { 
                // On mobile, we do nothing. The content will just stack naturally.
                // The complex JS is not needed and would be poor for performance/UX.
            }
        });
    }
});
