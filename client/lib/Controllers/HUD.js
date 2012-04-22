Game.Controllers.HUD = {
	init : function() {
		this.hud = $('#HUD');
		this.hpBar = $('#hp-bar');
		this.currentHp = $('#current-hp');
		this.tmp = $('#tmp');
	},

	setHP : function(current, max) {
		var c = ((current/max) * 100);
		Game.Controllers.HUD.currentHp.width(c + "%");
	},

	log : function(msg) {
		Game.Controllers.HUD.tmp.html(msg);
	}	
};

$(document).ready(function() {
	Game.Controllers.HUD.init();
});