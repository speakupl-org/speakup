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
    // "IGLOO-STYLE" SCROLLYTELLING - SENIOR ARCHITECT MODE
    // =========================================================================
    
    const scrollyContainer = document.querySelector('.scrolly-container');
    if (scrollyContainer) {
        
        gsap.registerPlugin(ScrollTrigger, Flip);

        ScrollTrigger.matchMedia({

            // --- DESKTOP ANIMATIONS (screen width > 768px) ---
            "(min-width: 769px)": function() {
                
                // --- 1. SETUP: TARGETS AND UTILITIES ---
                const visualsColumn = document.querySelector('.pillar-visuals-col');
                const visualItems = gsap.utils.toArray('.pillar-visual-item');
                const textSections = gsap.utils.toArray('.pillar-text-content');

                // --- 2. SOPHISTICATION LAYER 1: CURSOR PARALLAX ---
                // Create a super-efficient "setter" for the parallax effect.
                const xTo = gsap.quickTo(visualsColumn, "x", { duration: 0.8, ease: "power3" });
                const yTo = gsap.quickTo(visualsColumn, "y", { duration: 0.8, ease: "power3" });

                window.addEventListener("mousemove", e => {
                    const { clientX, clientY } = e;
                    const x = gsap.utils.mapRange(0, window.innerWidth, -20, 20, clientX);
                    const y = gsap.utils.mapRange(0, window.innerHeight, -20, 20, clientY);
                    xTo(x);
                    yTo(y);
                });
                
                // --- 3. ARCHITECTURE: DYNAMIC ANIMATION FUNCTIONS ---
                /**
                 * Creates a sophisticated text-in animation using 3D perspective.
                 * @param {number} index - The index of the text block to animate in.
                 * @returns {gsap.core.Timeline} A GSAP Timeline instance.
                 */
                function createTextInAnimation(index) {
                    const el = textSections[index];
                    const headline = el.querySelector('h2');
                    const paragraph = el.querySelector('p');
                    
                    const tl = gsap.timeline();
                    // Animate in with rotation from a 3D perspective.
                    tl.from([headline, paragraph], {
                        autoAlpha: 0,
                        y: 80,
                        rotationX: -90,
                        stagger: 0.1,
                        duration: 1.5,
                        ease: 'expo.out'
                    });
                    
                    return tl;
                }

                /**
                 * Creates a graceful text-out animation.
                 * @param {number} index - The index of the text block to animate out.
                 * @returns {gsap.core.Timeline} A GSAP Timeline instance.
                 */
                function createTextOutAnimation(index) {
                    const el = textSections[index];
                    return gsap.to(el.querySelectorAll('h2, p'), {
                        autoAlpha: 0,
                        y: -80,
                        stagger: 0.05,
                        duration: 1.0,
                        ease: 'expo.in'
                    });
                }
                
                // --- 4. THE GRAND MASTER TIMELINE ---
                gsap.set(visualItems.slice(1), { autoAlpha: 0 }); // Hide all but the first image
                const masterTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: scrollyContainer,
                        start: "top top",
                        end: "+=5000",
                        scrub: 1.2,
                        pin: visualsColumn,
                        pinSpacing: true,
                        // markers: true,
                    }
                });

                // --- Sequence 1: Arrival ---
                masterTimeline.add(createTextInAnimation(0));
                masterTimeline.to({}, {duration: 1.0}); // Reading pause

                // --- Sequence 2: Transition to Pillar 2 ---
                masterTimeline.addLabel('p1_to_p2');
                masterTimeline.add(createTextOutAnimation(0), 'p1_to_p2');
                // SOPHISTICATION LAYER 2: CINEMATIC DEPTH OF FIELD + 3D ROTATION
                masterTimeline.to(visualItems[0].querySelector('img'), { filter: 'blur(20px)', scale: 1.2, duration: 1.5, ease: 'power2.in' }, 'p1_to_p2');
                masterTimeline.to(visualItems[0], { rotationY: 45, autoAlpha: 0, duration: 1.5, ease: 'power2.in'}, 'p1_to_p2');
                masterTimeline.from(visualItems[1], { rotationY: -45, autoAlpha: 0, duration: 1.5, ease: 'power2.out' }, 'p1_to_p2+=0.5');
                masterTimeline.from(visualItems[1].querySelector('img'), { filter: 'blur(20px)', scale: 1.2, duration: 1.5, ease: 'power2.out' }, 'p1_to_p2+=0.5');
                masterTimeline.add(createTextInAnimation(1), 'p1_to_p2+=1');
                masterTimeline.to({}, {duration: 1.0});

                // --- Sequence 3: Transition to Pillar 3 ---
                masterTimeline.addLabel('p2_to_p3');
                masterTimeline.add(createTextOutAnimation(1), 'p2_to_p3');
                // A different, faster transition for variety.
                masterTimeline.to(visualItems[1], { autoAlpha: 0, scale: 0.95, duration: 1.0, ease: 'power2.inOut'}, 'p2_to_p3');
                masterTimeline.from(visualItems[2], { autoAlpha: 0, scale: 1.05, duration: 1.0, ease: 'power2.inOut' }, 'p2_to_p3+=0.2');
                masterTimeline.add(createTextInAnimation(2), 'p2_to_p3+=1');
                masterTimeline.to({}, {duration: 2.0}); // Longer final pause
                
                // --- 5. THE FLAWLESS, DECOUPLED EXIT ---
                const summarySection = document.querySelector('.method-summary');
                const placeholder = document.querySelector('.summary-thumbnail-placeholder');
                const lastVisual = visualItems[visualItems.length - 1];

                const exitTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: summarySection,
                        start: "top 70%",
                        end: "top top",
                        scrub: 1,
                    }
                });
                
                // GSAP Flip will handle the complex transition seamlessly.
                const state = Flip.getState(lastVisual, {props: "transform, opacity, filter"});
                placeholder.appendChild(lastVisual);
                exitTimeline.add(Flip.from(state, {
                    scale: true,
                    ease: "power2.inOut",
                    onEnter: () => visualsColumn.classList.add('is-exiting'),
                    onLeaveBack: () => visualsColumn.classList.remove('is-exiting')
                }));
            }
        });
    }
});
