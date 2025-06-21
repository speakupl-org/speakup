// Error Boundary Component for Three.js
class ThreeJSErrorBoundary {
    constructor() {
        this.hasError = false;
        this.errorInfo = null;
    }

    static wrapThreeJSInit(initFunction) {
        try {
            return initFunction();
        } catch (error) {
            console.error('Three.js initialization failed:', error);
            // Graceful degradation - show static content instead
            document.querySelector('.scrolly-experience-wrapper')?.classList.add('fallback-mode');
            return null;
        }
    }

    static createFallbackExperience() {
        // If Three.js fails, show beautiful static alternative
        const wrapper = document.querySelector('.scrolly-experience-wrapper');
        if (wrapper) {
            wrapper.innerHTML = `
                <div class="static-experience">
                    <div class="hero-visual">
                        <h2>Speak Up</h2>
                        <p>Transforming English communication through connection, not perfection.</p>
                    </div>
                </div>
            `;
        }
    }
}

export { ThreeJSErrorBoundary };
