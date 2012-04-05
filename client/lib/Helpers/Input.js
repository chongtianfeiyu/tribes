var Input = {
	
	init : function() {
		Input.initMouseControls();
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
	mouseDownTime : null,

	initMouseControls : function() {
		
		window.onmousemove = (function(e){
			Input.prevMouseX = Input.mouseX;
			Input.prevMouseY = Input.mouseY;
			Input.mouseX = e.pageX;
			Input.mouseY = e.pageY;
			Input.deltaX = Input.mouseX - Input.prevMouseX;
			Input.deltaY = Input.mouseY - Input.prevMouseY;
		});

		window.onmousedown = (function() {
			Input.mouseDown = true;
			Input.mouseDownTime = new Date();
		});

		window.onmouseup = (function() {
			
			if(Input.mouseHoldTime() < 100){
				for (var i = Input.onClickDelegates.length - 1; i >= 0; i--) {
					Input.onClickDelegates[i]();
				};
			} 
			Input.mouseDownTime = null;
			Input.mouseDown = false;
		});


	},

	mouseHoldTime : function() {
		if(Input.mouseDownTime != null)
			return new Date().getTime() - Input.mouseDownTime.getTime();
		return 0;
	},

	mouseHold : function() {
		return Input.mouseHoldTime() > 100;
	},

	addOnClickEvent : function(f){
		Input.onClickDelegates.push(f);
	}
};

Input.init();