Game.Views.Player = (function(){
	var 
		goalVector = new THREE.Vector3(), 
		startVector = new THREE.Vector3(), 
		endVector = new THREE.Vector3(), 
		dirVector = new THREE.Vector3(), 
		t;
	var speed = 10;
	var rotationSpeed = 0.1;

	return {
		position : null,
		mesh : null,

		init : function() {
			_.bindAll(this, "update", "changeGoalVector");
			Input.addOnClickEvent(this.changeGoalVector);
			// material
			var material = new THREE.MeshLambertMaterial({
				color: 0xFFFFFF
			});
			// cube
			this.mesh = new THREE.Mesh(new THREE.CubeGeometry(30, 30, 30), material);
			this.mesh.position.y = 15;
			this.mesh.overdraw = true;
			global.app.scene.add(this.mesh);
		},

		update : function() {
			var dir = new THREE.Vector3();
			dir.sub(goalVector, this.mesh.position);
			dir.normalize();
			this.mesh.position.x += speed * dir.x;
			this.mesh.position.z += speed * dir.z;
		},

		changeGoalVector : function() {
			// Convert screen coordinates to NDC coordinates -1.0 to 1.0
	  		x = ( Input.mouseX / window.innerWidth ) * 2 - 1;
	  		y = - ( Input.mouseY / window.innerHeight ) * 2 + 1;
	  		
	  		// Obtain one vector at click position for each side of the cube mapping
	  		startVector.set( x, y, -1.0 );
	  		endVector.set( x, y, 1.0 );
	  	
	  		// Convert coordinates back to world coordinates
	  		startVector = global.app.projector.unprojectVector( startVector, global.app.camera );
	  		endVector = global.app.projector.unprojectVector( endVector, global.app.camera );
	  	
	  		// Get direction from startVector to endVector
	  		dirVector.sub( endVector, startVector );
	  		dirVector.normalize();
	  	
	  		// Find intersection where y = 0
	  		t = startVector.y / - ( dirVector.y );
	  
	  		// Start walking
	  		goalVector.set( startVector.x + t * dirVector.x,
	  			startVector.y + t * dirVector.y,
	  			startVector.z + t * dirVector.z );


		}
	}
})