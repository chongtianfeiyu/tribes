Game.Controllers.CameraController = (function(camera){
	var CAMERA_OFFSET_Y = 400;
	var CAMERA_OFFSET_Y_MAX = 640;
	var CAMERA_OFFSET_Y_MIN = 235;
	var CAMERA_OFFSET_X = 500 * Math.sin(1 * MathHelpers.DEG_TO_RAD);
	var CAMERA_OFFSET_Z = 500 * Math.cos(1 * MathHelpers.DEG_TO_RAD);
	return {
		camera : null,
		init : function(camera, player) {
			//Camera-position (relative to player)
			this.camera = camera;
			this.player = player;
			this.camera.position.y = CAMERA_OFFSET_Y;
			this.camera.position.x = CAMERA_OFFSET_X;
			this.camera.position.z = CAMERA_OFFSET_Z;
			this.accumulatedMouseDeltaX = 0;
			this.accumulatedMouseDeltaY = CAMERA_OFFSET_Y;
			_.bindAll(this, "update");
		},

		update : function() {
			if(Input.mouseHold()) {
				this.accumulatedMouseDeltaX += Input.deltaX * 0.2;
				this.accumulatedMouseDeltaY += Input.deltaY;
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
			this.camera.position.y = this.accumulatedMouseDeltaY;
			this.camera.lookAt(this.player.mesh.position); 
		}
	}
});