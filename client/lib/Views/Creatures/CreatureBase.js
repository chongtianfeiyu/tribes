
Game.Views.Creatures.CreatureBase = Class.extend({
	init : function(options) {
		this.position = options.position;
		this.rotation = options.rotation;
		this.uid = options.uid;
	},

	update : function(data) {
		this.position = data.position;
		this.rotation = data.rotation;
	}
});