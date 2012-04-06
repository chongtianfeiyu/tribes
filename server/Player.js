module.exports = function(options) {
	var name = options.name;
	var position = options.position;
	var rotation = options.rotation;
	var index = options.index;
	
	return {
		getPosition : function() {
			return position;
		},
		getName : function() {
			return name;
		},
		getIndex : function() {
			return index;
		},
		setPosition : function(x, y, z) {
			position = {x : x, y : y, z : z};
		}
	}
};