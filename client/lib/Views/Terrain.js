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
			var terrainGeometry = new THREE.PlaneGeometry(100000, 100000, 10, 10);
			
			this.terrain = new THREE.Mesh(terrainGeometry, material);
			this.terrain.rotation.x = -90 *  (Math.PI /180) ;
			global.app.scene.add(this.terrain);
			
		}
	};
});