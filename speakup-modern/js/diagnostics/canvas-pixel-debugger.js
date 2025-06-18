/**
 * Canvas Pixel Debugger - Advanced tool to diagnose actual rendered canvas content
 * This tool checks what's actually being rendered, not just CSS properties
 */

class CanvasPixelDebugger {
    constructor() {
        this.init();
    }

    init() {
        console.log('🔬 Canvas Pixel Debugger initialized');
        this.createCanvasAnalysisTools();
    }

    // Sample actual pixels from the canvas to detect black backgrounds
    analyzeCanvasPixels(canvas = null) {
        canvas = canvas || document.querySelector('#threejs-canvas');
        
        if (!canvas) {
            console.warn('❌ Canvas not found for pixel analysis');
            return null;
        }

        try {
            const ctx = canvas.getContext('2d') || canvas.getContext('webgl') || canvas.getContext('webgl2');
            
            if (!ctx) {
                console.warn('❌ Could not get canvas context');
                return null;
            }

            const analysis = {
                canvas: {
                    width: canvas.width,
                    height: canvas.height,
                    displayWidth: canvas.style.width,
                    displayHeight: canvas.style.height
                },
                samples: [],
                isBlack: false,
                averageColor: null,
                renderer: null
            };

            // For WebGL canvas, we need to sample differently
            if (ctx instanceof WebGLRenderingContext || ctx instanceof WebGL2RenderingContext) {
                analysis.contextType = 'webgl';
                analysis.renderer = this.analyzeThreeJsRenderer();
                
                // Check if renderer clear color is black
                if (window.threeJsScene?.renderer) {
                    const clearColor = new THREE.Color();
                    try {
                        window.threeJsScene.renderer.getClearColor(clearColor);
                        analysis.rendererClearColor = {
                            hex: clearColor.getHexString(),
                            r: clearColor.r,
                            g: clearColor.g,
                            b: clearColor.b,
                            alpha: window.threeJsScene.renderer.getClearAlpha()
                        };
                        
                        // Check if it's black or very dark
                        analysis.isBlack = (clearColor.r < 0.1 && clearColor.g < 0.1 && clearColor.b < 0.1);
                        
                    } catch (error) {
                        console.warn('Could not read renderer clear color:', error);
                        analysis.rendererClearColor = { error: error.message };
                    }
                }
            } else {
                analysis.contextType = '2d';
                // For 2D canvas, sample actual pixels
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                analysis.samples = this.samplePixels(imageData);
                analysis.isBlack = this.isCanvasBlack(analysis.samples);
            }

            return analysis;

        } catch (error) {
            console.error('❌ Error analyzing canvas pixels:', error);
            return { error: error.message };
        }
    }

    analyzeThreeJsRenderer() {
        if (!window.threeJsScene?.renderer) {
            return { error: 'Three.js renderer not found' };
        }

        const renderer = window.threeJsScene.renderer;
        
        return {
            type: renderer.constructor.name,
            outputColorSpace: renderer.outputColorSpace,
            toneMapping: renderer.toneMapping,
            toneMappingExposure: renderer.toneMappingExposure,
            shadowMap: {
                enabled: renderer.shadowMap.enabled,
                type: renderer.shadowMap.type
            },
            info: renderer.info,
            domElement: {
                width: renderer.domElement.width,
                height: renderer.domElement.height,
                style: {
                    width: renderer.domElement.style.width,
                    height: renderer.domElement.style.height,
                    background: getComputedStyle(renderer.domElement).background
                }
            }
        };
    }

    samplePixels(imageData, sampleCount = 100) {
        const samples = [];
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        
        for (let i = 0; i < sampleCount; i++) {
            const x = Math.floor(Math.random() * width);
            const y = Math.floor(Math.random() * height);
            const index = (y * width + x) * 4;
            
            samples.push({
                x, y,
                r: data[index],
                g: data[index + 1],
                b: data[index + 2],
                a: data[index + 3]
            });
        }
        
        return samples;
    }

