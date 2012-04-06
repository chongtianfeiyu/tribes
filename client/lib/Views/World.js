Game.Views.World = (function(options){
	
	return {
		terrain : null, 
		objects : [],
		players : [],

		init : function() {
			_.bindAll(this, "setState");
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
			this.terrain = new Terrain();
			this.terrain.init();
		},

		setState : function(data) {
			for (var i = data.players.length - 1; i >= 0; i--) {
				var player = data.players[i];
				var found = false;
				for (var i = this.players.length - 1; i >= 0; i--) {
					var p = this.players[i];
					if(p.name == player.name)
					{
						p.mesh.position.x = player.position.x;
						p.mesh.position.z = player.position.z;
						found = true;
						break;
					}
				};
				if(!found) {
					var p = new Game.Views.Player();
					p.name = player.name;
					p.init();
					console.log("NOT FOUND, ADDING");
					this.players.push(p);
				}
			};
		}
	}
})