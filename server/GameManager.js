var Player = require("./Player");
var TerrainManager = require("./TerrainManager");

module.exports = function() {
	var worldObjects = [];
	var players = [];
	var terrainManager = new TerrainManager();

	var addNewPlayer = function(data) {
		var player = new Player({name : data.name, position : data.position, rotation : data.rotation});
		players.push(player);
		return player;
	};

	var updatePlayer = function(data, name) {
		for (var i = players.length - 1; i >= 0; i--) {
			var p = players[i];
			if(p.getName() == name) {
				p.setPosition(data.position.x, data.position.y, data.position.z);
				p.setGoal(data.goal.x, data.goal.y, data.goal.z);
				break;
			}
		};
	};

	return {
		init : function() {
			console.log("init game-manager");
			terrainManager.init();
		},
		removePlayer : function(name) {
			for (var i = players.length - 1; i >= 0; i--) {
				var p = players[i];
				if(p.getName() == name) {
					players.splice(i, 1);
					break;
				}
			};
		},

		addPlayer : function(data) {
			return addNewPlayer(data);
		},

		handleMessage : function(message, name) {
			switch(message.type) {
				case "update_player":
					updatePlayer(message.data, name);
					break;
				default:
					console.log("Don't know what to do with message of type " + message.type);
					break;
			}
		},

		worldstate : function(name) {
			var data = {};
			data.players = [];
			for (var i = players.length - 1; i >= 0; i--) {
				var player = players[i];
				if(player.getName() != name)
					data.players.push({
						name : player.getName(),
						position : player.getPosition(),
						goal : player.getGoal()
					});
			};
			return data;
		},

		/*
			Returns the terrain-data needed to render the world
		*/
		getTerrain : function(name) {
			return terrainManager.getTerrain();
		},

		autoUpdateWorld : function() {
			terrainManager.update();
		}
	}
}