    isCanvasBlack(samples) {
        if (!samples || samples.length === 0) return false;
        
        // Calculate average color
        const avg = samples.reduce((acc, sample) => {
            acc.r += sample.r;
            acc.g += sample.g;
            acc.b += sample.b;
            return acc;
        }, { r: 0, g: 0, b: 0 });
        
        avg.r /= samples.length;
        avg.g /= samples.length;
        avg.b /= samples.length;
        
        // Check if average is very dark (black-ish)
        return avg.r < 30 && avg.g < 30 && avg.b < 30;
    }

    // Deep dive into the actual rendering state
    diagnoseRenderingState() {
        console.log('🔬 DEEP RENDERING DIAGNOSTICS');
        console.log('=============================');
        
        const canvas = document.querySelector('#threejs-canvas');
        const placeholder = document.querySelector('#canvas-placeholder');
        const visuals = document.querySelector('.scrolly-visuals');
        
        // First, check the DOM element visibility and layering
        const domAnalysis = this.analyzeDOMLayering(canvas, placeholder, visuals);
        this.displayDOMAnalysis(domAnalysis);
        
        const pixelAnalysis = this.analyzeCanvasPixels(canvas);
        
        if (!pixelAnalysis) {
            console.error('❌ Could not analyze canvas');
            return { domAnalysis };
        }

        console.log('📊 Canvas Analysis:');
        console.log('  Dimensions:', `${pixelAnalysis.canvas.width}x${pixelAnalysis.canvas.height}`);
        console.log('  Display Size:', `${pixelAnalysis.canvas.displayWidth} x ${pixelAnalysis.canvas.displayHeight}`);
        console.log('  Context Type:', pixelAnalysis.contextType);
        
        if (pixelAnalysis.rendererClearColor) {
            console.log('🎨 Renderer Clear Color:');
            console.log('  Hex:', `#${pixelAnalysis.rendererClearColor.hex}`);
            console.log('  RGB:', `rgb(${Math.round(pixelAnalysis.rendererClearColor.r * 255)}, ${Math.round(pixelAnalysis.rendererClearColor.g * 255)}, ${Math.round(pixelAnalysis.rendererClearColor.b * 255)})`);
            console.log('  Alpha:', pixelAnalysis.rendererClearColor.alpha);
            console.log('  Is Black/Dark:', pixelAnalysis.isBlack);
        }

        if (pixelAnalysis.renderer) {
            console.log('🖥️ Renderer State:');
            console.log('  Type:', pixelAnalysis.renderer.type);
            console.log('  Output Color Space:', pixelAnalysis.renderer.outputColorSpace);
            console.log('  Tone Mapping:', pixelAnalysis.renderer.toneMapping);
            console.log('  Tone Mapping Exposure:', pixelAnalysis.renderer.toneMappingExposure);
        }

        // Check scene state
        if (window.threeJsScene) {
            console.log('🌟 Scene State:');
            console.log('  Background:', window.threeJsScene.scene.background);
            console.log('  Environment:', window.threeJsScene.scene.environment);
            console.log('  Children Count:', window.threeJsScene.scene.children.length);
            
            if (window.threeJsScene.cube) {
                console.log('🧊 Cube State:');
                console.log('  Visible:', window.threeJsScene.cube.visible);
                console.log('  Position:', window.threeJsScene.cube.position);
                console.log('  Scale:', window.threeJsScene.cube.scale);
                console.log('  Material Type:', window.threeJsScene.cube.material.type);
                console.log('  Material Color:', window.threeJsScene.cube.material.color.getHexString());
                console.log('  Material Transmission:', window.threeJsScene.cube.material.transmission);
                console.log('  Material Opacity:', window.threeJsScene.cube.material.opacity);
            }
        }

        return pixelAnalysis;
    }

