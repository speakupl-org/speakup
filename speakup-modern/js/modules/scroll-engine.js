// js/modules/scroll-engine.js

export function createScrollEngine(cube, gsap) {
  const pillars = gsap.utils.toArray('.pillar-text-content');
  if (!pillars.length) return;

  // The master timeline that will control everything.
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.scrolly-container',
      start: 'top top',
      // CRITICAL FIX: The animation must span the entire height
      // of the text column to feel correct.
      end: 'bottom bottom',
      scrub: 1.2,
    },
  });

  // --- CUBE'S MAIN ROTATION ---
  tl.to(cube.rotation, {
    y: Math.PI * 4,
    x: Math.PI * 2,
    ease: "power1.inOut",
  }, 0); // Start at the beginning (time 0)

  // --- TEXT PILLAR FADES ---
  pillars.forEach((pillar, index) => {
    const textWrapper = pillar.querySelector('.text-anim-wrapper');
    if (textWrapper) {
      // We position the animations along the timeline based on index
      // This is simpler and more robust than trying to calculate start/end.
      const startTime = index / pillars.length;
      const endTime = (index + 0.5) / pillars.length;
      
      tl.from(textWrapper, {
        opacity: 0,
        y: 50,
        ease: 'power2.out'
      }, startTime); // Animate IN at its start time

      // Don't fade out the last pillar
      if (index < pillars.length - 1) {
        tl.to(textWrapper, {
          opacity: 0,
          y: -50,
          ease: 'power2.in'
        }, endTime); // Animate OUT at its end time
      }
    }
  });

  // --- MORPH TRIGGER (will be handled by handoff-animation.js) ---
  // We just need to make sure the scroll trigger ends correctly,
  // which it now does with `end: 'bottom bottom'`.
}