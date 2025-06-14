/*
THE DEFINITIVE COVENANT BUILD v44.1 - "Sovereign" Hybrid Protocol (Corrected)
This version resolves initialization race conditions and fixes internal function calls.
*/

// =========================================================================
//         ORACLE v44.1 - GRANULAR TELEMETRY ENGINE
// =========================================================================
const Oracle = {
    config: { verbosity: 1, logToConsole: true },
    state: {
        log_timestamp: null, log_type: "INITIAL_STATE", session_id: `sid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        scroll_progress: 0, scroll_direction: "NONE", scroll_velocity: 0, animation_phase: "IDLE",
        object_position: { x: 0, y: 0, z: 0 }, object_scale: { x: 1, y: 1, z: 1 }, object_rotation: { x: 0, y: 0, z: 0 },
        object_opacity: 1, object_visibility: "visible", frame_time_delta_ms: 0, estimated_fps: 0,
        javascript_heap_size: null, viewport_width: 0, viewport_height: 0, is_touch_device: false,
        error_message_text: null, error_stack_trace: null,
        last_network_request: { network_request_url: null, network_request_status_code: null, network_request_response_time: null },
        dom_element_bounding_rect: {}, threejs_renderer_info: {}, gpu_adapter_info: "Unavailable"
    },
    
    init: function(callback) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlVerbosity = urlParams.get('oracle_verbosity');
        if (urlVerbosity !== null) this.config.verbosity = parseInt(urlVerbosity, 10);

        this.state.is_touch_device = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        this.state.viewport_width = window.innerWidth;
        this.state.viewport_height = window.innerHeight;
        this.initPerformanceObserver();
        this.initGlobalErrorHandler();
        if (callback) callback();
    },

    initPerformanceObserver: function() { /* (Listeners for network resources) */ },
    
    initGlobalErrorHandler: function() {
        window.onerror = (message, source, lineno, colno, error) => {
            this.state.log_type = "ERROR";
            this.state.error_message_text = message;
            this.state.error_stack_trace = error ? error.stack : `${source} ${lineno}:${colno}`;
            
            // FIX #2: Renamed this from the non-existent 'logFullState' to the correct function 'updateAndLog'.
            // We pass null values because at the time of a global error, we likely don't have a cube or scroll trigger context.
            this.updateAndLog(null, null); 
            
            return false;
        };
    },
    
    updateAndLog: function(three_cube, scroll_trigger) {
        if (this.config.verbosity < 1) return;
        const s = this.state;
        s.log_timestamp = new Date().toISOString();
        s.log_type = "PERFORMANCE_STATE_UPDATE";
        if (scroll_trigger) {
            s.scroll_progress = scroll_trigger.progress.toFixed(4);
            s.scroll_direction = scroll_trigger.direction === 1 ? 'DOWN' : 'UP';
            s.scroll_velocity = scroll_trigger.getVelocity().toFixed(2);
        }
        if (three_cube && three_cube.userData.canvas) { // Check that cube and its properties exist
            s.object_position = { x: three_cube.position.x.toFixed(2), y: three_cube.position.y.toFixed(2), z: three_cube.position.z.toFixed(2) };
            s.object_scale = { x: three_cube.scale.x.toFixed(2), y: three_cube.scale.y.toFixed(2), z: three_cube.scale.z.toFixed(2) };
            s.object_rotation = { x: three_cube.rotation.x.toFixed(2), y: three_cube.rotation.y.toFixed(2), z: three_cube.rotation.z.toFixed(2) };
            s.dom_element_bounding_rect = three_cube.userData.canvas.getBoundingClientRect().toJSON();
        }
        if (performance.memory) s.javascript_heap_size = performance.memory;
        
        if(this.config.logToConsole) {
            console.groupCollapsed(`%c[ORACLE @ ${s.log_timestamp.split('T')[1].slice(0, -1)}] Phase: ${s.animation_phase}`, 'color: #8FBCBB;');
            console.log(JSON.stringify(this.state, null, 2));
            console.groupEnd();
        }
    },
    updateHUD: (id, value, color = '#E5E9F0') => {
        const el = document.getElementById(id);
        if (el) { el.textContent = value; if(color) el.style.color = color; }
    },
    report: (message) => console.log(`%c[SOVEREIGN REPORT]:`, 'color: #5E81AC; font-weight: bold;', message),
    warn: (message) => console.warn(`%c[SOVEREIGN WARNING]:`, 'color: #D08770;', message),
};

// =========================================================================
//         THREE.JS HYBRID MODULE
// =========================================================================
const threeJsModule = {
    scene: null, camera: null, renderer: null, cube: null, lastFrameTime: 0,
    setup: function(canvas) {
        // ... (The rest of the Three.js setup module remains the same as it was correct)
        this.scene = new THREE.Scene();
        const sizes = { width: canvas.offsetWidth, height: canvas.offsetHeight };
        this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
        this.camera.position.z = 3;
        this.scene.add(this.camera);

        this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        this.renderer.setSize(sizes.width, sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        try {
            const debugInfo = this.renderer.getContext().getExtension('WEBGL_debug_renderer_info');
            Oracle.state.gpu_adapter_info = this.renderer.getContext().getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        } catch(e) {}

        const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const material = new THREE.MeshStandardMaterial({ color: 0xECEFF4, metalness: 0.4, roughness: 0.5 });
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.userData.canvas = canvas;
        this.scene.add(this.cube);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0x88C0D0, 1.5);
        directionalLight.position.set(3, 3, 3);
        this.scene.add(directionalLight);

        window.addEventListener('resize', () => this.handleResize(canvas));
        this.animate();
        Oracle.report("Three.js Module Initialized.");
        return { cube: this.cube };
    },
    handleResize(canvas) {
        const sizes = { width: canvas.offsetWidth, height: canvas.offsetHeight };
        if (sizes.width > 0 && sizes.height > 0) {
          this.camera.aspect = sizes.width / sizes.height;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(sizes.width, sizes.height);
          this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
    },
    animate: function() {
        const currentTime = performance.now();
        if (this.lastFrameTime > 0) {
          Oracle.state.frame_time_delta_ms = (currentTime - this.lastFrameTime).toFixed(2);
          Oracle.state.estimated_fps = (1000 / (currentTime - this.lastFrameTime)).toFixed(0);
        }
        this.lastFrameTime = currentTime;
        if(this.renderer) Oracle.state.threejs_renderer_info = this.renderer.info;

        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.animate.bind(this));
    }
};

// =========================================================================
//         SOVEREIGN ARCHITECTURE & ANIMATION SETUP
// =========================================================================
let gsapCtx;
function setupSite() {
    Oracle.init(() => {
        // FIX #1: The check for the existence of `THREE` is removed from here. 
        // We will check for it right before we need it, which is more robust.
        if (gsap && ScrollTrigger && Flip && MorphSVGPlugin) {
            if (gsapCtx) {
                gsapCtx.revert(); // Clean up previous animations if resizing
            }
            gsapCtx = setupAnimations();
        } else {
            Oracle.warn("CRITICAL FAILURE: A required GSAP library failed to load.");
        }
    });
}

function setupAnimations() {
    const ctx = gsap.context(() => {
        const elements = {
            canvas: document.querySelector('#threejs-canvas'),
            finalLogoSvg: document.querySelector('#final-logo-svg'),
            morphPath: document.querySelector('#morph-path'),
            handoffPoint: document.querySelector('#handoff-point'),
            masterTrigger: document.querySelector('.scrolly-container'),
            visualsCol: document.querySelector('.pillar-visuals-col'),
            textPillars: gsap.utils.toArray('.pillar-text-content .text-anim-wrapper')
        };
        
        // FIX #1 (Continued): This is the new, more robust check.
        // We only proceed if both the canvas element exists AND the THREE library is loaded.
        if (!elements.canvas || typeof THREE === 'undefined') {
            const errorMessage = !elements.canvas ? 'Critical canvas element not found.' : 'THREE.js library not loaded.';
            Oracle.warn('ABORT: ' + errorMessage);
            Oracle.updateHUD('c-validation-status', 'FAILED', '#BF616A');
            return;
        }
        
        const { cube } = threeJsModule.setup(elements.canvas);
        
        Oracle.updateHUD('c-validation-status', 'PASSED', '#A3BE8C');

        // ... The rest of the animation logic remains the same ...
        ScrollTrigger.matchMedia({
            '(min-width: 1025px)': () => {
                const masterTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.masterTrigger,
                        start: 'top top',
                        end: 'bottom bottom-=' + elements.handoffPoint.offsetHeight,
                        scrub: 1.5,
                        onUpdate: self => {
                            Oracle.updateHUD('c-scroll', `${(self.progress * 100).toFixed(0)}%`);
                            Oracle.updateHUD('c-rot-y', (cube.rotation.y * (180 / Math.PI)).toFixed(1));
                            Oracle.updateAndLog(cube, self);
                        }
                    }
                });

                ScrollTrigger.create({
                    trigger: elements.masterTrigger,
                    start: 'top top',
                    endTrigger: elements.handoffPoint,
                    end: 'top bottom',
                    pin: elements.visualsCol,
                    pinSpacing: false
                });
                
                masterTl.to(cube.rotation, { y: Math.PI * 3, x: Math.PI * -1.5, ease: 'none' }, 0);
                masterTl.to(cube.scale, { x: 1.2, y: 1.2, z: 1.2, ease: 'power1.inOut', yoyo: true, repeat: 1 }, 0);

                elements.textPillars.forEach((pillar, index) => {
                    if (index > 0) { masterTl.from(pillar, { autoAlpha: 0, y: 50, duration: 0.2 }, index * 0.25); }
                    if (index < elements.textPillars.length - 1) { masterTl.to(pillar, { autoAlpha: 0, y: -50, duration: 0.2 }, (index * 0.25) + 0.2); }
                });

                setupHandoff(elements, cube);
            },
            '(max-width: 1024px)': () => {
                gsap.to(cube.rotation, { y: Math.PI * 2, repeat: -1, duration: 15, ease: 'none' });
            }
        });
    });
    return ctx;
}

function setupHandoff(elements, cube) {
    const logoPath = "M81.5,1.5 C37.2,1.5 1.5,37.2 1.5,81.5 C1.5,125.8 37.2,161.5 81.5,161.5 C125.8,161.5 161.5,125.8 161.5,81.5 C161.5,37.2 125.8,1.5 81.5,1.5 Z M81.5,116.5 C81.5,125.1 74.6,132 66,132 C57.4,132 50.5,125.1 50.5,116.5 L50.5,74 C50.5,65.4 57.4,58.5 66,58.5 C74.6,58.5 81.5,65.4 81.5,74 L81.5,116.5 Z M112.5,74 C112.5,65.4 105.6,58.5 97,58.5 C88.4,58.5 81.5,65.4 81.5,74 L81.5,89 C81.5,97.6 88.4,104.5 97,104.5 C105.6,104.5 112.5,97.6 112.5,89 L112.5,74 Z";
    
    ScrollTrigger.create({
        trigger: elements.handoffPoint,
        start: 'top center',
        onToggle: self => Oracle.updateHUD('c-handoff-st-active', self.isActive ? 'ACTIVE' : 'INACTIVE', self.isActive ? '#A3BE8C' : '#BF616A'),
        onEnter: () => {
            Oracle.state.animation_phase = 'HANDOFF_INITIATED';
            Oracle.updateHUD('c-handoff-state', 'ENGAGED', '#EBCB8B');
            
            gsap.set(elements.visualsCol, { zIndex: 20 });
            const state = Flip.getState(elements.canvas, {props: "transform,width,height"});
            elements.summaryPlaceholder.appendChild(elements.canvas);

            Flip.from(state, {
                duration: 1.2,
                ease: 'power2.inOut',
                onComplete: () => {
                    Oracle.state.animation_phase = 'HANDOFF_MORPH';
                    gsap.to(elements.canvas, {
                        autoAlpha: 0,
                        duration: 0.3,
                        // Move canvas back to its original home for proper resize/revert behavior
                        onComplete: () => { if(elements.canvas.parentNode) elements.visualsCol.appendChild(elements.canvas); }
                    });
                    gsap.to(elements.finalLogoSvg, { autoAlpha: 1, duration: 0.3 });
                    gsap.to(elements.morphPath, { duration: 0.8, morphSVG: logoPath, ease: 'power3.inOut' });
                }
            });
        },
        onLeaveBack: () => {
            Oracle.state.animation_phase = 'HANDOFF_REVERSED';
            Oracle.updateHUD('c-handoff-state', 'DISENGAGED', '#BF616A');
            // Reversal logic would be complex and is omitted for clarity,
            // but would involve reversing the Flip/Morph tweens.
        }
    });
}

// --- INITIALIZATION ---
window.addEventListener('load', setupSite);
// Resize handler to re-run animations safely
ScrollTrigger.addEventListener('resize', () => {
    // Debounce the resize event to avoid excessive re-calculations
    gsap.delayedCall(0.2, setupSite);
});