    // Fix the actual rendering issues
    fixRendererBlackBackground() {
        console.log('🔧 FIXING ALL RENDERING AND LAYERING ISSUES...');
        
        const canvas = document.querySelector('#threejs-canvas');
        const placeholder = document.querySelector('#canvas-placeholder');
        const visuals = document.querySelector('.scrolly-visuals');
        
        const fixes = [];
        
        // 1. Fix DOM layering issues first
        if (placeholder) {
            const placeholderStyle = getComputedStyle(placeholder);
            if (parseFloat(placeholderStyle.opacity) > 0) {
                console.log('🎭 Hiding placeholder that was covering canvas');
                placeholder.style.opacity = '0';
                placeholder.style.pointerEvents = 'none';
                fixes.push('✅ Hidden placeholder element');
            }
        }
        
        // 2. Fix canvas visibility
        if (canvas) {
            const canvasStyle = getComputedStyle(canvas);
            if (parseFloat(canvasStyle.opacity) < 0.8) {
                console.log('👁️ Making canvas fully visible');
                canvas.style.opacity = '1';
                canvas.style.visibility = 'visible';
                canvas.style.display = 'block';
                fixes.push('✅ Canvas made fully visible');
            }
        }
        
        // 3. Fix Three.js renderer if available
        if (window.threeJsScene?.renderer) {
            const renderer = window.threeJsScene.renderer;
            
            try {
                // Set renderer clear color to match page background
                const pageBackground = getComputedStyle(document.documentElement).getPropertyValue('--color-background-dark') || '#112024';
                console.log('🎨 Setting renderer clear color to:', pageBackground);
                renderer.setClearColor(pageBackground, 1);
                fixes.push('✅ Renderer clear color set');
                
                // Ensure scene background if needed
                if (!window.threeJsScene.scene.background && !window.threeJsScene.scene.environment) {
                    console.log('🌟 Setting scene background color');
                    window.threeJsScene.scene.background = new THREE.Color(pageBackground);
                    fixes.push('✅ Scene background set');
                }
                
                // Fix cube visibility
                if (window.threeJsScene.cube && !window.threeJsScene.cube.visible) {
                    console.log('🧊 Making cube visible');
                    window.threeJsScene.cube.visible = true;
                    fixes.push('✅ Cube made visible');
                }
                
                // Ensure proper lighting
                if (window.threeJsScene.lights) {
                    console.log('💡 Ensuring adequate lighting');
                    Object.values(window.threeJsScene.lights).forEach((light, index) => {
                        if (light.intensity < 0.1) {
                            light.intensity = Math.max(0.3, light.intensity);
                            fixes.push(`✅ Light ${index + 1} intensity increased`);
                        }
                    });
                }
                
            } catch (error) {
                console.error('❌ Error fixing Three.js renderer:', error);
                fixes.push('❌ Three.js renderer fix failed');
            }
        }
        
        // 4. Fix container backgrounds
        if (visuals) {
            console.log('📦 Clearing container backgrounds');
            visuals.style.background = 'transparent';
            visuals.style.backgroundColor = 'transparent';
            fixes.push('✅ Container backgrounds cleared');
        }
        
        console.log('\n🎯 FIXES APPLIED:');
        fixes.forEach(fix => console.log(`  ${fix}`));
        
        return { success: fixes.length > 0, fixes };
    }

    // Quick fix for the most common issue: placeholder covering canvas
    fixPlaceholderIssue() {
        const placeholder = document.querySelector('#canvas-placeholder');
        const canvas = document.querySelector('#threejs-canvas');
        
        if (!placeholder || !canvas) {
            console.warn('❌ Could not find placeholder or canvas elements');
            return false;
        }
        
        const placeholderStyle = getComputedStyle(placeholder);
        const canvasStyle = getComputedStyle(canvas);
        
        console.log('🎭 FIXING PLACEHOLDER COVERING CANVAS...');
        console.log('  Before - Placeholder opacity:', placeholderStyle.opacity);
        console.log('  Before - Canvas opacity:', canvasStyle.opacity);
        
        // Hide placeholder and show canvas
        placeholder.style.opacity = '0';
        placeholder.style.pointerEvents = 'none';
        placeholder.style.zIndex = '-1';
        
        canvas.style.opacity = '1';
        canvas.style.visibility = 'visible';
        canvas.style.zIndex = '1';
        
        console.log('✅ Placeholder hidden, canvas revealed');
        return true;
    }

