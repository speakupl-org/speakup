// /js/diagnostics/scrollytelling-debugger.js - Advanced Scrollytelling Layout Debugger

import * as THREE from 'three';

/**
 * Advanced Scrollytelling Layout Debugger
 * Specifically designed to debug complex scrollytelling layouts and background issues
 */
class ScrollytellingDebugger {
    constructor() {
        this.isActive = false;
        this.overlays = new Map();
        this.measurements = {};
        
        if (window.debugController?.isEnabled) {
            this.initialize();
        }
    }

    initialize() {
        console.log('🔍 Scrollytelling Layout Debugger initialized');
        this.createScrollytellingAnalysis();
        this.addScrollytellingControls();
    }

    createScrollytellingAnalysis() {
        // Create detailed layout analysis
        const analysis = this.analyzeScrollytellingLayout();
        this.displayLayoutAnalysis(analysis);
        
        // Create visual overlays
        this.createVisualOverlays();
        
        // Add live monitoring
        this.startLayoutMonitoring();
    }

    analyzeScrollytellingLayout() {
        const elements = {
            wrapper: document.querySelector('.scrolly-experience-wrapper'),
            visuals: document.querySelector('.scrolly-visuals'),
            text: document.querySelector('.scrolly-text'),
            canvas: document.querySelector('#threejs-canvas'),
            placeholder: document.querySelector('#canvas-placeholder'),
            sections: document.querySelectorAll('.scrolly-section')
        };

        const analysis = {
            elements: {},
            layout: {},
            styling: {},
            positioning: {},
            zIndex: {},
            backgroundLayers: []
        };

        // Analyze each element
        Object.entries(elements).forEach(([name, element]) => {
            if (element && element.nodeType === Node.ELEMENT_NODE) {
                try {
                    const computed = getComputedStyle(element);
                    const rect = element.getBoundingClientRect();
                    
                    analysis.elements[name] = {
                        exists: true,
                        dimensions: {
                            width: rect.width,
                            height: rect.height,
                            top: rect.top,
                            left: rect.left
                        },
                        styling: {
                            position: computed.position,
                            display: computed.display,
                            zIndex: computed.zIndex,
                            opacity: computed.opacity,
                            visibility: computed.visibility,
                            overflow: computed.overflow,
                            background: computed.background,
                            backgroundColor: computed.backgroundColor
                        }
                    };
                } catch (error) {
                    console.warn(`Failed to analyze element ${name}:`, error);
                    analysis.elements[name] = { exists: false, error: error.message };
                }
            } else {
                analysis.elements[name] = { exists: false };
            }
        });

        // Analyze background layers
        this.analyzeBackgroundLayers(analysis, elements);
        
        // Detect layout issues
        this.detectLayoutIssues(analysis);

        return analysis;
    }

    analyzeBackgroundLayers(analysis, elements) {
        const layers = [];
        
        // Check each element that could contribute to background
        const elementsToCheck = ['wrapper', 'visuals', 'canvas', 'placeholder'];
        
        elementsToCheck.forEach(name => {
            const element = elements[name];
            if (element && element.nodeType === Node.ELEMENT_NODE && analysis.elements[name] && analysis.elements[name].exists) {
                try {
                    const computed = getComputedStyle(element);
                    const rect = element.getBoundingClientRect();
                    
                    if (computed.backgroundColor !== 'rgba(0, 0, 0, 0)' || 
                        computed.background !== 'rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box') {
                        
                        layers.push({
                            element: name,
                            zIndex: computed.zIndex,
                            backgroundColor: computed.backgroundColor,
                            background: computed.background,
                            opacity: computed.opacity,
                            position: computed.position,
                            dimensions: rect,
                            isBlack: this.isBlackish(computed.backgroundColor, computed.background)
                        });
                    }
                } catch (error) {
                    console.warn(`Failed to analyze background for element ${name}:`, error);
                }
            }
        });

        // Sort by z-index and position
        layers.sort((a, b) => {
            const aZ = a.zIndex === 'auto' ? 0 : parseInt(a.zIndex);
            const bZ = b.zIndex === 'auto' ? 0 : parseInt(b.zIndex);
            return bZ - aZ; // Higher z-index first
        });

        analysis.backgroundLayers = layers;
    }

