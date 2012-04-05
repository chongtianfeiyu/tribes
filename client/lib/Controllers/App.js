/*
	Controls the renderer, scene, and camera of this game.
	Handles initialization and the main game loop.
*/
Game.Controllers.App = (function(options){
	
	var renderer;


	//Helpers
	var DEG_TO_RAD = 2 * Math.PI / 360,
	    RAD_TO_DEG = 1 / DEG_TO_RAD;

	//Camera-constants
	var CAMERA_FOV = 45;
	var CAMERA_NEAR = 1;
	var CAMERA_FAR = 10000;
	//Camera-position (relative to player)
	var CAMERA_OFFSET_Y = 400;
	var CAMERA_OFFSET_X = 500 * Math.sin(1 * DEG_TO_RAD);
	var CAMERA_OFFSET_Z = 500 * Math.cos(1 * DEG_TO_RAD);

	//Renderer-constants
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;
	var ASPECT = WIDTH / HEIGHT;
	var HALF_WIDTH = WIDTH / 2;
	var HALF_HEIGHT = HEIGHT / 2;
	
	//Camera position relative to player
	return {
		//Properties
		camera : null,
		projector : null,
		scene : null,
		world : null,
		
		init : function() {
			//Bind all events to "this" context
			_.bindAll(this, "animate", "render", "update", "start");

			this.camera = new THREE.PerspectiveCamera( CAMERA_FOV, ASPECT, CAMERA_NEAR, CAMERA_FAR );
			this.camera.position.y = CAMERA_OFFSET_Y;
			this.camera.position.x = CAMERA_OFFSET_X;
			this.camera.position.z = CAMERA_OFFSET_Z;
			
			
			//Initialize scene
			this.scene = new THREE.Scene();
			//Initialize projector
			this.projector = new THREE.Projector();

			//Initialize renderer
			this.renderer = new THREE.WebGLRenderer( { antialias : true } );
			this.renderer.setSize( WIDTH, HEIGHT );
			document.body.appendChild(this.renderer.domElement);

			this.world = new Game.Views.World({});
			this.world.init();


			var pointLight = new THREE.PointLight(0xffffff);
			pointLight.intensity = 1;
			pointLight.position = new THREE.Vector3(0, 800, 200);
			this.scene.add(pointLight);
			

			this.deltaT = 0;

		},

		accDeltaX : 0,

		start : function() {
			this.animate();
		},
		
		rotateVel : 0,

		animate : function() {
			requestAnimationFrame( this.animate );
			this.world.update();
			if(Input.mouseHold()) {
				this.accDeltaX += Input.deltaX * 0.5;
			}
			var rad = this.accDeltaX * DEG_TO_RAD;
			CAMERA_OFFSET_X = 500 * Math.sin(rad);
			CAMERA_OFFSET_Z = 500 * Math.cos(rad);
			this.camera.position.x = this.world.player.mesh.position.x + CAMERA_OFFSET_X;
			this.camera.position.z = this.world.player.mesh.position.z + CAMERA_OFFSET_Z;
			this.camera.lookAt(this.world.player.mesh.position);
			this.render();
		},

		render : function() {
			this.renderer.render( this.scene, this.camera );
		},

		update : function() {

		}
	};
});