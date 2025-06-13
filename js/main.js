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

            // --- 1. SELECTORS & REFERENCES (The Robust Way) ---
            // Find all our "actors" on the page ONCE and store them in variables.
            const visualsCol = document.querySelector(".pillar-visuals-col");
            const actor3D = document.getElementById("actor-3d");
            const textPillars = gsap.utils.toArray('.pillar-text-content');
            const summaryContainer = document.querySelector(".method-summary");
            const summaryClipper = document.querySelector(".summary-thumbnail-clipper");

            // Safety Check: If any critical element isn't found, stop here to avoid errors.
            if (!visualsCol || !actor3D || !summaryContainer || !summaryClipper) {
                console.error("Scrollytelling elements not found. Aborting animation setup.");
                return; 
            }

            // Hide text pillars to start.
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
                        scrub: 1,
                        onEnter: () => gsap.to(pillar, { autoAlpha: 1, duration: 0.5 }),
                        onLeave: () => gsap.to(pillar, { autoAlpha: 0, duration: 0.5 }),
                        onEnterBack: () => gsap.to(pillar, { autoAlpha: 1, duration: 0.5 }),
                        onLeaveBack: () => gsap.to(pillar, { autoAlpha: 0, duration: 0.5 }),
                    }
                });
                
                if (i === 0) {
                    pillarTimeline.to(actor3D, { rotationY: 120, rotationX: 10, scale: 1.1, ease: "power2.inOut" });
                } else if (i === 1) {
                    pillarTimeline.to(actor3D, { rotationY: -120, rotationX: -20, scale: 1.2, ease: "power2.inOut" });
                } else if (i === 2) {
                    pillarTimeline.to(actor3D, { rotationY: 0, rotationX: 0, scale: 1, ease: "power3.inOut" });
                }
            });
            

            // --- 4. THE "IGLOO" EXIT/RETURN ANIMATION (Fully Robust) ---
            let isFlipped = false; 

            ScrollTrigger.create({
                trigger: summaryContainer, // Using the whole summary section as the trigger
                start: "top center",       // Trigger when the section reaches the middle
                
                onEnter: () => {
                    if (!isFlipped) {
                        isFlipped = true;
                        const state = Flip.getState(actor3D, {props: "scale,opacity"});
                        
                        // USE THE VARIABLE, not a new querySelector!
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
                        
                        // USE THE VARIABLE!
                        visualsCol.appendChild(actor3D);
                        
                        Flip.from(state, {
                            duration: 1.2,
                            ease: "power2.inOut",
                            scale: true,
                            onStart: () => {
                                visualsCol.classList.remove('is-exiting');
                            }
                        });
                    }
                }
            });
        },

        "(max-width: 768px)": function () {
            gsap.set('.pillar-text-content', { autoAlpha: 1 });
       
