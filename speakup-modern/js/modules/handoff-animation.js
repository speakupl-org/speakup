// js/modules/handoff-animation.js
import { Sovereign } from '../diagnostics/sovereign-observer.js';

// This function now correctly receives all the tools it needs.
export function setupHandoffAnimation(elements, cube, { gsap, Flip, MorphSVGPlugin, ScrollTrigger }) {

    const logoPath = "M81.5,1.5 C37.2,1.5 1.5,37.2 1.5,81.5 C1.5,125.8 37.2,161.5 81.5,161.5 C125.8,161.5 161.5,125.8 161.5,81.5 C161.5,37.2 125.8,1.5 81.5,1.5 Z M81.5,116.5 C81.5,125.1 74.6,132 66,132 C57.4,132 50.5,125.1 50.5,116.5 L50.5,74 C50.5,65.4 57.4,58.5 66,58.5 C74.6,58.5 81.5,65.4 81.5,74 L81.5,116.5 Z M112.5,74 C112.5,65.4 105.6,58.5 97,58.5 C88.4,58.5 81.5,65.4 81.5,74 L81.5,89 C81.5,97.6 88.4,104.5 97,104.5 C105.6,104.5 112.5,97.6 112.5,89 L112.5,74 Z";

    gsap.to(elements.canvas, {
        scrollTrigger: {
            trigger: elements.handoffPoint,
            start: 'top center',
            toggleActions: "play none none reverse",

            onEnter: () => {
                Sovereign.update(cube, null, 'HANDOFF');

                const state = Flip.getState(elements.canvas);
                elements.summaryPlaceholder.appendChild(elements.canvas);
                
                Flip.from(state, {
                    duration: 1.2,
                    ease: 'power3.inOut',
                    onComplete: () => {
                        const tl = gsap.timeline();
                        tl.to(elements.canvas, { autoAlpha: 0, duration: 0.4 })
                          .to(elements.finalLogoSvg, { autoAlpha: 1, duration: 0.4 }, "<")
                          .fromTo(elements.morphPath, 
                              { morphSVG: "M81.5 81.5 L 81.5 81.5 L 81.5 81.5 L 81.5 81.5 Z" }, 
                              { duration: 1, morphSVG: logoPath, ease: 'expo.out' }
                          );
                        // Refresh ScrollTriggers after the layout change is complete.
                        ScrollTrigger.refresh();
                    }
                });
            },

            onLeaveBack: () => {
                Sovereign.update(cube, null, 'SCROLLY');
                
                const tl = gsap.timeline({
                    onComplete: () => {
                        const originalParent = document.querySelector('.pillar-visuals-col');
                        if (originalParent) {
                            originalParent.appendChild(elements.canvas);
                        }
                    }
                });
                tl.to(elements.finalLogoSvg, { autoAlpha: 0, duration: 0.3 })
                  .to(elements.canvas, { autoAlpha: 1, duration: 0.3 }, 0);
            }
        }
    });
}