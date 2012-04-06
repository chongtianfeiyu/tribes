/*
	Controls the renderer, scene, and camera of this game.
	Handles initialization and the main game loop.
*/
Game.Controllers.App = (function(options){
	
	var renderer;


	
	//Camera-constants
	var CAMERA_FOV = 45;
	var CAMERA_NEAR = 1;
	var CAMERA_FAR = 10000;
	

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
		cameraController : null,
		
		init : function() {
			//Bind all events to "this" context
			_.bindAll(this, "animate", "render", "update", "start");
			this.camera = new THREE.PerspectiveCamera( CAMERA_FOV, ASPECT, CAMERA_NEAR, CAMERA_FAR );
			

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

			var ambient = new THREE.AmbientLight( 0xCCCCCCC);
			this.scene.add( ambient );


			directionalLight = new THREE.DirectionalLight( 0xffffff );
			directionalLight.position.set( 50, 270, 100 ).normalize();
			directionalLight.intensity = 1.5;
			this.scene.add( directionalLight );

			this.cameraController = new CameraController();
			this.cameraController.init(this.camera, this.world.player);
			this.cameraController.update();
		},


		start : function() {
			this.animate();
		},
		

		animate : function() {
			requestAnimationFrame( this.animate );
			this.world.update();
			this.cameraController.update();
			
			this.render();
		},

		render : function() {
			this.renderer.render( this.scene, this.camera );
		},

		update : function() {

		}
	};
});