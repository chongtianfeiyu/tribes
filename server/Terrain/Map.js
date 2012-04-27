
var cls = require("../packages/Class");
module.exports = Map = cls.Class.extend({
	width : null,
	height : null,

	init : function(width, height) {
		this.width = width;
		this.height = height;
		this.initializeMovementGrid();
	},

	initializeMovementGrid : function() {
		this.movementGridDivident = 100;
		var w = this.width / this.movementGridDivident;
		var h = this.height / this.movementGridDivident;
		this.movementGrid = [];
		for(var i = 0; i < h; i++) {
			this.movementGrid[i] = [];
			for(var j = 0; j < w; j++){
				this.movementGrid[i][j] = 0;
			}
		}
	},

	/*
		Converts a "Free" position into a position in the center of the grid-cell 
	*/
	gridifyPosition : function(v) {
		if(v == null)
			return v;
		return {
			x : Math.floor(v.x/this.movementGridDivident) * this.movementGridDivident + this.movementGridDivident / 2,
			y : v.y,
			z : Math.floor(v.z/this.movementGridDivident) * this.movementGridDivident + this.movementGridDivident / 2
		};
	},

	/*
		Returns a 
	*/
	getPositionFromGridCell : function(x, z) {
		return {
			x : x * this.movementGridDivident + this.movementGridDivident / 2,
			y : 0,
			z : z * this.movementGridDivident + this.movementGridDivident / 2
		}
	},

	center : function() {
		return {x : this.width / 2, z : this.height / 2, y: 0};
	},

	nearCenter : function() {
		var center = this.center();
		center.x += (Math.random() * 1000) - 500;
		center.z += (Math.random() * 1000) - 500;
		return this.gridifyPosition(center);
	},

	isInBounds : function(pos) {
		return pos.x > 0 && pos.x < this.width
			&& pos.z > 0 && pos.z < this.height;
	}
});