import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(Flip, MorphSVGPlugin, ScrollTrigger);

export function setupHandoffAnimation(elements, cube, gsap) {
    const { Flip, MorphSVGPlugin, ScrollTrigger } = gsap;
    gsap.set(elements.finalLogoSvg, { autoAlpha: 0 });

    const logoPath = "M81.5,1.5 C37.2,1.5 1.5,37.2 1.5,81.5 C1.5,125.8 37.2,161.5 81.5,161.5 C125.8,161.5 161.5,125.8 161.5,81.5 C161.5,37.2 125.8,1.5 81.5,1.5 Z M81.5,116.5 C81.5,125.1 74.6,132 66,132 C57.4,132 50.5,125.1 50.5,116.5 L50.5,74 C50.5,65.4 57.4,58.5 66,58.5 C74.6,58.5 81.5,65.4 81.5,74 L81.5,116.5 Z M112.5,74 C112.5,65.4 105.6,58.5 97,58.5 C88.4,58.5 81.5,65.4 81.5,74 L81.5,89 C81.5,97.6 88.4,104.5 97,104.5 C105.6,104.5 112.5,97.6 112.5,89 L112.5,74 Z";

    ScrollTrigger.create({
        trigger: elements.handoffPoint,
        start: "top center",
        toggleActions: "play none none reverse",
        onEnter: () => {
            const state = Flip.getState(elements.canvas);
            elements.summaryPlaceholder.appendChild(elements.canvas);

            // Animate the canvas's POSITION, but NOT its internal scale.
            Flip.from(state, {
                duration: 1.5,
                ease: "power2.inOut",
                scale: false, // <-- THIS IS THE CRITICAL FIX for the "jump".
                onComplete: () => {
                    gsap.to(elements.canvas, { autoAlpha: 0, duration: 0.3 });
                    gsap.fromTo(elements.finalLogoSvg, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 });
                    gsap.fromTo(elements.morphPath,
                        { morphSVG: "M81.5 81.5 L 81.5 81.5 Z" }, // Start as a dot
                        { morphSVG: logoPath, duration: 1, ease: "expo.out" }
                    );
                }
            });

            // SIMULTANEOUSLY, scale the 3D CUBE down to nothing.
            gsap.to(cube.scale, {
                x: 0.01, y: 0.01, z: 0.01,
                duration: 1.5, // Match the Flip duration
                ease: "power3.in",
            });
        },
        onLeaveBack: () => {
            const originalParent = document.querySelector('.pillar-visuals-col');
            const state = Flip.getState(elements.canvas, { props: "position,width,height" });

            if (originalParent) {
                originalParent.appendChild(elements.canvas);
            }

            Flip.from(state, { duration: 1.0, ease: "power2.out", scale: false });
            gsap.to(cube.scale, { x: 1, y: 1, z: 1, duration: 1.0, ease: "power3.out" });
            gsap.to(elements.finalLogoSvg, { autoAlpha: 0, duration: 0.3 });
        }
    });
}