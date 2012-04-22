Game.Controllers.HUD = {
	init : function() {
		this.hud = $('#HUD');
		this.hpBar = $('#hp-bar');
		this.currentHp = $('#current-hp');
	},

	setHP : function(current, max) {
		var c = ((current/max) * 100);
		Game.Controllers.HUD.currentHp.width(c + "%");
	}	
};

$(document).ready(function() {
	Game.Controllers.HUD.init();
});