
var cls = require("../packages/Class");
module.exports = Map = cls.Class.extend({
	width : null,
	height : null,

	init : function(width, height) {
		console.log("Map init, w:" + width + ", h:" + height);
		this.width = width;
		this.height = height;
		this.initializeMovementGrid();
	},

	initializeMovementGrid : function() {
		this.movementGridDivident = 50;
		var w = this.getMovementGridWidth();
		var h = this.getMovementGridHeight();
		this.movementGrid = [];
		for(var i = 0; i < h; i++) {
			this.movementGrid[i] = [];
			for(var j = 0; j < w; j++){
				this.movementGrid[i][j] = 0;
			}
		}
	},

	getMovementGrid : function() {
		return this.movementGrid;
	},

	getMovementGridWidth : function() {
		return this.width / this.movementGridDivident;
	},

	getMovementGridHeight : function() {
		return	this.height / this.movementGridDivident;
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

	getGridCellFromPosition : function(p) {
		return {
			x : Math.floor(p.x/this.movementGridDivident),
			z : Math.floor(p.z/this.movementGridDivident)
		}
	},

	/*
		Returns a 
	*/
	getPositionFromGridCell : function(x, z) {
		var pos = {
			x : x * this.movementGridDivident,
			y : 0,
			z : z * this.movementGridDivident
		};
		return this.gridifyPosition(pos);
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