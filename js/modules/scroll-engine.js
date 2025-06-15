// js/modules/scroll-engine.js
const gsap = window.gsap;

export function createScrollEngine(triggerElement, onProgressUpdate) {
  gsap.timeline({
    scrollTrigger: {
      trigger: triggerElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        onProgressUpdate(self.progress);
      },
    },
  });
}
