// js/modules/animation-controller.js

export function setupScrollytelling(cube, gsap) {
    const pillars = gsap.utils.toArray('.pillar-text-content');
    if (!pillars.length || !cube) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.scrolly-container',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
        },
    });

    // --- Cube Rotation Chapters ---
    // The timeline is 3 "seconds" long, one for each pillar.
    const chapterDuration = 1;

    // Pillar 1 Rotation
    tl.to(cube.rotation, { y: Math.PI * 1.5, x: -Math.PI * 0.5, ease: 'none', duration: chapterDuration }, 0);

    // Pillar 2 Rotation (New Direction)
    tl.to(cube.rotation, { y: -Math.PI, z: Math.PI * 1.5, ease: 'none', duration: chapterDuration }, chapterDuration);

    // Pillar 3 Rotation (Final Direction)
    tl.to(cube.rotation, { y: Math.PI * 2, x: -Math.PI, ease: 'none', duration: chapterDuration }, chapterDuration * 2);

    // --- Text Pillar Fades (on the same timeline) ---
    pillars.forEach((pillar, index) => {
        // Fade IN at the start of its chapter
        tl.from(pillar, { autoAlpha: 0, y: 50 }, index * chapterDuration);
        // Fade OUT at the end of its chapter (but not the last one)
        if (index < pillars.length - 1) {
            tl.to(pillar, { autoAlpha: 0, y: -50 }, (index * chapterDuration) + (chapterDuration - 0.25));
        }
    });
}
