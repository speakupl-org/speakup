// Mobile Device Detection and Optimization Utilities
// Preparing for Edge deployment with device-specific optimizations

class MobileOptimizer {
    constructor() {
        this.deviceInfo = this.detectDevice();
        this.viewportInfo = this.getViewportInfo();
        this.touchCapabilities = this.detectTouchCapabilities();
        
        this.init();
    }

    init() {
        this.applyMobileOptimizations();
        this.setupViewportHandling();
        this.optimizePerformance();
        this.setupPWAReadiness();
    }

    detectDevice() {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        
        return {
            isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
            isTablet: /iPad|Android(?=.*\\bMobile\\b)|Windows NT.*touch/i.test(userAgent),
            isIOS: /iPad|iPhone|iPod/.test(userAgent),
            isAndroid: /Android/i.test(userAgent),
            isSafari: /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent),
            isChrome: /Chrome/i.test(userAgent),
            screenSize: {
                width: screen.width,
                height: screen.height,
                ratio: window.devicePixelRatio || 1
            },
            platform: platform
        };
    }

    getViewportInfo() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            orientation: screen.orientation?.type || 'unknown',
            isPortrait: window.innerHeight > window.innerWidth,
            isLandscape: window.innerWidth > window.innerHeight
        };
    }

    detectTouchCapabilities() {
        return {
            hasTouch: 'ontouchstart' in window,
            hasPointer: 'onpointerdown' in window,
            maxTouchPoints: navigator.maxTouchPoints || 0,
            hasHover: window.matchMedia('(hover: hover)').matches
        };
    }

    applyMobileOptimizations() {
        const body = document.body;
        
        // Add device classes for CSS targeting
        if (this.deviceInfo.isMobile) {
            body.classList.add('device-mobile');
        }
        
        if (this.deviceInfo.isTablet) {
            body.classList.add('device-tablet');
        }
        
        if (this.deviceInfo.isIOS) {
            body.classList.add('device-ios');
            this.applyIOSOptimizations();
        }
        
        if (this.deviceInfo.isAndroid) {
            body.classList.add('device-android');
            this.applyAndroidOptimizations();
        }
        
        if (!this.touchCapabilities.hasHover) {
            body.classList.add('no-hover');
        }
        
        // Apply viewport-specific optimizations
        this.updateViewportClasses();
    }

    applyIOSOptimizations() {
        // iOS-specific optimizations
        document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
        
        // Handle iOS Safari viewport issues
        const updateIOSViewport = () => {
            document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
        };
        
        window.addEventListener('resize', updateIOSViewport);
        window.addEventListener('orientationchange', () => {
            setTimeout(updateIOSViewport, 500);
        });
    }

    applyAndroidOptimizations() {
        // Android-specific optimizations
        // Handle Android Chrome address bar
        const updateAndroidViewport = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        updateAndroidViewport();
        window.addEventListener('resize', updateAndroidViewport);
    }

    updateViewportClasses() {
        const body = document.body;
        
        // Remove old viewport classes
        body.classList.remove('viewport-portrait', 'viewport-landscape', 'viewport-small', 'viewport-medium', 'viewport-large');
        
        // Add current viewport classes
        if (this.viewportInfo.isPortrait) {
            body.classList.add('viewport-portrait');
        } else {
            body.classList.add('viewport-landscape');
        }
        
        // Add size classes
        if (this.viewportInfo.width < 480) {
            body.classList.add('viewport-small');
        } else if (this.viewportInfo.width < 768) {
            body.classList.add('viewport-medium');
        } else {
            body.classList.add('viewport-large');
        }
    }

    setupViewportHandling() {
        // Handle viewport changes
        window.addEventListener('resize', () => {
            this.viewportInfo = this.getViewportInfo();
            this.updateViewportClasses();
        });
        
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.viewportInfo = this.getViewportInfo();
                this.updateViewportClasses();
            }, 100);
        });
    }

    optimizePerformance() {
        // Mobile performance optimizations
        if (this.deviceInfo.isMobile) {
            // Reduce animation complexity on mobile
            document.documentElement.style.setProperty('--mobile-transition-duration', '0.2s');
            
            // Optimize scroll performance
            document.addEventListener('touchstart', () => {}, { passive: true });
            document.addEventListener('touchmove', () => {}, { passive: true });
            
            // Lazy load non-critical resources
            this.setupLazyLoading();
        }
    }

    setupLazyLoading() {
        // Intersection Observer for lazy loading
        const lazyElements = document.querySelectorAll('[data-lazy]');
        
        if (lazyElements.length > 0 && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        element.classList.add('lazy-loaded');
                        observer.unobserve(element);
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            lazyElements.forEach(element => observer.observe(element));
        }
    }

    setupPWAReadiness() {
        // Prepare for PWA installation prompts
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            
            // Store the event for later use
            window.deferredPrompt = e;
            
            // Show install button if needed
            const installButton = document.querySelector('#pwa-install-button');
            if (installButton) {
                installButton.style.display = 'block';
                installButton.addEventListener('click', () => {
                    window.deferredPrompt.prompt();
                });
            }
        });
    }

    // Public methods for external use
    isMobileDevice() {
        return this.deviceInfo.isMobile;
    }

    getDeviceInfo() {
        return {
            ...this.deviceInfo,
            viewport: this.viewportInfo,
            touch: this.touchCapabilities
        };
    }

    // Method to be used in Edge deployment
    getEdgeOptimizationData() {
        return {
            deviceType: this.deviceInfo.isMobile ? 'mobile' : 'desktop',
            platform: this.deviceInfo.platform,
            viewport: this.viewportInfo,
            capabilities: this.touchCapabilities,
            timestamp: Date.now()
        };
    }
}

// Initialize mobile optimizer
const mobileOptimizer = new MobileOptimizer();

// Make available globally for debugging and edge deployment
window.mobileOptimizer = mobileOptimizer;

// Log device info only in debug mode
if (window.debug && window.debug.enabled) {
    window.debug.log('APP', 'MOBILE', 'READY', mobileOptimizer.getDeviceInfo());
}

export { MobileOptimizer };
