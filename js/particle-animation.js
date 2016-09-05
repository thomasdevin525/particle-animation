var easeParticlesModule = (function () {
    
    var data = {
        looping: true,
        emitters: [],
        canvas: null,
        ctx: null,
        maxParticlesPerEmitter: 25,
        easings: ['linear', 'inQuad', 'outQuad', 'inOutQuad', 'inSine', 'outSine', 'inOutSine', 'inExpo', 'outExpo', 'inOutExpo', 'inCirc', 'outCirc', 'inOutCirc']
    };
    
    function Emitter (pos, des, opd, oed, sam, col) {
        this.position = pos || {x: 0, y: 0};
        this.particleDestination = des || {x: 0, y: 0};
        this.sampleAmount = sam || 1;
        this.killAfterParticle = sam > data.maxParticlesPerEmitter ? data.maxParticlesPerEmitter : this.sampleAmount;
        this.rate = this.killAfterParticle;
        this.onParticleDeath = opd || function () {};
        this.onEmitterDeath = oed || function () {};
        this.particleColor = col || '#FFFFFF';
        this.particleCount = 0;
        this.particles = [];
        this.getParticleSampleAmount = function () {
            var amount = Math.round(this.sampleAmount / this.particles.length);
            this.sampleAmount -= amount;
            return amount;
        };
        this.spawnParticles = function () {
            var i = 0, x = 0, y = 0, f = 0,
                o = data.easings;
            for (; i < this.rate; i++) {
                do {
                    x = Math.floor(Math.random() * o.length);
                    y = Math.floor(Math.random() * o.length);
                } while (x === y);
                f = Math.floor(Math.random() * 15) + 30;
                this.particles.push(new Particle(this.position, o[x], o[y], f));
                this.particleCount++;
            }
        };
    }
    function Particle (position, easeX, easeY, frames) {
        this.frame = 0;
        this.frames = frames || 30;
        this.position = position || {x: 0, y: 0};
        this.easeX = easeX || 'linear';
        this.easeY = easeY || 'linear';
    }
        
    function addParticles () {
        var i = 0;
        for (; i < data.emitters.length; i++) {
            if (data.emitters[i].particleCount < data.emitters[i].killAfterParticle) {
                data.emitters[i].spawnParticles();
            }
        }
    }
    function moveParticles () {
        var i = 0, j = 0, e = {}, p = {}, x = 0, y = 0, mx = 0, my = 0, nx = 0, ny = 0;
        for (; i < data.emitters.length; i++) {
            e = data.emitters[i];
            x = e.position.x;
            y = e.position.y;
            mx = e.particleDestination.x - e.position.x;
            my = e.particleDestination.y - e.position.y;
            j = e.particles.length - 1;
            for (; j >= 0; j--) {
                p = e.particles[j];
                if (p.frame < p.frames) {
                    p.frame++;
                    nx = easingData[p.easeX](p.frame, x, mx, p.frames);
                    ny = easingData[p.easeY](p.frame, y, my, p.frames);
                    p.position = {x: nx, y: ny};
                } else {
                    e.onParticleDeath(e.getParticleSampleAmount());
                    e.particles.splice(j, 1);
                }
            }
        }
    }
    function drawParticles () {
        var i = 0, j = 0, p = {}, c = '';
        for (; i < data.emitters.length; i++) {
            j = 0;
            for (; j < data.emitters[i].particles.length; j++) {
                p = data.emitters[i].particles[j];
                data.ctx.beginPath();
                data.ctx.arc(p.position.x, p.position.y, 5, 0, 2*Math.PI);
                data.ctx.fillStyle = data.emitters[i].particleColor;
                data.ctx.fill();
                data.ctx.closePath();
            }
        }
    }
    function killEmitters () {
        var i = data.emitters.length - 1;
        for (; i >= 0; i--) {
            if (data.emitters[i].particles.length === 0) {
                data.emitters.splice(i, 1);
            }
        }
        if (data.emitters.length === 0) {
            data.looping = false;
        }
    }
                           
    function create (canvas) {
        if (canvas === null) return;
        var res = window.devicePixelRatio || 1,
            scale = 1 / res;
        
        data.canvas = canvas;
        data.ctx = data.canvas.getContext('2d');
    
        data.canvas.width  = window.innerWidth * res;
        data.canvas.height = window.innerHeight * res;
        data.canvas.style.width = window.innerWidth + 'px';
        data.canvas.style.height = window.innerHeight + 'px';

        data.ctx.scale(res, res);
    }
    function createEmitter (preferences) {
        var p = preferences || {},
            pos = {x: p.position.x, y: p.position.y},
            des = {x: p.destination.x, y: p.destination.y},
            opd = p.onParticleDeath || function () {},
            oed = p.onEmitterDeath || function () {},
            sam = p.sampleAmount || 1,
            col = p.color || '#FFFFFF';
        data.emitters.push(new Emitter(pos, des, opd, oed, sam, col));
        data.looping = true;
    }
    function loop() {
        if (data.looping) {
            addParticles();
            killEmitters();
            moveParticles();
            data.ctx.clearRect(0, 0, data.canvas.width, data.canvas.height);
            drawParticles();
        }
    }
    
    return {
        create: create,
        createEmitter: createEmitter,
        loop: loop
    }
    
})();