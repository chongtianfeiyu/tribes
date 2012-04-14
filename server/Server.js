//Configuration
var SERVER_PORT = 1337;

//Includes
var WebSocketServer = require('websocket').server;
var http = require('http');
var GameManager = require('./GameManager');
var CreatureBase = require('./Creatures/CreatureBase');

//Globals

//Initialize the game and simulate it for 10 turns
var gameManager = new GameManager();

//Setup server
var server = http.createServer(function(request, response){
	//No implementation
});

//Contains all connected clients
var clients = [];

server.listen(SERVER_PORT, function(){});

//setup WebSocket-server
var wsServer = new WebSocketServer({httpServer : server});

//Sends data to client
var send = function(connection, type, data){
	connection.sendUTF(JSON.stringify({type : type, data : data}));
}

wsServer.on('request', function(request){

	//Holds the current client
	var connection = request.accept(null, request.origin);
	//Contains the latest tick when a push occured
	connection.lastPushTick = 0;
	
	//Contains the uid of the current player
	var uid = null;

	connection.on('message', function(message){
		var msg = JSON.parse(message.utf8Data);
		//When we add a new player, we push them to the connection-list, and push the world state
		// from time 0 for them to get the full list of objects
		if(msg.type == "new_player") {
			var player = gameManager.addNewPlayer(msg.data);
			uid = player.uid;
			clients[uid] = connection;
			console.log(uid + " is connected (" + player.name + ")");
		}
		else {
			var res = gameManager.handleMessage(msg, uid);
		}
	});

	connection.on('close', function(connection){
		delete clients[uid];
		gameManager.removePlayer(uid);
		console.log("Delete player " + uid);
	});

});

//Push-cycle. 
var lastPushTick = 0;

setInterval(function() {
	for(uid in clients) {
		var connection = clients[uid];
		//Get the changes to the state of the world that has occured since the lastPushTick
		var data = gameManager.worldStateDelta(uid, connection.lastPushTick || 0);
		connection.lastPushTick = new Date().getTime();
		if(data.objects.length > 0 || data.terrain.length > 0 || data.deletes.length > 0) {
			send(connection, "world_state", data);
		}
	}
	
}, 5);

