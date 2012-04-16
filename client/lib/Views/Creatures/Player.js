Game.Views.Creatures.Player = Game.Views.Creatures.CreatureBase.extend({
	init : function(options) {
		this._super(options);
		this.isCurrent = options.isCurrent;
		this.name = options.name;
		
		var materials = [];
		for ( var i = 0; i < 6; i ++ ) {

			materials.push( new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } ) );

		}
		// cube
		this.mesh = new THREE.Mesh( new THREE.CubeGeometry( 30, 30, 30, 1, 1, 1, materials ), new THREE.MeshFaceMaterial() );
		this.mesh.position.y = 15;

		this.mesh.pointer = this;
		global.app.scene.add(this.mesh);

		var text3d = new THREE.TextGeometry( this.name ,{size: 20, height: 1, curveSegments: 1, font:'helvetiker'});
		THREE.GeometryUtils.center( text3d );
		var textMaterial = new THREE.MeshBasicMaterial( { color: 0xA10000, overdraw: true } );
		this.playerTag = new THREE.Mesh( text3d, textMaterial );
		this.playerTag.position.y += 80;
		
        
        global.app.scene.add(this.playerTag);
	},

	/*
		No data-change update
	*/
	animationUpdate : function() {
		this.playerTag.lookAt(global.app.camera.position);
	},

	update : function(data) {
		
		//Move meshes
		this._super(data);

		//Players recieve HP-data
		this.currentHp = data.currentHp;
		this.maxHp = data.maxHp;

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

	destroy : function() {
		global.app.scene.remove(this.mesh);
		global.app.scene.remove(this.playerTag);
	}
});
