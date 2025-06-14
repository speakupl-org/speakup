
/*
THE DEFINITIVE COVENANT BUILD v44.1 - "Sovereign" Hybrid Protocol (Corrected)
This version resolves initialization race conditions and fixes internal function calls.
*/

// =========================================================================
//         ORACLE v44.1 - GRANULAR TELEMETRY ENGINE (CORRECTED)
// =========================================================================
const Oracle = {
    config: { verbosity: 1, logToConsole: true }, // Comma is here
    state: {
        log_timestamp: null, log_type: "INITIAL_STATE", session_id: `sid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        scroll_progress: 0, scroll_direction: "NONE", scroll_velocity: 0, animation_phase: "IDLE",
        object_position: { x: 0, y: 0, z: 0 }, object_scale: { x: 1, y: 1, z: 1 }, object_rotation: { x: 0, y: 0, z: 0 },
        object_opacity: 1, object_visibility: "visible", frame_time_delta_ms: 0, estimated_fps: 0,
        javascript_heap_size: null, viewport_width: 0, viewport_height: 0, is_touch_device: false,
        error_message_text: null, error_stack_trace: null,
        last_network_request: { network_request_url: null, network_request_status_code: null, network_request_response_time: null },
        dom_element_bounding_rect: {}, threejs_renderer_info: {}, gpu_adapter_info: "Unavailable"
    }, // Comma is here
    
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
    }, // Comma is here

    initPerformanceObserver: function() { /* (Listeners for network resources) */ }, // Comma is here
    
    initGlobalErrorHandler: function() {
        window.onerror = (message, source, lineno, colno, error) => {
            this.state.log_type = "ERROR";
            this.state.error_message_text = message;
            this.state.error_stack_trace = error ? error.stack : `${source} ${lineno}:${colno}`;
            this.updateAndLog(null, null); 
            return false;
        };
    }, // Comma is here
    
    updateAndLog: function(three_cube, scroll_trigger) {
    // Stop if logging is turned off
    if (this.config.verbosity < 1) return;
    
    // --- Update State ---
    const s = this.state;
    s.log_timestamp = new Date().toISOString();
    
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
    
    // --- Log to Console ---
    if(this.config.logToConsole) {
        const logTitle = `%c[ORACLE @ ${s.log_timestamp.split('T')[1].slice(0, -1)}] Phase: ${s.animation_phase}`;
        const logStyle = 'color: #8FBCBB;';
        
        // =========================================================
        //  THE FIX IS HERE: Check verbosity to decide how to log.
        // =========================================================
        if (this.config.verbosity > 1) {
            // Verbosity 2 or higher: Log is EXPANDED by default.
            console.group(logTitle, logStyle);
        } else {
            // Verbosity 1: Log is COLLAPSED by default.
            console.groupCollapsed(logTitle, logStyle);
        }
        
        // This part stays the same
        console.log(JSON.stringify(this.state, null, 2));
        console.groupEnd();
    }
}, // <<<<<<<<<<<<< THIS WAS THE MISSING COMMA <<<<<<<<<<<<<

    updateHUD: (id, value, color = '#E5E9F0') => {
        const el = document.getElementById(id);
        if (el) { el.textContent = value; if(color) el.style.color = color; }
    }, // Comma is here

    report: (message) => console.log(`%c[SOVEREIGN REPORT]:`, 'color: #5E81AC; font-weight: bold;', message), // Comma is here

    warn: (message) => console.warn(`%c[SOVEREIGN WARNING]:`, 'color: #D08770;', message) // NO comma on the last item
}; // End of Oracle object


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

// ==========================================================
// PASTE THE ENTIRE runDiagnostics FUNCTION HERE
// ==========================================================
function runDiagnostics(elements) {
    console.group("%c[SOVEREIGN DIAGNOSTICS]", "color: #D08770; font-weight: bold;");

    if (!elements.masterTrigger) {
        console.error("CRITICAL FAILURE: '.scrolly-container' not found!");
    } else {
        console.log("✅ '.scrolly-container' found.", {
            height: elements.masterTrigger.offsetHeight + 'px'
        });
    }

    if (elements.textPillars.length === 0) {
        console.error("CRITICAL FAILURE: No '.pillar-text-content' elements found!");
    } else {
        console.log(`✅ Found ${elements.textPillars.length} text pillars.`);
    }

    // After a brief delay to ensure layout is calculated, re-check heights.
    setTimeout(() => {
        console.log("Height of .scrolly-container after 100ms delay:", elements.masterTrigger.offsetHeight + 'px');
        if (elements.masterTrigger.offsetHeight < window.innerHeight * 2) {
             console.warn("WARNING: The .scrolly-container is not tall enough to support a long scroll animation.");
        } else {
             console.log("Container height appears sufficient for scroll animation.");
        }
    }, 100);

    console.groupEnd();
}

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

// Keep runDiagnostics as it is, it's a good helper.

function setupAnimations() {
    // Aggressive cleanup from your original file - this is excellent practice.
    if (gsapCtx) gsapCtx.revert();
    ScrollTrigger.getAll().forEach(st => st.kill());
    
    const ctx = gsap.context(() => {
        const elements = {
            canvas: document.querySelector('#threejs-canvas'),
            summaryPlaceholder: document.querySelector('#summary-placeholder'),
            finalLogoSvg: document.querySelector('#final-logo-svg'),
            morphPath: document.querySelector('#morph-path'),
            handoffPoint: document.querySelector('#handoff-point'),
            masterTrigger: document.querySelector('.scrolly-container'),
            visualsCol: document.querySelector('.pillar-visuals-col'),
            textPillars: gsap.utils.toArray('.pillar-text-content'),
        };

        // runDiagnostics(elements); // Good for debugging, can be enabled if needed.
        
        if (!elements.canvas || typeof THREE === 'undefined') {
            Oracle.warn('ABORT: Critical element or library not found.');
            Oracle.updateHUD('c-validation-status', 'FAILED', '#BF616A');
            return;
        }
        
        const { cube } = threeJsModule.setup(elements.canvas);
        Oracle.updateHUD('c-validation-status', 'PASSED', '#A3BE8C');
        gsap.set(elements.finalLogoSvg, { autoAlpha: 0 }); // Initially hide the final SVG

        // =================================================================
        // SOVEREIGN MEDIA QUERY - ALL ANIMATIONS LIVE HERE
        // =================================================================
        ScrollTrigger.matchMedia({
            '(min-width: 1025px)': () => {
                Oracle.report("Desktop animation protocol engaged.");
                
                // === TIMELINE 1: The Master Scrollytelling Timeline ===
                const masterTl = gsap.timeline({
                scrollTrigger: {
                    trigger: elements.masterTrigger,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1.2,
                    onUpdate: self => {
                        // CONSOLIDATED STATE MANAGEMENT
                        if (self.progress > 0 && self.progress < 0.99) { // Give a little buffer at the end
                            Oracle.state.animation_phase = 'PILLARS_SCROLL';
                        } else if (self.progress >= 0.99) {
                            Oracle.state.animation_phase = 'HANDOFF_AWAIT';
                        } else { // self.progress is 0
                            Oracle.state.animation_phase = 'IDLE';
                        }
                        
                        // The rest of the HUD updates remain the same
                        Oracle.updateHUD('c-scroll', `${(self.progress * 100).toFixed(0)}%`);
                        Oracle.updateHUD('c-rot-y', (cube.rotation.y * (180 / Math.PI)).toFixed(1));
                        Oracle.updateAndLog(cube, self); // Log the consolidated state
                    }
                }
            });

                // Add cube animations to the master timeline
                masterTl
                    .to(cube.rotation, { y: Math.PI * 2.5, x: Math.PI * -1, ease: 'none' })
                    .to(cube.scale, { x: 1.2, y: 1.2, z: 1.2, ease: 'power1.inOut', yoyo: true, repeat: 1 }, 0);
                
                // === TIMELINE 2: The Synchronized Text Fade Timeline ===
                // This is the FIX for the text animation logic.
                elements.textPillars.forEach((pillar, i) => {
                    const textWrapper = pillar.querySelector('.text-anim-wrapper');
                    
                        if (textWrapper) { 
                // Reset styles for resize-safety
                gsap.set(textWrapper, { y: 0, autoAlpha: (i === 0) ? 1 : 0 }); // First is visible, others are not.
        
                // Fade Out (if it's not the first pillar)
                if (i > 0) {
                    masterTl.from(textWrapper, { 
                        autoAlpha: 0,
                        y: 40,
                        duration: 0.5,
                        ease: 'power2.out'
                    }, i * 0.8);
                }
                
                // Add a callback to update our HUD element
                masterTl.add(() => Oracle.updateHUD('c-active-pillar', `Pillar ${i + 1}`), i * 0.8);
        
                // Fade Out (if it's not the last pillar)
                            elements.textPillars.forEach((pillar, i) => {
                    const textWrapper = pillar.querySelector('.text-anim-wrapper');
                    
                    // Harden the logic: only animate if we found the wrapper element.
                    if (textWrapper) { 
                        // The position parameter in GSAP timelines is key.
                        // We will place all animations for one pillar within the same time window.
                        const animationStartTime = i; // Pillar 1 at 0s, Pillar 2 at 1s, etc.

                        // 1. FADE IN:
                        // Animate FROM a hidden/offset state TO the default state.
                        masterTl.from(textWrapper, {
                            autoAlpha: 0,
                            y: 40,
                            ease: 'power2.out',
                        }, animationStartTime); // Position the start of this animation

                        // 2. UPDATE HUD:
                        // Add a callback to say this pillar is now active.
                        masterTl.add(() => Oracle.updateHUD('c-active-pillar', `Pillar ${i + 1}`), animationStartTime);
                        
                        // 3. FADE OUT:
                        // If this ISN'T the last pillar, fade it out to make room for the next one.
                        if (i < elements.textPillars.length - 1) {
                           masterTl.to(textWrapper, {
                                autoAlpha: 0,
                                y: -40,
                                ease: 'power2.in'
                            }, animationStartTime + 0.75); // Start the fade-out 75% of the way through its "time"
                        }
                    } else {
                        // If we can't find a wrapper, log a warning but DON'T crash.
                        Oracle.warn(`Could not find a '.text-anim-wrapper' inside pillar number ${i + 1}. Skipping its animation.`);
                    }
                });
                            
    );           
    gsapCtx = ctx; 
    return ctx;
}


// This function now ONLY handles the handoff, making the code cleaner.
function setupHandoffAnimation(elements, cube) {
    const logoPath = "M81.5,1.5 C37.2,1.5 1.5,37.2 1.5,81.5 C1.5,125.8 37.2,161.5 81.5,161.5 C125.8,161.5 161.5,125.8 161.5,81.5 C161.5,37.2 125.8,1.5 81.5,1.5 Z M81.5,116.5 C81.5,125.1 74.6,132 66,132 C57.4,132 50.5,125.1 50.5,116.5 L50.5,74 C50.5,65.4 57.4,58.5 66,58.5 C74.6,58.5 81.5,65.4 81.5,74 L81.5,116.5 Z M112.5,74 C112.5,65.4 105.6,58.5 97,58.5 C88.4,58.5 81.5,65.4 81.5,74 L81.5,89 C81.5,97.6 88.4,104.5 97,104.5 C105.6,104.5 112.5,97.6 112.5,89 L112.5,74 Z";

    ScrollTrigger.create({
        trigger: elements.handoffPoint,
        start: 'top center',
        onEnter: () => {
            Oracle.state.animation_phase = 'HANDOFF_INITIATED';
            Oracle.updateHUD('c-handoff-state', 'ENGAGED', '#EBCB8B');
            
            gsap.set(elements.visualsCol, { zIndex: 20 }); 

            const state = Flip.getState(elements.canvas);
            elements.summaryPlaceholder.appendChild(elements.canvas);

            Flip.from(state, {
                duration: 1.2,
                ease: 'power3.inOut',
                onComplete: () => {
                    Oracle.state.animation_phase = 'HANDOFF_MORPH';
                    const tl = gsap.timeline();
                    tl.to(elements.canvas, { autoAlpha: 0, duration: 0.4 })
                      .to(elements.finalLogoSvg, { autoAlpha: 1, duration: 0.4 }, "<")
                      .fromTo(elements.morphPath, 
                          { morphSVG: "M81.5 81.5 L 81.5 81.5 L 81.5 81.5 L 81.5 81.5 Z" }, // Start as a single point
                          { duration: 1, morphSVG: logoPath, ease: 'expo.out' }
                      );
                }
            });
        },
        onLeaveBack: () => {
            // This logic can be complex. For now, a simple reversal is fine.
            Oracle.state.animation_phase = 'HANDOFF_REVERSED';
            Oracle.updateHUD('c-handoff-state', 'DISENGAGED', '#BF616A');
            
            elements.visualsCol.appendChild(elements.canvas); // Move canvas back immediately
            gsap.set(elements.canvas, { x: 0, y: 0 }); // Reset Flip's transforms
            gsap.to(elements.finalLogoSvg, { autoAlpha: 0, duration: 0.3 });
            gsap.to(elements.canvas, { autoAlpha: 1, duration: 0.3 });
        }
    });
}


// --- INITIALIZATION ---
// Your existing initialization logic is perfect.
window.addEventListener('load', setupSite);
ScrollTrigger.addEventListener('resize', () => {
    gsap.delayedCall(0.2, setupSite);
});
