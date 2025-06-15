
THE DEFINITIVE COVENANT BUILD v44.2 - "Sovereign" Hybrid Protocol (with Integrated Diagnostics)
This version resolves initialization race conditions and fixes internal function calls.
It now includes the Sovereign Diagnostic Suite v2.0 for holistic environment analysis.
*/

// =========================================================================
//         ORACLE v44.1 - GRANULAR TELEMETRY ENGINE (CORRECTED)
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
        this.initGlobalErrorHandler();
        if (callback) callback();
    },

    initGlobalErrorHandler: function() {
        window.onerror = (message, source, lineno, colno, error) => {
            this.state.log_type = "ERROR";
            this.state.error_message_text = message;
            this.state.error_stack_trace = error ? error.stack : `${source} ${lineno}:${colno}`;
            this.updateAndLog(null, null); 
            return false;
        };
    },
    
    updateAndLog: function(three_cube, scroll_trigger) {
        if (this.config.verbosity < 1) return;
        const s = this.state;
        s.log_timestamp = new Date().toISOString();
        if (s.log_type !== "ERROR") s.log_type = "STATE_UPDATE";
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
            if (this.config.verbosity > 1) {
                console.group(logTitle, logStyle);
            } else {
                console.groupCollapsed(logTitle, logStyle);
            }
            console.log(JSON.stringify(this.state, null, 2));
            console.groupEnd();
        }
    },

    updateHUD: (id, value, color = '#E5E9F0') => {
        const el = document.getElementById(id);
        if (el) { el.textContent = value; if(color) el.style.color = color; }
    },

    report: (message) => console.log(`%c[SOVEREIGN REPORT]:`, 'color: #5E81AC; font-weight: bold;', message),

    warn: (message) => console.warn(`%c[SOVEREIGN WARNING]:`, 'color: #D08770;', message)
};


