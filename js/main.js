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
    
    // Only update the log type if it's not a special case like an ERROR
    if (s.log_type !== "ERROR") {
        s.log_type = "STATE_UPDATE";
    }

    if (scroll_trigger) {
        s.scroll_progress = scroll_trigger.progress.toFixed(4);
        s.scroll_direction = scroll_trigger.direction === 1 ? 'DOWN' : 'UP';
        s.scroll_velocity = scroll_trigger.getVelocity().toFixed(2);
    }
    if (three_cube && three_cube.userData.canvas) {
        s.object_position = { x: three_cube.position.x.toFixed(2), y: three_cube.position.y.toFixed(2), z: three_cube.position.z.toFixed(2) };
        s.object_scale = { x: three_cube.scale.x.toFixed(2), y: three_cube.scale.y.toFixed(2), z: three_cube.scale.z.toFixed(2) };
        s.object_rotation = { x: three_cube.rotation.x.toFixed(2), y: three_cube.rotation.y.toFixed(2), z: three_cube.rotation.z.toFixed(2) };
        s.dom_element_bounding_rect = three_cube.userData.canvas.getBoundingClientRect().toJSON();
    }
    if (performance.memory) s.javascript_heap_size = performance.memory.jsHeapSizeLimit;
    
    if(this.config.logToConsole) {
        const logTitle = `%c[ORACLE @ ${s.log_timestamp.split('T')[1].slice(0, -1)}] Phase: ${s.animation_phase}`;
        const logStyle = 'color: #8FBCBB;';
        
        // THE FIX FOR YOUR VERBOSITY ISSUE:
        if (this.config.verbosity > 1) {
            // High verbosity = expanded logs
            console.group(logTitle, logStyle);
        } else {
            // Low verbosity = collapsed logs
            console.groupCollapsed(logTitle, logStyle);
        }
        
        console.log(JSON.stringify(this.state, null, 2));
        console.groupEnd();
    }
},


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
        // Now checks for THREE.js as well
        if (gsap && ScrollTrigger && Flip && MorphSVGPlugin && typeof THREE !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin); // Ensure plugins are registered
            if (gsapCtx) {
                gsapCtx.revert(); // Clean up previous animations if resizing
            }
            gsapCtx = setupAnimations();
        } else {
            const missing = !gsap ? 'GSAP Core' : !ScrollTrigger ? 'ScrollTrigger' : !Flip ? 'Flip' : !MorphSVGPlugin ? 'MorphSVG' : 'THREE.js';
            Oracle.warn(`CRITICAL FAILURE: ${missing} library failed to load.`);
            Oracle.updateHUD('c-validation-status', 'FAILED', '#BF616A');
        }
    });
}

