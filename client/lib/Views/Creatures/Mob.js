Game.Views.Creatures.Mob = Game.Views.Creatures.CreatureBase.extend({
	init : function(options) {
		this._super(options);
		
		var materials = [];
		for ( var i = 0; i < 6; i ++ ) {

			materials.push( new THREE.MeshBasicMaterial( { color: "#000000" } ) );

		}
		// cube
		this.mesh = new THREE.Mesh( new THREE.CubeGeometry( 30, 30, 30, 1, 1, 1, materials ), new THREE.MeshFaceMaterial() );
		this.mesh.position.y = 15;

		this.mesh.pointer = this;
		global.app.scene.add(this.mesh);
	},



	update : function(data) {
		
		//Move meshes
		this._super(data);


		this.mesh.position.x = this.position.x;
		this.mesh.position.z = this.position.z;
	},

	getIntersectText : function() {
		return "Evil mob!";
	},

	getIntersectMeshes : function() {
		return [this.mesh];
	},

	destroy : function() {
		global.app.scene.remove(this.mesh);
	}
});
