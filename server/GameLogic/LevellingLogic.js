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

	getExpFromMob : function(mob) {
		var lvlExp = LevellingLogic.getMobExperienceFromLevel(mob.stats.level);
		console.log("lvlexp:" + lvlExp + ",lvl:" + mob.stats.level);
		return lvlExp / (mob.stats.level * 20);
	}
};

