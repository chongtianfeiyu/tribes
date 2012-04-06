//Configuration
var SERVER_PORT = 1337;

//Includes
var WebSocketServer = require('websocket').server;
var http = require('http');
var GameManager = require('./GameManager');

//Globals
var clients = [];
var gameManager = new GameManager();

//Setup server
var server = http.createServer(function(request, response){
	//No implementation
});

server.listen(SERVER_PORT, function(){});

//setup WebSocket-server
var wsServer = new WebSocketServer({httpServer : server});

wsServer.on('request', function(request){

	var connection = request.accept(null, request.origin);
	
	
	//The index of the currently connected user is stored in index (used in remove)
	var index = clients.push(connection) - 1;
	
	console.log("Connected clients: " + clients.length);

	connection.on('message', function(message){
		gameManager.handleMessage(JSON.parse(message.utf8Data), index);
	});

	connection.on('close', function(connection){
		console.log("Disconnected " + connection.remoteAddress);
		gameManager.removePlayer(index);
		clients.splice(index, 1);
		console.log("Connected clients: " + clients.length);
	});

	setInterval(function() {
		connection.sendUTF(JSON.stringify({type : "world_state", data : gameManager.worldstate(index)}));
	}, 60);
});