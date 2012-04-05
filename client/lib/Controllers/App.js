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
	//Camera-position (relative to player)
	var CAMERA_X = 0;
	var CAMERA_Y = -400;
	var CAMERA_Z = 300;

	//Renderer-constants
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;
	var ASPECT = WIDTH / HEIGHT;
	var HALF_WIDTH = WIDTH / 2;
	var HALF_HEIGHT = HEIGHT / 2;

	
	
	return {
		//Properties
		camera : null,
		projector : null,
		scene : null,
		world : null,
		
		init : function() {
			//Bind all events to "this" context
			_.bindAll(this, "animate", "render", "update", "start");
			
			//Initialize camera
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
			this.world.init(this.scene);


			var pointLight = new THREE.PointLight(0xffffff);
			pointLight.intensity = 1;
			pointLight.position = new THREE.Vector3(0, 	0, 1000);
			this.scene.add(pointLight);
			this.time = 0;

		},

		start : function() {
			this.animate();
		},

		animate : function() {
			requestAnimationFrame( this.animate );
			this.time += 0.005;
			this.world.update();
			this.camera.lookAt(this.world.player.mesh.position);
        	//Set camera position relative to player position
			this.camera.position.y = this.world.player.mesh.position.y - 400;
			this.camera.position.x = this.world.player.mesh.position.x;
			this.camera.position.z = this.world.player.mesh.position.z + 500;
			
			//Set camera rotation

			this.render();
		},

		render : function() {
			this.renderer.render( this.scene, this.camera );
		},

		update : function() {

		}
	};
});