// js/modules/actors.js
function createCubeActor(cube, appState) {
  function update() {
    const progress = appState.scrolly.progress;
    cube.rotation.y = progress * Math.PI * 2.5;
    cube.rotation.x = progress * Math.PI * -1;
    
    // This is the scale animation from your original timeline
    const scale = (progress < 0.5)
        ? gsap.utils.mapRange(0, 0.5, 1, 1.2, progress)
        : gsap.utils.mapRange(0.5, 1, 1.2, 1, progress);
    cube.scale.set(scale, scale, scale);
  }
  gsap.ticker.add(update);
}

function createTextPillarActor(pillars, appState) {
    function update() {
        const progress = appState.scrolly.progress;
        const numPillars = pillars.length;
        
        pillars.forEach((pillar, i) => {
            const start = i / numPillars;
            const end = (i + 1) / numPillars;
            // Fade in starts at the beginning of the section, ends at the middle
            const fadeInProgress = gsap.utils.mapRange(start, start + ((end - start) * 0.5), 0, 1, progress, true);
            // Fade out starts at the middle, ends at the end
            const fadeOutProgress = gsap.utils.mapRange(start + ((end - start) * 0.5), end, 1, 0, progress, true);
            
            // Use the lower of the two values to create the fade-in/fade-out effect
            gsap.set(pillar.querySelector('.text-anim-wrapper'), { autoAlpha: Math.min(fadeInProgress, fadeOutProgress), y: (0.5 - fadeInProgress) * -40 });
        });
    }
    gsap.ticker.add(update);
}

export function createActors(cube, pillars, appState) {
  createCubeActor(cube, appState);
  createTextPillarActor(pillars, appState);
}
