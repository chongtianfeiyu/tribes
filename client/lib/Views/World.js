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
		},

		update : function() {
			for (var i = this.objects.length - 1; i >= 0; i--) {
				var o = this.objects[i];
				if(o.update)
					o.update();
			};

			this.player.update();
		},

		initTerrain : function() {
			this.terrain = new Terrain();
			this.terrain.init();
		},

		setTerrain : function(data) {
			for (var i = data.trees.length - 1; i >= 0; i--) {
				var tree = data.trees[i];
				new Game.Views.TerrainObjects.Tree().init(tree.start, tree.data);
			};
		},

		setState : function(data) {
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
				
			for (var i = this.objects.length - 1; i >= 0; i--) {
				var p = this.objects[i];
				if(p.name != null) {
					var remove = true;
					for(var j = data.players.length - 1; j >= 0; j--) {
						var q = data.players[j];
						if(q.name == p.name) {
							remove = false;
							break;
						}
					}
					if(remove == true) {
						p.destroy();
						this.objects.splice(i, 1);
					}
				}
			};
		}
	}
})