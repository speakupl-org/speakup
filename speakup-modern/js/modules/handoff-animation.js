// js/modules/handoff-animation.js
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(Flip, MorphSVGPlugin, ScrollTrigger);

export function setupHandoffAnimation(elements, cube) {
    const logoPath = "M81.5,1.5 C37.2,1.5 1.5,37.2 1.5,81.5 C1.5,125.8 37.2,161.5 81.5,161.5 C125.8,161.5 161.5,125.8 161.5,81.5 C161.5,37.2 125.8,1.5 81.5,1.5 Z M81.5,116.5 C81.5,125.1 74.6,132 66,132 C57.4,132 50.5,125.1 50.5,116.5 L50.5,74 C50.5,65.4 57.4,58.5 66,58.5 C74.6,58.5 81.5,65.4 81.5,74 L81.5,116.5 Z M112.5,74 C112.5,65.4 105.6,58.5 97,58.5 C88.4,58.5 81.5,65.4 81.5,74 L81.5,89 C81.5,97.6 88.4,104.5 97,104.5 C105.6,104.5 112.5,97.6 112.5,89 L112.5,74 Z";

    ScrollTrigger.create({
        trigger: elements.handoffPoint,
        start: "top center",
        // Adding toggleActions makes the reverse animation work automatically
        toggleActions: "play none none reverse",

        // --- THE FORWARD "ABSORPTION" ANIMATION ---
        onEnter: () => {
            // A timeline for the absorption effect
            const tl = gsap.timeline();
            
            // 1. Shrink and fade the 3D cube
            tl.to(cube.scale, { x: 0.1, y: 0.1, z: 0.1, duration: 0.8, ease: "power3.in" })
              .to(elements.canvas, { autoAlpha: 0, duration: 0.3 }, "-=0.3");

            // 2. At the same time, fade in the SVG and morph it
            tl.to(elements.finalLogoSvg, { autoAlpha: 1, duration: 0.1 }, 0)
              .fromTo(elements.morphPath, 
                  // Start as a tiny dot in the center
                  { morphSVG: "M81.5 81.5 L 81.5 81.5 L 81.5 81.5 L 81.5 81.5 Z" }, 
                  // Expand to the full logo path
                  { duration: 1.2, morphSVG: logoPath, ease: "expo.out" }, 
                  0.3 // Start slightly after the cube begins shrinking
              );
        },

        // --- THE REVERSE "EXPULSION" ANIMATION ---
        onLeaveBack: () => {
            gsap.timeline()
                .to(elements.morphPath, { duration: 0.4, morphSVG: "M81.5 81.5 L 81.5 81.5 L 81.5 81.5 L 81.5 81.5 Z", ease: "power3.in" })
                .set(elements.finalLogoSvg, { autoAlpha: 0 })
                .to(elements.canvas, { autoAlpha: 1, duration: 0.3 })
                .to(cube.scale, { x: 1, y: 1, z: 1, duration: 0.8, ease: "power3.out" }, "<");
        }
    });
}