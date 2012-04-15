var cls = require("../packages/Class");
module.exports = WeaponBase = cls.Class.extend({
	init : function(options) {
		this.name = optoins.name;
		this.weight = options.weight;
		this.attackPower = options.attackPower;
		this.requiredLevel = options.requiredLevel;
	}
});