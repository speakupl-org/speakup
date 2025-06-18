// /js/diagnostics/three-scene-debugger.js - 3D Scene Specific Debugging

import * as THREE from 'three';

/**
 * Advanced 3D Scene Debugger for THREE.js
 * Provides real-time monitoring and debugging of 3D scene elements
 */
class ThreeSceneDebugger {
    constructor(scene3D) {
        this.scene3D = scene3D;
        this.isActive = false;
        this.helpers = new Map();
        this.stats = null;
        
        if (window.debugController?.isEnabled && scene3D) {
            // Delay initialization to ensure renderer is fully ready
            setTimeout(() => {
                this.initialize();
            }, 500);
        }
    }

    initialize() {
        try {
            this.createStatsMonitor();
            this.setupSceneHelpers();
            this.addDebugControls();
            this.monitorBackground();
            console.log('🎯 3D Scene Debugger initialized');
        } catch (error) {
            console.error('3D Scene Debugger initialization failed:', error);
            // Continue without debugger rather than breaking the app
        }
    }

    createStatsMonitor() {
        // Create a simple stats display
        const statsContainer = document.createElement('div');
        statsContainer.id = 'three-stats';
        statsContainer.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            font-family: monospace;
            font-size: 12px;
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            display: none;
        `;
        document.body.appendChild(statsContainer);
        
        this.statsContainer = statsContainer;
        this.updateStats();
    }

    updateStats() {
        if (!this.statsContainer || !this.scene3D) return;
        
        try {
            const stats = this.getSceneStats();
            this.statsContainer.innerHTML = `
                <div><strong>3D SCENE DEBUG</strong></div>
                <div>Renderer: ${stats.renderer.type}</div>
                <div>Clear Color: ${stats.renderer.clearColor}</div>
                <div>Clear Alpha: ${stats.renderer.clearAlpha}</div>
                <div>Tone Mapping: ${stats.renderer.toneMapping}</div>
                <div>---</div>
                <div>Cube Visible: ${stats.cube.visible}</div>
                <div>Cube Rotation: ${stats.cube.rotation}</div>
                <div>Material Type: ${stats.cube.materialType}</div>
                <div>Transmission: ${stats.cube.transmission}</div>
                <div>---</div>
                <div>Light 1: ${stats.lights.pillar1}</div>
                <div>Light 2: ${stats.lights.pillar2}</div>
                <div>Light 3: ${stats.lights.pillar3}</div>
                <div>---</div>
                <div>Environment: ${stats.environment.loaded ? '✅' : '❌'}</div>
                <div>Background: ${stats.environment.background}</div>
                <div>---</div>
                <div>Draw Calls: ${stats.performance.drawCalls}</div>
                <div>Triangles: ${stats.performance.triangles}</div>
            `;
            
            // Update every frame if active
            if (this.isActive) {
                requestAnimationFrame(() => this.updateStats());
            }
        } catch (error) {
            console.warn('Stats update failed:', error);
            if (this.statsContainer) {
                this.statsContainer.innerHTML = '<div>Stats unavailable</div>';
            }
        }
    }

    getSceneStats() {
        const { cube, lights, renderer, scene } = this.scene3D;
        
        // Safe renderer access with fallbacks
        let rendererStats = {
            type: 'Unknown',
            clearColor: '#000000',
            clearAlpha: '0.00',
            toneMapping: 'Unknown',
            exposure: 'Unknown'
        };
        
        if (renderer && renderer.getClearColor) {
            try {
                // Check if renderer is actually ready by testing the method
                const testColor = new THREE.Color();
                const clearColor = renderer.getClearColor(testColor);
                
                rendererStats = {
                    type: renderer.constructor.name,
                    clearColor: `#${clearColor.getHexString()}`,
                    clearAlpha: renderer.getClearAlpha().toFixed(2),
                    toneMapping: this.getToneMappingName(renderer.toneMapping),
                    exposure: renderer.toneMappingExposure
                };
            } catch (error) {
                console.warn('Renderer not fully ready yet:', error.message);
                // Keep default values if renderer isn't ready
            }
        }
        
        return {
            renderer: rendererStats,
            cube: {
                visible: cube?.visible || false,
                rotation: cube?.rotation ? 
                    `x:${cube.rotation.x.toFixed(2)} y:${cube.rotation.y.toFixed(2)} z:${cube.rotation.z.toFixed(2)}` : 'N/A',
                materialType: cube?.material?.type || 'Unknown',
                transmission: cube?.material?.transmission?.toFixed(2) || 'N/A',
                opacity: cube?.material?.opacity?.toFixed(2) || 'N/A'
            },
            lights: {
                pillar1: lights?.pillar1 ? `${lights.pillar1.intensity.toFixed(1)} (${this.getColorHex(lights.pillar1.color)})` : 'N/A',
                pillar2: lights?.pillar2 ? `${lights.pillar2.intensity.toFixed(1)} (${this.getColorHex(lights.pillar2.color)})` : 'N/A',
                pillar3: lights?.pillar3 ? `${lights.pillar3.intensity.toFixed(1)} (${this.getColorHex(lights.pillar3.color)})` : 'N/A'
            },
            environment: {
                loaded: !!scene?.environment,
                background: scene?.background ? 'Set' : 'None'
            },
            performance: {
                drawCalls: renderer?.info?.render?.calls || 0,
                triangles: renderer?.info?.render?.triangles || 0
            }
        };
    }

    getToneMappingName(value) {
        const mappings = {
            0: 'NoToneMapping',
            1: 'LinearToneMapping',
            2: 'ReinhardToneMapping',
            3: 'CineonToneMapping',
            4: 'ACESFilmicToneMapping'
        };
        return mappings[value] || 'Unknown';
    }

    getColorHex(color) {
        return `#${color.getHexString()}`;
    }

    setupSceneHelpers() {
        if (!this.scene3D.scene) return;
        
        try {
            // Light helpers
            if (this.scene3D.lights) {
                Object.entries(this.scene3D.lights).forEach(([name, light]) => {
                    if (light && light.isPointLight) {
                        const helper = new THREE.PointLightHelper(light, 0.5);
                        helper.visible = false;
                        this.scene3D.scene.add(helper);
                        this.helpers.set(`${name}_helper`, helper);
                    }
                });
            }
            
            // Axes helper
            const axesHelper = new THREE.AxesHelper(2);
            axesHelper.visible = false;
            this.scene3D.scene.add(axesHelper);
            this.helpers.set('axes', axesHelper);
            
            // Grid helper
            const gridHelper = new THREE.GridHelper(10, 10);
            gridHelper.visible = false;
            this.scene3D.scene.add(gridHelper);
            this.helpers.set('grid', gridHelper);
        } catch (error) {
            console.warn('Could not setup scene helpers:', error);
        }
    }

    addDebugControls() {
        // Add debug controls to the debug panel
        const debugPanel = document.getElementById('debug-panel');
        if (!debugPanel) return;
        
        // Add scene-specific controls
        const sceneTab = debugPanel.querySelector('#tab-scene');
        if (sceneTab) {
            const controls = document.createElement('div');
            controls.innerHTML = `
                <div style="margin-bottom: 15px;">
                    <h4 style="color: #00ff00; margin: 0 0 10px 0;">Scene Controls</h4>
                    <button onclick="threeDebugger.toggleStats()">Toggle Stats</button>
                    <button onclick="threeDebugger.toggleHelpers()">Toggle Helpers</button>
                    <button onclick="threeDebugger.inspectBackground()">Inspect Background</button>
                    <button onclick="threeDebugger.resetScene()">Reset Scene</button>
                </div>
                <div style="margin-bottom: 15px;">
                    <h4 style="color: #00ff00; margin: 0 0 10px 0;">Material Controls</h4>
                    <label style="display: block; margin: 5px 0;">
                        Transmission: <input type="range" min="0" max="1" step="0.01" value="0.92" 
                                           onchange="threeDebugger.updateTransmission(this.value)">
                        <span id="transmission-value">0.92</span>
                    </label>
                    <label style="display: block; margin: 5px 0;">
                        Roughness: <input type="range" min="0" max="1" step="0.01" value="0.1" 
                                        onchange="threeDebugger.updateRoughness(this.value)">
                        <span id="roughness-value">0.1</span>
                    </label>
                    <label style="display: block; margin: 5px 0;">
                        Opacity: <input type="range" min="0" max="1" step="0.01" value="0.95" 
                                      onchange="threeDebugger.updateOpacity(this.value)">
                        <span id="opacity-value">0.95</span>
                    </label>
                </div>
                <div style="margin-bottom: 15px;">
                    <h4 style="color: #00ff00; margin: 0 0 10px 0;">Lighting Controls</h4>
                    <label style="display: block; margin: 5px 0;">
                        Light 1: <input type="range" min="0" max="5" step="0.1" value="0" 
                                      onchange="threeDebugger.updateLightIntensity('pillar1', this.value)">
                        <span id="light1-value">0</span>
                    </label>
                    <label style="display: block; margin: 5px 0;">
                        Light 2: <input type="range" min="0" max="5" step="0.1" value="0" 
                                      onchange="threeDebugger.updateLightIntensity('pillar2', this.value)">
                        <span id="light2-value">0</span>
                    </label>
                    <label style="display: block; margin: 5px 0;">
                        Light 3: <input type="range" min="0" max="5" step="0.1" value="0" 
                                      onchange="threeDebugger.updateLightIntensity('pillar3', this.value)">
                        <span id="light3-value">0</span>
                    </label>
                </div>
                <div style="margin-bottom: 15px;">
                    <h4 style="color: #00ff00; margin: 0 0 10px 0;">Background Controls</h4>
                    <button onclick="threeDebugger.setBackgroundColor('#000000')">Black</button>
                    <button onclick="threeDebugger.setBackgroundColor('#112024')">Dark Blue</button>
                    <button onclick="threeDebugger.setBackgroundColor('#ffffff')">White</button>
                    <button onclick="threeDebugger.clearBackground()">Transparent</button>
                </div>
                <div id="scene-data"></div>
            `;
            sceneTab.appendChild(controls);
        }
    }

    toggleStats() {
        this.isActive = !this.isActive;
        this.statsContainer.style.display = this.isActive ? 'block' : 'none';
        
        if (this.isActive) {
            this.updateStats();
            window.debugController?.info('3D Stats monitor enabled', 'scene');
        } else {
            window.debugController?.info('3D Stats monitor disabled', 'scene');
        }
    }

    toggleHelpers() {
        const areVisible = this.helpers.get('axes')?.visible || false;
        this.helpers.forEach(helper => {
            helper.visible = !areVisible;
        });
        window.debugController?.info(`Scene helpers ${!areVisible ? 'enabled' : 'disabled'}`, 'scene');
    }

    updateTransmission(value) {
        if (this.scene3D.cube?.material) {
            this.scene3D.cube.material.transmission = parseFloat(value);
            document.getElementById('transmission-value').textContent = value;
            window.debugController?.debug(`Transmission updated to ${value}`, 'scene');
        }
    }

    updateRoughness(value) {
        if (this.scene3D.cube?.material) {
            this.scene3D.cube.material.roughness = parseFloat(value);
            document.getElementById('roughness-value').textContent = value;
            window.debugController?.debug(`Roughness updated to ${value}`, 'scene');
        }
    }

    updateOpacity(value) {
        if (this.scene3D.cube?.material) {
            this.scene3D.cube.material.opacity = parseFloat(value);
            document.getElementById('opacity-value').textContent = value;
            window.debugController?.debug(`Opacity updated to ${value}`, 'scene');
        }
    }

    updateLightIntensity(lightName, value) {
        if (this.scene3D.lights?.[lightName]) {
            this.scene3D.lights[lightName].intensity = parseFloat(value);
            document.getElementById(`${lightName.replace('pillar', 'light')}-value`).textContent = value;
            window.debugController?.debug(`${lightName} intensity updated to ${value}`, 'scene');
        }
    }

    setBackgroundColor(color) {
        if (this.scene3D.renderer) {
            try {
                this.scene3D.renderer.setClearColor(color, 1);
                window.debugController?.info(`Background color set to ${color}`, 'scene');
            } catch (error) {
                console.warn('Could not set background color:', error);
            }
        }
    }

    clearBackground() {
        if (this.scene3D.renderer) {
            try {
                this.scene3D.renderer.setClearColor(0x000000, 0);
                window.debugController?.info('Background cleared (transparent)', 'scene');
            } catch (error) {
                console.warn('Could not clear background:', error);
            }
        }
    }

    inspectBackground() {
        const inspection = {
            rendererClearColor: this.scene3D.renderer?.getClearColor().getHexString(),
            rendererClearAlpha: this.scene3D.renderer?.getClearAlpha(),
            sceneBackground: this.scene3D.scene?.background,
            sceneEnvironment: this.scene3D.scene?.environment,
            canvasStyles: {
                background: this.scene3D.renderer?.domElement?.style.background,
                backgroundColor: this.scene3D.renderer?.domElement?.style.backgroundColor
            }
        };
        
        console.log('🎯 Background Inspection:', inspection);
        window.debugController?.info('Background inspection completed - check console', 'scene');
        
        // Also display in the debug panel
        const sceneData = document.getElementById('scene-data');
        if (sceneData) {
            sceneData.innerHTML = `
                <div style="border-top: 1px solid #333; padding-top: 10px; margin-top: 10px;">
                    <h5 style="color: #00ff00; margin: 0 0 5px 0;">Background Analysis</h5>
                    <div style="font-size: 10px;">
                        <div>Clear Color: #${inspection.rendererClearColor}</div>
                        <div>Clear Alpha: ${inspection.rendererClearAlpha}</div>
                        <div>Scene BG: ${inspection.sceneBackground ? 'Set' : 'None'}</div>
                        <div>Environment: ${inspection.sceneEnvironment ? 'Loaded' : 'None'}</div>
                        <div>Canvas BG: ${inspection.canvasStyles.background || 'None'}</div>
                    </div>
                </div>
            `;
        }
        
        return inspection;
    }

    monitorBackground() {
        // Disabled - causing renderer errors
        // Will implement a safer version later
        console.log('Background monitoring disabled to prevent renderer errors');
    }

    resetScene() {
        if (!this.scene3D) return;
        
        // Reset cube
        if (this.scene3D.cube) {
            this.scene3D.cube.rotation.set(0, 0, 0);
            this.scene3D.cube.visible = true;
            if (this.scene3D.cube.material) {
                this.scene3D.cube.material.transmission = 0.92;
                this.scene3D.cube.material.roughness = 0.1;
                this.scene3D.cube.material.opacity = 0.95;
            }
        }
        
        // Reset lights
        if (this.scene3D.lights) {
            Object.values(this.scene3D.lights).forEach(light => {
                if (light && light.isPointLight) {
                    light.intensity = 0;
                }
            });
        }
        
        // Reset renderer
        if (this.scene3D.renderer) {
            this.scene3D.renderer.setClearColor(0x000000, 0);
            this.scene3D.renderer.toneMappingExposure = 0.9;
        }
        
        window.debugController?.info('Scene reset to default state', 'scene');
    }

    // === BACKGROUND REMOVAL & THREE.JS INDEPENDENCE ===
    removeAllBackgrounds() {
        console.log('🚫 Removing ALL backgrounds and making THREE.js completely independent...');
        
        try {
            // 1. Remove THREE.js renderer background
            if (this.renderer) {
                this.renderer.setClearColor(0x000000, 0); // Transparent
                this.renderer.setClearAlpha(0);
                this.renderer.domElement.style.background = 'transparent';
                console.log('✅ THREE.js renderer background removed');
            }

            // 2. Remove all CSS backgrounds from containers
            const containers = [
                '#scrollytelling-section',
                '#three-container',
                '.three-canvas-wrapper',
                '.scrollytelling-container',
                '.main-content',
                'body',
                'html'
            ];

            containers.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el) {
                        el.style.background = 'transparent !important';
                        el.style.backgroundColor = 'transparent !important';
                        el.style.backgroundImage = 'none !important';
                        el.style.backgroundAttachment = 'initial !important';
                    }
                });
            });

            // 3. Remove any overlay backgrounds
            const overlays = document.querySelectorAll('[class*="overlay"], [class*="background"], [id*="background"]');
            overlays.forEach(overlay => {
                overlay.style.background = 'transparent !important';
                overlay.style.backgroundColor = 'transparent !important';
                overlay.style.backgroundImage = 'none !important';
            });

            // 4. Make the scene completely autonomous
            this.makeSceneAutonomous();

            console.log('🎯 ALL backgrounds removed - THREE.js scene is now fully independent!');
            return true;
        } catch (error) {
            console.error('❌ Error removing backgrounds:', error);
            return false;
        }
    }

    makeSceneAutonomous() {
        console.log('🚀 Making THREE.js scene completely autonomous...');

        try {
            // 1. Ensure cube is self-illuminated
            if (this.cube && this.cube.material) {
                // Add emissive properties for self-illumination
                this.cube.material.emissive = new THREE.Color(0x444444);
                this.cube.material.emissiveIntensity = 0.3;
                
                // Ensure it's visible regardless of lighting
                this.cube.material.transparent = true;
                this.cube.material.opacity = 0.95;
                
                // Add some base color to ensure visibility
                if (!this.cube.material.color) {
                    this.cube.material.color = new THREE.Color(0xffffff);
                }
                
                this.cube.material.needsUpdate = true;
                console.log('✅ Cube made self-illuminated');
            }

            // 2. Add autonomous lighting system
            this.addAutonomousLighting();

            // 3. Remove environment dependencies
            if (this.scene) {
                this.scene.background = null;
                this.scene.environment = null;
                console.log('✅ Scene environment dependencies removed');
            }

            // 4. Ensure renderer is optimized for transparency
            if (this.renderer) {
                this.renderer.shadowMap.enabled = false; // Disable shadows for better transparency
                this.renderer.autoClear = true;
                this.renderer.sortObjects = true;
                console.log('✅ Renderer optimized for transparency');
            }

            console.log('🎯 Scene is now completely autonomous and independent!');
        } catch (error) {
            console.error('❌ Error making scene autonomous:', error);
        }
    }

    addAutonomousLighting() {
        if (!this.scene) return;

        try {
            // Remove existing lights to start fresh
            const lightsToRemove = [];
            this.scene.traverse(child => {
                if (child.isLight && child.userData.autonomous) {
                    lightsToRemove.push(child);
                }
            });
            lightsToRemove.forEach(light => this.scene.remove(light));

            // Add comprehensive autonomous lighting
            
            // 1. Ambient light for overall illumination
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            ambientLight.userData.autonomous = true;
            this.scene.add(ambientLight);

            // 2. Key directional light
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(5, 5, 5);
            directionalLight.userData.autonomous = true;
            this.scene.add(directionalLight);

            // 3. Fill light from opposite side
            const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
            fillLight.position.set(-5, -3, -5);
            fillLight.userData.autonomous = true;
            this.scene.add(fillLight);

            // 4. Point light for dynamic illumination
            const pointLight = new THREE.PointLight(0xffffff, 1, 100);
            pointLight.position.set(0, 0, 10);
            pointLight.userData.autonomous = true;
            this.scene.add(pointLight);

            console.log('✅ Autonomous lighting system added');
        } catch (error) {
            console.error('❌ Error adding autonomous lighting:', error);
        }
    }

    makeCompletelyTransparent() {
        console.log('👻 Making everything completely transparent...');
        
        try {
            // 1. Remove all backgrounds first
            this.removeAllBackgrounds();

            // 2. Make canvas and container completely transparent
            if (this.canvas) {
                this.canvas.style.background = 'transparent';
                this.canvas.style.backgroundColor = 'transparent';
                this.canvas.style.opacity = '1';
            }

            // 3. Ensure cube is highly visible with self-illumination
            if (this.cube && this.cube.material) {
                // Make cube highly emissive for visibility
                this.cube.material.emissive = new THREE.Color(0x666666);
                this.cube.material.emissiveIntensity = 0.5;
                
                // Add subtle wireframe for better visibility
                this.cube.material.wireframe = false;
                
                // Ensure high opacity
                this.cube.material.transparent = true;
                this.cube.material.opacity = 1.0;
                
                this.cube.material.needsUpdate = true;
                console.log('✅ Cube made highly visible with self-illumination');
            }

            // 4. Create CSS override for complete transparency
            this.addTransparencyCSS();

            console.log('👻 Everything is now completely transparent with visible cube!');
        } catch (error) {
            console.error('❌ Error making completely transparent:', error);
        }
    }

    addTransparencyCSS() {
        // Remove existing transparency CSS
        const existingStyle = document.getElementById('three-transparency-override');
        if (existingStyle) existingStyle.remove();

        // Add new transparency CSS
        const style = document.createElement('style');
        style.id = 'three-transparency-override';
        style.textContent = `
            /* THREE.js Complete Transparency Override */
            #scrollytelling-section,
            #three-container,
            .three-canvas-wrapper,
            .scrollytelling-container,
            canvas {
                background: transparent !important;
                background-color: transparent !important;
                background-image: none !important;
            }
            
            /* Ensure canvas is on top and visible */
            canvas {
                position: relative !important;
                z-index: 10 !important;
                pointer-events: auto !important;
            }
            
            /* Remove any overlay backgrounds */
            [class*="overlay"],
            [class*="background"],
            [id*="background"] {
                background: transparent !important;
                background-color: transparent !important;
                background-image: none !important;
            }
        `;
        document.head.appendChild(style);
        console.log('✅ Transparency CSS override added');
    }

    // === CONVENIENCE METHODS ===
    goFullyTransparent() {
        console.log('🎯 FULL TRANSPARENCY MODE - Making everything transparent with visible cube...');
        this.makeCompletelyTransparent();
        return 'Full transparency mode activated! Cube should be visible against any background.';
    }

    goFullyAutonomous() {
        console.log('🚀 FULL AUTONOMY MODE - Making THREE.js completely independent...');
        this.removeAllBackgrounds();
        this.makeSceneAutonomous();
        return 'Full autonomy mode activated! THREE.js scene is now completely independent.';
    }

    resetToClean() {
        console.log('🧹 CLEAN RESET - Removing all backgrounds and dependencies...');
        this.removeAllBackgrounds();
        this.makeSceneAutonomous();
        this.makeCompletelyTransparent();
        return 'Clean reset complete! Scene is transparent, autonomous, and cube is self-illuminated.';
    }

    // === ENHANCED GLOBAL COMMANDS ===
    setupGlobalCommands() {
        // Enhanced background removal commands
        window.removeAllBackgrounds = () => this.removeAllBackgrounds();
        window.makeSceneAutonomous = () => this.makeSceneAutonomous();
        window.makeCompletelyTransparent = () => this.makeCompletelyTransparent();
        
        // Convenience commands
        window.goFullyTransparent = () => this.goFullyTransparent();
        window.goFullyAutonomous = () => this.goFullyAutonomous();
        window.resetToClean = () => this.resetToClean();
        
        // Enhanced info commands
        window.backgroundInfo = () => {
            console.log(`
🎯 BACKGROUND REMOVAL & INDEPENDENCE COMMANDS:

REMOVE BACKGROUNDS:
• removeAllBackgrounds() - Remove ALL backgrounds (CSS + THREE.js)
• makeCompletelyTransparent() - Make everything transparent with visible cube
• addTransparencyCSS() - Add CSS overrides for transparency

MAKE INDEPENDENT:
• makeSceneAutonomous() - Make THREE.js scene completely independent
• addAutonomousLighting() - Add self-sufficient lighting system

CONVENIENCE:
• goFullyTransparent() - Complete transparency mode with visible cube
• goFullyAutonomous() - Complete independence mode
• resetToClean() - Full reset: transparent + autonomous + self-illuminated

EXISTING COMMANDS:
• setCubeVisible() - Make cube visible on any background
• enhanceLighting() - Add internal THREE.js lighting
• fixCubeMaterial() - Fix cube material for visibility
• transparentBackground() - Make renderer background transparent
• whiteBackground() - Set white background
• blackBackground() - Set black background

Type any command name to execute it!
            `);
        };

        // Enhanced existing commands
        window.threeDebugInfo = () => {
            console.log(`
🔧 THREE.JS DEBUG COMMANDS:

BACKGROUND & INDEPENDENCE:
${this.backgroundInfo ? '• backgroundInfo() - Show background removal commands' : ''}
• goFullyTransparent() - Complete transparency with visible cube
• goFullyAutonomous() - Complete THREE.js independence
• resetToClean() - Clean reset (transparent + autonomous)

CUBE VISIBILITY:
• setCubeVisible() - Make cube visible on any background  
• fixCubeMaterial() - Fix cube material properties
• addSelfIllumination() - Make cube self-illuminated

SCENE CONTROL:
• transparentBackground() - Make renderer transparent
• whiteBackground() - Set white background
• blackBackground() - Set black background
• enhanceLighting() - Add comprehensive lighting

ANALYSIS:
• analyzeScene() - Full scene analysis
• inspectBackground() - Background layer analysis
• checkCubeVisibility() - Cube visibility diagnostics

Type any command to execute it instantly!
            `);
        };

        console.log('✅ Enhanced global commands registered');
    }

    // === EXISTING METHODS CONTINUE ===
}

