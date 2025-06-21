#!/usr/bin/env node

/**
 * Asset Optimizer - Phase 3
 * Optimizes CSS, JavaScript, and images for production
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AssetOptimizer {
    constructor(options = {}) {
        this.inputDir = options.inputDir || '.';
        this.outputDir = options.outputDir || 'dist';
        this.optimizations = {
            minifyCSS: true,
            minifyJS: true,
            optimizeImages: true,
            bundleAssets: true,
            inlineCriticalCSS: true
        };
    }

    /**
     * Minify CSS content
     */
    minifyCSS(css) {
        return css
            // Remove comments
            .replace(/\/\*[\s\S]*?\*\//g, '')
            // Remove unnecessary whitespace
            .replace(/\s+/g, ' ')
            // Remove whitespace around special characters
            .replace(/\s*([{}:;,>+~])\s*/g, '$1')
            // Remove trailing semicolons
            .replace(/;}/g, '}')
            // Remove empty rules
            .replace(/[^{}]+{\s*}/g, '')
            .trim();
    }

    /**
     * Minify JavaScript content (basic minification)
     */
    minifyJS(js) {
        return js
            // Remove single-line comments (but preserve URLs)
            .replace(/(?:^|\s)\/\/(?![\/\*]).*$/gm, '')
            // Remove multi-line comments
            .replace(/\/\*[\s\S]*?\*\//g, '')
            // Remove unnecessary whitespace
            .replace(/\s+/g, ' ')
            // Remove whitespace around operators and punctuation
            .replace(/\s*([{}();,=+\-*\/])\s*/g, '$1')
            .trim();
    }

    /**
     * Extract critical CSS from homepage
     */
    extractCriticalCSS() {
        console.log('🎨 Extracting critical CSS...');
        
        // Critical CSS selectors for above-the-fold content
        const criticalSelectors = [
            // Reset and base
            'html', 'body', '*',
            // Header
            '.site-header-pill', '.logo-area', '.logo-icon', '.logo-text', '.up',
            // Hero section
            '.hero-section', '.hero-content', '.hero-title', '.hero-subtitle', '.hero-description',
            '.hero-cta-area', '.cta-button', '.secondary-button',
            // Container and layout
            '.container', '.section',
            // Typography
            'h1', 'h2', 'h3', 'p', 'a',
            // Buttons
            '.cta-button', '.secondary-button'
        ];

        let criticalCSS = '';
        const cssFiles = [
            'css/base/reset.css',
            'css/base/variables.css', 
            'css/base/typography.css',
            'css/base/layout.css',
            'css/components/buttons.css',
            'css/components/header.css',
            'css/components/homepage.css'
        ];

        cssFiles.forEach(cssFile => {
            const filePath = path.join(this.inputDir, cssFile);
            if (fs.existsSync(filePath)) {
                const css = fs.readFileSync(filePath, 'utf8');
                // Extract rules that match critical selectors
                const rules = css.match(/[^{}]+\{[^{}]*\}/g) || [];
                
                rules.forEach(rule => {
                    const selector = rule.split('{')[0].trim();
                    if (criticalSelectors.some(critical => 
                        selector.includes(critical) || 
                        critical.includes(selector.split(' ')[0])
                    )) {
                        criticalCSS += rule + '\n';
                    }
                });
            }
        });

        return this.minifyCSS(criticalCSS);
    }

    /**
     * Bundle CSS files
     */
    bundleCSS() {
        console.log('📦 Bundling CSS files...');
        
        const cssFiles = [
            'css/base/reset.css',
            'css/base/variables.css',
            'css/base/typography.css', 
            'css/base/layout.css',
            'css/base/utilities.css',
            'css/components/buttons.css',
            'css/components/header.css',
            'css/components/fullscreen-menu.css',
            'css/components/footer.css',
            'css/components/scrollytelling.css',
            'css/components/homepage.css',
            'css/components/story-page.css',
            'css/components/contact-page.css',
            'css/components/resources-page.css',
            'css/components/card.css'
        ];

        let bundledCSS = '';
        
        cssFiles.forEach(cssFile => {
            const filePath = path.join(this.inputDir, cssFile);
            if (fs.existsSync(filePath)) {
                const css = fs.readFileSync(filePath, 'utf8');
                bundledCSS += `/* ${cssFile} */\n${css}\n\n`;
            }
        });

        const minifiedCSS = this.minifyCSS(bundledCSS);
        
        // Write bundled CSS
        const outputPath = path.join(this.outputDir, 'css', 'bundle.min.css');
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, minifiedCSS, 'utf8');
        
        console.log(`✅ CSS bundle created: ${outputPath}`);
        console.log(`📊 Original size: ${bundledCSS.length} bytes`);
        console.log(`📊 Minified size: ${minifiedCSS.length} bytes`);
        console.log(`📈 Compression: ${((bundledCSS.length - minifiedCSS.length) / bundledCSS.length * 100).toFixed(1)}%`);
        
        return minifiedCSS;
    }

    /**
     * Bundle JavaScript files
     */
    bundleJS() {
        console.log('📦 Bundling JavaScript files...');
        
        const jsFiles = [
            'js/global.js',
            'js/content/content-loader.js',
            'js/components/base/card.js',
            'js/components/mobile/card-mobile-enhanced.js',
            'js/modules/mobile-optimizer.js'
        ];

        let bundledJS = '';
        
        jsFiles.forEach(jsFile => {
            const filePath = path.join(this.inputDir, jsFile);
            if (fs.existsSync(filePath)) {
                const js = fs.readFileSync(filePath, 'utf8');
                bundledJS += `/* ${jsFile} */\n${js}\n\n`;
            }
        });

        const minifiedJS = this.minifyJS(bundledJS);
        
        // Write bundled JS
        const outputPath = path.join(this.outputDir, 'js', 'bundle.min.js');
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, minifiedJS, 'utf8');
        
        console.log(`✅ JS bundle created: ${outputPath}`);
        console.log(`📊 Original size: ${bundledJS.length} bytes`);
        console.log(`📊 Minified size: ${minifiedJS.length} bytes`);
        console.log(`📈 Compression: ${((bundledJS.length - minifiedJS.length) / bundledJS.length * 100).toFixed(1)}%`);
        
        return minifiedJS;
    }

    /**
     * Generate service worker for PWA
     */
    generateServiceWorker() {
        console.log('🔧 Generating service worker...');
        
        const sw = `
// Service Worker - Phase 3
// Version: ${Date.now()}

const CACHE_NAME = 'speakup-v1';
const STATIC_CACHE = 'speakup-static-v1';
const DYNAMIC_CACHE = 'speakup-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/css/bundle.min.css',
    '/js/bundle.min.js',
    '/public/favicon.ico',
    '/public/images/logo.svg'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('SW: Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('SW: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('SW: Activating...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => 
                            cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE
                        )
                        .map(cacheName => caches.delete(cacheName))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
    const { request } = event;
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // Skip external requests
    if (!request.url.startsWith(self.location.origin)) return;
    
    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    console.log('SW: Serving from cache:', request.url);
                    return cachedResponse;
                }
                
                // Fetch from network and cache
                return fetch(request)
                    .then(response => {
                        if (response.ok) {
                            const responseClone = response.clone();
                            caches.open(DYNAMIC_CACHE)
                                .then(cache => cache.put(request, responseClone));
                        }
                        return response;
                    })
                    .catch(() => {
                        // Offline fallback
                        if (request.destination === 'document') {
                            return caches.match('/');
                        }
                    });
            })
    );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'contact-form') {
        event.waitUntil(syncContactForm());
    }
});

async function syncContactForm() {
    // Handle offline form submissions
    console.log('SW: Syncing contact form data');
}
`;

        const outputPath = path.join(this.outputDir, 'sw.js');
        fs.writeFileSync(outputPath, sw.trim(), 'utf8');
        console.log(`✅ Service worker created: ${outputPath}`);
    }

    /**
     * Generate optimized HTML with inlined critical CSS
     */
    optimizeHTML() {
        console.log('🔧 Optimizing HTML files...');
        
        const criticalCSS = this.extractCriticalCSS();
        
        // Update generated HTML files with optimizations
        const htmlFiles = [
            'index.html',
            'o-metodo/index.html',
            'minha-jornada/index.html',
            'recursos/index.html',
            'contato/index.html'
        ];

        htmlFiles.forEach(htmlFile => {
            const filePath = path.join(this.outputDir, htmlFile);
            if (fs.existsSync(filePath)) {
                let html = fs.readFileSync(filePath, 'utf8');
                
                // Inline critical CSS
                html = html.replace(
                    '{{criticalCSS}}',
                    `<style>${criticalCSS}</style>`
                );
                
                // Update script references to use bundled files
                html = html.replace(
                    '<script type="module" src="/js/main.min.js"></script>',
                    '<script src="/js/bundle.min.js"></script>'
                );
                
                // Add preload for main bundle
                html = html.replace(
                    '<link rel="preload" href="/css/base/typography.css" as="style">',
                    '<link rel="preload" href="/css/bundle.min.css" as="style">\n    <link rel="preload" href="/js/bundle.min.js" as="script">'
                );
                
                fs.writeFileSync(filePath, html, 'utf8');
                console.log(`✅ Optimized: ${htmlFile}`);
            }
        });
    }

    /**
     * Generate build manifest
     */
    generateManifest() {
        console.log('📋 Generating build manifest...');
        
        const manifest = {
            build: {
                timestamp: new Date().toISOString(),
                version: '1.0.0',
                phase: 3
            },
            assets: {
                css: {
                    bundle: '/css/bundle.min.css',
                    critical: 'inlined'
                },
                js: {
                    bundle: '/js/bundle.min.js'
                }
            },
            pages: [
                { path: '/', file: 'index.html' },
                { path: '/o-metodo', file: 'o-metodo/index.html' },
                { path: '/minha-jornada', file: 'minha-jornada/index.html' },
                { path: '/recursos', file: 'recursos/index.html' },
                { path: '/contato', file: 'contato/index.html' }
            ],
            features: [
                'Static Site Generation',
                'Asset Bundling',
                'CSS Minification',
                'JS Minification',
                'Critical CSS Inlining',
                'Service Worker',
                'SEO Optimization'
            ]
        };

        const outputPath = path.join(this.outputDir, 'build-manifest.json');
        fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2), 'utf8');
        console.log(`✅ Build manifest created: ${outputPath}`);
    }

    /**
     * Main optimization process
     */
    async optimize() {
        console.log('🚀 Starting Asset Optimization - Phase 3');
        console.log('='.repeat(50));
        
        try {
            // Bundle and minify assets
            this.bundleCSS();
            this.bundleJS();
            
            // Generate PWA files
            this.generateServiceWorker();
            
            // Optimize HTML with critical CSS
            this.optimizeHTML();
            
            // Generate build manifest
            this.generateManifest();
            
            console.log('='.repeat(50));
            console.log('✅ Asset optimization completed!');
            console.log('🎯 Production-ready assets generated!');
            console.log('📦 Bundles created and minified');
            console.log('🔧 Critical CSS inlined');
            console.log('📱 Service worker ready');
            
        } catch (error) {
            console.error('❌ Optimization failed:', error);
            process.exit(1);
        }
    }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
    const optimizer = new AssetOptimizer();
    optimizer.optimize();
}

export { AssetOptimizer };
