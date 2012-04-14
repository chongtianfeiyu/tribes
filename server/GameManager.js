var Player = require("./Creatures/Player");
var Tree = require("./Terrain/Tree");
var _ = require("Underscore");
var cls = require("./packages/Class");
var Vector3 = require("./packages/Vector3");

module.exports = GameManager = cls.Class.extend({

	/*

	*/
	init : function() {
		this.objects = [];
		this.terrainObjects = [];
		this.deletes = [];

		this.playerTicks = [];
		this.viewDistance = 3000;

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
			position : data.position || {x:0,y:0,z:0},
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

	getArea : function(position) {
		return {
			x : Math.round(position.x / (this.viewDistance / 2)),
			z : Math.round(position.z / (this.viewDistance / 2))
		}
	},

	areaEquals : function(a1, a2){
		return a1.x == a2.x && a1.z == a2.z;
	},

	getPlayerTick : function(player) {
		var playerTick = this.playerTicks[player.uid];
		var area = this.getArea(player.position);
		if(playerTick == undefined
			|| (!this.areaEquals(area, playerTick.area))) {
			this.playerTicks[uid] 
				= playerTick 
				= {
					area : area,
					tick : 0};
		}

		return playerTick;
	},

	setPlayerTick : function(player, tick) {
		this.getPlayerTick(player).tick = tick;
	},

	worldStateDelta : function(uid) {
		var data = {};
		var player = this.objects[uid];
		var playerPos = new Vector3(player.position.x, player.position.y, player.position.z);
		var playerTick = this.getPlayerTick(player);
		//Push player-changes to client
		data.players = [];
		for(uid in this.objects){
			var o = this.objects[uid];
			var objPos = new Vector3(o.position.x, o.position.y, o.position.z);
			if(playerPos.distanceTo(objPos) < this.viewDistance && o.tick >= playerTick.tick) {
				data.players.push(o);
			}	
		}

		//Push terrain-changes to client
		data.terrain = [];
		for(uid in this.terrainObjects){
			var o = this.terrainObjects[uid];
			var objPos = new Vector3(o.position.x, o.position.y, o.position.z);
			if(playerPos.distanceTo(objPos) < this.viewDistance && o.tick >= playerTick.tick)
				data.terrain.push(o);
		}
		
		//Push deleted objects to client
		data.deletes = [];
		for (var i = this.deletes.length - 1; i >= 0; i--) {
			var d = this.deletes[i];
			if(d.tick >= playerTick.tick)
				data.deletes.push(d.uid);
		};
		this.setPlayerTick(player, new Date().getTime());
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