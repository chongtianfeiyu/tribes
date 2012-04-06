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
		goal : goalVector,
		name : null,

		init : function() {
			_.bindAll(this, "update", "changeGoalVector");
			Input.addOnClickEvent(this.changeGoalVector);
			// material
			var material = new THREE.MeshLambertMaterial({
				color: 0xAADDEE
			});
			// cube
			this.mesh = new THREE.Mesh(new THREE.CubeGeometry(30, 30, 30), material);
			this.mesh.position.y = 15;
			this.mesh.overdraw = true;
			this.mesh.castShadow = true;

			var text3d = new THREE.TextGeometry( this.name ,{size: 20, height: 1, curveSegments: 1, font:'helvetiker'});
			THREE.GeometryUtils.center( text3d );
			var textMaterial = new THREE.MeshBasicMaterial( { color: 0xA10000, overdraw: true } );
			this.playerTag = new THREE.Mesh( text3d, textMaterial );
			this.playerTag.position.y += 90;
            global.app.scene.add(this.playerTag);

			global.app.scene.add(this.mesh);
		},

		update : function() {
			var dir = new THREE.Vector3();
			dir.sub(goalVector, this.mesh.position);
			dir.normalize();
			this.mesh.position.x += speed * dir.x;
			this.mesh.position.z += speed * dir.z;
			
			this.playerTag.position.x = this.mesh.position.x;
			this.playerTag.position.z = this.mesh.position.z;
			this.playerTag.lookAt(global.app.camera.position);
			
			global.app.client.setPlayerPos();
		},

		destroy : function() {
			global.app.scene.remove(this.mesh);
			global.app.scene.remove(this.playerTag);
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