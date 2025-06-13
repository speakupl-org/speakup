// =========================================================================
// main.js - COMPLETE AND FINAL VERSION - 2024-06-13
// =========================================================================

document.addEventListener('DOMContentLoaded', function () {
    
    // --- PART 1: Standard Menu & Footer Logic ---
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

    // --- PART 2: The Animation Setup ---
    // We wrap all our GSAP logic in a function to ensure it runs only when ready.
    function setupAnimations() {
        
        // This is where we safely register the plugins.
        gsap.registerPlugin(ScrollTrigger, Flip);

        // matchMedia is for creating responsive animations.
        ScrollTrigger.matchMedia({

            // --- A) DESKTOP ANIMATIONS ---
            "(min-width: 769px)": function () {

                // 1. SELECTORS & REFERENCES
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

                // 2. PIN THE VISUALS "STAGE"
                ScrollTrigger.create({
                    trigger: ".pillar-text-col",
                    pin: visualsCol,
                    start: "top top",
                    end: "bottom bottom"
                });

                // 3. SCENE-BASED ANIMATIONS
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
                
                // 4. THE "IGLOO" EXIT/RETURN ANIMATION
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

            }, // End of desktop function

            // --- B) MOBILE FALLBACK ---
            "(max-width: 768px)": function () {
                // On mobile, just make sure all the text is visible.
                gsap.set('.pillar-text-content', { autoAlpha: 1 });
            }

        }); // End of matchMedia
    } // End of setupAnimations function

    // --- PART 3: The "Ready Check" ---
    // This ensures we don't run our animation code until all scripts (GSAP, plugins) are loaded.
    function initialCheck() {
        if (window.gsap && window.ScrollTrigger && window.Flip) {
            setupAnimations();
        } else {
            setTimeout(initialCheck, 100);
        }
    }
    
    // Start the whole process.
    initialCheck();

}); // End of DOMContentLoaded
