var cls = require("../packages/Class");
var CreatureBase = require("./CreatureBase");
var CreatureStats = require("./CreatureStats");
var _ = require("Underscore");
var r = function(r1, r2) {
	return ((Math.random()*(r2 - r1)) + r1);
};

module.exports = Mob = CreatureBase.extend({
	init : function(options) {
		this._super(options);
		this.stats = new CreatureStats({
			level : 1,
			strength : 12,
			agility : 10,
			vitality : 10,
			intelligence : 10,
			dexterity : 10,
			luck : 10
		});
		this.speed = 2;
		//indicates whether it should wait to choose a random target.
		this.randomTargetChosen = false;
		this.classTag = "mob";
		this.viewDistance = 1000;
		_.bindAll(this, "chooseRandomTarget", "onTargetedBy");
	},

	/*
		When the mob gets targeted, it charges back at the attacker.
	*/
	onTargetedBy : function(enemy) {
		this._super(enemy);
		if(this.targetUid == null) {
			this.targetUid = enemy.uid;
			this.targetIntent = "attack";
		}
	},

	synchronize : function(data) {
		this._super(data);
	},


	update : function() {
		this._super();
		//Random walking - if we have nothing better to do.
		if(
			this.goalVector == null 
			&& this.targetUid == null
			&& this.randomTargetChosen == false) {
		
			this.randomTargetChosen = true;
			setTimeout(this.chooseRandomTarget, 3000);
		}
	},

	chooseRandomTarget : function() {
		//Re-check that we still have nothing to do.
		if(this.goalVector == null && this.targetUid == null) {
			this.goalVector = {
				x : this.position.x + r(-300, 300),
				y : this.position.y,
				z : this.position.x + r(-300, 300)
			};
			this.randomTargetChosen = false;
		}
	}
});
