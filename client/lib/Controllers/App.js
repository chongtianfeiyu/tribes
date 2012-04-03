/*
	Controls the renderer, scene, and camera of this game.
	Handles initialization and the main game loop.
*/
Game.Controllers.App = (function(options){
	
	var renderer,
		camera,
		scene;

	//Camera-constants
	var CAMERA_FOV = 55;
	var CAMERA_NEAR = 1;
	var CAMERA_FAR = 10000;

	//Renderer-constants
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;
	var ASPECT = WIDTH / HEIGHT;
	
	return {
		//Properties
		camera : camera,
		renderer : renderer,
		scene : scene,
		
		init : function() {
			_.bindAll(this, "animate", "render", "update");
			//Initialize scene
			this.scene = new THREE.Scene();

			//Initialize renderer
			this.renderer = new THREE.WebGLRenderer( { antialias : true } );
			this.renderer.setSize(WIDTH, HEIGHT);
			document.body.appendChild(this.renderer.domElement);
		},

		animate : function() {

		},

		render : function() {

		},

		update : function() {

		}
	};
});