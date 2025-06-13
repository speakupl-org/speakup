/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v27.0 - "The Trinity Protocol"
   
   This is the final, definitive, and forensically-instrumented architecture.
   It achieves the "magical" crystallization by introducing Explicit State
   Neutralization, ensuring a flawless and perfectly flat logo transformation.
   The mission is done.
========================================================================================
*/

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cGSAP Covenant Build v27.0 Initialized. [TRINITY]', 'color: #88C0D0; font-weight: bold; font-size: 14px;');

    const ctx = gsap.context(() => {
        const elements = { // All elements robustly selected
            actor3D: document.getElementById('actor-3d'),
            scene3D: document.querySelector('.scene-3d'),
            summaryClipper: document.querySelector('.summary-thumbnail-clipper'),
            textPillars: gsap.utils.toArray('.pillar-text-content'),
            visualsCol: document.querySelector('.pillar-visuals-col'),
            textCol: document.querySelector('.pillar-text-col'),
            handoffPoint: document.getElementById('handoff-point')
        };
        if (Object.values(elements).some(el => !el || (Array.isArray(el) && el.length === 0))) {
            console.error('COVENANT ABORTED: Critical elements missing.'); return;
        }
        console.log("All critical elements located and verified.");

        const hud = { // Full Trinity HUD
            state: document.getElementById('c-state'), isLanded: document.getElementById('c-landed'),
            parent: document.getElementById('c-parent'), actorClass: document.getElementById('c-class'),
            rotX: document.getElementById('c-rot-x'), rotY: document.getElementById('c-rot-y'),
            scale: document.getElementById('c-scale'), tlProg: document.getElementById('c-tl-prog'),
        };
        let isLanded = false; // The single source of truth
        hud.isLanded.textContent = "false"; hud.state.textContent = "Standby";

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                hud.state.textContent = "In Scroller";
                
                // --- SURGICALLY-PRECISE TIMELINE ---
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.textCol, pin: elements.visualsCol, start: 'top top',
                        end: `bottom bottom-=${window.innerHeight / 2}`, scrub: 0.8,
                    },
                    onUpdate: function() { // Live Forensic Monitoring
                        hud.tlProg.textContent = this.progress().toFixed(3);
                        hud.rotX.textContent = gsap.getProperty(elements.actor3D, "rotationX").toFixed(1);
                        hud.rotY.textContent = gsap.getProperty(elements.actor3D, "rotationY").toFixed(1);
                        hud.scale.textContent = gsap.getProperty(elements.actor3D, "scale").toFixed(2);
                        hud.parent.textContent = elements.actor3D.parentElement.className.split(" ")[0];
                        hud.actorClass.textContent = elements.actor3D.className.split(" ")[1] || "none";
                    }
                });

                // --- The PERFECTED sequence for flawless text/cube sync ---
                tl.to(elements.actor3D, { rotationY: 20, rotationX: -15, scale: 1.05, duration: 1 })
                  .to(elements.textPillars[0], { autoAlpha: 0, y: -20, duration: 0.3 }, "+=1")
                  .to(elements.actor3D, { rotationY: 120, rotationX: 10, scale: 1.1, duration: 1 }, "<")
                  .fromTo(elements.textPillars[1], { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.2")
                  .to(elements.textPillars[1], { autoAlpha: 0, y: -20, duration: 0.3 }, "+=1.2")
                  .to(elements.actor3D, { rotationY: -120, rotationX: -20, scale: 1.2, duration: 1 }, "<")
                  .fromTo(elements.textPillars[2], { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.2");

                console.log("Immutable scrollytelling timeline has been forged.");

                // --- THE TRINITY PROTOCOL TRIGGER ---
                ScrollTrigger.create({
                    trigger: elements.handoffPoint, start: 'top center',
                    onEnter: () => {
                        if (isLanded) return;
                        isLanded = true;
                        hud.isLanded.textContent = "true"; hud.state.textContent = "CRYSTALLIZING";
                        console.group('%c[CRYSTALLIZATION] PROTOCOL INITIATED', 'color: #A3BE8C; font-weight:bold;');

                        // 1. NEUTRALIZE STATE: Tween rotation to 0 to ensure a flat starting point.
                        console.log("1. NEUTRALIZING: Tweening cube rotation to 0 for a flat state.");
                        gsap.to(elements.actor3D, { 
                            rotationX: 0, rotationY: 0, duration: 0.3, ease: 'power1.in',
                            onComplete: () => {
                                console.log("   - Neutralization complete.");
                                // 2. CAPTURE the now-neutralized state
                                const state = Flip.getState(elements.actor3D);
                                console.log("2. Captured neutralized state of Actor.");
                                
                                // 3. TELEPORT & APPLY CLASS for the final state
                                elements.summaryClipper.appendChild(elements.actor3D);
                                elements.actor3D.classList.add("is-logo");
                                console.log("3. Teleported Actor and applied '.is-logo' class.");
                                
                                // 4. FLIP from the captured state to the final logo state
                                Flip.from(state, {
                                    duration: 0.7, ease: "power2.inOut", scale: true,
                                    onComplete: () => {
                                        hud.state.textContent = "LANDED";
                                        console.log("4. Crystallization complete. Hero has become the logo.");
                                        console.groupEnd();
                                    }
                                });
                            }
                        });
                    },
                    onLeaveBack: () => {
                        if (!isLanded) return;
                        isLanded = false;
                        hud.isLanded.textContent = "false"; hud.state.textContent = "DE-CRYSTALLIZING";
                        console.group('%c[DE-CRYSTALLIZATION] REBIRTH INITIATED', 'color: #EBCB8B; font-weight:bold;');
                        
                        // 1. CAPTURE the flat "logo" state
                        const state = Flip.getState(elements.actor3D);
                        console.log("1. Captured 'logo' state of Actor.");

                        // 2. REVERT actor to its original container & remove class
                        elements.scene3D.appendChild(elements.actor3D);
                        elements.actor3D.classList.remove("is-logo");
                        console.log("2. Teleported Actor back and removed '.is-logo' class.");
                        
                        // 3. FLIP from the "logo" state back to its un-rotated 3D cube form
                        console.log("3. Flipping Actor FROM 'logo' state back to 3D cube state...");
                        Flip.from(state, {
                            duration: 0.7, ease: "power2.out", scale: true,
                            onComplete: () => {
                                // 4. RESTORE ROTATION MANUALLY for perfect control
                                console.log("4. Re-applying final timeline rotation state manually.");
                                gsap.to(elements.actor3D, {
                                    rotationY: -120, rotationX: -20, duration: 0.3, ease: 'power1.out'
                                });
                                hud.state.textContent = "In Scroller";
                                console.log("5. De-crystallization complete. Ready for scroll.");
                                console.groupEnd();
                            }
});
                    }
                });
            }
        });
    });
}

// --- Primary Entry Point & Site Logic ---
function initialCheck(){if(window.gsap&&window.ScrollTrigger&&window.Flip){setupAnimations();}else{let i=0,t=setInterval(()=>{if(window.gsap&&window.ScrollTrigger&&window.Flip){clearInterval(t);setupAnimations();}else if(i++>=30){clearInterval(t);console.error("GSAP libs failed to load.");}},100);}}
function setupSiteLogic(){const e=document.getElementById("menu-open-button"),t=document.getElementById("menu-close-button"),n=document.getElementById("menu-screen"),o=document.documentElement;e&&t&&n&&(e.addEventListener("click",()=>{o.classList.add("menu-open")}),t.addEventListener("click",()=>{o.classList.remove("menu-open")}));const c=document.getElementById("current-year");c&&(c.textContent=(new Date).getFullYear())}
document.addEventListener("DOMContentLoaded",()=>{setupSiteLogic();initialCheck();});
