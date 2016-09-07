window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

function loop () {
    easeParticlesModule.loop();
    requestAnimationFrame(loop);
}

var p = document.getElementById('particles');
easeParticlesModule.create(p);
p.addEventListener('click', function (e) { 
    
    // Creating an emitter whenever the user clicks on the particles canvas
    // The createEmitter can take the 6 properties listed below
    easeParticlesModule.createEmitter({ 
        position: { x: e.pageX, y: e.pageY },
        destination: { x: 0, y: 0 },
        onParticleDeath: function (a) { var c = document.getElementById('counter'); c.innerHTML = parseInt(c.innerHTML) + a; },
        onEmitterDeath: function () {},
        color: '#000000',
        sampleAmount: 100
    });
    
});

// Initialize the animation loop to run for the duration of the project
loop();