/**
 * QUICK BACKGROUND FIX MODULE - Gennady Philosophy Compliant
 * Provides emergency fixes for common THREE.js visibility issues
 */

class QuickBackgroundFix {
    constructor() {
        this.enabled = true;
        this.fixes = [];
    }
    
    /**
     * Makes the canvas visible by adjusting its opacity and visibility
     */
    forceCanvasVisible() {
        const canvas = document.querySelector('canvas');
        if (!canvas) {
            if (window.debug && window.debug.enabled) {
                window.debug.warn('SCENE', 'CANVAS', 'MISSING [No canvas found in document]');
            }
            return false;
        }
        
        canvas.style.opacity = '1';
        canvas.style.visibility = 'visible';
        
        if (window.debug && window.debug.enabled) {
            window.debug.log('SCENE', 'CANVAS', 'VISIBLE [Forced opacity=1, visibility=visible]');
        }
        
        return true;
    }
    
    /**
     * Sets the renderer clear color to make the scene background visible
     */
    setRendererColor(color = '#000000', alpha = 1) {
        if (!window.threeJsScene || !window.threeJsScene.renderer) {
            if (window.debug && window.debug.enabled) {
                window.debug.warn('SCENE', 'RENDERER', 'MISSING [No renderer found in threeJsScene]');
            }
            return false;
        }
        
        const renderer = window.threeJsScene.renderer;
        
        // Convert hex color string to THREE.Color
        const threeColor = new THREE.Color(color);
        renderer.setClearColor(threeColor, alpha);
        
        if (window.debug && window.debug.enabled) {
            window.debug.log('SCENE', 'RENDERER', `COLOR UPDATED [${color}, alpha=${alpha}]`);
        }
        
        return true;
    }
    
    /**
     * Makes the cube visible by adjusting its material properties
     */
    makeCubeVisible() {
        if (!window.threeJsScene || !window.threeJsScene.cube) {
            if (window.debug && window.debug.enabled) {
                window.debug.warn('SCENE', 'CUBE', 'MISSING [No cube found in threeJsScene]');
            }
            return false;
        }
        
        const cube = window.threeJsScene.cube;
        cube.visible = true;
        
        if (cube.material) {
            cube.material.transparent = true;
            cube.material.opacity = 0.9;
            cube.material.transmission = 0.3;
            
            if (window.debug && window.debug.enabled) {
                window.debug.log('SCENE', 'CUBE', 'VISIBLE [Material properties adjusted for visibility]');
            }
        }
        
        return true;
    }
    
    /**
     * Complete visibility fix: Canvas + Renderer + Cube
     */
    makeVisibleWithCube(backgroundColor = '#000000') {
        const steps = [];
        
        // 1. Force canvas visible
        steps.push(this.forceCanvasVisible());
        
        // 2. Set background color
        steps.push(this.setRendererColor(backgroundColor, 1));
        
        // 3. Make cube visible
        steps.push(this.makeCubeVisible());
        
        if (window.debug && window.debug.enabled) {
            window.debug.log('SCENE', 'VISIBILITY', `FIXED [Combined fixes applied with ${backgroundColor} background]`);
        }
        
        return steps.every(step => step === true);
    }
    
    /**
     * Comprehensive fix for all common visibility issues
     */
    fixEverything() {
        const fixes = [];
        
        // 1. Fix canvas
        if (this.forceCanvasVisible()) {
            fixes.push('Canvas visibility fixed');
        }
        
        // 2. Fix renderer background
        if (this.setRendererColor('#112024', 1)) { // Use the page background color
            fixes.push('Renderer background set to match page');
        }
        
        // 3. Fix cube visibility
        if (this.makeCubeVisible()) {
            fixes.push('Cube visibility fixed');
        }
        
        // 4. Boost lighting if needed
        if (window.threeJsScene && window.threeJsScene.lights) {
            Object.values(window.threeJsScene.lights).forEach((light, index) => {
                const oldIntensity = light.intensity;
                light.intensity = Math.max(1.0, light.intensity);
                
                if (light.intensity !== oldIntensity) {
                    fixes.push(`Light ${index + 1} intensity boosted to ${light.intensity}`);
                }
            });
        }
        
        // 5. Add emergency ambient light if needed
        if (window.threeJsScene && window.threeJsScene.scene) {
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            window.threeJsScene.scene.add(ambientLight);
            fixes.push('Emergency ambient light added');
        }
        
        if (window.debug && window.debug.enabled) {
            window.debug.group('SCENE.FIX');
            fixes.forEach(fix => window.debug.log('SCENE', 'FIX', fix));
            window.debug.groupEnd();
        }
        
        return fixes.length > 0;
    }
    
    /**
     * Check scene state and provide info about current configuration
     */
    info() {
        if (window.debug && window.debug.enabled) {
            window.debug.group('SCENE.STATUS');
            
            // Canvas info
            const canvas = document.querySelector('canvas');
            if (canvas) {
                const computed = window.getComputedStyle(canvas);
                window.debug.log('SCENE', 'CANVAS', 
                    `FOUND [opacity: ${computed.opacity}, visibility: ${computed.visibility}]`);
            } else {
                window.debug.warn('SCENE', 'CANVAS', 'MISSING');
            }
            
            // Renderer info
            if (window.threeJsScene && window.threeJsScene.renderer) {
                const renderer = window.threeJsScene.renderer;
                const color = new THREE.Color();
                renderer.getClearColor(color);
                const alpha = renderer.getClearAlpha();
                window.debug.log('SCENE', 'RENDERER', 
                    `FOUND [clearColor: #${color.getHexString()}, alpha: ${alpha}]`);
            } else {
                window.debug.warn('SCENE', 'RENDERER', 'MISSING');
            }
            
            // Cube info
            if (window.threeJsScene && window.threeJsScene.cube) {
                const cube = window.threeJsScene.cube;
                window.debug.log('SCENE', 'CUBE', 
                    `FOUND [visible: ${cube.visible}, hasTexture: ${!!cube.material.map}]`);
                
                if (cube.material) {
                    window.debug.log('SCENE', 'MATERIAL', 
                        `FOUND [opacity: ${cube.material.opacity}, transmission: ${cube.material.transmission || 0}]`);
                }
            } else {
                window.debug.warn('SCENE', 'CUBE', 'MISSING');
            }
            
            window.debug.groupEnd();
        }
        
        return {
            fixes: [
                'quickBackgroundFix.fixEverything() - Complete automatic fix',
                'quickBackgroundFix.forceCanvasVisible() - Make canvas visible',
                'quickBackgroundFix.makeCubeVisible() - Make cube visible',
                'quickBackgroundFix.setRendererColor("#112024") - Set page background'
            ]
        };
    }
}

// Initialize global instance
window.quickBackgroundFix = new QuickBackgroundFix();
