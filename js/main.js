document.addEventListener('DOMContentLoaded', function() {

    // --- Menu Toggle and Footer Code (Unchanged) ---
    // This section should remain as it is. It handles the mobile menu and footer year.
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
    // 3D SCROLLYTELLING - PHASE 2: THE CHOREOGRAPHY
    // =========================================================================

    // Register GSAP plugins. This is essential.
    gsap.registerPlugin(ScrollTrigger);

    // Use matchMedia for responsive animations. This setup only runs on desktop.
    ScrollTrigger.matchMedia({

        "(min-width: 769px)": function() {

            // --- 1. SETUP SELECTORS ---
            const actor3D = document.getElementById("actor-3d"); // Our 3D cube
            const textSections = gsap.utils.toArray('.pillar-text-content');
            
            // It's good practice to set initial visual states with GSAP
            // This prevents flashes of unstyled content and sets a known starting point.
            gsap.set(actor3D, { rotationX: -10, rotationY: 20, autoAlpha: 1 });
            
            // --- 2. CREATE THE MASTER TIMELINE ---
            // This single timeline will control the entire animation sequence.
            const masterTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: ".scrolly-container", // The element that triggers the whole sequence
                    start: "top top",              // The animation starts when the top of the trigger hits the top of the viewport
                    end: "+=6000",                 // Creates a 6000px long "scroll reel" for our animation to play out
                    scrub: 1.5,                    // Smoothly links animation progress to scroll (1.5s catch-up time)
                    pin: ".pillar-visuals-col",    // Pins the visuals column during the animation
                    pinSpacing: true,              // Creates the "fake" scroll space to prevent content jumps
                    // markers: true,              // UNCOMMENT FOR DEBUGGING: Shows visual start/end markers
                }
            });

            // --- 3. BUILD THE ANIMATION SEQUENCE - ACT BY ACT ---

            // --- Act I: Diagnosis ---
            // The story begins. The text appears, and the cube starts its first major rotation.
            masterTimeline
                .addLabel("act1_start") // Create a label to mark the beginning of Act 1
                .from(textSections[0].querySelectorAll(".pillar-number, .pillar-title, .pillar-paragraph"), { 
                    autoAlpha: 0, 
                    y: 50, 
                    stagger: 0.1, 
                    duration: 1 
                }, "act1_start")
                // While the text comes in, the cube begins a slow, deliberate rotation
                .to(actor3D, { 
                    rotationY: 120, 
                    rotationX: 10, 
                    scale: 1.2, 
                    duration: 2, 
                    ease: "power2.inOut" 
                }, "act1_start")
                .to({}, { duration: 1.5 }); // Add a 1.5 "second" pause (in scroll time) for the user to read


            // --- Act II: Dialogue ---
            // Fade out the first text, transition the cube to a new state, and bring in the second text.
            masterTimeline
                .addLabel("act2_start")
                .to(textSections[0].querySelectorAll(".pillar-number, .pillar-title, .pillar-paragraph"), { 
                    autoAlpha: 0, 
                    y: -50, 
                    stagger: 0.1, 
                    duration: 1 
                }, "act2_start")
                // The cube now rotates to a different orientation, representing a shift in perspective.
                .to(actor3D, { 
                    rotationY: -120, 
                    rotationX: -20, 
                    scale: 1, 
                    duration: 2, 
                    ease: "power2.inOut" 
                }, "act2_start")
                .from(textSections[1].querySelectorAll(".pillar-number, .pillar-title, .pillar-paragraph"), { 
                    autoAlpha: 0, 
                    y: 50, 
                    stagger: 0.1, 
                    duration: 1 
                }, "act2_start+=1") // Stagger this animation to start 1 "second" after Act 2 begins
                .to({}, { duration: 1.5 }); // Another reading pause


            // --- Act III: Evolution ---
            // Fade out the second text, transition the cube to its final "hero" state, and reveal the final text.
            masterTimeline
                .addLabel("act3_start")
                .to(textSections[1].querySelectorAll(".pillar-number, .pillar-title, .pillar-paragraph"), { 
                    autoAlpha: 0, 
                    y: -50, 
                    stagger: 0.1, 
                    duration: 1 
                }, "act3_start")
                // The cube resolves to a clear, front-facing position, symbolizing clarity and achievement.
                .to(actor3D, { 
                    rotationY: 0, 
                    rotationX: 0, 
                    scale: 1.1, 
                    duration: 2, 
                    ease: "power3.inOut" 
                }, "act3_start")
                .from(textSections[2].querySelectorAll(".pillar-number, .pillar-title, .pillar-paragraph"), { 
                    autoAlpha: 0, 
                    y: 50, 
                    stagger: 0.1, 
                    duration: 1 
                }, "act3_start+=1")
                .to({}, { duration: 2 }); // A longer final pause to let the final message sink in.
        },

        "(max-width: 768px)": function() {
            // --- MOBILE FALLBACK ---
            // On smaller screens, the complex pinning animation is disabled for better performance
            // and user experience. The content will just stack and scroll normally.
            // No JavaScript is needed here for now; CSS will handle the layout.
        }

    }); // End of ScrollTrigger.matchMedia

}); // End of DOMContentLoaded
