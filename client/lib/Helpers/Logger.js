var Logger = {
	len : 0,

	log : function(s) {
		Game.Controllers.HUD.log(s);
		console.log(s);
	}
};