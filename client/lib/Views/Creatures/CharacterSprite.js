Game.Views.CharacterSprite = Class.extend({
		//The total number of animation-slots available in the sheet
		frameSlots : 10,
		//The total number of animations available in the sheet
		animationSlots : 13,
		//The number of animation-slots per animation
		animationFrames : [
				8, //1 - Walk S
				8, //2
				8, //3
				8, //4
				8, //5
				8, //6
				8, //7
				8, //8
				8, //9
				8, //10
				8, //11
				8, //12
				8 //13
			],
		//The current animation-frame
		currentFrame : 0,
		currentAngularOffset : 0,
		//The current animation
		currentAnimation : 0,
		//The animation-speed (in milliseconds)
		animationSpeed : 100,
		//The url to the sprite-sheet
		sheetUrl : "resources/sprites/character/basic.png?V=1",

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
			this.mesh.scale.x = 0.1;
			this.mesh.scale.y = 0.1;
			this.updateMesh();
			global.app.scene.add(this.mesh);
		},
		
		flipSpriteEast : function() {
			this.mesh.scale.x = -0.1
		},

		flipSpriteWest : function() {
			this.mesh.scale.x = 0.1
		},

		setAngle : function(angle) {
			var absAngle = Math.abs(angle);
			if(absAngle < 18)
				this.currentAngularOffset = 0;
			else if(absAngle < 60)
				this.currentAngularOffset = 1;
			else if(absAngle < 114)
				this.currentAngularOffset = 2;
			else if(absAngle < 160) 
				this.currentAngularOffset = 3;
			else 
				this.currentAngularOffset = 4;
			if(angle > 0)
				this.flipSpriteWest();
			else
				this.flipSpriteEast();
			this.mesh.uvOffset.y = (this.currentAnimation + this.currentAngularOffset)/this.animationSlots;
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
			this.mesh.uvOffset.y = (this.currentAnimation + this.currentAngularOffset)/this.animationSlots;
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