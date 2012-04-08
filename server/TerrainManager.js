/* Manages terrain-objects ( trees etc ) */

var Tree = require("./Terrain/Tree");

module.exports = (function(){
	var objects = [];
	return {
		init : function() {
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

		update : function() {
			for (var i = objects.length - 1; i >= 0; i--) {
				var o = objects[i];
				if(!o.fullyGrown()){
					o.tick =  new Date().getTime();
					o.grow();
				}

				else if(o.childCount == undefined)
					o.childCount = Math.random() * 2;
				else if(o.childCount <= 2) {
					o.childCount += 1;
					var child = o.breed();
					child.tick = new Date().getTime();
					objects.push(child);
				}
			};
		}
	}
});