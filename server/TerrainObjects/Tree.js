module.exports =  function(){
	var r = function(r1, r2) {
		return ((Math.random()*(r2 - r1)) + r1);
	};
	growGen = 0;
	growPotential = r(10, 15);
	return {
		position : null,
		data : null,
		classTag : "tree",
		fullyGrown : function() {
			return growGen > growPotential;
		},
		
		init : function(position, data) {
			this.position = position;
			this.growGen = 0;
			var data = {
				x : 0,
				y : r(10, 50),
				z : 0,
				w : 2,
				f : r(10, 20)
			};
			this.data = data;
		},

		grow : function() {
			this.growRecursive(this.data, 1)
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
					y : r(20, 30)/depth,
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
			++growGen;
		}
	}

};