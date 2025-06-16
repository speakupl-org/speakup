// js/modules/scroll-engine.js

// This function now accepts `gsap` as an argument so it can use it.
export function createScrollEngine(triggerElement, onProgressUpdate, gsap) {
  gsap.timeline({
    scrollTrigger: {
      trigger: triggerElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // This part is correct: it uses the callback to send progress out.
        onProgressUpdate(self.progress);
      },
    },
  });
}