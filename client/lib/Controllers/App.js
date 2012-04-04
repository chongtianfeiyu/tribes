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
	var CAMERA_Z = 200;

	//Renderer-constants
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;
	var ASPECT = WIDTH / HEIGHT;
	
	return {
		//Properties
		camera : null,
		projector : null,
		scene : null,
		world : null,
		
		init : function() {
			//Bind all events to "this" context
			_.bindAll(this, "animate", "render", "update", "start");
			

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


			 // add subtle ambient lighting
	        var ambientLight = new THREE.AmbientLight(0x555555);
	        this.scene.add(ambientLight);
	
	        // add directional light source
	        var directionalLight = new THREE.DirectionalLight(0xffffff);
	        directionalLight.position.set(10, 10, 20);
	        this.scene.add(directionalLight);


			//Initialize camera
			this.camera = new THREE.PerspectiveCamera( CAMERA_FOV, ASPECT, CAMERA_NEAR, CAMERA_FAR );
			this.camera.position.y = CAMERA_Y;
			this.camera.position.z = CAMERA_Z;
			this.camera.position.x = CAMERA_X;
		},

		start : function() {
			this.animate();
		},

		animate : function() {
			requestAnimationFrame( this.animate );
			
			var t = new Date().getTime()/800;
			
			this.camera.position.x = Math.sin( t * 0.5 ) * 1000;
			this.camera.position.y = Math.cos( t * 0.5 ) * 1000 - 400;
			this.camera.lookAt(this.scene.position);
			this.render();
		},

		render : function() {
			this.renderer.render( this.scene, this.camera );
		},

		update : function() {

		}
	};
});