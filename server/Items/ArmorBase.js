var cls = require("../packages/Class");
module.exports = ArmorBase = cls.Class.extend({
	init : function(options) {
		this.name = optoins.name;
		this.weight = options.weight;
		this.defense = options.defense;
		this.requiredLevel = options.requiredLevel;
	}
});