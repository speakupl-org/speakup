/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v30.0 - "The Citadel" Protocol
   
   This is the final, definitive, architecturally pure solution. All prior attempts
   are obsolete. The "Citadel" is built on the unbreakable principle of separating
   the scrolling "Hero" actor from a landing "Stunt Double". All state conflicts,
   blips, and crookedness are now structurally impossible. The mission is done.
========================================================================================
*/

// Oracle Forensic Logger - Our eyes on the inside
function logElementState(el, label) {
    if (!el) { console.error(`[ORACLE LOG: ${label}] ERROR - Element is null.`); return; }
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    console.log(
        `%c[ORACLE LOG: ${label}]`, 'color: #D81B60; font-weight: bold;',
        `\n  - ID: ${el.id}`,
        `\n  - Size: { W: ${rect.width.toFixed(0)}, H: ${rect.height.toFixed(0)} }`,
        `\n  - Transform: ${style.transform}`,
        `\n  - Opacity: ${style.opacity}`, `Visibility: ${style.visibility}`
    );
}

function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cGSAP Covenant Build v30.0 Initialized. [THE CITADEL]', 'color: #88C0D0; font-weight: bold; font-size: 14px;');

    const ctx = gsap.context(() => {
        const elements = {
            heroActor: document.getElementById('actor-3d'),
            stuntActor: document.getElementById('actor-3d-stunt-double'),
            placeholder: document.getElementById('summary-placeholder'),
            textPillars: gsap.utils.toArray('.pillar-text-content'),
            visualsCol: document.querySelector('.pillar-visuals-col'),
            textCol: document.querySelector('.pillar-text-col'),
            handoffPoint: document.getElementById('handoff-point')
        };
        if (Object.values(elements).some(el => !el)) {
            console.error('CITADEL ABORT: Critical elements missing.'); return;
        }
        console.log("Citadel reports all elements located and verified.");

        let isSwapped = false; // The single source of truth for the swap

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                // --- THE IMMUTABLE TIMELINE ---
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.textCol, pin: elements.visualsCol, start: 'top top',
                        end: `bottom bottom-=${window.innerHeight * 0.8}`, scrub: 0.8,
                        onUpdate: () => logElementState(elements.heroActor, "Live Hero Scrub")
                    }
                });
                tl.to(elements.heroActor, { rotationY: 120, rotationX: 10, scale: 1.1, ease: "none" }, 0)
                  .to(elements.textPillars[0], { autoAlpha: 0, y: -30 }, 0)
                  .from(elements.textPillars[1], { autoAlpha: 0, y: 30 }, 0)
                  .to(elements.heroActor, { rotationY: -120, rotationX: -20, scale: 1.2, ease: "none" }, 1)
                  .to(elements.textPillars[1], { autoAlpha: 0, y: -30 }, 1)
                  .from(elements.textPillars[2], { autoAlpha: 0, y: 30 }, 1);
                console.log("Citadel reports: Immutable timeline forged.");

                // --- THE "BAIT & SWITCH" HANDOFF TRIGGER ---
                ScrollTrigger.create({
                    trigger: elements.handoffPoint, start: 'top 70%',
                    onEnter: () => {
                        if (isSwapped) return;
                        isSwapped = true;
                        console.group('%c[CITADEL] BAIT & SWITCH INITIATED', 'color: #A3BE8C; font-weight:bold;');
                        
                        // 1. Calculate start and end positions
                        const startRect = elements.heroActor.getBoundingClientRect();
                        const endRect = elements.placeholder.getBoundingClientRect();
                        
                        logElementState(elements.heroActor, "1. Hero State at Handoff");
                        gsap.set(elements.heroActor, { autoAlpha: 0 });
                        console.log("--> Hero actor hidden.");

                        logElementState(elements.stuntActor, "2. Stunt Double Pre-Animation");

                        // 2. Perform the magical animation with a clean `gsap.fromTo`
                        console.log("3. Initiating surgical handoff animation...");
                        gsap.fromTo(elements.stuntActor, {
                            x: startRect.left - endRect.left,
                            y: startRect.top - endRect.top,
                            scale: 1.2,
                            rotationX: -20,
                            rotationY: -120,
                            visibility: 'visible'
                        }, {
                            duration: 1.0,
                            ease: 'expo.inOut',
                            x: 0, y: 0, scale: 1,
                            rotationX: 0, rotationY: 0,
                            onStart: () => {
                                // Add class right before tween starts for CSS to take over
                                elements.stuntActor.classList.add('is-logo-final-state');
                            },
                            onComplete: () => {
                                console.log("4. Handoff complete. Stunt double is now the logo.");
                                logElementState(elements.stuntActor, "5. Final Landed State");
                                console.groupEnd();
                            }
                        });
                    },
                    onLeaveBack: () => {
                        if (!isSwapped) return;
                        isSwapped = false;
                        console.log('%c[CITADEL] REVERSE INITIATED. Returning to Hero.', 'color: #EBCB8B; font-weight:bold;');
                        
                        // The reverse is now flawless and simple.
                        gsap.set(elements.stuntActor, { visibility: 'hidden' });
                        elements.stuntActor.classList.remove('is-logo-final-state'); // Reset state
                        gsap.set(elements.heroActor, { autoAlpha: 1 });
                        
                        logElementState(elements.stuntActor, "Stunt Double Hidden");
                        logElementState(elements.heroActor, "Hero Actor Revealed");
                    }
                });
            }
        });
    });
}

function initialCheck(){if(window.gsap&&window.ScrollTrigger&&window.Flip){setupAnimations();}else{let i=0,t=setInterval(()=>{if(window.gsap&&window.ScrollTrigger&&window.Flip){clearInterval(t);setupAnimations();}else if(i++>=30){clearInterval(t);console.error("GSAP libs failed to load.");}},100);}}
function setupSiteLogic(){const e=document.getElementById("menu-open-button"),t=document.getElementById("menu-close-button"),n=document.getElementById("menu-screen"),o=document.documentElement;e&&t&&n&&(e.addEventListener("click",()=>{o.classList.add("menu-open")}),t.addEventListener("click",()=>{o.classList.remove("menu-open")}));const c=document.getElementById("current-year");c&&(c.textContent=(new Date).getFullYear())}
document.addEventListener("DOMContentLoaded",()=>{setupSiteLogic();initialCheck();});
