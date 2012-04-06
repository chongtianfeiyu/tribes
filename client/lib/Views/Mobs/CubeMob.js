var CubeMob = (function(){
	var 
		SPEED = 2,
		target = null,
		angry = false;
	return {
		init : function() {
			_.bindAll(this, "update");
			// material
			var material = new THREE.MeshLambertMaterial({
				color: 0xEDEDED
			});
			// cube
			this.mesh = new THREE.Mesh(new THREE.CubeGeometry(30, 30, 30), material);
			this.mesh.position.y = 15;
			this.mesh.position.x = -Math.random() * 10000 - 300;
			this.mesh.position.z = -Math.random() * 10000 - 300;
			this.mesh.overdraw = true;
			global.app.scene.add(this.mesh);
			this.randomTarget();
		},

		update : function() {
			var distToPlayer = new THREE.Vector3();
			distToPlayer.sub(global.app.world.player.mesh.position, this.mesh.position);
			var len = distToPlayer.length();
			if(len<1000) {
				angry = true;
				SPEED = 8;
				
			}
			else {
				SPEED = 2;
				angry = false;
			}

			var dir = new THREE.Vector3()
			if(angry) {
				dir.sub(global.app.world.player.mesh.position, this.mesh.position).normalize();
			}
			else {
				dir.sub(this.target, this.mesh.position);
				if(dir.length() < 1) {
					console.log("NEW TARGET");
					this.randomTarget();
				}
				dir.normalize();
			}

			this.mesh.position.x += SPEED * dir.x;
			this.mesh.position.z += SPEED * dir.z;
		},

		randomTarget : function() {
			this.target = new THREE.Vector3(
					this.mesh.position.x + ((Math.random() * 2000) - 1000), 
					this.mesh.position.y, 
					this.mesh.position.z + ((Math.random() * 2000) - 1000));
		}
	}

});