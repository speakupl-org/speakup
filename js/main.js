// Oracle v47.0 - The "Prometheus" Protocol - Full Telemetry Restored
const Oracle = {
    config: { verbosity: 1, },
    utility: { throttle: (func, limit) => { let inThrottle; return function() { const args = arguments; const context = this; if (!inThrottle) { func.apply(context, args); inThrottle = true; setTimeout(() => inThrottle = false, limit); } }; } },
    performance: { benchmark: (label, functionToTest) => { const s=performance.now(); const r=functionToTest(); const e=performance.now(); const d=(e-s).toFixed(3); const c=d<50?'#A3BE8C':(d<200?'#EBCB8B':'#BF616A'); if(Oracle.config.verbosity>0){console.log(`%c[ORACLE BENCHMARK @ ${Oracle._timestamp()}: ${label}] - %cExecution Time: ${d}ms`, 'color: #8FBCBB; font-weight: bold;',`color: ${c};`); Oracle.updateHUD('c-exec-time',`${d}ms`,c);} return r;} },
    validate: (elementSelectors) => { let allFound = true; const groupMethod = Oracle.config.verbosity >= 2 ? console.group : console.groupCollapsed; groupMethod('%c[ORACLE PRE-FLIGHT VALIDATION (HEPHAESTUS)]', 'color: #D08770; font-weight: bold;'); for (const key in elementSelectors) { const selectorConfig = elementSelectors[key]; const isArray = Array.isArray(selectorConfig); const selector = isArray ? selectorConfig[0] : selectorConfig; const elements = isArray ? document.querySelectorAll(selector) : document.querySelector(selector); if ((isArray && elements.length === 0) || (!isArray && !elements)) { console.error(`%c  - ${key}: ❌ FAILED! Element not found with selector: '${selector}'`, 'color: #BF616A; font-weight: bold;'); allFound = false; } else { console.log(`%c  - ${key}: ✅ OK ('${selector}')`, 'color: #A3BE8C;'); } } const contentCount = document.querySelectorAll('.pillar-text-content').length; const wrapperCount = document.querySelectorAll('.text-anim-wrapper').length; if (contentCount !== wrapperCount) { console.error(`%c  - Pillar Integrity: ❌ FAILED! Found ${contentCount} contents and ${wrapperCount} wrappers.`, 'color: #BF616A; font-weight: bold;'); allFound = false; } else { console.log(`%c  - Pillar Integrity: ✅ OK (${contentCount} pairs)`, 'color: #A3BE8C;'); } console.groupEnd(); if (!allFound) { Oracle.updateHUD('c-validation-status', 'DOM FAIL', '#BF616A'); throw new Error("Hephaestus Validation Failed: Critical elements are missing from the DOM. Halting execution."); } Oracle.updateHUD('c-validation-status', 'PASS', '#A3BE8C'); Oracle.report("All Pre-Flight checks passed."); },
    init: (callback) => { const s=localStorage.getItem('oracleVerbosity');if(s!==null)Oracle.config.verbosity=parseInt(s,10);const p=new URLSearchParams(window.location.search);const v=p.get('oracle_verbosity');if(v!==null&&v!==''){const u=parseInt(v,10);if(!isNaN(u))Oracle.config.verbosity=u}if(callback&&typeof callback==='function')callback(); },
    _timestamp: () => new Date().toLocaleTimeString('en-US', {hour12: false}),
    log: (el, label) => { if (Oracle.config.verbosity < 1 || !el) return; const groupMethod = Oracle.config.verbosity >= 2 ? console.group : console.groupCollapsed; groupMethod(`%c[ORACLE LOG @ ${Oracle._timestamp()}: ${label}]`, 'color: #D81B60; font-weight: bold;'); const style = window.getComputedStyle(el); const transform = {scale:gsap.getProperty(el,"scale"),rotationX:gsap.getProperty(el,"rotationX"),rotationY:gsap.getProperty(el,"rotationY"),z:gsap.getProperty(el,"z")}; const bounds = el.getBoundingClientRect(); console.log(`%c  - Target:`, 'color: #81A1C1;',`${el.tagName}#${el.id||el.className.split(' ')[0]}`); console.log(`%c  - Transform:`, 'color: #81A1C1;',`{ RotX: ${transform.rotationX.toFixed(2)}, RotY: ${transform.rotationY.toFixed(2)}, Scale: ${transform.scale.toFixed(2)}, Z: ${transform.z.toFixed(2)} }`); console.log(`%c  - Style:`, 'color: #81A1C1;',`{ Opacity: ${style.opacity}, Visibility: ${style.visibility} }`); console.log(`%c  - Geometry:`, 'color: #81A1C1;',`{ X: ${bounds.left.toFixed(1)}, Y: ${bounds.top.toFixed(1)}, W: ${bounds.width.toFixed(1)}, H: ${bounds.height.toFixed(1)} }`); console.groupEnd(); },
    scan: (label, data) => { if(Oracle.config.verbosity < 1) return; const groupMethod = Oracle.config.verbosity >= 2 ? console.group : console.groupCollapsed; groupMethod(`%c[ORACLE SCAN @ ${Oracle._timestamp()}: ${label}]`, 'color: #B48EAD; font-weight: normal;'); for(const key in data) { console.log(`%c  - ${key}:`, 'color: #88C0D0;', data[key]); } console.groupEnd(); },
    group: (label) => { if(Oracle.config.verbosity < 1) return; console.group(`%c[ORACLE ACTION @ ${Oracle._timestamp()}: ${label}]`, 'color: #A3BE8C; font-weight: bold;'); },
    groupEnd: () => { if (Oracle.config.verbosity < 1) return; console.groupEnd(); },
    trackScrollTrigger: (stInstance, label) => {if(Oracle.config.verbosity<1 || !stInstance)return; const groupMethod=Oracle.config.verbosity>=2?console.group:console.groupCollapsed; groupMethod(`%c[ORACLE ST_TRACK @ ${Oracle._timestamp()}: ${label}]`,'color:#EBCB8B;font-weight:bold;'); const tE = stInstance.trigger; const s = stInstance.start, e = stInstance.end; console.log(`%c  - Target:`, 'color: #88C0D0;', `${tE.tagName}.${tE.className.split(" ")[0]}`); console.log(`%c  - Pixels:`, 'color: #88C0D0;', `Start: ${s.toFixed(0)}, End: ${e.toFixed(0)}, Dist: ${(e-s).toFixed(0)}px`); console.log(`%c  - State:`, 'color: #88C0D0;', `Active: ${stInstance.isActive}, Dir: ${stInstance.direction === 1 ? 'DOWN' : 'UP'}`); console.log(`%c  - Progress:`, 'color: #88C0D0;', `${(stInstance.progress * 100).toFixed(2)}%`); console.groupEnd();},
    report: (message) => console.log(`%c[SOVEREIGN REPORT @ ${Oracle._timestamp()}]:`, 'color: #5E81AC; font-weight: bold;', message),
    warn: (message) => console.warn(`%c[SOVEREIGN WARNING @ ${Oracle._timestamp()}]:`, 'color: #EBCB8B;', message),
    reportStatus: (message, color = '#88C0D0') => { Oracle.updateHUD('c-protocol-status', message, color); },
    updateHUD: (id, value, color = '#E5E9F0') => { const el = document.getElementById(id); if(el){el.textContent=value;el.style.color=color;} }
};

