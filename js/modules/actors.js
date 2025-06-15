// js/modules/actors.js

// This function ONLY controls the cube. It receives `gsap` as an argument.
function createCubeActor(cube, appState, gsap) {
  function update() {
    const progress = appState.scrolly.progress;

    // --- THIS IS THE AREA TO EXPERIMENT WITH ---
    // Change these lines to control the cube's Robust "Pass-it-Down" Fix**

Let's refactor the code to follow the cleaner pattern we discussed. This will make the code more resilient and is good practice.

1.  **Open `js/modules/actors.js`**.
2.  Modify the file to look like this. I've added comments to show the changes.

    ```javascript
    // js/modules/actors.js

    // The 'gsap' constant from the window is now passed in as an argument.
    // We can remove `const gsap = window.gs animation
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
        const progress = appStateap;` from this file.

    // CHANGE: Added 'gsap' as an argument
    function createCubeActor(cube, appState, gsap) {
      function update() {
        const progress = appState.scrolly.progress;
        cube.rotation.y = progress * Math.PI * 2.5;
        cube.rotation.x = progress * Math.PI * -1;
        
        const scale = (progress < 0.5)
            ? gsap.utils.mapRange(0, 0.5, 1, 1.2, progress)
            : gsap.utils.mapRange(0.5, 1, 1.2, 1, progress);
        cube.scale.set(scale, scale, scale);
      }
      gsap.ticker.add(update);
    }

    // CHANGE: Added 'gsap' as an argument
    function createTextPillarActor(pillars, appState, gsap) {
        function update() {
            const progress = appState.scrolly.progress;
            .scrolly.progress;
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
