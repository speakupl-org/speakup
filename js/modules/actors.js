// js/modules/actors.js

// This function ONLY controls the cube. It receives `gsap` as an argument.
function createCubeActor(cube, appState, gsap) {
  function update() {
    const progress = appState.scrolly.progress;

    // --- THIS IS THE AREA TO EXPERIMENT WITH ---
    // Change these lines to control the cube's animation
    cube.rotation.y = progress * Math.PI * 2.5; // Turntable spin
    cube.rotation.x = progress * Math.PI * -1; // Tumble "down"

    const scale = (progress < 0.5)
        ? gsap.utils.mapRange(0, 0.5, 1, 1.2, progress)
        : gsap.utils.mapRange(0.5, 1, 1.2, 1, progress);
    cube.scale.set(scale, scale, scale);
  }
  gsap.ticker.add(update);
}

// This function ONLY controls the text pillars. It receives `gsap` as an argument.
function createTextPillarActor(pillars, appState, gsap) {
    function update() {
        const progress = appState.scrolly.progress;
        const numPillars = pillars.length;
        
        pillars.forEach((pillar, i) => {
            const start = i / numPillars;
            const end = (i + 1) / numPillars;
            const fadeInProgress = gsap.utils.mapRange(start, start + ((end - start) * 0.5), 0, 1, progress, true);
            const fadeOutProgress = gsap.utils.mapRange(start + ((end - start) * 0.5), end, 1, 0, progress, true);
            
            gsap.set(pillar.querySelector('.text-anim-wrapper'), { autoAlpha: Math.min(fadeInProgress, fadeOutProgress), y: (0.5 - fadeInProgress) * -40 });
        });
    }
    gsap.ticker.add(update);
}

// The main export function now ACCEPTS `gsap`...
export function createActors(cube, pillars, appState, gsap) {
  // ...and PASSES `gsap` down to the functions that need it.
  createCubeActor(cube, appState, gsap);
  createTextPillarActor(pillars, appState, gsap);
}
