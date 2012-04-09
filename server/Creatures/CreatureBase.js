var cls = require("../packages/Class");
var Vector3 = require("../packages/Vector3");

module.exports = CreatureBase = cls.Class.extend({
	init : function(options) {
		this.position = options.position;
		this.uid = options.uid;
		this.goalVector = options.goalVector;
		this.targetUid = options.targetUid;
	},

	synchronize : function(data) {
		this.goalVector = data.goalVector;
		this.targetUid = data.targetUid;
	},

	update : function() {
		var speed = 10;
		var goal = new Vector3(this.goalVector.x, this.goalVector.y, this.goalVector.z);
		var position = new Vector3(this.position.x, this.position.y, this.position.z);
		var direction = goal.subtract(position).normalize();
		var dx = speed * direction.x;
		var dz = speed * direction.z;
		if( (dx + dz) != 0 ){
			this.position.x += dx;
			this.position.z += dz;
			this.tick = new Date().getTime();
		}
	}
});