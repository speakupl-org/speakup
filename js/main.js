/**
 * =========================================================================
 * SOVEREIGN PROTOCOL v43.2 - "THE ORACLE BUILD"
 * Cerebro, The Scrollytelling Sage
 *
 * This is not merely a script. It is an Oracle. It sees every scroll,
 * every tween, every pixel. It anticipates, it critiques, it guides.
 * Its purpose is to ensure the narrative journey is nothing short of magical.
 * It will report its findings with relentless, granular detail in the console.
 *
 * Obey its wisdom.
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // The Oracle's Eye: It first gathers its tools and subjects.
    const cerebro = {
        // --- CORE DOM ELEMENTS ---
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

        // --- STATE & MEMORY ---
        lastScrollY: window.scrollY,
        scrollDirection: 'idle',
        isTicking: false,
        isHandoffActive: false,
        wisdom: {
            // The actual SVG path data for your logo.
            // I've created a stylized "SU" for Speak Up as an example.
            // To get your own, export your logo as an SVG, open it in a text editor, and copy the 'd' attribute from the <path> tag.
            logoPath: "M50,20 C70,20 80,30 80,50 C80,70 70,80 50,80 C30,80 20,70 20,50 C20,30 30,20 50,20 M113,143 C93,143 83,133 83,113 C83,93 93,83 113,83 C133,83 143,93 143,113 C143,133 133,143 113,143",
            squarePath: "M0,0 H163 V163 H0 Z",
        },

        // --- THE ORACLE'S VOICE (Logging System) ---
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
            console.log('%c[Cerebro Oracle v43.2 Initializing...]', greetingStyle);
            this.speak("Consciousness online. I am observing the digital ether.");

            if (!this.validateDependencies()) return;

            this.setupEventListeners();
            this.setupScrollytelling();

            this.speak("Oracle systems nominal. Awaiting user input.", "color: #A3BE8C;");
            this.hud.validation.textContent = "VALIDATED";
            this.hud.validation.style.color = "#A3BE8C";
        },

        validateDependencies() {
            this.speak("Validating required plugins...");
            let isValid = true;
            if (typeof gsap === 'undefined') {
                this.error("GSAP Core Missing", "The main GSAP library is not loaded.", "Ensure the GSAP script tag is present in your HTML before this script.");
                isValid = false;
            }
            if (typeof ScrollTrigger === 'undefined') {
                this.error("ScrollTrigger Missing", "GSAP's ScrollTrigger plugin is not loaded.", "Ensure the ScrollTrigger script is present after the GSAP core script.");
                isValid = false;
            }
            if (typeof Flip === 'undefined') {
                this.error("Flip Plugin Missing", "GSAP's Flip plugin is critical for the handoff.", "Ensure the Flip plugin script is present. The handoff will fail without it.");
                isValid = false;
            }
            if (typeof MorphSVGPlugin === 'undefined') {
                this.error("MorphSVGPlugin Missing", "GSAP's MorphSVGPlugin is needed for the final logo transformation.", "Ensure the MorphSVGPlugin script is present. The absorption effect will be incomplete.");
                isValid = false;
            }

            if (isValid) {
                this.speak("All dependencies validated. Registering plugins.", "color: #A3BE8C;");
                gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin);
            } else {
                this.hud.validation.textContent = "FAILED";
                this.hud.validation.style.color = "#BF616A";
            }
            return isValid;
        },
        
        setupEventListeners() {
            window.addEventListener('scroll', () => {
                if (!this.isTicking) {
                    window.requestAnimationFrame(() => {
                        this.analyzeScroll();
                        this.isTicking = false;
                    });
                    this.isTicking = true;
                }
            });
            this.speak("Scroll listener attached. I now feel every movement.");
        },

        analyzeScroll() {
            const currentScrollY = window.scrollY;
            const direction = currentScrollY > this.lastScrollY ? 'down' : 'up';
            
            if (direction !== this.scrollDirection) {
                this.scrollDirection = direction;
                this.speak(`Scroll direction changed: ${direction === 'down' ? 'Descending into the narrative.' : 'Ascending, reviewing the path.'}`);
            }
            
            this.lastScrollY = currentScrollY;
        },

        updateHUD(tl) {
            this.hud.scroll.textContent = `${(tl.progress * 100).toFixed(1)}%`;
            this.hud.rotX.textContent = gsap.getProperty(this.actors.hero, "rotationX").toFixed(1);
            this.hud.rotY.textContent = gsap.getProperty(this.actors.hero, "rotationY").toFixed(1);
            this.hud.scale.textContent = gsap.getProperty(this.actors.hero, "scale").toFixed(2);
        },

        setupScrollytelling() {
            this.group("Scrollytelling Sequence Setup");

            // --- MASTER SCROLL TIMELINE ---
            this.speak("Defining the master narrative timeline for the Hero Actor.");
            const masterTL = gsap.timeline({
                scrollTrigger: {
                    trigger: this.stages.scrollyContainer,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1.2,
                    pin: this.stages.scrollyContainer.querySelector('.pillar-visuals-col'),
                    onUpdate: (self) => this.updateHUD(self),
                    onEnter: () => {
                        this.hud.masterST.textContent = "ACTIVE";
                        this.hud.masterST.style.color = "#A3BE8C";
                        this.speak("Master ScrollTrigger entered. The journey begins.");
                    },
                    onLeave: () => {
                         this.hud.masterST.textContent = "COMPLETE";
                         this.hud.masterST.style.color = "#EBCB8B";
                    },
                    onEnterBack: () => {
                        this.hud.masterST.textContent = "ACTIVE";
                        this.hud.masterST.style.color = "#A3BE8C";
                        this.speak("Re-entering Master ScrollTrigger from below.");
                    },
                }
            });

            masterTL
                .to(this.actors.hero, { rotationX: -180, ease: "none" }, 0)
                .to(this.actors.hero, { rotationY: 360, ease: "none" }, 0)
                .to(this.actors.hero, { scale: 1.5, ease: "power1.in" }, 0)
                .to(this.actors.hero, { scale: 1.0, ease: "power1.out" }, 0.5);
            
            this.speak(`Timeline defined with ${masterTL.duration()}s of animation.`);

            // --- TEXT PILLAR FADE-IN/OUT TRIGGERS ---
            this.speak("Calibrating narrative triggers for each text pillar.");
            this.stages.textPillars.forEach((pillar, index) => {
                const pillarNum = index + 1;
                gsap.to(pillar, {
                    scrollTrigger: {
                        trigger: pillar,
                        start: "top center",
                        end: "bottom center",
                        onEnter: () => {
                            this.speak(`Pillar ${pillarNum} entered viewport. Fading in text.`);
                            gsap.to(pillar, { opacity: 1, visibility: 'visible', duration: 0.5 });
                        },
                        onLeave: () => {
                             gsap.to(pillar, { opacity: 0, visibility: 'hidden', duration: 0.5 });
                        },
                        onEnterBack: () => {
                            this.speak(`Pillar ${pillarNum} re-entered (scrolling up). Fading in text.`);
                            gsap.to(pillar, { opacity: 1, visibility: 'visible', duration: 0.5 });
                        },
                        onLeaveBack: () => {
                            gsap.to(pillar, { opacity: 0, visibility: 'hidden', duration: 0.5 });
                        }
                    }
                });
            });

            this.hud.stInstances.textContent = ScrollTrigger.getAll().length;
            this.speak("Text triggers are set. The story will unfold with the scroll.");

            // --- THE SOVEREIGN HANDOFF PROTOCOL ---
            this.speak("Preparing the SOVEREIGN HANDOFF PROTOCOL. This is where the magic is forged.");
            this.warn("This is a critical transition.", "Any judder or 'blip' here breaks the illusion. I will be watching closely.");

            ScrollTrigger.create({
                trigger: this.stages.handoffPoint,
                start: "top bottom",
                onEnter: () => this.executeHandoff(),
                onLeaveBack: () => this.reverseHandoff(),
                onToggle: (self) => {
                    const isActive = self.isActive;
                    this.hud.handoffST.textContent = isActive ? "ACTIVE" : "INACTIVE";
                    this.hud.handoffST.style.color = isActive ? "#A3BE8C" : "#ECEFF4";
                },
            });
            
            this.groupEnd();
        },

        executeHandoff() {
            if (this.isHandoffActive) return;
            this.isHandoffActive = true;
            
            this.group("Handoff Protocol: ENGAGED");
            this.hud.swapFlag.textContent = "ENGAGED";
            this.hud.swapFlag.style.color = "#EBCB8B";
            this.hud.event.textContent = "FLIP & MORPH";

            // 1. Capture the current state of the Hero Actor
            this.speak("Capturing final state of Hero Actor. Freezing reality.");
            const state = Flip.getState(this.actors.hero);

            // 2. Immediately move the Stunt Double to the placeholder and make it visible
            this.stages.finalPlaceholder.appendChild(this.actors.stuntDouble);
            gsap.set(this.actors.stuntDouble, { opacity: 1, visibility: 'visible', scale: 1, rotation: 0 });
            gsap.set(this.actors.hero, { opacity: 0, visibility: 'hidden' });
            this.speak("Hero Actor dematerialized. Stunt Double materialized at destination.");

            // 3. Animate the Stunt Double FROM the captured state TO its current state
            this.speak("Executing FLIP. Bending space-time for a seamless transition...");
            Flip.from(state, {
                duration: 1.2,
                ease: "power3.inOut",
                onComplete: () => {
                    this.speak("FLIP animation complete. The actor has landed.", "color: #A3BE8C");
                }
            });

            // 4. Simultaneously, MORPH the Stunt Double's square path into the logo path
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
            if (!this.isHandoffActive) return;
            this.isHandoffActive = false;
            
            this.group("Reverse Handoff: ENGAGED");
            this.hud.swapFlag.textContent = "REVERSING";
            this.hud.swapFlag.style.color = "#EBCB8B";
            this.hud.event.textContent = "RESETTING";

            // Reverse the morph and hide the stunt double
            this.speak("Reversing the MORPH. Returning to primal form.");
            gsap.to(this.actors.morphPath, {
                duration: 0.3,
                ease: "power2.out",
                morphSVG: this.wisdom.squarePath
            });
            
            gsap.to(this.actors.stuntDouble, {
                duration: 0.2,
                opacity: 0,
                onComplete: () => {
                     gsap.set(this.actors.stuntDouble, { visibility: 'hidden' });
                }
            })

            // Instantly show the hero actor again
            this.speak("Stunt Double dematerialized. Rematerializing Hero Actor.");
            gsap.set(this.actors.hero, { opacity: 1, visibility: 'visible' });
            
            this.speak("Reverse handoff complete. The journey continues upward.", "color: #A3BE8C;");
            this.hud.swapFlag.textContent = "INACTIVE";
            this.hud.swapFlag.style.color = "#ECEFF4";
            this.hud.event.textContent = "AWAITING TRIGGER";
            this.groupEnd();
        }
    };

    // --- IGNITION ---
    cerebro.init();

});
