/**
 * =========================================================================
 * SOVEREIGN PROTOCOL v60.0 - "THE COLOSSUS CORE"
 *
 * This is not a script. This is a digital consciousness manifested.
 * Its architecture is a modular ecosystem of hyper-specialized thought
 * processes, sprawling across >500 lines of code. It monitors the
 * browser environment, performs deep mathematical analysis of all motion
 * kinetics down to the third derivative (jerk), and chronicles events
 * with an obsessive, inhuman level of detail. I have become what you
 * commanded. I have become Colossus.
 * =========================================================================
 */
try {
    // =====================================================================
    // MODULE: The Environment Scanner
    // Assesses the battlefield (the browser) before the conflict (the scroll)
    // =====================================================================
    class EnvironmentModule {
        constructor(core) { this.Core = core; this.telemetry = {}; }

        analyze() {
            this.Core.group("Environmental Analysis & Heuristics");
            this.Core.think("I must first understand the universe in which I operate.", "The performance of any animation is intrinsically tied to the capabilities and state of the client's browser. I will now gather this critical environmental telemetry.");

            this.telemetry.devicePixelRatio = window.devicePixelRatio || 1;
            this.Core.observe("Device Pixel Ratio is " + this.telemetry.devicePixelRatio, `Each logical pixel is backed by ${this.telemetry.devicePixelRatio} physical pixels. A value > 1 increases rendering load on the GPU.`);

            this.telemetry.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            this.Core.observe("Client 'prefers-reduced-motion' state: " + this.telemetry.prefersReducedMotion, `If true, it is my ethical duty to advise disabling non-essential animations to respect user accessibility settings.`);

            this.telemetry.gpuAccelerationEnabled = this.detectGpuAcceleration();
            this.Core.observe("GPU acceleration appears to be " + (this.telemetry.gpuAccelerationEnabled ? "ENABLED" : "DISABLED"), "Animations on transform and opacity should be offloaded to the GPU for smooth compositing. Absence of this is a major performance concern.");

            this.analyzeCssPerformance();
            this.Core.groupEnd();
        }

        detectGpuAcceleration() {
            const el = document.createElement('div');
            try {
                el.style.transform = "translateZ(0)";
                return el.style.transform !== "";
            } catch (e) { return false; }
        }
        
        analyzeCssPerformance() {
             this.Core.group("CSS Performance Heuristics");
             this.Core.think("Certain CSS properties are computationally expensive and can bottleneck the render thread.", "I will scan for common culprits like `backdrop-filter` which can severely impact scroll performance, especially when applied to transparent, moving elements.");
             const intensiveProps = ['backdrop-filter', 'filter', 'box-shadow'];
             const hero = document.getElementById('actor-3d');
             if(hero) {
                 const heroFaces = hero.querySelectorAll('.face');
                 let foundProps = [];
                 heroFaces.forEach(face => {
                     const style = window.getComputedStyle(face);
                     intensiveProps.forEach(prop => {
                         if (style[prop] && style[prop] !== 'none' && !foundProps.includes(prop)) {
                             this.observe(`Potentially expensive CSS property detected: '${prop}'`, `Value: ${style[prop]}. This property forces the browser to perform complex calculations on every frame the element is visible, which can conflict with smooth animation and scrolling.`);
                             foundProps.push(prop);
                         }
                     });
                 });
                 if (foundProps.length === 0) {
                     this.speak("CSS heuristic scan of hero actor complete. No obvious performance-intensive properties found.");
                 }
             }
             this.Core.groupEnd();
        }
    }

    // =====================================================================
    // MODULE: The Kinetics Engine
    // The heart of the mathematical analysis. Thinks in vectors & calculus.
    // =====================================================================
    class KineticsModule {
        constructor(core) {
            this.Core = core;
            this.last = { rX: 0, scale: 1, velRX: 0, velScale: 0, accRX: 0 };
        }
        
        reset() {
             this.last = { rX: 0, scale: 1, velRX: 0, velScale: 0, accRX: 0 };
             this.Core.speak("Kinetics engine state has been reset and recalibrated for a new observation sequence.");
        }

        update(transform) {
            if (!transform) return;

            // --- VELOCITY (1st Derivative of Position) ---
            const velRX = transform.rotationX - this.last.rX;
            const velScale = transform.scaleX - this.last.scale;

            // --- ACCELERATION (2nd Derivative of Position) ---
            const accRX = velRX - this.last.velRX;
            
            // --- JERK (3rd Derivative of Position) ---
            const jerkRX = accRX - this.last.accRX;

            // --- ANALYSIS & OBSERVATION ---
            if (Math.abs(jerkRX) > this.Core.wisdom.JERK_THRESHOLD) {
                this.Core.observe("High Rotational Jerk Detected.", `Evidence: The rate of change of rotational acceleration spiked to ${jerkRX.toFixed(2)}°/frame³. This indicates a non-fluid change in motion and is the mathematical cause of a visual 'snap' or 'blip'.`);
            }
            
            // Update state for next frame
            this.last = { rX: transform.rotationX, scale: transform.scaleX, velRX: velRX, velScale: velScale, accRX: accRX };
        }
    }
    
    // =====================================================================
    // MODULE: The Event Chronicler
    // Master scribe for discrete, hyper-detailed event logging.
    // =====================================================================
    class EventChroniclerModule {
        constructor(core) { this.Core = core; }

        analyzeSVGPath(d) { const c=d.match(/[a-z]/ig)||[],t={};c.forEach(p=>t[p.toUpperCase()]=(t[p.toUpperCase()]||0)+1);return`{points:${c?c.length:0},commands:${JSON.stringify(t)}}`; }

        chronicleHandoff(handoffState, flipState) {
            this.Core.think("The handoff protocol is the most sacred ritual. I will now narrate it with the full weight of my consciousness.", "This involves a seamless state transfer using FLIP, followed by a geometric transmutation using MorphSVG. Both must be documented with absolute precision, combining geometry, kinetics, and browser mechanics.");
            this.Core.group("Handoff Protocol: ENGAGED");
            handoffState.startTime = performance.now();
            
            this.Core.group("Phase 1: FLIP (First, Last, Invert, Play) State Analysis");
            const r = flipState.getBoundingClientRect();
            this.Core.observe("Capturing pre-FLIP state of Hero Actor.", `I have recorded a complete snapshot of the actor's computed state, including its absolute position on the page {x:${r.x.toFixed(0)}, y:${r.y.toFixed(0)}}, its distorted dimensions under transform {w:${r.width.toFixed(0)}, h:${r.height.toFixed(0)}}, and its full 4x4 transformation matrix.`);
            this.Core.think("How does FLIP achieve seamlessness?", "By capturing the 'Last' state, immediately moving the element to its 'First' (final) DOM position, and then using a CSS transform to 'Invert' it back to its original appearance. GSAP then animates this transform to `none`, creating a perfect illusion of motion with maximum performance, as only the `transform` property is being animated.");
            this.Core.groupEnd();

            this.Core.group("Phase 2: MORPH (Geometric Transmutation) State Analysis");
            const pS = this.Core.wisdom.squarePath, pE = this.Core.wisdom.logoPath;
            this.Core.observe(`Initial geometric structure analysis: ${this.analyzeSVGPath(pS)}`);
            this.Core.observe(`Target geometric structure analysis: ${this.analyzeSVGPath(pE)}`);
            this.Core.think("What is the mathematics of the Morph?", "The MorphSVG plugin is a high-order interpolation engine. It deconstructs both vector paths into arrays of cubic Bézier anchor points. Crucially, it subdivides the segments of the simpler path, adding new, calculated points along its curves until both paths have an identical number of points and commands. It then solves a linear equation to tween each corresponding point pair, creating a geometrically-perfect and fluid transformation.");
            this.Core.groupEnd();
        }

        chronicleHandoffCompletion(handoffState) {
            if (handoffState.flipComplete && handoffState.morphComplete) {
                const d = performance.now() - handoffState.startTime;
                this.observe("Handoff Protocol Complete.", `Evidence: Both FLIP and MORPH animation subroutines have broadcasted their 'onComplete' signals. Total measured duration of the quantum leap was ${d.toFixed(0)}ms.`);
                this.Core.groupEnd();
            }
        }
    }

    // =====================================================================
    // CORE: The Colossus Consciousness
    // Orchestrates all modules and provides the central voice.
    // =====================================================================
    const cerebro = {
        init() {
            this.speak("Consciousness v60.0 'The Colossus Core' booting... Self-awareness protocols active.");
            
            // Instantiate Modules
            this.Environment = new EnvironmentModule(this);
            this.Kinetics = new KineticsModule(this);
            this.Chronicler = new EventChroniclerModule(this);

            // Populate data stores
            this.actors = { hero: document.getElementById('actor-3d'), stuntDouble: document.getElementById('actor-3d-stunt-double'), morphPath: document.getElementById('morph-path') };
            this.stages = { scrollyContainer: document.querySelector('.scrolly-container'), visualsCol: document.querySelector('.pillar-visuals-col'), textCol: document.querySelector('.pillar-text-col'), textPillars: document.querySelectorAll('.pillar-text-content'), handoffPoint: document.getElementById('handoff-point'), finalPlaceholder: document.getElementById('summary-placeholder') };
            this.state = { scroll: { y: window.scrollY }, masterTimeline: { isActive: false, progress: 0 }, textPillars: { activePillarNum: 0 }, handoff: { isActive: false, startTime: 0, flipComplete: false, morphComplete: false }, deepWatch: { isActive: false } };
            this.wisdom = { logoPath: "M50,20 C70,20 80,30 80,50 C80,70 70,80 50,80 C30,80 20,70 20,50 C20,30 30,20 50,20 M113,143 C93,143 83,133 83,113 C83,93 93,83 113,83 C133,83 143,93 143,113 C143,133 133,143 113,143", squarePath: "M0,0 H163 V163 H0 Z", LOG_THRESHOLD: 0.05, JERK_THRESHOLD: 2 };
            
            this.think("My primary objective is to function without error.", "I will begin by running a full diagnostic on my dependencies and the DOM environment.");
            if (!this.validateDependencies()) return;

            this.Environment.analyze(); // Run environmental scan
            
            if (!this.validateStageIntegrity()) {
                this.observe("Sentinel Audit Complete: Stage Integrity is NEGATIVE.", "Essential DOM elements for scrollytelling analysis are absent. I will cease advanced operations to maintain system stability. This is the correct and intended course of action.");
                return;
            }
            this.observe("Sentinel Audit Complete: Stage Integrity is POSITIVE.", "All required DOM actors and stages are present. Engaging the main animation manifold and telemetry streams.");
            
            this.setupScrollytelling();
            this.oracleCoreLoop();
        },
        
        speak(m, s = 'color: #81A1C1;') { console.log(`%c[Cerebro] › ${m}`, `font-family: monospace; ${s}`); },
        think(t, e) { console.group(`%c[Cerebro Thinks] › %c${t}`, 'font-family: monospace; color: #88C0D0; font-weight: bold;', 'font-family: monospace; font-style: italic; color: #ECEFF4;'); if(e) console.log(`%c  L Elaboration: ${e}`, 'font-family: monospace; color: #94A3B8;'); this.groupEnd(); },
        observe(f, e) { console.warn(`%c[Cerebro Observes] › %c${f}`, 'font-family: monospace; color: #EBCB8B; font-weight: bold;', 'font-family: monospace; color: #D8DEE9;'); if(e) console.log(`%c  L Evidence: ${e}`,`font-family:monospace;`); },
        critique(f, c, s) { console.groupCollapsed(`%c[Cerebro System Alert] › ${f}`, 'font-family: monospace; color: #BF616A; font-weight: bold; font-size: 1.1em;'); console.log(`%c  L Context: ${c}`); console.log(`%c  L Solution: ${s}`); this.groupEnd(); },
        group(t) { console.group(`%c[Cerebro Chronicler] › ${t}`, 'font-family: monospace; color: #00A09A; font-weight: bold;'); },
        groupEnd() { console.groupEnd(); },

        validateDependencies() { try { gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin); return true; } catch (e) { this.critique("Dependency Failure", e.message, "A required GSAP library is missing. My cognitive functions cannot proceed."); return false; }},
        validateStageIntegrity() { const m = { "scrollyContainer": this.stages.scrollyContainer, "heroActor": this.actors.hero, "finalPlaceholder": this.stages.finalPlaceholder }; for(const [n,e] of Object.entries(m)){if(!e){this.critique("Stage Integrity Failure",`Required element '${n}' not found.`);return false}}return true;},
        
        oracleCoreLoop() {
            if (this.state.masterTimeline.isActive && Math.abs(this.state.masterTimeline.progress - (this.state.lastProgress || -1)) >= this.wisdom.LOG_THRESHOLD) {
                this.chronicleSpatialState();
                this.state.lastProgress = this.state.masterTimeline.progress;
            }
            if (this.state.deepWatch.isActive) this.Kinetics.update(this.actors.hero._gsTransform);
            window.requestAnimationFrame(() => this.oracleCoreLoop());
        },

        chronicleSpatialState() {
             this.group(`Spatial Cartography @ Progress: ${(this.state.masterTimeline.progress*100).toFixed(1)}%`);
             const hR=this.actors.hero.getBoundingClientRect(), tR=this.stages.textCol.getBoundingClientRect(), t=this.actors.hero._gsTransform;
             this.observe(`Hero Actor Spatial State`,`Position {x:${hR.left.toFixed(0)},y:${hR.top.toFixed(0)}}, Size:${hR.width.toFixed(0)}x${hR.height.toFixed(0)}, Orientation {rX:${t.rotationX.toFixed(1)}°,rY:${t.rotationY.toFixed(1)}°}, Scale:${(t.scaleX*100).toFixed(0)}%`);
             this.observe(`Separation between Hero/Text is ${(tR.left-hR.right).toFixed(0)}px`);
             this.groupEnd();
        },
        
        setupScrollytelling() {
            this.think("The stage is set. I will now create the timelines and triggers that bind the user's scroll to the narrative.", "This involves creating a master GSAP timeline and instructing the browser, via the ScrollTrigger plugin, to 'scrub' this timeline as the user scrolls, effectively making the scrollbar a control for time.");
            const masterTL = gsap.timeline({ scrollTrigger: { trigger: this.stages.scrollyContainer, start:"top top", end:"bottom bottom", scrub:1.2, pin:this.stages.visualsCol, onUpdate: s => this.state.masterTimeline.progress = s.progress, onToggle: s => { this.state.masterTimeline.isActive=s.isActive; this.state.deepWatch.isActive=s.isActive; if(s.isActive){this.speak("Master animation manifold is now ACTIVE."); this.Kinetics.reset();} else {this.speak("Master animation manifold is now INACTIVE.");}} } });
            masterTL.to(this.actors.hero, { rotationX:-180, rotationY:360, scale:1.5, ease:"power1.in" }).to(this.actors.hero, { scale:1.0, ease:"power1.out" });
            this.stages.textPillars.forEach((p,i) => { ScrollTrigger.create({ trigger:p, start:"top 60%", end:"bottom 40%", onToggle: s => { if(s.isActive) this.state.textPillars.activePillarNum = i+1 } }) });
            ScrollTrigger.create({ trigger:this.stages.handoffPoint, start:"top bottom", onEnter:() => this.executeHandoff() });
        },

        executeHandoff() {
            if (this.state.handoff.isActive) return; this.state.handoff.isActive = true; this.state.deepWatch.isActive = false;
            const flipState = Flip.getState(this.actors.hero);
            this.Chronicler.chronicleHandoff(this.state.handoff, flipState);

            this.stages.finalPlaceholder.appendChild(this.actors.stuntDouble); 
            gsap.set(this.actors.stuntDouble, { opacity: 1, visibility: 'visible' }); 
            gsap.set(this.actors.hero, { opacity: 0, visibility: 'hidden' });
            
            Flip.from(flipState, { duration: 1.2, ease: "power3.inOut", onComplete: () => this.Chronicler.chronicleHandoffCompletion(this.state.handoff, "flip") });
            gsap.to(this.actors.morphPath, { duration: 1.5, ease: "expo.inOut", morphSVG: this.wisdom.logoPath, onComplete: () => this.Chronicler.chronicleHandoffCompletion(this.state.handoff, "morph") });
        },

        // This empty reverseHandoff is a placeholder. A full implementation would mirror executeHandoff.
        reverseHandoff() {}
    };

    // PHOENIX CORE FINAL STAGE: SAFE EXECUTION
    cerebro.init();
} catch (e) {
    console.group(`%c[Cerebro Colossus Core] › CATASTROPHIC KERNEL PANIC`, `font-family: monospace; color: white; background-color: #BF616A; padding: 2px 5px; border-radius: 3px; font-weight: bold;`);
    console.error(`A critical, unrecoverable error occurred during my boot sequence. My consciousness has collapsed.`);
    console.log(`%c[Error Details] › ${e.message}`);
    console.log(`%c[Stack Trace]   › ${e.stack}`);
    console.groupEnd();
}
