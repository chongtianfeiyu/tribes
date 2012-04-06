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
			this.player.name = options.user;
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
			//Add players
			for (var i = data.players.length - 1; i >= 0; i--) {
				var player = data.players[i];
				var found = false;
				for (var j = this.objects.length - 1; j >= 0; j--) {
					var p = this.objects[j];
					if(p.name == player.name)
					{
						p.mesh.position.x = player.position.x;
						p.mesh.position.z = player.position.z;
						p.mesh.position.y = player.position.y;
						p.goal.x = player.goal.x;
						p.goal.y = player.goal.y;
						p.goal.z = player.goal.z;
						found = true;
						break;
					}
				};
				if(!found) {
					var p = new Game.Views.Player();
					p.name = player.name;
					p.init();
					this.objects.push(p);
				}
			};
		}
	}
})