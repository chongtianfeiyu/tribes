var global = {

};
window.onload = function() {
	var USER_NAME = Math.round(Math.random() * 1000).toString();
	//Construct global objects.
	global.app = new Game.Controllers.App({user : USER_NAME});

	//Initialize global objects.
	global.app.init();

	//Start running.
	global.app.start();
};