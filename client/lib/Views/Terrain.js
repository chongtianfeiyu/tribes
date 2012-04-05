var Terrain = (function() {
	return {
		terrain : null,
		texture : null,

		init : function() {
			// material
			var material;
			if(this.texture !== null) {
				material = new THREE.MeshBasicMaterial({
			        map: THREE.ImageUtils.loadTexture(this.texture)
			    });
			}
			else {
				material = new THREE.MeshLambertMaterial({
					color: 0xffffcc,
					wireframe: true
				});
			}
			var terrainGeometry = new THREE.PlaneGeometry(10000, 10000, 10, 10);
			
			terrainGeometry.dynamic = true;
			terrainGeometry.__dirtyVertices = true;
			terrainGeometry.computeCentroids();
			for (var i = 0; i < terrainGeometry.vertices.length; i++) {
				//terrainGeometry.vertices[i].position.z = (Math.random() * 100);
			}

			this.terrain = new THREE.Mesh(terrainGeometry, material);
			this.terrain.rotation.x = -90 *  (Math.PI /180) ;
			global.app.scene.add(this.terrain);
		}
	};
});