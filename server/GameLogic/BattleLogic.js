var r = function(r1, r2) {
	return ((Math.random()*(r2 - r1)) + r1);
};

module.exports = BattleLogic = {
	handleBattle : function(attacker, defender) {
		if(BattleLogic.isTimeToAttack(attacker)) {
			console.log(attacker.classTag + " attacks " + defender.classTag);

			if(BattleLogic.isHit(attacker, defender)) {

			}
			else {
				console.log("Miss!");
			}

			//Set the lastAttackTime to now.
			attacker.lastAttackTime = new Date().getTime();
		}
	},

	/*
		Determines whether the attack-timeout has expired for the attacker.
	*/
	isTimeToAttack : function(attacker) {
		var attackTimeoutLength = 3000 - attacker.stats.attackSpeed();
		return attacker.lastAttackTime == null
			|| (new Date().getTime() - attacker.lastAttackTime) > attackTimeoutLength;
	},

	isHit : function() {

	}
};