
Game.Views.Creatures.CreatureBase = Class.extend({
	init : function(options) {
		this.position = options.position;
		this.uid = options.uid;
	},

	update : function(data) {
		this.position = data.position;
	}
});