// =========================================================================
//         THREE.JS HYBRID MODULE
// =========================================================================
const threeJsModule = {
    scene: null, camera: null, renderer: null, cube: null, lastFrameTime: 0,
    setup: function(canvas) {
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
// =========================================================================
//
//              SOVEREIGN DIAGNOSTIC SUITE v2.0
//
//   A comprehensive, multi-tool analysis engine for complex
//   scrollytelling and pinning animations. Run this before your
//   animation code to get a complete picture of the environment.
//
// =========================================================================
// =========================================================================

const runSovereignDiagnostics = (elements, options = {}) => {
    const defaults = {
        checkLayout: true,
        checkPinningContext: true,
        checkGSAP: true,
        checkPerformance: true
    };
    const settings = { ...defaults, ...options };

    console.group("%c[SOVEREIGN DIAGNOSTIC SUITE v2.0]", "background: #2E3440; color: #8FBCBB; font-size: 16px; padding: 4px 8px; border-radius: 4px; font-weight: bold;");
    Oracle.report("Beginning holistic environment analysis...");

    if (settings.checkLayout) _diagnoseLayoutAndStructure(elements);
    if (settings.checkPinningContext) _diagnosePinningContext(elements.visualsCol);
    if (settings.checkGSAP) _diagnoseGSAPIntegrity(elements);
    if (settings.checkPerformance) _enhanceOracleWithPerformanceObserver();
    
    Oracle.report("Diagnostic suite concluded. Review reports above.");
    console.groupEnd();
};

/** TOOL #1: THE CSS LAYOUT & STRUCTURE DOCTOR */
function _diagnoseLayoutAndStructure(elements) {
    console.groupCollapsed("%c[Inspector 1] Layout & Structure Analysis", "color: #5E81AC; font-weight: bold;");
    if (!elements.masterTrigger || !elements.visualsCol || !elements.textCol) {
        console.error("❌ CRITICAL FAILURE: One or more core layout elements (.scrolly-container, .pillar-visuals-col, .pillar-text-col) are MISSING. Analysis aborted.");
        console.groupEnd();
        return;
    }
    const report = (message, status, details = '') => {
        let icon = status === 'OK' ? '✅' : status === 'WARN' ? '⚠️' : '❌';
        console.log(`${icon} ${message}`, details);
    };
    const textColHeight = elements.textCol.scrollHeight;
    const viewportHeight = window.innerHeight;
    if (textColHeight > viewportHeight * 1.2) report(`Scroll container is sufficiently tall (Text Column: ${textColHeight}px vs Viewport: ${viewportHeight}px).`, 'OK');
    else report(`Container is NOT TALL ENOUGH to scroll effectively (Text Column: ${textColHeight}px vs Viewport: ${viewportHeight}px).`, 'FAIL', "FIX: Increase `min-height` of `.pillar-text-content` elements.");
    const containerStyle = window.getComputedStyle(elements.masterTrigger);
    if (containerStyle.display === 'flex') {
        report("Parent container uses 'display: flex'.", "OK");
        if (containerStyle.alignItems === 'flex-start') report("'align-items' is 'flex-start'. REQUIRED for `position: sticky`.", 'OK');
        else report(`'align-items' is '${containerStyle.alignItems}', NOT 'flex-start'. This will break pinning.`, 'FAIL');
    } else report(`Parent container layout is '${containerStyle.display}', not 'flex'.`, 'WARN');
    let overflowProblemFound = false;
    let currentElement = elements.visualsCol.parentElement;
    while (currentElement && currentElement.tagName !== 'BODY') {
        const style = window.getComputedStyle(currentElement);
        if (style.overflow !== 'visible' || style.overflowX !== 'visible' || style.overflowY !== 'visible') {
            report(`CONFLICT FOUND on ancestor: <${currentElement.tagName.toLowerCase()}>. It has a restrictive 'overflow'.`, "FAIL", currentElement);
            console.log("For 'position: sticky' to work, ALL ancestors must have 'overflow: visible'.");
            overflowProblemFound = true;
        }
        currentElement = currentElement.parentElement;
    }
    if (!overflowProblemFound) report("No conflicting 'overflow' properties found on ancestors.", 'OK');
    if (window.getComputedStyle(elements.visualsCol).boxSizing === 'border-box') report("Elements use 'box-sizing: border-box'.", 'OK');
    else report("An element is not using 'box-sizing: border-box', a high-risk practice.", 'WARN', "FIX: Set `*, *::before, *::after { box-sizing: border-box; }` globally.");
    console.groupEnd();
}

/** TOOL #2: THE PIN TRAP INSPECTOR */
function _diagnosePinningContext(elementToInspect) {
    console.groupCollapsed("%c[Inspector 2] GSAP Pinning Context Analysis", "color: #D08770; font-weight: bold;");
    if (!elementToInspect) {
        console.warn("⚠️ Pinning Context Inspector: No element provided. Skipping.");
        console.groupEnd();
        return;
    }
    console.log("Inspecting ancestors of:", elementToInspect);
    console.log("Searching for CSS properties that 'trap' a `position: fixed` element (`transform`, `perspective`, `filter`).");
    let trapFound = false;
    let currentElement = elementToInspect.parentElement;
    while (currentElement && currentElement.tagName !== 'BODY') {
        const style = window.getComputedStyle(currentElement);
        const props = { transform: style.transform, perspective: style.perspective, filter: style.filter, 'backdrop-filter': style.backdropFilter, contain: style.contain };
        for (const prop in props) {
            const value = props[prop];
            if (value && value !== 'none' && value !== 'normal') {
                trapFound = true;
                console.group(`❌ CRITICAL TRAP FOUND on ancestor: <${currentElement.tagName.toLowerCase()} class="${currentElement.className}">`);
                console.error(`This element has a CSS property that creates a new coordinate system, trapping the GSAP pin.`);
                console.log(`- Problem Element:`, currentElement);
                console.log(`- Problem Property: %c${prop}: ${value}`, 'font-weight: bold; color: #BF616A;');
                console.groupEnd();
            }
        }
        currentElement = currentElement.parentElement;
    }
    if (trapFound) console.log("%cCONCLUSION: Critical pinning conflict detected. The element(s) marked ❌ must have the conflicting properties removed.", 'color: #BF616A; font-weight: bold;');
    else console.log("%cCONCLUSION: Pinning context is clean. No trapping properties found.", 'color: #A3BE8C; font-weight: bold;');
    console.groupEnd();
}

/** TOOL #3: GSAP & SELECTOR INTEGRITY CHECK */
function _diagnoseGSAPIntegrity(elements) {
    console.groupCollapsed("%c[Inspector 3] GSAP & Selector Integrity", "color: #EBCB8B; font-weight: bold;");
    const report = (lib, status) => console.log(`${status ? '✅' : '❌'} ${lib}: ${status ? 'Detected' : 'MISSING!'}`);
    report("GSAP Core", typeof gsap !== 'undefined');
    report("ScrollTrigger", typeof ScrollTrigger !== 'undefined');
    report("Flip Plugin", typeof Flip !== 'undefined');
    report("MorphSVG Plugin", typeof MorphSVGPlugin !== 'undefined');
    report("THREE.js", typeof THREE !== 'undefined');
    console.log("\n--- Checking Element Selectors ---");
    let allSelectorsFound = true;
    for (const key in elements) {
        const element = elements[key];
        if (Array.isArray(element) ? element.length === 0 : element === null) {
            console.error(`❌ Selector Failed: The selector for '${key}' found no elements.`);
            allSelectorsFound = false;
        } else console.log(`✅ Selector OK: '${key}' found ${Array.isArray(element) ? element.length : 1} element(s).`);
    }
    if (allSelectorsFound) console.log("\n%cCONCLUSION: All libraries and selectors are valid.", 'color: #A3BE8C; font-weight: bold;');
    else console.log("\n%cCONCLUSION: One or more libraries or selectors FAILED. The animation cannot run.", 'color: #BF616A; font-weight: bold;');
    console.groupEnd();
}

/** TOOL #4: ADVANCED PERFORMANCE MONITORING */
function _enhanceOracleWithPerformanceObserver() {
    if (typeof PerformanceObserver === 'undefined' || Oracle.isPerformanceObserverActive) return;
    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.groupCollapsed(`%c[SOVEREIGN PERF] Long Task Detected: ${entry.duration.toFixed(2)}ms`, 'color: #D08770;');
                console.warn(`A task blocked the main thread, which can cause animation stutter.`);
                console.log('Details:', entry);
                console.groupEnd();
            }
        });
        observer.observe({ type: 'longtask', buffered: true });
        Oracle.isPerformanceObserverActive = true;
        console.log("✅ [Inspector 4] Advanced Performance Monitor (Long Task Observer) is active.");
    } catch (e) {
        console.error("⚠️ Failed to initialize the Long Task Performance Observer.", e);
    }
}


