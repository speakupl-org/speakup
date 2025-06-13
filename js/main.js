// main.js - This is the final, working desktop function.

"(min-width: 769px)": function () {

    // --- 1. SELECTORS & REFERENCES ---
    const visualsCol = document.querySelector(".pillar-visuals-col");
    const actor3D = document.getElementById("actor-3d");
    const textPillars = gsap.utils.toArray('.pillar-text-content');
    const summaryContainer = document.querySelector(".method-summary");
    const summaryClipper = document.querySelector(".summary-thumbnail-clipper");

    if (!visualsCol || !actor3D || !summaryContainer || !summaryClipper) {
        console.error("Scrollytelling elements not found. Aborting animation setup.");
        return; 
    }

    gsap.set(textPillars, { autoAlpha: 0 });

    // --- 2. PIN THE VISUALS "STAGE" ---
    ScrollTrigger.create({
        trigger: ".pillar-text-col",
        pin: visualsCol,
        start: "top top",
        end: "bottom bottom"
    });

    // --- 3. SCENE-BASED ANIMATIONS ---
    textPillars.forEach((pillar, i) => {
        let pillarTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: pillar,
                start: "top center+=10%",
                end: "bottom center-=10%",
                scrub: 1.5,
                onEnter: () => gsap.to(pillar, { autoAlpha: 1, duration: 0.5 }),
                onLeave: () => gsap.to(pillar, { autoAlpha: 0, duration: 0.5 }),
                onEnterBack: () => gsap.to(pillar, { autoAlpha: 1, duration: 0.5 }),
                onLeaveBack: () => gsap.to(pillar, { autoAlpha: 0, duration: 0.5 }),
            }
        });
        
        if (i === 0) {
            pillarTimeline.to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.1, ease: "power3.inOut" });
        } else if (i === 1) {
            pillarTimeline.to(actor3D, { rotationY: -120, rotationX: -20, scale: 1.2, ease: "power3.inOut" });
        } else if (i === 2) {
            pillarTimeline.to(actor3D, { rotationY: 0, rotationX: 0, scale: 1, ease: "expo.inOut" });
        }
    });
    
    // --- 4. THE "IGLOO" EXIT/RETURN ANIMATION ---
    let isFlipped = false; 

    ScrollTrigger.create({
        trigger: summaryContainer,
        start: "top center",
        onEnter: () => {
            if (!isFlipped) {
                isFlipped = true;
                const state = Flip.getState(actor3D, {props: "scale,opacity"});
                summaryClipper.appendChild(actor3D); 
                Flip.from(state, {
                    duration: 1.2,
                    ease: "expo.inOut",
                    scale: true,
                    onStart: () => {
                        visualsCol.classList.add('is-exiting'); 
                    }
                });
            }
        },
        onLeaveBack: () => {
            if (isFlipped) {
                isFlipped = false;
                const state = Flip.getState(actor3D, {props: "scale,opacity"});
                visualsCol.appendChild(actor3D);
                
                // THE SYNTAX ERROR WAS HERE. THIS IS NOW CORRECT.
                Flip.from(state, {
                    duration: 1.2,
                    ease: "expo.inOut",
                    scale: true,
                    onStart: () => {
                        visualsCol.classList.remove('is-exiting');
                    }
                });
            }
        }
    });
},
