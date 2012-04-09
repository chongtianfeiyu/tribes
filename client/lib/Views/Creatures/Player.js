Game.Views.Creatures.Player = Game.Views.Creatures.CreatureBase.extend({
	init : function(options) {
		this._super(options);
		this.isCurrent = options.isCurrent;
		this.name = options.name;
		this.latestSync = 0;
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

	/*
		No data-change update
	*/
	animationUpdate : function() {
		this.playerTag.lookAt(global.app.camera.position);
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
