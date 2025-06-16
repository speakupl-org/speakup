// js/modules/scroll-engine.js

// 1. MODERN IMPORTS
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 2. REGISTER THE PLUGIN
// This must be done inside any module that uses the plugin.
gsap.registerPlugin(ScrollTrigger);

// 3. THE FUNCTION (simpler signature)
// It no longer needs gsap passed in, because it imports it directly.
export function createScrollEngine(cube) {
  
  const pillars = gsap.utils.toArray('.pillar-text-content');
  if (!pillars.length) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.scrolly-container',
      start: 'top top',
      end: 'bottom bottom', // Animate over the entire height
      scrub: 1.2,
    },
  });

  // Cube's main rotation throughout the scroll
  tl.to(cube.rotation, {
    y: Math.PI * 4,
    x: Math.PI * 2,
    ease: "none",
  }, 0);

  // --- DEFINITIVE TEXT PILLAR ANIMATION ---
  pillars.forEach((pillar, index) => {
    const textWrapper = pillar.querySelector('.text-anim-wrapper');
    if (textWrapper) {
      // Each pillar gets its own 'in' and 'out' animation on the timeline
      const totalDuration = 1.0; // The total time on the timeline for each pillar
      const startTime = index * totalDuration;

      // Fade IN
      tl.from(textWrapper, { autoAlpha: 0, y: 50 }, startTime);
      
      // Fade OUT (but not the last one)
      if (index < pillars.length - 1) {
        tl.to(textWrapper, { autoAlpha: 0, y: -50 }, startTime + totalDuration * 0.7);
      }
    }
  });
}