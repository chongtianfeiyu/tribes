var MouseInput = {
	
	init : function() {
		MouseInput.initMouseControls();
	},

	/* 
		SECTION: Mouse Controls
	*/
	mouseX : 0,
	mouseY : 0,
	prevMouseY : 0,
	prevMouseX : 0,
	deltaMouseY : 0,
	deltaMouseX : 0,
	mouseDown : false,
	onClickDelegates : [],
	onMoveDelegates : [],
	mouseDownTime : null,

	initMouseControls : function() {
		
		window.onmousemove = (function(e){
			MouseInput.prevMouseX = MouseInput.mouseX;
			MouseInput.prevMouseY = MouseInput.mouseY;
			MouseInput.mouseX = e.pageX;
			MouseInput.mouseY = e.pageY;
			MouseInput.deltaX = MouseInput.mouseX - MouseInput.prevMouseX;
			MouseInput.deltaY = MouseInput.mouseY - MouseInput.prevMouseY;
			for (var i = MouseInput.onMoveDelegates.length - 1; i >= 0; i--) {
				MouseInput.onMoveDelegates[i]();
			};
		});

		window.onmousedown = (function() {
			MouseInput.mouseDown = true;
			MouseInput.mouseDownTime = new Date();
			
		});

		window.onmouseup = (function() {
			
			if(MouseInput.mouseHoldTime() < 300){
				for (var i = MouseInput.onClickDelegates.length - 1; i >= 0; i--) {
					MouseInput.onClickDelegates[i]();
				};
			} 
			MouseInput.mouseDownTime = null;
			MouseInput.mouseDown = false;
		});


	},

	mouseHoldTime : function() {
		if(MouseInput.mouseDownTime != null)
			return new Date().getTime() - MouseInput.mouseDownTime.getTime();
		return 0;
	},

	mouseHold : function() {
		return MouseInput.mouseHoldTime() > 200;
	},

	addOnClickEvent : function(f){
		MouseInput.onClickDelegates.push(f);
	},

	addOnMoveEvent : function(f) {
		MouseInput.onMoveDelegates.push(f);
	}
};

MouseInput.init();