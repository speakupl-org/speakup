// This is the definitive, all-in-one animation and diagnostic engine.
export const Sovereign = {
    // --- Configuration ---
    config: { verbosity: 1, logToConsole: true, showHud: true, },

    // --- References (Initialized once) ---
    _refs: { cube: null, textPillars: [] },
    
    // --- State (Updated every frame) ---
    state: {
        scroll: { progress: 0, direction: 'NONE', velocity: 0 },
        cube: { rot: { y: 0, z: 0, x: 0 }, scale: 1 },
        dom: { 
            activePillar: -1, 
            canvasRect: { w: 0, h: 0 },
            textPillarRect: { top: 0, bottom: 0 } 
        },
        performance: { fps: 0 },
    },
    
    // --- Initialization ---
    // Now takes the DOM elements and GSAP as arguments
    init: function(domRefs, gsapInstance) {
        this.gsap = gsapInstance;
        this._refs = domRefs; // Store refs to cube, pillars, etc.

        const urlParams = new URLSearchParams(window.location.search);
        this.config.verbosity = parseInt(urlParams.get('verbosity'), 10) || this.config.verbosity;
        
        if (this.config.showHud) this._createHud();

        this.log('info', `Observer Initialized. Verbosity: ${this.config.verbosity}`);
    },

    // --- Main Animation & Reporting Tick ---
    // This is the single function called by ScrollTrigger on every update.
    update: function(scrollTrigger) {
        const s = this.state; // shorthand for state
        const progress = scrollTrigger.progress;

        // 1. Update State
        s.performance.fps = scrollTrigger.getVelocity().toFixed(0) > 0 ? this.gsap.ticker.fps() : 0;
        s.scroll = {
            progress: progress.toFixed(4),
            direction: scrollTrigger.direction === 1 ? 'DOWN' : 'UP',
            velocity: scrollTrigger.getVelocity().toFixed(1)
        };
        
        // 2. Animate Cube directly
        const cube = this._refs.cube;
        if (cube) {
            cube.rotation.y = progress * Math.PI * 3;
            cube.rotation.z = progress * Math.PI * 1.5;
            cube.rotation.x = progress * Math.PI * -0.5;
            const scale = (progress < 0.5)
                ? this.gsap.utils.mapRange(0, 0.5, 1, 1.2, progress)
                : this.gsap.utils.mapRange(0.5, 1, 1.2, 1, progress);
            cube.scale.set(scale, scale, scale);
            
            s.cube.rot = { y: cube.rotation.y.toFixed(2), z: cube.rotation.z.toFixed(2), x: cube.rotation.x.toFixed(2) };
            s.cube.scale = scale.toFixed(2);
        }

        // 3. Animate Text directly
        const pillars = this._refs.textPillars;
        if (pillars && pillars.length > 0) {
            const numPillars = pillars.length;
            const stepSize = 1 / numPillars;
            s.dom.activePillar = Math.floor(progress / stepSize);

            pillars.forEach((pillar, i) => {
                const pillarStart = i * stepSize;
                const pillarEnd = pillarStart + stepSize;
                const pillarProgress = this.gsap.utils.mapRange(pillarStart, pillarEnd, 0, 1, progress);
                const opacity = Math.sin(pillarProgress * Math.PI);
                this.gsap.set(pillar, { autoAlpha: opacity });

                // Get DOM rect of the currently active pillar
                if (i === s.dom.activePillar) {
                    const rect = pillar.getBoundingClientRect();
                    s.dom.textPillarRect = { top: rect.top.toFixed(0), bottom: rect.bottom.toFixed(0) };
                }
            });
        }
        
        // 4. Update Diagnostics
        const canvasEl = this._refs.cube?.userData?.canvas;
        if(canvasEl) {
             const rect = canvasEl.getBoundingClientRect();
             s.dom.canvasRect = {w: rect.width.toFixed(0), h: rect.height.toFixed(0)};
        }

        // 5. Log everything to console
        if (this.config.logToConsole && this.config.verbosity >= 2) {
            this.log();
        }

        if (this.config.showHud) this._updateHud();
    },

    // The Log function now formats the entire state into a clean report
    log: function(type = 'state', message = '') {
        if (!this.config.logToConsole) return;
        if (type === 'state' && this.config.verbosity < 2) return;
        
        // For non-state logs, just print the message
        if (type !== 'state') {
            console.log(`%c[SVRGN|${type.toUpperCase()}] ${message}`, 'color: #88C0D0; font-weight: bold;');
            return;
        }

        const s = this.state;
        const report = `
---------------- [ SOVEREIGN REPORT ] ----------------
 [SCROLL] Progress: ${s.scroll.progress} | Dir: ${s.scroll.direction} | Vel: ${s.scroll.velocity}
 [CUBE]   Rot(y,z,x): ${s.cube.rot.y}, ${s.cube.rot.z}, ${s.cube.rot.x} | Scale: ${s.cube.scale}
 [DOM]    Active Pillar: ${s.dom.activePillar} | Canvas: ${s.dom.canvasRect.w}x${s.dom.canvasRect.h} | Pillar Top: ${s.dom.textPillarRect.top}
------------------------------------------------------
        `;
        // Single log, no collapsing, with CSS for readability
        console.log(`%c${report}`, 'color: #D8DEE9; background: #2E3440; font-family: monospace; padding: 5px; border-radius: 4px;');
    },

    _createHud: function() {
        this._hudElement = document.createElement('div');
        this._hudElement.id = 'sovereign-hud';
        this._hudElement.style.cssText = `
            position: fixed; top: 15px; right: 15px; z-index: 99999;
            background: rgba(46, 52, 64, 0.85); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            color: #D8DEE9; font-family: monospace; font-size: 12px;
            padding: 10px; border-radius: 6px; border: 1px solid #4C566A;
            width: 280px; pointer-events: none; line-height: 1.5;
            box-shadow: 0 5px 25px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(this._hudElement);
    },

    _updateHud: function() {
        if (!this._hudElement) return;
        this._hudElement.innerHTML = `
            <div><strong>Pillar:</strong> ${this.state.dom.activePillar}</div>
            <div><strong>Progress:</strong> ${this.state.scroll.progress}</div>
            <div style="border-top: 1px dashed #4C566A; margin: 5px 0;"></div>
            <div><strong>Canvas:</strong> ${this.state.dom.canvasRect.w} x ${this.state.dom.canvasRect.h}</div>
        `;
    }
};