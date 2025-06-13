// js/main.js - TEMPORARY DIAGNOSTIC VERSION

ScrollTrigger.create({
    trigger: summaryContainer,
    start: 'top center',
    onEnter: () => {
        // We don't need to debug this part, it can stay the same.
        if (isFlipped) return;
        isFlipped = true;
        mainScrub.disable();
        const state = Flip.getState(actor3D);
        summaryClipper.appendChild(actor3D);
        visualsCol.classList.add('is-exiting');
        Flip.from(state, {
            duration: 0.8,
            ease: 'power2.inOut',
            scale: true,
            onComplete: () => gsap.set(actor3D, { clearProps: 'all' })
        });
    },
    onLeaveBack: () => {
        console.log("========================================");
        console.log(`[DEBUG at ${Date.now()}] 1. onLeaveBack Fired.`);

        if (!isFlipped) {
            console.log("[DEBUG] Aborting: isFlipped is false.");
            return;
        }
        isFlipped = false;

        console.log("[DEBUG] 2. Getting Flip state and moving element.");
        const state = Flip.getState(actor3D);
        visualsCol.appendChild(actor3D);
        visualsCol.classList.remove('is-exiting');

        Flip.from(state, {
            duration: 0.8,
            ease: 'power2.out',
            scale: true,
            onComplete: () => {
                console.log(`[DEBUG at ${Date.now()}] 3. Flip onComplete HAS BEEN CALLED.`);
                
                console.log("[DEBUG] 4. About to run clearProps. Current transform:", actor3D.style.transform);
                gsap.set(actor3D, { clearProps: "transform" });
                console.log("[DEBUG] 5. AFTER clearProps. Current transform:", actor3D.style.transform);

                console.log("[DEBUG] 6. About to seek timeline to 'finalState'.");
                tl.seek('finalState');
                console.log("[DEBUG] 7. Timeline has been seeked.");

                console.log("[DEBUG] 8. About to re-enable main scrub.");
                mainScrub.enable();
                console.log("[DEBUG] 9. Main scrub has been enabled. END OF SEQUENCE.");
                console.log("========================================");
            }
        });
    }
});
