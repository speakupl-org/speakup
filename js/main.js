/*

THE DEFINITIVE COVENANT BUILD v44.0 - "Sovereign" Hybrid Protocol (Three.js & GSAP)

This definitive version replaces the CSS 3D engine with a GPU-accelerated Three.js canvas,
enabling superior performance, lighting, and future scalability.

The Oracle diagnostic framework is now a comprehensive telemetry system, capturing deep,
real-time data on performance, state, and environmental variables, structured for clarity.

The Handoff Protocol now uses GSAP Flip to physically move the Three.js canvas, creating
a seamless transition from interactive element to summary thumbnail.

*/

// =========================================================================
//         ORACLE v44.0 - GRANULAR TELEMETRY ENGINE
// =========================================================================
const Oracle = {
    config: { verbosity: 1 },
    state: {
        log_timestamp: new Date().toISOString(),
        log_type: "INITIAL_STATE",
        session_id: `sid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        scroll_progress: 0,
        scroll_direction: "NONE",
        scroll_velocity: 0,
        animation_phase: "IDLE",
        object_position: { x: 0, y: 0, z: 0 },
        object_scale: { x: 1, y: 1, z: 1 },
        object_rotation: { x: 0, y: 0, z: 0 },
        object_opacity: 1,
        object_visibility: "visible",
        frame_time_delta_ms: 0,
        estimated_fps: 0,
        javascript_heap_size: { usedJSHeapSize: 0, totalJSHeapSize: 0, jsHeapSizeLimit: 0 },
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        is_touch_device: false,
        error_message_text: null,
        error_stack_trace: null,
        last_network_request: { network_request_url: null, network_request_status_code: null, network_request_response_time: null },
        dom_element_bounding_rect: {},
        active_event_listeners_count: "Not directly queryable",
        last_promise: { name: null, promise_status: null },
        asset_load_time: {},
        threejs_renderer_info: {},
        gpu_adapter_info: "Unavailable"
    },
    
    init: function(callback) {
        // ... (init function remains the same)
        this.state.is_touch_device = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        this.initPerformanceObserver();
        this.initGlobalErrorHandler();
        if (callback) callback();
    },

    initPerformanceObserver: function() {
        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'resource') {
                        this.state.last_network_request = {
                            network_request_url: entry.name,
                            network_request_status_code: entry.responseStatus || 200,
                            network_request_response_time: entry.duration.toFixed(0)
                        };
                        this.state.asset_load_time[entry.name.split('/').pop()] = entry.duration.toFixed(0);
                    }
                }
            });
            observer.observe({ entryTypes: ['resource'] });
        } catch (e) {
            console.warn("Oracle: PerformanceObserver not supported.");
        }
    },

    initGlobalErrorHandler: function() {
        window.onerror = (message, source, lineno, colno, error) => {
            this.state.log_type = "ERROR";
            this.state.error_message_text = message;
            this.state.error_stack_trace = error ? error.stack : `${source} ${lineno}:${colno}`;
            this.logFullState(); // Log the state immediately on error
            return false;
        };
    },
    
    updateAndLog: function(three_cube, scroll_trigger) {
        if (this.config.verbosity < 1) return;
        
        // Update state from various sources
        this.state.log_timestamp = new Date().toISOString();
        this.state.log_type = "PERFORMANCE_STATE_UPDATE";
        
        if (scroll_trigger) {
            this.state.scroll_progress = scroll_trigger.progress;
            this.state.scroll_direction = scroll_trigger.direction === 1 ? 'DOWN' : 'UP';
            this.state.scroll_velocity = scroll_trigger.getVelocity();
        }
        
        if (three_cube) {
            this.state.object_position = { x: three_cube.position.x, y: three_cube.position.y, z: three_cube.position.z };
            this.state.object_scale = { x: three_cube.scale.x, y: three_cube.scale.y, z: three_cube.scale.z };
            this.state.object_rotation = { x: three_cube.rotation.x, y: three_cube.rotation.y, z: three_cube.rotation.z };
            this.state.object_opacity = three_cube.material.opacity;
            this.state.object_visibility = three_cube.visible ? 'visible' : 'hidden';
            this.state.dom_element_bounding_rect = three_cube.userData.canvas.getBoundingClientRect().toJSON();
        }
        
        if(performance.memory) {
            this.state.javascript_heap_size = performance.memory;
        }

        console.groupCollapsed(`%c[ORACLE TELEMETRY @ ${new Date().toLocaleTimeString()}] Phase: ${this.state.animation_phase}`, 'color: #8FBCBB; font-weight: bold;');
        console.log(JSON.stringify(this.state, null, 2));
        console.groupEnd();
    },

    // (Other helper functions like report, warn, updateHUD can remain)
};

// =========================================================================
//         THREE.JS HYBRID MODULE
// =========================================================================
const threeJsModule = {
    scene: null, camera: null, renderer: null, cube: null,
    lastFrameTime: performance.now(),

    setup: function(canvas) {
        // 1. Scene
        this.scene = new THREE.Scene();

        // 2. Camera
        const sizes = { width: canvas.offsetWidth, height: canvas.offsetHeight };
        this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
        this.camera.position.z = 3;
        this.scene.add(this.camera);

        // 3. Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        this.renderer.setSize(sizes.width, sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Get GPU Info for Oracle
        const gl = this.renderer.getContext();
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        Oracle.state.gpu_adapter_info = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "N/A";

        // 4. Object
        const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const material = new THREE.MeshStandardMaterial({ color: 0xE5E9F0, metalness: 0.3, roughness: 0.6 });
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.userData.canvas = canvas; // Link canvas for Oracle logging
        this.scene.add(this.cube);

        // 5. Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0x88C0D0, 1);
        directionalLight.position.set(2, 2, 2);
        this.scene.add(directionalLight);

        // 6. Resize handler
        window.addEventListener('resize', () => {
            sizes.width = canvas.offsetWidth;
            sizes.height = canvas.offsetHeight;
            this.camera.aspect = sizes.width / sizes.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(sizes.width, sizes.height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        this.animate();
        Oracle.report("Three.js Hybrid Module Initialized.");
        return { cube: this.cube };
    },

    animate: function() {
        const currentTime = performance.now();
        Oracle.state.frame_time_delta_ms = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        Oracle.state.estimated_fps = 1000 / Oracle.state.frame_time_delta_ms;
        
        // Update Renderer Info
        Oracle.state.threejs_renderer_info = this.renderer.info;

        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.animate.bind(this));
    }
};

// =========================================================================
//         SOVEREIGN ARCHITECTURE v44.0: UNIFIED NARRATIVE
// =========================================================================
function setupAnimations() {
    gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin);
    
    const ctx = gsap.context(() => {
        const elements = {
            canvas: document.querySelector('#threejs-canvas'),
            finalLogoSvg: document.querySelector('#final-logo-svg'),
            morphPath: document.querySelector('#morph-path'),
            handoffPoint: document.querySelector('#handoff-point'),
            masterTrigger: document.querySelector('.scrolly-container'),
            visualsCol: document.querySelector('.pillar-visuals-col')
            // Add other DOM elements if needed
        };
        
        if (!elements.canvas || !elements.handoffPoint || !elements.masterTrigger) {
            Oracle.warn('SOVEREIGN ABORT: Missing critical canvas/trigger elements.');
            return;
        }

        // --- Initialize Three.js Scene ---
        const { cube } = threeJsModule.setup(elements.canvas);

        ScrollTrigger.matchMedia({
            '(min-width: 1025px)': () => {
                const masterStoryTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.masterTrigger,
                        start: 'top top',
                        end: 'bottom bottom-=' + elements.handoffPoint.offsetHeight,
                        scrub: 1.5,
                        onUpdate: (self) => {
                            // Update HUD and run full log
                            Oracle.updateHUD('c-scroll', `${(self.progress * 100).toFixed(0)}%`);
                            Oracle.updateHUD('c-rot-y', (cube.rotation.y * (180/Math.PI)).toFixed(1));
                            Oracle.updateAndLog(cube, self);
                        }
                    }
                });
                
                // --- Master Pin ---
                ScrollTrigger.create({
                    trigger: elements.masterTrigger,
                    start: 'top top',
                    endTrigger: elements.handoffPoint,
                    end: "top bottom",
                    pin: elements.visualsCol,
                    pinSpacing: false,
                });

                // --- Animate the Three.js Cube ---
                masterStoryTl
                    .to(cube.rotation, { y: Math.PI * 2, x: Math.PI * 0.5, ease: "power1.inOut" })
                    .to(cube.scale, { x: 1.2, y: 1.2, z: 1.2, ease: "power1.inOut" }, "<")
                    .to(cube.rotation, { y: Math.PI * -2, x: Math.PI * -0.5, ease: "power1.inOut" })
                    .to(cube.scale, { x: 1, y: 1, z: 1, ease: "power1.inOut" }, "<");
                
                // --- Handoff Protocol ---
                setupHandoff(elements, cube);

            },
            '(max-width: 1024px)': () => {
                // On mobile, maybe just a simple rotation animation
                gsap.to(cube.rotation, { y: Math.PI * 2, repeat: -1, duration: 20, ease: 'none' });
            }
        });
    });

    return ctx;
}

function setupHandoff(elements, cube) {
    const speakUpLogoPath = "M81.5,1.5 C37.2,1.5 1.5,37.2 1.5,81.5 C1.5,125.8 37.2,161.5 81.5,161.5 C125.8,161.5 161.5,125.8 161.5,81.5 C161.5,37.2 125.8,1.5 81.5,1.5 Z M81.5,116.5 C81.5,125.1 74.6,132 66,132 C57.4,132 50.5,125.1 50.5,116.5 L50.5,74 C50.5,65.4 57.4,58.5 66,58.5 C74.6,58.5 81.5,65.4 81.5,74 L81.5,116.5 Z M112.5,74 C112.5,65.4 105.6,58.5 97,58.5 C88.4,58.5 81.5,65.4 81.5,74 L81.5,89 C81.5,97.6 88.4,104.5 97,104.5 C105.6,104.5 112.5,97.6 112.5,89 L112.5,74 Z";
    
    ScrollTrigger.create({
        trigger: elements.handoffPoint,
        start: "top center",

        onEnter: () => {
            Oracle.state.animation_phase = "HANDOFF_INITIATED";
            // 1. Get state of the canvas
            const state = Flip.getState(elements.canvas);

            // 2. Move canvas into the placeholder in the DOM
            elements.finalLogoSvg.parentNode.appendChild(elements.canvas);

            // 3. Flip it!
            Flip.from(state, {
                duration: 1.2,
                ease: "power2.inOut",
                onComplete: () => {
                    Oracle.state.animation_phase = "HANDOFF_COMPLETE";
                    gsap.to(elements.canvas, { 
                        autoAlpha: 0, 
                        onComplete: () => { 
                           if (elements.canvas.parentNode) {
                             elements.canvas.parentNode.removeChild(elements.canvas); // Clean up
                           }
                        } 
                    });
                    gsap.set(elements.finalLogoSvg, { autoAlpha: 1 });
                    gsap.to(elements.morphPath, {
                        duration: 0.8,
                        morphSVG: speakUpLogoPath,
                        ease: "power3.inOut"
                    });
                }
            });
        },
        onLeaveBack: () => {
            // This would require a more complex stateful reversal.
            // For now, we keep it as a one-way transition.
            Oracle.report("Handoff reversal not implemented for this version.");
        },
    });
}

// =========================================================================
//         INITIALIZATION SEQUENCE (Unchanged)
// =========================================================================
let gsapCtx; 

function setupSiteLogic() {
    // ... same as before
}

function initialAnimationSetup() {
    Oracle.init(() => {
        if (gsap && ScrollTrigger && Flip && MorphSVGPlugin && THREE) {
            if (gsapCtx) {
                gsapCtx.revert();
            }
            gsapCtx = setupAnimations();
        } else {
            Oracle.warn("CRITICAL FAILURE: A required library (GSAP, THREE.JS) failed to load.");
        }
    });
}

document.addEventListener("DOMContentLoaded", setupSiteLogic);
window.addEventListener("load", initialAnimationSetup);
// Note: Resize is now handled inside GSAP context and Three.js module for better robustness
