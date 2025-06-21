// js/modules/animation-controller.js

// GSAP loaded globally via script tags (optimized for Cloudflare Pages)
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    if (window.debug && window.debug.enabled) {
        window.debug.log('ANIM', 'INIT', 'COMPLETE');
    }
} else {
    if (window.debug && window.debug.enabled) {
        window.debug.error('ANIM', 'INIT', 'FAILED [GSAP not available]');
    } else {
        console.error("ERR.ANIM: GSAP not available");
    }
}

/**
 * Sets up "Living Crystal" scrollytelling: illuminated narrative with story-driven lighting.
 * @param {THREE.Mesh} cube - 3D cube instance
 * @param {Object} scene3D - Scene object containing narrative lights and bloom pass
 */
export function setupScrollytelling(cube, scene3D = {}) {
    if (!cube) {
        if (window.debug && window.debug.enabled) {
            window.debug.error('ANIM', 'SETUP', 'FAILED [Cube object not found]');
        } else {
            console.error("ERR.ANIM.SETUP: FAILED [Cube object not found]");
        }
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

    if (window.debug && window.debug.enabled) {
        window.debug.log('ANIM', 'SETUP', 'COMPLETE [Narrative lights initialized]');
    }

    // PIN VISUALS COLUMN
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
            if (window.debug && window.debug.enabled) {
                window.debug.log('ANIM', 'PHASE', 'CINEMATIC [Interaction disabled]');
            }
            if (scene3D.disableInteraction) scene3D.disableInteraction();
            
            // Hand-off transition: smoothly animate from current rotation to timeline start
            gsap.to(cube.rotation, {
                x: 0, // Target start rotation for the timeline
                y: 0, // Target start rotation for the timeline
                duration: 0.8,
                ease: 'power3.inOut',
                onComplete: () => {
                    if (window.debug && window.debug.enabled) {
                        window.debug.log('ANIM', 'TRANSITION', 'COMPLETE [Hand-off finalized]');
                    }
                }
            });
        },
        onLeaveBack: () => {
            if (window.debug && window.debug.enabled) {
                window.debug.log('ANIM', 'PHASE', 'INTERACTIVE [Interaction enabled]');
            }
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
                // Ensure cube is ready for cinematic control
                cube.userData.isCinematic = true;
            },
            onComplete: () => {
                // Mark end of cinematic sequence
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

    // Pillar 1: Brand Golden Light (0% to 30%) - Primary brand color illumination
    if (textPillars[0]) {
        tl.fromTo(textPillars[0], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '0%');
        tl.to(scene3D.lights.pillar1, { intensity: 2.0, duration: 0.7, ease: 'power2.out' }, '0%'); // Precise 2.0 intensity
        tl.to(textPillars[0], { autoAlpha: 0, y: -30, duration: 0.5, ease: 'power2.in' }, '30%');
        tl.to(scene3D.lights.pillar1, { intensity: 0, duration: 0.7, ease: 'power2.in' }, '30%');
    }
    
    // Pillar 2: Cool Blue Light (34% to 63%) - Complementary blue illumination
    if (textPillars[1]) {
        tl.fromTo(textPillars[1], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '34%');
        tl.to(scene3D.lights.pillar2, { intensity: 2.0, duration: 0.7, ease: 'power2.out' }, '34%'); // Precise 2.0 intensity
        tl.to(textPillars[1], { autoAlpha: 0, y: -30, duration: 0.5, ease: 'power2.in' }, '63%');
        tl.to(scene3D.lights.pillar2, { intensity: 0, duration: 0.7, ease: 'power2.in' }, '63%');
    }
    
    // Pillar 3: Clean White Light (67% to 96%) - Pure white illumination
    if (textPillars[2]) {
        tl.fromTo(textPillars[2], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '67%');
        tl.to(scene3D.lights.pillar3, { intensity: 2.0, duration: 0.7, ease: 'power2.out' }, '67%'); // Precise 2.0 intensity
        tl.to(textPillars[2], { autoAlpha: 0, y: -30, duration: 0.5, ease: 'power2.in' }, '96%');
        tl.to(scene3D.lights.pillar3, { intensity: 0, duration: 0.7, ease: 'power2.in' }, '96%');
    }

    // Delayed ScrollTrigger refresh for final layout
    setTimeout(() => {
        ScrollTrigger.refresh();
        if (window.debug && window.debug.enabled) {
            window.debug.log('ANIM', 'SCROLLTRIGGER', 'COMPLETE [Three-act experience initialized]');
        }
    }, 500);

    if (window.debug && window.debug.enabled) {
        window.debug.log('ANIM', 'SETUP', 'COMPLETE [Crystal animation implemented]');
    }

    // Make scene3D globally accessible for verification testing
    window.scene3D = scene3D;
}