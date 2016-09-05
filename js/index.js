window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

function loop () {
    easeParticlesModule.loop();
    requestAnimationFrame(loop);
}

var p = document.getElementById('particles');
easeParticlesModule.create(p);
p.addEventListener('click', function (e) { 
    easeParticlesModule.createEmitter({ 
        position: { x: e.pageX, y: e.pageY },
        destination: { x: 0, y: 0 },
        onParticleDeath: function (a) { var c = document.getElementById('counter'); c.innerHTML = parseInt(c.innerHTML) + a; },
        color: '#000000',
        sampleAmount: 100
    });
});

loop();