var cls = require("../packages/Class");
var CreatureBase = require("./CreatureBase");
var CreatureStats = require("./CreatureStats");

module.exports = Player = CreatureBase.extend({
	init : function(options) {
		this._super(options);
		this.stats = new CreatureStats({
			level : 1,
			strength : 15,
			agility : 10,
			vitality : 10,
			intelligence : 10,
			dexterity : 10,
			luck : 10
		});
		this.classTag = "player";
		this.name = options.name;
	},

	synchronize : function(data) {
		this._super(data);
	}
});