    isBlackish(bgColor, background) {
        // First check if it's transparent (alpha = 0) - NOT black!
        if (bgColor.includes('rgba(0, 0, 0, 0)') || bgColor === 'transparent') return false;
        if (background.includes('rgba(0, 0, 0, 0)') || background === 'transparent') return false;
        
        // Check if background appears black or very dark (but not transparent)
        if (bgColor.includes('rgb(0, 0, 0)') || bgColor.includes('#000')) return true;
        if (background.includes('rgb(0, 0, 0)') || background.includes('#000')) return true;
        
        // Check for very dark colors (excluding transparent)
        const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([01](?:\.\d+)?))?\)/);
        if (rgbMatch) {
            const [, r, g, b, a] = rgbMatch.map(Number);
            // If alpha is 0 or very low, it's transparent, not black
            if (a !== undefined && a < 0.1) return false;
            return r < 50 && g < 50 && b < 50; // Very dark
        }
        
        return false;
    }

    detectLayoutIssues(analysis) {
        const issues = [];
        
        // Check for common scrollytelling layout problems
        if (analysis.elements.visuals.exists) {
            const visuals = analysis.elements.visuals;
            
            // Issue 1: Visuals container has dark background
            if (this.isBlackish(visuals.styling.backgroundColor, visuals.styling.background)) {
                issues.push({
                    type: 'DARK_BACKGROUND',
                    element: 'visuals',
                    severity: 'HIGH',
                    description: 'Scrolly visuals container has dark/black background',
                    solution: 'Set transparent background or match page color'
                });
            }
            
            // Issue 2: Canvas is smaller than container
            if (analysis.elements.canvas.exists) {
                const canvas = analysis.elements.canvas;
                if (canvas.dimensions.width < visuals.dimensions.width * 0.8 ||
                    canvas.dimensions.height < visuals.dimensions.height * 0.8) {
                    issues.push({
                        type: 'CANVAS_SIZE_MISMATCH',
                        element: 'canvas',
                        severity: 'MEDIUM',
                        description: 'Canvas is significantly smaller than its container',
                        solution: 'Ensure canvas fills the visuals container properly'
                    });
                }
            }
            
            // Issue 3: Multiple background layers creating black appearance
            const blackLayers = analysis.backgroundLayers.filter(layer => layer.isBlack);
            if (blackLayers.length > 0) {
                issues.push({
                    type: 'MULTIPLE_BLACK_LAYERS',
                    elements: blackLayers.map(l => l.element),
                    severity: 'HIGH',
                    description: `${blackLayers.length} elements have black/dark backgrounds`,
                    solution: 'Remove or make transparent the unnecessary dark backgrounds'
                });
            }
        }
        
        analysis.issues = issues;
    }

    displayLayoutAnalysis(analysis) {
        console.log('🔍 SCROLLYTELLING LAYOUT ANALYSIS');
        console.log('=====================================');
        
        // Display element analysis
        console.log('📋 Element Analysis:');
        Object.entries(analysis.elements).forEach(([name, data]) => {
            if (data.exists) {
                console.log(`  ${name}:`, {
                    dimensions: `${data.dimensions.width}x${data.dimensions.height}`,
                    position: data.styling.position,
                    zIndex: data.styling.zIndex,
                    opacity: data.styling.opacity,
                    background: data.styling.backgroundColor
                });
            } else {
                console.log(`  ${name}: NOT FOUND`);
            }
        });

        // Display background layers
        console.log('🎨 Background Layer Stack (top to bottom):');
        analysis.backgroundLayers.forEach((layer, index) => {
            const marker = layer.isBlack ? '🖤' : '🎨';
            console.log(`  ${index + 1}. ${marker} ${layer.element}`, {
                zIndex: layer.zIndex,
                backgroundColor: layer.backgroundColor,
                opacity: layer.opacity,
                isBlack: layer.isBlack
            });
        });

        // Display issues
        if (analysis.issues.length > 0) {
            console.log('⚠️ DETECTED ISSUES:');
            analysis.issues.forEach((issue, index) => {
                console.log(`  ${index + 1}. [${issue.severity}] ${issue.type}`);
                console.log(`     ${issue.description}`);
                console.log(`     💡 Solution: ${issue.solution}`);
            });
        } else {
            console.log('✅ No layout issues detected');
        }
    }

    createVisualOverlays() {
        // Create overlay to visualize layout boundaries
        const elements = {
            wrapper: document.querySelector('.scrolly-experience-wrapper'),
            visuals: document.querySelector('.scrolly-visuals'),
            text: document.querySelector('.scrolly-text'),
            canvas: document.querySelector('#threejs-canvas')
        };

        Object.entries(elements).forEach(([name, element]) => {
            if (element) {
                this.createElementOverlay(name, element);
            }
        });
    }

    createElementOverlay(name, element) {
        const overlay = document.createElement('div');
        overlay.id = `scrolly-debug-${name}`;
        overlay.style.cssText = `
            position: absolute;
            pointer-events: none;
            border: 2px solid ${this.getOverlayColor(name)};
            background: ${this.getOverlayColor(name)}20;
            z-index: 10000;
            display: none;
            font-family: monospace;
            font-size: 12px;
            color: ${this.getOverlayColor(name)};
            padding: 2px 5px;
        `;
        
        const rect = element.getBoundingClientRect();
        overlay.style.top = rect.top + 'px';
        overlay.style.left = rect.left + 'px';
        overlay.style.width = rect.width + 'px';
        overlay.style.height = rect.height + 'px';
        overlay.textContent = name.toUpperCase();
        
        document.body.appendChild(overlay);
        this.overlays.set(name, overlay);
    }

    getOverlayColor(name) {
        const colors = {
            wrapper: '#ff0000',
            visuals: '#00ff00', 
            text: '#0000ff',
            canvas: '#ffff00'
        };
        return colors[name] || '#ffffff';
    }

    addScrollytellingControls() {
        // Add to global quick fix functions
        window.scrollytellingDebug = {
            analyze: () => {
                const analysis = this.analyzeScrollytellingLayout();
                this.displayLayoutAnalysis(analysis);
                return analysis;
            },
            
            showOverlays: () => {
                this.overlays.forEach(overlay => {
                    overlay.style.display = 'block';
                });
                console.log('✅ Layout overlays shown');
            },
            
            hideOverlays: () => {
                this.overlays.forEach(overlay => {
                    overlay.style.display = 'none';
                });
                console.log('✅ Layout overlays hidden');
            },
            
            fixBlackBackground: () => {
                const visuals = document.querySelector('.scrolly-visuals');
                if (visuals) {
                    visuals.style.backgroundColor = 'transparent';
                    visuals.style.background = 'transparent';
                    console.log('✅ Set visuals container background to transparent');
                }
                
                const canvas = document.querySelector('#threejs-canvas');
                if (canvas) {
                    canvas.style.background = 'transparent';
                    canvas.style.backgroundColor = 'transparent';
                    console.log('✅ Set canvas background to transparent');
                }
            },
            
            setVisualsBackground: (color) => {
                const visuals = document.querySelector('.scrolly-visuals');
                if (visuals) {
                    visuals.style.backgroundColor = color;
                    console.log(`✅ Set visuals background to ${color}`);
                }
            },
            
            info: () => {
                console.log('🔍 Scrollytelling Debug Commands:');
                console.log('  scrollytellingDebug.analyze() - Full layout analysis');
                console.log('  scrollytellingDebug.showOverlays() - Show layout boundaries');
                console.log('  scrollytellingDebug.hideOverlays() - Hide overlays');
                console.log('  scrollytellingDebug.fixBlackBackground() - Remove black backgrounds');
                console.log('  scrollytellingDebug.setVisualsBackground(color) - Set specific color');
            }
        };
        
        console.log('🔧 Scrollytelling debug commands available: scrollytellingDebug.info()');
    }

    startLayoutMonitoring() {
        // Monitor for layout changes
        if (window.ResizeObserver) {
            const observer = new ResizeObserver(() => {
                this.updateOverlayPositions();
            });
            
            const visuals = document.querySelector('.scrolly-visuals');
            if (visuals) observer.observe(visuals);
        }
    }

    updateOverlayPositions() {
        this.overlays.forEach((overlay, name) => {
            const element = document.querySelector(`.scrolly-${name}`) || 
                           document.querySelector(`#threejs-canvas`);
            if (element && element.nodeType === Node.ELEMENT_NODE) {
                try {
                    const rect = element.getBoundingClientRect();
                    overlay.style.top = rect.top + 'px';
                    overlay.style.left = rect.left + 'px';
                    overlay.style.width = rect.width + 'px';
                    overlay.style.height = rect.height + 'px';
                } catch (error) {
                    console.warn(`Failed to update overlay position for ${name}:`, error);
                }
            }
        });
    }
}

// Auto-initialize if debug mode is enabled
if (window.debugController?.isEnabled) {
    // Wait for DOM to be ready and elements to exist
    const initScrollytellingDebugger = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initScrollytellingDebugger);
            return;
        }
        
        // Additional wait to ensure scrollytelling elements are available
        setTimeout(() => {
            try {
                window.scrollytellingDebugger = new ScrollytellingDebugger();
            } catch (error) {
                console.warn('Failed to initialize scrollytelling debugger:', error);
            }
        }, 100);
    };
    
    initScrollytellingDebugger();
}

export { ScrollytellingDebugger };
export default ScrollytellingDebugger;
