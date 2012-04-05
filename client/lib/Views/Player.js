Game.Views.Player = (function(){
	var goalVector, startVector, endVector, dirVector, t;
	var speed = 2;

	return {
		position : null,
		mesh : null,

		init : function() {
			_.bindAll(this, "update");

			// material
			var material = new THREE.MeshLambertMaterial({
				color: 0x111111	
			});
			// cube
			this.mesh = new THREE.Mesh(new THREE.CubeGeometry(10, 10, 20), material);
			this.mesh.overdraw = true;
			global.app.scene.add(this.mesh);

		},

		update : function() {
			if(Input.mouseDown) {
				this.changeGoalVector();
			}
			if(dirVector != null && goalVector != null) {
				
				this.mesh.position.x += speed * dirVector.x;
				this.mesh.position.y += speed * dirVector.z;
				
				//console.log(this.mesh.position.z);
			}
		},

		changeGoalVector : function() {
			var x =   ( Input.mouseX / window.innerWidth ) * 2 - 1;
			var y = - ( Input.mouseY / window.innerHeight) * 2 + 1;

			startVector = new THREE.Vector3(x, -1.0, y);
			endVector = new THREE.Vector3(x, 1.0, y);

			startVector = global.app.projector.unprojectVector(startVector, global.app.camera);
			endVector = global.app.projector.unprojectVector(endVector, global.app.camera);

			dirVector = new THREE.Vector3();
			dirVector.sub(endVector, startVector);
			dirVector = dirVector.normalize();

			t = startVector.z / - (dirVector.z);

			goalVector = new THREE.Vector3();

			goalVector.set( 
				startVector.x + t * dirVector.x,
				startVector.y + t * dirVector.y,
				startVector.z + t * dirVector.z);
			console.log(goalVector);

		}
	}
})