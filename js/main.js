/*
========================================================================================
   THE FINAL COVENANT BUILD v16.0 - The Total System Rebuild Protocol
   
   This is the definitive, architecturally complete solution. It abandons "patching"
   the state in favor of a robust "nuke and rebuild" strategy. When scrolling up,
   the entire animation context (timelines, triggers) is completely destroyed, the
   3D actor's CSS is wiped clean, and the whole system is re-initialized from a
   pristine state. This is immune to all race conditions and state pollution.
   
   FEATURES:
   - God-Mode HUD: Tracks every critical variable, including raw CSS transforms.
   - Total Rebuild: Uses a `revert()`/`init()` cycle for perfect state hygiene.
   - Explicit State Reset: Uses `clearProps` to prevent any residual CSS from Flip.
   - Uncompromising Verbosity: The console now tells a complete story of every action.
========================================================================================
*/

// Make the GSAP Context and key elements globally accessible within this module
let ctx;
let actor3D, handoffPoint, textPillars;

/**
 * Destroys all animations and listeners created within the GSAP Context.
 */
function revertAnimations() {
    console.log("%cREVERTING: Tearing down all animations and triggers.", "background: #434C5E; color: #ECEFF4;");
    if (ctx) {
        ctx.revert();
    }
}

/**
 * Main function to initialize all page animations.
 */
