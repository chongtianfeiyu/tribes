var cls = require("../packages/Class");
var Vector3 = require("../packages/Vector3");

module.exports = CreatureBase = cls.Class.extend({
	init : function(options) {
		this.speed = 3;
		this.position = options.position;
		this.uid = options.uid;
		this.goalVector = options.goalVector;
		this.targetUid = options.targetUid;
	},

	onTargetedBy : function(other) {

	},

	synchronize : function(data) {
		this.goalVector = data.goalVector;
		this.targetUid = data.targetUid;
	},

	update : function() {
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
		if( Math.abs(diffx) > 1 || Math.abs(diffz) > 1){
			this.position.x += dx;
			this.position.z += dz;
			this.tick = new Date().getTime();
		}
		else {
			this.goalVector = null;
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
		}
	}
});