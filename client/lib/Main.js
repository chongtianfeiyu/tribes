var global = {

};
window.onload = function() {
	var uid = Math.random();
	var name = Math.round(Math.random() * 1000);
	//Construct global objects.
	global.app = new Game.Controllers.App({uid : uid, name : name});

	//Initialize global objects.
	global.app.init();

	//Start running.
	global.app.start();
};