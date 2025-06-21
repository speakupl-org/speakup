// /js/diagnostics/debug-controller.js - Professional Debug System

/**
 * Advanced Debug Controller for Speak Up Application
 * Provides comprehensive debugging, monitoring, and diagnostics
 */
class DebugController {
    constructor() {
        this.isEnabled = this.checkDebugMode();
        this.logs = [];
        this.performance = {};
        this.errors = [];
        this.warnings = [];
        this.modules = new Map();
        this.timers = new Map();
        
        // TACTICAL FIX 1: Add reusable Color objects to avoid crashes
        this.targetClearColor = null; // Will be initialized when THREE is available
        this.tempColor = null;
        
        // STRATEGIC FIX: Remove dependency on global variables
        this.sceneRef = null;
        this.rendererRef = null;
        this.canvasRef = null;
        
        if (this.isEnabled) {
            this.initializeDebugInterface();
            this.setupGlobalErrorHandling();
            this.monitorPerformance();
            console.log('🔧 Debug Controller initialized - Professional diagnostics active');
            
            // Initialize THREE.js objects when available
            this.initThreeObjects();
        }
    }

    checkDebugMode() {
        // Multiple ways to enable debug mode
        return (
            window.location.search.includes('debug=true') ||
            window.location.search.includes('dev=true') ||
            localStorage.getItem('speakup_debug') === 'true' ||
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.port === '3000' ||
            window.location.port === '5173' // Vite dev server
        );
    }

