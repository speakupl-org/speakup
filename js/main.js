/*
========================================================================================
   THE DEFINITIVE COVENANT BUILD v37.1 - "The Overlord" Protocol Enhanced
   
   Build v37.1 enhances the Panopticon HUD to provide context-aware telemetry on
   pillar transitions, reinforcing the Sovereign Mandate's principle of presenting
   synthesized intelligence over raw data. Sophistication is intelligence.
========================================================================================
*/

// Oracle v37.1 - The "Panopticon Oracle"
const Oracle = {
    log: (el, label) => {
        if (!el) { console.error(`%c[ORACLE LOG: ${label}]%c ERROR - Target element is null.`, 'color: #D81B60; font-weight: bold;', 'color: #BF616A;'); return; }
        const style = window.getComputedStyle(el);
        const transform = { scale: gsap.getProperty(el, "scale"), rotationX: gsap.getProperty(el, "rotationX"), rotationY: gsap.getProperty(el, "rotationY"), z: gsap.getProperty(el, "z") };
        console.log( `%c[ORACLE LOG: ${label}]`, 'color: #D81B60; font-weight: bold;', `\n  - Target: ${el.tagName}#${el.id || '(no id)'}.${el.className.split(' ').join('.')}`, `\n  - Transform: { RotX: ${transform.rotationX.toFixed(1)}, RotY: ${transform.rotationY.toFixed(1)}, Scale: ${transform.scale.toFixed(2)}, Z: ${transform.z.toFixed(1)} }`, `\n  - Style: { Opacity: ${gsap.getProperty(el, "autoAlpha").toFixed(2)}, Visibility: ${style.visibility} }` );
    },
    telemetry: (label, st) => { console.log( `%c[ORACLE TELEMETRY: ${label} @ ${(st.progress * 100).toFixed(1)}%]`, 'color: #5E81AC;', `| Active: ${st.isActive}` ); },
    group: (label) => console.group(`%c[ORACLE ACTION: ${label}]`, 'color: #A3BE8C; font-weight: bold;'),
    groupEnd: () => console.groupEnd(),
    report: (message) => console.log(`%c[CITADEL REPORT]`, 'color: #88C0D0; font-weight: bold;', message),
    warn: (message) => console.warn(`%c[CITADEL WARNING]`, 'color: #EBCB8B;', message),
    updateHUD: (id, value, color = '#E5E9F0') => {
        const el = document.getElementById(id);
        if (el) { el.textContent = value; el.style.color = color; }
    }
};

// Utility to safely get elements
const getElement = (selector, isArray = false) => {
    try {
        const result = isArray ? gsap.utils.toArray(selector) : document.querySelector(selector);
        if (!result || (isArray && !result.length)) throw new Error(`Element(s) not found: ${selector}`);
        return result;
    } catch (e) { Oracle.warn(e.message); return null; }
};

const setupHeroActorRotation = (tl, heroActor) => {
    tl.to(heroActor, { rotationY: 120, rotationX: 10, scale: 1.1, ease: "power2.inOut", duration: 2 })
      .to(heroActor, { rotationY: -120, rotationX: -20, scale: 1.2, ease: "power2.inOut", duration: 2 });
};

// ENHANCED Text pillars animation with deep HUD integration
const setupTextPillars = (elements) => {
    elements.pillars.forEach((pillar, index) => {
        const wrapper = elements.textWrappers[index];
        if (index > 0) gsap.set(wrapper, { autoAlpha: 0, y: 40, rotationX: -15 });

        if (index < elements.pillars.length - 1) {
            const nextWrapper = elements.textWrappers[index + 1];
            const pillarTl = gsap.timeline();
            pillarTl
                .to(wrapper, { autoAlpha: 0, y: -40, rotationX: 15, ease: "power2.in" })
                .to(nextWrapper, { autoAlpha: 1, y: 0, rotationX: 0, ease: "power2.out" }, "<");
            ScrollTrigger.create({
                animation: pillarTl,
                trigger: pillar,
                start: "top 70%",
                end: "center center",
                scrub: 1.5,
                onEnter: () => Oracle.report(`Pillar ${index + 1} -> ${index+2} sequence initiated.`),
                onLeave: () => Oracle.updateHUD('c-active-pillar-info', 'INACTIVE', '#E5E9F0'),
                onEnterBack: () => Oracle.report(`Pillar ${index + 1} -> ${index+2} sequence re-initiated (reverse).`),
                onLeaveBack: () => Oracle.updateHUD('c-active-pillar-info', 'INACTIVE', '#E5E9F0'),
                onUpdate: () => {
                    Oracle.updateHUD('c-event', `Pillar Swap`);
                    Oracle.updateHUD('c-active-pillar-info', `P${index + 1} > P${index + 2}`, '#A3BE8C');
                }
            });
        }
    });
};

