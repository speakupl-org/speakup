// js/modules/animation-controller.js

// GSAP loaded globally via script tags (optimized for Cloudflare Pages)
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
} else {
    console.error("GSAP not available");
}

/**
 * Sets up "Living Crystal" scrollytelling: illuminated narrative with story-driven lighting.
 * @param {THREE.Mesh} cube - 3D cube instance
 * @param {Object} scene3D - Scene object containing narrative lights and bloom pass
 */
export function setupScrollytelling(cube, scene3D = {}) {
    if (!cube) {
        console.error("Scrollytelling setup failed: Cube object not found");
        return;
    }
    
    if (!scene3D.lights) {
        console.error("Scrollytelling aborted: Narrative lights not found.");
        return;
    }
    
    const visualsColumn = document.querySelector('.scrolly-visuals');
    const textColumn = document.querySelector('.scrolly-text');
    const sections = gsap.utils.toArray('.scrolly-section');

    if (!visualsColumn || !textColumn || !sections.length) {
        console.error("Scrollytelling aborted: Could not find layout columns or sections.");
        return;
    }

    // Mark cube as being controlled by scroll when animations start
    cube.userData = cube.userData || {};
    cube.userData.isScrollControlled = false;

    // Extract the narrative lights for easier reference
    const { pillar1, pillar2, pillar3 } = scene3D.lights;
    
    // Extract text elements for the illuminated narrative
    const textPillars = sections.map(section => section.querySelector('.pillar-text-content')).filter(Boolean);
    
    if (textPillars.length !== 3) {
        console.warn(`Expected 3 text pillars, found ${textPillars.length}`);
    }

    ScrollTrigger.create({
        trigger: visualsColumn,
        start: 'top top',
        endTrigger: textColumn,
        end: 'bottom bottom',
        pin: true,
        pinSpacing: false
    });

    // Act 2: The Cinematic Phase - Interaction Control ScrollTrigger
    ScrollTrigger.create({
        trigger: textColumn,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
            if (scene3D.disableInteraction) scene3D.disableInteraction();
            
            gsap.to(cube.rotation, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: 'power3.inOut'
            });
        },
        onLeaveBack: () => {
            if (scene3D.enableInteraction) scene3D.enableInteraction();
        }
    });

    // === GSAP Timeline for Illuminated Narrative ===
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: textColumn,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2,
            onStart: () => {
                cube.userData.isCinematic = true;
            },
            onComplete: () => {
                cube.userData.isCinematic = false;
            }
        }
    });

    // Master cube rotation during cinematic phase
    tl.to(cube.rotation, {
        y: Math.PI * 2.5,
        x: -Math.PI * 1.5,
        ease: 'none'
    }, 0);

    if (textPillars[0]) {
        tl.fromTo(textPillars[0], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '0%');
        tl.to(scene3D.lights.pillar1, { intensity: 2.0, duration: 0.7, ease: 'power2.out' }, '0%');
        tl.to(textPillars[0], { autoAlpha: 0, y: -30, duration: 0.5, ease: 'power2.in' }, '30%');
        tl.to(scene3D.lights.pillar1, { intensity: 0, duration: 0.7, ease: 'power2.in' }, '30%');
    }
    
    if (textPillars[1]) {
        tl.fromTo(textPillars[1], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '34%');
        tl.to(scene3D.lights.pillar2, { intensity: 2.0, duration: 0.7, ease: 'power2.out' }, '34%');
        tl.to(textPillars[1], { autoAlpha: 0, y: -30, duration: 0.5, ease: 'power2.in' }, '63%');
        tl.to(scene3D.lights.pillar2, { intensity: 0, duration: 0.7, ease: 'power2.in' }, '63%');
    }
    
    if (textPillars[2]) {
        tl.fromTo(textPillars[2], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '67%');
        tl.to(scene3D.lights.pillar3, { intensity: 2.0, duration: 0.7, ease: 'power2.out' }, '67%');
        tl.to(textPillars[2], { autoAlpha: 0, y: -30, duration: 0.5, ease: 'power2.in' }, '96%');
        tl.to(scene3D.lights.pillar3, { intensity: 0, duration: 0.7, ease: 'power2.in' }, '96%');
    }

    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 500);

    window.scene3D = scene3D;
}