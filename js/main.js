document.addEventListener('DOMContentLoaded', () => {
  function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);

    const ctx = gsap.context(() => {
      const visualsCol = document.querySelector('.pillar-visuals-col');
      const scene3D = document.querySelector('.scene-3d');
      const textCol = document.querySelector('.pillar-text-col');
      const actor3D = document.getElementById('actor-3d');
      const textPillars = gsap.utils.toArray('.pillar-text-content');
      const summaryContainer = document.querySelector('.method-summary');
      const summaryClipper = document.querySelector('.summary-thumbnail-clipper');

      if (!visualsCol || !scene3D || !textCol || !actor3D || !summaryContainer || !summaryClipper || !textPillars.length) {
        console.error('Missing scrollytelling elements');
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

          const states = [
            { rotationY: 20, rotationX: -15, scale: 1.0 },
            { rotationY: 120, rotationX: 10, scale: 1.1 },
            { rotationY: -120, rotationX: -20, scale: 1.2 }
          ];

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
                onComplete: () => gsap.set(actor3D, { clearProps: 'all' }),
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
                onComplete: () => {
                  gsap.set(actor3D, { clearProps: 'transform' });
                  mainScrub.enable();
                },
              });
            },
          });
        },
        '(max-width: 768px)': () => {
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
          gsap.killTweensOf(actor3D);
          gsap.set([textPillars, actor3D, '.pillar-line'], { clearProps: 'all' });
          if (!scene3D.contains(actor3D)) scene3D.appendChild(actor3D);
          visualsCol.classList.remove('is-exiting');
          isFlipped = false;
        },
      });
    });

    return () => ctx.revert();
  }

  if (window.gsap && window.ScrollTrigger && window.Flip) {
    setupAnimations();
  } else {
    const interval = setInterval(() => {
      if (window.gsap && window.ScrollTrigger && window.Flip) {
        clearInterval(interval);
        setupAnimations();
      }
    }, 100);
  }
});
