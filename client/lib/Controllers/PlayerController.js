/*
	Controls what objects the user hovers / clicks on
*/
Game.Controllers.PlayerController = (function() {
	return {
		init : function() {
			_.bindAll(this, "mouseMove", "mouseClick");
			this.initCursors();
			MouseInput.addOnMoveEvent(this.mouseMove);
			MouseInput.addOnClickEvent(this.mouseClick);
		},

		initCursors : function() {
			var myCursor = $('<div id="mycursor"></div>');
			myCursor.css('width','97px');
			myCursor.css('height','137px');
			myCursor.css('background','background: url("/img/cursor-hand.png") no-repeat left top');
			myCursor.css('top','0');
			myCursor.css('position', 'absolute');
			myCursor.css('left','0');
			myCursor.css('z-index','10000');
			$('body').prepend(myCursor);
			$(document).mousemove(function(e){
		  		$('body').css('cursor', 'none');
		       	$('#mycursor').css('left', e.clientX).css('top', e.clientY);
		  	});
		},

		setCursor : function(str) {
			switch(str) {
				case "attack":
					$('#mycursor').css('background', 'url(/img/cursor-sword.png) no-repeat left top' );
					break;
				default:
				case "hand":
					$('#mycursor').css('background', 'url(/img/cursor-hand.png) no-repeat left top' );
					break;
			}
		},

		mouseMove : function() {
			var intersect = this.getIntersect();
			if(intersect != null) {
				this.setCursor('attack');
			} else {
				this.setCursor('hand');
			}
		},

		mouseClick : function() {
			var intersect = this.getIntersect();
			if(intersect != null) {
				console.log("Set intersect " + intersect.uid);
				global.app.world.player.targetUid = intersect.uid;
				global.app.world.player.targetIntent = "attack";
				global.app.client.playerSync();
			}
			else {
				this.changePlayerGoalVector();
			}
		},

		changePlayerGoalVector : function() {
			var 
				startVector = new THREE.Vector3(), 
				endVector = new THREE.Vector3(), 
				dirVector = new THREE.Vector3(), 
				goalVector = new THREE.Vector3(), 
				t;
			// Convert screen coordinates to NDC coordinates -1.0 to 1.0
	  		x = ( MouseInput.mouseX / window.innerWidth ) * 2 - 1;
	  		y = - ( MouseInput.mouseY / window.innerHeight ) * 2 + 1;
	  		
	  		// Obtain one vector at click position for each side of the cube mapping
	  		startVector.set( x, y, -1.0 );
	  		endVector.set( x, y, 1.0 );
	  	
	  		// Convert coordinates back to world coordinates
	  		startVector = global.app.projector.unprojectVector( startVector, global.app.camera );
	  		endVector = global.app.projector.unprojectVector( endVector, global.app.camera );
	  	
	  		// Get direction from startVector to endVector
	  		dirVector.sub( endVector, startVector );
	  		dirVector.normalize();
	  	
	  		// Find intersection where y = 0
	  		t = startVector.y / - ( dirVector.y );
	  
	  		// Start walking
	  		goalVector.set( startVector.x + t * dirVector.x,
	  			startVector.y + t * dirVector.y,
	  			startVector.z + t * dirVector.z );

	  		global.app.world.player.targetUid = null;
	  		global.app.world.player.goalVector = goalVector;
			global.app.client.playerSync();
			
		},

		getIntersect : function() {
			 var vector = new THREE.Vector3( 
			 	( MouseInput.mouseX / window.innerWidth ) * 2 - 1, 
			 	- ( MouseInput.mouseY / window.innerHeight ) * 2 + 1, 
			 	0.5 );

            global.app.projector.unprojectVector( vector, global.app.camera );

            var ray = new THREE.Ray( global.app.camera.position, vector.subSelf( global.app.camera.position ).normalize() );
            var intersects = ray.intersectObjects( global.app.world.getIntersectMeshes() );
            for (var i = intersects.length - 1; i >= 0; i--) {
            	var intersect = intersects[i].object.pointer;
            	if(intersect != undefined)
            		return intersect;
            };
            return null;
		}
	}
})