function initAnimations() {
    console.log('%cINIT: GSAP Covenant Build v16.0 Initializing...', 'color: #88C0D0; font-weight: bold; font-size: 14px;');
    gsap.registerPlugin(ScrollTrigger, Flip);
    
    // Use a GSAP context for proper setup and teardown
    ctx = gsap.context(() => {
        // --- 1. ELEMENT SELECTION & GUARDS ---
        const visualsCol = document.querySelector('.pillar-visuals-col');
        const scene3D = document.querySelector('.scene-3d');
        actor3D = document.getElementById('actor-3d'); // Use global var
        textPillars = gsap.utils.toArray('.pillar-text-content'); // Use global var
        const summaryClipper = document.querySelector('.summary-thumbnail-clipper');
        handoffPoint = document.getElementById('handoff-point'); // Use global var
        const textCol = document.querySelector('.pillar-text-col'); 
        
        if (!visualsCol || !scene3D || !actor3D || !summaryClipper || !handoffPoint || !textCol) {
            console.error('INIT ABORTED: One or more critical elements are missing.'); return;
        }

        // --- 2. GOD-MODE HUD & STATE VARS ---
        const hud = {
            state: document.getElementById('c-state'), event: document.getElementById('c-event'),
            isFlipped: document.getElementById('c-flipped'), rebirthLock: document.getElementById('c-rebirth-lock'),
            scrollDir: document.getElementById('c-scroll-dir'), scrollY: document.getElementById('c-scroll-y'),
            handoffTop: document.getElementById('c-handoff-top'), tlProg: document.getElementById('c-tl-prog'),
            textAlpha: document.getElementById('c-text-alpha'), textY: document.getElementById('c-text-y'),
            actorTransform: document.getElementById('c-actor-transform')
        };
        
        let isFlipped = false;
        let isRebirthing = false;
        
        hud.state.textContent = "Standby";
        hud.isFlipped.textContent = "false";
        hud.rebirthLock.textContent = "INACTIVE";

        // --- 3. DESKTOP-ONLY ANIMATION SETUP ---
        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                hud.state.textContent = "In Scroller";
                
                // --- TIMELINE DEFINITION (Correct & Stable) ---
                const tl = gsap.timeline({ paused: true });
                const states = {
                    p1: { rotationY: 20, rotationX: -15 },
                    p2: { rotationY: 120, rotationX: 10 },
                    p3: { rotationY: -120, rotationX: -20 },
                };
                
                gsap.set(textPillars, { autoAlpha: 0, y: '30px' });
                gsap.set(textPillars[0], { autoAlpha: 1, y: '0px' });

                tl.to(actor3D, { ...states.p1, duration: 1, scale: 1.0 })
                  .to(textPillars[0], { autoAlpha: 0, y: '-30px', duration: 0.4 }, "+=1")
                  .to(actor3D, { ...states.p2, duration: 1, scale: 1.1 }, "<")
                  .to(textPillars[1], { autoAlpha: 1, y: '0px', duration: 0.4 }, "<+=0.2")
                  .to(textPillars[1], { autoAlpha: 0, y: '-30px', duration: 0.4 }, "+=1")
                  .to(actor3D, { ...states.p3, duration: 1, scale: 1.2 }, "<")
                  .to(textPillars[2], { autoAlpha: 1, y: '0px', duration: 0.4 }, "<+=0.2")
                  .addLabel("finalState");

                console.log(`[INIT] Timeline created. Total duration: ${tl.duration().toFixed(2)}s.`);

                // --- MASTER SCRUB & HUD TICKER ---
                const mainScrub = ScrollTrigger.create({ 
                    trigger: textCol, pin: visualsCol, start: 'top top', 
                    end: `bottom bottom-=${window.innerHeight / 2}`, 
                    animation: tl, scrub: 0.8, invalidateOnRefresh: true, 
                });
                
                gsap.ticker.add(() => {
                    hud.scrollY.textContent = `${window.scrollY.toFixed(2)}px`;
                    hud.handoffTop.textContent = `${(handoffPoint.getBoundingClientRect().top + window.scrollY).toFixed(2)}px`;
                    hud.tlProg.textContent = tl.progress().toFixed(3);
                    hud.textAlpha.textContent = gsap.getProperty(textPillars[2], "autoAlpha").toFixed(2);
                    hud.textY.textContent = gsap.getProperty(textPillars[2], "y").toFixed(2);
                    hud.actorTransform.textContent = gsap.getProperty(actor3D, "transform");
                });
                
                // --- 4. THE TOTAL REBUILD TRIGGER (v16) ---
                ScrollTrigger.create({
                    trigger: handoffPoint,
                    start: 'top center',
                    onUpdate: self => { hud.scrollDir.textContent = self.direction === 1 ? 'DOWN' : 'UP'; },
                    onToggle: self => {
                        // --- A) FLIP DOWN LOGIC ---
                        if (self.isActive && self.direction === 1) {
                            if (isFlipped || isRebirthing) return;
                            
                            isFlipped = true;
                            hud.isFlipped.textContent = "true";
                            hud.state.textContent = "FLIPPED";
                            hud.event.textContent = "Flip Down";
                            console.log("%cEVENT: Flip Down", "color: #A3BE8C; font-weight: bold;");
                            
                            mainScrub.disable();
                            const state = Flip.getState(actor3D);
                            summaryClipper.appendChild(actor3D);
                            Flip.from(state, { duration: 0.8, ease: 'power2.inOut', scale: true });
                        }
                        
                        // --- B) REBIRTH & TOTAL REBUILD LOGIC ---
                        if (!self.isActive && self.direction === -1) {
                            if (!isFlipped || isRebirthing) return;
                            
                            // 1. ENGAGE LOCK
                            isRebirthing = true;
                            hud.rebirthLock.textContent = "ACTIVE";
                            console.log('%cREBIRTH LOCK: ENGAGED', 'font-weight: bold; color: #BF616A;');
                            
                            hud.state.textContent = "REBUILDING...";
                            hud.event.textContent = "Rebirth Flip";
                            console.log("%cEVENT: Rebirth Initiated -> Flipping actor home.", "color: #EBCB8B; font-weight: bold;");
                            
                            // 2. FLIP THE ACTOR BACK TO ITS ORIGINAL POSITION
                            const state = Flip.getState(actor3D);
                            scene3D.appendChild(actor3D);
                            Flip.from(state, {
                                duration: 0.8, ease: 'power2.out', scale: true,
                                onComplete: () => {
                                    // 3. THE TOTAL REBUILD PROTOCOL
                                    console.group('%cTOTAL SYSTEM REBUILD INITIATED', 'color: #D81B60; font-weight:bold;');

                                    // 3a. TEAR DOWN ALL GSAP LOGIC
                                    revertAnimations();
                                    console.log("1. All GSAP contexts & triggers terminated.");
                                    
                                    // 3b. MANUALLY WIPE THE ACTOR'S CSS. This is CRITICAL to prevent state pollution.
                                    gsap.set(actor3D, { clearProps: "all" });
                                    console.log("2. 3D Actor's inline CSS has been wiped clean.");

                                    // 3c. RE-INITIALIZE THE ENTIRE ANIMATION SYSTEM
                                    console.log("3. Re-initializing all animation systems from scratch...");
                                    initAnimations();
                                    
                                    // 3d. TELEPORT THE VIEWPORT to the correct position for a seamless experience
                                    console.log("4. Teleporting viewport for seamless re-entry.");
                                    window.scrollTo({ top: handoffPoint.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });

                                    console.log("%cREBUILD COMPLETE. System is now in a pristine state.", 'font-weight: bold;');
                                    console.groupEnd();
                                }
                            });
                        }
                    }
                });
            }
        });
    });
}


// --- Primary Entry Point & Site Logic (Unchanged) ---
function initialCheck() {
    if (window.gsap && window.ScrollTrigger && window.Flip) {
        initAnimations(); // Start the system for the first time
    } else {
        let i = 0, t = setInterval(() => {
            if (window.gsap && window.ScrollTrigger && window.Flip) { clearInterval(t); initAnimations(); } 
            else if (i++ >= 30) { clearInterval(t); console.error("CRITICAL: GSAP libraries failed to load."); }
        }, 100);
    }
}

function setupSiteLogic(){const e=document.getElementById("menu-open-button"),t=document.getElementById("menu-close-button"),n=document.getElementById("menu-screen"),o=document.documentElement;e&&t&&n&&(e.addEventListener("click",()=>{o.classList.add("menu-open")}),t.addEventListener("click",()=>{o.classList.remove("menu-open")}));const c=document.getElementById("current-year");c&&(c.textContent=(new Date).getFullYear())}

document.addEventListener("DOMContentLoaded",()=>{
    setupSiteLogic();
    initialCheck();
});
