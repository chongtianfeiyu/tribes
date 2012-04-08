var Player = require("./Creatures/Player");
var TerrainManager = require("./TerrainManager");

module.exports = function() {
	//Contains all players
	var players = [];
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
		players.push(player);
		return player;
	};

	var updatePlayer = function(data, uid) {
		for (var i = players.length - 1; i >= 0; i--) {
			var p = players[i];
			if(p.getUid() == uid) {
				p.setPosition(data.position.x, data.position.y, data.position.z);
				p.setGoalVector(data.goalVector.x, data.goalVector.y, data.goalVector.z);
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
			for (var i = players.length - 1; i >= 0; i--) {
				var p = players[i];
				if(p.getUid() == uid) {
					players.splice(i, 1);
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
				case "update_player":
					updatePlayer(message.data, uid);
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
			for (var i = players.length - 1; i >= 0; i--) {
				var player = players[i];
				if(player.tick >= tick) {
					data.players.push({
						name : player.getName(),
						uid : player.getUid(),
						position : player.getPosition(),
						goalVector : player.getGoalVector()
					});
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

		autoUpdateWorld : function() {
			terrainManager.update();
		}
	}
}