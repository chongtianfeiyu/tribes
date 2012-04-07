//Configuration
var SERVER_PORT = 1337;

//Includes
var WebSocketServer = require('websocket').server;
var http = require('http');
var GameManager = require('./GameManager');

//Globals
var gameManager = new GameManager();
gameManager.init();
var global_terrain = 0;
setInterval(function() {
	gameManager.autoUpdateWorld();
	global_terrain++;
}, 5000);

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
	lastTerrain = 0;
	var name = null;

	connection.on('message', function(message){
		var msg = JSON.parse(message.utf8Data);
		if(msg.type == "new_player") {
			var player = gameManager.addPlayer(msg.data);
			name = player.getName();
			console.log(name + " is connected");
			send("terrain", gameManager.getTerrain(name));
			lastTerrain = global_terrain;
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
		if(lastTerrain<global_terrain) {
			lastTerrain = global_terrain;
			send("terrain", gameManager.getTerrain());
		}
			
	}, 60);
});