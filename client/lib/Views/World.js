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
			// material
			var material = new THREE.MeshLambertMaterial({
				color: 0xFFFFFF
			});
			var terrainGeometry = new THREE.PlaneGeometry(1000, 1000);
			
			this.terrain = new THREE.Mesh(terrainGeometry, material);
			this.terrain.rotation.x = -90 *  (Math.PI /180) ;
			global.app.scene.add(this.terrain);
		}
	}
})