// Export for use
export { ThreeSceneDebugger };

// Make globally available
window.ThreeSceneDebugger = ThreeSceneDebugger;

// === ENHANCED SIMPLE GLOBAL FIXES ===
window.simpleColorFix = {
    // Background removal
    removeAll: () => {
        const threeDebugger = window.threeDebugger;
        if (threeDebugger) {
            return threeDebugger.removeAllBackgrounds();
        } else {
            console.log('🚫 Removing ALL backgrounds manually...');
            
            // Manual background removal
            const containers = ['#scrollytelling-section', '#three-container', 'canvas', 'body', 'html'];
            containers.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el) {
                        el.style.background = 'transparent !important';
                        el.style.backgroundColor = 'transparent !important';
                        el.style.backgroundImage = 'none !important';
                    }
                });
            });
            return 'All backgrounds removed manually';
        }
    },

    // Complete transparency
    transparent: () => {
        const threeDebugger = window.threeDebugger;
        if (threeDebugger) {
            return threeDebugger.goFullyTransparent();
        } else {
            console.log('👻 Making transparent manually...');
            simpleColorFix.removeAll();
            
            // Add transparency CSS
            const style = document.createElement('style');
            style.textContent = `
                #scrollytelling-section, #three-container, canvas {
                    background: transparent !important;
                    background-color: transparent !important;
                }
            `;
            document.head.appendChild(style);
            return 'Made transparent manually';
        }
    },

    // Complete independence
    autonomous: () => {
        const threeDebugger = window.threeDebugger;
        if (threeDebugger) {
            return threeDebugger.goFullyAutonomous();
        } else {
            console.log('🚀 Making autonomous manually...');
            simpleColorFix.removeAll();
            return 'Made autonomous manually (limited without debugger)';
        }
    },

    // Clean reset
    clean: () => {
        const threeDebugger = window.threeDebugger;
        if (threeDebugger) {
            return threeDebugger.resetToClean();
        } else {
            console.log('🧹 Clean reset manually...');
            simpleColorFix.removeAll();
            simpleColorFix.transparent();
            return 'Clean reset done manually';
        }
    },

    // Enhanced info
    info: () => {
        console.log(`
🎯 SIMPLE COLOR FIX - ENHANCED COMMANDS:

BACKGROUND REMOVAL:
• simpleColorFix.removeAll() - Remove ALL backgrounds
• simpleColorFix.transparent() - Make everything transparent
• simpleColorFix.autonomous() - Make THREE.js independent
• simpleColorFix.clean() - Complete clean reset

EXISTING COMMANDS:
• simpleColorFix.white() - Set white background
• simpleColorFix.black() - Set black background  
• simpleColorFix.clear() - Clear renderer background
• simpleColorFix.cube() - Make cube visible

DIRECT ACCESS:
• removeAllBackgrounds() - Global function
• goFullyTransparent() - Global function
• goFullyAutonomous() - Global function
• resetToClean() - Global function

All commands work with or without advanced debugger!
        `);
    }
};

// Enhanced global help
window.helpBackground = () => {
    console.log(`
🔥 ULTIMATE BACKGROUND REMOVAL HELP:

INSTANT FIXES:
• simpleColorFix.clean() - Ultimate clean reset
• simpleColorFix.transparent() - Full transparency
• simpleColorFix.removeAll() - Remove all backgrounds
• resetToClean() - Complete reset (if debugger loaded)

STEP-BY-STEP:
1. simpleColorFix.removeAll() - Remove all backgrounds
2. simpleColorFix.transparent() - Make transparent
3. Check if cube is visible
4. If not visible: simpleColorFix.cube() - Fix cube

BACKGROUND INFO:
• backgroundInfo() - Show all background commands
• simpleColorFix.info() - Show simple fix commands

The goal: Make THREE.js scene completely independent of any external backgrounds!
    `);
};

console.log('🚀 Enhanced simple fixes loaded! Try: simpleColorFix.clean() or helpBackground()');