// SOVEREIGN HANDOFF ARCHITECTURE
const setupSovereignController = (elements) => {
    const masterTl = gsap.timeline();
    setupHeroActorRotation(masterTl, elements.heroActor);

    ScrollTrigger.create({
        animation: masterTl,
        trigger: elements.visualsCol,
        pin: true,
        start: 'top top',
        endTrigger: elements.handoffPoint,
        end: 'top 70%',
        scrub: 1.5,
        onUpdate: (self) => {
            const isActive = self.isActive;
            Oracle.telemetry("Master Controller", self);
            Oracle.updateHUD('c-master-st-active', isActive ? 'TRUE' : 'FALSE', isActive ? '#A3BE8C' : '#BF616A');
            if (isActive) {
                Oracle.updateHUD('c-event', 'Hero Scrub');
                Oracle.updateHUD('c-active-pillar-info', 'INACTIVE', '#E5E9F0');
                Oracle.updateHUD('c-rot-x', gsap.getProperty(elements.heroActor, "rotationX").toFixed(1));
                Oracle.updateHUD('c-rot-y', gsap.getProperty(elements.heroActor, "rotationY").toFixed(1));
                Oracle.updateHUD('c-scale', gsap.getProperty(elements.heroActor, "scale").toFixed(2));
            }
        }
    });

    const handoffTl = gsap.timeline();
    const state = Flip.getState(elements.heroActor, { props: "x,y,scale,rotationX,rotationY" });
    handoffTl
      .set(elements.stuntActor, { autoAlpha: 1 })
      .set(elements.heroActor, { autoAlpha: 0 })
      .add(Flip.from(state, { targets: elements.stuntActor, duration: 1, ease: 'power3.inOut' }))
      .to(elements.stuntActorFaces, { opacity: 0, duration: 0.3, ease: "power2.in" }, "-=0.7");
      
    ScrollTrigger.create({
        animation: handoffTl,
        trigger: elements.handoffPoint,
        start: 'top 70%',
        end: '+=200%',
        pin: elements.visualsCol,
        scrub: 1.5,
        onUpdate: (self) => {
            const isActive = self.isActive;
            Oracle.telemetry("Handoff Controller", self);
            Oracle.updateHUD('c-handoff-st-active', isActive ? 'TRUE' : 'FALSE', isActive ? '#A3BE8C' : '#BF616A');
            if(isActive){
                Oracle.updateHUD('c-event', 'Handoff Scrub');
                Oracle.updateHUD('c-active-pillar-info', 'INACTIVE', '#E5E9F0');
                Oracle.updateHUD('c-rot-x', gsap.getProperty(elements.stuntActor, "rotationX").toFixed(1));
                Oracle.updateHUD('c-rot-y', gsap.getProperty(elements.stuntActor, "rotationY").toFixed(1));
                Oracle.updateHUD('c-scale', gsap.getProperty(elements.stuntActor, "scale").toFixed(2));
            }
        }
    });
};

// Main animation setup
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip);
    console.clear();
    Oracle.report('GSAP Covenant Build v37.1 Initialized. [SOVEREIGN MANDATE, PANOPTICON ENHANCED]');
    const ctx = gsap.context(() => {
        const elements = {
            heroActor: getElement('#actor-3d'), stuntActor: getElement('#actor-3d-stunt-double'), placeholder: getElement('#summary-placeholder'), pillars: getElement('.pillar-text-content', true),
            textWrappers: getElement('.text-anim-wrapper', true), visualsCol: getElement('.pillar-visuals-col'), textCol: getElement('.pillar-text-col'), handoffPoint: getElement('#handoff-point'),
            stuntActorFaces: getElement('#actor-3d-stunt-double .face:not(.front)', true)
        };
        if (Object.values(elements).some(el => !el)) { Oracle.warn('OVERLORD ABORT: Missing critical elements.'); return; }
        Oracle.report("Overlord components verified.");
        elements.placeholder.appendChild(elements.stuntActor);
        gsap.set(elements.stuntActor, { autoAlpha: 0 });
        ScrollTrigger.matchMedia({
            '(min-width: 1025px)': () => {
                setupTextPillars(elements);
                setupSovereignController(elements);
            },
            '(max-width: 1024px)': () => { 
                setupTextPillars(elements);
                gsap.to(elements.heroActor, {
                    scrollTrigger: { trigger: elements.textCol, start: 'top 20%', end: 'bottom bottom', scrub: 1.5 },
                    scale: 0.9, rotationY: 30, ease: "none"
                });
            }
        });
    });
    return ctx;
}

// Site Logic and Initialization
function setupSiteLogic() {
    const menuOpen = getElement('#menu-open-button'); const menuClose = getElement('#menu-close-button'); const menuScreen = getElement('#menu-screen');
    const root = document.documentElement;
    if (menuOpen && menuClose && menuScreen) {
        menuOpen.addEventListener('click', () => root.classList.add('menu-open'));
        menuClose.addEventListener('click', () => root.classList.remove('menu-open'));
    }
    const yearEl = getElement('#current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    Oracle.report("Site logic initialized.");
}
function initialAnimationSetup() {
    if (window.gsap && window.ScrollTrigger && window.Flip) { setupAnimations(); } 
    else { Oracle.warn("GSAP libraries failed to load. Animations aborted."); }
}
document.addEventListener("DOMContentLoaded", setupSiteLogic);
window.addEventListener("load", initialAnimationSetup);
