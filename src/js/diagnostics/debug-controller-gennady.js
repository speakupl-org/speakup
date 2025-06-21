/**
 * GENNADY-STYLE DEBUG CONTROLLER
 * 
 * Principles:
 * - Silent by default
 * - Hierarchical logging with console.group
 * - Performance-obsessed
 * - Production-safe
 * - Actionable intelligence only
 */

class GennadyDebugController {
    constructor() {
        this.enabled = this.detectDebugMode();
        this.timers = new Map();
        this.modules = new Map();
        this.performanceData = new Map();
        
        // Only initialize if debug mode is enabled
        if (this.enabled) {
            this.init();
        }
    }
    
    detectDebugMode() {
        // Multiple ways to enable debug mode
        return (
            window.location.search.includes('debug=true') ||
            window.location.hostname === 'localhost' ||
            window.location.hostname.includes('127.0.0.1') ||
            localStorage.getItem('speakup-debug') === 'true'
        );
    }
    
    init() {
        console.groupCollapsed('APP.DEBUG: INITIALIZED');
        console.log('DEBUG.MODE: ACTIVE');
        console.log('DEBUG.COMMANDS: AVAILABLE');
        console.log('  debug.disable() - Deactivate debug mode');
        console.log('  debug.modules() - Display registered modules');
        console.log('  debug.perf() - Show performance data');
        console.groupEnd();
        
        // Make available globally for console access
        window.debug = this;
    }
    
    // === CORE LOGGING ===
    
    log(component, action, status, data = null) {
        if (!this.enabled) return;
        
        const timestamp = performance.now().toFixed(1);
        const message = `${component}.${action}: ${status}`;
        
        if (data) {
            console.log(`[${timestamp}ms] ${message}`, data);
        } else {
            console.log(`[${timestamp}ms] ${message}`);
        }
    }
    
    error(component, action, message, context = null) {
        // Errors always log, even in production (but structured)
        console.group(`ERR.${component}`);
        console.error(`${action} failed: ${message}`);
        if (context) {
            console.info('Context:', context);
        }
        console.groupEnd();
    }
    
    warn(component, message, data = null) {
        if (!this.enabled) return;
        
        console.warn(`WARN.${component}: ${message}`, data || '');
    }
    
    // === PERFORMANCE SYSTEM ===
    
    startTimer(operation) {
        if (!this.enabled) return;
        
        const startTime = performance.now();
        this.timers.set(operation, startTime);
    }
    
    endTimer(operation, context = null) {
        if (!this.enabled) return 0;
        
        const startTime = this.timers.get(operation);
        if (!startTime) {
            console.warn(`PERF.WARN: Timer '${operation}' not found`);
            return 0;
        }
        
        const duration = performance.now() - startTime;
        this.timers.delete(operation);
        
        // Store performance data
        this.performanceData.set(operation, { duration, context, timestamp: Date.now() });
        
        const contextStr = context ? ` ${JSON.stringify(context)}` : '';
        console.log(`PERF [${operation.toUpperCase()}] ${duration.toFixed(2)}ms${contextStr}`);
        
        return duration;
    }
    
    // === MODULE SYSTEM ===
    
    registerModule(name, status, version = '1.0.0') {
        if (!this.enabled) return;
        
        this.modules.set(name, { status, version, timestamp: Date.now() });
        this.log('MODULE', name, status, { version });
    }
    
    // === MEMORY TRACKING ===
    
    measureMemory(operation) {
        if (!this.enabled || !performance.memory) return { before: 0, after: 0, delta: 0 };
        
        const before = performance.memory.usedJSHeapSize;
        
        return {
            before,
            end: () => {
                const after = performance.memory.usedJSHeapSize;
                const delta = after - before;
                const deltaMB = (delta / 1024 / 1024).toFixed(2);
                
                console.log(`PERF [MEMORY.${operation.toUpperCase()}] ${deltaMB}MB`);
                
                return { before, after, delta };
            }
        };
    }
    
    // === SCENE DEBUGGING ===
    
