module.exports = function(options) {
	var name = options.name;
	var position = options.position;
	var rotation = options.rotation;
	var index = options.index;
	var goalVector = options.goalVector;
	
	return {
		getPosition : function() {
			return position;
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
		}
	}
};