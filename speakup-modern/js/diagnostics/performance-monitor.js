// /js/diagnostics/performance-monitor.js - Real-time Performance Analysis

/**
 * Professional Performance Monitor
 * Tracks FPS, memory usage, render times, and bottlenecks
 */
class PerformanceMonitor {
    constructor() {
        this.isEnabled = window.debugController?.isEnabled || false;
        this.metrics = {
            fps: [],
            frameTime: [],
            memory: [],
            renderTime: [],
            drawCalls: [],
            triangles: []
        };
        
        this.thresholds = {
            fps: 30,           // Below 30 FPS is concerning
            frameTime: 16.67,  // Above 16.67ms (60fps) is slow
            memory: 100,       // Above 100MB is worth monitoring
            renderTime: 10     // Above 10ms render time is slow
        };
        
        this.alerts = [];
        this.startTime = performance.now();
        
        if (this.isEnabled) {
            this.initialize();
        }
    }

    initialize() {
        this.setupFrameMonitoring();
        this.setupMemoryMonitoring();
        this.setupRenderMonitoring();
        this.createPerformanceOverlay();
        console.log('📊 Performance Monitor initialized');
    }

    setupFrameMonitoring() {
        let frames = 0;
        let lastTime = performance.now();
        let lastFrameTime = lastTime;
        
        const updateFPS = () => {
            const now = performance.now();
            const frameTime = now - lastFrameTime;
            lastFrameTime = now;
            
            frames++;
            
            // Calculate FPS every second
            if (now - lastTime >= 1000) {
                const fps = Math.round((frames * 1000) / (now - lastTime));
                this.recordMetric('fps', fps);
                
                if (fps < this.thresholds.fps) {
                    this.addAlert('low-fps', `Low FPS detected: ${fps}`, 'warning');
                }
                
                frames = 0;
                lastTime = now;
            }
            
            // Record frame time
            this.recordMetric('frameTime', frameTime);
            
            if (frameTime > this.thresholds.frameTime) {
                this.addAlert('slow-frame', `Slow frame: ${frameTime.toFixed(2)}ms`, 'warning');
            }
            
            requestAnimationFrame(updateFPS);
        };
        
        requestAnimationFrame(updateFPS);
    }

    setupMemoryMonitoring() {
        if (!performance.memory) {
            console.warn('Performance.memory not available - memory monitoring disabled');
            return;
        }
        
        setInterval(() => {
            const memoryMB = performance.memory.usedJSHeapSize / 1024 / 1024;
            this.recordMetric('memory', memoryMB);
            
            if (memoryMB > this.thresholds.memory) {
                this.addAlert('high-memory', `High memory usage: ${memoryMB.toFixed(1)}MB`, 'warning');
            }
            
            // Check for memory leaks (continuous growth)
            if (this.metrics.memory.length > 60) { // 5 minutes of data
                const recent = this.metrics.memory.slice(-12); // Last minute
                const older = this.metrics.memory.slice(-24, -12); // Previous minute
                const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
                const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
                
                if (recentAvg > olderAvg * 1.1) { // 10% increase
                    this.addAlert('memory-leak', 'Potential memory leak detected', 'error');
                }
            }
        }, 5000);
    }

    setupRenderMonitoring() {
        // Hook into renderer if available
        this.monitorRenderCalls();
    }

    monitorRenderCalls() {
        // Monitor THREE.js renderer if available
        const checkRenderer = () => {
            if (window.scene3D?.renderer) {
                const info = window.scene3D.renderer.info;
                if (info && info.render) {
                    this.recordMetric('drawCalls', info.render.calls);
                    this.recordMetric('triangles', info.render.triangles);
                    
                    // Reset info for next frame
                    info.reset();
                }
            }
            setTimeout(checkRenderer, 1000);
        };
        
        setTimeout(checkRenderer, 1000);
    }

    recordMetric(type, value) {
        if (!this.metrics[type]) {
            this.metrics[type] = [];
        }
        
        this.metrics[type].push({
            value,
            timestamp: performance.now()
        });
        
        // Keep only last 300 entries (5 minutes at 1fps)
        if (this.metrics[type].length > 300) {
            this.metrics[type] = this.metrics[type].slice(-300);
        }
        
        // Update overlay if visible
        this.updateOverlay();
    }

    addAlert(type, message, severity = 'info') {
        const alert = {
            type,
            message,
            severity,
            timestamp: performance.now(),
            count: 1
        };
        
        // Check if we already have this alert type recently
        const existing = this.alerts.find(a => 
            a.type === type && 
            performance.now() - a.timestamp < 30000 // Within 30 seconds
        );
        
        if (existing) {
            existing.count++;
            existing.timestamp = performance.now();
        } else {
            this.alerts.push(alert);
            
            // Log to debug controller
            window.debugController?.[severity]?.(message, 'performance');
        }
        
        // Keep only last 100 alerts
        if (this.alerts.length > 100) {
            this.alerts = this.alerts.slice(-100);
        }
    }

    createPerformanceOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'performance-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 80px;
            left: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: #00ff00;
            font-family: monospace;
            font-size: 11px;
            padding: 10px;
            border-radius: 5px;
            z-index: 9998;
            display: none;
            min-width: 200px;
            line-height: 1.4;
        `;
        document.body.appendChild(overlay);
        
        this.overlay = overlay;
    }

    updateOverlay() {
        if (!this.overlay || this.overlay.style.display === 'none') return;
        
        const stats = this.getCurrentStats();
        this.overlay.innerHTML = `
            <div><strong>PERFORMANCE MONITOR</strong></div>
            <div>FPS: ${stats.fps.current} (avg: ${stats.fps.average})</div>
            <div>Frame: ${stats.frameTime.current}ms (avg: ${stats.frameTime.average}ms)</div>
            <div>Memory: ${stats.memory.current}MB (max: ${stats.memory.max}MB)</div>
            <div>Draws: ${stats.drawCalls.current} (avg: ${stats.drawCalls.average})</div>
            <div>Triangles: ${stats.triangles.current}k</div>
            <div>---</div>
            <div>Uptime: ${stats.uptime}</div>
            <div>Alerts: ${this.alerts.length}</div>
            ${this.getRecentAlerts().map(alert => 
                `<div style="color: ${this.getAlertColor(alert.severity)};">
                    ${alert.message} ${alert.count > 1 ? `(${alert.count}x)` : ''}
                </div>`
            ).join('')}
        `;
    }

    getCurrentStats() {
        const now = performance.now();
        
        return {
            fps: {
                current: this.getLatestValue('fps') || 0,
                average: this.getAverage('fps', 30) || 0
            },
            frameTime: {
                current: (this.getLatestValue('frameTime') || 0).toFixed(1),
                average: (this.getAverage('frameTime', 30) || 0).toFixed(1)
            },
            memory: {
                current: (this.getLatestValue('memory') || 0).toFixed(1),
                max: this.getMaxValue('memory').toFixed(1)
            },
            drawCalls: {
                current: this.getLatestValue('drawCalls') || 0,
                average: Math.round(this.getAverage('drawCalls', 10) || 0)
            },
            triangles: {
                current: Math.round((this.getLatestValue('triangles') || 0) / 1000)
            },
            uptime: this.formatUptime(now - this.startTime)
        };
    }

    getLatestValue(metric) {
        const data = this.metrics[metric];
        return data && data.length > 0 ? data[data.length - 1].value : 0;
    }

    getAverage(metric, count = 10) {
        const data = this.metrics[metric];
        if (!data || data.length === 0) return 0;
        
        const recent = data.slice(-count);
        return recent.reduce((sum, item) => sum + item.value, 0) / recent.length;
    }

    getMaxValue(metric) {
        const data = this.metrics[metric];
        if (!data || data.length === 0) return 0;
        
        return Math.max(...data.map(item => item.value));
    }

    getRecentAlerts() {
        return this.alerts
            .filter(alert => performance.now() - alert.timestamp < 10000) // Last 10 seconds
            .slice(-3); // Max 3 alerts
    }

    getAlertColor(severity) {
        const colors = {
            info: '#00ffff',
            warning: '#ffff00',
            error: '#ff0000'
        };
        return colors[severity] || colors.info;
    }

    formatUptime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    toggleOverlay() {
        if (!this.overlay) return;
        
        const isVisible = this.overlay.style.display !== 'none';
        this.overlay.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            this.updateOverlay();
        }
        
        window.debugController?.info(`Performance overlay ${isVisible ? 'hidden' : 'shown'}`, 'performance');
    }

    getReport() {
        const stats = this.getCurrentStats();
        const report = {
            summary: stats,
            metrics: {
                fps: {
                    min: Math.min(...this.metrics.fps.map(f => f.value)),
                    max: Math.max(...this.metrics.fps.map(f => f.value)),
                    average: this.getAverage('fps', this.metrics.fps.length)
                },
                memory: {
                    min: Math.min(...this.metrics.memory.map(m => m.value)),
                    max: Math.max(...this.metrics.memory.map(m => m.value)),
                    average: this.getAverage('memory', this.metrics.memory.length)
                }
            },
            alerts: this.alerts.slice(-10),
            recommendations: this.generateRecommendations()
        };
        
        console.log('📊 Performance Report:', report);
        return report;
    }

    generateRecommendations() {
        const recommendations = [];
        
        // Check FPS
        const avgFPS = this.getAverage('fps', 60);
        if (avgFPS < 30) {
            recommendations.push('Consider reducing visual quality or optimizing animations for better FPS');
        }
        
        // Check memory
        const maxMemory = this.getMaxValue('memory');
        if (maxMemory > 150) {
            recommendations.push('High memory usage detected - check for memory leaks');
        }
        
        // Check draw calls
        const avgDrawCalls = this.getAverage('drawCalls', 30);
        if (avgDrawCalls > 100) {
            recommendations.push('High draw call count - consider mesh instancing or batching');
        }
        
        return recommendations;
    }

    // Static method to create global instance
    static initialize() {
        if (!window.performanceMonitor) {
            window.performanceMonitor = new PerformanceMonitor();
        }
        return window.performanceMonitor;
    }
}

// Auto-initialize if debug mode is enabled
if (window.debugController?.isEnabled) {
    window.performanceMonitor = PerformanceMonitor.initialize();
}

export { PerformanceMonitor };
export default PerformanceMonitor;
