// js/modules/animation-controller.js

// MODERN IMPORT: This file now imports its own tools.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// This is the new, "chapter-based" animation engine.
export function setupScrollytelling(cube, textPillars) {
    if (!cube || !textPillars.length) return;

    // Set initial state
    gsap.set(textPillars, { autoAlpha: 0 });

    // --- CHAPTER 1: PILLAR 1 ---
    ScrollTrigger.create({
        trigger: textPillars[0], // Trigger for the first pillar
        start: "top center",
        end: "bottom center",
        onEnter: () => {
            gsap.to(textPillars[0], { autoAlpha: 1, duration: 0.5 });
            gsap.to(cube.rotation, { y: Math.PI * 2, x: Math.PI * 0.5, duration: 2, ease: 'power2.inOut' });
        },
        onLeave: () => {
            gsap.to(textPillars[0], { autoAlpha: 0, duration: 0.5 });
        },
        onEnterBack: () => {
            gsap.to(textPillars[0], { autoAlpha: 1, duration: 0.5 });
            gsap.to(cube.rotation, { y: 0, x: 0, duration: 2, ease: 'power2.inOut' });
        },
        onLeaveBack: () => {
            gsap.to(textPillars[0], { autoAlpha: 0, duration: 0.5 });
        },
    });

    // --- CHAPTER 2: PILLAR 2 ---
    ScrollTrigger.create({
        trigger: textPillars[1], // Trigger for the second pillar
        start: "top center",
        end: "bottom center",
        onEnter: () => {
            gsap.to(textPillars[1], { autoAlpha: 1, duration: 0.5 });
            // New direction!
            gsap.to(cube.rotation, { y: -Math.PI * 2, z: Math.PI, duration: 2, ease: 'power2.inOut' });
        },
        onLeave: () => {
            gsap.to(textPillars[1], { autoAlpha: 0, duration: 0.5 });
        },
        onEnterBack: () => {
            gsap.to(textPillars[1], { autoAlpha: 1, duration: 0.5 });
            gsap.to(cube.rotation, { y: Math.PI * 2, x: Math.PI * 0.5, duration: 2, ease: 'power2.inOut' });
        },
        onLeaveBack: () => {
            gsap.to(textPillars[1], { autoAlpha: 0, duration: 0.5 });
        },
    });

    // --- CHAPTER 3: PILLAR 3 ---
    ScrollTrigger.create({
        trigger: textPillars[2], // Trigger for the third pillar
        start: "top center",
        end: "bottom center",
        onEnter: () => {
            gsap.to(textPillars[2], { autoAlpha: 1, duration: 0.5 });
            // Final direction!
            gsap.to(cube.rotation, { y: 0, x: -Math.PI, z: -Math.PI * 2, duration: 2, ease: 'power2.inOut' });
        },
        onLeaveBack: () => {
            gsap.to(textPillars[2], { autoAlpha: 0, duration: 0.5 });
            gsap.to(cube.rotation, { y: -Math.PI * 2, z: Math.PI, duration: 2, ease: 'power2.inOut' });
        },
    });
}