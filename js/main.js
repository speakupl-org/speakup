/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v29.0 - "The Oracle" Protocol
   
   This is the final, definitive, and forensically-instrumented architecture.
   It answers the demand for total transparency. The console is now The Oracle.
   Every action is logged. Every state is verified. Every transform is explicit.
   The mission is done.
========================================================================================
*/

/**
 * THE ORACLE: Our forensic logging tool on steroids.
 * Reports a complete profile of an element's state at a given moment.
 */
function logElementState(el, label) {
    if (!el) {
        console.error(`[ORACLE LOG: ${label}] ERROR - Element is null.`);
        return;
    }
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    console.log(
        `%c[ORACLE LOG: ${label}]`, 'color: #D81B60; font-weight: bold;',
        `\n  - Parent: <${el.parentElement.tagName.toLowerCase()} class="${el.parentElement.className}">`,
        `\n  - Size: { W: ${rect.width.toFixed(0)}, H: ${rect.height.toFixed(0)} }`,
        `\n  - Transform: ${style.transform}`,
        `\n  - Transform Origin: ${style.transformOrigin}`,
        `\n  - Opacity: ${style.opacity}`,
        `\n  - Visibility: ${style.visibility}`
    );
}

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cGSAP Covenant Build v29.0 Initialized. [THE ORACLE]', 'color: #88C0D0; font-weight: bold; font-size: 14px;');

    const ctx = gsap.context(() => {
        const elements = {
            actor3D: document.getElementById('actor-3d'),
            scene3D: document.querySelector('.scene-3d'),
            summaryClipper: document.querySelector('.summary-thumbnail-clipper'),
            textPillars: gsap.utils.toArray('.pillar-text-content'),
            visualsCol: document.querySelector('.pillar-visuals-col'),
            textCol: document.querySelector('.pillar-text-col'),
            handoffPoint: document.getElementById('handoff-point')
        };
        if (Object.values(elements).some(el => !el || (Array.isArray(el) && el.length === 0))) {
            console.error('ORACLE ABORT: Critical elements missing.'); return;
        }
        console.log("Oracle reports all critical elements located and verified.");

        const hud = {
            state: document.getElementById('c-state'), event: document.getElementById('c-event'),
            isLanded: document.getElementById('c-landed'), parent: document.getElementById('c-parent'),
            viz: document.getElementById('c-viz'), tlProg: document.getElementById('c-tl-prog'),
            rotY: document.getElementById('c-rot-y'), scale: document.getElementById('c-scale'),
            origin: document.getElementById('c-origin')
        };
        let isLanded = false;
        hud.isLanded.textContent = "false"; hud.state.textContent = "Standby";

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                hud.state.textContent = "In Scroller";
                
                // --- TIMELINE WITH HIGH-FREQUENCY REPORTING ---
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.textCol, pin: elements.visualsCol, start: 'top top',
                        end: `bottom bottom-=${window.innerHeight / 2}`, scrub: 0.8,
                        onUpdate: (self) => { // High-frequency reporting on every scroll frame
                            console.log(`SCROLLY UPDATE: Progress=${self.progress.toFixed(3)}, Direction=${self.direction}`);
                            logElementState(elements.actor3D, 'Live Scrub');
                        }
                    },
                    onUpdate: function() { /* Live HUD Monitoring */
                        hud.tlProg.textContent = this.progress().toFixed(2);
                        const current = gsap.getProperty(elements.actor3D);
                        hud.rotY.textContent = current("rotationY").toFixed(1);
                        hud.scale.textContent = current("scale").toFixed(2);
                        hud.parent.textContent = elements.actor3D.parentElement.className.split(" ")[0];
                        hud.viz.textContent = gsap.getProperty(elements.actor3D, "visibility");
                        hud.origin.textContent = gsap.getProperty(elements.actor3D, "transformOrigin");
                    }
                });
                tl.to(elements.actor3D, { rotationY: 20, rotationX: -15, scale: 1.05, duration: 1 })
                  .to(elements.textPillars[0], { autoAlpha: 0, y: -20, duration: 0.3 }, "+=1")
                  .to(elements.actor3D, { rotationY: 120, rotationX: 10, scale: 1.1, duration: 1 }, "<")
                  .fromTo(elements.textPillars[1], { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.2")
                  .to(elements.textPillars[1], { autoAlpha: 0, y: -20, duration: 0.3 }, "+=1.2")
                  .to(elements.actor3D, { rotationY: -120, rotationX: -20, scale: 1.2, duration: 1 }, "<")
                  .fromTo(elements.textPillars[2], { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.2");
                
                console.log("Oracle reports immutable timeline has been forged.");

                // --- THE ORACLE TRIGGER ---
                ScrollTrigger.create({
                    trigger: elements.handoffPoint, start: 'top center',
                    onEnter: () => {
                        if (isLanded) return;
                        isLanded = true;
                        hud.isLanded.textContent = "true"; hud.state.textContent = "CRYSTALLIZING"; hud.event.textContent = "Handoff";
                        console.group('%c[CRYSTALLIZATION]', 'color: #A3BE8C; font-weight:bold;');
                        
                        logElementState(elements.actor3D, "1. State BEFORE Handoff");
                        const state = Flip.getState(elements.actor3D, { props: "transform,opacity,filter" });
                        
                        // Explicitly set origin before teleporting to solve "giant logo" issue
                        gsap.set(elements.actor3D, { transformOrigin: "50% 50%" });
                        elements.summaryClipper.appendChild(elements.actor3D);
                        elements.actor3D.classList.add("is-logo");
                        
                        logElementState(elements.actor3D, "2. State AFTER Teleport (Final Target)");
                        console.log("3. Initiating Flip.from() animation...");
                        Flip.from(state, {
                            duration: 0.8, ease: "power2.inOut", absolute: true, scale: true,
                            onComplete: () => {
                                hud.state.textContent = "LANDED";
                                console.log("4. Crystallization complete.");
                                logElementState(elements.actor3D, "5. Final Landed State");
                                console.groupEnd();
                            }
                        });
                    },
                    onLeaveBack: () => {
                        if (!isLanded) return;
                        isLanded = false;
                        hud.isLanded.textContent = "false"; hud.state.textContent = "DE-CRYSTALLIZING"; hud.event.textContent = "Rebirth";
                        console.group('%c[DE-CRYSTALLIZATION]', 'color: #EBCB8B; font-weight:bold;');

                        logElementState(elements.actor3D, "1. State BEFORE Rebirth (Logo State)");
                        const state = Flip.getState(elements.actor3D, { props: "transform,opacity,filter" });

                        elements.scene3D.appendChild(elements.actor3D);
                        elements.actor3D.classList.remove("is-logo");
                        // Brute-force the transform origin back to what the 3D scene expects
                        gsap.set(elements.actor3D, { transformOrigin: "50% 50% 0px" });
                        
                        logElementState(elements.actor3D, "2. State AFTER Re-Teleport (Final Target)");
                        console.log("3. Initiating Flip.from() animation...");
                        Flip.from(state, {
                            duration: 0.8, ease: "power2.out", absolute: true, scale: true,
                            onComplete: () => {
                                hud.state.textContent = "In Scroller";
                                console.log("4. De-crystallization complete.");
                                logElementState(elements.actor3D, "5. Final Reborn State");
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
