/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v20.0 - The "Final Stand" Protocol
   
   This is the definitive, fully-armored architecture. It addresses all prior
   failures with a new, robust, and completely transparent system. The mission ends here.
   
   THE UNBREAKABLE PRINCIPLES:
   1. ONE SOURCE OF TRUTH: A global STATE object manages all flags (`isFlipped`,
      `isRebirthing`). No more ambiguity.
   2. TOTAL ANNIHILATION: The rebirth process now kills ALL ScrollTriggers on the page,
      ensuring zero state pollution. No survivors.
   3. LIVE FORENSIC MONITORING: The main timeline has a dedicated `onUpdate` to
      continuously feed the HUD with data AS YOU SCROLL.
   4. MANUAL RESTORE & RESET: Flip is used for the "down" journey only. The "up"
      journey is a clean, manual GSAP tween to a pristine state, solving all "blips".
========================================================================================
*/

// --- GLOBAL STATE & HELPERS ---
const STATE = {
    isFlipped: false,
    isRebirthing: false
};
const lockScroll = () => document.body.classList.add('scroll-locked');
const unlockScroll = () => document.body.classList.remove('scroll-locked');
let mainScrollytelling; // This will hold our main scrollytelling instance

/**
 * Annihilates every GSAP ScrollTrigger on the page.
 */
function killAllTriggers() {
    console.warn("KILL SWITCH ENGAGED: Annihilating all ScrollTriggers...");
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    console.warn("KILL SWITCH: All triggers terminated.");
}

/**
 * Builds a pristine, new scrollytelling instance.
 */
function createScrollytelling(elements, hud) {
    console.log("%cBUILDER: Forging new scrollytelling instance...", "color: #81A1C1");

    const { actor3D, textPillars, textCol, visualsCol } = elements;
    
    // PRECISION TIMELINE with LIVE MONITORING
    const tl = gsap.timeline({
        onUpdate: function() {
            // This now provides the LIVE tracking you requested.
            hud.tlProg.textContent = this.progress().toFixed(3);
            hud.textY.textContent = gsap.getProperty(textPillars[2], "y").toFixed(2);
            hud.actorTransform.textContent = gsap.getProperty(actor3D, "transform");
        }
    });

    const states = {
        p1: { rotationY: 20, rotationX: -15, scale: 1.0 },
        p2: { rotationY: 120, rotationX: 10, scale: 1.1 },
        p3: { rotationY: -120, rotationX: -20, scale: 1.2 }
    };

    tl.to(actor3D, { ...states.p1, duration: 1 })
      .to(textPillars[0], { autoAlpha: 0, y: '-30px', duration: 0.5 }, "+=0.8")
      .to(actor3D, { ...states.p2, duration: 1 }, "<")
      .fromTo(textPillars[1], { autoAlpha: 0, y: '30px' }, { autoAlpha: 1, y: '0px', duration: 0.5 }, "<")
      .to(textPillars[1], { autoAlpha: 0, y: '-30px', duration: 0.5 }, "+=0.8")
      .to(actor3D, { ...states.p3, duration: 1 }, "<")
      .fromTo(textPillars[2], { autoAlpha: 0, y: '30px' }, { autoAlpha: 1, y: '0px', duration: 0.5 }, "<")
      .addLabel("finalState");

    mainScrollytelling = ScrollTrigger.create({
        trigger: textCol,
        pin: visualsCol,
        start: 'top top',
        end: `bottom bottom-=${window.innerHeight / 2}`,
        animation: tl,
        scrub: 0.8,
        invalidateOnRefresh: true,
        // Add a live log for when this specific trigger is updated by GSAP
        onUpdate: self => console.log(`Main Scrub Update: p:${self.progress.toFixed(2)} d:${self.direction}`),
    });
    console.log("%cBUILDER: New scrollytelling instance is LIVE.", "color: #A3BE8C");
}


