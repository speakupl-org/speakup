/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v19.0 - The "Zero-Motion Rebuild" Protocol
   
   This is the final, definitive architecture. It abandons all previous attempts to
   manage state during motion. Instead, it enforces absolute stability by physically
   locking the user's scroll, killing the old animation system, manually restoring
   the cube, and only then rebuilding a pristine animation system from scratch.
   
   THE NEW ARCHITECTURE:
   1. ZERO-MOTION PRINCIPLE: When reversing, user scroll is FROZEN via `body.scroll-locked`.
      This eliminates ALL motion-based conflicts and jank.
   2. KILL, DON'T DISABLE: The old scrollytelling trigger is `kill()`ed, not disabled.
      This purges it and its state from memory completely.
   3. MANUAL RESTORE TWEEN: A clean `gsap.to()` tween, not Flip, is used to return
      the cube to its final position. This is predictable and avoids Flip's state complexities.
   4. MODULAR REBUILD: The entire scrollytelling animation is encapsulated in a
      `createScrollytelling()` function, which is called on load and again after a rebirth.
========================================================================================
*/

// --- Global Scope Variables & Functions for the v19 Protocol ---
let ctx;
let isFlipped = false;
let isRebirthing = false;
let mainScrub; // The main scrollytelling ScrollTrigger

// Helper functions for clarity and control
const lockScroll = () => { document.body.classList.add('scroll-locked'); };
const unlockScroll = () => { document.body.classList.remove('scroll-locked'); };

/**
 * Encapsulated function to create the entire scrollytelling animation.
 * This can be called on page load and again during a rebuild.
 */
function createScrollytelling(elements, hud) {
    console.log("%cBUILDER: Creating new scrollytelling animation instance...", "color: #81A1C1");

    const { actor3D, textPillars, textCol, visualsCol } = elements;
    
    // --- Precision Timeline ---
    const tl = gsap.timeline({
        onUpdate: () => {
             // For debugging the text/cube mismatch
             hud.actorTransform.textContent = gsap.getProperty(actor3D, "transform");
        }
    });

    const states = {
        p1: { rotationY: 20, rotationX: -15, scale: 1.0 },
        p2: { rotationY: 120, rotationX: 10, scale: 1.1 },
        p3: { rotationY: -120, rotationX: -20, scale: 1.2 }
    };

    // Text animations are now perfectly synchronized to the START of the cube tween
    tl.to(actor3D, { ...states.p1, duration: 1 })
      .to(textPillars[0], { autoAlpha: 0, y: '-30px', duration: 0.4 }, "+=1")
      .to(actor3D, { ...states.p2, duration: 1 }, "<")
      .fromTo(textPillars[1], { autoAlpha: 0, y: '30px' }, { autoAlpha: 1, y: '0px', duration: 0.4 }, "<")
      .to(textPillars[1], { autoAlpha: 0, y: '-30px', duration: 0.4 }, "+=1")
      .to(actor3D, { ...states.p3, duration: 1 }, "<")
      .fromTo(textPillars[2], { autoAlpha: 0, y: '30px' }, { autoAlpha: 1, y: '0px', duration: 0.4 }, "<")
      .addLabel("finalState");

    // Create the master scrub, assigning it to the global variable
    mainScrub = ScrollTrigger.create({
        trigger: textCol,
        pin: visualsCol,
        start: 'top top',
        end: `bottom bottom-=${window.innerHeight / 2}`,
        animation: tl,
        scrub: 0.8,
        invalidateOnRefresh: true
    });
    console.log("%cBUILDER: New scrollytelling instance is LIVE.", "color: #A3BE8C");
}


