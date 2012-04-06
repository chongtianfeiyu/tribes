var Player = require("./Player");

module.exports = function() {
	var worldObjects = [];
	var players = [];

	var handleNewPlayer = function(data, index) {
		var player = new Player({name : data.name, position : data.position, rotation : data.rotation, index : index});
		players.push(player);
	};

	var changePlayerPos = function(data, index) {
		for (var i = players.length - 1; i >= 0; i--) {
			var p = players[i];
			if(p.getIndex() == index) {
				p.setPosition(data.x, data.y, data.z);
				break;
			}
		};
	};

	return {

		handleMessage : function(message, index) {
			switch(message.type) {
				case "new_player":
					handleNewPlayer(message.data, index);
					break;
				case "change_player_pos":
					changePlayerPos(message.data, index);
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
						position : player.getPosition()
					});
			};
			return data;
		}
	}
}