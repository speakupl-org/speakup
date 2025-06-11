document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration: Define the Narrative and Look of Each Particle System ---
    const particleSystemsConfig = {
        'hero-canvas': {
            particleCount: 20,
            // A subtle, upward drifting wisp. Aspirational.
            createParticle: (ctx, canvas) => {
                return {
                    x: Math.random() * canvas.width,
                    y: canvas.height + Math.random() * 50, // Start below the screen
                    radius: Math.random() * 1.5 + 0.5,
                    color: `rgba(253, 184, 19, ${Math.random() * 0.4 + 0.3})`, // FDB813 with varied alpha
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: -(Math.random() * 0.7 + 0.2), // Slow upward drift
                    life: 1, // Will fade out
                };
            },
            updateParticle: (p, canvas) => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.003; // Fade out slowly
                // Reset when off-screen or faded
                if (p.y < -10 || p.life <= 0) {
                    Object.assign(p, particleSystemsConfig['hero-canvas'].createParticle(null, canvas));
                }
            },
        },
        'pain-canvas': {
            particleCount: 15,
            // Erratic, "static" like particles. Represents frustration.
            createParticle: (ctx, canvas) => {
                return {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.2,
                    color: `rgba(88, 96, 101, ${Math.random() * 0.5 + 0.2})`, // medium-grey-text
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: (Math.random() - 0.5) * 1.5,
                    life: 60, // frames
                };
            },
            updateParticle: (p, canvas) => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 1;
                // Jitter
                if(Math.random() > 0.95) {
                    p.vx = (Math.random() - 0.5) * 2;
                    p.vy = (Math.random() - 0.5) * 2;
                }
                // Reset when life is over
                if (p.life <= 0) {
                     Object.assign(p, particleSystemsConfig['pain-canvas'].createParticle(null, canvas));
                }
            }
        },
        'benefits-canvas': {
            particleCount: 25,
            // Energetic, glowing orbs flowing upwards. Represents progress.
             createParticle: (ctx, canvas) => {
                return {
                    x: canvas.width * 0.5, // Start from the center
                    y: canvas.height * 0.8,
                    radius: Math.random() * 2 + 1,
                    color: `rgba(0, 160, 154, ${Math.random() * 0.6 + 0.4})`, // secondary-vibrant-accent
                    // Spread out in an upward fan
                    angle: -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI / 2),
                    speed: Math.random() * 2 + 1
                };
            },
            updateParticle: (p, canvas) => {
                p.x += Math.cos(p.angle) * p.speed;
                p.y += Math.sin(p.angle) * p.speed;
                p.radius *= 0.985; // Shrink as it rises
                 if (p.y < 0 || p.radius < 0.2) {
                     Object.assign(p, particleSystemsConfig['benefits-canvas'].createParticle(null, canvas));
                }
            }
        },
        'testimonials-canvas': {
            particleCount: 10,
            // Subtle, twinkling stars. Represents success stories.
            createParticle: (ctx, canvas) => {
                return {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5 + 0.5,
                    maxRadius: Math.random() * 1.5 + 0.5,
                    color: `rgba(253, 184, 19, 0.1)`, // A faint yellow
                    life: Math.random() * 200 + 100, // Long life
                    phase: Math.random() * Math.PI * 2,
                };
            },
            updateParticle: (p, canvas) => {
                p.life -= 1;
                p.phase += 0.03;
                p.radius = p.maxRadius * (Math.sin(p.phase) * 0.5 + 0.5); // Pulse effect
                if (p.life <= 0) {
                     Object.assign(p, particleSystemsConfig['testimonials-canvas'].createParticle(null, canvas));
                }
            }
        },
        'final-cta-canvas': {
            particleCount: 15,
             // Purposeful, arrow-like particles converging. Represents a call to action.
            createParticle: (ctx, canvas) => {
                const side = Math.random() > 0.5 ? 'left' : 'right';
                return {
                    x: side === 'left' ? -10 : canvas.width + 10,
                    y: Math.random() * canvas.height,
                    radius: 2,
                    color: `rgba(253, 184, 19, ${Math.random() * 0.5 + 0.3})`,
                    vx: (side === 'left' ? 1 : -1) * (Math.random() * 1.5 + 0.5),
                    vy: (Math.random() - 0.5) * 0.5,
                };
            },
            updateParticle: (p, canvas, ctx) => {
                p.x += p.vx;
                p.y += p.vy;

                // Reset
                if(p.x > canvas.width + 10 || p.x < -10) {
                     Object.assign(p, particleSystemsConfig['final-cta-canvas'].createParticle(null, canvas));
                }
            },
            // Custom draw function for an "arrow" shape
            drawParticle: (p, ctx) => {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(Math.atan2(p.vy, p.vx));
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(-7, -3);
                ctx.lineTo(-7, 3);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
        },
    };

    const particleSystems = {};
    let globalAnimationId;

    // --- Main Animation Loop ---
    function animate() {
        for (const canvasId in particleSystems) {
            const system = particleSystems[canvasId];
            if (system.running) {
                const { ctx, canvas, particles, config } = system;
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

                particles.forEach(p => {
                    config.updateParticle(p, canvas, ctx);
                    
                    ctx.beginPath();
                    // Use a custom draw function if it exists, otherwise draw a circle
                    if(config.drawParticle) {
                        config.drawParticle(p, ctx);
                    } else {
                        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                        ctx.fillStyle = p.color;
                        ctx.fill();
                    }
                });
            }
        }
        globalAnimationId = requestAnimationFrame(animate);
    }
    
    // --- System Setup & Control ---
    function setupParticleSystems() {
        for (const canvasId in particleSystemsConfig) {
            const canvas = document.getElementById(canvasId);
            if (canvas) {
                const ctx = canvas.getContext('2d');
                const config = particleSystemsConfig[canvasId];
                
                // Set canvas size based on its container's size
                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetHeight;
                
                const particles = [];
                for (let i = 0; i < config.particleCount; i++) {
                    particles.push(config.createParticle(ctx, canvas));
                }
                
                particleSystems[canvasId] = { canvas, ctx, particles, config, running: false };
            }
        }
    }

    // --- Intersection Observer for Performance ---
    // This is the most crucial part for performance.
    function observeSections() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const canvasId = entry.target.querySelector('canvas')?.id;
                if (canvasId && particleSystems[canvasId]) {
                    // Start animation when in view, stop it when out of view.
                    particleSystems[canvasId].running = entry.isIntersecting;
                }
            });
        }, { threshold: 0.01 }); // Start as soon as 1% is visible

        document.querySelectorAll('[data-section-id]').forEach(section => {
            observer.observe(section);
        });
    }

    // --- Utility Functions (Scroll Animation, etc.) ---
    function setupScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.animated-title, .animated-text, .benefit-item, .testimonial-card, ' +
            '.tally-form-wrapper, .blockage-element, .animated-teacher-frame, .final-cta-button, ' +
            '.post-quiz-cta-container'
        );
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    entry.target.classList.add('in-view');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(el => observer.observe(el));
    }

    // --- Initialization ---
    setupParticleSystems();
    setupScrollAnimations();
    observeSections();
    animate(); // Start the single, global animation loop

    // Make it responsive: reset particle positions on resize
    window.addEventListener('resize', () => {
        cancelAnimationFrame(globalAnimationId);
        setupParticleSystems();
        animate();
    });

    // --- Keep your existing helpers ---
    document.getElementById('current-year').textContent = new Date().getFullYear();
    document.querySelectorAll('a[href^="#"]').forEach(anchor => { /* smooth scroll logic */ });
    (function(){ /* Tally.so script logic */ })();
});
