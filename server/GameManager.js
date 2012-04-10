var Player = require("./Creatures/Player");
var Tree = require("./Terrain/Tree");
var _ = require("Underscore");
var cls = require("./packages/Class");

module.exports = GameManager = cls.Class.extend({

	init : function() {
		this.objects = [];
		this.terrainObjects = [];
		this.deletes = [];

		//Plant a tree, save the world.
		var tree = new Tree();
		var start = {x : 100, y : 0, z : 100};
		tree.init(start);
		this.addTerrainObject(tree);
		for(var i = 0; i<10;i++) 
		{
			this.autoUpdateTerrain();
		}

		_.bindAll(this, "autoUpdateTerrain", "update", "cleanUp");
		setInterval(this.autoUpdateTerrain, 60000);
		setInterval(this.update, 10);
		setInterval(this.cleanUp, 5000);
	},

	//Update-loop for this game
	update : function() {
		for(uid in this.objects){
			this.objects[uid].update();
		}
	},

	addNewPlayer : function(data) {
		var player = new Player({
			name : data.name,
			position : data.position,
			rotation : data.rotation,
			goalVector : data.goalVector,
			uid : data.uid
		});	
		this.addObject(player);
		return player;
	},

	addObject : function(o) {
		o.tick = new Date().getTime();
		this.objects[o.uid] = o;
	},

	addTerrainObject : function(o) {
		o.tick = new Date().getTime();
		this.terrainObjects[o.uid] = o;
	},

	removePlayer : function(uid) {
		delete this.objects[uid];
		this.deletes.push({tick : new Date().getTime(), uid : uid});
	},

	synchObject : function(data) {
		var o = this.objects[data.uid];
		o.synchronize(data);
		o.tick = new Date().getTime();
	},

	handleMessage : function(message, uid) {
		switch(message.type) {
			case "sync_object":
				this.synchObject(message.data);
				break;
			default:
				console.log("Unknown message typ " + message.type);
				break;
		}
	},

	worldStateDelta : function(tick) {
		var data = {};
		
		//Push player-changes to client
		data.players = [];
		for(uid in this.objects){
			var player = this.objects[uid];
			if(player.tick >= tick) {
				data.players.push(player);
			}	
		}

		//Push terrain-changes to client
		data.terrain = [];
		for(uid in this.terrainObjects){
			var o = this.terrainObjects[uid];
			if(o.tick > tick)
				data.terrain.push(o);
		}
		
		//Push deleted objects to client
		data.deletes = [];
		for (var i = this.deletes.length - 1; i >= 0; i--) {
			var d = this.deletes[i];
			if(d.tick >= tick)
				data.deletes.push(d.uid);
		};
		return data;
	},


	/* 
		Clean up state variables
	*/

	cleanUp : function() {
		var now = new Date().getTime();
		//Remove all the deletes that are older than 1s.
		for (var i = this.deletes.length - 1; i >= 0; i--) {
			var d = this.deletes[i];
			if((now-d.tick)>1000) {
				this.deletes.splice(i);
			}
		};
	},
	/* 
		Update world-cycle.
		Generates new terrain-objects/grows trees etc.
	*/
	autoUpdateTerrain : function() {
		for(uid in this.terrainObjects) {
			var o = this.terrainObjects[uid];
			if(!o.fullyGrown()){
				o.tick =  new Date().getTime();
				o.grow();
			}

			else if(o.childCount == undefined)
				o.childCount = Math.random() * 2;
			else if(o.childCount <= 2) {
				o.childCount += 1;
				var child = o.breed();
				child.tick = new Date().getTime();
				this.terrainObjects[child.uid] = child;
			}
		}
	}
});