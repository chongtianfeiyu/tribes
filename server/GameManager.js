var Player = require("./Creatures/Player");
var Tree = require("./Terrain/Tree");

module.exports = function() {
	//Contains all creature-objects
	var objects = [];
	//Contains all terrain-objects
	var terrainObjects = [];
	//Contains all deleted objects uid
	var deletes = [];

	var addNewPlayer = function(data) {
		var player = new Player(
			{
				name : data.name, 
				position : data.position, 
				rotation : data.rotation, 
				goalVector : data.goalVector,
				uid : data.uid
			});
		player.tick = new Date().getTime();
		objects[player.uid] = player;
		return player;
	};

	var synchObject = function(data) {
		var o = objects[data.uid];
		o.synchronize(data);
		o.tick = new Date().getTime();
	};

	return {
		
		init : function() {
			var tree = new Tree();
			var start = {x : 100, y : 0, z : 100};
			tree.init(start);
			tree.tick = 0;
			terrainObjects[tree.uid] = tree;
			terrainObjects.push(tree);
			
			for(var i = 0; i<10; i++) {
				this.autoUpdateTerrain();
			}

			setInterval(this.autoUpdateTerrain, 60000);
			setInterval(this.update, 10);
			setInterval(this.cleanUp, 5000);
		},

		update : function() {
			for(uid in objects) {
				objects[uid].update();
			}
		},

		removePlayer : function(uid) {
			delete objects[uid];
			deletes.push({tick : new Date().getTime(), uid : uid});
		},

		addPlayer : function(data) {
			return addNewPlayer(data);
		},

		handleMessage : function(message, uid) {
			switch(message.type) {
				case "sync_object":
					synchObject(message.data);
					break;
				default:
					console.log("Don't know what to do with message of type " + message.type);
					break;
			}
		},

		/*
			Collects changes in world state
			that has occured since the supplied tick.
		*/
		worldstate : function(tick) {
			var data = {};
			
			//Push player-changes to client
			data.players = [];
			for(uid in objects){
				var player = objects[uid];
				if(player.tick >= tick) {
					data.players.push(player);
				}	
			}

			//Push terrain-changes to client
			data.terrain = [];
			for(uid in terrainObjects){
				var o = terrainObjects[uid];
				if(o.tick > tick)
					data.terrain.push(o);
			}
			
			//Push deleted objects to client
			data.deletes = [];
			for (var i = deletes.length - 1; i >= 0; i--) {
				var d = deletes[i];
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
			for (var i = deletes.length - 1; i >= 0; i--) {
				var d = deletes[i];
				if((now-d.tick)>1000) {
					deletes.splice(i);
				}
			};
		},

		/* 
			Update world-cycle.
			Generates new terrain-objects/grows trees etc.
		*/
		autoUpdateTerrain : function() {
			for(uid in terrainObjects) {
				var o = terrainObjects[uid];
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
					terrainObjects.push(child);
				}
			}
		}
	}
}