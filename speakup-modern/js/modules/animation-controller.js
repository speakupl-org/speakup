// js/modules/animation-controller.js

// MODERN IMPORT: This file now imports its own tools.
import gsap from 'gsap';

export function setupAnimationController(cube, textPillars) {
    if (!cube || !textPillars) return;

    gsap.timeline({
        scrollTrigger: {
            trigger: ".scrolly-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
            onUpdate: (self) => {
                const progress = self.progress;

                // Animate Cube
                cube.rotation.y = progress * Math.PI * 3;
                cube.rotation.z = progress * Math.PI * 1.5;
                cube.rotation.x = progress * Math.PI * -0.5;

                // Animate Text Pillars
                const numPillars = textPillars.length;
                const stepSize = 1 / numPillars;
                textPillars.forEach((pillar, i) => {
                    const pillarStart = i * stepSize;
                    const pillarEnd = pillarStart + stepSize;
                    const pillarProgress = gsap.utils.mapRange(pillarStart, pillarEnd, 0, 1, progress);
                    const opacity = Math.sin(pillarProgress * Math.PI);
                    gsap.set(pillar, { autoAlpha: opacity });
                });
            },
        },
    });
}