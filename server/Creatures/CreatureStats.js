var cls = require("../packages/Class");
module.exports = CreatureStats = cls.Class.extend({
	init : function(options) {
		this.level = options.level;
		/*
			These are the basic stats that can be controlled.

			When doing combat - the derived stats are used.
		*/
		//Increases attack strength in melee combat and weight limit.
		this.strength = options.strength;
		// Increases attack speed and dodge rate.
		this.agility = options.agility;
		//Increases physical defense, maximum HP and HP recovery rate.
		this.vitality = options.vitality;
		//Increases magic attack, magic defense and maximum SP.
		this.intelligence = options.intelligence;
		// Increases accuracy, ranged attack strenght and minimum damage dealt, and lowers the cast time for some skills and spells.
		this.dexterity = options.dexterity;
		// Increases Critical hits and perfect dodge rate.
		this.luck = options.luck;
		//The currently equipped weapon (used to determine total ATK)
		this.equippedWeapon = options.equippedWeapon;
		//An array of Armor-items
		this.equippedArmor = options.equippedArmor;
	},

	changeArmor : function(armor) {
		this.equippedArmor = armor;
	},
	
	changeWeapon : function(weapon) {
		this.equippedWeapon = weapon;
	},

	maxHp : function() {
		return Math.ceil((Math.log(this.level) * 100) + 10);
	},

	/*	
		AttackPower (ATK) determines how much damage is dealt.
	*/
	attackPower : function() {
		var weaponAtk = this.equippedWeapon != null ? this.equippedWeapon.attackPower : 0;
		return this.strength + weaponAtk;
	},

	/*
		The defense based on vitality
	*/
	softDefense : function() {
		return this.vitality;
	},

	/*
		Defense based on equipped armor.
	*/
	hardDefense : function(atk) {
		var num = 0;
		if(this.equippedArmor != null) {
			for (var i = this.equippedArmor.length - 1; i >= 0; i--) {
				num += this.equippedArmor[i].defense;
			};
		}
		return num;
	},

	accuracy : function() {
		return this.level + this.dexterity;
	},

	hitChance : function(enemyDodge) {
		var hitChance =  (80 + this.accuracy - enemyDoge) / 100;
		return hitChance < 0.05 ? 0.05 : hitChance;
	},

	dodge : function() {
		return this.level + this.agility;
	},

	/*
		1s - this == how long the player needs to wait between
		attacks.
	*/
	attackSpeed : function() {
		return this.agility * 2;
	}
});