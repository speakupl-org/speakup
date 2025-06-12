document.addEventListener('DOMContentLoaded', function() {

    // --- Menu Toggle and Footer Code (Unchanged) ---
    // (Your existing, working menu code remains here)
    const openButton = document.getElementById('menu-open-button');
    const closeButton = document.getElementById('menu-close-button');
    const menuScreen = document.getElementById('menu-screen');
    const htmlElement = document.documentElement;
    const body = document.body;
    function openMenu(){ htmlElement.classList.add('menu-open'); body.classList.add('menu-open'); menuScreen.setAttribute('aria-hidden', 'false');}
    function closeMenu(){ htmlElement.classList.remove('menu-open'); body.classList.remove('menu-open'); menuScreen.setAttribute('aria-hidden', 'true');}
    if(openButton){openButton.addEventListener('click', openMenu);closeButton.addEventListener('click', closeMenu);}
    const yearSpan = document.getElementById('current-year');
    if(yearSpan){yearSpan.textContent = new Date().getFullYear();}
    
    
    // =========================================================================
    // "IGLOO-STYLE" SCROLLYTELLING - SENIOR ORCHESTRATION
    // =========================================================================
    
    const scrollyContainer = document.querySelector('.scrolly-container');
    if (scrollyContainer) {
        
        gsap.registerPlugin(ScrollTrigger, Flip);

        ScrollTrigger.matchMedia({

            // --- DESKTOP ANIMATIONS (screen width > 768px) ---
            "(min-width: 769px)": function() {
                
                // --- 1. SETUP & SELECTORS ---
                const visualsColumn = document.querySelector('.pillar-visuals-col');
                const visualItems = gsap.utils.toArray('.pillar-visual-item');
                const imageScalers = gsap.utils.toArray('.pillar-image-scaler');
                const textSections = gsap.utils.toArray('.pillar-text-content');
                
                // --- 2. INITIAL STATE ---
                // Set initial properties for a clean starting point.
                gsap.set(visualItems, { autoAlpha: 0, zIndex: 1 });
                gsap.set(visualItems[0], { autoAlpha: 1, zIndex: 5 }); // First image is on top
                gsap.set(textSections, { autoAlpha: 0, y: 50 }); // Text starts faded out and below

                // --- 3. THE MASTER TIMELINE (Orchestration Hub) ---
                // This single timeline controls the entire scroll-driven story.
                const masterTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: scrollyContainer,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1.2,
                        pin: visualsColumn, // << GSAP handles the pinning for perfect sync
                        pinSpacing: true,
                        // markers: true, // For debugging
                    }
                });

                // --- Scene 1: Animate in the first block of text ---
                masterTimeline
                    .to(textSections[0], { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' })
                    .to({}, {duration: 2}); // Add a "pause" to let the user read before scrolling more

                // --- Transition 1: From Pillar 1 to Pillar 2 ---
                masterTimeline
                    // Fade out the first text block
                    .to(textSections[0], { autoAlpha: 0, y: -50, duration: 1, ease: 'power2.in' }, 'scene1_end')
                    
                    // The cinematic image transition
                    .to(visualItems[0], { autoAlpha: 0, duration: 0.5 }, 'scene1_end')
                    .fromTo(visualItems[1], 
                        { autoAlpha: 0, zIndex: 6, scale: 1.2, xPercent: -20 }, 
                        { autoAlpha: 1, scale: 1, xPercent: 0, duration: 1.5, ease: 'power3.out' }, 
                        'scene1_end')
                    
                    // Fade in the second text block
                    .to(textSections[1], { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' }, 'scene1_end+=1')
                    .to({}, {duration: 2}); // Reading pause

                // --- Transition 2: From Pillar 2 to Pillar 3 ---
                masterTimeline
                    // Fade out the second text block
                    .to(textSections[1], { autoAlpha: 0, y: -50, duration: 1, ease: 'power2.in' }, 'scene2_end')

                    // The cinematic image transition
                    .to(visualItems[1], { autoAlpha: 0, duration: 0.5 }, 'scene2_end')
                    .fromTo(visualItems[2],
                         { autoAlpha: 0, zIndex: 7, yPercent: 20 },
                         { autoAlpha: 1, yPercent: 0, duration: 1.5, ease: 'power3.out' }, 
                         'scene2_end')

                    // Fade in the third text block
                    .to(textSections[2], { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' }, 'scene2_end+=1')
                    .to({}, {duration: 2}); // Final reading pause
                    

                // --- 4. THE EXIT ANIMATION (The Flawless Hand-off) ---
                // This runs independently, triggered by the next section.
                const summarySection = document.querySelector('.method-summary');
                const placeholder = document.querySelector('.summary-thumbnail-placeholder');
                const lastVisual = visualItems[visualItems.length - 1];
                
                const exitTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: summarySection,
                        start: "top 80%", // Start when summary section is 80% from top
                        end: "top top", // End when it hits the very top
                        scrub: 1,
                        // markers: { startColor: "purple", endColor: "purple" }
                    }
                });

                // Get state BEFORE moving the element
                const state = Flip.getState(lastVisual, {props: "transform, opacity, box-shadow"});
                
                // Move element to its final container
                placeholder.appendChild(lastVisual);
                
                // Animate from the captured state to the new one
                exitTimeline.add(
                    Flip.from(state, {
                        scale: true,
                        ease: "power2.inOut",
                        // This prevents the "ghost" image during transition
                        onEnter: () => visualsColumn.classList.add('is-exiting'),
                        onLeaveBack: () => visualsColumn.classList.remove('is-exiting')
                    })
                );
            }, // end of desktop function
            
            "(max-width: 768px)": function() { 
                // On mobile, do nothing. Content will stack naturally.
            }
        });
    }
});