// =========================================================================
//         SOVEREIGN ARCHITECTURE & ANIMATION SETUP
// =========================================================================
let gsapCtx;
function setupSite() {
    Oracle.init(() => {
        if (gsap && ScrollTrigger && Flip && MorphSVGPlugin && typeof THREE !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger, Flip, MorphSVGPlugin);
            if (gsapCtx) gsapCtx.revert();
            gsapCtx = setupAnimations();
        } else {
            const missing = !gsap ? 'GSAP Core' : !ScrollTrigger ? 'ScrollTrigger' : !Flip ? 'Flip' : !MorphSVGPlugin ? 'MorphSVG' : 'THREE.js';
            Oracle.warn(`CRITICAL FAILURE: ${missing} library failed to load.`);
            Oracle.updateHUD('c-validation-status', 'FAILED', '#BF616A');
        }
    });
}

// =========================================================================
//         PINNING CONTEXT INSPECTOR v1.0
// This is our new, high-precision diagnostic tool.
// =========================================================================
function inspectPinningContext(elementToInspect) {
    if (!elementToInspect) {
        console.error("Pinning Inspector: No element provided to inspect.");
        return;
    }

    console.group("%c[SOVEREIGN PINNING CONTEXT INSPECTOR]", "color: #D08770; font-weight: bold; font-size: 14px;");
    console.log("Inspecting ancestors of:", elementToInspect);
    console.log("Searching for CSS properties that can 'trap' a pinned element (`transform`, `perspective`, `filter`, `backdrop-filter`).");
    
    let problemFound = false;
    let currentElement = elementToInspect.parentElement;

    while (currentElement && currentElement.tagName !== 'BODY') {
        const style = window.getComputedStyle(currentElement);
        // List of properties that create a new stacking/transform context
        const propertiesToCheck = {
            transform: style.getPropertyValue('transform'),
            perspective: style.getPropertyValue('perspective'),
            filter: style.getPropertyValue('filter'),
            'backdrop-filter': style.getPropertyValue('backdrop-filter'),
            // Also check for 'contain' which is a newer, powerful property that can cause this
            contain: style.getPropertyValue('contain'),
        };

        for (const prop in propertiesToCheck) {
            const value = propertiesToCheck[prop];
            // Check if the property is set to something other than its default/non-trapping value
            if (value && value !== 'none' && value !== 'normal') {
                problemFound = true;
                console.groupCollapsed(`❌ CONFLICT FOUND on ancestor: <${currentElement.tagName.toLowerCase()} class="${currentElement.className}">`);
                console.log("Element:", currentElement);
                console.error(`This element has a property that creates a new coordinate system, which will trap the GSAP pin.`);
                console.log(`- Problem Property: ${prop}: ${value}`);
                console.groupEnd();
            }
        }

        currentElement = currentElement.parentElement;
    }

    console.log("\n"); // Add a blank line for readability
    if (problemFound) {
        console.log("%cCONCLUSION: A critical pinning conflict was detected. The element(s) marked with ❌ are trapping the animation. The conflicting properties must be removed from those parent elements for pinning to work relative to the viewport.", 'color: #BF616A; font-weight: bold;');
    } else {
        console.log("%cCONCLUSION: No parent elements with conflicting properties were found. The pinning context is clean.", 'color: #A3BE8C; font-weight: bold;');
    }

    console.groupEnd();
}


