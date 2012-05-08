var cls = require("../packages/Class");
var Vector3 = require("../packages/Vector3");
var BattleLogic = require("../GameLogic/BattleLogic");
var MovementHelper = require("../GameLogic/MovementHelper");
var _ = require("Underscore");

module.exports = CreatureBase = cls.Class.extend({
	
	init : function(options) {
		this.messageList = [];
		//Stats (CreatureStats.js)
		this.stats = options.stats;
		//Movement speed
		this.speed = 2;
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

	onAttackedBy : function(other) {

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
		this.setGoal(data.goalVector);
		this.targetUid = data.targetUid;
		this.targetIntent = data.targetIntent;
	},

	setGoal : function(goalVector) {
		this.goalVector = this.gameManager.map.gridifyPosition(goalVector);
		if(this.position != null && this.goalVector != null) {
			this.path = MovementHelper.getPathVector(this.position, this.goalVector, this.gameManager.map);
		}
	},

	synchData : function() {
		return {
			uid : this.uid,
			classTag : this.classTag,
			position : this.position,
			goalVector : this.goalVector,
			targetUid : this.targetUid,
			targetIntent : this.targetIntent,
			name : this.name,
			messageList : this.messageList
		}
	},

	/*
		The main update loop for this creature
	*/
	update : function() {
		if(this.alive == false) {
			//If dead for > 5 seconds, remove from world.
			var diff = new Date().getTime() - this.dieTime;
			if(diff > 5000 && this.classTag != "player") {
				this.gameManager.removeObject(uid);
				this.gameManager.decreaseMobCount();
			}
			return;
		}
		//Ensure that this.position is a proper Vector3
		this.position = new Vector3(this.position.x, this.position.y, this.position.z);
		if(this.targetUid != null) {
			this.setGoalVectorFromTarget();
		}

		if(this.goalVector == null){
			//Nothing to do - regen
			this.stats.update();
			return;
		}
		
		//If we are chasing a monster, we only need to be in an adjacent square.
		var proximityRange = this.targetUid != null ? this.attackRange : 1;
		var newPosition = MovementHelper.getNewPosition(
			this.speed, 
			this.position, 
			this.path, 
			proximityRange,
			this.gameManager.map);

		if(newPosition != null) {
			this.position.x += newPosition.x;
			this.position.z += newPosition.z;
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
			var targetPosition = new Vector3(targetObject.position.x, targetObject.position.y, targetObject.position.z);
			if(	
				this.viewDistance != undefined 
				&& this.position.distanceTo(targetPosition) > this.viewDistance) {
				this.targetUid = null;
				this.goalVector = null;
			}
			else {
				this.setGoal(targetPosition);
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