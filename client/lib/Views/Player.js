Game.Views.Player = (function(){
	
	var speed = 10;
	var rotationSpeed = 0.1;
	var latestChange = new Date().getTime();
	var latestSync = 0;

	return {
		position : null,
		mesh : null,
		goalVector : null,
		name : null,
		uid : null,
		isCurrent : false,

		init : function() {
			_.bindAll(this, "update", "changeGoalVector");
			if(this.isCurrent == true)
				Input.addOnClickEvent(this.changeGoalVector);
			this.goalVector = new THREE.Vector3();
			// material
			var material = new THREE.MeshLambertMaterial({
				color: 0xAADDEE
			});
			// cube
			this.mesh = new THREE.Mesh(new THREE.CubeGeometry(30, 30, 30), material);
			this.mesh.position.y = 15;
			this.mesh.overdraw = true;

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
			dir.sub(this.goalVector, this.mesh.position);
			dir.normalize();
			var dX = speed * dir.x;
			var dZ = speed * dir.z; 
			this.mesh.position.x += dX;
			this.mesh.position.z += dZ;
			this.playerTag.position.x = this.mesh.position.x;
			this.playerTag.position.z = this.mesh.position.z;
			this.playerTag.lookAt(global.app.camera.position);
			if((dX + dZ) != 0) {
				lastChange = new Date().getTime();
			}
				
			this.syncToServer();
			
		},

		syncToServer : function() {
			if(latestChange > latestSync && this.isCurrent) {
				latestSync = latestChange;
				global.app.client.setPlayerPos();
			}
		},

		destroy : function() {
			global.app.scene.remove(this.mesh);
			global.app.scene.remove(this.playerTag);
		},

		changeGoalVector : function() {
			var 
				startVector = new THREE.Vector3(), 
				endVector = new THREE.Vector3(), 
				dirVector = new THREE.Vector3(), 
				t;
			latestChange = new Date().getTime();
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
	  		this.goalVector.set( startVector.x + t * dirVector.x,
	  			startVector.y + t * dirVector.y,
	  			startVector.z + t * dirVector.z );


		}
	}
})