// =========================================================================
//         ENHANCED SCROLLYTELLING DIAGNOSTICS
// =========================================================================
function runEnhancedDiagnostics(elements) {
    if (!elements.masterTrigger || !elements.visualsCol || !elements.textCol) {
        console.error("❌ Diagnostics Aborted: One or more critical elements for scrollytelling are missing.");
        return;
    }

    console.group("%c[SOVEREIGN LAYOUT ANALYSIS]", "color: #5E81AC; font-weight: bold; font-size: 14px;");
    
    const report = (message, status, details = '') => {
        let icon = status === 'OK' ? '✅' : '⚠️';
        console.log(`${icon} ${message}`, details);
    };

    const scrollHeight = elements.textCol.scrollHeight;
    const viewportHeight = window.innerHeight;
    if (scrollHeight > viewportHeight) {
        report(`Container is sufficiently scrollable (Text Column Height: ${scrollHeight}px vs Viewport: ${viewportHeight}px).`, "OK");
    } else {
        report(`Container may not be tall enough to scroll effectively (Text Column Height: ${scrollHeight}px vs Viewport: ${viewportHeight}px). Ensure text pillars have enough min-height.`, "WARN");
    }

    const textColStyle = window.getComputedStyle(elements.textCol);
    const paddingLeft = parseInt(textColStyle.paddingLeft, 10);
    if (paddingLeft > 10) {
        report(`Text column has horizontal padding (${paddingLeft}px). Good breathing room.`, "OK");
    } else {
        report(`Text column has little or no horizontal padding. Text may be too close to the visual element.`, "WARN");
    }
    
    console.groupEnd();
}


// =========================================================================
//         DEFINITIVE setupAnimations FUNCTION (with integrated diagnostics)
// =========================================================================
function setupAnimations() {
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
            textCol: document.querySelector('.pillar-text-col'),
            textPillars: gsap.utils.toArray('.pillar-text-content'),
        };

        // ===================================================================
        //            >>>>> RUNNING SOVEREIGN DIAGNOSTIC SUITE <<<<<
        // This command executes all built-in diagnostic tools and reports
        // its findings to the developer console. It analyzes CSS layout,
        // pin-trapping conditions, library loading, and selector validity
        // before any animation code runs.
        // ===================================================================
        runSovereignDiagnostics(elements);


        if (!elements.canvas || !elements.masterTrigger || elements.textPillars.length === 0) {
            Oracle.warn('ABORT: A critical animation element was not found in the DOM.');
            return;
        }

        const { cube } = threeJsModule.setup(elements.canvas);
        Oracle.updateHUD('c-validation-status', 'PASSED', '#A3BE8C');
        gsap.set(elements.finalLogoSvg, { autoAlpha: 0 });

        ScrollTrigger.matchMedia({
            '(min-width: 1025px)': () => {
                Oracle.report("Desktop animation protocol engaged.");

                const masterTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: elements.masterTrigger,
                        start: 'top top',
                        pin: elements.visualsCol,
                        scrub: 1.2,
                        endTrigger: elements.textCol,
                        end: 'bottom bottom',
                        invalidateOnRefresh: true,
                        onUpdate: self => {
                            if (self.progress > 0 && self.progress < 0.99) Oracle.state.animation_phase = 'PILLARS_SCROLL';
                            else if (self.progress >= 0.99) Oracle.state.animation_phase = 'HANDOFF_AWAIT';
                            else Oracle.state.animation_phase = 'IDLE';
                            Oracle.updateHUD('c-scroll', `${(self.progress * 100).toFixed(0)}%`);
                            Oracle.updateHUD('c-rot-y', (cube.rotation.y * (180 / Math.PI)).toFixed(1));
                            Oracle.updateHUD('c-scale', cube.scale.x.toFixed(2));
                            Oracle.updateAndLog(cube, self);
                        }
                    }
                });

                const animationDuration = elements.textPillars.length;
                masterTl
                    .to(cube.rotation, { y: Math.PI * 2.5, x: Math.PI * -1, ease: 'none', duration: animationDuration }, 0)
                    .to(cube.scale, { x: 1.2, y: 1.2, z: 1.2, ease: 'power1.in', duration: animationDuration / 2 }, 0)
                    .to(cube.scale, { x: 1, y: 1, z: 1, ease: 'power1.out', duration: animationDuration / 2 }, '>');

                elements.textPillars.forEach((pillar, i) => {
                    const textWrapper = pillar.querySelector('.text-anim-wrapper');
                    if (textWrapper) {
                        const animationStartTime = i;
                        masterTl.from(textWrapper, { autoAlpha: 0, y: 40, ease: 'power2.out' }, animationStartTime);
                        masterTl.add(() => Oracle.updateHUD('c-active-pillar', `Pillar ${i + 1}`), animationStartTime);
                        if (i < elements.textPillars.length - 1) {
                            masterTl.to(textWrapper, { autoAlpha: 0, y: -40, ease: 'power2.in' }, animationStartTime + 0.75);
                        }
                    }
                });
                
                setupHandoffAnimation(elements, cube);
            },
            '(max-width: 1024px)': () => {
                Oracle.report("Mobile layout active. Scrollytelling animations disabled.");
                // Ensure the cube exists before trying to access its properties
                if (cube) {
                    gsap.set([cube.rotation, cube.scale], { clearProps: true });
                }
            }
        });
    });
    gsapCtx = ctx;
    return ctx;
}


