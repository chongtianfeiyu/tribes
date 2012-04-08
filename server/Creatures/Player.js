module.exports = function(options) {
	var name = options.name;
	var position = options.position;
	var rotation = options.rotation;
	var index = options.index;
	var goalVector = options.goalVector;
	var uid = options.uid;
	var targetUid = null;
	return {
		getPosition : function() {
			return position;
		},
		getUid : function() {
			return uid;
		},
		getGoalVector : function() {
			return goalVector;
		},
		getName : function() {
			return name;
		},
		getIndex : function() {
			return index;
		},
		setPosition : function(x, y, z) {
			position = {x : x, y : y, z : z};
		},
		setGoalVector : function(x, y, z) {
			goalVector = {x : x, y : y, z : z};
		},
		getTargetUid : function() {
			return targetUid;
		},
		setTargetUid : function(uid) {
			targetUid = uid;
		},

		synchronize : function(data) {
			this.setPosition(data.position.x, data.position.y, data.position.z);
			this.setGoalVector(data.goalVector.x, data.goalVector.y, data.goalVector.z);
			this.setTargetUid(data.targetUid);
		},

		getSynchData : function() {
			return {
				name : this.getName(),
				uid : this.getUid(),
				position : this.getPosition(),
				goalVector : this.getGoalVector(),
				targetUid : this.getTargetUid()
			};
		}
	}
};