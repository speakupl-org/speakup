// js/modules/actors.js

export function createActors(gsap) {
  // Get all the pillar sections
  const pillars = gsap.utils.toArray('.pillar-text-content');
  
  // Animate each one individually based on its scroll position
  pillars.forEach(pillar => {
    // We only want to animate the text inside, not the whole container
    const textWrapper = pillar.querySelector('.text-anim-wrapper');
    
    if (textWrapper) {
      gsap.fromTo(textWrapper,
        { // from state
          opacity: 0,
          y: 50
        },
        { // to state
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: pillar, // The trigger is the pillar container itself
            start: "top 60%", // Start animating when the top of the pillar is 60% down the screen
            end: "bottom 40%", // Fade out when the bottom is 40% from the top
            scrub: 1, // Smoothly scrub the animation
          }
        }
      );
    }
  });
}