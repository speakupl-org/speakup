// js/modules/animation-controller.js

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Sets up scrollytelling: pins visuals, spins cube, and fades sections.
 * @param {THREE.Mesh} cube - 3D cube instance
 */
export function setupScrollytelling(cube) {
    if (!cube) {
        console.error("Scrollytelling aborted: Cube object not found.");
        return;
    }
    const visualsColumn = document.querySelector('.scrolly-visuals');
    const textColumn = document.querySelector('.scrolly-text');
    const sections = gsap.utils.toArray('.scrolly-section');

    if (!visualsColumn || !textColumn || !sections.length) {
        console.error("Scrollytelling aborted: Could not find layout columns or sections.");
        return;
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

    // CREATE TIMELINE
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: textColumn,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2
        }
    });

    // MASTER CUBE SPIN
    tl.to(cube.rotation, {
        y: Math.PI * 2.5,
        x: -Math.PI * 1.5,
        ease: 'none'
    }, 0);

    // FADE SECTIONS
    sections.forEach((section, index) => {
        const pillarText = section.querySelector('.pillar-text-content');
        if (!pillarText) return;
        const inPos = `${index * 30 + 10}%`;
        const outPos = `${index * 30 + 30}%`;
        tl.from(pillarText, { autoAlpha: 0, y: 50 }, inPos);
        if (index < sections.length - 1) {
            tl.to(pillarText, { autoAlpha: 0, y: -50 }, outPos);
        }
    });

    // delayed ScrollTrigger refresh for final layout
    setTimeout(() => {
        ScrollTrigger.refresh();
        console.log("ScrollTrigger positions refreshed for final layout.");
    }, 100);
}