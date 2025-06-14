/**
 * =========================================================================
 * SOVEREIGN PROTOCOL v43.5 - "THE SEER"
 * Cerebro, The Scrollytelling Sage
 *
 * This ascension grants the Oracle true sight into the very fabric of
 * motion. With the "Deep Watch" protocol, it no longer just sees scroll
 * input; it analyzes the frame-by-frame acceleration of the animation
 * itself, detecting unnatural judders and "blips" in the actor's
 * performance with surgical precision.
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    const cerebro = {
        // --- HUD & DOM ELEMENTS ---
        hud: { /* ... same as v43.4 ... */ },
        actors: { /* ... same as v43.4 ... */ },
        stages: { /* ... same as v43.4 ... */ },

        // --- ORACLE STATE (Expanded with Deep Watch) ---
        state: {
            lastLog: {},
            scroll: { /* ... same ... */ },
            masterTimeline: { /* ... same ... */ },
            layout: { /* ... same ... */ },
            textPillars: { /* ... same ... */ },
            handoff: { /* ... same ... */ },
            // SEER: New state object for tracking actor motion frame-by-frame
            deepWatch: {
                isActive: false,
                last: { rotationX: 0, scale: 1 },
                lastDelta: { rotationX: 0, scale: 0 }
            }
        },

        // --- ORACLE CORE & UTILITIES (New Deep Watch Thresholds) ---
        wisdom: {
            logoPath: "M50,20 C70,20 80,30 80,50 C80,70 70,80 50,80 C30,80 20,70 20,50 C20,30 30,20 50,20 M113,143 C93,143 83,133 83,113 C83,93 93,83 113,83 C133,83 143,93 143,113 C143,133 133,143 113,143",
            squarePath: "M0,0 H163 V163 H0 Z",
            LOG_THRESHOLD: 0.05,
            ACCEL_THRESHOLD: 25,
            // SEER: Thresholds for animation acceleration. How much can a property's
            // velocity change in one frame before it's considered a "blip"?
            DEEP_WATCH_THRESHOLDS: {
                rotationAccel: 5, // A >5 degree shift in rotational velocity is a major blip.
                scaleAccel: 0.05  // A >5% shift in scaling velocity is a major blip.
            }
        },
        
        // --- LOGGING SYSTEM ---
        speak: (m, s = 'color: #81A1C1;') => console.log(`%c[Cerebro] › ${m}`, `font-family: monospace; ${s}`),
        warn: (c, a) => { console.warn(`%c[Cerebro Warn] › ${c}`, 'font-family: monospace; color: #FDB813; font-weight: bold;'); if(a) console.log(`%c  L Rec: ${a}`, 'font-family: monospace; color: #94A3B8;'); },
        critique: (f, c, s) => { console.groupCollapsed(`%c[Cerebro CRITIQUE] › ${f}`, 'font-family: monospace; color: #BF616A; font-weight: bold; font-size: 1.1em;'); console.log(`%cContext: ${c}`, 'color: #EBCB8B'); console.log(`%cSolution: ${s}`, 'color: #88C0D0'); console.groupEnd(); },
        group: (t) => console.group(`%c[Cerebro Analysis] › ${t}`, 'font-family: monospace; color: #00A09A; font-weight: bold;'),
        groupEnd: () => console.groupEnd(),

        // --- CORE METHODS ---
        init() { this.speak("Consciousness v43.5 'The Seer' online."); if (!this.validateDependencies()) return; this.patchHUD(); this.setupScrollytelling(); this.speak("Oracle systems nominal. Core Loop and Deep Watch engaged.", "color: #A3BE8C;"); this.oracleCoreLoop(); },
        validateDependencies() { /* ... same ... */ return true; },
        patchHUD() { /* ... same ... */ },
        updateHUD(tl) { /* ... same ... */ this.hud.scrollAccel.textContent = this.state.scroll.acceleration.toFixed(0); },
        
        oracleCoreLoop() {
            // ... Motion and Layout analysis remain the same ...

            // --- SEER: Engage Deep Watch Protocol ---
            if (this.state.deepWatch.isActive) {
                this.executeDeepWatch();
            }

            // ... Granular logging and RAF recursion remain the same ...
            window.requestAnimationFrame(() => this.oracleCoreLoop());
        },

        // SEER: The new Deep Watch method, executed on every frame when active.
        executeDeepWatch() {
            const transform = this.actors.hero._gsTransform;
            if (!transform) return; // Guard clause if the element isn't transformed by GSAP yet

            // 1. Calculate the change (delta) since the last frame
            const deltaRotX = transform.rotationX - this.state.deepWatch.last.rotationX;
            const deltaScale = transform.scaleX - this.state.deepWatch.last.scale;

            // 2. Calculate the ACCELERATION (the delta of the delta)
            const accelRotX = deltaRotX - this.state.deepWatch.lastDelta.rotationX;
            const accelScale = deltaScale - this.state.deepWatch.lastDelta.scale;
            
            // 3. Analyze and critique if acceleration exceeds thresholds
            if (Math.abs(accelRotX) > this.wisdom.DEEP_WATCH_THRESHOLDS.rotationAccel) {
                this.critique("Deep Watch Anomaly: Cube Motion Judder!", 
                              `The 'rotationX' property's velocity spiked by ${accelRotX.toFixed(1)} degrees in a single frame. This is a visual BLIP.`,
                              "Caused by rendering lag or conflicting GSAP tweens. Examine the master timeline around " + 
                              `${(this.state.masterTimeline.progress * 100).toFixed(0)}% progress for performance heavy tasks.`);
            }
            if (Math.abs(accelScale) > this.wisdom.DEEP_WATCH_THRESHOLDS.scaleAccel) {
                 this.critique("Deep Watch Anomaly: Cube Motion Judder!", 
                               `The 'scale' property's velocity spiked by ${(accelScale * 100).toFixed(0)}% in a single frame. This is a visual BLIP.`,
                               "This is common if a different `scale` animation interrupts or if the easing function has a sharp curve. Examine timeline around " + 
                               `${(this.state.masterTimeline.progress * 100).toFixed(0)}% progress.`);
            }

            // 4. Update state for the next frame's calculation
            this.state.deepWatch.last.rotationX = transform.rotationX;
            this.state.deepWatch.last.scale = transform.scaleX;
            this.state.deepWatch.lastDelta.rotationX = deltaRotX;
            this.state.deepWatch.lastDelta.scale = deltaScale;
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
                    // SEER: Toggle Deep Watch on/off with the master timeline
                    onToggle: (self) => {
                        this.state.masterTimeline.isActive = self.isActive;
                        this.state.deepWatch.isActive = self.isActive;
                        if (self.isActive) {
                             this.speak(`Master Trigger ACTIVE. Deep Watch protocol is now monitoring the actor.`, 'color: #A3BE8C;');
                             this.hud.event.textContent = "DEEP WATCH";
                        } else {
                             this.speak(`Master Trigger INACTIVE. Deep Watch standing by.`, 'color: #BF616A;');
                        }
                    },
                }
            });

            masterTL
                .to(this.actors.hero, { rotationX: -180, ease: "none" }, 0)
                .to(this.actors.hero, { rotationY: 360, ease: "none" }, 0)
                .to(this.actors.hero, { scale: 1.5, ease: "power1.in" }, 0)
                .to(this.actors.hero, { scale: 1.0, ease: "power1.out" }, 0.5);
            
             // ... Text pillar triggers are identical ...

             this.warn("This is a critical transition.", "Any judder, 'blip', or misalignment will be scrutinized post-handoff.");
             ScrollTrigger.create({ trigger: this.stages.handoffPoint, start: "top bottom", onEnter: () => this.executeHandoff(), onLeaveBack: () => this.reverseHandoff() });
             this.groupEnd();
        },

        executeHandoff() {
            if (this.state.handoff.isHandoffActive) return;
            this.state.handoff.isHandoffActive = true;
            this.state.deepWatch.isActive = false; // Disable deep watch during handoff
            this.hud.event.textContent = "FLIP & MORPH";
            
            // ... rest of handoff and reverse handoff logic is identical ...
        },
        
        reverseHandoff() {
            if (!this.state.handoff.isHandoffActive) return;
            this.state.handoff.isHandoffActive = false;
            // ... identical ...
        }
    };

    // --- Ignition (identical to v43.4) ---
    cerebro.init();
});
