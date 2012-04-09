var cls = require("../packages/Class");
var CreatureBase = require("./CreatureBase");

module.exports = Player = CreatureBase.extend({
	init : function(options) {
		this._super(options);
		this.name = options.name;
	},

	synchronize : function(data) {
		this._super(data);
	}
});