    initializeDebugInterface() {
        // Create debug panel
        this.createDebugPanel();
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+D to toggle debug panel
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                this.toggleDebugPanel();
            }
            // Ctrl+Shift+L to export logs
            if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                this.exportLogs();
            }
            // Ctrl+Shift+R to generate report
            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
                this.generateReport();
            }
        });
    }

    createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.innerHTML = `
            <div class="debug-header">
                <h3>🔧 Debug Console</h3>
                <div class="debug-controls">
                    <button onclick="debugController.clearLogs()">Clear</button>
                    <button onclick="debugController.exportLogs()">Export</button>
                    <button onclick="debugController.generateReport()">Report</button>
                    <button onclick="debugController.toggleDebugPanel()">×</button>
                </div>
            </div>
            <div class="debug-tabs">
                <button class="tab-btn active" data-tab="logs">Logs</button>
                <button class="tab-btn" data-tab="performance">Performance</button>
                <button class="tab-btn" data-tab="errors">Errors</button>
                <button class="tab-btn" data-tab="modules">Modules</button>
                <button class="tab-btn" data-tab="scene">3D Scene</button>
            </div>
            <div class="debug-content">
                <div class="tab-content active" id="tab-logs">
                    <div class="log-container"></div>
                </div>
                <div class="tab-content" id="tab-performance">
                    <div class="performance-metrics"></div>
                </div>
                <div class="tab-content" id="tab-errors">
                    <div class="error-list"></div>
                </div>
                <div class="tab-content" id="tab-modules">
                    <div class="module-status"></div>
                </div>
                <div class="tab-content" id="tab-scene">
                    <div class="scene-inspector"></div>
                </div>
            </div>
        `;
        
        // Add styles
        const styles = `
            <style>
                #debug-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 400px;
                    height: 500px;
                    background: rgba(0, 0, 0, 0.95);
                    color: #00ff00;
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    border: 1px solid #333;
                    border-radius: 8px;
                    z-index: 10000;
                    overflow: hidden;
                    display: none;
                }
                .debug-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    background: #1a1a1a;
                    border-bottom: 1px solid #333;
                }
                .debug-header h3 {
                    margin: 0;
                    color: #00ff00;
                }
                .debug-controls button {
                    background: #333;
                    color: #00ff00;
                    border: 1px solid #555;
                    padding: 4px 8px;
                    margin-left: 5px;
                    cursor: pointer;
                    border-radius: 3px;
                }
                .debug-controls button:hover {
                    background: #555;
                }
                .debug-tabs {
                    display: flex;
                    background: #1a1a1a;
                    border-bottom: 1px solid #333;
                }
                .tab-btn {
                    flex: 1;
                    background: #333;
                    color: #ccc;
                    border: none;
                    padding: 8px;
                    cursor: pointer;
                    border-right: 1px solid #555;
                }
                .tab-btn.active {
                    background: #555;
                    color: #00ff00;
                }
                .debug-content {
                    height: calc(100% - 80px);
                    overflow-y: auto;
                }
                .tab-content {
                    display: none;
                    padding: 10px;
                    height: 100%;
                }
                .tab-content.active {
                    display: block;
                }
                .log-entry {
                    margin: 2px 0;
                    padding: 2px 5px;
                    border-left: 3px solid;
                }
                .log-info { border-color: #00ff00; }
                .log-warn { border-color: #ffff00; color: #ffff00; }
                .log-error { border-color: #ff0000; color: #ff0000; }
                .log-debug { border-color: #00ffff; color: #00ffff; }
                .metric {
                    display: flex;
                    justify-content: space-between;
                    padding: 5px 0;
                    border-bottom: 1px solid #333;
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
        document.body.appendChild(panel);
        
        // Setup tab switching
        panel.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });
        
        // Make panel draggable
        this.makeDraggable(panel);
    }

    makeDraggable(element) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        const header = element.querySelector('.debug-header');
        
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            initialX = e.clientX - element.offsetLeft;
            initialY = e.clientY - element.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                element.style.left = currentX + 'px';
                element.style.top = currentY + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    toggleDebugPanel() {
        const panel = document.getElementById('debug-panel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    }

    switchTab(tabName) {
        // Update buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`tab-${tabName}`).classList.add('active');
        
        // Update content based on tab
        this.updateTabContent(tabName);
    }

    updateTabContent(tabName) {
        switch (tabName) {
            case 'logs':
                this.updateLogsTab();
                break;
            case 'performance':
                this.updatePerformanceTab();
                break;
            case 'errors':
                this.updateErrorsTab();
                break;
            case 'modules':
                this.updateModulesTab();
                break;
            case 'scene':
                this.updateSceneTab();
                break;
        }
    }

    // Logging methods
    log(message, level = 'info', module = 'general') {
        if (!this.isEnabled) return;
        
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            module,
            message: typeof message === 'object' ? JSON.stringify(message, null, 2) : message
        };
        
        this.logs.push(logEntry);
        
        // Also log to console with styling
        const styles = {
            info: 'color: #00ff00',
            warn: 'color: #ffff00',
            error: 'color: #ff0000',
            debug: 'color: #00ffff'
        };
        
        console.log(`%c[${module.toUpperCase()}] ${message}`, styles[level] || styles.info);
        
        // Update UI if visible
        this.updateLogsTab();
    }

    info(message, module) {
        this.log(message, 'info', module);
    }

    warn(message, module) {
        this.log(message, 'warn', module);
        this.warnings.push({ message, module, timestamp: new Date().toISOString() });
    }

    error(message, module, error) {
        this.log(message, 'error', module);
        this.errors.push({ 
            message, 
            module, 
            error: error?.stack || error, 
            timestamp: new Date().toISOString() 
        });
    }

    debug(message, module) {
        this.log(message, 'debug', module);
    }

    // Performance monitoring
    startTimer(name) {
        this.timers.set(name, performance.now());
    }

    endTimer(name) {
        const startTime = this.timers.get(name);
        if (startTime) {
            const duration = performance.now() - startTime;
            this.performance[name] = duration;
            this.log(`Timer "${name}": ${duration.toFixed(2)}ms`, 'info', 'performance');
            this.timers.delete(name);
            return duration;
        }
    }

    // Module registration
    registerModule(name, status, version, dependencies = []) {
        this.modules.set(name, {
            status,
            version,
            dependencies,
            loadTime: performance.now(),
            errors: [],
            warnings: []
        });
        this.log(`Module "${name}" registered (${status})`, 'info', 'modules');
    }

    updateModuleStatus(name, status, error = null) {
        const module = this.modules.get(name);
        if (module) {
            module.status = status;
            if (error) {
                module.errors.push(error);
            }
            this.log(`Module "${name}" status updated: ${status}`, 'info', 'modules');
        }
    }

    // Scene debugging (TACTICAL FIX 2: Fixed getClearColor usage)
    inspectScene(scene3D) {
        if (!scene3D || !scene3D.renderer) {
            this.warn('Scene or renderer not available for inspection', 'debug');
            return null;
        }
        
        let rendererInfo = {};
        
        try {
            // TACTICAL FIX 2: Use getClearColor correctly with target object
            if (this.targetClearColor) {
                scene3D.renderer.getClearColor(this.targetClearColor);
                rendererInfo = {
                    clearColor: `#${this.targetClearColor.getHexString()}`,
                    clearAlpha: scene3D.renderer.getClearAlpha(),
                    toneMapping: scene3D.renderer.toneMapping,
                    toneMappingExposure: scene3D.renderer.toneMappingExposure
                };
            } else {
                rendererInfo = { error: 'Color objects not initialized' };
            }
        } catch (error) {
            rendererInfo = { error: `Failed to read renderer properties: ${error.message}` };
        }
        
        const inspection = {
            cube: {
                visible: scene3D.cube?.visible,
                rotation: scene3D.cube?.rotation,
                position: scene3D.cube?.position,
                scale: scene3D.cube?.scale,
                material: {
                    type: scene3D.cube?.material?.type,
                    transmission: scene3D.cube?.material?.transmission,
                    roughness: scene3D.cube?.material?.roughness,
                    metalness: scene3D.cube?.material?.metalness
                }
            },
            lights: {
                pillar1: {
                    intensity: scene3D.lights?.pillar1?.intensity,
                    color: scene3D.lights?.pillar1?.color
                },
                pillar2: {
                    intensity: scene3D.lights?.pillar2?.intensity,
                    color: scene3D.lights?.pillar2?.color
                },
                pillar3: {
                    intensity: scene3D.lights?.pillar3?.intensity,
                    color: scene3D.lights?.pillar3?.color
                }
            },
            renderer: rendererInfo,
            environment: {
                hasEnvironment: !!scene3D.scene?.environment,
                background: scene3D.scene?.background
            }
        };
        
        this.log('Scene inspection completed safely', 'debug', 'scene');
        return inspection;
    }

    // UI Update methods
    updateLogsTab() {
        const container = document.querySelector('.log-container');
        if (!container) return;
        
        container.innerHTML = this.logs.slice(-100).map(log => 
            `<div class="log-entry log-${log.level}">
                <span class="log-time">${log.timestamp.split('T')[1].split('.')[0]}</span>
                <span class="log-module">[${log.module}]</span>
                <span class="log-message">${log.message}</span>
            </div>`
        ).join('');
        
        container.scrollTop = container.scrollHeight;
    }

    updatePerformanceTab() {
        const container = document.querySelector('.performance-metrics');
        if (!container) return;
        
        const metrics = [
            { name: 'Memory Used', value: `${(performance.memory?.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB` },
            { name: 'Memory Total', value: `${(performance.memory?.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB` },
            { name: 'FPS', value: this.getCurrentFPS() },
            ...Object.entries(this.performance).map(([name, value]) => ({
                name,
                value: `${value.toFixed(2)}ms`
            }))
        ];
        
        container.innerHTML = metrics.map(metric =>
            `<div class="metric">
                <span>${metric.name}</span>
                <span>${metric.value}</span>
            </div>`
        ).join('');
    }

    updateErrorsTab() {
        const container = document.querySelector('.error-list');
        if (!container) return;
        
        const allIssues = [
            ...this.errors.map(e => ({ ...e, type: 'error' })),
            ...this.warnings.map(w => ({ ...w, type: 'warning' }))
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        container.innerHTML = allIssues.map(issue =>
            `<div class="log-entry log-${issue.type}">
                <div>${issue.timestamp.split('T')[1].split('.')[0]} [${issue.module}]</div>
                <div>${issue.message}</div>
                ${issue.error ? `<div style="font-size: 10px; opacity: 0.7;">${issue.error}</div>` : ''}
            </div>`
        ).join('');
    }

    updateModulesTab() {
        const container = document.querySelector('.module-status');
        if (!container) return;
        
        const moduleList = Array.from(this.modules.entries()).map(([name, info]) =>
            `<div class="metric">
                <span>${name}</span>
                <span style="color: ${info.status === 'loaded' ? '#00ff00' : '#ff0000'}">${info.status}</span>
            </div>
            <div style="font-size: 10px; opacity: 0.7; margin-bottom: 10px;">
                Version: ${info.version || 'unknown'} | 
                Load Time: ${info.loadTime.toFixed(2)}ms |
                Errors: ${info.errors.length}
            </div>`
        ).join('');
        
        container.innerHTML = moduleList;
    }

    updateSceneTab() {
        const container = document.querySelector('.scene-inspector');
        if (!container || !window.scene3D) return;
        
        const inspection = this.inspectScene(window.scene3D);
        container.innerHTML = `<pre>${JSON.stringify(inspection, null, 2)}</pre>`;
    }

    // Utility methods
    getCurrentFPS() {
        // Simple FPS counter
        if (!this.fpsCounter) {
            this.fpsCounter = { frames: 0, lastTime: performance.now() };
        }
        
        this.fpsCounter.frames++;
        const now = performance.now();
        if (now - this.fpsCounter.lastTime >= 1000) {
            const fps = this.fpsCounter.frames;
            this.fpsCounter.frames = 0;
            this.fpsCounter.lastTime = now;
            return `${fps} FPS`;
        }
        return 'Calculating...';
    }

    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            this.error(`Global Error: ${event.message}`, 'global', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.error(`Unhandled Promise: ${event.reason}`, 'global', event.reason);
        });
    }

    monitorPerformance() {
        // Monitor performance every 5 seconds
        setInterval(() => {
            if (performance.memory) {
                this.performance['memory_used'] = performance.memory.usedJSHeapSize / 1024 / 1024;
                this.performance['memory_total'] = performance.memory.totalJSHeapSize / 1024 / 1024;
            }
        }, 5000);
    }

    clearLogs() {
        this.logs = [];
        this.errors = [];
        this.warnings = [];
        this.updateLogsTab();
        this.updateErrorsTab();
    }

    exportLogs() {
        const data = {
            logs: this.logs,
            errors: this.errors,
            warnings: this.warnings,
            performance: this.performance,
            modules: Object.fromEntries(this.modules),
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `speakup-debug-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    generateReport() {
        const report = {
            summary: {
                totalLogs: this.logs.length,
                totalErrors: this.errors.length,
                totalWarnings: this.warnings.length,
                modulesLoaded: this.modules.size,
                currentMemory: performance.memory ? `${(performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB` : 'N/A'
            },
            recentErrors: this.errors.slice(-5),
            performance: this.performance,
            modules: Object.fromEntries(this.modules)
        };
        
        console.log('🔧 DEBUG REPORT', report);
        this.log('Debug report generated - check console', 'info', 'debug');
    }

    // STRATEGIC FIX: Initialize THREE.js objects safely
    initThreeObjects() {
        // Wait for THREE.js to be available
        const initThree = () => {
            if (typeof THREE !== 'undefined') {
                this.targetClearColor = new THREE.Color();
                this.tempColor = new THREE.Color();
                this.log('THREE.js color objects initialized', 'debug', 'system');
            } else {
                setTimeout(initThree, 100); // Retry until THREE is available
            }
        };
        initThree();
    }

    // STRATEGIC FIX: Explicit scene registration (no more global dependency)
    setScene(scene3D) {
        this.sceneRef = scene3D;
        this.rendererRef = scene3D?.renderer;
        this.log('3D Scene reference registered with debugger', 'info', 'system');
        
        // Immediately run a safe inspection
        if (scene3D) {
            this.runSafeSceneInspection();
        }
    }

    // STRATEGIC FIX: Explicit canvas registration
    setCanvas(canvas) {
        this.canvasRef = canvas;
        this.log('Canvas reference registered with debugger', 'info', 'system');
    }

    // SOPHISTICATED COLOR ANALYSIS
    analyzeAllColors() {
        console.log('🎨 SOPHISTICATED COLOR ANALYSIS');
        console.log('=====================================');
        
        const analysis = {
            renderer: this.analyzeRendererColors(),
            canvas: this.analyzeCanvasColors(),
            containers: this.analyzeContainerColors(),
            computed: this.analyzeComputedColors(),
            issues: []
        };
        
        // Detect color conflicts and issues
        this.detectColorIssues(analysis);
        
        this.displayColorAnalysis(analysis);
        return analysis;
    }

    analyzeRendererColors() {
        if (!this.rendererRef || !this.targetClearColor) {
            return { error: 'Renderer or color objects not available' };
        }
        
        try {
            // TACTICAL FIX 2: Use getClearColor correctly with target object
            this.rendererRef.getClearColor(this.targetClearColor);
            
            const clearAlpha = this.rendererRef.getClearAlpha();
            const hexColor = this.targetClearColor.getHexString();
            const rgbColor = {
                r: Math.round(this.targetClearColor.r * 255),
                g: Math.round(this.targetClearColor.g * 255),
                b: Math.round(this.targetClearColor.b * 255)
            };
            
            return {
                clearColor: {
                    hex: `#${hexColor}`,
                    rgb: `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`,
                    rgba: `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${clearAlpha})`,
                    alpha: clearAlpha,
                    isTransparent: clearAlpha < 0.1,
                    isDark: this.isColorDark(rgbColor.r, rgbColor.g, rgbColor.b),
                    isBlack: rgbColor.r < 10 && rgbColor.g < 10 && rgbColor.b < 10
                },
                properties: {
                    outputColorSpace: this.rendererRef.outputColorSpace,
                    toneMapping: this.getToneMappingName(this.rendererRef.toneMapping),
                    toneMappingExposure: this.rendererRef.toneMappingExposure
                }
            };
        } catch (error) {
            return { error: `Failed to analyze renderer colors: ${error.message}` };
        }
    }

    analyzeCanvasColors() {
        if (!this.canvasRef) {
            return { error: 'Canvas reference not available' };
        }
        
        const computed = getComputedStyle(this.canvasRef);
        const rect = this.canvasRef.getBoundingClientRect();
        
        return {
            element: 'canvas',
            computed: {
                background: computed.background,
                backgroundColor: computed.backgroundColor,
                opacity: parseFloat(computed.opacity),
                visibility: computed.visibility,
                display: computed.display
            },
            geometry: {
                width: rect.width,
                height: rect.height,
                visible: rect.width > 0 && rect.height > 0,
                onScreen: rect.top < window.innerHeight && rect.bottom > 0
            },
            analysis: {
                isVisible: parseFloat(computed.opacity) > 0.1 && computed.visibility !== 'hidden',
                hasBackground: this.hasVisibleBackground(computed.backgroundColor, computed.background),
                isDark: this.isComputedColorDark(computed.backgroundColor)
            }
        };
    }

    analyzeContainerColors() {
        const containers = [
            { selector: '.scrolly-visuals', name: 'Scrolly Visuals' },
            { selector: '.scrolly-wrapper', name: 'Scrolly Wrapper' },
            { selector: '#canvas-placeholder', name: 'Canvas Placeholder' },
            { selector: 'body', name: 'Body' },
            { selector: 'html', name: 'HTML' }
        ];
        
        return containers.map(container => {
            const element = document.querySelector(container.selector);
            if (!element) {
                return { ...container, exists: false };
            }
            
            const computed = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            
            return {
                ...container,
                exists: true,
                computed: {
                    background: computed.background,
                    backgroundColor: computed.backgroundColor,
                    opacity: parseFloat(computed.opacity),
                    zIndex: computed.zIndex,
                    position: computed.position
                },
                geometry: {
                    width: rect.width,
                    height: rect.height,
                    top: rect.top,
                    left: rect.left
                },
                analysis: {
                    isVisible: parseFloat(computed.opacity) > 0.1,
                    hasBackground: this.hasVisibleBackground(computed.backgroundColor, computed.background),
                    isDark: this.isComputedColorDark(computed.backgroundColor),
                    coversCanvas: this.elementCoversCanvas(element, rect)
                }
            };
        });
    }

    analyzeComputedColors() {
        const cssVariables = [
            '--color-background-dark',
            '--color-background-light', 
            '--color-primary',
            '--color-accent',
            '--rgb-primary',
            '--rgb-accent'
        ];
        
        const computedVars = {};
        const documentStyle = getComputedStyle(document.documentElement);
        
        cssVariables.forEach(variable => {
            const value = documentStyle.getPropertyValue(variable).trim();
            if (value) {
                computedVars[variable] = {
                    value,
                    isDark: this.isCSSValueDark(value),
                    isColor: this.isCSSValueColor(value)
                };
            }
        });
        
        return computedVars;
    }

    // COLOR ANALYSIS UTILITIES
    isColorDark(r, g, b, threshold = 50) {
        return r < threshold && g < threshold && b < threshold;
    }

    isComputedColorDark(colorString) {
        if (!colorString || colorString === 'transparent' || colorString.includes('rgba(0, 0, 0, 0)')) {
            return false;
        }
        
        const rgbMatch = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([01](?:\.\d+)?))?\)/);
        if (rgbMatch) {
            const [, r, g, b, a] = rgbMatch.map(Number);
            if (a !== undefined && a < 0.1) return false;
            return this.isColorDark(r, g, b);
        }
        
        if (colorString.startsWith('#')) {
            const hex = colorString.slice(1);
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return this.isColorDark(r, g, b);
        }
        
        return false;
    }

    isCSSValueDark(value) {
        if (value.includes('#')) {
            return this.isComputedColorDark(value);
        }
        if (value.includes('rgb')) {
            return this.isComputedColorDark(value);
        }
        // For CSS variables that contain RGB values like "17, 32, 36"
        const rgbValues = value.split(',').map(v => parseInt(v.trim()));
        if (rgbValues.length >= 3 && rgbValues.every(v => !isNaN(v))) {
            return this.isColorDark(rgbValues[0], rgbValues[1], rgbValues[2]);
        }
        return false;
    }

    isCSSValueColor(value) {
        return value.includes('#') || value.includes('rgb') || value.includes('hsl') || 
               /^\d+,\s*\d+,\s*\d+$/.test(value);
    }

    hasVisibleBackground(backgroundColor, background) {
        return (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') ||
               (background && background !== 'rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box');
    }

    elementCoversCanvas(element, rect) {
        if (!this.canvasRef) return false;
        
        const canvasRect = this.canvasRef.getBoundingClientRect();
        return rect.left <= canvasRect.left && 
               rect.top <= canvasRect.top &&
               rect.right >= canvasRect.right &&
               rect.bottom >= canvasRect.bottom;
    }

    getToneMappingName(value) {
        const mappings = {
            0: 'NoToneMapping',
            1: 'LinearToneMapping', 
            2: 'ReinhardToneMapping',
            3: 'CineonToneMapping',
            4: 'ACESFilmicToneMapping'
        };
        return mappings[value] || `Unknown(${value})`;
    }

    // ISSUE DETECTION
    detectColorIssues(analysis) {
        const issues = [];
        
        // Check for renderer issues
        if (analysis.renderer.clearColor) {
            const clearColor = analysis.renderer.clearColor;
            if (clearColor.isBlack && !clearColor.isTransparent) {
                issues.push({
                    type: 'RENDERER_BLACK_BACKGROUND',
                    severity: 'HIGH',
                    description: `Renderer has black background (${clearColor.rgba})`,
                    fix: 'Set renderer.setClearColor(pageColor, 1) or setClearColor(0x000000, 0) for transparent'
                });
            }
        }
        
        // Check for canvas visibility issues
        if (analysis.canvas.analysis && !analysis.canvas.analysis.isVisible) {
            issues.push({
                type: 'CANVAS_INVISIBLE',
                severity: 'HIGH',
                description: `Canvas is not visible (opacity: ${analysis.canvas.computed.opacity})`,
                fix: 'Set canvas opacity to 1 and visibility to visible'
            });
        }
        
        // Check for dark containers covering canvas
        analysis.containers.forEach(container => {
            if (container.analysis && container.analysis.coversCanvas && 
                container.analysis.isDark && container.analysis.isVisible) {
                issues.push({
                    type: 'DARK_CONTAINER_COVERING_CANVAS',
                    severity: 'HIGH',
                    description: `${container.name} has dark background and covers canvas`,
                    fix: `Set ${container.selector} background to transparent`
                });
            }
        });
        
        analysis.issues = issues;
    }

    displayColorAnalysis(analysis) {
        console.log('🎨 RENDERER COLORS:');
        if (analysis.renderer.clearColor) {
            const color = analysis.renderer.clearColor;
            console.log(`  Clear Color: ${color.rgba}`);
            console.log(`  Hex: ${color.hex}`);
            console.log(`  Is Transparent: ${color.isTransparent}`);
            console.log(`  Is Dark: ${color.isDark}`);
            console.log(`  Is Black: ${color.isBlack}`);
        } else {
            console.log(`  Error: ${analysis.renderer.error}`);
        }
        
        console.log('🖼️ CANVAS ANALYSIS:');
        if (analysis.canvas.analysis) {
            console.log(`  Visible: ${analysis.canvas.analysis.isVisible}`);
            console.log(`  Opacity: ${analysis.canvas.computed.opacity}`);
            console.log(`  Background: ${analysis.canvas.computed.backgroundColor}`);
        }
        
        console.log('📦 CONTAINER ANALYSIS:');
        analysis.containers.forEach(container => {
            if (container.exists && container.analysis) {
                const icon = container.analysis.isDark ? '🖤' : '📦';
                console.log(`  ${icon} ${container.name}:`, {
                    visible: container.analysis.isVisible,
                    dark: container.analysis.isDark,
                    coversCanvas: container.analysis.coversCanvas,
                    background: container.computed.backgroundColor
                });
            }
        });
        
        console.log('🎨 CSS VARIABLES:');
        Object.entries(analysis.computed).forEach(([variable, info]) => {
            console.log(`  ${variable}: ${info.value} (dark: ${info.isDark})`);
        });
        
        if (analysis.issues.length > 0) {
            console.log('⚠️ COLOR ISSUES DETECTED:');
            analysis.issues.forEach((issue, index) => {
                console.log(`  ${index + 1}. [${issue.severity}] ${issue.type}`);
                console.log(`     ${issue.description}`);
                console.log(`     💡 Fix: ${issue.fix}`);
            });
        } else {
            console.log('✅ No color issues detected');
        }
    }

    // SAFE SCENE INSPECTION (TACTICAL FIX 2)
    runSafeSceneInspection() {
        if (!this.sceneRef) {
            this.warn('No scene registered for inspection', 'debug');
            return null;
        }
        
        return this.inspectScene(this.sceneRef);
    }

    // Add global debugging functions for sophisticated color analysis
    addGlobalColorAnalysis() {
        window.analyzeAllColors = () => this.analyzeAllColors();
        window.inspectColors = () => this.analyzeAllColors();
        window.debugColors = () => this.analyzeAllColors();
        
        this.log('Global color analysis functions added', 'debug', 'system');
    }

    // Initialize global functions
    initGlobalFunctions() {
        this.addGlobalColorAnalysis();
    }
}

// Create global debug controller instance with enhanced capabilities
window.debugController = new DebugController();

// Initialize global functions if debug mode is enabled
if (window.debugController.isEnabled) {
    window.debugController.initGlobalFunctions();
}

// Export for module use
export { DebugController };
export default window.debugController;
