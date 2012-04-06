var Player = require("./Player");

module.exports = function() {
	var worldObjects = [];
	var players = [];

	var handleNewPlayer = function(data, index) {
		players.push(new Player(data.name, data.position, data.rotation, index));
	}

	return {

		handleMessage : function(message, index) {
			switch(message.type) {
				case "new_player":
					handleNewPlayer(message.data);
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
				data.players.push({
					name : player.getName(),
					position : player.getPosition()
				});
			};
			return data;
		}
	}
}