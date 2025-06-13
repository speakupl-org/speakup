function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);

    // =============================================================
    // DEBUGGING STEP 1: ENABLE MARKERS
    // As you requested, this will show all the start/end trigger 
    // points on the page. You can set this to false to hide them.
    // =============================================================
    ScrollTrigger.defaults({ markers: true }); 

    const ctx = gsap.context(() => {
        // --- Element & Variable Declarations (Unchanged) ---
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
                // FOUC setup is fine
                gsap.set(textPillars, { autoAlpha: 0 });
                gsap.set(textPillars[0], { autoAlpha: 1 });

                // Line animations are fine
                textPillars.forEach(pillar => {
                    const line = pillar.querySelector('.pillar-line');
                    if (!line) return;
                    ScrollTrigger.create({
                        trigger: pillar,
                        start: 'top 60%',
                        end: 'bottom 40%',
                        onEnter: () => gsap.to(line, { scaleX: 1, duration: 0.8, ease: 'power4.out' }),
                        onLeave: () => gsap.to(line, { scaleX: 0, transformOrigin: 'right', duration: 0.6, ease: 'power4.in' }),
                        onEnterBack: () => gsap.to(line, { scaleX: 1, transformOrigin: 'left', duration: 0.8, ease: 'power4.out' }),
                        onLeaveBack: () => gsap.to(line, { scaleX: 0, duration: 0.6, ease: 'power4.in' }),
                    });
                });

                const states = [
                    { rotationY: 20, rotationX: -15, scale: 1.0 },
                    { rotationY: 120, rotationX: 10, scale: 1.1 },
                    { rotationY: -120, rotationX: -20, scale: 1.2 }
                ];

                // =============================================================
                // DEBUGGING STEP 2: A SIMPLER, MORE RELIABLE TIMELINE
                // We're returning to a clear, sequential timeline. This structure is less
                // prone to complex timing bugs and directly addresses the pacing issue.
                // =============================================================
                const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power2.inOut' } });
                tl
                    .to(actor3D, states[0])
                    // CRITICAL: This tween, while seemingly redundant, prevents a "freeze" bug 
                    // that can happen when a scrub starts.
                    .to(textPillars[0], { autoAlpha: 1 }, '<') 
                    .to(textPillars[0], { autoAlpha: 0 })
                    .to(textPillars[1], { autoAlpha: 1 }, '<')
                    .to(actor3D, states[1], '<')
                    .to(textPillars[1], { autoAlpha: 0 })
                    .to(textPillars[2], { autoAlpha: 1 }, '<')
                    .to(actor3D, states[2], '<')
                    .addLabel('finalState') // A label right before the final transition
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

                // --- The Flip Handoff ---
                ScrollTrigger.create({
                    trigger: summaryContainer,
                    start: 'top center',
                    onEnter: () => {
                        if (isFlipped) return;
                        isFlipped = true;
                        mainScrub.disable();
                        visualsCol.classList.add('is-exiting');
                        const state = Flip.getState(actor3D);
                        summaryClipper.appendChild(actor3D);
                        Flip.from(state, {
                            duration: 0.8,
                            ease: 'power2.inOut',
                            scale: true,
                            onComplete: () => gsap.set(actor3D, { clearProps: 'all' })
                        });
                    },
                    onLeaveBack: () => {
                        if (!isFlipped) return;
                        isFlipped = false;
                        visualsCol.classList.remove('is-exiting');
                        const state = Flip.getState(actor3D);
                        scene3D.appendChild(actor3D);
                        Flip.from(state, {
                            duration: 0.8,
                            ease: 'power2.out',
                            scale: true,
                            // =============================================================
                            // DEBUGGING STEP 3: THE BULLETPROOF 3-STEP SYNC
                            // This is the most important part of the fix. It resolves the 
                            // state mismatch that causes the jump/spin on scroll-back.
                            // =============================================================
                            onComplete: () => {
                                // STEP 1: Clear the inline styles set by Flip. This is crucial.
                                gsap.set(actor3D, { clearProps: "transform" });
                                
                                // STEP 2: Force the timeline to the exact moment before the handoff.
                                // Unlike progress(1), seek() doesn't fight the scroller. It just
                                // sets the animation's visual state perfectly.
                                tl.seek('finalState');
                                
                                // STEP 3: NOW re-enable the scrub. Since the visual state and the
                                // timeline are in sync, there is no jump.
                                mainScrub.enable();
                            }
                        });
                    }
                });
            },

            // --- MOBILE CLEANUP (Unchanged but still important) ---
            '(max-width: 768px)': () => {
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                gsap.killTweensOf([actor3D, textPillars, '.pillar-line']);
                gsap.set([actor3D, ...textPillars, '.pillar-line'], { clearProps: 'all' });
                if (scene3D && !scene3D.contains(actor3D)) {
                    summaryClipper.innerHTML = ''; 
                    scene3D.appendChild(actor3D);
                }
                if (visualsCol) visualsCol.classList.remove('is-exiting');
                isFlipped = false;
            }
        });
    });

    return () => ctx.revert();
}
