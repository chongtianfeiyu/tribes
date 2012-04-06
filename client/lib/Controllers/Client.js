Game.Controllers.Client = (function() {

	var URL = "ws://localhost:1337";
	var USER_NAME = Math.round(Math.random() * 1000).toString();

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
			console.log("Connection opened");
			this.connection.send(
				JSON.stringify(
					{
						type : "new_player", 
						data : { 
							name : USER_NAME,
							position : { x : 0, y : 0, z : 0},
							rotation : { x : 0, y : 0, z : 0}
						}
					}
			));
		},

		connection_message : function(message) {
			console.log("Message received");
			console.log(message.data.toString());
			var msg = JSON.parse(message.data.toString());
			console.log(msg.type);
		}
	}
});