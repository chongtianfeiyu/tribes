var cls = require("../packages/Class");
var CreatureBase = require("./CreatureBase");
var _ = require("Underscore");
var r = function(r1, r2) {
	return ((Math.random()*(r2 - r1)) + r1);
};

module.exports = Mob = CreatureBase.extend({
	init : function(options) {
		this._super(options);
		this.speed = 2;
		//indicates whether it should wait to choose a random target.
		this.randomTargetChosen = false;
		this.classTag = "mob";
		_.bindAll(this, "chooseRandomTarget", "onTargetedBy");
	},

	onTargetedBy : function(enemy) {
		this._super(enemy);
		console.log("Enemy targets " + enemy.targetUid);
		this.targetUid = enemy.uid;
	},

	synchronize : function(data) {
		this._super(data);
	},

	update : function() {
		this._super();
		//Random walking
		if(
			this.goalVector == null 
			&& this.targetUid == null
			&& this.randomTargetChosen == false) {
			this.randomTargetChosen = true;
			setTimeout(this.chooseRandomTarget, 3000);
		}
	},

	chooseRandomTarget : function() {
		console.log("Choosing random target");
		this.goalVector = {
				x : this.position.x + r(-300, 300),
				y : this.position.y,
				z : this.position.x + r(-300, 300)
			};
		this.randomTargetChosen = false;
	}
});
