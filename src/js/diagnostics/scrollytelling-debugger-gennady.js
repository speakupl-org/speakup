/* GENNADY-PHILOSOPHY COMPLIANT
 * Scrollytelling Layout Debugger - Advanced diagnostics for scrollytelling elements
 * Uses global THREE.js if needed for 3D-related debugging
 */

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
        if (window.debug && window.debug.enabled) {
            window.debug.log('DEBUG', 'SCROLLYTELLING', 'INITIALIZED');
        }
        this.createScrollytellingAnalysis();
        this.addScrollytellingControls();
    }

    createScrollytellingAnalysis() {
        // Create detailed layout analysis
        const analysis = this.analyzeScrollytellingLayout();
        this.displayLayoutAnalysis(analysis);
    }

    analyzeScrollytellingLayout() {
        const analysis = {
            elements: {},
            backgroundLayers: [],
            issues: []
        };
        
        // Target elements to analyze
        const elementSelectors = {
            wrapper: '.scrolly-experience-wrapper',
            visuals: '.scrolly-visuals',
            text: '.scrolly-text',
            canvas: 'canvas',
            placeholder: '.scrolly-placeholder',
            sections: '.scrolly-section'
        };
        
        // Get element data
        Object.entries(elementSelectors).forEach(([name, selector]) => {
            const element = document.querySelector(selector);
            
            // Basic element analysis
            if (element) {
                try {
                    const styles = window.getComputedStyle(element);
                    const rect = element.getBoundingClientRect();
                    
                    analysis.elements[name] = {
                        exists: true,
                        element: element,
                        dimensions: {
                            width: rect.width,
                            height: rect.height
                        },
                        styling: {
                            position: styles.position,
                            zIndex: styles.zIndex,
                            opacity: styles.opacity,
                            backgroundColor: styles.backgroundColor
                        }
                    };
                    
                    // Background analysis for stacking context
                    try {
                        if (styles.position !== 'static' || styles.zIndex !== 'auto') {
                            analysis.backgroundLayers.push({
                                element: name,
                                zIndex: styles.zIndex,
                                backgroundColor: styles.backgroundColor,
                                opacity: styles.opacity,
                                isBlack: this.isBlackOrDark(styles.backgroundColor)
                            });
                        }
                    } catch (error) {
                        if (window.debug && window.debug.enabled) {
                            window.debug.warn('DEBUG.SCROLLYTELLING', 'BACKGROUND', `FAILED [Element: ${name}, Error: ${error.message}]`);
                        }
                    }
                } catch (error) {
                    if (window.debug && window.debug.enabled) {
                        window.debug.warn('DEBUG.SCROLLYTELLING', 'ELEMENT', `FAILED [Element: ${name}, Error: ${error.message}]`);
                    }
                }
            } else {
                analysis.elements[name] = {
                    exists: false
                };
            }
        });
        
        // Sort background layers by z-index
        analysis.backgroundLayers.sort((a, b) => {
            const zIndexA = parseInt(a.zIndex) || 0;
            const zIndexB = parseInt(b.zIndex) || 0;
            return zIndexB - zIndexA; // Descending order (top to bottom)
        });
        
        // Identify issues
        const issues = [];
        
        // Check for stacking context issues
        const visuals = analysis.elements.visuals;
        const canvas = analysis.elements.canvas;
        
        if (visuals?.exists && canvas?.exists) {
            if (visuals.styling.position !== 'sticky') {
                issues.push({
                    type: 'Stacking Context Issue',
                    severity: 'HIGH',
                    description: 'Visuals container should be position:sticky for proper scrollytelling',
                    solution: 'Change visuals container to position:sticky'
                });
            }
            
            if (canvas.styling.opacity === '0') {
                issues.push({
                    type: 'Canvas Visibility',
                    severity: 'HIGH',
                    description: 'Canvas is completely transparent (opacity=0)',
                    solution: 'Set canvas opacity to 1 or remove opacity:0 style'
                });
            }
        }
        
        // Check for background overrides
        const blackLayers = analysis.backgroundLayers.filter(layer => layer.isBlack);
        if (blackLayers.length > 0) {
            issues.push({
                type: 'Background Interference',
                severity: 'HIGH',
                description: `${blackLayers.length} elements have black/dark backgrounds`,
                solution: 'Remove or make transparent the unnecessary dark backgrounds'
            });
        }
        
        analysis.issues = issues;
        return analysis;
    }

    displayLayoutAnalysis(analysis) {
        if (window.debug && window.debug.enabled) {
            window.debug.groupCollapsed('DEBUG.SCROLLYTELLING.ANALYSIS');
        } else {
            console.groupCollapsed('DEBUG.SCROLLYTELLING.ANALYSIS');
        }
        
        // Display element analysis
        if (window.debug && window.debug.enabled) {
            window.debug.group('DEBUG.SCROLLYTELLING.ELEMENTS');
        } else {
            console.group('DEBUG.SCROLLYTELLING.ELEMENTS');
        }
        
        Object.entries(analysis.elements).forEach(([name, data]) => {
            if (data.exists) {
                if (window.debug && window.debug.enabled) {
                    window.debug.log('ELEMENT', name, `FOUND [${data.dimensions.width}x${data.dimensions.height}, z:${data.styling.zIndex}, opacity:${data.styling.opacity}]`);
                } else {
                    console.log(`DEBUG.SCROLLYTELLING.ELEMENT.${name}: FOUND [${data.dimensions.width}x${data.dimensions.height}, z:${data.styling.zIndex}]`);
                }
            } else {
                if (window.debug && window.debug.enabled) {
                    window.debug.warn('ELEMENT', name, 'MISSING');
                } else {
                    console.warn(`DEBUG.SCROLLYTELLING.ELEMENT.${name}: MISSING`);
                }
            }
        });

        if (window.debug && window.debug.enabled) {
            window.debug.groupEnd();
        } else {
            console.groupEnd();
        }
        
        // Background layer stack analysis
        if (window.debug && window.debug.enabled) {
            window.debug.group('DEBUG.SCROLLYTELLING.BACKGROUNDS');
        } else {
            console.group('DEBUG.SCROLLYTELLING.BACKGROUNDS');
        }
        
        analysis.backgroundLayers.forEach((layer, index) => {
            if (window.debug && window.debug.enabled) {
                window.debug.log('LAYER', `${index + 1}`, 
                    `${layer.element} [z:${layer.zIndex}, opacity:${layer.opacity}, dark:${layer.isBlack}]`);
            } else {
                console.log(`DEBUG.SCROLLYTELLING.LAYER.${index + 1}: ${layer.element} [z:${layer.zIndex}, opacity:${layer.opacity}]`);
            }
        });
        
        if (window.debug && window.debug.enabled) {
            window.debug.groupEnd();
        } else {
            console.groupEnd();
        }
        
        // Display issues
        if (analysis.issues && analysis.issues.length > 0) {
            if (window.debug && window.debug.enabled) {
                window.debug.group('DEBUG.SCROLLYTELLING.ISSUES');
            } else {
                console.group('DEBUG.SCROLLYTELLING.ISSUES');
            }
            
            analysis.issues.forEach((issue, index) => {
                if (window.debug && window.debug.enabled) {
                    window.debug.warn('ISSUE', `${issue.type}`, `SEVERITY: ${issue.severity}, Solution: ${issue.solution}`);
                } else {
                    console.warn(`DEBUG.SCROLLYTELLING.ISSUE.${index + 1}: ${issue.type} [${issue.severity}] - ${issue.description}`);
                }
            });
            
            if (window.debug && window.debug.enabled) {
                window.debug.groupEnd();
            } else {
                console.groupEnd();
            }
        } else {
            if (window.debug && window.debug.enabled) {
                window.debug.log('DEBUG.SCROLLYTELLING', 'VALIDATION', 'PASS [No layout issues detected]');
            } else {
                console.log('DEBUG.SCROLLYTELLING.VALIDATION: PASS [No layout issues]');
            }
        }
        
        if (window.debug && window.debug.enabled) {
            window.debug.groupEnd(); // Close the main analysis group
        } else {
            console.groupEnd(); // Close the main analysis group
        }
    }

    isBlackOrDark(color) {
        if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
            return false;
        }
        
        // Simple check for black or very dark colors
        return color.includes('rgb(0, 0, 0)') || 
               color.includes('rgba(0, 0, 0') || 
               color.includes('#000') ||
               color.includes('black');
    }

    addScrollytellingControls() {
        // Add controls for visibility toggles and fixes
        window.scrollytellingDebug = {
            showOverlays: () => {
                this.createVisualOverlays();
                if (window.debug && window.debug.enabled) {
                    window.debug.log('DEBUG.SCROLLYTELLING', 'OVERLAYS', 'VISIBLE');
                }
                return 'Layout overlays shown';
            },
            
            hideOverlays: () => {
                this.removeVisualOverlays();
                if (window.debug && window.debug.enabled) {
                    window.debug.log('DEBUG.SCROLLYTELLING', 'OVERLAYS', 'HIDDEN');
                }
                return 'Layout overlays hidden';
            },
            
            fixTransparentBackground: () => {
                const visuals = document.querySelector('.scrolly-visuals');
                if (visuals) {
                    visuals.style.backgroundColor = 'transparent';
                    if (window.debug && window.debug.enabled) {
                        window.debug.log('DEBUG.SCROLLYTELLING', 'BACKGROUND', 'TRANSPARENT [Visuals container]');
                    }
                    return 'Visuals container background set to transparent';
                }
                return 'Could not find visuals container';
            },
            
            fixCanvasBackground: () => {
                const canvas = document.querySelector('canvas');
                if (canvas) {
                    canvas.style.backgroundColor = 'transparent';
                    if (window.debug && window.debug.enabled) {
                        window.debug.log('DEBUG.SCROLLYTELLING', 'BACKGROUND', 'TRANSPARENT [Canvas]');
                    }
                    return 'Canvas background set to transparent';
                }
                return 'Could not find canvas element';
            },
            
            setBackground: (color) => {
                const visuals = document.querySelector('.scrolly-visuals');
                if (visuals) {
                    visuals.style.backgroundColor = color;
                    if (window.debug && window.debug.enabled) {
                        window.debug.log('DEBUG.SCROLLYTELLING', 'BACKGROUND', `${color} [Visuals container]`);
                    }
                    return `Visuals background set to ${color}`;
                }
                return 'Could not find visuals container';
            },
            
            info: () => {
                if (window.debug && window.debug.enabled) {
                    window.debug.group('DEBUG.SCROLLYTELLING.COMMANDS');
                    window.debug.log('COMMAND', 'showOverlays', 'Show visual overlays for layout analysis');
                    window.debug.log('COMMAND', 'hideOverlays', 'Hide visual overlays');
                    window.debug.log('COMMAND', 'fixTransparentBackground', 'Make visuals container transparent');
                    window.debug.log('COMMAND', 'fixCanvasBackground', 'Make canvas background transparent');
                    window.debug.log('COMMAND', 'setBackground', 'Set background color of visuals container');
                    window.debug.groupEnd();
                }
                
                return {
                    commands: [
                        'scrollytellingDebug.showOverlays() - Show layout visualization',
                        'scrollytellingDebug.hideOverlays() - Hide layout visualization',
                        'scrollytellingDebug.fixTransparentBackground() - Make visuals background transparent',
                        'scrollytellingDebug.fixCanvasBackground() - Make canvas background transparent',
                        'scrollytellingDebug.setBackground("#112024") - Set specific background color'
                    ]
                };
            }
        };
    }

    createVisualOverlays() {
        // Implementation of creating visual overlays for debugging
        // This would highlight different areas with colored borders
    }
    
    removeVisualOverlays() {
        // Implementation of removing visual overlays
    }
}

// Export for ES modules
export { ScrollytellingDebugger };

// Initialize debugger only if not imported as module
if (typeof window !== 'undefined' && !window.scrollytellingDebug) {
    window.scrollytellingDebug = new ScrollytellingDebugger();
}
