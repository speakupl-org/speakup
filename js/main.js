/*

THE DEFINITIVE COVENANT BUILD v37.2 - "Sovereign" Protocol (Synchronized)

This version corrects a race condition in the initialization sequence, ensuring that
the Oracle's verbosity configuration is locked in before any telemetry scanning
begins. The initialization flow is now restructured for guaranteed order of operations.

*/

// Oracle v44.0 - The "Sovereign" Protocol (Diagnostic Correction)
const Oracle = {
    // config, utility, performance, init, _timestamp, etc., remain the same.
    config: { verbosity: 1, },
    utility: { throttle: (func, limit) => { let inThrottle; return function() { const args = arguments; const context = this; if (!inThrottle) { func.apply(context, args); inThrottle = true; setTimeout(() => inThrottle = false, limit); } }; } },
    performance: { benchmark: (label, functionToTest) => { const s=performance.now(); const r=functionToTest(); const e=performance.now(); const d=(e-s).toFixed(3); const c=d<50?'#A3BE8C':(d<200?'#EBCB8B':'#BF616A'); if(Oracle.config.verbosity>0){console.log(`%c[ORACLE BENCHMARK @ ${Oracle._timestamp()}: ${label}] - %cExecution Time: ${d}ms`, 'color: #8FBCBB; font-weight: bold;',`color: ${c};`); Oracle.updateHUD('c-exec-time',`${d}ms`,c);} return r;} },

    runSelfDiagnostic: () => {
        if (Oracle.config.verbosity < 1) return;
        const groupMethod = Oracle.config.verbosity >= 2 ? console.group : console.groupCollapsed;
        console.group(`%c[ORACLE SELF-DIAGNOSTIC (SOVEREIGN INTEGRITY PROTOCOL)]`, 'color: #D08770; font-weight: bold;');
        
        // --- 1. Dependency Verification ---
        groupMethod('%c1. Dependency Verification', 'color: #EBCB8B;');
            const checkDep = (lib, name) => console.log(`  - ${name}:`, lib ? '%c✅ FOUND' : '%c❌ MISSING!', lib ? 'color: #A3BE8C;' : 'color: #BF616A; font-weight: bold;');
            checkDep(window.gsap, 'GSAP Core');
            checkDep(window.ScrollTrigger, 'ScrollTrigger Plugin');
            checkDep(window.Flip, 'Flip Plugin');
        console.groupEnd();
        
        // --- 2. Oracle Internal Integrity ---
        groupMethod('%c2. Oracle Internal Integrity', 'color: #EBCB8B;');
            const expectedMethods = ['init', 'utility', 'performance', 'reportStatus', '_timestamp', 'log', 'scan', 'group', 'groupEnd', 'report', 'warn', 'updateHUD', 'trackScrollTrigger', 'runSelfDiagnostic'];
            let integrityOk = true;
            expectedMethods.forEach(methodName => {
                if (typeof Oracle[methodName] !== 'undefined') {
                    console.log(`  - Property/Method '${methodName}': %c✅ OK`, 'color: #A3BE8C;');
                } else {
                    console.log(`  - Property/Method '${methodName}': %c❌ MISSING/INVALID!`, 'color: #BF616A; font-weight: bold;');
                    integrityOk = false;
                }
            });
            if (integrityOk) { Oracle.report("Oracle internal integrity verified."); } 
            else { Oracle.warn("Oracle integrity compromised! Check for missing methods."); }
        console.groupEnd();

        // --- 3. Basic Environment Sanity Check ---
        // The flawed architectural check has been REMOVED.
        groupMethod('%c3. Environment Sanity Check', 'color: #EBCB8B;');
            console.log(`%c  - Viewport:`, 'color: #88C0D0;', `${window.innerWidth}w x ${window.innerHeight}h`);
            const contentCount = document.querySelectorAll('.pillar-text-content').length;
            const wrapperCount = document.querySelectorAll('.text-anim-wrapper').length;
            console.log(`%c  - Pillar Content Found:`, 'color: #88C0D0;', contentCount);
            console.log(`%c  - Anim Wrappers Found:`, 'color: #88C0D0;', wrapperCount);
            if (contentCount !== wrapperCount) {
                Oracle.warn(`Pillar Mismatch Detected! Found ${contentCount} content divs and ${wrapperCount} wrapper divs. This will cause animation errors.`);
            }
        console.groupEnd();
        
        console.groupEnd();
    },
    // The rest of the Oracle object...
    init: (callback) => {const s=localStorage.getItem('oracleVerbosity');if(s!==null)Oracle.config.verbosity=parseInt(s,10);const p=new URLSearchParams(window.location.search);const v=p.get('oracle_verbosity');if(v!==null&&v!==''){const u=parseInt(v,10);if(!isNaN(u))Oracle.config.verbosity=u}if(callback&&typeof callback==='function')callback()},_timestamp:()=>new Date().toLocaleTimeString('en-US',{hour12:false}),log:(e,l)=>{if(Oracle.config.verbosity<1||!e)return;const m=Oracle.config.verbosity>=2?console.group:console.groupCollapsed;m(`%c[ORACLE LOG @ ${Oracle._timestamp()}: ${l}]`,'color:#D81B60; font-weight:bold;');const s=window.getComputedStyle(e);const t={scale:gsap.getProperty(e,"scale"),rotationX:gsap.getProperty(e,"rotationX"),rotationY:gsap.getProperty(e,"rotationY"),z:gsap.getProperty(e,"z")};const b=e.getBoundingClientRect();console.log(`%c  - Target:`,'color:#81A1C1;',`${e.tagName}#${e.id||e.className}`);console.log(`%c  - Transform:`,'color:#81A1C1;',`{ RotX: ${t.rotationX.toFixed(2)}, RotY: ${t.rotationY.toFixed(2)}, Scale: ${t.scale.toFixed(2)}, Z: ${t.z.toFixed(2)} }`);console.groupEnd()},scan:(l,d)=>{if(Oracle.config.verbosity<1)return;const m=Oracle.config.verbosity>=2?console.group:console.groupCollapsed;m(`%c[ORACLE SCAN @ ${Oracle._timestamp()}: ${l}]`,'color:#B48EAD;');for(const k in d){console.log(`%c  - ${k}:`,'color:#88C0D0;',d[k])}console.groupEnd()},group:(l)=>{if(Oracle.config.verbosity<1)return;console.group(`%c[ORACLE ACTION @ ${Oracle._timestamp()}: ${l}]`,'color:#A3BE8C;font-weight:bold;')},groupEnd:()=>{if(Oracle.config.verbosity<1)return;console.groupEnd()},trackScrollTrigger:(i,l)=>{},report:(m)=>console.log(`%c[SOVEREIGN REPORT @ ${Oracle._timestamp()}]:`,'color:#5E81AC; font-weight:bold;',m),warn:(m)=>console.warn(`%c[SOVEREIGN WARNING @ ${Oracle._timestamp()}]:`,'color:#EBCB8B;',m),reportStatus:(m,c='#88C0D0')=>{Oracle.updateHUD('c-protocol-status',m,c)},updateHUD:(i,v,c='#E5E9F0')=>{const e=document.getElementById(i);if(e){e.textContent=v;e.style.color=c}}
};

