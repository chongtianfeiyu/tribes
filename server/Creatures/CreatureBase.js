var cls = require("../packages/Class");
var Vector3 = require("../packages/Vector3");
var BattleLogic = require("../GameLogic/BattleLogic");

module.exports = CreatureBase = cls.Class.extend({
	
	init : function(options) {
		//Stats (CreatureStats.js)
		this.stats = options.stats;
		//Movement speed
		this.speed = 3;
		//Initial speed
		this.position = options.position;
		//How far the weapon reaches
		this.attackRange = 30;
		//Unique identifier.
		this.uid = options.uid;
		//The vector that the creature is walking towards.
		this.goalVector = options.goalVector;
		//The targeted entity (if any) that the creature is chasing.
		this.targetUid = options.targetUid;
		//The intent of the targeting
		//Possible values: "attack" | "harvest" | "pickup"
		this.targetIntent = null;
		this.alive = true;
		this.spawnTime = new Date().getTime();
	},

	die : function(attacker) {
		this.dieTime = new Date().getTime();
		this.alive = false;
	},

	/*
		Triggered when the creature is targeted by another creature.
	*/
	onTargetedBy : function(other) {

	},

	/*
		Synchronizes data from another source.
	*/
	synchronize : function(data) {
		this.goalVector = data.goalVector;
		this.targetUid = data.targetUid;
		this.targetIntent = data.targetIntent;
	},

	/*
		The main update loop for this creature
	*/
	update : function() {
		if(this.alive == false)
			return;
		//Ensure that this.position is a proper Vector3
		this.position = new Vector3(this.position.x, this.position.y, this.position.z);
		if(this.targetUid != null) {
			this.setGoalVectorFromTarget();
		}

		if(this.goalVector == null)
			return;
		
		var speed = this.speed;
		var goal = new Vector3(this.goalVector.x, this.goalVector.y, this.goalVector.z);
		var direction = goal.subtract(this.position).normalize();
		var dx = speed * direction.x;
		var dz = speed * direction.z;
		var diffx = this.goalVector.x - this.position.x;
		var diffz = this.goalVector.z - this.position.z;
		var distanceRequired = this.targetUid != null ? this.attackRange : 1;

		if( Math.abs(diffx) > distanceRequired || Math.abs(diffz) > distanceRequired){
			this.position.x += dx;
			this.position.z += dz;
			this.tick = new Date().getTime();
		}
		else {
			//We have reached our destination.
			this.goalVector = null;
			this.handleGoalVectorReached();
		}
	},

	/*
		Sets the goalVector to the position of the target.
		If the target is out of viewing-range, the
		target is lost, and the goal-vector is set to null.
	*/
	setGoalVectorFromTarget : function() {
		var targetObject = this.gameManager.findFromUid(this.targetUid);
		if(targetObject != undefined) {
			if(	
				this.viewDistance != undefined 
				&& this.position.distanceTo(
					new Vector3(targetObject.position.x, targetObject.position.y, targetObject.position.z)) > this.viewDistance) {
				this.targetUid = null;
				this.goalVector = null;
			}
			else {
				this.goalVector = targetObject.position;
				targetObject.onTargetedBy(this);
			}
		} else {
			//Target has dissapeared for some reason.
			this.targetUid = null;
			this.goalVector = null;
		}
	},

	handleGoalVectorReached : function() {
		if(this.targetUid != null) {
			var targetObject = this.gameManager.findFromUid(this.targetUid);
			switch(this.targetIntent) {
				case "attack":
					BattleLogic.handleBattle(this, targetObject);
					break;
			}
		}
	}
});