# Component System Guide - Phase 2

## Card Component System

### Implementation
The card system is implemented with mobile-first responsive design:

- **Base**: `css/components/card.css`
- **Mobile JS**: `js/components/mobile/card-mobile-enhanced.js`
- **Desktop JS**: `js/components/desktop/card.js`

### Usage in Content

#### Testimonial Cards
```json
{
  "testimonials": [
    {
      "content": "Testimonial text here...",
      "author": "Author Name",
      "role": "Title, Company"
    }
  ]
}
```

#### Generated HTML
```html
<article class="card card--testimonial card--desktop card--mobile" 
         data-variant="testimonial" 
         data-mobile-optimized="true"
         role="article" 
         aria-label="Testimonial from Author Name"
         tabindex="0">
    <div class="card__content">
        Testimonial text here...
    </div>
    <div class="card__footer">
        <p class="card__subtitle">- Author Name</p>
        <span class="testimonial-badge">Title, Company</span>
    </div>
</article>
```

### Features
- **Responsive**: Adapts to mobile and desktop
- **Accessible**: ARIA labels and keyboard navigation
- **Touch-optimized**: Enhanced mobile interactions
- **Performance**: Optimized animations and interactions

### Adding New Card Types
1. Define content structure in JSON
2. Add CSS variants in `card.css`
3. Update content loader to handle new type
4. Test on mobile and desktop

## Content-Driven Components

### Navigation
- Defined in `site-content.json`
- Automatically rendered by content loader
- Easy to modify without code changes

### CTAs (Call-to-Action)
- Consistent structure across all content files
- Automatic button styling and linking
- A/B testing ready

### SEO Components
- Meta tags driven by content
- Structured data ready
- Performance optimized

Generated on: 2025-06-21T08:06:10.348Z
