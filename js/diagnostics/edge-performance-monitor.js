// Performance Monitor - Edge-Ready Foundation
class EdgePerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            renderTime: 0,
            interactionTime: 0,
            resourceSizes: {},
            errorCount: 0
        };
        
        this.initializeMonitoring();
    }

    initializeMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            this.captureLoadMetrics();
        });

        // Monitor interactions
        this.setupInteractionMonitoring();
        
        // Monitor errors
        this.setupErrorTracking();
        
        // Monitor resource loading
        this.setupResourceMonitoring();
    }

    captureLoadMetrics() {
        const perfData = performance.getEntriesByType('navigation')[0];
        
        this.metrics.loadTime = perfData.loadEventEnd - perfData.loadEventStart;
        this.metrics.renderTime = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
        
        console.log('📊 Load Performance:', {
            loadTime: `${this.metrics.loadTime}ms`,
            renderTime: `${this.metrics.renderTime}ms`,
            totalTime: `${perfData.loadEventEnd - perfData.fetchStart}ms`
        });
    }

    setupInteractionMonitoring() {
        // Monitor CTA button clicks
        document.querySelectorAll('.cta-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const startTime = performance.now();
                setTimeout(() => {
                    const interactionTime = performance.now() - startTime;
                    this.metrics.interactionTime = interactionTime;
                    console.log('🎯 CTA Interaction:', {
                        button: e.target.textContent.trim(),
                        responseTime: `${interactionTime}ms`
                    });
                }, 0);
            });
        });
    }

    setupErrorTracking() {
        window.addEventListener('error', (e) => {
            this.metrics.errorCount++;
            console.error('🚨 Runtime Error:', {
                message: e.message,
                filename: e.filename,
                line: e.lineno,
                count: this.metrics.errorCount
            });
        });

        // Promise rejection tracking
        window.addEventListener('unhandledrejection', (e) => {
            this.metrics.errorCount++;
            console.error('🚨 Unhandled Promise Rejection:', e.reason);
        });
    }

    setupResourceMonitoring() {
        // Monitor resource loading
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'resource') {
                    this.metrics.resourceSizes[entry.name] = {
                        size: entry.transferSize,
                        duration: entry.duration
                    };
                }
            });
        });
        
        observer.observe({entryTypes: ['resource']});
    }

    // Method to prepare for Edge deployment
    getEdgeMetrics() {
        return {
            performance: this.metrics,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    }

    // Send metrics to Edge analytics (future implementation)
    async sendToEdge() {
        const metrics = this.getEdgeMetrics();
        
        // This will be implemented when we move to Cloudflare
        console.log('📈 Edge Metrics Ready:', metrics);
        
        // Future: Send to Cloudflare Analytics
        // await fetch('/api/analytics', {
        //     method: 'POST',
        //     body: JSON.stringify(metrics)
        // });
    }
}

// Initialize performance monitoring
const performanceMonitor = new EdgePerformanceMonitor();

// Make available globally for debugging
window.performanceMonitor = performanceMonitor;

export { EdgePerformanceMonitor };
