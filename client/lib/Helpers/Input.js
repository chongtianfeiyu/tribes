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
		});

		window.onmouseup = (function() {
			Input.mouseDown = false;
		});
	}
};

Input.init();