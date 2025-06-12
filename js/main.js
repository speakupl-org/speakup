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
    // "IGLOO-STYLE" SCROLLYTELLING - ROCKET MODE ORCHESTRATION
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
                // Select individual components for staggered animations
                const textWrappers = gsap.utils.toArray('.text-anim-wrapper');
                
                // --- 2. ADVANCED ANIMATION HELPER FUNCTIONS ---
                // Using functions makes the main timeline cleaner and more powerful.

                /**
                 * Creates a sophisticated, staggered animation for a text block entering the view.
                 * @param {number} index - The index of the text block to animate.
                 * @returns {gsap.core.Timeline}
                 */
                functioncreateTextInAnimation(index) {
                    const el = textWrappers[index];
                    const [number, line, title, paragraph] = [
                        el.querySelector('.pillar-number'),
                        el.querySelector('.pillar-line'),
                        el.querySelector('.pillar-title'),
                        el.querySelector('.pillar-paragraph')
                    ];
                    
                    const tl = gsap.timeline();
                    tl.fromTo(number, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out' })
                      .to(line, { scaleX: 1, duration: 0.8, ease: 'power4.out' }, "-=0.8")
                      .fromTo(title, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out' }, "-=0.6")
                      .fromTo(paragraph, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out' }, "-=0.7");
                    
                    return tl;
                }
                
                /**
                 * Creates an animation for a text block exiting the view.
                 * @param {number} index - The index of the text block.
                 * @returns {gsap.core.Timeline}
                 */
                function createTextOutAnimation(index) {
                    const el = textWrappers[index];
                    return gsap.to(el, { autoAlpha: 0, y: -40, duration: 0.7, ease: 'power2.in' });
                }

                // --- 3. INITIAL STATE - SET ONCE, NEVER TOUCHED AGAIN ---
                gsap.set(visualItems, { autoAlpha: 0 });
                gsap.set(visualItems[0], { autoAlpha: 1 });
                gsap.set(textWrappers, { autoAlpha: 0 }); // Everything starts hidden

                // --- 4. THE GRAND MASTER TIMELINE ---
                const masterTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: scrollyContainer,
                        start: "top top",
                        end: "+=6000", // Massive scroll length for smooth pacing
                        scrub: 1.2,
                        pin: visualsColumn,
                        pinSpacing: true,
                        // markers: true,
                    }
                });

                // --- SEQUENCE 1: Pillar 1 Appears and Breathes ---
                masterTimeline.add(createTextInAnimation(0))
                    // Let the image subtly zoom and drift while user reads. This is KEY to sophistication.
                    .to(imageScalers[0], { scale: 1.1, rotation: -1, x: '-5%', duration: 4, ease: 'power1.inOut' }, '<')
                    .to({}, {duration: 2}); // Extended reading pause

                // --- SEQUENCE 2: Cinematic Transition to Pillar 2 ---
                masterTimeline.addLabel('trans_1_start')
                    .add(createTextOutAnimation(0))
                    // Animate visual frame and scaler separately for a 3D feel
                    .to(visualItems[0], { autoAlpha: 0, scale: 0.9, duration: 1.5, ease: 'power3.inOut' }, 'trans_1_start')
                    .to(imageScalers[0], { rotation: -3, scale: 1.2, duration: 1.5 }, 'trans_1_start') // Continue animating the old image as it leaves
                    // The next visual enters with opposite motion
                    .fromTo(visualItems[1],
                        { autoAlpha: 0, scale: 1.1, xPercent: 10, rotation: 5 },
                        { autoAlpha: 1, scale: 1, xPercent: 0, rotation: 0, duration: 2, ease: 'expo.out' }, 'trans_1_start+=0.5')
                    .add(createTextInAnimation(1), '>-=1.0') // Text animates in while visual is still settling
                    .to({}, {duration: 2});

                // --- SEQUENCE 3: A Different, Cleaner Transition to Pillar 3 ---
                masterTimeline.addLabel('trans_2_start')
                    .add(createTextOutAnimation(1))
                    // A faster, more direct visual change this time, for pacing variety
                    .to(visualItems[1], { autoAlpha: 0, duration: 1.0, ease: 'power2.inOut'}, 'trans_2_start')
                    .fromTo(visualItems[2],
                         { autoAlpha: 0, yPercent: 5 },
                         { autoAlpha: 1, yPercent: 0, duration: 1.5, ease: 'power3.out' }, 'trans_2_start+=0.5')
                    .add(createTextInAnimation(2), '>-=1.0')
                    .to({}, {duration: 3}); // A very long final pause, holding the last scene perfectly stable

                // --- 5. THE DECOUPLED EXIT: The final, flawless hand-off ---
                const summarySection = document.querySelector('.method-summary');
                const placeholder = document.querySelector('.summary-thumbnail-placeholder');
                const lastVisual = visualItems[visualItems.length - 1];
                
                Flip.fit(placeholder, lastVisual, { scale: true, fitChild: lastVisual.querySelector('img') });

                const exitTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: summarySection,
                        start: "top 70%", // Start later to guarantee the hand-off is safe
                        end: "top top",
                        scrub: 1,
                    }
                });
                
                exitTimeline.add(
                    Flip.from(Flip.getState(lastVisual), {
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
