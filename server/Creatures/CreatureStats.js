var cls = require("../packages/Class");
var _ = require("Underscore");
module.exports = CreatureStats = cls.Class.extend({
	init : function(options) {
		this.level = options.level;
		//Points to the creature that owns the stats
		this.creature = options.creature;
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
		//Accumulated EXP
		this.accumulatedExperience = options.accumulatedExperience || 0;

		this.latestUpdate = new Date().getTime();

		//An array of Armor-items
		this.equippedArmor = options.equippedArmor;
		this.currentHp = options.currentHp || null;
		_.bindAll(this, 
			"changeArmor", 
			"changeWeapon", 
			"hp", 
			"maxHp", 
			"receiveDamage", 
			"attackPower",
			"softDefense",
			"hardDefense",
			"accuracy",
			"dodge",
			"attackSpeed",
			"addExperience",
			"update"
			);
	},

	update : function() {
		var diff = new Date().getTime() - this.latestUpdate;
		if(diff > 1000) {
			if(this.hp() < this.maxHp()) {
				this.currentHp += this.maxHp() / 30;
				if(this.currentHp > this.maxHp()) {
					this.currentHp = this.maxHp();
				}
				this.creature.tick = new Date().getTime();
				console.log("Regenerates hp to " + this.currentHp);
			}
			this.latestUpdate = new Date().getTime();
		}
	},

	addExperience : function(exp) {
		this.accumulatedExperience += exp;
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

	hp : function() {
		if(this.currentHp == null) {
			this.currentHp = this.maxHp();
		}
		return this.currentHp;
	},

	receiveDamage : function(damage) {
		var hp = this.hp();
		var result = hp - damage;
		if(result < 0) result = 0;

		this.currentHp = Math.round(result);
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

	dodge : function() {
		return this.level + this.agility;
	},

	isAlive : function() {
		return this.hp() > 0;
	},

	/*
		1s - this == how long the player needs to wait between
		attacks.
	*/
	attackSpeed : function() {
		return this.agility * 2;
	}
});