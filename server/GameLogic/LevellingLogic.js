module.exports = LevellingLogic = {
	levelUpTable : [
		//1
		550,
		//2
		900,
		//3,
		1500,
		//4,
		2200,
		//5,
		3200,
		//6
		3800
	],

	/*
		Returns the least amount of accumulated experience for a specific level.
	*/
	getMobExperienceFromLevel : function(level) {
		var sum = 0;
		for (var i = 0; i < LevellingLogic.levelUpTable.length; i++) {
			if(i == level)
				break;
			sum += LevellingLogic.levelUpTable[i];
		};
		return sum;
	},

	getLevelFromExperience : function(experience) {
		var sum = 0;
		for(var i = 0; i < LevellingLogic.levelUpTable.length; i++) {
			sum += LevellingLogic.levelUpTable[i];
			if(experience < sum) {
				return i + 1;
			}
		}
	},

	getExpFromMob : function(mob) {
		var lvlExp = LevellingLogic.getMobExperienceFromLevel(mob.stats.level);
		return lvlExp / (mob.stats.level * 20);
	},

	addBattleWinExperience : function(attacker, defender) {
		var exp = LevellingLogic.getExpFromMob(defender);
		var currentExperience = attacker.stats.accumulatedExperience;
		var sum = currentExperience + exp;
		var sumLevel = this.getLevelFromExperience(sum);
		if(sumLevel > attacker.stats.level) {
			attacker.stats.level += 1;
			attacker.tick = new Date().getTime();
			console.log("Level up, FTW!!");
			console.log("New level " + attacker.stats.level);
		}
		attacker.stats.addExperience(exp);
		console.log("Gained " + exp + " and total is now " + attacker.stats.accumulatedExperience);
	}
};