    // Analyze DOM element layering and visibility issues
    analyzeDOMLayering(canvas, placeholder, visuals) {
        const analysis = {
            canvas: this.getElementDetails(canvas, 'Canvas'),
            placeholder: this.getElementDetails(placeholder, 'Placeholder'), 
            visuals: this.getElementDetails(visuals, 'Visuals Container'),
            layeringIssues: [],
            visibilityIssues: []
        };

        // Check for layering issues
        if (analysis.canvas && analysis.placeholder) {
            const canvasZ = this.getEffectiveZIndex(canvas);
            const placeholderZ = this.getEffectiveZIndex(placeholder);
            
            if (placeholderZ > canvasZ && analysis.placeholder.opacity > 0) {
                analysis.layeringIssues.push({
                    type: 'PLACEHOLDER_COVERING_CANVAS',
                    severity: 'HIGH',
                    description: `Placeholder (z:${placeholderZ}, opacity:${analysis.placeholder.opacity}) is covering canvas (z:${canvasZ})`,
                    fix: 'Set placeholder opacity to 0 or move it behind canvas'
                });
            }
        }

        // Check for visibility issues
        if (analysis.canvas && analysis.canvas.opacity < 0.1) {
            analysis.visibilityIssues.push({
                type: 'CANVAS_INVISIBLE',
                severity: 'HIGH',
                description: `Canvas has very low opacity: ${analysis.canvas.opacity}`,
                fix: 'Set canvas opacity to 1'
            });
        }

        if (analysis.canvas && analysis.canvas.display === 'none') {
            analysis.visibilityIssues.push({
                type: 'CANVAS_HIDDEN',
                severity: 'HIGH', 
                description: 'Canvas is hidden with display:none',
                fix: 'Set canvas display to block or remove display:none'
            });
        }

        // Check for placeholder being black/dark
        if (analysis.placeholder && analysis.placeholder.opacity > 0) {
            const bgColor = analysis.placeholder.backgroundColor;
            if (this.isColorDark(bgColor) || this.hasBlackBackground(placeholder)) {
                analysis.visibilityIssues.push({
                    type: 'DARK_PLACEHOLDER',
                    severity: 'HIGH',
                    description: `Placeholder has dark background: ${bgColor}`,
                    fix: 'Set placeholder background to transparent'
                });
            }
        }

        return analysis;
    }

    getElementDetails(element, name) {
        if (!element) {
            return { exists: false, name };
        }

        const computed = getComputedStyle(element);
        const rect = element.getBoundingClientRect();

        return {
            exists: true,
            name,
            opacity: parseFloat(computed.opacity),
            display: computed.display,
            visibility: computed.visibility,
            position: computed.position,
            zIndex: computed.zIndex,
            backgroundColor: computed.backgroundColor,
            background: computed.background,
            dimensions: {
                width: rect.width,
                height: rect.height,
                top: rect.top,
                left: rect.left
            },
            element
        };
    }

    getEffectiveZIndex(element) {
        const computed = getComputedStyle(element);
        if (computed.zIndex === 'auto') {
            // Find the actual z-index by checking parent stacking contexts
            let parent = element.parentElement;
            while (parent) {
                const parentComputed = getComputedStyle(parent);
                if (parentComputed.zIndex !== 'auto') {
                    return parseInt(parentComputed.zIndex);
                }
                parent = parent.parentElement;
            }
            return 0; // Default z-index
        }
        return parseInt(computed.zIndex);
    }

