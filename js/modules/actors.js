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
// Replace your existing createTextPillarActor function with this one

function createTextPillarActor(pillars, appState, gsap) {
    function update() {
        const progress = appState.scrolly.progress;
        const numPillars = pillars.length;
        
        // This is a more robust way to calculate which pillar should be active
        const stepSize = 1 / numPillars;

        pillars.forEach((pillar, i) => {
            const pillarStart = i * stepSize;
            const pillarEnd = pillarStart + stepSize;

            // Calculate how "into" this specific pillar's section we are (0 to 1)
            const pillarProgress = gsap.utils.mapRange(pillarStart, pillarEnd, 0, 1, progress);

            // Use a simple sine wave for a smooth fade in and out
            // Math.sin(0) = 0, Math.sin(PI/2) = 1, Math.sin(PI) = 0
            const opacity = Math.sin(pillarProgress * Math.PI);
            
            gsap.set(pillar, { autoAlpha: opacity });
        });
    }
    gsap.ticker.add(update);
}