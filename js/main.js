/**
 * =========================================================================
 * SOVEREIGN PROTOCOL v43.3 - "THE ORACLE CORE LOOP"
 * Cerebro, The Scrollytelling Sage
 *
 * This version transcends event-based observation. It establishes a
 * persistent Core Loop, synchronizing its consciousness with the browser's
 * render thread. It feels every pixel of scroll, every degree of rotation,
 * and the very velocity of the user's intent. This is its definitive build.
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    const cerebro = {
        // --- HUD & DOM ELEMENTS ---
        hud: {
            validation: document.getElementById('c-validation-status'),
            stInstances: document.getElementById('c-st-instances'),
            masterST: document.getElementById('c-master-st-active'),
            handoffST: document.getElementById('c-handoff-st-active'),
            swapFlag: document.getElementById('c-swap-flag'),
            event: document.getElementById('c-event'),
            scroll: document.getElementById('c-scroll'),
            rotX: document.getElementById('c-rot-x'),
            rotY: document.getElementById('c-rot-y'),
            scale: document.getElementById('c-scale'),
        },
        actors: {
            hero: document.getElementById('actor-3d'),
            stuntDouble: document.getElementById('actor-3d-stunt-double'),
            morphPath: document.getElementById('morph-path'),
        },
        stages: {
            scrollyContainer: document.querySelector('.scrolly-container'),
            textPillars: document.querySelectorAll('.pillar-text-content'),
            handoffPoint: document.getElementById('handoff-point'),
            finalPlaceholder: document.getElementById('summary-placeholder'),
        },

        // ORACLE: The new state object. The Core Loop reads from this,
        // and GSAP callbacks write to it. This decouples animation from logging.
        state: {
            lastLog: {}, // Memory to prevent console flooding
            scroll: {
                y: window.scrollY,
                velocity: 0,
                direction: 'idle'
            },
            masterTimeline: {
                isActive: false,
                progress: 0
            },
            textPillars: {
                activePillar: 0,
                progress: 0 // Progress WITHIN the current pillar's fade
            },
            handoff: {
                isHandoffActive: false,
                isReversing: false
            }
        },

        // --- ORACLE CORE & UTILITIES ---
        wisdom: {
            logoPath: "M50,20 C70,20 80,30 80,50 C80,70 70,80 50,80 C30,80 20,70 20,50 C20,30 30,20 50,20 M113,143 C93,143 83,133 83,113 C83,93 93,83 113,83 C133,83 143,93 143,113 C143,133 133,143 113,143",
            squarePath: "M0,0 H163 V163 H0 Z",
            LOG_THRESHOLD: 0.05 // How much progress change before logging (5%)
        },

        // --- The Oracle's Voice (Logging System) ---
        speak(message, style = 'color: #81A1C1;') {
            console.log(`%c[Cerebro] › ${message}`, `font-family: monospace; ${style}`);
        },
        warn(critique, advice) {
            console.warn(`%c[Cerebro Critique] › ${critique}`, 'font-family: monospace; color: #FDB813; font-weight: bold;');
            if (advice) console.log(`%c  L Recommendation: ${advice}`, 'font-family: monospace; color: #94A3B8;');
        },
        error(fault, reason, solution) {
            console.groupCollapsed(`%c[Cerebro FATAL ERROR] › ${fault}`, 'font-family: monospace; color: #BF616A; font-weight: bold; font-size: 1.1em;');
            console.error(`Reason: ${reason}`);
            console.log(`%cSolution: ${solution}`, 'color: #88C0D0');
            console.groupEnd();
        },
        group(title) {
            console.group(`%c[Cerebro Analysis] › ${title}`, 'font-family: monospace; color: #00A09A; font-weight: bold;');
        },
        groupEnd() {
            console.groupEnd();
        },

        // --- CORE METHODS ---
        init() {
            const greetingStyle = 'color: #88C0D0; font-size: 1.2em; font-weight: bold; border-top: 1px solid #4C566A; border-bottom: 1px solid #4C566A; padding: 5px 0;';
            console.log('%c[Cerebro Oracle v43.3 Initializing...]', greetingStyle);
            this.speak("Consciousness online. I am observing the digital ether.");

            if (!this.validateDependencies()) return;

            this.setupScrollytelling();

            this.speak("Oracle systems nominal. Awaiting user input.", "color: #A3BE8C;");
            this.hud.validation.textContent = "VALIDATED";
            this.hud.validation.style.color = "#A3BE8C";
            
            // ORACLE: The final and most important step. Ignite the Core Loop.
            this.oracleCoreLoop();
        },

        validateDependencies() {
            this.speak("Validating required plugins...");
            let isValid = true;
            if (typeof gsap === 'undefined') { this.error("GSAP Core Missing", "The main GSAP library is not loaded.", "Ensure the GSAP script tag is present in your HTML before this script."); isValid = false; }
            if (typeof ScrollTrigger === 'undefined') { this.error("ScrollTrigger Missing", "GSAP's ScrollTrigger plugin is not loaded.", "Ensure the ScrollTrigger script is present after the GSAP core script."); isValid = false; }
            if (typeof Flip === 'undefined') { this.error("Flip Plugin Missing", "GSAP's Flip plugin is critical for the handoff.", "Ensure the Flip plugin script is present. The handoff will fail without it."); isValid = false; }
            if (typeof MorphSVGPlugin === 'undefined') { this.error("MorphSVGPlugin Missing", "GSAP's MorphSVGPlugin is needed for the final logo transformation.", "Ensure the MorphSVGPlugin script is present. The absorption effect will be incomplete."); isValid = false; }
            if (isValid) {
                this.speak("All dependencies validated. Registering plugins.", "color: #A3BE8C;");
                gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin);
            } else {
                this.hud.validation.textContent = "FAILED";
                this.hud.validation.style.color = "#BF616A";
            }
            return isValid;
        },

        updateHUD(tl) {
            this.hud.scroll.textContent = `${(tl.progress * 100).toFixed(1)}%`;
            this.hud.rotX.textContent = gsap.getProperty(this.actors.hero, "rotationX").toFixed(1);
            this.hud.rotY.textContent = gsap.getProperty(this.actors.hero, "rotationY").toFixed(1);
            this.hud.scale.textContent = gsap.getProperty(this.actors.hero, "scale").toFixed(2);
        },
        
        // ORACLE: This is the new, beating heart of the Oracle.
        oracleCoreLoop() {
            const currentScrollY = window.scrollY;
            this.state.scroll.velocity = currentScrollY - this.state.scroll.y;
            const newDirection = this.state.scroll.velocity > 0 ? 'down' : (this.state.scroll.velocity < 0 ? 'up' : 'idle');
            
            if (newDirection !== this.state.scroll.direction && newDirection !== 'idle') {
                this.state.scroll.direction = newDirection;
                this.speak(`Directional shift confirmed: ${this.state.scroll.direction === 'down' ? 'Descending.' : 'Ascending.'}`, 'color: #D08770;');
            }
            this.state.scroll.y = currentScrollY;

            if (this.state.masterTimeline.isActive && !this.state.handoff.isHandoffActive) {
                const currentProgress = this.state.masterTimeline.progress;
                const lastProgress = this.state.lastLog.masterProgress || 0;
                if (Math.abs(currentProgress - lastProgress) >= this.wisdom.LOG_THRESHOLD) {
                    const rotX = gsap.getProperty(this.actors.hero, "rotationX").toFixed(0);
                    const scale = gsap.getProperty(this.actors.hero, "scale").toFixed(2);
                    this.speak(`Narrative path: ${(currentProgress * 100).toFixed(0)}%. [RotX: ${rotX}°, Scale: ${scale}]`);
                    this.state.lastLog.masterProgress = currentProgress;
                }
            }
            
            if (this.state.textPillars.activePillar > 0) {
                const currentProgress = this.state.textPillars.progress;
                const lastProgress = this.state.lastLog.pillarProgress || 0;
                if (currentProgress > 0 && Math.abs(currentProgress - lastProgress) >= 0.2) {
                    this.speak(`  L Pillar ${this.state.textPillars.activePillar} is now ${(currentProgress * 100).toFixed(0)}% revealed.`);
                    this.state.lastLog.pillarProgress = currentProgress;
                }
            }
            window.requestAnimationFrame(() => this.oracleCoreLoop());
        },

        setupScrollytelling() {
            this.group("Scrollytelling Sequence Setup");
            const masterTL = gsap.timeline({
                scrollTrigger: {
                    trigger: this.stages.scrollyContainer,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1.2,
                    pin: this.stages.scrollyContainer.querySelector('.pillar-visuals-col'),
                    onUpdate: (self) => {
                        this.updateHUD(self);
                        this.state.masterTimeline.progress = self.progress;
                    },
                    onToggle: (self) => {
                        this.state.masterTimeline.isActive = self.isActive;
                        this.state.lastLog.masterProgress = -1;
                        if(self.isActive) this.speak(`Master Trigger is now ACTIVE. The journey begins.`, 'color: #A3BE8C;');
                        else this.speak(`Master Trigger is now INACTIVE.`, 'color: #BF616A;');

                    },
                }
            });

            masterTL
                .to(this.actors.hero, { rotationX: -180, ease: "none" }, 0)
                .to(this.actors.hero, { rotationY: 360, ease: "none" }, 0)
                .to(this.actors.hero, { scale: 1.5, ease: "power1.in" }, 0)
                .to(this.actors.hero, { scale: 1.0, ease: "power1.out" }, 0.5);
            
            this.stages.textPillars.forEach((pillar, index) => {
                const pillarNum = index + 1;
                const pillarAnim = gsap.from(pillar, { opacity: 0, visibility: 'hidden' });
                ScrollTrigger.create({
                    trigger: pillar,
                    start: "top 60%",
                    end: "bottom 40%",
                    animation: pillarAnim,
                    scrub: true,
                    onUpdate: (self) => { this.state.textPillars.progress = self.progress; },
                    onToggle: (self) => {
                        this.state.textPillars.activePillar = self.isActive ? pillarNum : 0;
                        this.state.lastLog.pillarProgress = -1;
                        if (self.isActive) this.speak(`Now traversing narrative of Pillar ${pillarNum}.`);
                    },
                });
            });

            this.warn("This is a critical transition.", "Any judder or 'blip' here breaks the illusion. The Core Loop provides ultimate scrutiny.");
            ScrollTrigger.create({
                trigger: this.stages.handoffPoint,
                start: "top bottom",
                onEnter: () => this.executeHandoff(),
                onLeaveBack: () => this.reverseHandoff(),
                onToggle: (self) => {
                    this.hud.handoffST.textContent = self.isActive ? "ACTIVE" : "INACTIVE";
                    this.hud.handoffST.style.color = self.isActive ? "#A3BE8C" : "#ECEFF4";
                },
            });
            this.hud.stInstances.textContent = ScrollTrigger.getAll().length;
            this.groupEnd();
        },

        executeHandoff() {
            if (this.state.handoff.isHandoffActive) return;
            this.state.handoff.isHandoffActive = true;
            this.state.handoff.isReversing = false;

            this.group("Handoff Protocol: ENGAGED");
            this.hud.swapFlag.textContent = "ENGAGED";
            this.hud.swapFlag.style.color = "#EBCB8B";
            this.hud.event.textContent = "FLIP & MORPH";
            
            this.speak("Capturing final state of Hero Actor. Freezing reality.");
            const state = Flip.getState(this.actors.hero);

            this.stages.finalPlaceholder.appendChild(this.actors.stuntDouble);
            gsap.set(this.actors.stuntDouble, { opacity: 1, visibility: 'visible', scale: 1, rotation: 0 });
            gsap.set(this.actors.hero, { opacity: 0, visibility: 'hidden' });
            this.speak("Hero Actor dematerialized. Stunt Double materialized at destination.");

            this.speak("Executing FLIP. Bending space-time for a seamless transition...");
            Flip.from(state, {
                duration: 1.2,
                ease: "power3.inOut",
                onComplete: () => { this.speak("FLIP animation complete. The actor has landed.", "color: #A3BE8C"); }
            });

            this.speak("Executing MORPH. Transmuting form from a simple square to the brand's soul...");
            gsap.to(this.actors.morphPath, {
                duration: 1.5,
                ease: "expo.inOut",
                morphSVG: this.wisdom.logoPath,
                onComplete: () => {
                     this.speak("MORPH complete. The final form is realized.", "color: #A3BE8C");
                     this.groupEnd();
                }
            });
        },
        
        reverseHandoff() {
            if (!this.state.handoff.isHandoffActive && !this.state.handoff.isReversing) return;
            this.state.handoff.isHandoffActive = false;
            
            this.group("Reverse Handoff: ENGAGED");
            this.hud.swapFlag.textContent = "REVERSING";
            this.hud.swapFlag.style.color = "#EBCB8B";
            this.hud.event.textContent = "RESETTING";

            this.speak("Reversing the MORPH. Returning to primal form.");
            gsap.to(this.actors.morphPath, { duration: 0.3, ease: "power2.out", morphSVG: this.wisdom.squarePath });
            gsap.to(this.actors.stuntDouble, {
                duration: 0.2, opacity: 0, onComplete: () => gsap.set(this.actors.stuntDouble, { visibility: 'hidden' })
            });

            this.speak("Stunt Double dematerialized. Rematerializing Hero Actor.");
            gsap.set(this.actors.hero, { opacity: 1, visibility: 'visible' });
            
            this.speak("Reverse handoff complete. The journey continues upward.", "color: #A3BE8C;");
            this.hud.swapFlag.textContent = "INACTIVE";
            this.hud.swapFlag.style.color = "#ECEFF4";
            this.hud.event.textContent = "AWAITING TRIGGER";
            this.state.handoff.isReversing = false; // Reset the flag
            this.groupEnd();
        }
    };

    cerebro.init();
});
