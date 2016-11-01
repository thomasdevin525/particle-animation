var easeParticlesModule = (function () {
    
    var data = {
      
      // Edit to see more particles with greater sample amounts
      maxParticlesPerEmitter: 25,
      
      // Edit property names taken from easingData
      easings: ['linear', 'inQuad', 'outQuad', 'inOutQuad', 'inSine', 'outSine', 'inOutSine', 'inExpo', 'outExpo', 'inOutExpo', 'inCirc', 'outCirc', 'inOutCirc'],
      
      // Don't worry about these
      looping: true,
      canvas: null,
      ctx: null,
      emitters: [],
      
    };
    
    function Emitter ( pos, des, opd, oed, sam, col ) {
      
      // Define position and desitination
      this.position = pos || {x: 0, y: 0};
      this.particleDestination = des || {x: 0, y: 0};
      
      // Total point amount and define number of particles
      this.sampleAmount = sam || 1;
      this.killAfterParticle = sam > data.maxParticlesPerEmitter ? data.maxParticlesPerEmitter : this.sampleAmount;
      this.rate = this.killAfterParticle;
      
      // When particle and emitter dies
      this.onParticleDeath = opd || function () {};
      this.onEmitterDeath = oed || function () {};
      
      // Color and particles
      this.particleColor = col || '#FFFFFF';
      this.particleCount = 0;
      this.particles = [];

      // Determine the sample amount for each particle
      this.getParticleSampleAmount = function () {
        
        var amount = Math.round(this.sampleAmount / this.particles.length);
        this.sampleAmount -= amount;
        return amount;
        
      };
      
      // Spawn particles for this emitter
      this.spawnParticles = function () {
        
        var i = 0,
            len = this.rate,
            o = data.easings,
            x, 
            y, 
            f;
        
        // Run through the rate for this frame
        for (; i < len; i++) {
          
          // Make sure the x and y easing equations are different
          do {
            
            x = Math.floor( Math.random() * o.length );
            y = Math.floor( Math.random() * o.length );
            
          } while ( x === y );
          
          // Random frame amount between 15 and 45
          f = Math.floor( Math.random() * 15 ) + 30;
          
          // Create the particle and inc particle count
          this.particles.push( new Particle( this.position, o[x], o[y], f ) );
          this.particleCount++;
          
        }
        
      };
      
    }
    function Particle ( position, easeX, easeY, frames ) {
      
      // Define particle properties
      this.frame = 0;
      this.frames = frames || 30;
      this.position = position || {x: 0, y: 0};
      this.easeX = easeX || 'linear';
      this.easeY = easeY || 'linear';
      
    }
        
    function addParticles () {
      
      var i = 0,
          emts = data.emitters,
          len = emts.length;
      
      // Run through the emitters
      for ( ; i < len; i++ ) {
        
        // Make sure the emitter hasn't reached it's max particle count
        if ( emts[i].particleCount < emts[i].killAfterParticle ) {
          
          // Call to spawn more particles
          emts[i].spawnParticles();
          
        }
        
      }
      
    }
    function moveParticles () {
      
      // Define variables
      var i = 0, 
          emts = data.emitters,
          len = emts.length,
          j, 
          e, 
          p,
          mx,
          my,
          nx,
          ny;

      for (; i < len; i++) {

        e = emts[i];
        
        // Get x and y move position
        mx = e.particleDestination.x - e.position.x;
        my = e.particleDestination.y - e.position.y;
        
        j = e.particles.length - 1;

        // Loop backwards through the particles for splicing
        for (; j >= 0; j--) {

          p = e.particles[j];

          // Check the frame count of the particle
          if ( p.frame < p.frames ) {

            // Inc frame count
            p.frame++;
            
            // Get new x and y position of the particle
            nx = easingData[p.easeX]( p.frame, e.position.x, mx, p.frames );
            ny = easingData[p.easeY]( p.frame, e.position.y, my, p.frames );
            
            // Set the new position
            p.position = { x: nx, y: ny };

          } else {

            // Call particle death function and remove it from the array
            e.onParticleDeath( e.getParticleSampleAmount() );
            e.particles.splice( j, 1 );

          }

        }

      }
      
    }
    function drawParticles () {
      
      var i = 0,
          emts = data.emitters,
          len = emts.length,
          j,
          p,
          c;
      
      // Loop the emitters
      for ( ; i < len; i++ ) {
                
        // Loop each particle
        for ( j = 0; j < emts[i].particles.length; j++ ) {
          
          p = emts[i].particles[j];
          
          // Draw the particle on the screen
          data.ctx.beginPath();
          data.ctx.arc( p.position.x, p.position.y, 5, 0, 2*Math.PI );
          data.ctx.fillStyle = emts[i].particleColor;
          data.ctx.fill();
          data.ctx.closePath();
          
        }
        
      }
      
    }
    function killEmitters () {
      
      var emts = data.emitters,
          i = emts.length - 1;
      
      // Loop emitters
      for ( ; i >= 0; i-- ) {
        
        // Check if the emitter has any particles
        if ( emts[i].particles.length === 0 ) {
          
          // Remove it
          emts.splice( i, 1 );
          
        }
        
      }
      
      // If no emitters then disable looping
      if ( emts.length === 0 ) data.looping = false;
      
    }
    
    return {
      
      create: function ( canvas ) {

        if ( canvas == undefined ) return;

        // Grab the pixel ratio and scale
        var res = window.devicePixelRatio || 1,
            scale = 1 / res;

        // Save the canvas and context
        data.canvas = canvas;
        data.ctx = data.canvas.getContext('2d');

        // Set the width and height properties
        data.canvas.width  = window.innerWidth * res;
        data.canvas.height = window.innerHeight * res;
        data.canvas.style.width = window.innerWidth + 'px';
        data.canvas.style.height = window.innerHeight + 'px';

        // Set the scale
        data.ctx.scale(res, res);

      },
      
      createEmitter: function ( preferences ) {
      
        // Save preference variables
        var p = preferences || {},
            pos = {x: p.position.x, y: p.position.y},
            des = {x: p.destination.x, y: p.destination.y},
            opd = p.onParticleDeath || function () {},
            oed = p.onEmitterDeath || function () {},
            sam = p.sampleAmount || 1,
            col = p.color || '#FFFFFF';

        // Create and add the emitter
        data.emitters.push( new Emitter( pos, des, opd, oed, sam, col ) );

        // Start looping
        data.looping = true;

      },
      
      loop: function () {
      
        // Make sure there are emitters active
        if ( data.looping ) {

          // Clear canvas
          data.ctx.clearRect(0, 0, data.canvas.width, data.canvas.height);

          addParticles();
          killEmitters();
          moveParticles();
          drawParticles();

        }

      }
      
    }
    
})();