Game.Views.Creatures.Player = Game.Views.Creatures.CreatureBase.extend({
	init : function(options) {
		this._super(options);
		this.isCurrent = options.isCurrent;
		this.name = options.name;
		this.latestSync = 0;
		// material
		var texture  = THREE.ImageUtils.loadTexture("resources/sprites/mobs/GM_Robot_noBG.png");
		
		// cube
		this.mesh = new THREE.Sprite( { map: texture, useScreenCoordinates: false, affectedByDistance: true } );
		this.mesh.scale.y = 0.2;
		this.mesh.scale.x = 0.2;
		// Set offset to first sprite of 24 images
		this.mesh.uvScale.x = 0.11;
		this.mesh.uvScale.y = 0.13;
		this.mesh.uvOffset.x = 0;
		this.mesh.position.y = 60;
	
		this.mesh.pointer = this;
		global.app.scene.add(this.mesh);

		var text3d = new THREE.TextGeometry( this.name ,{size: 20, height: 1, curveSegments: 1, font:'helvetiker'});
		THREE.GeometryUtils.center( text3d );
		var textMaterial = new THREE.MeshBasicMaterial( { color: 0xA10000, overdraw: true } );
		this.playerTag = new THREE.Mesh( text3d, textMaterial );
		this.playerTag.position.y += 150;
        
        global.app.scene.add(this.playerTag);
	},

	/*
		No data-change update
	*/
	animationUpdate : function() {
		this.playerTag.lookAt(global.app.camera.position);
		if(this.goalVector != null) {
			var lookAtGoal = new THREE.Vector3(this.goalVector.x, 15, this.goalVector.z);
			//this.mesh.lookAt(lookAtGoal);
				//Don't rotate around x/z-axis
				this.mesh.rotation.x = this.mesh.rotation.z = 0;
		}
		this.syncToServer();
	},

	update : function(data) {
		this._super(data);
		//Move meshes
		this.mesh.position.x = this.position.x;
		this.mesh.position.z = this.position.z;
		this.playerTag.position.x = this.position.x;
		this.playerTag.position.z = this.position.z;
	},

	getIntersectText : function() {
		return this.name;
	},

	getIntersectMeshes : function() {
		return [this.mesh];
	},

	syncToServer : function() {
		if(this.latestChange > this.latestSync && this.isCurrent) {
			console.log("Server push");
			this.latestSync = this.latestChange;
			var data = {
				uid : this.uid,

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
});
