// js/modules/animation-controller.js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin);


// This function now needs all the DOM elements to do its job.
export function setupSpeakUpAnimation(cube, elements) {
    if (!cube || !elements.textPillars.length) {
        console.error("Animation setup failed: Cube or text pillars are missing.");
        return;
    }


    // This is the one and only master timeline.
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".scrolly-container",
            start: "top top",
            // FIX: Extend the scrollable area by 200% of the screen height
            // to create room for the final "absorption" animation.
            end: "bottom bottom+=200%",
            scrub: 1.5,
            pin: ".pillar-visuals-col",
        }
    });


    // --- CHAPTER 1: The Pillar Animations ---
    elements.textPillars.forEach((pillar, index) => {
        const textWrapper = pillar.querySelector('.text-anim-wrapper');
        if (textWrapper) {
            const startTime = index;
            tl.fromTo(textWrapper,
                { autoAlpha: 0, y: 30 },
                { autoAlpha: 1, y: 0, duration: 0.4 },
                startTime
            );
            // Don't fade out the last pillar
            if (index < elements.textPillars.length - 1) {
                tl.to(textWrapper,
                    { autoAlpha: 0, y: -30, duration: 0.4, ease: 'power2.in' },
                    startTime + 0.6
                );
            }
        }
    });


    // Different, more interesting rotation for the main scroll part
    tl.to(cube.rotation, {
        x: Math.PI * 1,
        y: Math.PI * 2,
        z: Math.PI * 3,
        ease: "none",
    }, 0);


    // --- CHAPTER 2: The Black Hole Absorption ---
    // Add a label to mark exactly where this sequence begins on the timeline.
    tl.addLabel("absorb", ">"); // Start right after the pillar animations finish.


    // Animate the canvas element itself. Use Flip.js to get the destination state.
    // This will move the canvas smoothly to the placeholder's position and size.
    tl.to(elements.canvas, {
        ...Flip.getTargetState(elements.summaryPlaceholder),
        duration: 2,
        ease: "power2.inOut",
    }, "absorb");


    // At the SAME TIME, animate the CUBE's properties for the "absorption" effect.
    tl.to(cube.scale, {
        duration: 2,
        x: 0.05,
        y: 0.05,
        z: 0.05,
        ease: "power3.in",
    }, "absorb");


    // Add a chaotic spin to simulate being pulled into a black hole.
    tl.to(cube.rotation, {
        duration: 2,
        x: "+=8",
        y: "+=10",
        z: "+=5",
        ease: "power1.in",
    }, "absorb");
    

    // --- CHAPTER 3: The Logo Morph ---
    // Start this slightly after the absorption begins.
    const morphStartTime = "absorb+=1.0";


    tl.set(elements.finalLogoSvg, { autoAlpha: 1 }, morphStartTime);
    tl.fromTo(elements.morphPath,
        // Start as a tiny dot in the center of the placeholder.
        { morphSVG: "M150,150 L150,150 Z" },
        { 
            morphSVG: elements.logoPath, 
            duration: 1, 
            ease: "expo.out",
        },
        morphStartTime
    );


    // Finally, fade out the 3D canvas completely as the morph finishes.
    tl.to(elements.canvas, { autoAlpha: 0, duration: 0.5 }, morphStartTime);
}