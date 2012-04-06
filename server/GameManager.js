var Player = require("./Player");

module.exports = function() {
	var worldObjects = [];
	var players = [];

	var handleNewPlayer = function(data, index) {
		var player = new Player({name : data.name, position : data.position, rotation : data.rotation, index : index});
		players.push(player);
	};

	var updatePlayer = function(data, index) {
		for (var i = players.length - 1; i >= 0; i--) {
			var p = players[i];
			if(p.getIndex() == index) {
				p.setPosition(data.position.x, data.position.y, data.position.z);
				p.setGoal(data.goal.x, data.goal.y, data.goal.z);
				break;
			}
		};
	};

	return {

		removePlayer : function(index) {
			for (var i = players.length - 1; i >= 0; i--) {
				var p = players[i];
				if(p.getIndex() == index) {
					players.splice(i, 1);
					break;
				}
			};
		},

		handleMessage : function(message, index) {
			switch(message.type) {
				case "new_player":
					handleNewPlayer(message.data, index);
					break;
				case "update_player":
					updatePlayer(message.data, index);
					break;
				default:
					console.log("Don't know what to do with message of type " + message.type);
					break;
			}
		},

		worldstate : function(index) {
			var data = {};
			data.players = [];
			for (var i = players.length - 1; i >= 0; i--) {
				var player = players[i];
				if(player.getIndex() != index)
					data.players.push({
						name : player.getName(),
						position : player.getPosition(),
						goal : player.getGoal()
					});
			};
			return data;
		}
	}
}