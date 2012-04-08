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
			tree.tick = 0;
			objects.push(tree);
		},

		getTerrain : function(tick) {
			var dx = [];
			for (var i = objects.length - 1; i >= 0; i--) {
				var o = objects[i];
				if(o.tick > tick)
					dx.push(o);
			};
			return dx;
		},

		update : function(worldTick) {
			for (var i = objects.length - 1; i >= 0; i--) {
				var o = objects[i];
				if(!o.fullyGrown()){
					o.tick = worldTick;
					o.grow();
				}

				else if(o.childCount == undefined)
					o.childCount = Math.random() * 2;
				else if(o.childCount <= 2) {
					o.childCount += 1;
					var child = o.breed();
					child.tick = worldTick;
					objects.push(child);
				}
			};
		}
	}
});