#!/usr/bin/env node

/**
 * Static Site Generator - Phase 3
 * Generates optimized static HTML from content JSON files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class StaticSiteGenerator {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || '';
        this.outputDir = options.outputDir || 'dist';
        this.templatesDir = options.templatesDir || 'build/templates';
        this.contentDir = options.contentDir || 'content';
        this.isDevelopment = options.isDevelopment || false;
        
        this.siteContent = null;
        this.pages = new Map();
    }

    /**
     * Load and cache content files
     */
    async loadContent() {
        console.log('📚 Loading content files...');
        
        // Load site-wide content
        this.siteContent = this.loadJsonFile(path.join(this.contentDir, 'site-content.json'));
        if (!this.siteContent) {
            throw new Error('Failed to load site-content.json');
        }

        // Load page-specific content
        const pageFiles = [
            { name: 'index', file: 'site-content.json', section: 'homepage' },
            { name: 'o-metodo', file: 'metodo-content.json' },
            { name: 'minha-jornada', file: 'jornada-content.json' },
            { name: 'recursos', file: 'recursos-content.json' },
            { name: 'contato', file: 'contato-content.json' }
        ];

        for (const page of pageFiles) {
            const content = this.loadJsonFile(path.join(this.contentDir, page.file));
            if (content) {
                this.pages.set(page.name, {
                    content: page.section ? content[page.section] : content,
                    siteContent: this.siteContent
                });
                console.log(`✅ Loaded: ${page.name}`);
            }
        }

        console.log(`📊 Total pages loaded: ${this.pages.size}`);
    }

    /**
     * Load JSON file safely
     */
    loadJsonFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(content);
        } catch (error) {
            console.error(`❌ Error loading ${filePath}:`, error.message);
            return null;
        }
    }

    /**
     * Simple template engine
     */
    renderTemplate(template, data) {
        let result = template;
        
        // Handle simple variable replacement {{variable}}
        result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return data[key] || '';
        });
        
        // Handle conditional blocks {{#if condition}}...{{/if}}
        result = result.replace(/\{\{#if\s+(\w+)\}\}(.*?)\{\{\/if\}\}/gs, (match, condition, content) => {
            return data[condition] ? content : '';
        });
        
        // Handle arrays {{#navigation}}...{{/navigation}}
        result = result.replace(/\{\{#(\w+)\}\}(.*?)\{\{\/\1\}\}/gs, (match, arrayName, itemTemplate) => {
            const array = data[arrayName];
            if (Array.isArray(array)) {
                return array.map(item => {
                    let itemHtml = itemTemplate;
                    // Replace variables in item template
                    itemHtml = itemHtml.replace(/\{\{(\w+)\}\}/g, (m, key) => item[key] || '');
                    // Handle active class
                    itemHtml = itemHtml.replace(/\{\{#active\}\}(.*?)\{\{\/active\}\}/g, (m, content) => {
                        return item.active ? content : '';
                    });
                    return itemHtml;
                }).join('');
            }
            return '';
        });
        
        return result;
    }

    /**
     * Generate homepage HTML
     */
    generateHomepage() {
        const pageData = this.pages.get('index');
        if (!pageData) return null;

        const { content, siteContent } = pageData;
        
        const heroSection = `
        <section id="hero" class="section hero-section">
            <div class="container">
                <div class="hero-content">
                    <h1 class="hero-title">${content.hero.title}</h1>
                    <p class="hero-subtitle">${content.hero.subtitle}</p>
                    <p class="hero-description">${content.hero.description}</p>
                    <div class="hero-cta-area">
                        <a href="${this.baseUrl}/${content.hero.cta.primary.href}" class="cta-button">${content.hero.cta.primary.text}</a>
                        <a href="${this.baseUrl}/${content.hero.cta.secondary.href}" class="secondary-button">${content.hero.cta.secondary.text}</a>
                    </div>
                </div>
            </div>
        </section>`;

        const problemSection = `
        <section id="problem-section" class="section">
            <div class="container">
                <h2 class="section-title">${content.sections.problem.title}</h2>
                <p class="section-subtitle">${content.sections.problem.subtitle}</p>
                <div class="problem-grid">
                    ${content.sections.problem.points.map(point => `
                        <div class="problem-item">
                            <img src="${this.baseUrl}/${point.icon}" alt="" class="problem-icon">
                            <h3 class="problem-title">${point.title}</h3>
                            <p>${point.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>`;

        const solutionSection = `
        <section id="solution-section" class="section">
            <div class="container">
                <h2 class="section-title">${content.sections.solution.title}</h2>
                <p class="section-subtitle">${content.sections.solution.subtitle}</p>
                <div class="shifts-grid">
                    ${content.sections.solution.shifts.map(shift => `
                        <div class="shift-item">
                            <img src="${this.baseUrl}/${shift.icon}" alt="" class="shift-icon">
                            <h3 class="shift-title">${shift.title}</h3>
                            <p>${shift.description}</p>
                        </div>
                    `).join('')}
                </div>
                <div class="section-cta-area">
                    <a href="${this.baseUrl}/${content.sections.solution.cta.href}" class="secondary-button">${content.sections.solution.cta.text}</a>
                </div>
            </div>
        </section>`;

        const aboutSection = `
        <section id="the-guide" class="section">
            <div class="container about-teacher-container">
                <div class="teacher-photo-area">
                    <img src="${content.sections.about.photo}" alt="${content.sections.about.photoAlt}" class="teacher-face-svg">
                </div>
                <div class="bio-text-content">
                    <blockquote>"${content.sections.about.quote}"</blockquote>
                    <p class="bio-link-area">
                        - ${content.sections.about.attribution} <br>
                        <a href="${this.baseUrl}/${content.sections.about.cta.href}" class="link-subtle">${content.sections.about.cta.text}</a>
                    </p>
                </div>
            </div>
        </section>`;

        const testimonialsSection = `
        <section id="testimonials" class="section">
            <div class="container">
                <h2 class="section-title">${content.sections.testimonials.title}</h2>
                <div class="testimonial-grid">
                    ${content.sections.testimonials.testimonials.map(testimonial => `
                        <article class="card card--testimonial card--desktop card--mobile" 
                                 data-variant="testimonial" 
                                 data-mobile-optimized="true"
                                 role="article" 
                                 aria-label="Testimonial from ${testimonial.author}"
                                 tabindex="0">
                            <div class="card__content">
                                ${testimonial.content}
                            </div>
                            <div class="card__footer">
                                <p class="card__subtitle">- ${testimonial.author}</p>
                                <span class="testimonial-badge">${testimonial.role}</span>
                            </div>
                        </article>
                    `).join('')}
                </div>
            </div>
        </section>`;

        const finalCtaSection = `
        <section id="final-cta" class="section final-cta">
            <div class="container">
                <h2 class="final-cta-title">${content.sections.finalCta.title}</h2>
                <p class="reassurance-text">${content.sections.finalCta.description}</p>
                <a href="${this.baseUrl}/${content.sections.finalCta.cta.href}" class="cta-button cta-button-large final-cta-button">${content.sections.finalCta.cta.text}</a>
            </div>
        </section>`;

        return heroSection + problemSection + solutionSection + aboutSection + testimonialsSection + finalCtaSection;
    }

    /**
     * Generate page HTML for other pages
     */
    generatePageContent(pageName) {
        const pageData = this.pages.get(pageName);
        if (!pageData) return null;

        const { content } = pageData;
        
        // Simple page generation for now - can be enhanced with specific templates
        return `
        <section class="section">
            <div class="container">
                <h1>${content.hero?.title || content.meta?.title}</h1>
                <p>${content.hero?.description || content.meta?.description}</p>
                <!-- Additional page content would be generated here -->
            </div>
        </section>`;
    }

    /**
     * Generate structured data for SEO
     */
    generateStructuredData(pageData, pageName) {
        const { siteContent } = pageData;
        
        const baseData = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": siteContent.site.branding.name,
            "url": `${this.baseUrl}`,
            "logo": `${this.baseUrl}/${siteContent.site.branding.logo}`
        };

        if (pageName === 'index') {
            baseData["@type"] = "EducationalOrganization";
            baseData["description"] = siteContent.site.description;
        }

        return JSON.stringify(baseData, null, 2);
    }

    /**
     * Generate complete HTML page
     */
    generatePage(pageName) {
        console.log(`🏗️ Generating page: ${pageName}`);
        
        const pageData = this.pages.get(pageName);
        if (!pageData) {
            console.error(`❌ No data found for page: ${pageName}`);
            return null;
        }

        const { content, siteContent } = pageData;
        
        // Load base template
        const templatePath = path.join(this.templatesDir, 'base.html');
        const template = fs.readFileSync(templatePath, 'utf8');

        // Generate page content
        const pageContent = pageName === 'index' 
            ? this.generateHomepage() 
            : this.generatePageContent(pageName);

        // Prepare template data
        const templateData = {
            lang: siteContent.site.lang,
            title: content.meta?.title || siteContent.site.title,
            description: content.meta?.description || siteContent.site.description,
            baseUrl: this.baseUrl,
            favicon: siteContent.site.branding.favicon,
            logo: siteContent.site.branding.logo,
            logoText: siteContent.site.branding.name.replace(' ', ' <span class="up">') + '</span>',
            siteName: siteContent.site.branding.name,
            canonicalUrl: `${this.baseUrl}/${pageName === 'index' ? '' : pageName}`,
            navigation: siteContent.navigation.main,
            footerLinks: siteContent.footer.links,
            copyright: siteContent.footer.copyright,
            content: pageContent,
            structuredData: this.generateStructuredData(pageData, pageName),
            isDevelopment: this.isDevelopment,
            criticalCSS: '' // Will be populated in optimization phase
        };

        // Render template
        const html = this.renderTemplate(template, templateData);
        return html;
    }

    /**
     * Write file to output directory
     */
    writeFile(filePath, content) {
        const fullPath = path.join(this.outputDir, filePath);
        const dir = path.dirname(fullPath);
        
        // Create directory if it doesn't exist
        fs.mkdirSync(dir, { recursive: true });
        
        // Write file
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Generated: ${fullPath}`);
    }

    /**
     * Copy static assets
     */
    copyAssets() {
        console.log('📁 Copying static assets...');
        
        const assetDirs = ['css', 'js', 'public', 'images'];
        
        assetDirs.forEach(dir => {
            if (fs.existsSync(dir)) {
                this.copyDirectory(dir, path.join(this.outputDir, dir));
                console.log(`✅ Copied: ${dir}/`);
            }
        });
    }

    /**
     * Copy directory recursively
     */
    copyDirectory(src, dest) {
        fs.mkdirSync(dest, { recursive: true });
        
        const entries = fs.readdirSync(src, { withFileTypes: true });
        
        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            
            if (entry.isDirectory()) {
                this.copyDirectory(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }

    /**
     * Generate sitemap.xml
     */
    generateSitemap() {
        console.log('🗺️ Generating sitemap...');
        
        const pages = Array.from(this.pages.keys());
        const currentDate = new Date().toISOString().split('T')[0];
        
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => {
    const url = page === 'index' ? this.baseUrl || 'http://localhost:8080' : `${this.baseUrl || 'http://localhost:8080'}/${page}`;
    const priority = page === 'index' ? '1.0' : '0.8';
    return `    <url>
        <loc>${url}</loc>
        <lastmod>${currentDate}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${priority}</priority>
    </url>`;
}).join('\n')}
</urlset>`;

        this.writeFile('sitemap.xml', sitemap);
    }

    /**
     * Generate robots.txt
     */
    generateRobots() {
        console.log('🤖 Generating robots.txt...');
        
        const robots = `User-agent: *
Allow: /

Sitemap: ${this.baseUrl || 'http://localhost:8080'}/sitemap.xml
`;

        this.writeFile('robots.txt', robots);
    }

    /**
     * Main build process
     */
    async build() {
        console.log('🚀 Starting Static Site Generation - Phase 3');
        console.log('='.repeat(50));
        
        try {
            // Load content
            await this.loadContent();
            
            // Clean output directory
            if (fs.existsSync(this.outputDir)) {
                fs.rmSync(this.outputDir, { recursive: true });
            }
            fs.mkdirSync(this.outputDir, { recursive: true });
            
            // Generate pages
            for (const [pageName] of this.pages) {
                const html = this.generatePage(pageName);
                if (html) {
                    const fileName = pageName === 'index' ? 'index.html' : `${pageName}/index.html`;
                    this.writeFile(fileName, html);
                }
            }
            
            // Copy assets
            this.copyAssets();
            
            // Generate SEO files
            this.generateSitemap();
            this.generateRobots();
            
            console.log('='.repeat(50));
            console.log('✅ Static site generation completed!');
            console.log(`📂 Output directory: ${this.outputDir}`);
            console.log(`📄 Pages generated: ${this.pages.size}`);
            console.log('🎯 Ready for production deployment!');
            
        } catch (error) {
            console.error('❌ Build failed:', error);
            process.exit(1);
        }
    }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
    const generator = new StaticSiteGenerator({
        baseUrl: process.argv.includes('--prod') ? 'https://speakup.example.com' : '',
        isDevelopment: !process.argv.includes('--prod')
    });
    
    generator.build();
}

export { StaticSiteGenerator };