    isColorDark(colorString) {
        // Check if a color string represents a dark color
        if (!colorString || colorString === 'transparent' || colorString.includes('rgba(0, 0, 0, 0)')) {
            return false;
        }
        
        // Handle rgb/rgba colors
        const rgbMatch = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([01](?:\.\d+)?))?\)/);
        if (rgbMatch) {
            const [, r, g, b, a] = rgbMatch.map(Number);
            if (a !== undefined && a < 0.1) return false; // Transparent
            return r < 50 && g < 50 && b < 50; // Dark
        }
        
        // Handle hex colors
        if (colorString.startsWith('#')) {
            const hex = colorString.slice(1);
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return r < 50 && g < 50 && b < 50;
        }
        
        return false;
    }

    hasBlackBackground(element) {
        // Check if element has any black backgrounds set via CSS or styles
        const computed = getComputedStyle(element);
        return this.isColorDark(computed.backgroundColor) || 
               computed.background.includes('rgb(0, 0, 0)') ||
               computed.background.includes('#000');
    }

    displayDOMAnalysis(analysis) {
        console.log('🏗️  DOM LAYERING ANALYSIS:');
        
        // Display element details
        [analysis.canvas, analysis.placeholder, analysis.visuals].forEach(element => {
            if (element && element.exists) {
                const visibilityIcon = element.opacity > 0.8 ? '👁️' : 
                                     element.opacity > 0.1 ? '👁️‍🗨️' : '🙈';
                console.log(`  ${visibilityIcon} ${element.name}:`, {
                    opacity: element.opacity,
                    zIndex: element.zIndex,
                    position: element.position,
                    background: element.backgroundColor,
                    dimensions: `${element.dimensions.width}x${element.dimensions.height}`
                });
            } else if (element) {
                console.log(`  ❌ ${element.name}: NOT FOUND`);
            }
        });

        // Display issues
        if (analysis.layeringIssues.length > 0) {
            console.log('⚠️ LAYERING ISSUES:');
            analysis.layeringIssues.forEach((issue, index) => {
                console.log(`  ${index + 1}. [${issue.severity}] ${issue.type}`);
                console.log(`     ${issue.description}`);
                console.log(`     💡 Fix: ${issue.fix}`);
            });
        }

        if (analysis.visibilityIssues.length > 0) {
            console.log('👁️ VISIBILITY ISSUES:');
            analysis.visibilityIssues.forEach((issue, index) => {
                console.log(`  ${index + 1}. [${issue.severity}] ${issue.type}`);
                console.log(`     ${issue.description}`);
                console.log(`     💡 Fix: ${issue.fix}`);
            });
        }

        if (analysis.layeringIssues.length === 0 && analysis.visibilityIssues.length === 0) {
            console.log('✅ No DOM layering or visibility issues detected');
        }
    }

    createCanvasAnalysisTools() {
        // Add global debugging functions
        window.canvasPixelDebug = {
            analyze: () => {
                return this.diagnoseRenderingState();
            },
            
            fixRenderer: () => {
                return this.fixRendererBlackBackground();
            },
            
            fixPlaceholder: () => {
                return this.fixPlaceholderIssue();
            },
            
            samplePixels: (canvas = null) => {
                return this.analyzeCanvasPixels(canvas);
            },
            
            quickFix: () => {
                console.log('🚀 RUNNING QUICK COMPREHENSIVE FIX...');
                const results = [];
                results.push(this.fixPlaceholderIssue());
                results.push(this.fixRendererBlackBackground());
                console.log('🎯 Quick fix completed');
                return results;
            },
            
            info: () => {
                console.log('🔬 Canvas Pixel Debug Commands:');
                console.log('  canvasPixelDebug.analyze() - Deep rendering diagnostics');
                console.log('  canvasPixelDebug.fixRenderer() - Fix renderer black background');
                console.log('  canvasPixelDebug.fixPlaceholder() - Fix placeholder covering canvas');
                console.log('  canvasPixelDebug.quickFix() - Fix all common issues');
                console.log('  canvasPixelDebug.samplePixels() - Sample actual canvas pixels');
            }
        };
        
        console.log('🔬 Canvas pixel debug tools available: canvasPixelDebug.info()');
    }
}

// Auto-initialize if debug mode is enabled
if (window.debugController?.isEnabled) {
    // Wait for DOM and Three.js to be ready
    const initCanvasPixelDebugger = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCanvasPixelDebugger);
            return;
        }
        
        setTimeout(() => {
            try {
                window.canvasPixelDebugger = new CanvasPixelDebugger();
            } catch (error) {
                console.warn('Failed to initialize canvas pixel debugger:', error);
            }
        }, 200);
    };
    
    initCanvasPixelDebugger();
}

export { CanvasPixelDebugger };
export default CanvasPixelDebugger;
