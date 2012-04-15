var r = function(r1, r2) {
	return ((Math.random()*(r2 - r1)) + r1);
};

module.exports = BattleLogic = {
	handleBattle : function(attacker, defender) {
		if(BattleLogic.isTimeToAttack(attacker)) {
			console.log(attacker.classTag + " attacks " + defender.classTag);

			if(BattleLogic.isHit(attacker, defender)) {
				console.log("HIT!");
				var atk = attacker.stats.attackPower();
				var softDefense = defender.stats.softDefense();
				var hardDefense = defender.stats.hardDefense();
				//Check for divide-by-zero-errors
				hardDefense = hardDefense == 0 ? 1 : hardDefense;
				var damage = atk - (atk/100/hardDefense) - softDefense;
				damage = damage < 0 ? 0 : damage;
				console.log("Damage dealt: " + damage);
				attacker.stats.receiveDamage(damage);
				console.log("Defenders hp: " + defender.stats.hp());
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

	isHit : function(attacker, defender) {
		var hitChance = (80 + attacker.stats.accuracy() - defender.stats.dodge());
		return r(0, 100) < hitChance;
	}
};