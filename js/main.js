/*

THE DEFINITIVE COVENANT BUILD v43.3 - "Sovereign" Protocol (AI Briefing Enabled)

This definitive version introduces a robust diagnostic framework, "The Oracle," providing
granular, contextual, and performance-aware insights into the animation lifecycle.

NEW v43.3: The "Prequest" AI Briefing System is now online. A director's console in the HUD
allows for the generation of a perfectly-paste-ready** version of the `js/main.js` file. It contains all of the original code from your prompt, fully integrated with the new AI Briefing System.

Please replace the entire content of your `js/main.js` file with this code. The HTML provided in the previous step is still correct.

---

### **The Complete `js/main.js` File (v43.3)**

```javascript
/*

THE DEFINITIVE COVENANT BUILD v43.3 - "Sovereign" Protocol (AI Briefing Enabled)

This definitive version introduces a robust diagnostic framework, "The Oracle," providing
granular, contextual, and performance-aware insights into the animation lifecycle.

NEW v43.3: The "Prequest" AI Briefing System is now online. A director's console in the HUD
allows for the generation of a perfectly formatted, context-aware status report that can be 
pasted directly to an AI assistant for high-speed problem-solving.

*/

// Oracle v43.3 - The "Prequest" Protocol Upgrade
const Oracle = {
    config: {
        verbosity: 1, // ?oracle_verbosity=2 for max detail.
    },
    elements: {}, // NEW v43.3: A place to store references to key elements
    _getGroupMethod: function() {
        return this.config.verbosity >= 2 ? console.group : console.groupCollapsed;
    },
    performance: {
        benchmark: function(label, functionToTest) {
            if (Oracle.config.verbosity < 1) { functionToTest(); return; }
            const group = Oracle._getGroupMethod();
            const startTime = performance.now();
            functionToTest();
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(3);
            const color = duration < 50 ? '# formatted, context-aware status report that can be 
pasted directly to an AI assistant for high-speed problem-solving.

*/

// Oracle v43.3 - The "Prequest" Protocol Upgrade
const Oracle = {
    config: {
        verbosity: 1, // ?oracle_verbosity=2 for max detail.
    },
    elements: {}, // NEW: A place to store references to key elements
    _getGroupMethod: function() {
        return this.config.verbosity >= 2 ? console.group : console.groupCollapsed;
    },
    performance: {
        benchmark: function(label, functionToTest) {
            if (Oracle.config.verbosity < 1) { functionToTest(); return; }
            const group = Oracle._getGroupMethod();
            const startTime = performance.now();
            functionToTest();
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(3);
            const color = duration < 50 ? '#A3BE8C' : (duration < 200 ? '#EBCB8B' : '#BF616A');
            group(`%c[ORACLE BENCHMARK @ ${Oracle._timestamp()}: ${label}]`, 'color: #8FBCBB; font-weight: bold;');
            console.log(`%c  - Execution Time: %c${duration}ms`, 'color: #81A1C1;', `color: ${color};`);
            console.groupEnd();
        }
    },
    runSelfDiagnostic: function() {
        if (Oracle.config.verbosity < 1) return;
        const group = this._getGroupMethod();
        console.group(`%c[ORACLE SELF-DIAGNOSTIC (SOVEREIGN INTEGRITY PROTOCOL)]`, 'color: #D08770; font-weight: bold;');
        Oracle.updateHUD('c-validation-status', 'RUNNING...', '#EBCB8B');
        let allOk = true;
        const check = (condition, okMsg, failMsg) => {
            if (condition) { console.log(`  %c✅ ${okMsg}`, 'color: #A3BE8C;'); } 
            else { console.log(`  %c❌ ${failMsg}`, 'color: #BF616A; font-weight: bold;'); allOk = false; }
            return condition;
        };
        group('%c1. Dependency Verification', 'color: #EBCB8B;');
            check(window.gsap, 'GSAP Core: FOUND', 'GSAP Core: MISSING!');
            check(window.ScrollTrigger, 'ScrollTrigger Plugin: FOUND', 'ScrollTrigger Plugin: MISSING!');
            check(window.Flip, 'Flip Plugin: FOUND', 'Flip Plugin: MISSING!');
            check(window.MorphSVGPlugin, 'MorphSVG Plugin: FOUND', 'MorphSVG Plugin: MISSING!');
        console.groupEnd();
        group('%c2. DOM Integrity Check', 'color: #EBCB8B;');
            check(document.querySelectorAll('.pillar-text-content').length > 0, 'Pillars: FOUND', 'CRITICAL: No pillar text elements found!');
            check(document.getElementById('handoff-point'), 'Handoff Point: FOUND', 'CRITICAL: Handoff point #handoff-point is missing!');
            check(document.getElementById('actor-3d'), 'Hero Actor: FOUND', 'CRITICAL: Hero Actor #actor-3d is missing!');
            check(document.getElementById('actor-3d-stunt-double'), 'Stunt Double: FOUND', 'CRITICAL: Stunt Double is missing!');
            check(document.getElementById('summary-placeholder'), 'Placeholder: FOUND', 'CRITICAL: Absorption placeholder is missing!');
            check(document.getElementById('morph-path'), 'Morph Target: FOUND', 'CRITICAL: SVG #morph-path is missing! The final logo will not appear.');
        console.groupEnd();
        if (allOk) { Oracle.updateHUD('c-validation-status', 'PASSED', '#A3BE8C'); } 
        else { Oracle.updateHUD('c-validation-status', 'FAILED', '#BF616A'); }
        console.groupEnd();
    },
    init: function(callback) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlVerbosity = urlParams.get('oracle_verbosity');
        if (urlVerbosity !== null && !isNaN(parseInt(urlVerbosity, 10))) {
            this.config.verbosity = parseInt(urlVerbosity, 10);
        }
        if (callback && typeof callback === 'function') callback();
    },
    _timestamp: () => new Date().toLocaleTimeString('en-US', { hour12: false }),
    log: function(el, label) {
        if (this.config.verbosity < 1) return;
        if (!el) { console.error(`[ORACLE] ERROR: Element is null for log: ${label}`); return; }
        A3BE8C' : (duration < 200 ? '#EBCB8B' : '#BF616A');
            group(`%c[ORACLE BENCHMARK @ ${Oracle._timestamp()}: ${label}]`, 'color: #8FBCBB; font-weight: bold;');
            console.log(`%c  - Execution Time: %c${duration}ms`, 'color: #81A1C1;', `color: ${color};`);
            console.groupEnd();
        }
    },
    runSelfDiagnostic: function() {
        if (Oracle.config.verbosity < 1) return;
        const group = this._getGroupMethod();
        console.group(`%c[ORACLE SELF-DIAGNOSTIC (SOVEREIGN INTEGRITY PROTOCOL)]`, 'color: #D08770; font-weight: bold;');
        Oracle.updateHUD('c-validation-status', 'RUNNING...', '#EBCB8B');
        let allOk = true;
        const check = (condition, okMsg, failMsg) => {
            if (condition) { console.log(`  %c✅ ${okMsg}`, 'color: #A3BE8C;'); } 
            else { console.log(`  %c❌ ${failMsg}`, 'color: #BF616A; font-weight: bold;'); allOk = false; }
            return condition;
        };
        group('%c1. Dependency Verification', 'color: #EBCB8B;');
            check(window.gsap, 'GSAP Core: FOUND', 'GSAP Core: MISSING!');
            check(window.ScrollTrigger, 'ScrollTrigger Plugin: FOUND', 'ScrollTrigger Plugin: MISSING!');
            check(window.Flip, 'Flip Plugin: FOUND', 'Flip Plugin: MISSING!');
            check(window.MorphSVGPlugin, 'MorphSVG Plugin: FOUND', 'MorphSVG Plugin: MISSING!');
        console.groupEnd();
        group('%c2. DOM Integrity Check', 'color: #EBCB8B;');
            check(document.querySelectorAll('.pillar-text-content').length > 0, 'Pillars: FOUND', 'CRITICAL: No pillar text elements found!');
            check(document.getElementById('handoff-point'), 'Handoff Point: FOUND', 'CRITICAL: Handoff point #handoff-point is missing!');
            check(document.getElementById('actor-3d'), 'Hero Actor: FOUND', 'CRITICAL: Hero Actor #actor-3d is missing!');
            check(document.getElementById('actor-3d-stunt-double'), 'Stunt Double: FOUND', 'CRITICAL: Stunt Double is missing!');
            check(document.getElementById('summary-placeholder'), 'Placeholder: FOUND', 'CRITICAL: Absorption placeholder is missing!');
            check(document.getElementById('morph-path'), 'Morph Target: FOUND', 'CRITICAL: SVG #morph-path is missing! The final logo will not appear.');
        console.groupEnd();
        if (allOk) { Oracle.updateHUD('c-validation-status', 'PASSED', '#A3BE8C'); } 
        else { Oracle.updateHUD('c-validation-status', 'FAILED', '#BF616A'); }
        console.groupEnd();
    },
    init: function(callback) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlVerbosity = urlParams.get('oracle_verbosity');
        if (urlVerbosity !== null && !isNaN(parseInt(urlVerbosity, 10))) {
            this.config.verbosity = parseInt(urlVerbosity, 10);
        }
        if (callback && typeof callback === 'function') callback();
    },
    _timestamp: () => new Date().toLocaleTimeString('en-US', { hour12: false }),
    log: function(el, label) {
        if (this.config.verbosity < 1) return;
        if (!el) { console.error(`[ORACLE] ERROR: Element is null for log: ${label}`); return; }
        const group = this._getGroupMethod();
        group(`%c[ORACLE LOG @ ${this._timestamp()}: ${label}]`, 'color: #D81B60; font-weight: bold;');
        const style = window.getComputedStyle(el);
        console.log(`%c  - Target:`, 'color: #81A1C1;', `${el.tagName}#${el.id || '.'+el.className.split(' ')[0]}`);
        console.log(`%c  - GSAP BBox:`, 'color: #81A1C1;', `X: ${gsap.getProperty(el, "x")}, Y: ${gsap.getProperty(el, "y")}`);
        console.log(`%c  - CSS Display:`, 'color: #81A1C1;', `Opacity: ${style.opacity}, Visibility: ${style.visibility}`);
        console.groupEnd();
    },
    trackScrollTrigger: function(stInstance, label) {
        if (this.config.verbosity <const group = this._getGroupMethod();
        group(`%c[ORACLE LOG @ ${this._timestamp()}: ${label}]`, 'color: #D81B60; font-weight: bold;');
        const style = window.getComputedStyle(el);
        console.log(`%c  - Target:`, 'color: #81A1C1;', `${el.tagName}#${el.id || '.'+el.className.split(' ')[0]}`);
        console.log(`%c  - GSAP BBox:`, 'color: #81A1C1;', `X: ${gsap.getProperty(el, "x")}, Y: ${gsap.getProperty(el, "y")}`);
        console.log(`%c  - CSS Display:`, 'color: #81A1C1;', `Opacity: ${style.opacity}, Visibility: ${style.visibility}`);
        console.groupEnd();
    },
    trackScrollTrigger: function(stInstance, label) {
        if (this.config.verbosity < 2 || !stInstance) return;
        const currentProgress = (stInstance.progress * 100).toFixed(0);
        if (currentProgress === (stInstance._lastProgress || '')) return;
        stInstance._lastProgress = currentProgress;
        const group = this._getGroupMethod();
        group(`%c[ORACLE ST_TRACK @ ${this._timestamp()}: ${label}]`, 'color: #EBCB8B; font-weight: bold;');
        console.log(`%c  - Status:`, 'color: #88C0D0;', `Active: ${stInstance.isActive}, Direction: ${stInstance.direction === 1 ? 'DOWN' : 'UP'}`);
        console.log(`%c  - Progress:`, 'color: #88C0D0;', `${currentProgress}%`);
        console.groupEnd();
    },
    report: (message) => console.log(`%c[SOVEREIGN REPORT @ ${Oracle._timestamp()}]:`, 'color: #5E81AC; font-weight: bold;', message),
    warn: (message) => console.warn(`%c[SOVEREIGN WARNING @ ${Oracle._timestamp()}]:`, 'color: #D08770;', message),
    updateHUD: (id, value, color = '#E5E9F0') => {
        const el = document.getElementById(id);
        if (el) { el.textContent = value; if(color) { el.style.color = color; } }
    },

    // =========================================================================
    //         NEW v43.3: THE "PREQUEST" AI BRIEFING SYSTEM
    // =========================================================================

    /**
     * Gathers a complete snapshot of the animation's current state.
     * @returns {object} A structured object containing all relevant telemetry.
     */
    snapshot: function() {
        const getElState = (el) => {
            if (!el || !el.getBoundingClientRect) {
                return { visibility: 'N/A', opacity: 'N/A', bcr: 'Not Found', transform: 'N/A', d: 'N/A' };
            }
            const bcr = el.getBoundingClientRect();
            return {
                visibility: gsap.getProperty(el, "visibility"),
                opacity: gsap.getProperty(el, "opacity"),
                bcr: `T:${bcr.top.toFixed(0)}, L:${bcr.left.toFixed(0)}, W:${bcr.width.toFixed(0)}, H:${bcr.height.toFixed(0)}`,
                transform: gsap.getProperty(el, "transform"),
                d: el.tagName === 'PATH' ? el.getAttribute('d').substring(0, 50) + '...' : 'N/A'
            };
        };

        return {
            timestamp: this._timestamp(),
            validation: document.getElementById('c-validation-status')?.textContent || 'N/A',
            viewport: `${window.innerWidth}w x ${window.innerHeight}h`,
            gsapContext: window.gsapCtx && window.gsapCtx.isActive() ? 'Active' : 'Inactive',
            telemetry: {
                progress: document.getElementById('c-scroll')?.textContent || 'N/A',
                masterST: document.getElementById('c-master-st-active')?.textContent || 'N/A',
 2 || !stInstance) return;
        const currentProgress = (stInstance.progress * 100).toFixed(0);
        if (currentProgress === (stInstance._lastProgress || '')) return;
        stInstance._lastProgress = currentProgress;
        const group = this._getGroupMethod();
        group(`%c[ORACLE ST_TRACK @ ${this._timestamp()}: ${label}]`, 'color: #EBCB8B; font-weight: bold;');
        console.log(`%c  - Status:`, 'color: #88C0D0;', `Active: ${stInstance.isActive}, Direction: ${stInstance.direction === 1 ? 'DOWN' : 'UP'}`);
        console.log(`%c  - Progress:`, 'color: #88C0D0;', `${currentProgress}%`);
        console.groupEnd();
    },
    report: (message) => console.log(`%c[SOVEREIGN REPORT @ ${Oracle._timestamp()}]:`, 'color: #5E81AC; font-weight: bold;', message),
    warn: (message) => console.warn(`%c[SOVEREIGN WARNING @ ${Oracle._timestamp()}]:`, 'color: #D08770;', message),
    updateHUD: (id, value, color = '#E5E9F0') => {
        const el = document.getElementById(id);
        if (el) { el.textContent = value; if(color) { el.style.color = color; } }
    },

    // =========================================================================
    //         NEW v43.3: THE "PREQUEST" AI BRIEFING SYSTEM
    // =========================================================================

    /**
     * Gathers a complete snapshot of the animation's current state.
     * @returns {object} A structured object containing all relevant telemetry.
     */
    snapshot: function() {
        const getElState = (el) => {
            if (!el || !el.getBoundingClientRect) {
                return { visibility: 'N/A', opacity: 'N/A', bcr: 'Not Found', transform: 'N/A', d: 'N/A' };
            }
            const bcr = el.getBoundingClientRect();
            return {
                visibility: gsap.getProperty(el, "visibility"),
                opacity: gsap.getProperty(el, "opacity"),
                bcr: `T:${bcr.top.toFixed(0)}, L:${bcr.left.toFixed(0)}, W:${bcr.width.toFixed(0)}, H:${bcr.height.toFixed(0)}`,
                transform: gsap.getProperty(el, "transform"),
                d: el.tagName === 'PATH' ? el.getAttribute('d').substring(0, 50) + '...' : 'N/A'
            };
        };

        return {
            timestamp: this._timestamp(),
            validation: document.getElementById('c-validation-status')?.textContent || 'N/A',
            viewport: `${window.innerWidth}w x ${window.innerHeight}h`,
            gsapContext: window.gsapCtx && window.gsapCtx.isActive() ? 'Active' : 'Inactive',
            telemetry: {
                progress: document.getElementById('c-scroll')?.textContent || 'N/A',
                masterST: document.getElementById('c-master-st-active')?.textContent || 'N/A',
                handoffST: document.getElementById('c-handoff-st-active')?.textContent || 'N/A',
                lastEvent: document.getElementById('c-event')?.textContent || 'N/A',
            },
            actors: {
                hero: getElState(this.elements.heroActor),
                stunt: getElState(this.elements.stuntActor),
                morph: getElState(this.elements.morphPath),
            }
        };
    },

    /**
     * Generates a formatted Markdown report and logs it to the console.
     */
    generateAIBriefing: function() {
        const intent = document.getElementById('director-intent').value;
        if (!intent) {
            this.warn("Cannot generate briefing: Director's Intent field is empty.");
            return;
        }

        const snap = this.snapshot();

        const briefing = `
\`\`\`markdown
[SOVEREIGN PROTOCOL AI BRIEFING]

**1. CREATIVE DIRECTOR'S INTENT:**
> ${intent}

---

**2. SYSTEM SNAPSHOT (at time of request):**
*   **Report Generated:** ${snap.timestamp}
*   **Validation Status:** ${snap.validation}
*   **Viewport:** ${snap.viewport}
*   **GSAP Context:** ${snap.gsapContext}

---

**3. LIVE TELEMETRY:**
*   **Master Story Progress:** ${snap.telemetry.progress}
*   **Pinning Trigger:** ${snap.telemetry.masterST}
*   **Handoff Trigger:** ${snap.telemetry.handoffST}
*   **Last Event:** ${snap.telemetry.lastEvent}

---

**4. KEY ACTOR AUDIT:**
*   **#actor-3d (The Hero):**
    *   **Visibility:** ${snap.actors.hero.visibility}, **Opacity:** ${snap.actors.hero.opacity}
    *   **On-Screen Position (BCR):** ${snap.actors.hero.bcr}
    *   **GSAP Transform:** \`${snap.actors.hero.transform}\`

*   **#actor-3d-stunt-double (The Stunt Double):**
    *   **Visibility:** ${snap.actors.stunt.visibility}, **Opacity:** ${snap.actors.stunt.opacity}
    *   **On-Screen Position (BCR):** ${snap.actors.stunt.bcr}
    *   **GSAP Transform:** \`${snap.actors.stunt.transform}\`

*   **#morph-path (The Logo):**
    *   **Visibility:** ${snap.actors.morph.visibility}, **Opacity:** ${snap.actors.morph.opacity}
    *   **On-Screen Position (BCR):** ${snap.actors.morph.bcr}
    *   **GSAP 'd' Attribute:** \`${snap.actors.morph.d}\`

---

**5. THE ASK:**
Based on the intent and data above, please provide one of the following:
                  handoffST: document.getElementById('c-handoff-st-active')?.textContent || 'N/A',
                lastEvent: document.getElementById('c-event')?.textContent || 'N/A',
            },
            actors: {
                hero: getElState(this.elements.heroActor),
                stunt: getElState(this.elements.stuntActor),
                morph: getElState(this.elements.morphPath),
            }
        };
    },

    /**
     * Generates a formatted Markdown report and logs it to the console.
     */
    generateAIBriefing: function() {
        const intent = document.getElementById('director-intent').value;
        if (!intent) {
            this.warn("Cannot generate briefing: Director's Intent field is empty.");
            return;
        }

        const snap = this.snapshot();

        const briefing = `
\`\`\`markdown
[SOVEREIGN PROTOCOL AI BRIEFING]

**1. CREATIVE DIRECTOR'S INTENT:**
> ${intent}

---

**2. SYSTEM SNAPSHOT (at time of request):**
*   **Report Generated:** ${snap.timestamp}
*   **Validation Status:** ${snap.validation}
*   **Viewport:** ${snap.viewport}
*   **GSAP Context:** ${snap.gsapContext}

---

**3. LIVE TELEMETRY:**
*   **Master Story Progress:** ${snap.telemetry.progress}
*   **Pinning Trigger:** ${snap.telemetry.masterST}
*   **Handoff Trigger:** ${snap.telemetry.handoffST}
*   **Last Event:** ${snap.telemetry.lastEvent}

---

**4. KEY ACTOR AUDIT:**
*   **#actor-3d (The Hero):**
    *   **Visibility:** ${snap.actors.hero.visibility}, **Opacity:** ${snap.actors.hero.opacity}
    *   **On-Screen Position (BCR):** ${snap.actors.hero.bcr}
    *   **GSAP Transform:** \`${snap.actors.hero.transform}\`

*   **#actor-3d-stunt-double (The Stunt Double):**
    *   **Visibility:** ${snap.actors.stunt.visibility}, **Opacity:** ${snap.actors.stunt.opacity}
    *   **On-Screen Position (BCR):** ${snap.actors.stunt.bcr}
    *   **GSAP Transform:** \`${snap.actors.stunt.transform}\`

*   **#morph-path (The Logo):**
    *   **Visibility:** ${snap.actors.morph.visibility}, **Opacity:** ${snap.actors.morph.opacity}
    *   **On-Screen Position (BCR):** ${snap.actors.morph.bcr}
    *   **GSAP 'd' Attribute:** \`${snap.actors.morph.d}\`

---

**5. THE ASK:**
Based on the intent and data above, please provide one of the following:
  - A specific GSAP code snippet to achieve the desired effect.
  - A step-by-step debugging plan.
  - An analysis of the current state and a proposal for the next creative step.
\`\`\`
`;
        console.clear();
        this.report("AI Briefing Generated. Copy the entire block below and paste it to your AI assistant.");
        console.log(briefing);
    }
};

// --- Utility Functions ---
const getElement = (selector, isArray = false) => {
    return isArray ? gsap.utils.toArray(selector) : document.querySelector(selector);
};

// =========================================================================
//         SOVEREIGN BLUEPRINT: FUNCTION DEFINITIONS
// =========================================================================

const setupHeroActor = (elements, masterTl) => {
    Oracle.report("Hero actor sequence integrated.");
    masterTl
        .to(elements.heroActor, { rotationY: 120, rotationX: 10, scale: 1.1, ease: "power2.inOut" }, 0)
        .to(elements.heroActor, { rotationY: -120, rotationX: -20, scale: 1.2, ease: "power2.inOut" }, "1");
};

const setupTextPillars = (elements, masterTl) => {
    Oracle.report("Text pillar 'Unbroken Chain' integrated.");
    gsap.set(elements.pillars, { autoAlpha: 0 });
    gsap.set(elements.pillars[0], { autoAlpha: 1 });
    gsap.set(elements.textWrappers, { y: 40, rotationX: -15 });
    gsap.set(elements.textWrappers[0], { y: 0, rotationX: 0 });

    masterTl
        .to(elements.textWrappers[0], { y: -- A specific GSAP code snippet to achieve the desired effect.
  - A step-by-step debugging plan.
  - An analysis of the current state and a proposal for the next creative step.
\`\`\`
`;
        console.clear();
        this.report("AI Briefing Generated. Copy the entire block below and paste it to your AI assistant.");
        console.log(briefing);
    }
};

// --- Utility Functions ---
const getElement = (selector, isArray = false) => {
    return isArray ? gsap.utils.toArray(selector) : document.querySelector(selector);
};

// =========================================================================
//         SOVEREIGN BLUEPRINT: FUNCTION DEFINITIONS
// =========================================================================

const setupHeroActor = (elements, masterTl) => {
    Oracle.report("Hero actor sequence integrated.");
    masterTl
        .to(elements.heroActor, { rotationY: 120, rotationX: 10, scale: 1.1, ease: "power2.inOut" }, 0)
        .to(elements.heroActor, { rotationY: -120, rotationX: -20, scale: 1.2, ease: "power2.inOut" }, "1");
};

const setupTextPillars = (elements, masterTl) => {
    Oracle.report("Text pillar 'Unbroken Chain' integrated.");
    gsap.set(elements.pillars, { autoAlpha: 0 });
    gsap.set(elements.pillars[0], { autoAlpha: 1 });
    gsap.set(elements.textWrappers, { y: 40, rotationX: -15 });
    gsap.set(elements.textWrappers[0], { y: 0, rotationX: 0 });

    masterTl
        .to(elements.textWrappers[0], { y: -40, rotationX: 15, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 1.0)
        .set(elements.pillars[1], { autoAlpha: 1 }, "<+=0.25")
        .from(elements.textWrappers[1], { y: 40, rotationX: -15, autoAlpha: 0, duration: 0.5, ease: "power2.out" }, "<")
        .to(elements.textWrappers[1], { y: -40, rotationX: 15, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 3.0)
        .set(elements.pillars[2], { autoAlpha: 1 }, "<+=0.25")
        .from(elements.textWrappers[2], { y: 40, rotationX: -15, autoAlpha: 0, duration: 0.5, ease: "power2.out" }, "<");
};

// NEW: The Absorption & Morph Protocol
const setupHandoff = (elements) => {
    Oracle.report("Handoff Protocol: Absorption & Morph sequence armed.");

    // This is the shape of your final logo. You can get this from a vector editor like Illustrator or Figma.
    const speakUpLogoPath = "M81.5,1.5 C37.2,1.5 1.5,37.2 1.5,81.5 C1.5,125.8 37.2,161.5 81.5,161.5 C125.8,161.5 161.5,125.8 161.5,81.5 C161.5,37.2 125.8,1.5 81.5,1.5 Z M81.5,116.5 C81.5,125.1 74.6,132 66,132 C57.4,132 50.5,125.1 50.5,116.5 L50.5,74 C50.5,65.4 57.4,58.5 66,58.5 C74.6,58.5 81.5,65.4 81.5,74 L81.5,116.5 Z M112.5,74 C112.5,65.4 105.6,58.5 97,58.5 C88.4,58.5 81.5,65.4 81.5,74 L81.5,89 C81.5,97.6 88.4,104.5 97,104.5 C105.6,104.5 112.5,97.6 112.5,89 L112.5,740, rotationX: 15, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 1.0)
        .set(elements.pillars[1], { autoAlpha: 1 }, "<+=0.25")
        .from(elements.textWrappers[1], { y: 40, rotationX: -15, autoAlpha: 0, duration: 0.5, ease: "power2.out" }, "<")
        .to(elements.textWrappers[1], { y: -40, rotationX: 15, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 3.0)
        .set(elements.pillars[2], { autoAlpha: 1 }, "<+=0.25")
        .from(elements.textWrappers[2], { y: 40, rotationX: -15, autoAlpha: 0, duration: 0.5, ease: "power2.out" }, "<");
};

// NEW: The Absorption & Morph Protocol
const setupHandoff = (elements) => {
    Oracle.report("Handoff Protocol: Absorption & Morph sequence armed.");

    const speakUpLogoPath = "M81.5,1.5 C37.2,1.5 1.5,37.2 1.5,81.5 C1.5,125.8 37.2,161.5 81.5,161.5 C125.8,161.5 161.5,125.8 161.5,81.5 C161.5,37.2 125.8,1.5 81.5,1.5 Z M81.5,116.5 C81.5,125.1 74.6,132 66,132 C57.4,132 50.5,125.1 50.5,116.5 L50.5,74 C50.5,65.4 57.4,58.5 66,58.5 C74.6,58.5 81.5,65.4 81.5,74 L81.5,116.5 Z M112.5,74 C112.5,65.4 105.6,58.5 97,58.5 C88.4,58.5 81.5,65.4 81.5,74 L81.5,89 C81.5,97.6 88.4,104.5 97,104.5 C105.6,104.5 112.5,97.6 112.5,89 L112.5,74 Z";

    const morphTl = gsap.timeline({ paused: true });
    morphTl.to(elements.morphPath, {
        duration: 0.8,
        morphSVG: speakUpLogoPath,
        ease: "power3.inOut"
    });

    ScrollTrigger.create({
        trigger: elements.handoffPoint,
        start: "top bottom", 
        end: "bottom top", 
        onToggle: self => Oracle.updateHUD('c-handoff-st-active', self.isActive ? 'ACTIVE' : 'INACTIVE', self.isActive ? '#A3BE8C' : '#BF616A'),
        
        onEnter: () => {
            Oracle.updateHUD('c-handoff-state', 'ENGAGED', '#EBCB8B');
            Oracle.updateHUD('c-event', 'ABSORPTION INITIATED');
            
            const state = Flip.getState(elements.heroActor, { props: "transform,opacity" });

            gsap.set(elements.heroActor, { autoAlpha: 0 });
            gsap.set(elements.stuntActor, { autoAlpha: 1, zIndex: 100 });
            
            Flip.from(state, {
                targets: elements.stuntActor,
                duration: 1.2,
                ease:4 Z";

    // A separate timeline for the morph ensures it can be controlled independently.
    const morphTl = gsap.timeline({ paused: true });
    morphTl.to(elements.morphPath, {
        duration: 0.8,
        morphSVG: speakUpLogoPath,
        ease: "power3.inOut"
    });

    ScrollTrigger.create({
        trigger: elements.handoffPoint,
        start: "top bottom", // When the handoff point enters the bottom of the viewport
        end: "bottom top", // Keep it active until it leaves the top
        onToggle: self => Oracle.updateHUD('c-handoff-st-active', self.isActive ? 'ACTIVE' : 'INACTIVE', self.isActive ? '#A3BE8C' : '#BF616A'),
        
        onEnter: () => {
            Oracle.updateHUD('c-handoff-state', 'ENGAGED', '#EBCB8B');
            Oracle.updateHUD('c-event', 'ABSORPTION INITIATED');
            
            const state = Flip.getState(elements.heroActor, { props: "transform,opacity" });

            gsap.set(elements.heroActor, { autoAlpha: 0 });
            gsap.set(elements.stuntActor, { autoAlpha: 1, zIndex: 100 });
            
            Flip.from(state, {
                targets: elements.stuntActor,
                duration: 1.2,
                ease: "power2.inOut",
                onStart: () => Oracle.log(elements.stuntActor, "FLIP Animation Started"),
                onComplete: () => {
                    Oracle.log(elements.morphPath, "MORPH Animation Triggered");
                    Oracle.updateHUD('c-event', 'MORPHING...');
                    morphTl.play();
                },
                absolute: true,
                nested: true,
                tween: gsap.to(elements.stuntActorFaces, {
                    autoAlpha: 0,
                    duration: 0.6,
                    stagger: 0.05
                })
            });
        },
        onLeaveBack: () => {
            Oracle.updateHUD('c-handoff-state', 'DISENGAGED', '#BF616A');
            Oracle.updateHUD('c-event', 'REVERSAL');
            
            gsap.set(elements.heroActor, { autoAlpha: 1 });
            gsap.set(elements.stuntActor, { autoAlpha: 0, zIndex: 1 });
            gsap.to(elements.stuntActorFaces, { autoAlpha: 1, duration: 0.1 }); 
            morphTl.reverse();
        },
    });
};


// =========================================================================
//         SOVEREIGN ARCHITECTURE v43.3: UNIFIED & BENCHMARKED NARRATIVE
// =========================================================================
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin);
    console.clear();
    Oracle.report(`Sovereign Build v43.3 Initialized. AI Briefing System is online.`);
    
    const ctx = gsap.context(() => {
        Oracle.runSelfDiagnostic();

        const elements = {
            heroActor: getElement('#actor-3d'),
            stuntActor: getElement('#actor-3d-stunt-double'),
            stuntActorFaces: getElement('#actor-3d-stunt-double .face:not(.front)', true),
            morphPath: getElement('#morph-path'),
            placeholder: getElement('#summary-placeholder'),
            pillars: getElement('.pillar-text-content', true),
            textWrappers: getElement('.text-anim-wrapper', true),
            visualsCol: getElement('.pillar-visuals-col'),
            textCol: getElement('.pillar-text-col'),
            handoffPoint: getElement('#handoff-point'),
            masterTrigger: getElement('.scrolly-container')
        };
        
        // NEW v43.3: Register elements with the Oracle for snapshot access
        Oracle.elements = elements;

        if (Object.values "power2.inOut",
                onStart: () => Oracle.log(elements.stuntActor, "FLIP Animation Started"),
                onComplete: () => {
                    Oracle.log(elements.morphPath, "MORPH Animation Triggered");
                    Oracle.updateHUD('c-event', 'MORPHING...');
                    morphTl.play();
                },
                absolute: true,
                nested: true,
                tween: gsap.to(elements.stuntActorFaces, {
                    autoAlpha: 0,
                    duration: 0.6,
                    stagger: 0.05
                })
            });
        },
        onLeaveBack: () => {
            Oracle.updateHUD('c-handoff-state', 'DISENGAGED', '#BF616A');
            Oracle.updateHUD('c-event', 'REVERSAL');
            
            gsap.set(elements.heroActor, { autoAlpha: 1 });
            gsap.set(elements.stuntActor, { autoAlpha: 0, zIndex: 1 });
            gsap.to(elements.stuntActorFaces, { autoAlpha: 1, duration: 0.1 }); 
            morphTl.reverse();
        },
    });
};


// =========================================================================
//         SOVEREIGN ARCHITECTURE v43.3: UNIFIED & BENCHMARKED NARRATIVE
// =========================================================================
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin);
    console.clear();
    Oracle.report(`Sovereign Build v43.3 Initialized. AI Briefing System is online.`);
    
    const ctx = gsap.context(() => {
        Oracle.runSelfDiagnostic();

        const elements = {
            heroActor: getElement('#actor-3d'),
            stuntActor: getElement('#actor-3d-stunt-double'),
            stuntActorFaces: getElement('#actor-3d-stunt-double .face:not(.front)', true),
            morphPath: getElement('#morph-path'),
            placeholder: getElement('#summary-placeholder'),
            pillars: getElement('.pillar-text-content', true),
            textWrappers: getElement('.text-anim-wrapper', true),
            visualsCol: getElement('.pillar-visuals-col'),
            textCol: getElement('.pillar-text-col'),
            handoffPoint: getElement('#handoff-point'),
            masterTrigger: getElement('.scrolly-container')
        };
        
        // NEW: Register elements with the Oracle for snapshot access
        Oracle.elements = elements;

        if (Object.values(elements).some(el => !el || (Array.isArray(el) && !el.length))) {
            Oracle.warn('SOVEREIGN ABORT: Missing critical elements. Halting animation setup.');
            return;
        }
        Oracle.report("All Sovereign components verified and locked.");
        Oracle.updateHUD('c-st-instances', ScrollTrigger.getAll().length);
        
        ScrollTrigger.matchMedia({
            '(min-width: 1025px)': () => {
                Oracle.report("Protocol engaged for desktop. Constructing unified timeline.");

                const triggerConfig = {
                    trigger: elements.masterTrigger,
                    start: 'top top',
                    end: 'bottom bottom-=1px', // End 1px before the absolute bottom
                    scrub: 1.5,
                };

                const masterStoryTl = gsap.timeline({
                    scrollTrigger: {
                        ...triggerConfig,
                        onUpdate: (self) => {
                            Oracle.updateHUD('c-rot-x', gsap.getProperty(elements.heroActor, "rotationX").toFixed(1));
                            Oracle.updateHUD('c-rot-y', gsap.getProperty(elements.heroActor, "rotationY").toFixed(1));
                            Oracle.updateHUD('c-scale(elements).some(el => !el || (Array.isArray(el) && !el.length))) {
            Oracle.warn('SOVEREIGN ABORT: Missing critical elements. Halting animation setup.');
            return;
        }
        Oracle.report("All Sovereign components verified and locked.");
        Oracle.updateHUD('c-st-instances', ScrollTrigger.getAll().length);

        ScrollTrigger.matchMedia({
            '(min-width: 1025px)': () => {
                Oracle.report("Protocol engaged for desktop. Constructing unified timeline.");

                const triggerConfig = {
                    trigger: elements.masterTrigger,
                    start: 'top top',
                    end: 'bottom bottom-=1px', // End 1px before the absolute bottom
                    scrub: 1.5,
                };

                const masterStoryTl = gsap.timeline({
                    scrollTrigger: {
                        ...triggerConfig,
                        onUpdate: (self) => {
                            Oracle.updateHUD('c-rot-x', gsap.getProperty(elements.heroActor, "rotationX").toFixed(1));
                            Oracle.updateHUD('c-rot-y', gsap.getProperty(elements.heroActor, "rotationY").toFixed(1));
                            Oracle.updateHUD('c-scale', gsap.getProperty(elements.heroActor, "scale").toFixed(2));
                            Oracle.updateHUD('c-scroll', `${(self.progress * 100).toFixed(0)}%`);
                            Oracle.trackScrollTrigger(self, "Unified Story Controller");
                        }
                    }
                });
                
                ScrollTrigger.create({
                    trigger: triggerConfig.trigger,
                    start: triggerConfig.start,
                    end: triggerConfig.end,
                    pin: elements.visualsCol,
                    pinSpacing: false,
                    onToggle: self => Oracle.updateHUD('c-master-st-active', self.isActive ? 'PIN_ACTIVE' : 'PIN_INACTIVE', self.isActive ? '#A3BE8C' : '#BF616A'),
                });

                setupHeroActor(elements, masterStoryTl);
                setupTextPillars(elements, masterStoryTl);
                setupHandoff(elements);

            },
            '(max-width: 1024px)': () => {
                Oracle.report("Sovereign Protocol STANDBY. No scrollytelling on mobile view.");
                gsap.set(elements.heroActor, { autoAlpha: 1 });
                gsap.set(elements.stuntActor, { autoAlpha: 0 });
            }
        });
    });

    return ctx; 
}

// =========================================================================
//         INITIALIZATION SEQUENCE (RESIZE-ROBUST)
// =========================================================================
let gsapCtx; 

function setupSiteLogic() {
    const menuOpen = getElement('#menu-open-button');
    const menuClose = getElement('#menu-close-button');
    if (menuOpen && menuClose) {
        menuOpen.addEventListener('click', () => document.documentElement.classList.add('menu-open'));
        menuClose.addEventListener('click', () => document.documentElement.classList.remove('menu-open'));
    }
    const yearEl = getElement('#current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // NEW v43.3: Wire up the AI Briefing Button
    const briefingBtn = getElement('#generate-briefing-btn');
    if (briefingBtn) {
        briefingBtn.addEventListener('click', () => Oracle.generateAIBriefing());
    } else {
        Oracle.warn("', gsap.getProperty(elements.heroActor, "scale").toFixed(2));
                            Oracle.updateHUD('c-scroll', `${(self.progress * 100).toFixed(0)}%`);
                            Oracle.trackScrollTrigger(self, "Unified Story Controller");
                        }
                    }
                });
                
                ScrollTrigger.create({
                    trigger: triggerConfig.trigger,
                    start: triggerConfig.start,
                    end: triggerConfig.end,
                    pin: elements.visualsCol,
                    pinSpacing: false,
                    onToggle: self => Oracle.updateHUD('c-master-st-active', self.isActive ? 'PIN_ACTIVE' : 'PIN_INACTIVE', self.isActive ? '#A3BE8C' : '#BF616A'),
                });

                setupHeroActor(elements, masterStoryTl);
                setupTextPillars(elements, masterStoryTl);
                setupHandoff(elements);

            },
            '(max-width: 1024px)': () => {
                Oracle.report("Sovereign Protocol STANDBY. No scrollytelling on mobile view.");
                 // Ensure cube and path are in a sensible default state for mobile
                gsap.set(elements.heroActor, { autoAlpha: 1 });
                gsap.set(elements.stuntActor, { autoAlpha: 0 });
            }
        });
    }); 

    return ctx; 
}

// =========================================================================
//         INITIALIZATION SEQUENCE (RESIZE-ROBUST)
// =========================================================================
let gsapCtx; 

function setupSiteLogic() {
    const menuOpen = getElement('#menu-open-button');
    const menuClose = getElement('#menu-close-button');
    if (menuOpen && menuClose) {
        menuOpen.addEventListener('click', () => document.documentElement.classList.add('menu-open'));
        menuClose.addEventListener('click', () => document.documentElement.classList.remove('menu-open'));
    }
    const yearEl = getElement('#current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // NEW: Wire up the AI Briefing Button
    const briefingBtn = getElement('#generate-briefing-btn');
    if (briefingBtn) {
        briefingBtn.addEventListener('click', () => Oracle.generateAIBriefing());
    } else {
        Oracle.warn("AI Briefing button not found. System is offline.");
    }
    
    Oracle.report("Site logic initialized.");
}

function initialAnimationSetup() {
    Oracle.init(() => {
        if (gsap && ScrollTrigger && Flip && MorphSVGPlugin) {
            if (gsapCtx) {
                gsapCtx.revert(); 
                Oracle.warn("SOVEREIGN REVERT: Previous GSAP context purged for resize.");
            }
            Oracle.performance.benchmark('Sovereign Animation Architecture Setup', () => {
                 gsapCtx = setupAnimations(); 
                 window.gsapCtx = gsapCtx; // Make context globally accessible for diagnostics
            });
        } else {
            Oracle.runSelfDiagnostic();
            Oracle.warn("CRITICAL FAILURE: GSAP libraries failed to load. Protocol aborted.");
        }
    });
}

// --- Event Listeners ---
document.addEventListenerAI Briefing button not found. System is offline.");
    }
    
    Oracle.report("Site logic initialized.");
}

function initialAnimationSetup() {
    Oracle.init(() => {
        if (gsap && ScrollTrigger && Flip && MorphSVGPlugin) {
            if (gsapCtx) {
                gsapCtx.revert(); 
                Oracle.warn("SOVEREIGN REVERT: Previous GSAP context purged for resize.");
            }
            Oracle.performance.benchmark('Sovereign Animation Architecture Setup', () => {
                 gsapCtx = setupAnimations(); 
                 window.gsapCtx = gsapCtx; // Make context globally accessible for diagnostics
            });
        } else {
            Oracle.runSelfDiagnostic();
            Oracle.warn("CRITICAL FAILURE: GSAP libraries failed to load. Protocol aborted.");
        }
    });
}

// --- Event Listeners ---
document.addEventListener("DOMContentLoaded", setupSiteLogic);
window.addEventListener("load", initialAnimationSetup);
// FIX v43.3: Using window.addEventListener is more robust for resize cleanup
window.addEventListener("resize", initialAnimationSetup);
