Game.Views.World = (function(options){
	
	return {
		init : function() {
			this.initTerrain();
			this.initPlayer();
		},

		initPlayer : function() {
			this.player = new Game.Views.Player();
			this.player.init();
		},

		initTerrain : function() {
			this.plane = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000), new THREE.MeshLambertMaterial({
				color: 0xCCCCCC
			}));
			global.app.scene.add(this.plane);

			// material
			var material = new THREE.MeshLambertMaterial({
				color: 0x3F3A30	
			});
			var height = 10;
			for (var i = 1; i <= 10; i++) {
				// cube
			    var cube = new THREE.Mesh(new THREE.CubeGeometry(10, 200 / i, height), material);
			    cube.overdraw = true;

			    
			    cube.position.x = 100;

			    cube.position.y = -200;
			    cube.position.z = i * height;
			    global.app.scene.add(cube);
			};

			for (var i = 1; i <= 10; i++) {
				// cube
			    var cube = new THREE.Mesh(new THREE.CubeGeometry(200 / i, 200 / i, height), material);
			    cube.overdraw = true;

			    
			    cube.position.x = -120;

			    cube.position.y = -200;
			    cube.position.z = i * height;
			    
			    global.app.scene.add(cube);
			};

		}
	}
})