// --- UTILITY ---
const getElement = (selector, isArray = false) => { try { const result = isArray ? gsap.utils.toArray(selector) : document.querySelector(selector); return result; } catch (e) { Oracle.warn(e.message); return null; } };

// =========================================================================
//         PROMETHEUS PROTOCOL BLUEPRINTS
// =========================================================================

// --- HERO ACTOR (Unchanged) ---
const setupHeroActor = (elements, masterTl) => { masterTl.to(elements.heroActor,{rotationY:120,rotationX:10,scale:1.1,ease:"power2.inOut",duration:2}).to(elements.heroActor,{rotationY:-120,rotationX:-20,scale:1.2,ease:"power2.inOut",duration:2}); };

// --- TEXT PILLARS (Telemetry Restored) ---
const setupTextPillars = (elements, masterTl) => {
    Oracle.group("Text Pillar State Setup (Prometheus)");
    gsap.set(elements.pillars, { autoAlpha: 0 });
    gsap.set(elements.pillars[0], { autoAlpha: 1 });
    gsap.set(elements.textWrappers, { y: 40, rotationX: -15 });
    gsap.set(elements.textWrappers[0], { y: 0, rotationX: 0 });
    Oracle.log(elements.textCol, "Initial Text Pillar States Applied");
    Oracle.groupEnd();
    
    masterTl
        .to(elements.pillars[0], { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 1.0)
        .to(elements.textWrappers[0], { y: -40, rotationX: 15, duration: 0.5, ease: "power2.in" }, "<")
        .to(elements.pillars[1], { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, "<")
        .from(elements.textWrappers[1], { y: 40, rotationX: -15, duration: 0.5, ease: "power2.out" }, "<")
        .to(elements.pillars[1], { autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 3.0)
        .to(elements.textWrappers[1], { y: -40, rotationX: 15, duration: 0.5, ease: "power2.in" }, "<")
        .to(elements.pillars[2], { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, "<")
        .from(elements.textWrappers[2], { y: 40, rotationX: -15, duration: 0.5, ease: "power2.out" }, "<");
        
    Oracle.scan("Prometheus Pillar Narrative", { 'Status': 'Text Pillar chapters integrated into master timeline.' });
};

// --- HANDOFF (Full Telemetry Restored) ---
const setupHandoff = (elements, masterStoryTl) => {
    let isSwapped = false, isReversing = false;

    const performAbsorption = () => {
        if (isSwapped || isReversing) return;
        isSwapped = true;
        
        Oracle.group('ABSORPTION PROTOCOL INITIATED (Prometheus)');
        masterStoryTl.scrollTrigger.disable(false);
        Oracle.log(elements.heroActor, "Hero State (Pre-Absorption)");

        const state = Flip.getState(elements.stuntActor, { props: "transform, opacity" });
        gsap.set(elements.stuntActor, { autoAlpha: 1, x: elements.heroActor.getBoundingClientRect().left - elements.placeholder.getBoundingClientRect().left, y: elements.heroActor.getBoundingClientRect().top - elements.placeholder.getBoundingClientRect().top, scale: gsap.getProperty(elements.heroActor, "scale"), rotationX: gsap.getProperty(elements.heroActor, "rotationX"), rotationY: gsap.getProperty(elements.heroActor, "rotationY"), });
        Oracle.log(elements.stuntActor, "Stunt Double State (Teleported & Matched)");

        const absorptionTl = gsap.timeline({
            onComplete: () => {
                masterStoryTl.scrollTrigger.enable();
                Oracle.log(elements.stuntActor, "Absorption Complete");
                Oracle.groupEnd();
            }
        });

        absorptionTl.add(Flip.from(state, { 
            targets: elements.stuntActor, duration: 1.5, ease: 'power3.inOut',
            onUpdate: function() {
                // Granular Vector Trace - RESTORED
                Oracle.scan('Absorption Vector Trace', { 'Progress': `${(this.progress() * 100).toFixed(1)}%`, 'Scale': gsap.getProperty(elements.stuntActor, 'scale').toFixed(2) });
            }
        }));
        absorptionTl
            .to(elements.heroActor, { autoAlpha: 0, duration: 0.4 }, 0)
            .to(elements.stuntActor.querySelectorAll('.face:not(.front)'), { opacity: 0, duration: 0.6 }, 0.6)
            .to(elements.stuntActor, { rotationX: 0, rotationY: 0, duration: 0.8, ease: "power3.inOut" }, ">-0.5")
            .call(() => elements.stuntActor.classList.add('is-logo-final-state'), [], '>');
    };

    const performReversal = () => { if (!isSwapped) return; isReversing = true; Oracle.group('REVERSAL PROTOCOL INITIATED (Prometheus)'); elements.stuntActor.classList.remove('is-logo-final-state'); gsap.killTweensOf([elements.stuntActor, elements.heroActor]); gsap.set(elements.stuntActor, { autoAlpha: 0 }); gsap.set(elements.heroActor, { autoAlpha: 1 }); masterStoryTl.scrollTrigger.enable(); masterStoryTl.scrollTrigger.update(); isSwapped = false; isReversing = false; Oracle.log(elements.heroActor, "Reversal Complete"); Oracle.groupEnd(); };
    
    ScrollTrigger.create({ trigger: elements.handoffPoint, start: 'top 80%', onEnter: performAbsorption, onLeaveBack: performReversal });
};


// =========================================================================
//         PROMETHEUS ARCHITECTURE v47: Full Telemetry
// =========================================================================
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    Oracle.report(`Sovereign Build v47 "Prometheus" Initialized. Verbosity: ${Oracle.config.verbosity}`);
    Oracle.updateHUD('c-oracle-version', 'PROMETHEUS', '#A3BE8C');

    const requiredSelectors = { heroActor: '#actor-3d', stuntActor: '#actor-3d-stunt-double', placeholder: '#summary-placeholder', pillars: ['.pillar-text-content', true], textWrappers: ['.text-anim-wrapper', true], visualsCol: '.pillar-visuals-col', textCol: '.pillar-text-col', handoffPoint: '#handoff-point' };
    try { Oracle.validate(requiredSelectors); } catch (e) { Oracle.warn(e.message); return; }
    const elements = Object.keys(requiredSelectors).reduce((acc, key) => { const s = requiredSelectors[key]; const i = Array.isArray(s); acc[key] = getElement(i ? s[0] : s, i); return acc; }, {});
    
    const ctx = Oracle.performance.benchmark('Sovereign Animation Architecture Setup', () => {
        return gsap.context(() => {
            const scrubValue = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? false : 1.5;
            ScrollTrigger.matchMedia({
                '(min-width: 1025px)': () => {
                    ScrollTrigger.create({ trigger: elements.textCol, pin: elements.visualsCol, start: 'top top', end: 'bottom bottom' });
                    
                    const throttledLogger = Oracle.utility.throttle((self) => {
                        const hero = elements.heroActor;
                        Oracle.scan('Live Story Scrub', { 'Progress': `${(self.progress * 100).toFixed(0)}%`, 'RotX': gsap.getProperty(hero, "rotationX").toFixed(1), 'Scale': gsap.getProperty(hero, "scale").toFixed(2) });
                        Oracle.trackScrollTrigger(self, "Unified Story Controller"); // RESTORED
                    }, 150);

                    const masterStoryTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: elements.textCol, start: 'top top', end: 'bottom bottom', scrub: scrubValue,
                            onUpdate: (self) => { Oracle.updateHUD('c-scroll', `${(self.progress * 100).toFixed(0)}%`); throttledLogger(self); }
                        }
                    });
                    
                    setupHeroActor(elements, masterTl);
                    setupTextPillars(elements, masterTl);
                    setupHandoff(elements, masterTl);
                },
            });
            Oracle.updateHUD('c-st-instances', ScrollTrigger.getAll().length);
        });
    });
    return ctx;
}

// =========================================================================
//         SITE LOGIC & INITIALIZATION
// =========================================================================
function setupSiteLogic() {
    const menuOpen = document.querySelector('#menu-open-button');
    const menuClose = document.querySelector('#menu-close-button');
    const menuScreen = document.querySelector('#menu-screen');
    const root = document.documentElement;
    if (menuOpen && menuClose && menuScreen) {
        menuOpen.addEventListener('click', () => root.classList.add('menu-open'));
        menuClose.addEventListener('click', () => root.classList.remove('menu-open'));
    }
    const yearEl = document.querySelector('#current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function initialAnimationSetup() {
    if (window.gsap && window.ScrollTrigger && window.Flip) { Oracle.init(setupAnimations); } 
    else { Oracle.warn("GSAP libraries failed to load. SOVEREIGN protocol aborted."); }
}

document.addEventListener("DOMContentLoaded", setupSiteLogic);
window.addEventListener("load", initialAnimationSetup);
