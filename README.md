# particle-animation
Javascript module for useful particle animations.

This module is designed to create a particle effect with a location and a destination. Each particle is given randomized x and y easing properties and a random number of frames for their duration.

This repo is just a demo of the effect. Open the index.html file in the browser and click anywhere on the screen to view the particles spawn and move to the top left corner.

To implement this effect into your own project, just include the easing-equations.js and particle-animation.js files into your js folder. This effect uses requestAnimationFrame for its animation. If you don't already have a requestAnimationFrame loop in your project, be sure to create one and add the easeParticleModule.loop(); inside of it. The index.js file shows an example of setting up the module and the animation loop.

For a video tutorial on how to use this module --> https://www.youtube.com/watch?v=WgZXjy7ZV0Y

For more on how this module works, see my YouTube tutorial series on building it --> https://www.youtube.com/playlist?list=PLHCfqGERncuFevxQ2mRlCuuS0NdpNRgGN
