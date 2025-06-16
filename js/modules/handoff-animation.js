// js/modules/handoff-animation.js

// This function now accepts an object with all the GSAP tools it needs.
export function setupHandoffAnimation(elements, cube, { gsap, Flip, MorphSVGPlugin }) {

    // Define the shape of the final logo to morph into.
    const logoPath = "M81.5,1.5 C37.2,1.5 1.5,37.2 1.5,81.5 C1.5,125.8 37.2,161.5 81.5,161.5 C125.8,161.5 161.5,125.8 161.5,81.5 C161.5,37.2 125.8,1.5 81.5,1.5 Z M81.5,116.5 C81.5,125.1 74.6,132 66,132 C57.4,132 50.5,125.1 50.5,116.5 L50.5,74 C50.5,65.4 57.4,58.5 66,58.5 C74.6,58.5 81.5,65.4 81.5,74 L81.5,116.5 Z M112.5,74 C112.5,65.4 105.6,58.5 97,58.5 C88.4,58.5 81.5,65.4 81.5,74 L81.5,89 C81.5,97.6 88.4,104.5 97,104.5 C105.6,104.5 112.5,97.6 112.5,89 L112.5,74 Z";

    // Use GSAP's `ScrollTrigger` to create the trigger.
    gsap.to(elements.canvas, {
        scrollTrigger: {
            trigger: elements.handoffPoint,
            start: 'top center',
            toggleActions: "play none none reverse",

            onEnter: () => {
                // Use GSAP's Flip plugin to animate the canvas's position.
                const state = Flip.getState(elements.canvas);
                elements.summaryPlaceholder.appendChild(elements.canvas);
                
                Flip.from(state, {
                    duration: 1.2,
                    ease: 'power3.inOut',
                    onComplete: () => {
                        // After the flip, start the morph animation.
                        const tl = gsap.timeline();
                        tl.to(elements.canvas, { autoAlpha: 0, duration: 0.4 })
                          .to(elements.finalLogoSvg, { autoAlpha: 1, duration: 0.4 }, "<")
                          .fromTo(elements.morphPath, 
                              { morphSVG: "M81.5 81.5 L 81.5 81.5 L 81.5 81.5 L 81.5 81.5 Z" }, 
                              { duration: 1, morphSVG: logoPath, ease: 'expo.out' }
                          );
                    }
                });
            },

            onLeaveBack: () => {
                // Reverse the animation when scrolling back up.
                const tl = gsap.timeline({
                    onComplete: () => {
                        // This logic to return the canvas to its original parent
                        // needs to be robust. We might need to pass the original parent in `elements`.
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