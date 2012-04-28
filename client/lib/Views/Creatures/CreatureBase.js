
Game.Views.Creatures.CreatureBase = Class.extend({
	init : function(options) {
		_.bindAll(this, "animationUpdate");
		this.position = options.position;
		this.flares = [];
		this.uid = options.uid;
	},

	update : function(data) {
		this.position = data.position;
		this.goalVector = data.goalVector;
		this.position.y = global.app.world.terrain.getTerrainHeight(this.position.x, this.position.z);
		this.messageList = data.messageList;
	},

	animationUpdate : function() {
		this.animateFlares();
		this.updateAngleInRelationToCamera();
	},

	updateAngleInRelationToCamera : function() {
		if(this.position != null && this.goalVector != null) {
			var len = new THREE.Vector3().sub(this.position, this.goalVector).length();
			var gv = this.goalVector;
			if(len < 10 && this.prevGv != null) {
				gv = this.prevGv;
			} 
			this.prevGv = gv;
			this.angleInRelationToCamera = MathHelpers.angleSigned(
					global.app.camera.position.x, 
					global.app.camera.position.z,
					gv.x,
					gv.z,
					this.position.x,
					this.position.z);			
		}	
	},

	animateFlares : function() {
		for (var i = this.flares.length - 1; i >= 0; i--) {
			var flare = this.flares[i];
			flare.position.y += 0.5;
			flare.lookAt(global.app.camera.position);
			var yDiff = Math.abs(flare.position.y - flare.originalY);
			if(yDiff > 20) {
				global.app.scene.remove(flare);
				this.flares.splice(i, 1);
			}
		};
	},

	flare : function(message) {
		var text3d = new THREE.TextGeometry( message ,{size: 10, height: 1, curveSegments: 1, font:'helvetiker'});
		var textMaterial = new THREE.MeshBasicMaterial( { color: 0xA10000, overdraw: true } );
		var flare = new THREE.Mesh( text3d, textMaterial );
		flare.position = this.position;
		
		flare.position.y += 70;
		flare.originalY = flare.position.y;
		this.flares.push(flare);
		global.app.scene.add(flare);
	},

	destroy : function() {
		for (var i = this.flares.length - 1; i >= 0; i--) {
			global.app.scene.remove(this.flares[i]);
		};
	},
});