Game.Controllers.Client = (function(options) {

	var URL = "ws://localhost:1337";
	var USER_NAME = options.name;
	var UID = options.uid;
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
			this.connected = false;
			this.latestSync = 0;
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
							uid : UID,
							rotation : { x : 0, y : 0, z : 0},
							targetUid : null
						}
					}
			));
		},
		
		connection_message : function(message) {
			var msg = JSON.parse(message.data.toString());
			
			switch(msg.type) {
				case "world_state":
					global.app.world.setState(msg.data);
					this.connected = true;
					break;
			}
		},

		hasConnected : function() {
			return this.connected;
		},

		playerSync : function() {
			var p = global.app.world.player;
			this.latestSync = this.latestChange;
			var data = {
				uid : p.uid,
				targetUid : p.targetUid,
				targetIntent : p.targetIntent
			};
			if(p.goalVector != null) {
				data.goalVector = {
					x : p.goalVector.x,
					y : p.goalVector.y,
					z : p.goalVector.z
				};
			}
			this.syncObject(data);
		},

		syncObject : function(data) {
			if(connectionOpen == false) return;
			
			this.connection.send(JSON.stringify({
				type : "sync_object",
				data : data
			}));
		}
	}
});