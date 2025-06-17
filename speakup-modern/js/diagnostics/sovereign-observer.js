// This is the definitive, all-in-one animation and diagnostic engine.
export const Sovereign = {
    // --- Configuration ---
    config: { verbosity: 1, logToConsole: true, showHud: true, },

    // --- References (Initialized once) ---
    _refs: { cube: null, textPillars: [], timeline: null },
    
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
        // Track previous state for granular logging
        _prev: { // Initialize with values that will ensure the first log fires
            scroll: { progress: -1 },
            cube: { rot: { y: -999, z: -999, x: -999 }, scale: -1 }
        }
    },
    
    // --- Initialization ---
    // Now takes the DOM elements and GSAP as arguments
    init: function(domRefs, gsapInstance) {
        this.gsap = gsapInstance;
        // This will now correctly store { cube, textPillars, timeline }
        this._refs = domRefs;

        const urlParams = new URLSearchParams(window.location.search);
        this.config.verbosity = parseInt(urlParams.get('verbosity'), 10) || this.config.verbosity;
        
        if (this.config.showHud) this._createHud();

        this.log('info', `Observer Initialized. Verbosity: ${this.config.verbosity}`);
    },

    // --- Main Animation & Reporting Tick ---
    // This is the single function called by ScrollTrigger on every update.
    update: function(scrollTrigger) {
        const s = this.state; // shorthand for state
        const prev = s._prev; // shorthand for previous state
        const progress = scrollTrigger.progress;

        // 1. Update State (Scroll, Performance)
        s.performance.fps = scrollTrigger.getVelocity().toFixed(0) > 0 ? this.gsap.ticker.fps() : 0;
        s.scroll = {
            progress: progress.toFixed(4),
            direction: scrollTrigger.direction === 1 ? 'DOWN' : 'UP',
            velocity: scrollTrigger.getVelocity().toFixed(1)
        };
        
        // 2. OBSERVE Cube state (Don't set it!)
        const cube = this._refs.cube;
        if (cube) {
            s.cube.rot = { 
                y: cube.rotation.y.toFixed(2), 
                z: cube.rotation.z.toFixed(2), 
                x: cube.rotation.x.toFixed(2) 
            };
            s.cube.scale = cube.scale.x.toFixed(2);
        }

        // 3. OBSERVE Text state (This was already correct)
        const pillars = this._refs.textPillars;
        if (pillars && pillars.length > 0) {
            const numPillars = pillars.length;
            // Use timeline progress if available, else fallback to scroll progress
            let timelineProgress = progress;
            if (this._refs.timeline && this.gsap.getProperty) {
                const prop = this.gsap.getProperty(this._refs.timeline, "progress");
                if (typeof prop === 'number') timelineProgress = prop;
            }
            const chapterDuration = 1 / numPillars;
            s.dom.activePillar = Math.min(numPillars - 1, Math.floor(timelineProgress / chapterDuration));

            pillars.forEach((pillar, i) => {
                if (i === s.dom.activePillar) {
                    const rect = pillar.getBoundingClientRect();
                    s.dom.textPillarRect = { top: rect.top.toFixed(0), bottom: rect.bottom.toFixed(0) };
                }
            });
        }
        
        // 4. Update Diagnostics (Canvas Rect)
        const canvasEl = this._refs.cube?.userData?.canvas;
        if(canvasEl) {
             const rect = canvasEl.getBoundingClientRect();
             s.dom.canvasRect = {w: rect.width.toFixed(0), h: rect.height.toFixed(0)};
        }

        // Scrollytelling Core Sync Log - only if active or progress changed significantly
        const progressChangedSignificantly = Math.abs(parseFloat(s.scroll.progress) - parseFloat(prev.scroll.progress)) > 0.0001; // Epsilon for progress
        if (this.config.logToConsole && (parseFloat(s.scroll.velocity) !== 0 || progressChangedSignificantly)) {
            console.log(
                `%c[SCROLLYTELL] Prog: ${s.scroll.progress}, Vel: ${s.scroll.velocity}, Dir: ${s.scroll.direction} | CubeYRot: ${s.cube.rot.y}, CubeScale: ${s.cube.scale}`,
                'color: #B48EAD; font-family: monospace;'
            );
        }

        // 5. Log detailed changes to console (if verbosity is high)
        if (this.config.logToConsole && this.config.verbosity >= 2) {
            const epsilon = 0.005; // Threshold for "significant" change in rotation/scale

            const rotYChanged = Math.abs(parseFloat(s.cube.rot.y) - parseFloat(prev.cube.rot.y || 0)) > epsilon;
            const rotZChanged = Math.abs(parseFloat(s.cube.rot.z) - parseFloat(prev.cube.rot.z || 0)) > epsilon;
            const rotXChanged = Math.abs(parseFloat(s.cube.rot.x) - parseFloat(prev.cube.rot.x || 0)) > epsilon;
            const scaleChanged = Math.abs(parseFloat(s.cube.scale) - parseFloat(prev.cube.scale || 0)) > epsilon;
            const progressChangedForTrack = Math.abs(parseFloat(s.scroll.progress) - parseFloat(prev.scroll.progress || 0)) > 0.0001;


            if (progressChangedForTrack || rotYChanged || rotZChanged || rotXChanged || scaleChanged) {
                const delta = {
                    progress: (parseFloat(s.scroll.progress) - (parseFloat(prev.scroll.progress) || 0)).toFixed(4),
                    rot: {
                        y: (parseFloat(s.cube.rot.y) - (parseFloat(prev.cube.rot.y) || 0)).toFixed(2),
                        z: (parseFloat(s.cube.rot.z) - (parseFloat(prev.cube.rot.z) || 0)).toFixed(2),
                        x: (parseFloat(s.cube.rot.x) - (parseFloat(prev.cube.rot.x) || 0)).toFixed(2)
                    },
                    scale: (parseFloat(s.cube.scale) - (parseFloat(prev.cube.scale) || 0)).toFixed(2)
                };
                const report = `\n[TRACK] Progress: ${s.scroll.progress} (Δ${delta.progress}) | Rot(y,z,x): ${s.cube.rot.y}, ${s.cube.rot.z}, ${s.cube.rot.x} (Δ${delta.rot.y},${delta.rot.z},${delta.rot.x}) | Scale: ${s.cube.scale} (Δ${delta.scale})`;
                console.log(`%c${report}`, 'color: #A3BE8C; font-family: monospace;');
            }
            // No "NO CHANGE" log anymore
        }

        // Update previous state for next tick comparison
        prev.scroll.progress = s.scroll.progress;
        prev.cube.rot.y = s.cube.rot.y;
        prev.cube.rot.z = s.cube.rot.z;
        prev.cube.rot.x = s.cube.rot.x;
        prev.cube.scale = s.cube.scale;


        if (this.config.showHud) this._updateHud();
    },

    // The Log function now formats the entire state into a clean report
    log: function(type = 'state', message = '') {
        if (!this.config.logToConsole) return;
        // For 'state' logs, only proceed if verbosity is 2 or higher.
        // For other types ('info', 'error', etc.), proceed if verbosity is 1 or higher.
        if (type === 'state' && this.config.verbosity < 2) return;
        if (type !== 'state' && this.config.verbosity < 1) return; // Basic logs for verbosity 1+
        
        // For non-state logs, just print the message
        if (type !== 'state') {
            let color = '#88C0D0'; // Default blue for info
            if (type === 'error') color = '#BF616A'; // Red for errors
            if (type === 'warn') color = '#EBCB8B'; // Yellow for warnings
            console.log(`%c[SVRGN|${type.toUpperCase()}] ${message}`, `color: ${color}; font-weight: bold;`);
            return;
        }

        const s = this.state;
        // The main group is already expanded by default.
        console.group(`%cSOVEREIGN REPORT (Verbosity ${this.config.verbosity})`, 'color: #D8DEE9; background: #2E3440; font-family: monospace; padding: 2px 5px; border-radius: 4px;');
        // Log full objects for easy inspection
        console.log('%c[SCROLL]', 'color: #A3BE8C; font-family: monospace; font-weight: bold;', s.scroll);
        console.log('%c[CUBE]', 'color: #EBCB8B; font-family: monospace; font-weight: bold;', s.cube);
        console.log('%c[DOM]', 'color: #88C0D0; font-family: monospace; font-weight: bold;', s.dom);
        console.log('%c[PERF]', 'color: #B48EAD; font-family: monospace; font-weight: bold;', {fps: s.performance.fps});
        console.groupEnd();
    },

    // Custom log for scroll-telling state updates
    logScollytellState: function(progress, velocity, direction) {
        if (this.config.logToConsole && this.config.verbosity >= 1) {
            console.log(`%c[SCROLLYTELL] Prog: ${progress.toFixed(4)}, Vel: ${velocity.toFixed(1)}, Dir: ${direction}`, 'color: #B48EAD; font-family: monospace;');
        }
    },

    // Update cube state for diagnostics
    updateCubeState: function({ rotationY, scale }) {
        if (this._refs.cube) {
            this.state.cube.rot.y = rotationY.toFixed(2);
            this.state.cube.scale = scale.toFixed(2);
        }
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
        let timelineProgress = 'N/A';
        if (this._refs.timeline && typeof this._refs.timeline.progress === 'function') { // Check if progress is a function
            timelineProgress = this._refs.timeline.progress().toFixed(4);
        } else if (this._refs.timeline && typeof this._refs.timeline.progress === 'number') { // Check if progress is a number (e.g. if it's a direct value)
             timelineProgress = this._refs.timeline.progress.toFixed(4);
        }

        const s = this.state;
        this._hudElement.innerHTML = `
            <div><strong>Pillar:</strong> ${s.dom.activePillar} | <strong>FPS:</strong> ${s.performance.fps}</div>
            <div><strong>Scroll :</strong> ${s.scroll.progress} (V:${s.scroll.velocity} D:${s.scroll.direction})</div>
            <div><strong>Timeline:</strong> ${timelineProgress}</div> 
            <div style="border-top: 1px dashed #4C566A; margin: 5px 0;"></div>
            <div><strong>Rot(Y):</strong> ${s.cube.rot.y} | <strong>Rot(X):</strong> ${s.cube.rot.x} | <strong>Rot(Z):</strong> ${s.cube.rot.z}</div>
            <div><strong>Scale:</strong> ${s.cube.scale}</div>
        `;
    }
};