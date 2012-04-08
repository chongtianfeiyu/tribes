Game.Views.World = (function(options){
	
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
			if(o.getIntersectMesh)
				o.intersectMeshIndex = this.intersectMeshes.push(o.getIntersectMesh())-1;
		},

		removeObject : function(o) {
			this.objects.splice(o.objectsIndex, 1);
			this.intersectMeshes.splice(o.intersectMeshIndex, 1);
		},

		initPlayer : function() {
			this.player = new Game.Views.Player();
			this.player.name = options.name;
			this.player.uid = options.uid;
			this.player.isCurrent = true;
			this.player.init();
			this.addObject(this.player);
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
						console.log("update " + p.name);
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
					console.log("add " + p.name);
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
						this.meshes.splice(o.meshesIndex);
						this.objects.splice(j, 1);
					}
				}
			};
		}
	}
})