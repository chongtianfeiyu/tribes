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
		if(this.targetUid != null) {
			var targetObject = this.gameManager.findFromUid(this.targetUid);
			if(targetObject != undefined) {
				this.goalVector = targetObject.position;
				targetObject.onTargetedBy(this);
			}
		}

		if(this.goalVector == null)
			return;
		
		var speed = this.speed;
		var goal = new Vector3(this.goalVector.x, this.goalVector.y, this.goalVector.z);
		var position = new Vector3(this.position.x, this.position.y, this.position.z);
		var direction = goal.subtract(position).normalize();
		var dx = speed * direction.x;
		var dz = speed * direction.z;
		var diffx = this.goalVector.x - this.position.x;
		var diffz = this.goalVector.z - this.position.z;
		if( Math.abs(diffx+diffz) > 2){
			this.position.x += dx;
			this.position.z += dz;
			this.tick = new Date().getTime();
		}
		else {
			this.goalVector = null;
		}
	}
});