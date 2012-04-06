var Terrain = (function() {
	return {
		terrain : null,
		texture : "/resources/textures/terrain/grass.png",

		init : function() {
			
			// material
			var text = THREE.ImageUtils.loadTexture(this.texture);
			text.wrapS = THREE.RepeatWrapping;
			text.wrapT = THREE.RepeatWrapping;
			text.repeat.x = 100;
			text.repeat.y = 100;
			text.doubleSided = true;
			var material = new THREE.MeshLambertMaterial({
				map: text
			});
			var resolutionX = 100;
			var resolutionY = 100;
			var terrainGeometry = new THREE.PlaneGeometry(100000, 100000, 100, 100);
			terrainGeometry.doubleSided = true;
			terrainGeometry.dynamic = true;
			terrainGeometry.__dirtyVertices = true;
			terrainGeometry.computeCentroids();
			var factorX = 5;
			var factorY = 3;
			var factorZ = 80;
			var noise = new SimplexNoise();
			for (var i = 0; i < terrainGeometry.vertices.length; i++) {
				n = noise.noise(terrainGeometry.vertices[i].position.x / resolutionX / factorX, terrainGeometry.vertices[i].position.y / resolutionY / factorY);
				terrainGeometry.vertices[i].position.z = n * factorZ - 10;
			}
			this.terrain = new THREE.Mesh(terrainGeometry, material);
			this.terrain.rotation.x = -90 *  (Math.PI /180) ;
			global.app.scene.add(this.terrain);
			
		}
	};
});