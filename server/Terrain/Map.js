
var cls = require("../packages/Class");
module.exports = Map = cls.Class.extend({
	width : null,
	height : null,

	init : function(width, height) {
		this.width = width;
		this.height = height;
	},

	center : function() {
		return {x : this.width / 2, z : this.height / 2, y: 0};
	},

	nearCenter : function() {
		var center = this.center();
		center.x += (Math.random() * 1000) - 500;
		center.z += (Math.random() * 1000) - 500;
		return center;
	},


	isInBounds : function(pos) {
		return pos.x > 0 && pos.x < this.width
			&& pos.z > 0 && pos.z < this.height;
	}
});