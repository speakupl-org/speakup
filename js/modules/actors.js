// js/modules/actors.js

// This internal function now receives `gsap` as its third argument.
function createCubeActor(cube, appState, gsap) {
  function update() {
    const progress = appState.scrolly.progress;

    // This logic is now safe because `gsap` is defined.
    cube.rotation.y = progress * Math.PI * 2.5;
    cube.rotation.x = progress * Math.PI * -1;
    
    const scale = (progress < 0.5)
        ? gsap.utils.mapRange(0, 0.5, 1, 1.2, progress)
        : gsap.utils.mapRange(0.5, 1, 1.2, 1, progress);
    cube.scale.set(scale, scale, scale);
  }
  gsap.ticker.add(update);
}

// This internal function also now receives `gsap` as its third argument.
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

// The main exported function now ACCEPTS `gsap` as the fourth argument...
export function createActors(cube, pillars, appState, gsap) {
  // ...and PASSES `gsap` down to the internal functions that need it.
  createCubeActor(cube, appState, gsap);
  createTextPillarActor(pillars, appState, gsap);
}