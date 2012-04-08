Game.Controllers.Client = (function(options) {

	var URL = "ws://localhost:1337";
	var USER_NAME = options.user;
	var connectionOpen = false;
	return {
		
		connection : null,

		init : function() {
			_.bindAll(this, "connection_error", "connection_open", "connection_message");
			var WebSocket = window.WebSocket || window.MozWebSocket;
			this.connection = new WebSocket(URL);
			this.connection.onopen = this.connection_open;
			this.connection.onmessage = this.connection_message;
			this.connection.onerror = this.connection_error;
		},

		connection_error : function() {
			console.log("Connection error");	
		},

		connection_open : function() {
			connectionOpen = true;
			console.log("Connection opened");
			this.connection.send(
				JSON.stringify(
					{
						type : "new_player", 
						data : { 
							name : USER_NAME,
							position : { x : 0, y : 15, z : 0},
							goalVector : { x : 0, y : 0, z : 0},
							rotation : { x : 0, y : 0, z : 0}
						}
					}
			));
		},

		connection_message : function(message) {
			var msg = JSON.parse(message.data.toString());
			
			switch(msg.type) {
				case "world_state":
					global.app.world.setState(msg.data);
					break;
				case "terrain":
					global.app.world.setTerrain(msg.data);
					break;
			}
		},

		setPlayerPos : function() {
			if(connectionOpen == false) return;
			var data = {
					position : {
						x : global.app.world.player.mesh.position.x,
						y : global.app.world.player.mesh.position.y,
						z : global.app.world.player.mesh.position.z
					},

					goalVector : {
						x : global.app.world.player.goalVector.x,
						y : global.app.world.player.goalVector.y,
						z : global.app.world.player.goalVector.z
					}
				};
			this.connection.send(JSON.stringify({
				type : "update_player",
				data : data
			}));
		}
	}
});