var Player = require("./Creatures/Player");
var TerrainManager = require("./TerrainManager");

module.exports = function() {
	var worldObjects = [];
	var players = [];
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
			console.log("init game-manager");
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

		worldstate : function(tick) {
			var data = {};
			data.players = [];
			for (var i = players.length - 1; i >= 0; i--) {
				var player = players[i];
				if(player.tick >= tick) {
					data.players.push({
						name : player.getName(),
						position : player.getPosition(),
						goalVector : player.getGoalVector()
					});
				}
					
			};
			data.terrain = this.getTerrain(tick);
			return data;
		},

		/*
			Returns the terrain-data needed to render the world
		*/
		getTerrain : function(tick) {
			return terrainManager.getTerrain(tick);
		},

		autoUpdateWorld : function() {
			terrainManager.update();
		}
	}
}