function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    console.log('%cGSAP Covenant Build v20.0 Initialized. [FINAL STAND]', 'color: #88C0D0; font-weight: bold; font-size: 14px;');

    const ctx = gsap.context(() => {
        const elements = {
            visualsCol: document.querySelector('.pillar-visuals-col'),
            scene3D: document.querySelector('.scene-3d'),
            actor3D: document.getElementById('actor-3d'),
            textPillars: gsap.utils.toArray('.pillar-text-content'),
            summaryClipper: document.querySelector('.summary-thumbnail-clipper'),
            handoffPoint: document.getElementById('handoff-point'),
            textCol: document.querySelector('.pillar-text-col')
        };
        if (Object.values(elements).some(el => !el || (Array.isArray(el) && el.length === 0))) {
            console.error('COVENANT ABORTED: Critical elements missing.'); return;
        }

        const hud = {
            state: document.getElementById('c-state'), event: document.getElementById('c-event'),
            isFlipped: document.getElementById('c-flipped'), isRebirthing: document.getElementById('c-rebirthing'),
            handoffActive: document.getElementById('c-handoff-active'), direction: document.getElementById('c-direction'),
            tlProg: document.getElementById('c-tl-prog'), textY: document.getElementById('c-text-y'),
            actorTransform: document.getElementById('c-actor-transform')
        };
        const updateHudState = () => { hud.isFlipped.textContent = STATE.isFlipped; hud.isRebirthing.textContent = STATE.isRebirthing; };
        updateHudState();
        hud.state.textContent = "Standby";

        ScrollTrigger.matchMedia({
            '(min-width: 769px)': () => {
                hud.state.textContent = "Awaiting Interaction";
                gsap.set(elements.textPillars, { autoAlpha: 0 });
                gsap.set(elements.textPillars[0], { autoAlpha: 1 });
                createScrollytelling(elements, hud);

                // This is now the ONLY trigger that will be created after a rebuild.
                ScrollTrigger.create({
                    id: "HANDOFF_MONITOR",
                    trigger: elements.handoffPoint,
                    start: 'top center',
                    onUpdate: self => { hud.direction.textContent = self.direction; },
                    onToggle: self => {
                        hud.handoffActive.textContent = self.isActive;
                        
                        // A) FLIP DOWN
                        if (self.isActive && self.direction === 1) {
                            if (STATE.isFlipped || STATE.isRebirthing) return;
                            STATE.isFlipped = true; updateHudState();
                            hud.state.textContent = "FLIPPED"; hud.event.textContent = "Flip Down";
                            console.log("%cEVENT: Flip Down", "color: #A3BE8C; font-weight: bold;");
                            
                            mainScrollytelling.disable();
                            const flipState = Flip.getState(elements.actor3D);
                            elements.summaryClipper.appendChild(elements.actor3D);
                            Flip.from(flipState, {
                                duration: 0.8, ease: 'power2.inOut', scale: true,
                                onComplete: () => {
                                    // This solves the "trapped in 3D form" issue
                                    console.log("Flip Down Complete. Resetting actor's transform for clean layout.");
                                    gsap.set(elements.actor3D, { clearProps: "transform" });
                                }
                            });
                        }
                        
                        // B) THE FINAL STAND REBIRTH
                        if (!self.isActive && self.direction === -1) {
                            if (!STATE.isFlipped || STATE.isRebirthing) return;
                            STATE.isRebirthing = true; updateHudState();
                            hud.state.textContent = "REBIRTHING"; hud.event.textContent = "Protocol Engaged";
                            console.group('%c"FINAL STAND" REBIRTH PROTOCOL INITIATED', 'color: #D81B60; font-weight:bold;');
                            
                            // 1. FREEZE THE WORLD
                            lockScroll();
                            console.log("1. SCROLL LOCKED. User input frozen.");
                            
                            // 2. TOTAL ANNIHILATION
                            killAllTriggers();
                            
                            // 3. MANUAL, CLEAN RESTORE
                            console.log("3. Wiping actor & initiating manual restore tween...");
                            elements.scene3D.appendChild(elements.actor3D);
                            gsap.set(elements.actor3D, { clearProps: "all" });
                            gsap.to(elements.actor3D, {
                                duration: 0.6,
                                ease: 'power2.out',
                                rotationY: -120, rotationX: -20, scale: 1.2, // The exact "finalState"
                                onComplete: () => {
                                    console.log("4. Actor restored to pristine finalState.");
                                    
                                    // 4. REBUILD FROM SCRATCH
                                    createScrollytelling(elements, hud);

                                    // 5. TELEPORT SAFELY
                                    const handoffPointTop = elements.handoffPoint.getBoundingClientRect().top + window.scrollY;
                                    const safeHavenPosition = handoffPointTop - 5; // Extra safe margin
                                    window.scrollTo({ top: safeHavenPosition, behavior: 'instant' });
                                    console.log(`5. Teleported to Safe Haven: ${safeHavenPosition.toFixed(0)}px`);
                                    
                                    // 6. UNLOCK AND RESET
                                    STATE.isFlipped = false;
                                    STATE.isRebirthing = false;
                                    updateHudState();
                                    unlockScroll();
                                    hud.state.textContent = "In Scroller (Reborn)";
                                    hud.event.textContent = "System Stable";
                                    console.log("6. SCROLL UNLOCKED. System is pristine and ready.");
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
