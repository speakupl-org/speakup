/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v28.0 - "The Zero Point" Protocol
   
   This is the definitive, forensically-instrumented architecture. It achieves the
   "magical" crystallization by abandoning pre-animation and adopting a flawless
   "Capture > Teleport > Animate" sequence. The mission is done.
========================================================================================
*/

/**
 * Our new forensic logging tool. Reports the precise state of an element.
 * @param {HTMLElement} el The element to inspect.
 * @param {string} label A label for the console log.
 */
function logElementState(el, label) {
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    console.log(
        `%c[STATE LOG: ${label}]`, 'color: #D81B60; font-weight: bold;',
        `\n  - Parent: <${el.parentElement.tagName.toLowerCase()} class="${el.parentElement.className}">`,
        `\n  - Position: { top: ${rect.top.toFixed(0)}, left: ${rect.left.toFixed(0)} }`,
        `\n  - Size: { width: ${rect.width.toFixed(0)}, height: ${rect.height.toFixed(0)} }`,
        `\n  - Transform: ${style.transform}`
    );
}


function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cGSAP Covenant Build v28.0 Initialized. [ZERO POINT]', 'color: #88C0D0; font-weight: bold; font-size: 14px;');

    const ctx = gsap.context(() => {
        const elements = { /* Element selections... */
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

        const hud = { /* HUD elements... */
            state: document.getElementById('c-state'), isLanded: document.getElementById('c-landed'),
            parent: document.getElementById('c-parent'),
            rotX: document.getElementById('c-rot-x'), rotY: document.getElementById('c-rot-y'),
            scale: document.getElementById('c-scale'), tlProg: document.getElementById('c-tl-prog'),
        };
        let isLanded = false;
        hud.isLanded.textContent = "false"; hud.state.textContent = "Standby";

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                hud.state.textContent = "In Scroller";
                
                // --- PRECISE & IMMUTABLE TIMELINE ---
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.textCol, pin: elements.visualsCol, start: 'top top',
                        end: `bottom bottom-=${window.innerHeight / 2}`, scrub: 0.8,
                    },
                    onUpdate: function() { /* Live HUD Monitoring */
                        hud.tlProg.textContent = this.progress().toFixed(3);
                        hud.rotX.textContent = gsap.getProperty(elements.actor3D, "rotationX").toFixed(1);
                        hud.rotY.textContent = gsap.getProperty(elements.actor3D, "rotationY").toFixed(1);
                        hud.scale.textContent = gsap.getProperty(elements.actor3D, "scale").toFixed(2);
                        hud.parent.textContent = elements.actor3D.parentElement.className.split(" ")[0];
                    }
                });
                tl.to(elements.actor3D, { rotationY: 20, rotationX: -15, scale: 1.05, duration: 1 })
                  .to(elements.textPillars[0], { autoAlpha: 0, y: -20, duration: 0.3 }, "+=1")
                  .to(elements.actor3D, { rotationY: 120, rotationX: 10, scale: 1.1, duration: 1 }, "<")
                  .fromTo(elements.textPillars[1], { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.2")
                  .to(elements.textPillars[1], { autoAlpha: 0, y: -20, duration: 0.3 }, "+=1.2")
                  .to(elements.actor3D, { rotationY: -120, rotationX: -20, scale: 1.2, duration: 1 }, "<")
                  .fromTo(elements.textPillars[2], { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.2")
                  .addLabel("finalState"); // We use this label for the reverse journey.
                
                console.log("Immutable scrollytelling timeline has been forged.");

                // --- THE ZERO POINT TRIGGER ---
                ScrollTrigger.create({
                    trigger: elements.handoffPoint, start: 'top center',
                    onEnter: () => {
                        if (isLanded) return;
                        isLanded = true;
                        hud.isLanded.textContent = "true"; hud.state.textContent = "CRYSTALLIZING";
                        console.group('%c[CRYSTALLIZATION] PROTOCOL INITIATED', 'color: #A3BE8C; font-weight:bold;');

                        // STEP 1: CAPTURE STATE before any changes.
                        logElementState(elements.actor3D, "1. Pre-Handoff");
                        const state = Flip.getState(elements.actor3D);
                        
                        // STEP 2: TELEPORT & CLASS CHANGE. This is the "blip" we are animating over.
                        elements.summaryClipper.appendChild(elements.actor3D);
                        elements.actor3D.classList.add("is-logo");
                        logElementState(elements.actor3D, "2. Post-Teleport (Final State)");

                        // STEP 3: ANIMATE. From the captured state to the new, teleported state.
                        console.log("3. Initiating Flip.from() animation...");
                        Flip.from(state, {
                            duration: 0.8, ease: "power2.inOut",
                            // This ensures the 3D rotation resolves to a flat 2D state during the animation.
                            rotationX: 0, rotationY: 0,
                            onComplete: () => {
                                hud.state.textContent = "LANDED";
                                console.log("4. Crystallization complete.");
                                console.groupEnd();
                            }
                        });
                    },
                    onLeaveBack: () => {
                        if (!isLanded) return;
                        isLanded = false;
                        hud.isLanded.textContent = "false"; hud.state.textContent = "DE-CRYSTALLIZING";
                        console.group('%c[DE-CRYSTALLIZATION] REBIRTH INITIATED', 'color: #EBCB8B; font-weight:bold;');

                        // STEP 1: CAPTURE the flat "logo" state.
                        logElementState(elements.actor3D, "1. Pre-Rebirth (Logo State)");
                        const state = Flip.getState(elements.actor3D);

                        // STEP 2: TELEPORT & REVERT CLASS.
                        elements.scene3D.appendChild(elements.actor3D);
                        elements.actor3D.classList.remove("is-logo");
                        
                        // Set the final transform state EXACTLY as it should be at the end of the timeline
                        const finalRotation = tl.getTweensOf(elements.actor3D)[2].vars;
                        gsap.set(elements.actor3D, { 
                            rotationX: finalRotation.rotationX, 
                            rotationY: finalRotation.rotationY, 
                            scale: finalRotation.scale 
                        });
                        logElementState(elements.actor3D, "2. Post-Rebirth (Final 3D State)");

                        // STEP 3: ANIMATE from the logo state back to its restored 3D state.
                        console.log("3. Initiating Flip.from() animation...");
                        Flip.from(state, {
                            duration: 0.8, ease: "power2.out", scale: true,
                            onComplete: () => {
                                hud.state.textContent = "In Scroller";
                                console.log("4. De-crystallization complete.");
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