function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cGSAP Covenant Build v19.0 Initialized. All systems armed.', 'color: #88C0D0; font-weight: bold; font-size: 14px;');
    ScrollTrigger.defaults({ markers: true }); 

    ctx = gsap.context(() => {
        // --- 1. ELEMENT SELECTION ---
        const elements = {
            visualsCol: document.querySelector('.pillar-visuals-col'),
            scene3D: document.querySelector('.scene-3d'),
            actor3D: document.getElementById('actor-3d'),
            textPillars: gsap.utils.toArray('.pillar-text-content'),
            summaryClipper: document.querySelector('.summary-thumbnail-clipper'),
            handoffPoint: document.getElementById('handoff-point'),
            textCol: document.querySelector('.pillar-text-col')
        };
        if (Object.values(elements).some(el => !el)) {
            console.error('COVENANT ABORTED: Critical elements missing.'); return;
        }

        // --- 2. COMMAND CENTER HUD ---
        const hud = {
            state: document.getElementById('c-state'), event: document.getElementById('c-event'),
            isFlipped: document.getElementById('c-flipped'), rebirthLock: document.getElementById('c-rebirth-lock'),
            scrollLock: document.getElementById('c-scroll-lock'), tween: document.getElementById('c-tween'),
            actorTransform: document.getElementById('c-actor-transform')
        };
        hud.state.textContent = "Standby"; hud.isFlipped.textContent = "false"; 
        hud.rebirthLock.textContent = "INACTIVE"; hud.scrollLock.textContent = "OFF"; hud.tween.textContent = "none";
        
        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                hud.state.textContent = "Awaiting Interaction";
                
                // Set initial text state
                gsap.set(elements.textPillars, { autoAlpha: 0 });
                gsap.set(elements.textPillars[0], { autoAlpha: 1 });
                
                // Initial creation of the scrollytelling animation
                createScrollytelling(elements, hud);

                // --- 3. THE ZERO-MOTION REBUILD TRIGGER ---
                ScrollTrigger.create({
                    trigger: elements.handoffPoint,
                    start: 'top center',
                    onToggle: self => {
                        // --- A) FLIP DOWN ---
                        if (self.isActive && self.direction === 1) {
                            if (isFlipped || isRebirthing) return;
                            isFlipped = true; hud.isFlipped.textContent = "true";
                            hud.state.textContent = "FLIPPED"; hud.event.textContent = "Flip Down";
                            console.log("%cEVENT: Flip Down", "color: #A3BE8C; font-weight: bold;");
                            
                            mainScrub.disable();
                            const flipState = Flip.getState(elements.actor3D);
                            elements.summaryClipper.appendChild(elements.actor3D);
                            Flip.from(flipState, { duration: 0.8, ease: 'power2.inOut', scale: true });
                        }
                        
                        // --- B) ZERO-MOTION REBUILD ---
                        if (!self.isActive && self.direction === -1) {
                            if (!isFlipped || isRebirthing) return;
                            isRebirthing = true; hud.rebirthLock.textContent = "ACTIVE";
                            console.group('%cZERO-MOTION REBUILD PROTOCOL INITIATED', 'color: #D81B60; font-weight:bold;');
                            
                            // 1. FREEZE EVERYTHING
                            lockScroll(); hud.scrollLock.textContent = "ON";
                            console.log("1. SCROLL LOCKED. User input frozen.");
                            
                            // 2. TERMINATE THE OLD ANIMATION
                            mainScrub.kill();
                            console.log("2. Old scrollytelling instance KILLED.");
                            
                            // 3. RESTORE THE ACTOR
                            hud.state.textContent = "RESTORING..."; hud.event.textContent = "Manual Restore";
                            hud.tween.textContent = "actor-restore";
                            elements.scene3D.appendChild(elements.actor3D);
                            gsap.to(elements.actor3D, {
                                duration: 0.6,
                                ease: 'power2.out',
                                rotationY: -120, rotationX: -20, scale: 1.2,
                                onComplete: () => {
                                    hud.tween.textContent = "none";
                                    console.log("3. Actor restored to final position.");
                                    
                                    // 4. REBUILD THE SCROLLYTELLING SYSTEM
                                    hud.state.textContent = "REBUILDING..."; hud.event.textContent = "System Rebuild";
                                    createScrollytelling(elements, hud);

                                    // 5. UNFREEZE AND RESET STATE
                                    isFlipped = false; hud.isFlipped.textContent = "false";
                                    isRebirthing = false; hud.rebirthLock.textContent = "INACTIVE";
                                    unlockScroll(); hud.scrollLock.textContent = "OFF";
                                    hud.state.textContent = "In Scroller (Reborn)";
                                    console.log("4. New scrollytelling instance is live.");
                                    console.log("5. SCROLL UNLOCKED. System is pristine.");
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
function initialCheck(){if(window.gsap&&window.ScrollTrigger&&window.Flip){setupAnimations();}else{let i=0,t=setInterval(()=>{if(window.gsap&&window.ScrollTrigger&&window.Flip){clearInterval(t);setupAnimations();}else if(i++>=30){clearInterval(t);console.error("GSAP libs failed to load.");}},100);}}
function setupSiteLogic(){const e=document.getElementById("menu-open-button"),t=document.getElementById("menu-close-button"),n=document.getElementById("menu-screen"),o=document.documentElement;e&&t&&n&&(e.addEventListener("click",()=>{o.classList.add("menu-open")}),t.addEventListener("click",()=>{o.classList.remove("menu-open")}));const c=document.getElementById("current-year");c&&(c.textContent=(new Date).getFullYear())}
document.addEventListener("DOMContentLoaded",()=>{setupSiteLogic();initialCheck();});
