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

    // --- The Robust Animation Setup Function ---
    // We wrap ALL our GSAP logic in a single function.
    function setupAnimations() {
        
        // Register the plugins now that we know they exist.
        gsap.registerPlugin(ScrollTrigger, Flip);

        ScrollTrigger.matchMedia({

            "(min-width: 769px)": function () {

                // --- 1. SELECTORS & REFERENCES (The Robust Way) ---
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
            scrub: 1.5, // <-- KNOB 1: Increased for a more buttery feel
            // ... onEnter/onLeave callbacks remain the same
        }
    });
    
    // KNOB 2: Let's use a more pronounced ease for a premium feel
    if (i === 0) {
        pillarTimeline.to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.1, ease: "power3.inOut" });
    } else if (i === 1) {
        pillarTimeline.to(actor3D, { rotationY: -120, rotationX: -20, scale: 1.2, ease: "power3.inOut" });
    } else if (i === 2) {
        pillarTimeline.to(actor3D, { rotationY: 0, rotationX: 0, scale: 1, ease: "expo.inOut" }); // <-- Dramatic final ease
    }
});
                
                // --- 4. THE "IGLOO" EXIT/RETURN ANIMATION (Fully Robust) ---
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
                                ease: "power2.inOut",
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
                            // In the Flip.from(...) calls for both onEnter and onLeaveBack:
Flip.from(state, {
    duration: 1.2,
    ease: "expo.inOut", // <-- Use a matching or complementary ease
    scale: true,
    // ...
});
                            });
                        }
                    }
                });
            },

            "(max-width: 768px)": function () {
                gsap.set('.pillar-text-content', { autoAlpha: 1 });
            }
        });
    } // End of setupAnimations function

    // --- THE "READY CHECK" ---
    // This is the most important part. We check if the main GSAP plugins
    // have loaded and attached themselves to the window.
    // We'll give it a couple of tries in case there's a slight delay.
    
    function initialCheck() {
        if (window.gsap && window.ScrollTrigger && window.Flip) {
            // All scripts are loaded and ready, let's set up the animations!
            setupAnimations();
        } else {
            // One or more scripts are not ready yet. Let's wait a tiny bit and check again.
            // This is a simple but effective fallback for slow network conditions.
            setTimeout(initialCheck, 100);
        }
    }
    
    // Start the first check.
    initialCheck();

}); // End of DOMContentLoaded