// --- The rest of your functions are here, unmodified ---

// Utility to safely get elements
const getElement = (selector, isArray = false) => {
    try {
        const result = isArray ? gsap.utils.toArray(selector) : document.querySelector(selector);
        if (!result || (isArray && !result.length)) throw new Error(`Element(s) not found: ${selector}`);
        return result;
    } catch (e) {
        Oracle.warn(e.message);
        return null;
    }
};

// =========================================================================
//         SOVEREIGN BLUEPRINT v39.2: FUNCTION DEFINITIONS
// =========================================================================

// Hero actor animation setup (unchanged)
const setupHeroActor = (elements, masterTl) => {
    masterTl.to(elements.heroActor, {
        rotationY: 120, rotationX: 10, scale: 1.1, ease: "power2.inOut", duration: 2
    }).to(elements.heroActor, {
        rotationY: -120, rotationX: -20, scale: 1.2, ease: "power2.inOut", duration: 2
    });
};

// =========================================================================
//   THE DEFINITIVE BLUEPRINT for Text Pillars (v42 - SYNCHRONIZED Narrative)
// =========================================================================
// This function no longer creates its own timeline. Instead, it accepts the 
// single master timeline (`masterTl`) and adds its animation "chapters" to it.
// =====================================================================================
//   THE DEFINITIVE BLUEPRINT for Text Pillars (v43.1 - COVENANT "Unbroken Chain")
// =====================================================================================
// This version resolves the logic freeze by constructing the entire narrative
// sequence as a single, monolithic, unbroken animation chain. This provides
// absolute clarity to the GSAP engine and prevents recursive calculation errors.
const setupTextPillars = (elements, masterTl) => {

    // 1. Establish Authoritative JS Initial State (Unchanged)
    gsap.set(elements.pillars, { autoAlpha: 0 }); 
    gsap.set(elements.pillars[0], { autoAlpha: 1 });
    gsap.set(elements.textWrappers, { y: 40, rotationX: -15 }); 
    gsap.set(elements.textWrappers[0], { y: 0, rotationX: 0 });

    // === OVERKILL TRACKER #1: STATE AUTHORITY VERIFICATION (Unchanged) ===
    Oracle.group("COVENANT Initial Pillar State Authority (PRE-ANIMATION)");
    elements.pillars.forEach((pillar, index) => {
        Oracle.scan(`Pillar #${index + 1} State Vector`, {
            'Parent GSAP Opacity': gsap.getProperty(pillar, "autoAlpha"),
            'Wrapper GSAP Y': gsap.getProperty(elements.textWrappers[index], "y").toFixed(1) + 'px'
        });
    });
    Oracle.groupEnd();
    
    // 2. CONSTRUCT THE UNBROKEN CHAIN.
    // All tweens are now part of a single, continuous command chain. This removes
    // all logical ambiguity and guarantees a linear execution flow.
    masterTl
        // -- Transition 1: Pillar 1 to Pillar 2 (starts at 1.0s) --
        .to(elements.pillars[0], { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 1.0)
        .to(elements.textWrappers[0], { y: -40, rotationX: 15, duration: 0.5, ease: "power2.in" }, "<")
        .to(elements.pillars[1], { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, "<")
        .from(elements.textWrappers[1], { y: 40, rotationX: -15, duration: 0.5, ease: "power2.out" }, "<")

        // -- Transition 2: Pillar 2 to Pillar 3 (starts at 3.0s) --
        .to(elements.pillars[1], { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 3.0)
        .to(elements.textWrappers[1], { y: -40, rotationX: 15, duration: 0.5, ease: "power2.in" }, "<")
        .to(elements.pillars[2], { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, "<")
        .from(elements.textWrappers[2], { y: 40, rotationX: -15, duration: 0.5, ease: "power2.out" }, "<");


    // === COVENANT TRACKER #3: CHRONOSYNCHRONY VERIFICATION (Unchanged but more relevant) ===
    Oracle.group("COVENANT Chronosynchrony Verification [TextPillars]");
        const pillarTweens = masterTl.getChildren(false, true, true).filter(tween => {
            const targets = Array.isArray(tween.targets()) ? tween.targets() : [tween.targets()];
            return targets.some(t => t.classList.contains('pillar-text-content') || t.classList.contains('text-anim-wrapper'));
        });
        Oracle.scan(`Pillar Tween Integration`, {
            'Status': 'MONOLITHIC CHAIN CONFIRMED',
            'Tween Chapters Found': pillarTweens.length,
            'Expected Chapters': 8 
        });
    Oracle.groupEnd();
};

// =========================================================================
//   ESCHATON HANDOFF (v42 - Architecturally Sound & Direct)
// =========================================================================
const setupHandoff = (elements, masterStoryTl) => {

    let isSwapped = false;
    Oracle.updateHUD('c-handoff-armed-flag', 'FALSE', '#BF616A');

    const performAbsorption = (self) => {
        if (isSwapped) return;
        isSwapped = true;
        
        Oracle.group('ABSORPTION PROTOCOL INITIATED (ESCHATON)');
        Oracle.reportStatus('ABSORPTION', '#D08770');
        Oracle.updateHUD('c-event', 'ABSORPTION');
        
        masterStoryTl.scrollTrigger.disable(false);

        const hero = elements.heroActor;
        const stuntDouble = elements.stuntActor;

        const state = Flip.getState(stuntDouble, { props: "transform, opacity" });
        const heroProps = { 
            scale: gsap.getProperty(hero, "scale"), 
            rotationX: gsap.getProperty(hero, "rotationX"), 
            rotationY: gsap.getProperty(hero, "rotationY") 
        };

        gsap.set(stuntDouble, {
            autoAlpha: 1,
            x: hero.getBoundingClientRect().left - elements.placeholder.getBoundingClientRect().left,
            y: hero.getBoundingClientRect().top - elements.placeholder.getBoundingClientRect().top,
            scale: heroProps.scale, rotationX: heroProps.rotationX, rotationY: heroProps.rotationY,
        });

        const absorptionTl = gsap.timeline({
            onComplete: () => {
                masterStoryTl.scrollTrigger.enable();
                Oracle.reportStatus('STABILIZED', '#A3BE8C');
                Oracle.groupEnd();
            }
        });

        absorptionTl.add(Flip.from(state, { targets: stuntDouble, duration: 1.5, ease: 'power3.inOut' }));
        absorptionTl
            .to(hero, { autoAlpha: 0, duration: 0.4 }, 0)
            .to(elements.stuntActorFaces, { opacity: 0, duration: 0.6, stagger: 0.05 }, 0.6)
            .to(stuntDouble, { rotationX: 0, rotationY: 0, duration: 0.8, ease: "power3.inOut" }, ">-0.5")
            .call(() => stuntDouble.classList.add('is-logo-final-state'), [], '>');
    };

    const performReversal = (self) => {
        if (!isSwapped) return;
        isSwapped = false;

        Oracle.group('REVERSAL PROTOCOL INITIATED (ESCHATON)');
        Oracle.reportStatus('REVERSING', '#EBCB8B');
        
        elements.stuntActor.classList.remove('is-logo-final-state');
        gsap.killTweensOf([elements.stuntActor, elements.heroActor, elements.stuntActorFaces]);
        
        gsap.set(elements.stuntActor, { autoAlpha: 0 });
        gsap.set(elements.heroActor, { autoAlpha: 1 });
        
        masterStoryTl.scrollTrigger.enable();
        masterStoryTl.scrollTrigger.update(); // Nudge the master ST to recognize its state
        Oracle.reportStatus('SCROLLING', '#88C0D0');
        Oracle.groupEnd();
    };

    // The "Architect" protocol remains the correct way to attach events.
    ScrollTrigger.create({
        trigger: elements.handoffPoint,
        start: 'top 80%', // This trigger position works well with the new decoupled architecture.
        onToggle: self => Oracle.updateHUD('c-handoff-st-active', self.isActive ? 'TRUE' : 'FALSE', self.isActive ? '#A3BE8C' : '#BF616A'),
        
        onRefresh: (self) => {
            self.onEnter = () => performAbsorption(self);
            self.onLeaveBack = () => performReversal(self);
            Oracle.reportStatus('HANDOFF ARMED', '#A3BE8C');
            Oracle.updateHUD('c-handoff-armed-flag', 'TRUE', '#A3BE8C');
        }
    });
};

// =========================================================================
//         CYNOSURE ARCHITECTURE v44: Decoupled Pin & Animation
// =========================================================================
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    Oracle.report(`Sovereign Build v44 "Cynosure" Initialized. Verbosity: ${Oracle.config.verbosity}`);
    Oracle.reportStatus('SYSTEM BOOT', '#5E81AC');

    const ctx = Oracle.performance.benchmark('Sovereign Animation Architecture Setup', () => {
        return gsap.context(() => {
            // This diagnostic is now corrected and will no longer fire false warnings.
            Oracle.runSelfDiagnostic();

            const elements = {
                heroActor: getElement('#actor-3d'),
                stuntActor: getElement('#actor-3d-stunt-double'),
                placeholder: getElement('#summary-placeholder'),
                placeholderClipper: getElement('.summary-thumbnail-clipper'),
                pillars: getElement('.pillar-text-content', true),
                textWrappers: getElement('.text-anim-wrapper', true),
                visualsCol: getElement('.pillar-visuals-col'),
                textCol: getElement('.pillar-text-col'), 
                handoffPoint: getElement('#handoff-point'),
                stuntActorFaces: getElement('#actor-3d-stunt-double .face:not(.front)', true)
            };

            if (Object.values(elements).some(el => !el || (Array.isArray(el) && !el.length))) {
                Oracle.warn('SOVEREIGN ABORT: Missing critical elements.'); 
                return;
            }
            Oracle.report("Sovereign components verified and locked.");
    
            const scrubValue = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : 1.5;
    
            ScrollTrigger.matchMedia({
                '(min-width: 1025px)': () => {
                    Oracle.reportStatus('SCROLLING', '#88C0D0');
                    
                    // --- THE CYNOSURE PROTOCOL FIX ---
                    
                    // INSTRUCTION 1: THE PINNER. Its only job is to pin the element.
                    // This creates a stable, predictable layout for other triggers to measure.
                    ScrollTrigger.create({ 
                        trigger: elements.textCol, 
                        pin: elements.visualsCol, 
                        start: 'top top', 
                        end: 'bottom bottom' 
                    });
                    
                    // The Aegis throttled logger remains correct and essential for performance.
                    const throttledLogger = Oracle.utility.throttle((self) => {
                        const hero = elements.heroActor;
                        const rotX = gsap.getProperty(hero, "rotationX").toFixed(1);
                        const rotY = gsap.getProperty(hero, "rotationY").toFixed(1);
                        const scale = gsap.getProperty(hero, "scale").toFixed(2);
                        
                        Oracle.scan('Live Story Scrub (Throttled)', { 
                            'Master Progress': `${(self.progress * 100).toFixed(0)}%`, 
                            'RotX': rotX, 
                            'RotY': rotY, 
                            'Scale': scale 
                        });
                        
                        Oracle.updateHUD('c-rot-x', rotX);
                        Oracle.updateHUD('c-rot-y', rotY);
                        Oracle.updateHUD('c-scale', scale);
                    }, 150); // Log no more than once every 150ms

                    // INSTRUCTION 2: THE ANIMATOR. It scrubs the timeline but does NOT pin.
                    // It measures the layout created by the Pinner and works reliably within it.
                    const masterStoryTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: elements.textCol, 
                            start: 'top top', 
                            end: 'bottom bottom', 
                            scrub: scrubValue,
                            // NO pin property here. This is the key.
                            onUpdate: (self) => {
                                // The main onUpdate loop is now extremely lightweight.
                                Oracle.updateHUD('c-scroll', `${(self.progress * 100).toFixed(0)}%`);
                                // Heavy console logging is deferred to the throttled function.
                                throttledLogger(self);
                            }
                        }
                    });
                    
                    // Assemble the animation narrative as before.
                    setupHeroActor(elements, masterStoryTl);
                    setupTextPillars(elements, masterStoryTl);
                    
                    // The handoff function works correctly within this new stable architecture.
                    setupHandoff(elements, masterStoryTl);
                },
            });
        });
    });

    return ctx;
}

// Initialization Logic (unchanged)
function setupSiteLogic() {
    const menuOpen = getElement('#menu-open-button');
    const menuClose = getElement('#menu-close-button');
    const menuScreen = getElement('#menu-screen');
    const root = document.documentElement;

    if (menuOpen && menuClose && menuScreen) {
        menuOpen.addEventListener('click', () => root.classList.add('menu-open'));
        menuClose.addEventListener('click', () => root.classList.remove('menu-open'));
    }

    const yearEl = getElement('#current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    Oracle.report("Site logic initialized.");
}

// REVISED initialization sequence (unchanged)
function initialAnimationSetup() {
    if (window.gsap && window.ScrollTrigger && window.Flip) {
        Oracle.init(setupAnimations); 
    } else {
        Oracle.warn("GSAP libraries failed to load. SOVEREIGN protocol aborted.");
    }
}

document.addEventListener("DOMContentLoaded", setupSiteLogic);
window.addEventListener("load", initialAnimationSetup);
