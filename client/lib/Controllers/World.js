Game.Controllers.World = (function(options){
	
	return {
		terrain : null, 
		objects : [],
		intersectMeshes : [],

		init : function() {
			_.bindAll(this, "setState", "setTerrain", "animationUpdate");
			this.initTerrain();
			this.initPlayer();
		},

		animationUpdate : function() {
			if(this.player.position == undefined) return;
			var playerPos = this.player.position;

			for(uid in this.objects){
				var o = this.objects[uid];
				var distance = new THREE.Vector3().sub(playerPos, o.position).length();
				if(distance > 3000) {
					o.destroy();
					this.removeObject(o);
				}
				else if(o.animationUpdate)
					o.animationUpdate();
			}
		},

		addObject : function(o) {
			this.objects[o.uid] = o;
			console.log("Adding object " + o.uid);
			if(o.getIntersectMeshes) {
				o.intersectMeshIndexes = [];
				var oIntersectMeshes = o.getIntersectMeshes();
				for (var i = oIntersectMeshes.length - 1; i >= 0; i--) {
					o.intersectMeshIndexes.push(this.intersectMeshes.push(oIntersectMeshes[i]) - 1);
				};
			}
		},

		removeObject : function(o) {
			console.log("Removing object "+ o.uid);
			delete this.objects[o.uid];
			for (var i = o.intersectMeshIndexes.length - 1; i >= 0; i--) {
				this.intersectMeshes.splice(o.intersectMeshIndexes[i], 1);
			};
			
		},

		initPlayer : function() {
			this.player = new Game.Views.Creatures.Player({
				name : options.name,
				uid : options.uid,
				isCurrent : true
			});
			this.addObject(this.player);
		},

		initTerrain : function() {
			this.terrain = new Terrain();
			this.terrain.init();
		},

		findFromUid : function(uid) {
			return this.objects[uid];
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
						var tree = new Game.Views.Terrain.Tree()
						tree.init(p.position, p.data);
						tree.uid = p.uid;
						this.addObject(tree);
						break;
				}
				
			};
		},

		setState : function(data) {
			this.setTerrain(data.terrain);
			
			for (var i = data.objects.length - 1; i >= 0; i--) {
				var o = data.objects[i];
				var existing = this.findFromUid(o.uid);
				if(existing != null) {
					existing.update(o);
				}
				else{
					var newObject = null;
					switch(o.classTag) {
						case "player":
							newObject = new Game.Views.Creatures.Player({name : o.name, uid : o.uid});
							break;
						case "mob":
							newObject = new Game.Views.Creatures.Mob({ uid : o.uid});
							break;
						default:
							console.log("Can't find oject of type " + o.classTag);
							break;
					}

					if(newObject != null) {
						newObject.update(o);
						this.addObject(newObject);
					}
				}	
			};


			for (var i = data.deletes.length - 1; i >= 0; i--) {
				var d = data.deletes[i];
				var o = this.findFromUid(d);
				if(o != undefined) {
					console.log("delete " + o.name);
					o.destroy();
					this.removeObject(o);
				}
			};
		}
	}
})