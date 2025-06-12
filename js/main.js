// main.js

document.addEventListener('DOMContentLoaded', function () {
    // --- Your Menu & Footer code remains untouched ---
    const openButton = document.getElementById('menu-open-button');
    const closeButton = document.getElementById('menu-close-button');
    const menuScreen = document.getElementById('menu-screen');
    const htmlElement = document.documentElement;
    const body = document.body;

    function openMenu() {
        htmlElement.classList.add('menu-open');
        body.classList.add('menu-open');
        menuScreen.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
        htmlElement.classList.remove('menu-open');
        body.classList.remove('menu-open');
        menuScreen.setAttribute('aria-hidden', 'true');
    }

    if (openButton && closeButton && menuScreen) {
        openButton.addEventListener('click', openMenu);
        closeButton.addEventListener('click', closeMenu);
    }

    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // =========================================================================
    // 3D SCROLLYTELLING - V7: THE SCENE-TRIGGERED ARCHITECTURE
    // =========================================================================

    // Register GSAP plugins. Flip is for the bonus "exit" animation.
    gsap.registerPlugin(ScrollTrigger, Flip);

    ScrollTrigger.matchMedia({

        "(min-width: 769px)": function () {

            // --- 1. SETUP & SELECTORS ---
            const visualsCol = document.querySelector(".pillar-visuals-col");
            const actor3D = document.getElementById("actor-3d");
            const textPillars = gsap.utils.toArray('.pillar-text-content');
            const summaryThumbnail = document.querySelector(".summary-thumbnail-placeholder");

            // Hide all text pillars initially, we'll control their visibility.
            gsap.set(textPillars, { autoAlpha: 0 });

            // --- 2. PIN THE VISUALS "STAGE" ---
            // We create a standalone ScrollTrigger just for pinning. This is clean and simple.
            // It pins the visuals column for the entire height of the text column.
            ScrollTrigger.create({
                trigger: ".pillar-text-col",
                pin: visualsCol,
                start: "top top",
                end: "bottom bottom", // Pin for the full duration
                // markers: {startColor: "blue", endColor: "blue"}, // Optional: markers for the pin
            });

            // --- 3. SCENE-BASED ANIMATIONS (The Core Logic) ---
            // We loop through each text pillar and create a dedicated animation for it.
            textPillars.forEach((pillar, i) => {
                
                let pillarTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: pillar,
                        start: "top center+=10%", // When the pillar's top hits the center
                        end: "bottom center-=10%",  // When the pillar's bottom leaves the center
                        scrub: 1,
                        // markers: true, // Use markers on individual triggers for fine-tuning
                        
                        // This is the magic for fading text in and out!
                        onEnter: () => gsap.to(pillar, { autoAlpha: 1, duration: 0.5 }),
                        onLeave: () => gsap.to(pillar, { autoAlpha: 0, duration: 0.5 }),
                        onEnterBack: () => gsap.to(pillar, { autoAlpha: 1, duration: 0.5 }),
                        onLeaveBack: () => gsap.to(pillar, { autoAlpha: 0, duration: 0.5 }),
                    }
                });

                // Now, add the 3D cube animation to this pillar's timeline.
                // We check the index 'i' to determine which animation to run.
                if (i === 0) { // Pillar 1 (Diagnosis)
                    pillarTimeline.to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.1, ease: "power2.inOut" });
                } else if (i === 1) { // Pillar 2 (Conversation)
                    pillarTimeline.to(actor3D, { rotationY: -120, rotationX: -20, scale: 1.2, ease: "power2.inOut" });
                } else if (i === 2) { // Pillar 3 (Evolution)
                    pillarTimeline.to(actor3D, { rotationY: 0, rotationX: 0, scale: 1, ease: "power3.inOut" });
                }
            });
            
            // --- 4. THE "IGLOO" EXIT ANIMATION (BONUS POLISH) ---
            // This animates the 3D cube from its pinned position into the
            // final summary section's placeholder. This requires the Flip Plugin.
            ScrollTrigger.create({
                trigger: summaryThumbnail,
                start: "top 80%", // Start the exit animation a bit before the summary section
                // markers: {startColor: "red", endColor: "red"},
                onEnter: () => {
                    // Get the initial state of the 3D actor
                    const state = Flip.getState(actor3D, {props: "scale,opacity"});
                    
                    // Move the actor to the thumbnail placeholder in the DOM
                    summaryThumbnail.appendChild(actor3D);
                    
                    // Animate from the initial state to the new state
                    Flip.from(state, {
                        duration: 1.2,
                        ease: "power2.inOut",
                        scale: true, // Ensure scale is animated
                        onStart: () => {
                            // Hide the original visuals column so there's no "ghost" image
                            visualsCol.classList.add('is-exiting'); 
                        },
                        onComplete: () => {
                            // After the flip, maybe you want to unpin the main visuals column
                            // For simplicity, we just leave it hidden. But this is where you'd clean up.
                        }
                    });
                }
            });
        },

        "(max-width: 768px)": function () {
            // For mobile, we just ensure the text pillars are visible
            // since there are no complex animations. GSAP automatically
            // cleans up the desktop animations when resizing.
            gsap.set('.pillar-text-content', { autoAlpha: 1 });
        }
    });
});
