Game.Views.World = (function(options){
	
	return {
		terrain : null, 
		objects : [],

		init : function() {
			this.initTerrain();
			this.initPlayer();
		},

		initPlayer : function() {
			this.player = new Game.Views.Player();
			this.player.init();
			this.objects.push(this.player);
		},

		update : function() {
			for (var i = this.objects.length - 1; i >= 0; i--) {
				var o = this.objects[i];
				if(o.update)
					o.update();
			};
		},

		initTerrain : function() {
			var geometry = new THREE.PlaneGeometry(10000, 10000, 10, 10);
			geometry.dynamic = true;
			geometry.__dirtyVertices = true;
			geometry.computeCentroids();
			
			var material = new THREE.MeshLambertMaterial({
				color: 0xFFFFCC
			});
			this.terrain = new THREE.Mesh(geometry, material);
			global.app.scene.add(this.terrain);
			

			// material
			var material = new THREE.MeshLambertMaterial({
				color: 0x3F3A30	
			});
			var height = 10;
			for (var i = 1; i <= 23; i++) {
				// cube
			    var cube = new THREE.Mesh(new THREE.CubeGeometry(10, 200 / i, height), material);
			    cube.overdraw = true;

			    
			    cube.position.x = 100 + Math.random() * 10;

			    cube.position.y = -200 + Math.random() * 10;
			    cube.position.z = i * height;
			    global.app.scene.add(cube);
			};

			for (var i = 1; i <= 23; i++) {
				// cube

			    var cube = new THREE.Mesh(new THREE.CubeGeometry(200 / i, 200 / i, height), material);
			    cube.overdraw = true;

			    
			    cube.position.x = -120 + Math.random() * 10;

			    cube.position.y = -200;
			    cube.position.z = i * height;
			    
			    global.app.scene.add(cube);
			};

			for (var i = 1; i <= 20; i++) {
				// cube
				
			    var cube = new THREE.Mesh(new THREE.CubeGeometry(200 / i / Math.random() * 2, 200 / i, height), material);
			    cube.overdraw = true;

			    
			    cube.position.x = Math.random() * 20;

			    cube.position.y = 200;
			    cube.position.z = i * height;
			    
			    global.app.scene.add(cube);
			};

		}
	}
})