Game.Views.Player = (function(){
	return {
		position : null,

		init : function() {
			// material
			var material = new THREE.MeshLambertMaterial({
				color: 0x111111	
			});
			// cube
			var cube = new THREE.Mesh(new THREE.CubeGeometry(10, 10, 10), material);
			cube.overdraw = true;
			this.position = cube.position;
			global.app.scene.add(cube);
		}
	}
})