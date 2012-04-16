Game.Controllers.CameraController = (function(camera){
	var CAMERA_OFFSET_Y = 300;
	var CAMERA_OFFSET_Y_MAX = 440;
	var CAMERA_OFFSET_Y_MIN = 235;
	var CAMERA_OFFSET_X = 500 * Math.sin(1 * MathHelpers.DEG_TO_RAD);
	var CAMERA_OFFSET_Z = 500 * Math.cos(1 * MathHelpers.DEG_TO_RAD);
	return {
		camera : null,
		init : function(camera, player) {
			//Camera-position (relative to player)
			this.camera = camera;
			this.player = player;
			this.camera.position.y = -100;
			this.camera.position.x = 0;
			this.camera.position.z = 0;
			this.accumulatedMouseDeltaX = 0;
			this.accumulatedMouseDeltaY = CAMERA_OFFSET_Y;
			_.bindAll(this, "update");
		},

		update : function() {
			if(MouseInput.mouseHold()) {
				this.accumulatedMouseDeltaX += MouseInput.deltaX * 0.2;
				this.accumulatedMouseDeltaY += MouseInput.deltaY;
				if(this.accumulatedMouseDeltaY > CAMERA_OFFSET_Y_MAX)
					this.accumulatedMouseDeltaY = CAMERA_OFFSET_Y_MAX;
				else if(this.accumulatedMouseDeltaY < CAMERA_OFFSET_Y_MIN)
					this.accumulatedMouseDeltaY = CAMERA_OFFSET_Y_MIN;
			}
			var rad = this.accumulatedMouseDeltaX * MathHelpers.DEG_TO_RAD;
			CAMERA_OFFSET_X = 500 * Math.sin(rad);
			CAMERA_OFFSET_Z = 500 * Math.cos(rad);

			
			this.camera.position.x = this.player.mesh.position.x + CAMERA_OFFSET_X;
			this.camera.position.z = this.player.mesh.position.z + CAMERA_OFFSET_Z;
			this.camera.position.y = this.player.mesh.position.y + this.accumulatedMouseDeltaY;
			this.camera.lookAt(this.player.mesh.position); 
		}
	}
});