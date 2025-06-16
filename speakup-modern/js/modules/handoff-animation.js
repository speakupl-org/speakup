// js/modules/handoff-animation.js

export function setupHandoffAnimation(elements, cube, gsap) {
    const { Flip, MorphSVGPlugin, ScrollTrigger } = gsap;

    const logoPath = "(M 0.00 257.00 C 1.16 251.11 1.45 243.30 2.00 237.00 C 4.89 204.11 12.77 164.87 32.00 138.00 C 32.61 136.88 33.34 135.98 34.00 135.00 C 35.81 131.22 37.84 127.76 40.00 124.00 C 41.04 122.20 41.58 120.36 43.00 119.00 C 43.26 118.75 43.83 118.33 44.00 118.00 C 45.09 115.81 46.74 114.76 48.00 113.00 C 49.27 110.74 50.35 108.23 52.00 106.00 C 53.47 104.02 55.01 102.39 57.00 101.00 C 57.20 100.60 57.00 100.00 57.00 100.00 C 58.69 97.79 59.72 96.02 62.00 95.00 C 62.20 94.60 62.00 94.00 62.00 94.00 C 62.92 92.11 64.75 91.36 66.00 90.00 C 66.71 89.06 67.32 87.90 68.00 87.00 C 72.21 81.43 77.96 76.66 83.00 72.00 C 88.62 65.92 95.91 59.86 103.00 55.00 C 104.68 53.85 106.32 53.04 108.00 52.00 C 111.01 49.65 113.64 47.09 117.00 45.00 C 117.41 44.74 118.47 43.88 119.00 44.00 C 119.26 43.76 119.65 43.03 120.00 43.00 C 120.50 42.95 121.00 43.00 121.00 43.00 C 122.16 41.41 123.21 40.83 125.00 40.00 C 126.05 39.51 126.98 39.41 128.00 39.00 C 128.87 38.51 130.06 37.55 131.00 37.00 C 132.63 35.76 133.12 35.91 135.00 35.00 C 136.30 34.21 137.46 32.85 139.00 32.00 C 141.95 30.37 144.90 29.12 148.00 28.00 C 151.23 26.40 154.47 24.39 158.00 23.00 C 170.28 18.18 182.20 13.32 195.00 10.00 C 199.68 8.79 204.16 7.80 209.00 7.00 C 209.48 6.85 210.15 6.20 211.00 6.00 C 215.57 4.95 220.23 4.38 225.00 4.00 C 226.67 3.71 228.67 2.86 231.00 3.00 C 231.50 3.03 232.50 2.97 233.00 3.00 C 234.79 2.28 236.60 1.74 239.00 2.00 C 239.49 2.05 240.00 2.00 240.00 2.00 C 242.55 0.12 247.65 1.00 251.00 1.00 C 255.67 1.00 260.33 1.00 265.00 1.00 C 264.96 1.00 265.00 0.00 265.00 0.00 L 0.00 0.00 L 0.00 257.00 Z)";

    ScrollTrigger.create({
        trigger: elements.handoffPoint, // This now refers to the last pillar
        // THIS IS THE FIX:
        // Start the handoff animation as soon as the top of
        // the last pillar reaches 40% down from the top of the screen.
        start: "top 40%",
        toggleActions: "play none none reverse",

        onEnter: () => {
            const tl = gsap.timeline();

            // STEP 1: Make the placeholder visible so Flip.js knows where to go.
            tl.set(elements.summaryPlaceholder, { display: 'block' });

            // STEP 2: Animate the canvas moving and the cube shrinking.
            tl.add(() => {
                const state = Flip.getState(elements.canvas);
                elements.summaryPlaceholder.appendChild(elements.canvas);

                Flip.from(state, {
                    duration: 1.5,
                    ease: "power2.inOut",
                    scale: false, // The proven fix for the "jump"
                });

                gsap.to(cube.scale, {
                    x: 0.01, y: 0.01, z: 0.01,
                    duration: 1.5,
                    ease: "power3.in",
                });
            });

            // STEP 3: After the canvas arrives, morph the logo.
            tl.to(elements.canvas, { autoAlpha: 0, duration: 0.3 }, "+=1.2");
            tl.fromTo(elements.finalLogoSvg,
                { autoAlpha: 0, display: 'none' },
                { autoAlpha: 1, display: 'block', duration: 0.5 },
                "<" // Start at the same time as the canvas fades out
            );
            tl.fromTo(elements.morphPath,
                { morphSVG: "M81.5 81.5 L 81.5 81.5 Z" },
                { morphSVG: logoPath, duration: 1, ease: "expo.out" }
            );
        },

        onLeaveBack: () => {
            // Reverse the process smoothly
            gsap.timeline()
                .to(elements.finalLogoSvg, { autoAlpha: 0, display: 'none', duration: 0.3 })
                .set(elements.summaryPlaceholder, { display: 'none' }); // Hide the placeholder again

            // The rest of the onLeaveBack logic for the cube returning
            const originalParent = document.querySelector('.pillar-visuals-col');
            if (originalParent && elements.canvas.parentNode !== originalParent) {
                const state = Flip.getState(elements.canvas, { props: "position,width,height" });
                originalParent.appendChild(elements.canvas);
                Flip.from(state, { duration: 1.0, ease: "power2.out", scale: false });
                gsap.to(cube.scale, { x: 1, y: 1, z: 1, duration: 1.0, ease: "power3.out" });
            }
        }
    });
}