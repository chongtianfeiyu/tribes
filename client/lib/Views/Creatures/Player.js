Game.Views.Player = (function(){
	
	var speed = 10;
	var rotationSpeed = 0.1;
	var latestSync = 0;

	return {
		//The current position of the player
		position : null,
		mesh : null,
		latestChange : new Date().getTime(),

		//The current goal-vector (when moving along the terrain)
		goalVector : null,
		targetUid : null,
		//The name of the player
		name : null,
		//The unique identifier of the player
		uid : null,
		//Indicates whether this is the player that the user is in control of
		isCurrent : false,
		
		getIntersectText : function() {
			return this.name;
		},

		getIntersectMeshes : function() {
			return [this.mesh];
		},

		init : function() {
			_.bindAll(this, "update",  "syncToServer");
			this.goalVector = new THREE.Vector3();
			// material
			var color = this.isCurrent == true ? 0xFF0066 : 0xAAEEDD;
			var material = new THREE.MeshLambertMaterial({
				color: color
			});
			// cube
			this.mesh = new THREE.Mesh(new THREE.CubeGeometry(30, 30, 30), material);
			this.mesh.pointer = this;
			this.mesh.position.y = 15;
			this.mesh.overdraw = true;
			global.app.scene.add(this.mesh);

			var text3d = new THREE.TextGeometry( this.name ,{size: 20, height: 1, curveSegments: 1, font:'helvetiker'});
			THREE.GeometryUtils.center( text3d );
			var textMaterial = new THREE.MeshBasicMaterial( { color: 0xA10000, overdraw: true } );
			this.playerTag = new THREE.Mesh( text3d, textMaterial );
			this.playerTag.position.y += 90;
            
            global.app.scene.add(this.playerTag);
		},

		update : function(data) {
			if(data.position) {
				console.log("Set new pos");
				this.position = data.position;
				this.mesh.position.x = data.position.x;
				this.mesh.position.z = data.position.z;
				this.playerTag.position.x = data.position.x;
				this.playerTag.position.z = data.position.z;
			}
		},

		syncToServer : function() {
			if(this.latestChange > latestSync && this.isCurrent) {
				latestSync = this.latestChange;
				var data = {
					uid : this.uid,

					position : {
						x : this.position.x,
						y : this.position.y,
						z : this.position.z
					},

					goalVector : {
						x : this.goalVector.x,
						y : this.goalVector.y,
						z : this.goalVector.z
					},

					targetUid : this.targetUid
				};
				global.app.client.syncObject(data);
			}
		},

		destroy : function() {
			global.app.scene.remove(this.mesh);
			global.app.scene.remove(this.playerTag);
		}
	}
})