/* Manages terrain-objects ( trees etc ) */
module.exports = (function(){
	var trees = [];
	return {
		init : function() {
			console.log("init terrain-manager");
			var start = {x : 100, y : 0, z : 100};
			var data = {
				x : 0,
				y : 100,
				z : 0,
				w : 20,
				c : [
					{
						x : 10,
						y : 10,
						z : 10,
						w : 5,
						f : 10
					},
					{
						x : -30,
						y : 30,
						z : 30,
						w : 5,
						f : 10
					},
					
				]
			};

			trees.push({start: start, data : data});
		},

		getTerrain : function() {
			return {
				trees : trees
			};
		}
	}
});