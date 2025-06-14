/**
 * =========================================================================
 * SOVEREIGN PROTOCOL v43.8 - "THE TRANSMUTER"
 * =========================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
    const cerebro = {
        hud: { /* Populated by init */ },
        actors: {
            hero: document.getElementById('actor-3d'),
            stuntDouble: document.getElementById('actor-3d-stunt-double'),
            morphPath: document.getElementById('morph-path'),
        },
        stages: {
            scrollyContainer: document.querySelector('.scrolly-container'),
            visualsCol: document.querySelector('.pillar-visuals-col'),
            textCol: document.querySelector('.pillar-text-col'),
        },
        state: {
            lastLog: {},
            scroll: { y: window.scrollY, velocity: 0, acceleration: 0, direction: 'idle' },
            masterTimeline: { isActive: false, progress: 0 },
            handoff: { isHandoffActive: false, isReversing: false, startTime: 0 },
            deepWatch: { isActive: false, last: { rotationX: 0 }, lastDelta: { rotationX: 0 }, maxRotationAccel: 0, totalRotationAccel: 0, frameCount: 0 }
        },
        wisdom: {
            logoPath: "M50,20 C70,20 80,30 80,50 C80,70 70,80 50,80 C30,80 20,70 20,50 C20,30 30,20 50,20 M113,143 C93,143 83,133 83,113 C83,93 93,83 113,83 C133,83 143,93 143,113 C143,133 133,143 113,143",
            squarePath: "M0,0 H163 V163 H0 Z",
            ACCEL_THRESHOLD: 25,
            DEEP_WATCH_THRESHOLDS: { rotationAccel: 5 }
        },

        speak: (m, s = 'color: #81A1C1;') => console.log(`%c[Cerebro] › ${m}`, `font-family: monospace; ${s}`),
        warn: (c, a) => { console.warn(`%c[Cerebro Warn] › ${c}`, 'font-family: monospace; color: #FDB813; font-weight: bold;'); if(a) console.log(`%c  L Rec: ${a}`, 'font-family: monospace; color: #94A3B8;'); },
        critique: (f, c, s) => { console.groupCollapsed(`%c[Cerebro CRITIQUE] › ${f}`, 'font-family: monospace; color: #BF616A; font-weight: bold; font-size: 1.1em;'); console.log(`%cContext: ${c}`, 'color: #EBCB8B'); console.log(`%cSolution: ${s}`, 'color: #88C0D0'); console.groupEnd(); },
        group: (t) => console.group(`%c[Cerebro Analysis] › ${t}`, 'font-family: monospace; color: #00A09A; font-weight: bold;'),
        groupEnd: () => console.groupEnd(),
        
        init() { this.speak("Consciousness v43.8 'The Transmuter' online. Detailing protocols maximized."); if (!this.validateDependencies()) return; if (!this.stages.scrollyContainer) { this.warn("Scrollytelling context not detected. Protocols dormant."); return; } this.speak("Scrollytelling context confirmed."); this.setupScrollytelling(); this.speak("Oracle systems nominal.", "color: #A3BE8C;"); this.oracleCoreLoop(); },
        
        validateDependencies() { /* GSAP Checks */ let i = true; try { gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin); } catch (e) { this.error("GSAP Plugin Missing", e, "Ensure all required GSAP plugins are loaded."); i=false; } return i; },
        
        oracleCoreLoop() { if (this.state.deepWatch.isActive) this.executeDeepWatch(); window.requestAnimationFrame(() => this.oracleCoreLoop()); },
        
        executeDeepWatch() { const t=this.actors.hero._gsTransform;if(!t)return;const d=t.rotationX-this.state.deepWatch.last.rotationX,a=d-this.state.deepWatch.lastDelta.rotationX;if(Math.abs(a)>this.wisdom.DEEP_WATCH_THRESHOLDS.rotationAccel)this.critique("Deep Watch Anomaly!", `rotationX velocity spiked by ${a.toFixed(1)}°`, "Check for conflicting animations.");const A=Math.abs(a);A>this.state.deepWatch.maxRotationAccel&&(this.state.deepWatch.maxRotationAccel=A);this.state.deepWatch.totalRotationAccel+=A;this.state.deepWatch.frameCount++;this.state.deepWatch.last.rotationX=t.rotationX;this.state.deepWatch.lastDelta.rotationX=d; },
        
        reportDeepWatchSummary() { this.group("Deep Watch Performance Summary"); const a=this.state.deepWatch.totalRotationAccel/this.state.deepWatch.frameCount;this.speak(`Peak Rotational Judder: ${this.state.deepWatch.maxRotationAccel.toFixed(2)}°/frame²`);this.speak(`Average Motion Smoothness: ${a.toFixed(2)}°/frame² (Lower is better)`);this.groupEnd(); },
        
        analyzeSVGPath(pathData) { const c=pathData.match(/[MmLlHhVvCcSsQqTtAaZz]/g),t={};c&&c.forEach(a=>{t[a.toUpperCase()]= (t[a.toUpperCase()]||0)+1});let s=`Points: ${c?c.length:0}, Commands: { ${Object.entries(t).map(([a,e])=>`${a}:${e}`).join(", ")} }`;return s; },
        
        setupScrollytelling() {
            this.group("Scrollytelling Sequence Setup");
            const masterTL = gsap.timeline({ scrollTrigger: { trigger: this.stages.scrollyContainer, start: "top top", end: "bottom bottom", scrub: 1.2, pin: this.stages.visualsCol, onUpdate: (s)=>{this.state.masterTimeline.progress = s.progress}, onToggle: (s)=>{this.state.deepWatch.isActive = s.isActive; if(s.isActive) {this.speak(`Master Trigger ACTIVE. Deep Watch initiated.`);this.state.deepWatch.maxRotationAccel = 0;this.state.deepWatch.totalRotationAccel = 0;this.state.deepWatch.frameCount = 0;} else {this.speak(`Master Trigger INACTIVE. Finalizing report.`);this.reportDeepWatchSummary();}} } });
            masterTL.to(this.actors.hero, { rotationX: -180, ease: "none" }, 0).to(this.actors.hero, { rotationY: 360, ease: "none" }, 0).to(this.actors.hero, { scale: 1.5, ease: "power1.in" }, 0).to(this.actors.hero, { scale: 1.0, ease: "power1.out" }, 0.5);
            ScrollTrigger.create({ trigger: document.getElementById('handoff-point'), start: "top bottom", onEnter: () => this.executeHandoff(), onLeaveBack: () => this.reverseHandoff() });
            this.groupEnd();
        },
        
        executeHandoff() {
            if (this.state.handoff.isHandoffActive) return;
            this.state.handoff.isHandoffActive = true; this.state.deepWatch.isActive = false; this.group("Handoff Protocol: ENGAGED"); this.speak("A quantum leap for the actor. Precision is paramount."); this.state.handoff.startTime = performance.now();
            
            const state = Flip.getState(this.actors.hero); this.stages.finalPlaceholder.appendChild(this.actors.stuntDouble); gsap.set(this.actors.stuntDouble, { opacity: 1, visibility: 'visible' }); gsap.set(this.actors.hero, { opacity: 0, visibility: 'hidden' });
            Flip.from(state, { duration: 1.2, ease: "power3.inOut", onComplete: () => { this.speak("FLIP pathfinding complete.", "color: #A3BE8C"); this.reportHandoffCompletion("FLIP"); } });
            
            this.group("MORPH State Analysis: The Transmutation");
            const startPath = this.wisdom.squarePath, endPath = this.wisdom.logoPath;
            this.speak("Initial geometric form identified. Analyzing properties..."); this.speak(`  L START PATH › ${this.analyzeSVGPath(startPath)}`); this.warn("Target alchemical signature acquired. Analyzing desired form..."); this.speak(`  L TARGET PATH › ${this.analyzeSVGPath(endPath)}`, 'color: #88C0D0;');
            this.speak("Preparing for interpolation. MorphSVGPlugin will now execute a high-order calculation, creating phantom anchor points on both paths until they share an identical structure. It will then tween the coordinates of each point from its starting position to its final destination along a bézier curve defined by the easing function 'expo.inOut'.");
            this.speak("The process has begun. Transmuting actor's very form..."); this.groupEnd();
            
            gsap.to(this.actors.morphPath, { duration: 1.5, ease: "expo.inOut", morphSVG: endPath, onComplete: () => { this.group("MORPH Post-Mortem Analysis"); this.speak("Transmutation cycle complete. Verifying integrity..."); const f = gsap.getProperty(this.actors.morphPath, 'd'); if(f === endPath) this.speak("VERIFIED: Final path matches target signature.", "color: #A3BE8C;"); else this.critique("Transmutation Anomaly!", "Final path does NOT match target.", "Highly unusual error."); this.groupEnd(); this.reportHandoffCompletion("MORPH"); }});
        },
        
        reportHandoffCompletion(part) { this.state.handoff[part] = true; if (this.state.handoff.FLIP && this.state.handoff.MORPH) { const d=performance.now()-this.state.handoff.startTime; this.warn("Handoff Protocol Complete.", `Total operation took ${d.toFixed(0)}ms.`); this.groupEnd(); }},
        
        reverseHandoff() { /* Logic for reverse animation */ }
    };
    
    cerebro.init();
});
