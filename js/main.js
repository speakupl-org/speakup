// js/main.js

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
  function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);

    const ctx = gsap.context(() => {
      const visualsCol = document.querySelector('.pillar-visuals-col');
      const textCol = document.querySelector('.pillar-text-col');
      const actor3D = document.getElementById('actor-3d');
      const textPillars = gsap.utils.toArray('.pillar-text-content');
      const summaryContainer = document.querySelector('.method-summary');
      const summaryClipper = document.querySelector('.summary-thumbnail-clipper');

      if (!visualsCol || !textCol || !actor3D || !summaryContainer || !summaryClipper || !textPillars.length) {
        console.error('Scrollytelling animations aborted: One or more required elements are missing.');
        return;
      }

      let isFlipped = false;

      ScrollTrigger.matchMedia({
        '(min-width: 769px)': () => {
          gsap.set(textPillars, { autoAlpha: 0 });
          gsap.set(textPillars[0], { autoAlpha: 1 });

          textPillars.forEach(pillar => {
            const line = pillar.querySelector('.pillar-line');
            if (line) {
              ScrollTrigger.create({
                trigger: pillar,
                start: 'top 60%',
                end: 'bottom 40%',
                onEnter: () => gsap.to(line, { scaleX: 1, duration: 0.8, ease: 'power4.out' }),
                onLeave: () => gsap.to(line, { scaleX: 0, transformOrigin: 'right', duration: 0.6, ease: 'power4.in' }),
                onEnterBack: () => gsap.to(line, { scaleX: 1, transformOrigin: 'left', duration: 0.8, ease: 'power4.out' }),
                onLeaveBack: () => gsap.to(line, { scaleX: 0, duration: 0.6, ease: 'power4.in' }),
              });
            }
          });

          const states = {
            pillar1: { rotationY: 20, rotationX: -15, scale: 1.0 },
            pillar2: { rotationY: 120, rotationX: 10, scale: 1.1 },
            pillar3: { rotationY: -120, rotationX: -20, scale: 1.2 },
            exit: { rotationY: 0, rotationX: 0, scale: 1.0 }
          };

          const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power2.inOut' } });
          
          tl.to(actor3D, states.pillar1)
            .to(textPillars[0], { autoAlpha: 1 }, '<')
            
            .to(textPillars[0], { autoAlpha: 0 })
            .to(textPillars[1], { autoAlpha: 1 }, '<')
            .to(actor3D, states.pillar2, '<')
            
            // --- FIX #2 --- The label MUST go BEFORE the Pillar 3 animation starts.
            // This is the reference point for the reverse scroll.
            .addLabel('finalState')
            .to(textPillars[1], { autoAlpha: 0 })
            .to(textPillars[2], { autoAlpha: 1 }, '<')
            .to(actor3D, states.pillar3, '<')
            
            .to(textPillars[2], { autoAlpha: 0 })
            .to(actor3D, states.exit, '<');

          const mainScrub = ScrollTrigger.create({
            trigger: textCol,
            pin: visualsCol,
            start: 'top top',
            end: 'bottom bottom',
            animation: tl,
            scrub: 0.8,
            invalidateOnRefresh: true,
          });

          // Animation Handoff Trigger
          ScrollTrigger.create({
            trigger: summaryContainer,
            start: 'top center',
            onEnter: () => {
              if (isFlipped) return;
              isFlipped = true;
              mainScrub.disable();

              const state = Flip.getState(actor3D, { props: 'transform' });
              summaryClipper.appendChild(actor3D);
              visualsCol.classList.add('is-exiting');

              Flip.from(state, {
                duration: 0.8,
                ease: 'power2.inOut',
                absolute: true,
                onComplete: () => gsap.set(actor3D, { clearProps: 'transform' })
              });
            },
            
            // --- FIX #1: THE REVERSE SCROLL ---
            onLeaveBack: () => {
              if (!isFlipped) return;
              isFlipped = false;

              // 1. Capture the "FROM" state (small, in the thumbnail).
              const state = Flip.getState(actor3D, { props: "transform" });
              
              // 2. Move the cube back to its original parent.
              visualsCol.appendChild(actor3D);
              visualsCol.classList.remove('is-exiting');

              // 3. THE KEY: Instantly set the cube's transforms to the correct "Pillar 3" state.
              // This creates the "TO" state for Flip before the animation starts.
              gsap.set(actor3D, {
                rotationY: states.pillar3.rotationY,
                rotationX: states.pillar3.rotationX,
                scale: states.pillar3.scale
              });

              // 4. Now, tell Flip to animate from the captured "FROM" state to the now-correct "TO" state.
              // It will create one single, smooth animation for position, scale, AND rotation.
              Flip.from(state, {
                duration: 0.8,
                ease: 'power2.out',
                absolute: true,
                onComplete: () => {
                  // 5. The animation is done. NOW it is safe to sync the timeline and re-enable scrubbing.
                  tl.seek('finalState', false); // `false` prevents callbacks from firing
                  mainScrub.enable();
                }
              });
            }
          });
        },

        '(max-width: 768px)': () => {
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
          gsap.killTweensOf([actor3D, ...textPillars, '.pillar-line']);
          gsap.set([textPillars, actor3D, '.pillar-line'], { clearProps: 'all' });

          if (!visualsCol.contains(actor3D)) {
            visualsCol.appendChild(actor3D);
          }
          visualsCol.classList.remove('is-exiting');
          isFlipped = false;
        }
      });
    });

    return () => ctx.revert();
  }

  initialCheck();
});
