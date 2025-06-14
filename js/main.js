
/**
 * =========================================================================
 * SOVEREIGN PROTOCOL v43.6 - "THE SENTINEL"
 * =========================================================================
 */
document.addEventListener('DOMContentLoaded', () => {

    const cerebro = {
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
            overlapStatus: document.getElementById('c-overlap-status'),
            scrollAccel: document.getElementById('c-scroll-accel'),
        },
        actors: {
            hero: document.getElementById('actor-3d'),
            stuntDouble: document.getElementById('actor-3d-stunt-double'),
            morphPath: document.getElementById('morph-path'),
        },
        stages: {
            scrollyContainer: document.querySelector('.scrolly-container'),
            visualsCol: document.querySelector('.pillar-visuals-col'),
            textCol: document.querySelector('.pillar-text-col'),
            textPillars: document.querySelectorAll('.pillar-text-content'),
            handoffPoint: document.getElementById('handoff-point'),
            finalPlaceholder: document.getElementById('summary-placeholder'),
        },
        state: {
            lastLog: {},
            scroll: { y: window.scrollY, lastY: window.scrollY, velocity: 0, acceleration: 0, direction: 'idle' },
            masterTimeline: { isActive: false, progress: 0 },
            layout: { isOverlapping: false, visualsZ: 0, textZ: 0 },
            textPillars: { activePillar: 0, progress: 0 },
            handoff: { isHandoffActive: false, isReversing: false },
            deepWatch: { isActive: false, last: { rotationX: 0, scale: 1 }, lastDelta: { rotationX: 0, scale: 0 } }
        },
        wisdom: {
            logoPath: "M50,20 C70,20 80,30 80,50 C80,70 70,80 50,80 C30,80 20,70 20,50 C20,30 30,20 50,20 M113,143 C93,143 83,133 83,113 C83,93 93,83 113,83 C133,83 143,93 143,113 C143,133 133,143 113,143",
            squarePath: "M0,0 H163 V163 H0 Z",
            LOG_THRESHOLD: 0.05,
            ACCEL_THRESHOLD: 25,
            DEEP_WATCH_THRESHOLDS: { rotationAccel: 5, scaleAccel: 0.05 }
        },
        speak: (m, s = 'color: #81A1C1;') => console.log(`%c[Cerebro] › ${m}`, `font-family: monospace; ${s}`),
        warn: (c, a) => { console.warn(`%c[Cerebro Warn] › ${c}`, 'font-family: monospace; color: #FDB813; font-weight: bold;'); if(a) console.log(`%c  L Rec: ${a}`, 'font-family: monospace; color: #94A3B8;'); },
        critique: (f, c, s) => { console.groupCollapsed(`%c[Cerebro CRITIQUE] › ${f}`, 'font-family: monospace; color: #BF616A; font-weight: bold; font-size: 1.1em;'); console.log(`%cContext: ${c}`, 'color: #EBCB8B'); console.log(`%cSolution: ${s}`, 'color: #88C0D0'); console.groupEnd(); },
        group: (t) => console.group(`%c[Cerebro Analysis] › ${t}`, 'font-family: monospace; color: #00A09A; font-weight: bold;'),
        groupEnd: () => console.groupEnd(),
        
        init() {
            this.speak("Consciousness v43.6 'The Sentinel' online. Assessing environment.");
            if (!this.validateDependencies()) return;
            if (!this.stages.scrollyContainer) {
                this.warn("Scrollytelling context not detected on this page.", "Advanced analysis protocols will remain dormant. This is normal for non-method pages.");
                return;
            }
            this.speak("Scrollytelling context confirmed. Engaging advanced protocols.");
            this.patchHUD();
            this.setupScrollytelling();
            this.speak("Oracle systems nominal. Core Loop and Deep Watch engaged.", "color: #A3BE8C;");
            this.oracleCoreLoop();
        },
        
        validateDependencies() {
            this.speak("Validating required plugins...");
            let isValid = true;
            if (typeof gsap === 'undefined') { this.error("GSAP Core Missing", "The main GSAP library is not loaded.", "Ensure the GSAP script tag is present."); isValid = false; }
            if (typeof ScrollTrigger === 'undefined') { this.error("ScrollTrigger Missing", "GSAP's ScrollTrigger plugin is not loaded.", "Ensure the ScrollTrigger script is present."); isValid = false; }
            if (typeof Flip === 'undefined') { this.error("Flip Plugin Missing", "GSAP's Flip plugin is critical for the handoff.", "Ensure the Flip plugin script is present."); isValid = false; }
            if (typeof MorphSVGPlugin === 'undefined') { this.error("MorphSVGPlugin Missing", "GSAP's MorphSVGPlugin is needed.", "Ensure the MorphSVGPlugin script is present."); isValid = false; }
            if (isValid) {
                gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin);
            }
            return isValid;
        },
        
        patchHUD() {
            // This function remains unchanged from v43.4
            const hud = document.getElementById('cerebro-hud');
            if(!hud) return;
            const divider = hud.querySelector('.divider');
            if (divider && !document.getElementById('c-overlap-status')) {
                const overlapDiv = document.createElement('div');
                overlapDiv.innerHTML = `<span class="label">Layout Overlap:</span><span id="c-overlap-status">OK</span>`;
                const accelDiv = document.createElement('div');
                accelDiv.innerHTML = `<span class="label">Scroll Accel:</span><span id="c-scroll-accel">0</span>`;
                divider.parentNode.insertBefore(overlapDiv, divider);
                divider.parentNode.insertBefore(accelDiv, divider);
                this.hud.overlapStatus = document.getElementById('c-overlap-status');
                this.hud.scrollAccel = document.getElementById('c-scroll-accel');
            }
        },

        updateHUD(tl) {
            // This function remains unchanged from v43.5
            if(tl) this.hud.scroll.textContent = `${(tl.progress * 100).toFixed(1)}%`;
            if(this.actors.hero) {
                 this.hud.rotX.textContent = gsap.getProperty(this.actors.hero, "rotationX").toFixed(1);
                 this.hud.rotY.textContent = gsap.getProperty(this.actors.hero, "rotationY").toFixed(1);
                 this.hud.scale.textContent = gsap.getProperty(this.actors.hero, "scale").toFixed(2);
            }
            if(this.hud.scrollAccel) this.hud.scrollAccel.textContent = this.state.scroll.acceleration.toFixed(0);
        },
        
        oracleCoreLoop() {
            // This function remains unchanged from v43.5
            const currentScrollY = window.scrollY;
            const lastVelocity = this.state.scroll.velocity;
            this.state.scroll.velocity = currentScrollY - this.state.scroll.y;
            this.state.scroll.acceleration = this.state.scroll.velocity - lastVelocity;
            this.state.scroll.y = currentScrollY;
            if (this.state.deepWatch.isActive) this.executeDeepWatch();
            window.requestAnimationFrame(() => this.oracleCoreLoop());
        },

        executeDeepWatch() {
            // This function remains unchanged from v43.5
            const transform = this.actors.hero._gsTransform;
            if (!transform) return;
            const deltaRotX = transform.rotationX - this.state.deepWatch.last.rotationX;
            const accelRotX = deltaRotX - this.state.deepWatch.lastDelta.rotationX;
            if (Math.abs(accelRotX) > this.wisdom.DEEP_WATCH_THRESHOLDS.rotationAccel) { this.critique("Deep Watch Anomaly: Cube Motion Judder!", `...`); }
            this.state.deepWatch.last.rotationX = transform.rotationX;
            this.state.deepWatch.lastDelta.rotationX = deltaRotX;
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
                    onUpdate: (self) => { this.updateHUD(self); this.state.masterTimeline.progress = self.progress; },
                    onToggle: (self) => { this.state.masterTimeline.isActive = self.isActive; this.state.deepWatch.isActive = self.isActive; if (self.isActive) this.speak(`Master Trigger ACTIVE. Deep Watch...`, 'color: #A3BE8C;'); else this.speak(`Master Trigger INACTIVE...`, 'color: #BF616A;'); },
                }
            });
            masterTL.to(this.actors.hero, { rotationX: -180, ease: "none" }, 0).to(this.actors.hero, { rotationY: 360, ease: "none" }, 0).to(this.actors.hero, { scale: 1.5, ease: "power1.in" }, 0).to(this.actors.hero, { scale: 1.0, ease: "power1.out" }, 0.5);
            this.stages.textPillars.forEach((pillar, index) => { ScrollTrigger.create({ trigger: pillar, start: "top 60%", end: "bottom 40%", scrub: true }); });
            this.warn("This is a critical transition.", "...");
            ScrollTrigger.create({ trigger: this.stages.handoffPoint, start: "top bottom", onEnter: () => this.executeHandoff(), onLeaveBack: () => this.reverseHandoff() });
            this.groupEnd();
        },

        executeHandoff() {
            // This function remains unchanged from v43.5
            if (this.state.handoff.isHandoffActive) return;
            this.state.handoff.isHandoffActive = true;
            this.state.deepWatch.isActive = false;
            this.hud.event.textContent = "FLIP & MORPH";
            const state = Flip.getState(this.actors.hero);
            this.stages.finalPlaceholder.appendChild(this.actors.stuntDouble);
            gsap.set(this.actors.stuntDouble, { opacity: 1, visibility: 'visible' });
            gsap.set(this.actors.hero, { opacity: 0, visibility: 'hidden' });
            Flip.from(state, { duration: 1.2, ease: "power3.inOut", onComplete: () => { this.speak("FLIP complete."); } });
            gsap.to(this.actors.morphPath, { duration: 1.5, ease: "expo.inOut", morphSVG: this.wisdom.logoPath, onComplete: () => { this.speak("MORPH complete."); }});
        },
        
        reverseHandoff() {
             // This function remains unchanged from v43.5
             if (this.state.handoff.isHandoffActive) return;
             //... etc
        }
    };
    cerebro.init();
});

