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

		getArea : function(position) {
			return {
				x : Math.round(position.x / 3000),
				z : Math.round(position.z / 3000)
			}
		},

		areaEquals : function(a1, a2){
			return a1.x == a2.x && a1.z == a2.z;
		},

		animationUpdate : function() {
			if(this.player.position == undefined) return;
			var playerArea = this.getArea(this.player.position);

			for (var i = this.objects.length - 1; i >= 0; i--) {
				var o = this.objects[i];
				var oArea = this.getArea(o.position);
				if(!this.areaEquals(oArea, playerArea)) {
					o.destroy();
					this.removeObject(o);
					console.log(oArea);
					console.log(playerArea);
				}
				else if(o.animationUpdate)
					o.animationUpdate();
			};
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
			
			for (var i = data.players.length - 1; i >= 0; i--) {
				var player = data.players[i];
				var p = this.findFromUid(player.uid);
				if(p != null) {
					p.update(player);
				} else {
					var p = new Game.Views.Creatures.Player({name : player.name, uid : player.uid});
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