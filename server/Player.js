module.exports = function(name, position, rotation, index) {
	var name = name;
	var position = position;
	var rotation = rotation;
	var index = index;
	
	return {
		getPosition : function() {
			return position;
		},
		getName : function() {
			return name;
		}
	}
};