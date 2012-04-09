Game.Controllers.World = (function(options){
	
	return {
		terrain : null, 
		objects : [],
		intersectMeshes : [],

		init : function() {
			_.bindAll(this, "setState", "setTerrain");
			this.initTerrain();
			this.initPlayer();
		},

		addObject : function(o) {
			o.objectsIndex = this.objects.push(o)-1;
			if(o.getIntersectMeshes) {
				o.intersectMeshIndexes = [];
				var oIntersectMeshes = o.getIntersectMeshes();
				for (var i = oIntersectMeshes.length - 1; i >= 0; i--) {
					o.intersectMeshIndexes.push(this.intersectMeshes.push(oIntersectMeshes[i]) - 1);
				};
			}
		},

		removeObject : function(o) {
			this.objects.splice(o.objectsIndex, 1);
			for (var i = o.intersectMeshIndexes.length - 1; i >= 0; i--) {
				this.intersectMeshes.splice(o.intersectMeshIndexes[i], 1);
			};
			
		},

		initPlayer : function() {
			this.player = new Game.Views.Player();
			this.player.name = options.name;
			this.player.uid = options.uid;
			this.player.isCurrent = true;
			this.player.init();
			this.addObject(this.player);
		},

		initTerrain : function() {
			this.terrain = new Terrain();
			this.terrain.init();
		},

		findFromUid : function(uid) {
			for (var i = this.objects.length - 1; i >= 0; i--) {
				var o = this.objects[i];
				if(o.uid == uid)
					return o;
			};
		},

		/*
			Synchronizes terrain data with server data 
		*/
		setTerrain : function(data) {
			for (var i = data.length - 1; i >= 0; i--) {
				var p = data[i];
				var existing = this.findFromUid(p.uid);
				
				if(existing != undefined) {
					existing.destroy();
					this.removeObject(existing);
					existing = null;	
				}
				switch(p.classTag) {
					case "tree":
						var tree = new Game.Views.TerrainObjects.Tree()
						tree.init(p.position, p.data);
						tree.uid = p.uid;
						this.addObject(tree);
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
					if(p.uid == player.uid)
					{
						p.update(player);
						found = true;
						break;
					}
				};
				if(found == false) {
					console.log("add " + p.name);
					var p = new Game.Views.Player();
					p.name = player.name;
					p.uid = player.uid;
					p.init();
					p.update(player);
					this.addObject(p);
				}
			};

			for (var i = data.deletes.length - 1; i >= 0; i--) {
				var d = data.deletes[i];
				for(var j = this.objects.length - 1; j >= 0; j--) {
					var o = this.objects[j];
					if(o.uid == d) {
						console.log("delete " + o.name);
						o.destroy();
						this.removeObject(o);
					}
				}
			};
		}
	}
})