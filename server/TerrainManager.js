/* Manages terrain-objects ( trees etc ) */

var Tree = require("./TerrainObjects/Tree");

module.exports = (function(){
	var objects = [];
	return {
		init : function() {
			console.log("init terrain-manager");
			var tree = new Tree();
			var start = {x : 100, y : 0, z : 100};
			

			tree.init(start);
			objects.push(tree);
		},

		getTerrain : function() {
			return objects;
		},

		update : function() {
			for (var i = objects.length - 1; i >= 0; i--) {
				var o = objects[i];
				if(!o.fullyGrown())
					o.grow();
			};
		}
	}
});