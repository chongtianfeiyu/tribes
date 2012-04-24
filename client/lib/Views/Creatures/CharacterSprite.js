Game.Views.CharacterSprite = Class.extend({
		//The total number of animation-slots available in the sheet
		frameSlots : 10,
		//The total number of animations available in the sheet
		animationSlots : 2,
		//The number of animation-slots per animation
		animationFrames : [
				8,
				8
			],
		//The current animation-frame
		currentFrame : 0,
		//The current animation
		currentAnimation : 0,
		//The animation-speed (in milliseconds)
		animationSpeed : 100,
		//The url to the sprite-sheet
		sheetUrl : "/resources/sprites/character/basic.png",

		//List of available animations and their indexes
		animations : {
			walk_south : 0,
			walk_southWest : 1
		},

		init : function() {
			var texture = THREE.ImageUtils.loadTexture( this.sheetUrl );
			this.mesh = new THREE.Sprite({map : texture, affectedByDistance:true, useScreenCoordinates:false});
			this.mesh.uvScale.x = 1/this.frameSlots;
			this.mesh.uvScale.y = 1/this.animationSlots;
			this.mesh.scale.x = 0.12;
			this.mesh.scale.y = 0.12;
			this.updateMesh();
			global.app.scene.add(this.mesh);
		},

		getMesh : function() {
			return this.mesh;
		},

		setAnimation : function(animationIndex){
			this.currentAnimation = animationIndex;
		},

		getNumberOfFrames : function() {
			return this.animationFrames[this.currentAnimation];
		},

		updateMesh : function() {
			this.mesh.uvOffset.x = this.currentFrame/this.frameSlots;
			this.mesh.uvOffset.y = this.currentAnimation/this.animationSlots;
			this.lastAnimation = new Date().getTime();
		},

		animate : function() {
			if((new Date().getTime() - this.lastAnimation) > this.animationSpeed) {
				if(this.currentFrame >= this.getNumberOfFrames())
					this.currentFrame = 0;
				this.updateMesh();
				++this.currentFrame;
			}
		},

	});