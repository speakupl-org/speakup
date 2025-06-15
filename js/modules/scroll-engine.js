// js/modules/scroll-engine.js
const gsap = window.gsap;

export function createScrollEngine(triggerElement, onProgressUpdate, gsap) {
  gsap.timeline({
    scrollTrigger: {
      trigger: triggerElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Use the callback to send the progress value out
        onProgressUpdate(self.progress);
        
        // ADD THIS PROBE:
        console.log('Scroll Engine Firing! Progress:', self.progress.toFixed(2));
      },
    },
  });
}
