#!/usr/bin/env node

/**
 * Production Build Script - Phase 3
 * Complete build pipeline: Generate → Optimize → Deploy Ready
 */

import { StaticSiteGenerator } from './generator.js';
import { AssetOptimizer } from './optimizer.js';
import fs from 'fs';
import path from 'path';

class ProductionBuilder {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || '';
        this.outputDir = options.outputDir || 'dist';
        this.isProduction = options.isProduction || false;
        
        this.generator = new StaticSiteGenerator({
            baseUrl: this.baseUrl,
            outputDir: this.outputDir,
            isDevelopment: !this.isProduction
        });
        
        this.optimizer = new AssetOptimizer({
            outputDir: this.outputDir
        });
    }

    /**
     * Clean output directory
     */
    clean() {
        console.log('🧹 Cleaning output directory...');
        if (fs.existsSync(this.outputDir)) {
            fs.rmSync(this.outputDir, { recursive: true });
            console.log(`✅ Cleaned: ${this.outputDir}`);
        }
    }

    /**
     * Analyze build results
     */
    analyzeBuild() {
        console.log('📊 Analyzing build results...');
        
        const stats = {
            pages: 0,
            totalSize: 0,
            assets: {
                html: 0,
                css: 0,
                js: 0,
                images: 0,
                other: 0
            }
        };

        const analyzeDirectory = (dir) => {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                
                if (entry.isDirectory()) {
                    analyzeDirectory(fullPath);
                } else {
                    const fileStats = fs.statSync(fullPath);
                    stats.totalSize += fileStats.size;
                    
                    const ext = path.extname(entry.name).toLowerCase();
                    
                    if (ext === '.html') {
                        stats.assets.html += fileStats.size;
                        if (entry.name === 'index.html') stats.pages++;
                    } else if (ext === '.css') {
                        stats.assets.css += fileStats.size;
                    } else if (ext === '.js') {
                        stats.assets.js += fileStats.size;
                    } else if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) {
                        stats.assets.images += fileStats.size;
                    } else {
                        stats.assets.other += fileStats.size;
                    }
                }
            }
        };

        if (fs.existsSync(this.outputDir)) {
            analyzeDirectory(this.outputDir);
        }

        // Format bytes to human readable
        const formatBytes = (bytes) => {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        };

        console.log('\n📈 Build Analysis:');
        console.log(`  📄 Pages: ${stats.pages}`);
        console.log(`  📦 Total Size: ${formatBytes(stats.totalSize)}`);
        console.log(`  🏗️ HTML: ${formatBytes(stats.assets.html)}`);
        console.log(`  🎨 CSS: ${formatBytes(stats.assets.css)}`);
        console.log(`  ⚡ JavaScript: ${formatBytes(stats.assets.js)}`);
        console.log(`  🖼️ Images: ${formatBytes(stats.assets.images)}`);
        console.log(`  📁 Other: ${formatBytes(stats.assets.other)}`);

        return stats;
    }

    /**
     * Generate deployment instructions
     */
    generateDeploymentGuide() {
        console.log('📋 Generating deployment guide...');
        
        const guide = `# Deployment Guide - SpeakUp Website

## Phase 3 Production Build Complete

**Build Date:** ${new Date().toISOString()}  
**Build Directory:** \`${this.outputDir}/\`  
**Production Ready:** ✅

---

## Deployment Options

### Option 1: Cloudflare Pages (Recommended)

\`\`\`bash
# 1. Connect your GitHub repository to Cloudflare Pages
# 2. Set build command: npm run build:prod
# 3. Set output directory: dist
# 4. Deploy automatically on git push
\`\`\`

**Cloudflare Pages Settings:**
- Build command: \`npm run build:prod\`
- Build output directory: \`dist\`
- Root directory: \`/\`
- Node.js version: 18+

### Option 2: Vercel

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel --prod
\`\`\`

**Vercel Configuration (vercel.json):**
\`\`\`json
{
  "buildCommand": "npm run build:prod",
  "outputDirectory": "dist",
  "framework": null
}
\`\`\`

### Option 3: Netlify

\`\`\`bash
# Install Netlify CLI  
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
\`\`\`

---

## Performance Optimizations Applied

✅ **Static Site Generation** - Pre-rendered HTML  
✅ **Asset Bundling** - Combined CSS/JS files  
✅ **Minification** - Compressed assets  
✅ **Critical CSS** - Inlined above-the-fold styles  
✅ **Service Worker** - Offline capability  
✅ **SEO Optimization** - Meta tags, sitemap, robots.txt  

---

## Build Output Structure

\`\`\`
dist/
├── index.html              # Homepage
├── o-metodo/index.html     # Method page
├── minha-jornada/index.html # Journey page
├── recursos/index.html     # Resources page
├── contato/index.html      # Contact page
├── css/bundle.min.css      # Bundled & minified CSS
├── js/bundle.min.js        # Bundled & minified JS
├── sw.js                   # Service worker
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Search engine instructions
├── build-manifest.json     # Build information
└── [assets...]             # Images, fonts, etc.
\`\`\`

---

## Environment Variables (if needed)

\`\`\`bash
# Production base URL
VITE_BASE_URL=https://yourdomain.com

# Analytics (if implemented)  
VITE_GA_ID=G-XXXXXXXXXX
\`\`\`

---

## Domain Setup

1. **Purchase domain** (recommend: speakup.com.br)
2. **Configure DNS** to point to your hosting provider
3. **Enable SSL** (automatic with most hosts)
4. **Set up redirects** if needed

---

## Post-Deployment Checklist

- [ ] Test all pages load correctly
- [ ] Verify mobile responsiveness  
- [ ] Check contact form functionality
- [ ] Test service worker (offline mode)
- [ ] Validate SEO meta tags
- [ ] Submit sitemap to Google Search Console
- [ ] Set up analytics (optional)
- [ ] Configure error monitoring

---

## Maintenance

### Content Updates
1. Edit JSON files in \`content/\` directory
2. Run \`npm run build:prod\`
3. Deploy updated \`dist/\` folder

### Performance Monitoring
- Use Lighthouse for regular audits
- Monitor Core Web Vitals
- Check uptime and performance

---

**🎯 Your website is now production-ready!**
`;

        const outputPath = path.join(this.outputDir, 'DEPLOYMENT-GUIDE.md');
        fs.writeFileSync(outputPath, guide, 'utf8');
        console.log(`✅ Deployment guide created: ${outputPath}`);
    }

    /**
     * Main build process
     */
    async build() {
        const startTime = Date.now();
        
        console.log('🚀 Starting Production Build - Phase 3');
        console.log('='.repeat(60));
        console.log(`📍 Target: ${this.isProduction ? 'Production' : 'Development'}`);
        console.log(`🌐 Base URL: ${this.baseUrl || 'Local'}`);
        console.log(`📂 Output: ${this.outputDir}`);
        console.log('='.repeat(60));

        try {
            // Step 1: Clean
            this.clean();
            
            // Step 2: Generate static site
            console.log('\n🏗️ Step 1: Static Site Generation');
            await this.generator.build();
            
            // Step 3: Optimize assets
            console.log('\n⚡ Step 2: Asset Optimization');
            await this.optimizer.optimize();
            
            // Step 4: Analysis
            console.log('\n📊 Step 3: Build Analysis');
            const stats = this.analyzeBuild();
            
            // Step 5: Generate deployment guide
            console.log('\n📋 Step 4: Deployment Preparation');
            this.generateDeploymentGuide();
            
            const buildTime = ((Date.now() - startTime) / 1000).toFixed(2);
            
            console.log('\n' + '='.repeat(60));
            console.log('🎉 PRODUCTION BUILD COMPLETE!');
            console.log('='.repeat(60));
            console.log(`⏱️ Build time: ${buildTime}s`);
            console.log(`📦 Total size: ${this.formatBytes(stats.totalSize)}`);
            console.log(`📄 Pages generated: ${stats.pages}`);
            console.log(`📂 Output directory: ${this.outputDir}/`);
            console.log('\n🚀 Ready for deployment!');
            console.log('📋 See DEPLOYMENT-GUIDE.md for next steps');
            console.log('='.repeat(60));
            
        } catch (error) {
            console.error('\n❌ Production build failed:', error);
            process.exit(1);
        }
    }

    /**
     * Format bytes to human readable format
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
    const isProduction = process.argv.includes('--prod');
    const baseUrl = process.argv.find(arg => arg.startsWith('--base-url='))?.split('=')[1] || '';
    
    const builder = new ProductionBuilder({
        baseUrl,
        isProduction,
        outputDir: 'dist'
    });
    
    builder.build();
}

export { ProductionBuilder };
