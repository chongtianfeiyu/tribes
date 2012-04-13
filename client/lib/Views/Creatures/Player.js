Game.Views.Creatures.Player = Game.Views.Creatures.CreatureBase.extend({
	init : function(options) {
		this._super(options);
		this.isCurrent = options.isCurrent;
		this.name = options.name;
		this.latestSync = 0;
		
		var materials = [];
		for ( var i = 0; i < 6; i ++ ) {

			materials.push( new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } ) );

		}
		// cube
		this.mesh = new THREE.Mesh( new THREE.CubeGeometry( 20, 20, 20, 1, 1, 1, materials ), new THREE.MeshFaceMaterial() );
		this.mesh.position.y = 15;

		this.mesh.pointer = this;
		global.app.scene.add(this.mesh);

		var text3d = new THREE.TextGeometry( this.name ,{size: 20, height: 1, curveSegments: 1, font:'helvetiker'});
		THREE.GeometryUtils.center( text3d );
		var textMaterial = new THREE.MeshBasicMaterial( { color: 0xA10000, overdraw: true } );
		this.playerTag = new THREE.Mesh( text3d, textMaterial );
		this.playerTag.position.y += 150;
		this.animFramCount = 0;
        
        global.app.scene.add(this.playerTag);
        this.globalCount = 0;
	},

	/*
		No data-change update
	*/
	animationUpdate : function() {
		this.playerTag.lookAt(global.app.camera.position);
		
		
		this.syncToServer();
	},

	update : function(data) {
		
		//Move meshes
		this._super(data);


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
