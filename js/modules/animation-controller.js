export function setupScrollytelling(cube, gsap) {
    const pillars = gsap.utils.toArray('.pillar-text-content');
    if (!pillars.length || !cube) return;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.scrolly-container',
            start: 'top top',
            end: 'bottom bottom', // Animate over the entire scroll length
            scrub: 1.5,
        },
    });

    // --- CUBE'S MAIN ROTATION ---
    tl.to(cube.rotation, { y: Math.PI * 4, x: Math.PI * 2, ease: 'none' }, 0);

    // --- TEXT PILLAR FADES ---
    // The total animation has a "duration" of 3 on the timeline
    // So each pillar gets 1 "second" to animate.
    pillars.forEach((pillar, index) => {
        const textWrapper = pillar.querySelector('.text-anim-wrapper');
        if (textWrapper) {
            // Fade IN at the start of the chapter
            tl.from(textWrapper, { autoAlpha: 0, y: 50 }, index * 1);
            // Fade OUT at the end of the chapter (but not for the last one)
            if (index < pillars.length - 1) {
                tl.to(textWrapper, { autoAlpha: 0, y: -50 }, (index * 1) + 0.75);
            }
        }
    });
}