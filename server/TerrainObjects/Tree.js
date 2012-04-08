var Tree = function(){
	var r = function(r1, r2) {
		return ((Math.random()*(r2 - r1)) + r1);
	};
	
	return {
		//general object properties
		position : null,
		uid : null,
		//Dermines what view to use for this class
		classTag : "tree",

		//Grow-properties
		growGen : null,

		//Determines how many generations this tree can grow
		growPotential : null,

		//Data for branches
		data : null,
		fullyGrown : function() {
			return this.growGen > this.growPotential;
		},
		
		init : function(position) {
			this.position = position;
			this.growGen = 0;
			this.growPotential = r(3, 7);
			//First branch goes straight up
			var data = {
				x : 0,
				y : r(50, 70),
				z : 0,
				w : 2,
				f : r(10, 20)
			};
			this.data = data;
		},

		grow : function() {
			this.growRecursive(this.data, 1);
			++this.growGen;
		},
		growRecursive : function(data, depth) {
			
			if(data.y / depth < 50) 
				data.y += r(20, 30) / depth;
			data.w = this.data.y / depth;
			if(data.f < 100)
				data.f += 3;
			var branch = depth < 5;
			

			if(data.c){
				for (var i = data.c.length - 1; i >= 0; i--) {
					this.growRecursive(data.c[i], depth + 1);
				};
				branch = Math.random() * 5 > 2;
			}
			if(branch == true) {
				if(!data.c) data.c = [];
				data.c.push({
					x : r(-30, 30),
					y : r(50, 70)/depth,
					z : r(-30, 30),
					f : r(10, 20)
				});
				data.c.push({
					x : r(-30, 30),
					y : r(20, 30)/depth,
					z : r(-30, 30),
					f : r(10, 20)
				});

				data.f = null;
			}
		},	

		breed : function() {

			var child = new Tree();
			var newPos = {};
			newPos.x = this.position.x + r(-1000, 1000);
			newPos.y = this.position.y;
			newPos.z = this.position.z+ r(-1000, 1000);
			child.init(newPos);
			return child;
		}
	}

};

module.exports = Tree;