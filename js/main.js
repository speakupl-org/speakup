/*
=================================================================
   Definitive Version 2.0 (Based on all final feedback)
   DEBUGGING BUILD v1.0
=================================================================
*/
document.addEventListener('DOMContentLoaded', () => {
    // --- Menu & Footer (unchanged) ---
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
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // --- GSAP Animations ---
    setupAnimations();
});

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);

    // Clear console on every refresh for clean debugging
    console.clear();
    console.log('%cGSAP Debugging Build Initialized. Watching for scrollytelling events...', 'color: #88c0d0; font-weight: bold;');

    const ctx = gsap.context(() => {
        // --- 1. Element & Variable Declarations ---
        const visualsCol = document.querySelector('.pillar-visuals-col');
        const scene3D = document.querySelector('.scene-3d');
        const textCol = document.querySelector('.pillar-text-col');
        const actor3D = document.getElementById('actor-3d');
        const textPillars = gsap.utils.toArray('.pillar-text-content');
        const summaryContainer = document.querySelector('.method-summary');
        const summaryClipper = document.querySelector('.summary-thumbnail-clipper');

        if (!visualsCol || !scene3D || !textCol || !actor3D || !summaryContainer || !summaryClipper || !textPillars.length) {
            console.error('Scrollytelling animations aborted: One or more required elements are missing.');
            return;
        }

        let isFlipped = false;

        ScrollTrigger.matchMedia({
            // --- DESKTOP ANIMATIONS ---
            '(min-width: 769px)': () => {
                gsap.set(textPillars, { autoAlpha: 0 });
                gsap.set(textPillars[0], { autoAlpha: 1 });

                textPillars.forEach(pillar => {
                    const line = pillar.querySelector('.pillar-line');
                    if (!line) return;
                    ScrollTrigger.create({
                        trigger: pillar,
                        start: 'top 60%',
                        end: 'bottom 40%',
                        onEnter: () => gsap.to(line, { scaleX: 1, duration: 0.8, ease: 'power4.out' }),
                        onLeave: () => gsap.to(line, { scaleX: 0, transformOrigin: 'right', duration: 0.6, ease: 'power4.in' }),
                        onEnterBack:() => gsap.to(line, { scaleX: 1, transformOrigin: 'left',  duration: 0.8, ease: 'power4.out' }),
                        onLeaveBack:() => gsap.to(line, { scaleX: 0, duration: 0.6, ease: 'power4.in' }),
                    });
                });

                const states = [
                    { rotationY: 20,   rotationX: -15, scale: 1.0 },
                    { rotationY: 120,  rotationX: 10,  scale: 1.1 },
                    { rotationY: -120, rotationX: -20, scale: 1.2 }
                ];

                // --- 3. A stable timeline structure for debugging ---
                const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power2.inOut' } });
                tl
                    .to(actor3D, states[0])
                    .to(textPillars[0], { autoAlpha: 1 }, '<') 
                    .to(textPillars[0], { autoAlpha: 0 })
                    .to(textPillars[1], { autoAlpha: 1 }, '<')
                    .to(actor3D, states[1], '<')
                    .to(textPillars[1], { autoAlpha: 0 })
                    .to(textPillars[2], { autoAlpha: 1 }, '<')
                    .to(actor3D, states[2], '<')
                    .addLabel('finalState')
                    .to(textPillars[2], { autoAlpha: 0 })
                    .to(actor3D, { rotationY: 0, rotationX: 0, scale: 1.0 }, '<');

                const mainScrub = ScrollTrigger.create({
                    trigger: textCol,
                    pin: visualsCol,
                    start: 'top top',
                    end: 'bottom bottom',
                    animation: tl,
                    scrub: 0.8,
                    invalidateOnRefresh: true,
                });

                // --- 4. The Flip Handoff with extensive logging ---
                ScrollTrigger.create({
                    trigger: summaryContainer,
                    start: 'top center',
                    markers: true, // Specific markers for this trigger
                    onEnter: () => {
                        console.groupCollapsed('%c[onEnter] Firing: Handing off to Summary', 'color: #A3BE8C; font-weight:bold;');
                        if (isFlipped) {
                            console.warn('onEnter called, but isFlipped is already true. Aborting.');
                            console.groupEnd();
                            return;
                        }
                        isFlipped = true;
                        mainScrub.disable();
                        console.log('isFlipped set to:', isFlipped);
                        console.log('mainScrub disabled.');
                        visualsCol.classList.add('is-exiting');
                        
                        const state = Flip.getState(actor3D);
                        console.log('Flip state CAPTURED from main scene:', state);

                        summaryClipper.appendChild(actor3D);
                        console.log('actor3D moved to summaryClipper.');
                        
                        Flip.from(state, {
                            duration: 0.8,
                            ease: 'power2.inOut',
                            scale: true,
                            onComplete: () => {
                                console.log('%cFlip [onEnter] COMPLETE. Clearing props.', 'color: #A3BE8C');
                                gsap.set(actor3D, { clearProps: 'all' });
                                console.log('actor3D style after clear:', actor3D.style.transform);
                            }
                        });
                        console.groupEnd();
                    },
                    onLeaveBack: () => {
                        console.group('%c[onLeaveBack] Firing: Returning to Scroller', 'color: #EBCB8B; font-weight:bold;');
                        if (!isFlipped) {
                            console.warn('onLeaveBack called, but isFlipped is already false. Aborting.');
                            console.groupEnd();
                            return;
                        }
                        isFlipped = false;
                        console.log('isFlipped set to:', isFlipped);

                        visualsCol.classList.remove('is-exiting');
                        const state = Flip.getState(actor3D);
                        console.log('Flip state CAPTURED from summary clipper:', state);
                        
                        scene3D.appendChild(actor3D);
                        console.log('actor3D moved back to scene3D.');
                        
                        Flip.from(state, {
                            duration: 0.8,
                            ease: 'power2.out',
                            scale: true,
                            onComplete: () => {
                                console.groupCollapsed('%cFlip [onLeaveBack] COMPLETE. Starting 3-step sync...', 'color: #EBCB8B');
                                
                                console.log(`1. actor3D style BEFORE clear:`, actor3D.style.transform);
                                gsap.set(actor3D, { clearProps: "transform" });
                                console.log(`1. actor3D style AFTER clear:`, actor3D.style.transform);

                                console.log(`2. Timeline progress BEFORE seek:`, tl.progress().toFixed(4));
                                tl.seek('finalState');
                                console.log(`2. Timeline progress AFTER seek('finalState'):`, tl.progress().toFixed(4));
                                console.log(`   (Actor transform should now match timeline's 'finalState')`);
                                console.log(`   RotationY is now:`, gsap.getProperty(actor3D, "rotationY").toFixed(2));


                                mainScrub.enable();
                                console.log('3. mainScrub re-enabled.');
                                console.log('   (ScrollTrigger will now take back control)');

                                console.groupEnd();
                            }
                        });
                        console.groupEnd();
                    }
                });
                
                // Expose key variables to the global scope for manual inspection in the console
                window.gsapDebug = {
                    timeline: tl,
                    mainScrub: mainScrub,
                    actor: actor3D
                };
            },

            // --- MOBILE CLEANUP ---
            '(max-width: 768px)': () => {
                // Kill all GSAP instances to prevent conflicts
                if (window.gsapDebug) {
                    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                    gsap.killTweensOf([actor3D, textPillars, '.pillar-line']);
                }
                // Reset all element styles
                gsap.set([actor3D, textPillars, '.pillar-line'], { clearProps: 'all' });
                if (scene3D && !scene3D.contains(actor3D)) {
                    if (summaryClipper) summaryClipper.innerHTML = '';
                    scene3D.appendChild(actor3D);
                }
                if (visualsCol) visualsCol.classList.remove('is-exiting');
                isFlipped = false;
            }
        });
    });

    return () => ctx.revert();
}


function initialCheck() {
    if (window.gsap && window.ScrollTrigger && window.Flip) {
        setupAnimations();
    } else {
        let attempts = 0;
        const maxAttempts = 30;
        const interval = setInterval(() => {
            attempts++;
            if (window.gsap && window.ScrollTrigger && window.Flip) {
                clearInterval(interval);
                setupAnimations();
            } else if (attempts >= maxAttempts) {
                clearInterval(interval);
                console.error("GSAP plugins failed to load in time.");
            }
        }, 100);
    }
}
