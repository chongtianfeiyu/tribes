var Terrain = (function() {
	return {
		terrain : null,
		desert : "resources/textures/terrain/desert.png",
		dirtLight : "resources/textures/terrain/dirt-lighter.png",
		dirt : "resources/textures/terrain/dirt.png",
		grassLight : "resources/textures/terrain/grass-lighter.png",
		grass : "resources/textures/terrain/grass.png",
		rock : "resources/textures/terrain/rock.png",
		sand : "resources/textures/terrain/sand.png",
		swamp : "resources/textures/terrain/swamp.png",
		water : "resources/textures/terrain/water.png",

		init : function() {
			var grassTexture = THREE.ImageUtils.loadTexture(this.desert);

			grassTexture.wrapS = THREE.RepeatWrapping;
			grassTexture.wrapT = THREE.RepeatWrapping;
			grassTexture.repeat.x = 100;
			grassTexture.repeat.y = 100;
			grassTexture.doubleSided = true;
			//TODO: Synchronize values w/ server.
			this.mapWidth = 100000;
			this.mapHeight = this.mapWidth;
			this.fragmentCount = 300;
			console.log(this.mapWidth);
			this.heightMap = [];

			for(var i = 0; i < this.fragmentCount; i++){
				this.heightMap[i] = [];
				for(var j = 0; j < this.fragmentCount; j++) {
					this.heightMap[i][j] =0;
				}
			}

			this.scaleFactor = this.mapWidth / this.fragmentCount;

			var geometry = new THREE.PlaneGeometry(this.mapWidth, this.mapHeight, this.fragmentCount-1, this.fragmentCount - 1);
			var currentX = 0, currentZ = 0;
			for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
				geometry.vertices[ i ].position.z = this.heightMap[currentZ][currentX];
				if((i % this.fragmentCount) == 0) {
					currentZ = 0;
					currentX++;
				}
				else {
					currentZ ++;
				}
			}

			this.terrain = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
				map : grassTexture
			}));

			this.terrain.rotation.x = -90  * MathHelpers.DEG_TO_RAD;
			this.terrain.position.x = this.mapWidth/2;
			this.terrain.position.z = this.mapHeight/2;
			global.app.scene.add(this.terrain);
		},

		getTerrainHeight : function(xPos, zPos) {
			return 0;
			var x = Math.round(xPos / this.scaleFactor);
			var z = Math.round(zPos / this.scaleFactor);
			var xPlusOne = x + 1;
			var zPlusOne = z + 1;
				

			var triZ0 = this.heightMap[z]		[	x];
			var triZ1 = this.heightMap[z]		[	xPlusOne];
			var triZ2 = this.heightMap[zPlusOne][ 	x];
			var triZ3 = this.heightMap[zPlusOne][	xPlusOne];


			var height = 0;
			var sqX = (xPos / this.scaleFactor) - x;
			var sqZ = (zPos / this.scaleFactor) - z;

			if((sqX + sqZ)<1) {
				height = triZ0;
				height += (triZ1 - triZ0) * sqX;
        		height += (triZ2 - triZ0) * sqZ;
			}
			else {
				height = triZ3;
        		height += (triZ1 - triZ3) * (1 - sqZ);
        		height += (triZ2 - triZ3) * (1 - sqX);
			}
			return height;

		},


		center : function() {
			return {x : this.mapWidth / 2, z : this.mapHeight / 2};
		}
	};
});