/**
 * Missile Commnad HTML5 JavaScript clone
 * 
 * @author  Andrew Mason
 * @contact andrew@coderonfire.com
 * 
 */



var MC = MC || (function() { // self invoking anonymous function expression. Creates a temporary local scope 
    // it's all done here the game
    var engine = (function() { // the return is assigned to engine
        // Private variables protected by closure
        var FPS = 1000 / 80, // piu valore è piccolo maggiore è la velocità gioco
            _canvas = document.querySelector('canvas'),
            _ctx = _canvas.getContext('2d'),
            _width = _canvas.width || _canvas.style.width,
            _height = _canvas.height || _canvas.style.height,
            _gradient = _ctx.createLinearGradient(_width / 2, 0, _width / 2, _height),
            _level = 0,
            _new_missile = 10000,
            _missiles_created = 0,
            _missiles_destroyed = 0,
            _gameInterval,
            _rocketPosX = 0,
            _rocketPosY = 0,
            _clickX = 0,
            _clickY = 0,
            
            // javascript object
            _entities = {
                'missiles': [],
                'targets': [],
                'rockets': [],
                'turret': null
                
            },
            _levels = [];

        /**
         * Start the game
         */
        function run() {
            startWave();
            Wave.init();
            _gameInterval = setInterval(_gameLoop, FPS); // setInterval è una funzione del window object. Chiama una funzione ogni tot milliseconds, return id timer
        }
        
        function re_run(){
            _gameInterval = setInterval(_gameLoop, FPS);
        }
        function initialDraw () {
            _ctx.fillStyle = "#191970";
            _ctx.fillRect(0, 0, _width, _height);
            _ctx.fillStyle = "#F0FFFF";
            _ctx.font="50px Georgia";
            _ctx.fillText("Come here to play", 45, 220);
            _ctx.fillText("soldier!!", 135, 270);
            _ctx.font="11px Georgia";
        }
        function startWave() {
            _new_missile = 0;
            _missiles_created = 0;
            _missiles_destroyed = 0;
        }
        
        /**
         * Pause game
         */
        function pause() {
            clearInterval(_gameInterval);
        }
        
        // Setup click/touch events
        _canvas.addEventListener('click', launchRocket, false);
        
        
        function launchRocket(event) {
            var target = {

                'x': event.clientX - this.offsetLeft + 150,
                'y': event.clientY - this.offsetTop + 75
                
            };
             _clickX = event.clientX - this.offsetLeft;
             _clickY = event.clientY - this.offsetTop ;
            _entities.rockets.push(new Rocket(
                target,
                {
                    'x': _entities.turret.pos.x + (_entities.turret.width / 2),
                    'y': _entities.turret.pos.y
                }
            ));
        }

        /**
         * Game loop
         * 
         */
        function _gameLoop() {
            // Wave end?
            if (_missiles_destroyed === Wave.getWave(_level).MissilesToDetroy) {
                _level += 1;
                startWave();
            }
        
            // Add missiles
            if (_new_missile < 0 &&
                _missiles_created < Wave.getWave(_level).MissilesToDetroy
            ) {
                _entities.missiles.push(
                    new Missile(false, false, Wave.getWave(_level).MissileSpeed)
                );
                _missiles_created += 1;
                _new_missile += Wave.getWave(_level).TimeBetweenShots;
            }
            
            _new_missile -= FPS;
        
            // Clear the stage
            _ctx.fillStyle = _gradient;
            _ctx.fillRect(0, 0, _width, _height);

            // Move missiles & rockets
            _moveEntities(_entities.missiles);
            var count = _entities.rockets.length;
            for (var i = 0; i < count; i++) {
                _entities.rockets[i].move();
                _rocketPosX = _entities.rockets[i].pos.x ;
                _rocketPosY = _entities.rockets[i].pos.y ;
            }

            // Draw entities to the canvas
            _drawEntities(_entities.targets);
            _drawEntities(_entities.missiles);
            _drawEntities(_entities.rockets);
            
            // Draw debug information
            debugInfo();
        }
        
        function debugInfo() {
            _ctx.fillStyle = 'rgb(255, 255, 255)';
            _ctx.fillText(
                'Missile launched = ' + _missiles_created + '/' + Wave.getWave(_level).MissilesToDetroy,
                10, 20
            );
            _ctx.fillText('Level = ' + _level, 10, 30);
            _ctx.fillText('click x ='+ _clickX + '   click y ='+ _clickY, 10,40 );
            _ctx.fillText('Rocket pos x =' + _rocketPosX ,10,50);
            _ctx.fillText('Rocket pos y =' + _rocketPosY ,10,60);
            
        }

        /**
         * Draw each entity to the canvas
         *
         * @param {array} entities All the game entities.
         */
        function _drawEntities(entities) {
            for (var i = 0; i < entities.length; i++) {
                entities[i].draw(_ctx);
                
                // @TODO Move rockets out somewhere better
                if (entities[i].currentRadius <= 1 && !entities[i].expanding) {
                    entities.splice(i, 1);
                }
            }
        }

        /**
         * Move each entity to the canvas
         *
         * @param {array} entities all the game entities.
         */
        function _moveEntities(entities) {
            var count = entities.length;
            for (var i = 0; i < count; i++) {
                entities[i].move();
                
                // Check for collision
                // @TODO: Split the two hits into different sections
                if (hasHitRocketExplosion(entities[i]) || entities[i].hasHit()) {
                    // Remove the missile
                    entities.splice(i, 1);
                    count -= 1;
                    // Note the destroyed missile
                    _missiles_destroyed += 1;
                    // Reset missile timer to trigger creation of new missile
                    _new_missile = 0;
                }
                
                // Pause the game if there's no missiles
                if (_entities.missiles.length <= 0) {
                   // _pause();
                }
            }
        }
        
        /**
         * Check if a missile hit a rocket explosion.
         * 
         * @param {object} missile.
         * @return {bool} Boolean verdict.
         */
        function hasHitRocketExplosion(missile) {
            for (var i = 0; i < _entities.rockets.length; i++) {
                var x = _entities.rockets[i].pos.x - missile.pos.x,
                    y = _entities.rockets[i].pos.y - missile.pos.y;
                    
                var dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                
                if (dist < _entities.rockets[i].currentRadius) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Load and setup a level
         *
         * @param {object} level Level data.
         */
        function loadLevel(level) {
            // Add game entities
            _entities.turret = new Turret(_width, _height);
            _entities.targets.push(_entities.turret);
            for (var i = 0; i < level.homes.length; i++) {
                _entities.targets.push(new Home(level.homes[i]));
            }

            // Set background gradient
            for (var i = 0; i < level.background.length; i++) {
                _gradient.addColorStop(
                    level.background[i].position,
                    level.background[i].colour
                );
            }

        }

        /**
         * Get random target location
         *
         * @return {object} Target's location.
         */
        function getRandomTarget() {
            var targetCount = _entities.targets.length;
            var rndIndex = Math.floor(targetCount * Math.random());
            var target = _entities.targets[rndIndex];

            return target;
        }
        
        
        /*
         * @return {float} Width of the canvas
         */
        function getWidth() {
            return _width;
        }

        // Expose public methods, the others are private
        return {
            'loadLevel': loadLevel,
            'getWidth': getWidth,
            'getRandomTarget': getRandomTarget,
            'launchRocket': launchRocket,
            'run': run,
            'pause' : pause,
            're_run': re_run,
            'initialDraw' : initialDraw
        };
    }) (); //private field
    
    
    var Wave = (function() {
        var TOTAL_WAVE_NUM = 40, // number of levels
            _waves = [];
        
        /**
         * Sets up the missile waves
         */
        function init() {
            for (var i = 0; i < TOTAL_WAVE_NUM; i++) {
                _waves[i] = {
                    'MissilesToDetroy': 10 + i,
                    'MirvChance': 30 + i * 4,
                    'BombChance': i * 2,
                    'FlyerChance': 5,
                    'TimeBetweenShots': 3000 - i * 200,
                    'MissileSpeed': 0.3 + (i / 5) // diminuisci valore per maggiore lentezza
                };
            }
        }
        
        /**
         * Get the wave
         */
        function getWave(level) {
            return _waves[level];
        }       
        // metodi visibili all'esterno
        return {
            'init': init,
            'getWave': getWave
        };
    }()); // private field


    /**
     * Game entity class.
     * 
     */
    var Entity = function Entity() {}; //private constructor with weird syntax

    /**
    * Draw the game entity on the canvas
    * We use the prototype property in order to add a method to existing objects
    * Turret and homes
    * @param {elm} ctx Canvas context.
    */
    Entity.prototype.draw = function(ctx) {
        ctx.fillStyle = this.colour;
        ctx.fillRect(
            this.pos.x,
            this.pos.y,
            this.width,
            this.height
        );
    };

    /**
     * Turret launcher class
     *
     * @param {object} pos Location position.
     */
    var Turret = function Turret(width, height) {
       this.width = 20;
       this.height = 20;
       this.pos = {
        'x': (width / 2) - (this.width / 2),
        'y': 400
       };
       this.colour = 'rgb(255, 0, 0)';
    };
    Turret.prototype = new Entity();

    /**
     * Home entity class
     *
     * @param {object} pos Location position.
     */
    var Home = function Home(pos) {
       this.pos = pos;
       this.width = 20;
       this.height = 10;
       this.colour = 'rgb(0, 100, 250)';
    };
    Home.prototype = new Entity();

    /**
     * Missile class
     *
     * @param {object} origin Starting position.
     * @param {object} target Target destination position.
     */
    var Missile = function Missle(origin, target, speed) {
        this.pos = {};
        this.origin = origin || {
            'x': engine.getWidth() * Math.random(),
            'y': 0
        };
        
        this.target = target || engine.getRandomTarget();
        
        // Calculate angle
        var x = (this.target.pos.x + this.target.width / 2) - this.origin.x;
        var y = this.target.pos.y - this.origin.y;
        this.angle = Math.atan(x / y);

        this.colour = 'rgb(0, 255, 0)';
        this.speed = speed;
        this.distance = 0;
    };

    Missile.prototype.draw = function(ctx) {
        ctx.strokeStyle = this.colour;
        ctx.beginPath();
        ctx.moveTo(this.origin.x, this.origin.y);
        ctx.lineTo(
            this.pos.x,
            this.pos.y
        );
        ctx.closePath();
        ctx.stroke();
    };

    Missile.prototype.move = function() {
        this.distance += this.speed;
        this.pos.x = Math.sin(this.angle) * this.distance + this.origin.x;
        this.pos.y = Math.cos(this.angle) * this.distance + this.origin.y;
    };
    
    Missile.prototype.hasHit = function() {
        if (this.pos.x >= this.target.pos.x &&
            this.pos.y >= this.target.pos.y &&
            this.pos.y <= this.target.pos.y + this.target.width
        ) {
            return true;
        } else {
            return false;
        }
    };
    
    var Rocket = function Rocket(target, origin) {
        this.fullRadius = 45;
        this.currentRadius = 0;
        this.expanding = true;
        this.explosionSpeed = 1;
        this.exploded = false;
        //precisione dipende da velocità poichè il razzo (linea) si muove ogni tot pixel 
        this.speed = 5; 
        this.distance = 0;
        
        this.target = target;
        
        // @TODO: Weird turret reference issue causing red turrets to move
        this.origin = origin;
        this.pos = {x: origin.x, y:origin.y};
        
        // Calculate angle
        var x = this.target.x - this.origin.x;
        var y = this.target.y - this.origin.y;
        this.angle = Math.atan(x / y);
        
    };
    
    /* Some comment.
     * queste due funzioni sono lanciate nel game loop
     */
    Rocket.prototype.move = function() {
        if (this.exploded) {
            return;
        }
        // this.distance = this.distance - this.speed. questo valore deve essere negativo per orientamento corretto
        this.distance -= this.speed; 
        
        this.pos.x = Math.sin(this.angle) * this.distance + this.origin.x;
        this.pos.y = Math.cos(this.angle) * this.distance + this.origin.y;
        
        if (this.pos.y < this.target.y) {
            this.exploded = true;
        }
    };
    
    Rocket.prototype.draw = function(ctx) {
        if (this.exploded) {
            if (this.expanding) {
                this.currentRadius += this.explosionSpeed;
                
                if (this.currentRadius >= this.fullRadius) {
                    this.expanding = false;
                }
            } else {
                this.currentRadius -= this.explosionSpeed;
            }
            
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.currentRadius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        } else {
            ctx.strokeStyle = 'rgb(255, 255, 255)';
            ctx.beginPath();
            ctx.moveTo(this.origin.x, this.origin.y);
            ctx.lineTo(
                this.pos.x,
                this.pos.y
            );
            ctx.closePath();
            ctx.stroke(); // disegna linea
        }        
    };


    /**
     * Levels
     */
    var levels = [];
    levels[0] = {
   
        'homes': [
            { 'x': 45,  'y': 400 },
            { 'x': 85, 'y': 405 },
            { 'x': 158, 'y': 400 },
            { 'x': 270, 'y': 410 },
            { 'x': 325, 'y': 405 },
            { 'x': 395, 'y': 400 }
        ],
        'background': [
            {'colour': 'rgb(0, 5, 20)', 'position': 0},
            {'colour': 'rgb(0, 30, 70)', 'position': 0.7},
            {'colour': 'rgb(0, 60, 120)', 'position': 1}
        ],
        'rocketCount': 5,
        'attackRate': 1,
        'timer': 30
    };

    function init() {
        engine.loadLevel(levels[0]); 
        engine.initialDraw();
    }
    
    function pause() {
        engine.pause();
    }
    
    //check se è la prima volta che vado sopra al gioco;
    var flag=0;
    
    function re_run(){
        if(flag==1){
            engine.re_run();
        }
        else{   
            engine.run();
            flag=1;
        }
    }
    
    return {
        'init': init,
        'pause' : pause,
        're_run': re_run
    };
   
})();

MC.init(); //inizializza gioco 
