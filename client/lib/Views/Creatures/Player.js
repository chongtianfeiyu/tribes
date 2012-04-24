Game.Views.Creatures.Player = Game.Views.Creatures.CreatureBase.extend({
	init : function(options) {
		this._super(options);
		this.isCurrent = options.isCurrent;
		this.name = options.name;
		this.yOffset = 30;
		this.playerTagYOffset = 40;
		
		this.sprite = new Game.Views.CharacterSprite();
		this.mesh = this.sprite.mesh;
		this.mesh.position.y =  this.yOffset;
		this.mesh.pointer = this;
		global.app.scene.add(this.mesh);

		var text3d = new THREE.TextGeometry( this.name ,{size: 5, height: 1, curveSegments: 1, font:'helvetiker'});
		THREE.GeometryUtils.center( text3d );
		var textMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, overdraw: true } );
		this.playerTag = new THREE.Mesh( text3d, textMaterial );
		this.playerTag.position.y += this.playerTagYOffset;
        global.app.scene.add(this.playerTag);
	},

	/*
		No data-change update
	*/
	animationUpdate : function() {
		this._super();
		this.sprite.animate();
		this.playerTag.lookAt(global.app.camera.position);
	},

	update : function(data) {
		
		//Super update
		this._super(data);
		//Current player recieve HP-data
		if(this.isCurrent) {
			Game.Controllers.HUD.setHP(data.stats.hp, data.stats.maxHp);
		}

		this.mesh.position.x = this.position.x;
		this.mesh.position.z = this.position.z;
		this.mesh.position.y = this.position.y  + this.yOffset;
		
		this.playerTag.position.x = this.position.x;
		this.playerTag.position.z = this.position.z;
		this.playerTag.position.y = this.mesh.position.y + this.playerTagYOffset;

	},

	getIntersectText : function() {
		return this.name;
	},

	getIntersectMeshes : function() {
		return [this.mesh];
	},

	destroy : function() {
		this._super();
		global.app.scene.remove(this.mesh);
		global.app.scene.remove(this.playerTag);
	}
});
