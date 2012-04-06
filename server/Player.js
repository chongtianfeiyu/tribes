module.exports = function(options) {
	var name = options.name;
	var position = options.position;
	var rotation = options.rotation;
	var index = options.index;
	var goal = options.goal;
	
	return {
		getPosition : function() {
			return position;
		},
		getGoal : function() {
			return goal;
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
		setGoal : function(x, y, z) {
			goal = {x : x, y : y, z : z};
		}
	}
};