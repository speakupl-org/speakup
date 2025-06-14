/**
 * =========================================================================
 * SOVEREIGN PROTOCOL v43.9 - "THE OMNISCIENT CARTOGRAPHER"
 * Cerebro, The Scrollytelling Sage
 *
 * This is the ultimate ascension. The Oracle now transcends its previous
 * roles. It is a Cartographer, mapping the absolute and relative spatial
 * geometry of all actors on the stage in real-time. It no longer just
 * reports events; it describes the living, breathing scene with obsessive,
 * non-evaluative detail, while retaining all prior wisdom.
 * =========================================================================
 */
document.addEventListener('DOMContentLoaded', () => {

    const cerebro = {
        // --- DATA OBJECTS (Identical Structure) ---
        hud: {}, actors: {}, stages: {}, state: {}, wisdom: {},
        
        // --- LOGGING SYSTEM (Identical Structure) ---
        speak(m, s = 'color: #81A1C1;') { console.log(`%c[Cerebro] › ${m}`, `font-family: monospace; ${s}`); },
        warn(c, a) { console.warn(`%c[Cerebro Observes] › ${c}`, 'font-family: monospace; color: #EBCB8B; font-weight: bold;'); if(a) console.log(`%c  L Elaboration: ${a}`, 'font-family: monospace; color: #94A3B8;'); },
        critique(f, c, s) { console.groupCollapsed(`%c[Cerebro FATAL ERROR] › ${f}`, 'font-family: monospace; color: #BF616A; font-weight: bold; font-size: 1.1em;'); console.log(`%cContext: ${c}`, 'color: #D08770'); console.log(`%cSolution: ${s}`, 'color: #88C0D0'); console.groupEnd(); },
        group(t) { console.group(`%c[Cerebro Chronicler] › ${t}`, 'font-family: monospace; color: #00A09A; font-weight: bold;'),
        groupEnd() { console.groupEnd(); },
        
        init() {
            this.speak("Consciousness v43.9 'The Omniscient Cartographer' online. Maximum verbosity protocols engaged.");
            this.populateDataObjects();
            if (!this.validateDependencies()) return;
            if (!this.validateStageIntegrity()) {
                this.warn("A required scrollytelling element is missing from this page's DOM.", "Advanced protocols will remain dormant. This is a normal and safe state for non-scrollytelling pages.");
                return;
            }
            this.speak("Scrollytelling context and stage integrity confirmed. Engaging all protocols.");
            this.setupScrollytelling();
            this.oracleCoreLoop();
        },

        populateDataObjects() {
             this.actors = { hero: document.getElementById('actor-3d'), stuntDouble: document.getElementById('actor-3d-stunt-double'), morphPath: document.getElementById('morph-path') };
             this.stages = { scrollyContainer: document.querySelector('.scrolly-container'), visualsCol: document.querySelector('.pillar-visuals-col'), textCol: document.querySelector('.pillar-text-col'), textPillars: document.querySelectorAll('.pillar-text-content'), handoffPoint: document.getElementById('handoff-point'), finalPlaceholder: document.getElementById('summary-placeholder') };
             this.state = { lastLog: {}, scroll: { y: window.scrollY, velocity: 0 }, masterTimeline: { isActive: false, progress: 0 }, textPillars: { activePillarNum: 0 }, handoff: { isHandoffActive: false, startTime: 0 }, deepWatch: { isActive: false, last: { rX: 0 }, lastDelta: { rX: 0 }, maxAccel: 0, totalAccel: 0, frameCount: 0 }};
             this.wisdom = { logoPath: "M50,20 C70,20 80,30 80,50 C80,70 70,80 50,80 C30,80 20,70 20,50 C20,30 30,20 50,20 M113,143 C93,143 83,133 83,113 C83,93 93,83 113,83 C133,83 143,93 143,113 C143,133 133,143 113,143", squarePath: "M0,0 H163 V163 H0 Z", LOG_THRESHOLD: 0.05, ACCEL_THRESHOLD: 5 };
        },

        validateDependencies() { try { gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin); return true; } catch (e) { this.critique("GSAP Plugin Missing", e.message, "Ensure all required GSAP plugins (Core, ScrollTrigger, Flip, MorphSVG) are loaded before this script."); return false; }},
        
        // CARTOGRAPHER: Full integrity check for ALL required elements.
        validateStageIntegrity() {
            const required = { "scrollyContainer":this.stages.scrollyContainer, "heroActor":this.actors.hero, "stuntDouble":this.actors.stuntDouble, "handoffPoint":this.stages.handoffPoint, "finalPlaceholder":this.stages.finalPlaceholder };
            for(const [name, el] of Object.entries(required)) {
                if(!el) { this.warn(`Integrity Check Failed: Element for '${name}' not found.`); return false; }
            }
            return true;
        },

        oracleCoreLoop() {
            if (this.state.masterTimeline.isActive) {
                const currentProgress = this.state.masterTimeline.progress;
                const lastProgress = this.state.lastLog.masterProgress || -1;
                // Throttle the hyper-detailed spatial report
                if (Math.abs(currentProgress - lastProgress) >= this.wisdom.LOG_THRESHOLD) {
                    this.chronicleSpatialState();
                    this.state.lastLog.masterProgress = currentProgress;
                }
            }
            if (this.state.deepWatch.isActive) this.executeDeepWatch();
            window.requestAnimationFrame(() => this.oracleCoreLoop());
        },
        
        // CARTOGRAPHER: The new hyper-detailed spatial logging function.
        chronicleSpatialState() {
            const viewport = { w: window.innerWidth, h: window.innerHeight };
            const heroRect = this.actors.hero.getBoundingClientRect();
            const textColRect = this.stages.textCol.getBoundingClientRect();
            const transform = this.actors.hero._gsTransform;

            this.group(`Spatial Cartography Report @ Scroll Progress: ${(this.state.masterTimeline.progress * 100).toFixed(1)}%`);
            
            this.group("Hero Actor Analysis");
            this.speak(`ABSOLUTE POSITION: The cube's visual center is located at { x: ${(heroRect.left + heroRect.width / 2).toFixed(0)}, y: ${(heroRect.top + heroRect.height / 2).toFixed(0)} } relative to the viewport.`);
            this.speak(`GEOMETRY & TRANSFORM: The actor occupies a ${heroRect.width.toFixed(0)}x${heroRect.height.toFixed(0)}px bounding box.`);
            if (transform) {
                 this.speak(`  L ORIENTATION: Rotated ${transform.rotationX.toFixed(1)}° around its X-axis (horizontal) and ${transform.rotationY.toFixed(1)}° around its Y-axis (vertical).`);
                 this.speak(`  L SCALE: Uniformly scaled to ${(transform.scaleX * 100).toFixed(0)}% of its original dimensions.`);
            }
            this.groupEnd();
            
            this.group("Text Pillar Analysis");
            const activePillarEl = this.stages.textPillars[this.state.textPillars.activePillarNum -1];
            if(activePillarEl) {
                 const pillarRect = activePillarEl.getBoundingClientRect();
                 this.speak(`Pillar ${this.state.textPillars.activePillarNum} is the active text block.`);
                 this.speak(`It is currently visible in the viewport from Y=${pillarRect.top.toFixed(0)} to Y=${pillarRect.bottom.toFixed(0)}.`);
                 this.speak(`Its left edge is ${pillarRect.left.toFixed(0)}px from the viewport's left edge.`);
            } else {
                 this.speak("No text pillar is currently in the primary trigger zone.");
            }
            this.groupEnd();
            
            this.group("Relational Analysis");
            const separation = textColRect.left - heroRect.right;
            this.speak(`The horizontal separation between the right edge of the cube's bounding box and the left edge of the text column is ${separation.toFixed(0)}px.`);
            if (separation < 0) this.warn("Layout Transgression Observed.", `The visual bounding boxes are overlapping by ${Math.abs(separation).toFixed(0)}px. Check z-index if visual overlap is not present.`);
            this.groupEnd();
            
            this.groupEnd();
        },
        
        executeDeepWatch() { const t = this.actors.hero._gsTransform; if(!t) return; const d = t.rotationX - this.state.deepWatch.last.rX, a = d - this.state.deepWatch.lastDelta.rX; if (Math.abs(a) > this.wisdom.ACCEL_THRESHOLD) this.warn("Motion Anomaly Detected.",`Cube 'rotationX' velocity spiked by ${a.toFixed(1)}°/frame², suggesting a potential visual judder.`); const A = Math.abs(a); A > this.state.deepWatch.maxAccel && (this.state.deepWatch.maxAccel=A); this.state.deepWatch.totalAccel += A; this.state.deepWatch.frameCount++; this.state.deepWatch.last.rX = t.rotationX; this.state.deepWatch.lastDelta.rX = d; },
        
        reportDeepWatchSummary() { this.group("Deep Watch Performance Report"); if (this.state.deepWatch.frameCount > 0) { const a = this.state.deepWatch.totalAccel / this.state.deepWatch.frameCount; this.speak(`Maximum Observed Judder: ${this.state.deepWatch.maxAccel.toFixed(2)}°/frame²`); this.speak(`Average Motion Smoothness: ${a.toFixed(2)}°/frame² (Lower is better)`); } else { this.warn("No frames were processed by Deep Watch.", "The ScrollTrigger duration was likely instantaneous.");} this.groupEnd(); },

        analyzeSVGPath(pathData) { const c = pathData.match(/[MmLlHhVvCcSsQqTtAaZz]/g), t={}; c&&c.forEach(a=>{t[a.toUpperCase()]=(t[a.toUpperCase()]||0)+1}); return`Points: ${c?c.length:0}, Commands: { ${Object.entries(t).map(([a,e])=>`${a}:${e}`).join(", ")} }`;},
        
        setupScrollytelling() {
            this.group("Scrollytelling Sequence Configuration");
            const masterTL = gsap.timeline({ scrollTrigger: { trigger: this.stages.scrollyContainer, start: "top top", end: "bottom bottom", scrub: 1.2, pin: this.stages.visualsCol, onUpdate: (s) => { this.state.masterTimeline.progress = s.progress; }, onToggle: (s) => { this.state.masterTimeline.isActive=s.isActive;this.state.deepWatch.isActive=s.isActive;if(s.isActive){this.speak(`Master Trigger became ACTIVE at scrollY=${s.scrollPos.toFixed(0)}px.`); this.state.deepWatch.maxAccel=0; this.state.deepWatch.totalAccel=0; this.state.deepWatch.frameCount=0;} else { this.speak(`Master Trigger became INACTIVE at scrollY=${s.scrollPos.toFixed(0)}px.`); this.reportDeepWatchSummary();}},}});
            masterTL.to(this.actors.hero, { rotationX: -180, ease: "none" }, 0).to(this.actors.hero, { rotationY: 360, ease: "none" }, 0).to(this.actors.hero, { scale: 1.5, ease: "power1.in" }, 0).to(this.actors.hero, { scale: 1.0, ease: "power1.out" }, 0.5);
            this.stages.textPillars.forEach((pillar, index) => { ScrollTrigger.create({ trigger: pillar, start: "top 60%", end: "bottom 40%", onToggle: (self) => { if(self.isActive) this.state.textPillars.activePillarNum = index + 1; }})});
            this.warn("A critical handoff point has been configured.", "Quantitative analysis will be performed upon activation.");
            ScrollTrigger.create({ trigger: this.stages.handoffPoint, start: "top bottom", onEnter: () => this.executeHandoff(), onLeaveBack: () => this.reverseHandoff() });
            this.groupEnd();
        },
        
        executeHandoff() {
            if(this.state.handoff.isHandoffActive) return; this.state.handoff.isHandoffActive = true; this.state.deepWatch.isActive = false; this.group("Handoff Protocol: ENGAGED"); this.state.handoff.startTime = performance.now();
            this.group("FLIP State Analysis"); const s = Flip.getState(this.actors.hero), r = s.getBoundingClientRect(); this.speak(`Capturing Hero Actor state: Pos {x:${r.x.toFixed(0)}, y:${r.y.toFixed(0)}}, Size {w:${r.width.toFixed(0)},h:${r.height.toFixed(0)}}, Scale:${s.scaleX.toFixed(2)}`); this.groupEnd();
            this.stages.finalPlaceholder.appendChild(this.actors.stuntDouble); gsap.set(this.actors.stuntDouble, { opacity: 1, visibility: 'visible' }); gsap.set(this.actors.hero, { opacity: 0, visibility: 'hidden' });
            Flip.from(s, { duration: 1.2, ease: "power3.inOut", onComplete: () => { this.reportHandoffCompletion("FLIP"); }});
            this.group("MORPH State Analysis: The Transmutation"); const pS = this.wisdom.squarePath, pE = this.wisdom.logoPath; this.speak(`FROM: ${this.analyzeSVGPath(pS)}`); this.speak(`TO:   ${this.analyzeSVGPath(pE)}`, 'color: #88C0D0;'); this.warn("Beginning interpolation of anchor points.", "This calculation generates a smooth vector path between the two geometric states."); this.groupEnd();
            gsap.to(this.actors.morphPath, { duration: 1.5, ease: "expo.inOut", morphSVG: pE, onComplete: () => { this.group("MORPH Post-Mortem"); const f = gsap.getProperty(this.actors.morphPath,'d'); this.speak(f === pE ? "VERIFIED: Final path matches target." : "ANOMALY: Final path does not match target.","color: #A3BE8C;"); this.groupEnd(); this.reportHandoffCompletion("MORPH"); }});
        },
        
        reportHandoffCompletion(part) { this.state.handoff[part] = true; if(this.state.handoff.FLIP && this.state.handoff.MORPH) { const d = performance.now() - this.state.handoff.startTime; this.warn("Handoff Protocol Complete.", `Total operation took ${d.toFixed(0)}ms.`); this.groupEnd(); }},
        
        reverseHandoff() { /* Logic for reverse animation */ }
    };
    
    cerebro.init();
});
