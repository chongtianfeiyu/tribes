var global = {

};
window.onload = function() {
	//Construct global objects.
	global.app = new Game.Controllers.App({});

	//Initialize global objects.
	global.app.init();
	//Start running.
};