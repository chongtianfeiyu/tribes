//Contains the global reference to the app-object.
var global = {

};
window.onload = function() {
	var uid = Math.random();
	var name = Math.round(Math.random() * 1000);
	//Construct global objects.
	global.app = new Game.Controllers.App({uid : uid, name : name});
	global.cache = new MicroCache();
	//Initialize global objects.
	global.app.init();

	//Start running.
	global.app.start();
};


