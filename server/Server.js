//Configuration
var SERVER_PORT = 1337;

//Includes
var WebSocketServer = require('websocket').server;
var http = require('http');
var GameManager = require('./GameManager');

//Globals
var gameManager = new GameManager();
gameManager.init();

//Setup server
var server = http.createServer(function(request, response){
	//No implementation
});

server.listen(SERVER_PORT, function(){});

//setup WebSocket-server
var wsServer = new WebSocketServer({httpServer : server});

wsServer.on('request', function(request){



	var connection = request.accept(null, request.origin);
	
	var send = function(type, data){
		connection.sendUTF(JSON.stringify({type : type, data : data}));
	}

	var name = null;

	connection.on('message', function(message){
		var msg = JSON.parse(message.utf8Data);
		if(msg.type == "new_player") {
			var player = gameManager.addPlayer(msg.data);
			name = player.getName();
			console.log(name + " is connected");
			send("terrain", gameManager.getTerrain(name));
		}
		else {
			var res = gameManager.handleMessage(msg, name);
		}
	});

	connection.on('close', function(connection){
		gameManager.removePlayer(name);
	});

	setInterval(function() {
		if(name == null) return;
		send("world_state", gameManager.worldstate(name));
	}, 60);
});