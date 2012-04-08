//Configuration
var SERVER_PORT = 1337;

//Includes
var WebSocketServer = require('websocket').server;
var http = require('http');
var GameManager = require('./GameManager');

//Globals

//Initialize the game and simulate it for 10 turns
var gameManager = new GameManager();
gameManager.init();
for (var i = 10 - 1; i >= 0; i--) {
	gameManager.autoUpdateWorld();
};

//Auto-update game every 60 seconds
setInterval(function() {
	gameManager.autoUpdateWorld();
}, 60000);

//cleanup-cycle every 5 seconds
setInterval(function() {
	gameManager.cleanUp();
}, 5000);

//Setup server
var server = http.createServer(function(request, response){
	//No implementation
});

server.listen(SERVER_PORT, function(){});

//setup WebSocket-server
var wsServer = new WebSocketServer({httpServer : server});

wsServer.on('request', function(request){

	//Holds the current client
	var connection = request.accept(null, request.origin);
	//Contains the latest tick when a push occured
	connection.lastPushTick = 0;

	//Sends data to client
	var send = function(type, data){
		connection.sendUTF(JSON.stringify({type : type, data : data}));
	}
	
	//Contains the uid of the current player
	var uid = null;

	connection.on('message', function(message){
		var msg = JSON.parse(message.utf8Data);
		if(msg.type == "new_player") {
			var player = gameManager.addPlayer(msg.data);
			uid = player.getUid();
			console.log(uid + " is connected");
			send("world_state", gameManager.worldstate(0));
		}
		else {
			var res = gameManager.handleMessage(msg, uid);
		}
	});

	connection.on('close', function(connection){
		gameManager.removePlayer(uid);
		console.log("Delete player " + uid);
	});

	setInterval(function() {
		if(uid == null) return;
		//Get the changes to the state of the world that has occured since the lastPushTick
		var data = gameManager.worldstate(connection.lastPushTick);
		
		if(data.players.length > 0 || data.terrain.length > 0 || data.deletes.length > 0) {
			connection.lastPushTick = new Date().getTime();
			send("world_state", data);
		}
			
	}, 10);
});