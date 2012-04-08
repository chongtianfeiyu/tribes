var Player = require("./Creatures/Player");
var TerrainManager = require("./TerrainManager");

module.exports = function() {
	//Contains all objects
	var objects = [];
	//Contains all deleted objects
	var deletes = [];
	//Manages terrain-objects
	var terrainManager = new TerrainManager();

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
		objects.push(player);
		return player;
	};

	var synchObject = function(data) {
		for (var i = objects.length - 1; i >= 0; i--) {
			var p = objects[i];
			if(p.getUid() == data.uid) {
				p.synchronize(data);
				p.tick = new Date().getTime()
				break;
			}
		};
	};

	return {
		init : function() {
			terrainManager.init();
		},
		removePlayer : function(uid) {
			for (var i = objects.length - 1; i >= 0; i--) {
				var p = objects[i];
				if(p.getUid() == uid) {
					objects.splice(i, 1);
					break;
				}
			};
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
			for (var i = objects.length - 1; i >= 0; i--) {
				var player = objects[i];
				if(player.tick >= tick) {
					data.players.push(player.getSynchData());
				}
					
			};

			//Push terrain-changes to client
			data.terrain = terrainManager.getTerrain(tick);
			
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
			terrainManager.update();
		}
	}
}