document.addEventListener('DOMContentLoaded', function() {

    // --- Menu Toggle and Footer Code (Unchanged) ---
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
    // "IGLOO-STYLE" SCROLLYTELLING - GRANDIOSE ORCHESTRATION
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
                gsap.set(visualItems, { autoAlpha: 0 });
                gsap.set(visualItems[0], { autoAlpha: 1 });
                gsap.set(textSections, { autoAlpha: 0, y: 50 });

                // --- 3. THE MASTER TIMELINE - EXTENDED & CINEMATIC ---
                const masterTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: scrollyContainer,
                        start: "top top",
                        end: "+=4000", // CRITICAL FIX: Drastically increase scroll duration
                        scrub: 1.5,   // A slightly slower scrub for a more luxurious feel
                        pin: visualsColumn,
                        pinSpacing: true,
                        // markers: true,
                    }
                });

                // --- Scene 1: Animate in the first pillar with a subtle build-up ---
                masterTimeline
                    .to(textSections[0], { autoAlpha: 1, y: 0, duration: 1.0, ease: 'power2.out' }, 'start')
                    // Add a slow, subtle zoom to the image to create tension while the user reads
                    .to(imageScalers[0], { scale: 1.15, duration: 3.0, ease: 'power1.inOut' }, 'start')
                    .to({}, {duration: 1.0}); // Reading pause

                // --- Transition 1 -> 2: A Grandiose Pan & Reveal ---
                masterTimeline
                    .to(textSections[0], { autoAlpha: 0, y: -50, duration: 1.0, ease: 'power2.in' }, 'trans_1_start')
                    // Animate the image frame AND the scaler for a 2.5D parallax effect
                    .to(visualItems[0], { autoAlpha: 0, scale: 0.95, yPercent: -5, duration: 1.5, ease: 'power3.inOut'}, 'trans_1_start')
                    .to(imageScalers[0], { scale: 1, duration: 1.5, ease: 'power3.inOut' }, 'trans_1_start') // Un-zoom the first image as it exits

                    .fromTo(visualItems[1], 
                        { autoAlpha: 0, scale: 1.1, yPercent: 5 }, // Comes from slightly larger and below
                        { autoAlpha: 1, scale: 1, yPercent: 0, duration: 1.5, ease: 'power3.out' }, 
                        'trans_1_start+=0.5') // Overlap for a seamless transition
                    
                    .from(imageScalers[1], { scale: 1.3, duration: 1.5, ease: 'power3.out' }, 'trans_1_start+=0.5')
                    .to(textSections[1], { autoAlpha: 1, y: 0, duration: 1.0, ease: 'power2.out' }, 'trans_1_start+=1.5') // Text appears after visuals settle
                    .to({}, {duration: 1.0}); // Reading pause

                // --- Transition 2 -> 3: The Flawless Arrival ---
                masterTimeline
                    .to(textSections[1], { autoAlpha: 0, y: -50, duration: 1.0, ease: 'power2.in' }, 'trans_2_start')

                    // A different transition for variety - a quick, clean cross-fade with a hint of motion
                    .to(visualItems[1], { autoAlpha: 0, duration: 1.0, ease: 'power2.inOut'}, 'trans_2_start')
                    .fromTo(visualItems[2],
                         { autoAlpha: 0, scale: 1.1 }, // THIS FIXES THE "APPEARS LOWER" BUG
                         { autoAlpha: 1, scale: 1, duration: 1.5, ease: 'power3.out' }, 
                         'trans_2_start+=0.2')

                    // MASTER TIMELINE IS NOW RESPONSIBLE for bringing the final text in and holding it
                    .to(textSections[2], { autoAlpha: 1, y: 0, duration: 1.0, ease: 'power2.out' }, 'trans_2_start+=1.2')
                    .to({}, {duration: 2.0}); // A longer final reading pause to ensure it holds until the exit

                // --- 4. THE EXIT ANIMATION (The Decoupled Hand-off) ---
                const summarySection = document.querySelector('.method-summary');
                const placeholder = document.querySelector('.summary-thumbnail-placeholder');
                const lastVisual = visualItems[visualItems.length - 1];
                
                const exitTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: summarySection,
                        start: "top 65%", // Trigger slightly later to ensure master timeline is done
                        end: "top top",
                        scrub: 1,
                    }
                });

                const state = Flip.getState(lastVisual, {props: "transform, opacity, box-shadow, borderRadius"});
                placeholder.appendChild(lastVisual);
                
                exitTimeline.add(
                    Flip.from(state, {
                        scale: true,
                        ease: "power2.inOut",
                        onEnter: () => visualsColumn.classList.add('is-exiting'),
                        onLeaveBack: () => visualsColumn.classList.remove('is-exiting')
                    })
                );

            }
        });
    }
});