// This function now ONLY handles the handoff, making the code cleaner.
function setupHandoffAnimation(elements, cube) {
    const hudIds = {
        handoffState: 'c-swap-flag',
        handoffEvent: 'c-event'
    };

    const logoPath = "M81.5,1.5 C37.2,1.5 1.5,37.2 1.5,81.5 C1.5,125.8 37.2,161.5 81.5,161.5 C125.8,161.5 161.5,125.8 161.5,81.5 C161.5,37.2 125.8,1.5 81.5,1.5 Z M81.5,116.5 C81.5,125.1 74.6,132 66,132 C57.4,132 50.5,125.1 50.5,116.5 L50.5,74 C50.5,65.4 57.4,58.5 66,58.5 C74.6,58.5 81.5,65.4 81.5,74 L81.5,116.5 Z M112.5,74 C112.5,65.4 105.6,58.5 97,58.5 C88.4,58.5 81.5,65.4 81.5,74 L81.5,89 C81.5,97.6 88.4,104.5 97,104.5 C105.6,104.5 112.5,97.6 112.5,89 L112.5,74 Z";

    ScrollTrigger.create({
        trigger: elements.handoffPoint,
        start: 'top center',
        toggleActions: "play none none reverse",

        onEnter: () => {
            Oracle.state.animation_phase = 'HANDOFF_INITIATED';
            Oracle.updateHUD(hudIds.handoffState, 'ENGAGED', '#EBCB8B');
            Oracle.updateHUD(hudIds.handoffEvent, 'FLIP > MORPH');
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
                          { morphSVG: "M81.5 81.5 L 81.5 81.5 L 81.5 81.5 L 81.5 81.5 Z" }, 
                          { duration: 1, morphSVG: logoPath, ease: 'expo.out' }
                      );
                }
            });
        },
        onLeaveBack: () => {
            Oracle.state.animation_phase = 'HANDOFF_REVERSED';
            Oracle.updateHUD(hudIds.handoffState, 'DISENGAGED', '#BF616A');
            Oracle.updateHUD(hudIds.handoffEvent, 'REVERTING...');
            const tl = gsap.timeline({
                onComplete: () => {
                    elements.visualsCol.appendChild(elements.canvas);
                    gsap.set(elements.visualsCol, { clearProps: "zIndex" });
                    Oracle.updateHUD(hudIds.handoffEvent, 'AWAITING TRIGGER');
                }
            });
            tl.to(elements.finalLogoSvg, { autoAlpha: 0, duration: 0.3 })
              .to(elements.canvas, { autoAlpha: 1, duration: 0.3 }, 0);
        }
    });
}


// --- INITIALIZATION ---
window.addEventListener('load', setupSite);
ScrollTrigger.addEventListener('resize', () => {
    gsap.delayedCall(0.2, setupSite);
});
