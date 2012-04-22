Game.Controllers.World = (function(options){
	
	return {
		terrain : null, 
		objects : [],
		intersectMeshes : [],

		init : function() {
			_.bindAll(this, "setState", "setTerrain", "animationUpdate");
			this.initTerrain();
			this.initPlayer();
			Logger.log("Init world");
		},

		animationUpdate : function() {
			if(this.player.position == undefined) return;
			var playerPos = this.player.position;

			for(uid in this.objects){
				var o = this.objects[uid];
				var distance = new THREE.Vector3().sub(playerPos, o.position).length();
				if(distance > 4000) {
					o.destroy();
					this.removeObject(o);
				}
				else if(o.animationUpdate)
					o.animationUpdate();
			}
		},

		addObject : function(o) {
			this.objects[o.uid] = o;
			if(o.getIntersectMeshes) {
				var oIntersectMeshes = o.getIntersectMeshes();
				for (var i = oIntersectMeshes.length - 1; i >= 0; i--) {
					var intersectMeshUid = o.uid + ":" + i;
					this.intersectMeshes[intersectMeshUid] = oIntersectMeshes[i];
					this.cachedIntersectList = null;
				};
			}
		},

		cachedIntersectList : null,

		getIntersectMeshes : function() {
			if(this.cachedIntersectList == null) {
				this.cachedIntersectList = [];
				for(id  in this.intersectMeshes) {
					this.cachedIntersectList.push(this.intersectMeshes[id]);
				}
			}
			
			return this.cachedIntersectList;
		},

		removeObject : function(o) {
			delete this.objects[o.uid];
			if(o.getIntersectMeshes) {
				var oIntersectMeshes = o.getIntersectMeshes();
				for (var i = oIntersectMeshes.length - 1; i >= 0; i--) {
					var intersectMeshUid = o.uid + ":" + i;
					delete this.intersectMeshes[intersectMeshUid];
				};
			}
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

		/*
			HAndles a single message-item related to the object
		*/
		handleObjectMessage : function(object, message) {
			Logger.log(message.type);

			switch(message.type) {
				case "attack_miss":
					object.flare("Miss");
					break;
				case "attack":
					object.flare(message.damage);
					break;
			}
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
					switch(o.classTag) {
						case "player":
							existing = new Game.Views.Creatures.Player({name : o.name, uid : o.uid});
							break;
						case "mob":
							existing = new Game.Views.Creatures.Mob({ uid : o.uid});
							break;
						default:
							console.log("Can't find oject of type " + o.classTag);
							break;
					}

					if(existing != null) {
						existing.update(o);
						this.addObject(existing);
					}
				}

				for (var j = o.messageList.length - 1; j >= 0; j--) {
					this.handleObjectMessage(existing, o.messageList[j]);
				};	
			};


			for (var i = data.deletes.length - 1; i >= 0; i--) {
				var d = data.deletes[i];
				var o = this.findFromUid(d);
				if(o != undefined) {
					o.destroy();
					this.removeObject(o);
				}
			};
		}
	}
})