    analyzeScene(scene3D) {
        if (!this.enabled || !scene3D) return;
        
        console.groupCollapsed('DEBUG.SCENE');
        
        try {
            // Renderer analysis with proper error handling
            if (scene3D.renderer) {
                console.group('RENDERER');
                
                try {
                    const clearColor = scene3D.renderer.getClearColor(new THREE.Color());
                    const alpha = scene3D.renderer.getClearAlpha();
                    console.log(`Clear: ${clearColor.getHexString()} (${alpha})`);
                } catch (e) {
                    console.error('getClearColor failed: Renderer state incomplete');
                    console.info('Solution: Ensure async setup3DScene() completes first');
                }
                
                console.log(`Color Space: ${scene3D.renderer.outputColorSpace}`);
                console.log(`Tone Mapping: ${scene3D.renderer.toneMapping}`);
                console.log(`Exposure: ${scene3D.renderer.toneMappingExposure}`);
                
                console.groupEnd();
            }
            
            // Scene analysis
            if (scene3D.scene) {
                console.group('SCENE');
                console.log(`Background: ${scene3D.scene.background ? 'Set' : 'None'}`);
                console.log(`Environment: ${scene3D.scene.environment ? 'Loaded' : 'None'}`);
                console.log(`Children: ${scene3D.scene.children.length}`);
                console.groupEnd();
            }
            
            // Cube analysis
            if (scene3D.cube) {
                console.group('CUBE');
                console.log(`Visible: ${scene3D.cube.visible}`);
                console.log(`Material: ${scene3D.cube.material.type}`);
                console.log(`Transmission: ${scene3D.cube.material.transmission}`);
                console.log(`Opacity: ${scene3D.cube.material.opacity}`);
                
                // Check for potential issues
                if (scene3D.cube.material.transmission > 0.5 && !scene3D.scene.environment) {
                    console.warn('High transmission material without environment map');
                }
                
                console.groupEnd();
            }
            
        } catch (error) {
            console.error('Scene analysis failed:', error.message);
        }
        
        console.groupEnd();
    }
    
    // === UTILITY METHODS ===
    
    disable() {
        this.enabled = false;
        localStorage.setItem('speakup-debug', 'false');
        console.log('Debug mode disabled. Reload page to take effect.');
    }
    
    enable() {
        this.enabled = true;
        localStorage.setItem('speakup-debug', 'true');
        console.log('Debug mode enabled. Reload page to take effect.');
    }
    
    modules() {
        if (!this.enabled) return;
        
        console.group('MODULE.STATUS');
        for (const [name, info] of this.modules) {
            console.log(`${name}: ${info.status} (v${info.version})`);
        }
        console.groupEnd();
    }
    
    perf() {
        if (!this.enabled) return;
        
        console.group('PERF.SUMMARY');
        
        const perfArray = Array.from(this.performanceData.entries()).map(([name, data]) => ({
            Operation: name,
            Duration: `${data.duration.toFixed(2)}ms`,
            Context: data.context || 'N/A'
        }));
        
        console.table(perfArray);
        console.groupEnd();
    }
    
    // === CANVAS DEBUGGING ===
    
    analyzeCanvas(canvas) {
        if (!this.enabled || !canvas) return;
        
        console.groupCollapsed('DEBUG.CANVAS');
        
        const rect = canvas.getBoundingClientRect();
        const computed = window.getComputedStyle(canvas);
        
        console.log(`Dimensions: ${canvas.width}×${canvas.height}`);
        console.log(`Display: ${rect.width}×${rect.height}`);
        console.log(`Pixel Ratio: ${window.devicePixelRatio}`);
        console.log(`Visibility: ${computed.visibility}`);
        console.log(`Opacity: ${computed.opacity}`);
        console.log(`Background: ${computed.background || 'none'}`);
        
        // Check for common issues
        if (computed.opacity === '0') {
            console.warn('Canvas is transparent (opacity: 0)');
        }
        
        if (computed.visibility === 'hidden') {
            console.warn('Canvas is hidden (visibility: hidden)');
        }
        
        console.groupEnd();
    }
}

// Initialize the global debug controller
const gennadyController = new GennadyDebugController();
window.debugController = gennadyController;
window.debug = gennadyController; // New standard name

// Legacy compatibility (will be removed in Phase 3)
if (gennadyController.enabled) {
    console.groupCollapsed('SYSTEM.COMPAT');
    console.log('LEGACY.COMPAT: INITIALIZED [Migration to Gennady system in progress]');
    console.groupEnd();
}
