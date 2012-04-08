Game.Views.World = (function(options){
	
	return {
		terrain : null, 
		objects : [],

		init : function() {
			_.bindAll(this, "setState", "setTerrain");
			this.initTerrain();
			this.initPlayer();
		},

		initPlayer : function() {
			this.player = new Game.Views.Player();
			this.player.name = options.name;
			this.player.uid = options.uid;
			this.player.isCurrent = true;
			this.player.init();
			this.objects.push(this.player);
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

		/*
			Synchronizes terrain data with server data 
		*/
		setTerrain : function(data) {
			for (var i = data.length - 1; i >= 0; i--) {
				var p = data[i];
				var existing = this.objects[p.uid];
				
				if(existing != undefined) {
					existing.destroy();
					existing = null;	
				}
				switch(p.classTag) {
					case "tree":
						var tree = new Game.Views.TerrainObjects.Tree()
						tree.init(p.position, p.data);
						this.objects[p.uid] = tree;
						break;
				}
				
			};
		},

		setState : function(data) {
			this.setTerrain(data.terrain);
			
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
						p.goalVector.x = player.goalVector.x;
						p.goalVector.y = player.goalVector.y;
						p.goalVector.z = player.goalVector.z;
						found = true;
						break;
					}
				};
				if(found == false) {
					var p = new Game.Views.Player();
					p.name = player.name;
					p.init();
					p.mesh.position.x = player.position.x;
					p.mesh.position.z = player.position.z;
					p.mesh.position.y = player.position.y;
					p.goalVector.x = player.goalVector.x;
					p.goalVector.y = player.goalVector.y;
					p.goalVector.z = player.goalVector.z;
					p.uid = player.uid;
					console.log("New player " + player.uid);
					this.objects.push(p);
				}
			};

			for (var i = data.deletes.length - 1; i >= 0; i--) {
				var d = data.deletes[i];
				for(var j = this.objects.length - 1; j >= 0; j--) {
					var o = this.objects[j];
					console.log(o.uid + "_ " + d);
					if(o.uid == d) {
						o.destroy();
						this.objects.splice(j, 1);
					}
				}
			};
		}
	}
})