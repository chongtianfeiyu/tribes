var Terrain = (function() {
	return {
		terrain : null,
		desert : "/resources/textures/terrain/desert.png",
		dirtLight : "/resources/textures/terrain/dirt-lighter.png",
		dirt : "/resources/textures/terrain/dirt.png",
		grassLight : "/resources/textures/terrain/grass-lighter.png",
		grass : "/resources/textures/terrain/grass.png",
		rock : "/resources/textures/terrain/rock.png",
		sand : "/resources/textures/terrain/sand.png",
		swamp : "/resources/textures/terrain/swamp.png",
		water : "/resources/textures/terrain/water.png",

		init : function() {
			var grassTexture = THREE.ImageUtils.loadTexture(this.grass);

			grassTexture.wrapS = THREE.RepeatWrapping;
			grassTexture.wrapT = THREE.RepeatWrapping;
			grassTexture.repeat.x = 100;
			grassTexture.repeat.y = 100;
			grassTexture.doubleSided = true;


			var geometry = new THREE.PlaneGeometry(100000, 100000, 100, 100);
			

			this.terrain = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
				map : grassTexture
			}));
			this.terrain.rotation.x = -90  * MathHelpers.DEG_TO_RAD;
			global.app.scene.add(this.terrain);
		}
	};
});