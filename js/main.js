// js/main.js

// Wait for DOM to be ready
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

  // Update current year
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
        console.error('Missing scrollytelling elements');
        return;
      }

      let isFlipped = false;

      ScrollTrigger.matchMedia({
        // Desktop
        '(min-width: 769px)': () => {
          // Initial states
          gsap.set(textPillars, { autoAlpha: 0 });
          gsap.set(textPillars[0], { autoAlpha: 1 });

          // Decorative lines
          textPillars.forEach(pillar => {
            const line = pillar.querySelector('.pillar-line');
            if (!line) return;
            ScrollTrigger.create({
              trigger: pillar,
              start: 'top 60%',
              end: 'bottom 40%',
              onEnter:    () => gsap.to(line, { scaleX: 1, duration: 0.8, ease: 'power4.out' }),
              onLeave:    () => gsap.to(line, { scaleX: 0, transformOrigin: 'right', duration: 0.6, ease: 'power4.in' }),
              onEnterBack:() => gsap.to(line, { scaleX: 1, transformOrigin: 'left',  duration: 0.8, ease: 'power4.out' }),
              onLeaveBack:() => gsap.to(line, { scaleX: 0, duration: 0.6, ease: 'power4.in' }),
            });
          });

          // States for cube
          const states = [
            { rotationY: 20,   rotationX: -15, scale: 1.0 },
            { rotationY: 120,  rotationX: 10,  scale: 1.1 },
            { rotationY: -120, rotationX: -20, scale: 1.2 }
          ];

          // Master timeline
          const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power2.inOut' } });
          tl.to(actor3D, states[0])
            .to(textPillars[0], { autoAlpha: 1 }, '<')
            .to(textPillars[0], { autoAlpha: 0 })
            .to(textPillars[1], { autoAlpha: 1 }, '<')
            .to(actor3D,  states[1], '<')
            .to(textPillars[1], { autoAlpha: 0 })
            .to(textPillars[2], { autoAlpha: 1 }, '<')
            .to(actor3D,  states[2], '<')
            // Move label AFTER pillar3 tween
            .addLabel('finalState')
            .to(textPillars[2], { autoAlpha: 0 })
            .to(actor3D, { rotationY:0, rotationX:0, scale:1.0 }, '<');

          const mainScrub = ScrollTrigger.create({
            trigger: textCol,
            pin: visualsCol,
            start: 'top top',
            end: 'bottom bottom',
            animation: tl,
            scrub: 0.8,
            invalidateOnRefresh: true,
          });

          // Smooth Flip handoff
          ScrollTrigger.create({
            trigger: summaryContainer,
            start: 'top center',
            onEnter: () => {
              if (isFlipped) return;
              isFlipped = true;
              mainScrub.disable();

              // capture full transform
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
            onLeaveBack: () => {
              if (!isFlipped) return;
              isFlipped = false;

              const state = Flip.getState(actor3D, { props: 'transform' });
              visualsCol.appendChild(actor3D);
              visualsCol.classList.remove('is-exiting');

              Flip.from(state, {
                duration: 0.8,
                ease: 'power2.out',
                absolute: true,
                onComplete: () => mainScrub.enable()
              });
            }
          });
        },

        // Mobile cleanup
        '(max-width: 768px)': () => {
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
          gsap.killTweensOf(actor3D);
          gsap.set(textPillars, { clearProps: 'all' });
          gsap.set(actor3D,    { clearProps: 'all' });
          gsap.set('.pillar-line',{ clearProps: 'all' });

          // ensure cube in place
          if (!visualsCol.contains(actor3D)) {
            visualsCol.appendChild(actor3D);
          }
          visualsCol.classList.remove('is-exiting');
          isFlipped = false;
        }
      });
    });

    // cleanup
    return () => ctx.revert();
  }

  // load and run
  function initialCheck() {
    if (window.gsap && window.ScrollTrigger && window.Flip) {
      setupAnimations();
    } else {
      let attempts = 0;
      const interval = setInterval(() => {
        if (window.gsap && window.ScrollTrigger && window.Flip) {
          clearInterval(interval);
          setupAnimations();
        } else if (++attempts > 30) {
          clearInterval(interval);
          console.error('GSAP plugins failed to load');
        }
      }, 100);
    }
  }

  initialCheck();
});
