document.addEventListener('DOMContentLoaded', function() {

    // --- Menu Toggle and Footer Code (Unchanged) ---
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
        yearSpan.textContent = new Date().getFullYear();
    }

    // =========================================================================
    // "IGLOO-STYLE" SCROLLYTELLING - FINAL IMPLEMENTATION
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
                const textWrappers = gsap.utils.toArray('.text-anim-wrapper');
                
                const visualsColumn = document.querySelector('.pillar-visuals-col');
                const summarySection = document.querySelector('.method-summary');
                const placeholder = document.querySelector('.summary-thumbnail-placeholder');
                const lastVisual = visualItems[visualItems.length - 1];

                // --- 2. INITIAL STATE ---
                gsap.set(visualsColumn, { autoAlpha: 1 });
                gsap.set(visualItems, { autoAlpha: 0 });
                gsap.set(visualItems[0], { autoAlpha: 1 });
                gsap.set(textWrappers, { autoAlpha: 0, y: 30 }); // Start text off-screen

                // --- 3. MASTER TIMELINE ---
                const masterTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: scrollyContainer,
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1.2,
                        // markers: true,
                    }
                });

                // --- SCENE 1: Intro ---
                masterTimeline
                    .to(textWrappers[0], { autoAlpha: 1, y: 0, ease: 'power2.out' })
                    .to({}, { duration: 1 }); // Pause for reading

                // --- SCENE 2: Transition 1 -> 2 ---
                masterTimeline
                    .to(textWrappers[0], { autoAlpha: 0, y: -30, ease: 'power2.in' }, "trans_1_start")
                    .to(imageScalers[0], { scale: 1.8, x: '-20%', y: '10%', ease: 'power2.inOut' }, "trans_1_start")
                    .to(visualItems[0], { autoAlpha: 0, ease: 'power1.inOut' }, "trans_1_start")
                    
                    .fromTo(visualItems[1], 
                        { autoAlpha: 0, scale: 1.1 },
                        { autoAlpha: 1, scale: 1, ease: 'power2.out' }, "trans_1_start")
                    .to(textWrappers[1], { autoAlpha: 1, y: 0, ease: 'power2.out' }, ">-0.4")
                    
                    .to({}, { duration: 1 }); // Pause

                // --- SCENE 3: Transition 2 -> 3 ---
                masterTimeline
                    .to(textWrappers[1], { autoAlpha: 0, y: -30, ease: 'power2.in' }, "trans_2_start")
                    .to(visualItems[1], { autoAlpha: 0, ease: 'power1.inOut' }, "trans_2_start")
                    
                    .fromTo(visualItems[2], 
                        { autoAlpha: 0, y: 30 }, 
                        { autoAlpha: 1, y: 0, ease: 'power2.out' }, "trans_2_start")
                    .to(textWrappers[2], { autoAlpha: 1, y: 0, ease: 'power2.out' }, ">-0.4")
                    
                    .to({}, { duration: 1 }); // Final pause

                // --- 4. EXIT ANIMATION (using Flip) ---
                const exitTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: summarySection,
                        start: "top 75%",
                        end: "top top",
                        scrub: 1,
                    }
                });

                const state = Flip.getState(lastVisual, { props: "transform,opacity" });
                placeholder.appendChild(lastVisual);

                exitTimeline.add(
                    Flip.from(state, {
                        scale: true,
                        ease: "power1.inOut",
                        onEnter: () => visualsColumn.classList.add('is-exiting'),
                        onLeaveBack: () => visualsColumn.classList.remove('is-exiting')
                    })
                );
            }
        });
    }
});
