// js/modules/animation-controller.js
const { gsap } = window;

export function setupScrollytelling(cube, textPillars) {
    if (!gsap || !cube || !textPillars) {
        console.error("Scrollytelling setup failed: missing required elements.");
        return;
    }

    gsap.timeline({
        scrollTrigger: {
            trigger: ".scrolly-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2,
            invalidateOnRefresh: true,
            
            onUpdate: (self) => {
                const progress = self.progress;

                // --- Animate Cube ---
                cube.rotation.y = progress * Math.PI * 3;
                cube.rotation.z = progress * Math.PI * 1.5;
                cube.rotation.x = progress * Math.PI * -0.5;
                const scale = (progress < 0.5)
                    ? gsap.utils.mapRange(0, 0.5, 1, 1.2, progress)
                    : gsap.utils.mapRange(0.5, 1, 1.2, 1, progress);
                cube.scale.set(scale, scale, scale);

                // --- Animate Text Pillars ---
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