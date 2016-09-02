var MC = MC || (function() {
    var engine = (function() {
        // Private variables protected by closure
        var FPS = 1000 / 80,
            _canvas = document.querySelector('canvas'),
            _ctx = _canvas.getContext('2d'),
            _width = _canvas.width || _canvas.style.width,
            _height = _canvas.height || _canvas.style.height,
            _gradient = _ctx.createLinearGradient(_width / 2, 0, _width / 2, _height),
            _level = 0,
            _new_missile = 10000,
            _missiles_created = 0,
            _missiles_destroyed = 0,
            _gameInterval=0,
            _rocketPosX = 0,
            _rocketPosY = 0,
            _clickX = 0,
            _clickY = 0,
            _again=false,
            _endofgame=false,			
            _entities = {
                'missiles': [],
                'targets': [],
                'rockets': [],
                'turret': []
            },
            _points=0,
            _levels = [],
            _shield=false,
            _shieldsOpp=2,
            _checkAutomaticTurret = true;        
        /**
         * Start the game
         */		
        function run(){
            startWave();
            Wave.init();
            if(!_again){
                    _gameInterval = setInterval(_gameLoop, FPS);
                    _again=true;
            }

        }
		
        function re_run(){
            _gameInterval = setInterval(_gameLoop, FPS);
        }
		
        function re_init(){
            _level = 0;
            _new_missile = 10000;
            _missiles_created = 0;
            _missiles_destroyed = 0;
            _gameInterval=0;
            _rocketPosX = 0;
            _rocketPosY = 0;
            _clickX = 0;
            _clickY = 0;
            _points=0;
            _endofgame=false;			

            _entities = {
                    'missiles': [],
                    'targets': [],
                    'rockets': [],
                    'turret': []
            };
            _levels = [];

            for(var i=0;i<initHomes.length;i++){
                    initHomes[i].stricken=3;
                    initHomes[i].y-=30;
                    initHomes[i].removed=0;					
            }
        }
		
        function initialDraw () {
            _ctx.fillStyle = "#191970";
            _ctx.fillStyle = _gradient;
            _ctx.fillRect(0, 0, _width, _height);
            _ctx.fillStyle = "#F0FFFF";
            _ctx.font="50px Georgia";
            _ctx.fillText("Vieni qui per", 90, 220);
            _ctx.fillText("difenderci soldato!!", 30, 270);
            _ctx.font="11px Georgia";
        }
		
        function finalDraw () {
            _ctx.fillStyle = "#191970";
            _ctx.fillStyle = _gradient;
            _ctx.fillRect(0, 0, _width, _height);
            _ctx.fillStyle = "#F0FFFF";
            _ctx.font="85px Georgia";
            _ctx.fillText("Hai perso!", 40, 150);
            _ctx.font="50px Georgia";
            _ctx.fillText("Punti = "+_points, 30, 320);
            _ctx.font="25px Georgia";
            _ctx.fillText("Muovi il cursore fuori dal quadrante", 40,200);
            _ctx.fillText("e torna qui per una nuova sfida!", 50, 230);        
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
        function pause(){
            clearInterval(_gameInterval);
        }
        
        // Setup click/touch events
        _canvas.addEventListener('click', launchRocket, false); //left click
        _canvas.addEventListener('contextmenu', shield, false); // right click
        
        function shield (event){              
            if (_shieldsOpp > 0) {
                _shield = true;
                _shieldsOpp--;
           
                setTimeout(function(){ 
                    _shield = false;              
                }, 2000);
            }
        }  
        
        function drawShield(){
            _ctx.fillStyle = 'rgb(179, 176, 153)';
            _ctx.fillText('ciao',100,420);
            var x = _width/2 ;
            var y = 420;
            _ctx.arc(x,y,248,0,2*Math.PI);
            _ctx.fill();
        }
        
          // lancio rocket torretta automatica
        
        function _launchRocketAutomatic() {
            if (_checkAutomaticTurret) {              
                var target = {
                
                //valori x e y del lancio modificati per precisione maggiore
                'x': Math.sin(_entities.missiles[0].angle) * ( _entities.missiles[0].distance + 100) + _entities.missiles[0].origin.x ,			
                'y': Math.cos(_entities.missiles[0].angle) * ( _entities.missiles[0].distance + 100) + _entities.missiles[0].origin.y  
                };
                if (_entities.missiles[0].pos.y > 0 && target.y < 410) {
                      _entities.rockets.push(new Rocket(
                      target,
                      {
                       'x': _entities.turret[1].pos.x + (_entities.turret[1].width / 2),
                       'y': _entities.turret[1].pos.y
                      })); 
                   
                }
                _checkAutomaticTurret = false;
                
                setTimeout(function(){
                  _checkAutomaticTurret = true;  
                },2500);
            }
        };
        
        
        function launchRocket(event) {
            var target = {
                //valori x e y del lancio modificati per precisione maggiore
                'x': event.clientX - this.offsetLeft,
                'y': event.clientY - this.offsetTop
            };
		console.log(target.x + " " + target.y);
            _clickX = event.clientX - this.offsetLeft;
            _clickY = event.clientY - this.offsetTop;
			 
            _entities.rockets.push(new Rocket(
                target,
                {
                    'x': _entities.turret[0].pos.x + (_entities.turret[0].width / 2),
                    'y': _entities.turret[0].pos.y
                }
            ));
        }
       
        /**
         * Game loop
         */
        function _gameLoop() {
		
			var count=0;
			var number_of_target=0;
			
			while(number_of_target<_entities.targets.length && !_endofgame){			
				if(_entities.targets[number_of_target].pos.removed==1)
					count++;				
				number_of_target++;										
			}
			
			//all targets destroyed
			if(count==_entities.targets.length-2){
				_endofgame=true;
				endofgamefunction();
			}
			else{
				//draw scene of the game
				number_of_target=0;
				count=0;

				// Wave end?
				if (_missiles_destroyed === Wave.getWave(_level).MissilesToDetroy) {
					_level += 1;
					startWave();
				}
			
				// Add missiles
				if (_new_missile < 0 &&
					_missiles_created < Wave.getWave(_level).MissilesToDetroy)
				{
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
                                
                                // draw the shield
                                if(_shield) {
                                    drawShield();
                                }

				// Draw entities to the canvas
				_drawDefense(_entities.targets);
				_drawEntities(_entities.missiles);
				_drawEntities(_entities.rockets);
				_drawTurretBase();
                                _drawAutomaticTurretBase();
                                //_launchRocketAutomatic();
				// Draw debug information
				debugInfo();
			}
        }
        
		
		function get_endofgame(){
			return _endofgame;
		}
		
        function debugInfo() {
            _ctx.fillStyle = 'rgb(255, 255, 255)';
            _ctx.fillText(
                'Missili lanciati = ' + _missiles_created + '/' + Wave.getWave(_level).MissilesToDetroy,
                10, 20
            );
            _ctx.fillText('Livello = ' + _level, 10, 30);
            _ctx.fillText('Punti = ' + _points, 10, 40);
            _ctx.fillText('Scudi rimasti = ' + _shieldsOpp, 10, 50);
            _ctx.font="18px Georgia";
            _ctx.fillText('Tasto destro del mouse ', 220, 20);
            _ctx.fillText('per attivare lo scudo', 220, 40);
            _ctx.font="11px Georgia";		
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
		
		function _drawDefense(entities) {
            for (var i = 0; i < entities.length; i++) {
				if(entities[i].pos.removed==0)
					entities[i].draw(_ctx);
            }
        }
        
         function _drawTurretBase () {
            var width = 35;
            var height = 20;
            var x = _width/2 - width/2;
            var y = 440;
            _ctx.fillStyle="#FF0000";
            _ctx.fillRect(x,y,width,height); 
        }
        
        // disegnare torretta automatica
        function _drawAutomaticTurretBase () {
            var width = 35;
            var height = 20;
            var x = _width/2 + 110 - width/2;
            var y = 440;
            _ctx.fillStyle="#FF0000";
            _ctx.fillRect(x,y,width,height); 
        }
        /**
         * Move each entity to the canvas
         *
         * @param {array} entities all the game entities.
         */
        var distanceShield;     
        function _moveEntities(entities) {
             var count = entities.length;
            for (var i = 0; i < count; i++) {
                entities[i].move();
                var hitShield = hasHitShield(entities[i]);
                // Check for collision
                // @TODO: Split the two hits into different sections
                if (hasHitRocketExplosion(entities[i]) || entities[i].hasHit() || (_shield && hitShield) ) {
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
        
        function hasHitShield (missile) {
            Xshield = _width/2; //coordinata x del centro dello scudo
            Yshield = 420;      //coordinata y del centro dello scudo
            radiusShield = 248; //raggio dello scudo
            var x = Xshield - missile.pos.x,  //distanza lungo x fra missili e centro dello scudo
                y = Yshield - missile.pos.y;  //distanza lungo y fra missili e centro dello scudo
            distanceShield=-1;  //distanza fra missili e centro dello scudo da calcolare
                    
            distanceShield = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

             if (distanceShield < radiusShield )
                 return true;            				               
             else
                 return false;    
        }
        
        /**
         * Check if a missile hit a rocket explosion.
         * 
         * @param {object} missile.
         * @return {bool} Boolean verdict.
         */
        function hasHitRocketExplosion(missile) {
            for(i=0;i<_entities.rockets.length;i++){
                var x = _entities.rockets[i].pos.x - missile.pos.x,
                    y = _entities.rockets[i].pos.y - missile.pos.y;

                var dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

                if (dist < _entities.rockets[i].currentRadius) {
                    _points+=1*_level + 1;
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
		
		
		
		var initHomes=[
            { 'x': 30,  'y': 430,'stricken':3,'removed':0},
            { 'x': 100, 'y': 430 ,'stricken':3,'removed':0},
            { 'x': 175, 'y': 430 ,'stricken':3,'removed':0},
            { 'x': 300, 'y': 430 ,'stricken':3,'removed':0},
            { 'x': 375, 'y': 430 ,'stricken':3,'removed':0},
            { 'x': 445, 'y': 430 ,'stricken':3,'removed':0}
        ];
		
        function addHomes(homes,level){
                level.homes=homes;			
        }
	var flag1=false;	 
        function loadLevel(level) {
            // Add game entities
            _entities.turret.push( new Turret(_width, _height, false)); 
            _entities.turret.push( new Turret(_width, _height, true));
            
            _entities.targets.push(_entities.turret[0]); // disegna torretta normale
            _entities.targets.push(_entities.turret[1]); // disegna torretta automatica
            
            if((check=="test" || check=="crit") && !flag1){
                soluzione8(_entities.turret, _width);
                flag1=true;
            } 
            addHomes(initHomes,level);
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
            var rndIndex = Math.floor(Math.random()*(targetCount-2)+2);
            var target = _entities.targets[rndIndex];
			
			if(_entities.targets[rndIndex].pos.removed==1){
				target=getRandomTarget();
			}

            return target;
        }
        
		function getEntities(){
			return _entities;
		}
        
		function removeEntities(i){
                    if(_entities.targets[i].pos.removed==0){
			_entities.targets[i].pos.stricken--;
			_entities.targets[i].height-=10;
			_entities.targets[i].pos.y+=10;
                    }
			
			
                    if(_entities.targets[i].pos.stricken==0)
                        _entities.targets[i].pos.removed=1;
		}
        /*
         * @return {float} Width of the canvas
         */
        function getWidth() {
            return _width;
        }
        
        function getPoints(){
            return _points;
        }

        // Expose public methods
        return {
            'loadLevel': loadLevel,
            'getWidth': getWidth,
            'getRandomTarget': getRandomTarget,
            'launchRocket': launchRocket,
            'run': run,
            'getEntities': getEntities,
            'removeEntities':removeEntities,
            'pause' : pause,
            're_run': re_run,
            're_init': re_init,
            'initialDraw' : initialDraw,
            'finalDraw' : finalDraw,
            'get_endofgame' : get_endofgame,
            'getPoints' : getPoints
                    
        };
    }());
    
    
    var Wave = (function() {
        var TOTAL_WAVE_NUM = 200,
            _waves = [];
        
        /**
         * Sets up the missile waves
         */
        function init() {
            for (var i = 0; i < TOTAL_WAVE_NUM; i++) {
                _waves[i] = {
                    'MissilesToDetroy': 3 + i,
                    'MirvChance': 30 + i * 4,
                    'BombChance': i * 2,
                    'FlyerChance': 5,
                    'TimeBetweenShots': 1500 - i * 100,
                    'MissileSpeed':1 + (i / 4)
                };
            }
        }
        
        /**
         * Get the wave
         */
        function getWave(level) {
            return _waves[level];
        }
        
        return {
            'init': init,
            'getWave': getWave
        };
    }());

	function endofgamefunction(){
            if(engine.get_endofgame()){
                pause();
                engine.finalDraw();
                store_points(engine.getPoints());
                engine.re_init();
                engine.loadLevel(levels[0]);	
                engine.run();			
            }		
	}
    /**
     * Game entity class.
     */
    var Entity = function Entity() {};

    /**
    * Draw the game entity on the canvas
    *
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
     *     
     */
    var Turret = function Turret(width, height, automatic) {
         
        
           this.width = 6;
           this.height = 24;    
           this.pos = {
           'x': (width / 2) - (this.width / 2),
           'y': height - 60,
		'removed':0
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
       this.height = 30;
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
        if ((this.pos.x >= this.target.pos.x &&
            this.pos.y >= this.target.pos.y &&
            this.pos.y <= this.target.pos.y + this.target.width)||this.pos.y >= this.target.pos.y)
		{		
			for(var i=0; i<engine.getEntities().targets.length;i++){
				if (this.target.pos.x==engine.getEntities().targets[i].pos.x && 
					this.target.pos.y==engine.getEntities().targets[i].pos.y){
						engine.removeEntities(i);
				}				
			}
            return true;			
        } 
		else
		{
            return false;
        }
    };
    
    var Rocket = function Rocket(target, origin) {
        this.fullRadius = 45;
        this.currentRadius = 0;
        this.expanding = true;
        this.explosionSpeed = 1;
        this.exploded = false;
        this.speed = 10;
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
     *
     */
    Rocket.prototype.move = function() {
        if (this.exploded) {
            return;
        }
        
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
        'homes': [],
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
        if(flag==1  && !engine.get_endofgame()){
            engine.re_run();
        }
        else{   
            engine.run();
            flag=1;
        }
    }
    function getPoints(){return engine.getPoints();}
    
    return {
        'init': init,
        'pause' : pause,
        're_run': re_run,
        'getPoints' : getPoints
    };

}());