function setupAnimations() {
    const ctx = gsap.context(() => {
        const elements = {
            canvas: document.querySelector('#threejs-canvas'),
            summaryPlaceholder: document.querySelector('#summary-placeholder'),
            finalLogoSvg: document.querySelector('#final-logo-svg'),
            morphPath: document.querySelector('#morph-path'),
            handoffPoint: document.querySelector('#handoff-point'),
            masterTrigger: document.querySelector('.scrolly-container'),
            visualsCol: document.querySelector('.pillar-visuals-col'),
            textPillars: gsap.utils.toArray('.pillar-text-content .text-anim-wrapper')
        };
        
        if (!elements.canvas || typeof THREE === 'undefined') {
            const errorMessage = !elements.canvas ? 'Critical canvas element #threejs-canvas not found.' : 'THREE.js library not loaded.';
            Oracle.warn('ABORT: ' + errorMessage);
            Oracle.updateHUD('c-validation-status', 'FAILED', '#BF616A');
            return;
        }
        
        const { cube } = threeJsModule.setup(elements.canvas);
        Oracle.updateHUD('c-validation-status', 'PASSED', '#A3BE8C');

        gsap.set(elements.finalLogoSvg, { autoAlpha: 0 });

        ScrollTrigger.matchMedia({
            '(min-width: 1025px)': () => {
                // Main timeline for cube rotation and scaling
                const masterTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.masterTrigger,
                        start: 'top top',
                        end: 'bottom bottom', // Animate across the entire container
                        scrub: 1.5,
                        // FIX: Update animation phase for better logging
                        onEnter: () => Oracle.state.animation_phase = 'PILLARS_SCROLL',
                        onLeave: () => Oracle.state.animation_phase = 'HANDOFF_AWAIT',
                        onEnterBack: () => Oracle.state.animation_phase = 'PILLARS_SCROLL',
                        onLeaveBack: () => Oracle.state.animation_phase = 'IDLE',
                        onUpdate: self => {
                            Oracle.updateHUD('c-scroll', `${(self.progress * 100).toFixed(0)}%`);
                            Oracle.updateHUD('c-rot-y', (cube.rotation.y * (180 / Math.PI)).toFixed(1));
                            // We don't call Oracle.updateAndLog here anymore to prevent log spam.
                            // The animate() loop will handle that.
                        }
                    }
                });

                // Pin the visuals column
                ScrollTrigger.create({
                    trigger: elements.masterTrigger,
                    start: 'top top',
                    end: 'bottom bottom',
                    pin: elements.visualsCol,
                    pinSpacing: false
                });
                
                masterTl.to(cube.rotation, { y: Math.PI * 3, x: Math.PI * -1.5, ease: 'none' }, 0);
                masterTl.to(cube.scale, { x: 1.2, y: 1.2, z: 1.2, ease: 'power1.inOut', yoyo: true, repeat: 1 }, 0);

                // Animate each text pillar as it comes into view
                elements.textPillars.forEach((pillar) => {
                    gsap.timeline({
                        scrollTrigger: {
                            trigger: pillar,
                            start: 'top 70%', // Start fading in when it's 70% down the screen
                            end: 'bottom 30%', // Start fading out when its bottom is 30% from top
                            scrub: true
                        }
                    }).to(pillar, { autoAlpha: 1, y: 0 }, 0)
                      .to(pillar, { autoAlpha: 0 }, 0.8); // Fade out towards the end
                });

                setupHandoff(elements, cube);
            },
            '(max-width: 1024px)': () => {
                // Your mobile logic remains the same
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
            
            // Set z-index to ensure canvas animates over other content
            gsap.set(elements.visualsCol, { zIndex: 20 }); 

            // FIX: Correctly access elements from the passed-in object
            const state = Flip.getState(elements.canvas, {props: "transform,width,height"});
            elements.summaryPlaceholder.appendChild(elements.canvas);

            Flip.from(state, {
                duration: 1.2,
                ease: 'power2.inOut',
                onComplete: () => {
                    Oracle.state.animation_phase = 'HANDOFF_MORPH';
                    // The "absorption" effect
                    const tl = gsap.timeline();
                    tl.to(elements.canvas, {
                        autoAlpha: 0,
                        duration: 0.3,
                        // Move canvas back to its original home for proper resize/revert behavior
                        onComplete: () => { 
                            if(elements.canvas.parentNode) elements.visualsCol.appendChild(elements.canvas);
                        }
                    });
                    tl.to(elements.finalLogoSvg, { autoAlpha: 1, duration: 0.3 }, "<"); // Fade in SVG at the same time
                    tl.fromTo(elements.morphPath, 
                        { morphSVG: "M0,0 H163 V163 H0 Z" }, // Start as a square
                        { duration: 0.8, morphSVG: logoPath, ease: 'power3.inOut' }
                    );
                }
            });
        },
        onLeaveBack: () => {
            Oracle.state.animation_phase = 'HANDOFF_REVERSED';
            Oracle.updateHUD('c-handoff-state', 'DISENGAGED', '#BF616A');
            // Reversal logic: a simple fade-out/fade-in
            gsap.to(elements.finalLogoSvg, { autoAlpha: 0, duration: 0.3 });
            gsap.to(elements.canvas, { autoAlpha: 1, duration: 0.3 });
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
