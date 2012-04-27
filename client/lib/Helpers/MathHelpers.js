var MathHelpers = {
	DEG_TO_RAD : 2 * Math.PI / 360,
	RAD_TO_DEG : 360 / (Math.PI * 2),
	/*
		Random number between r1 and r2
	*/
	random : function(r1, r2) {
		return ((Math.random()*(r2 - r1)) + r1);
	},

	angleSigned : function(xA, yA, xB, yB, xC, yC) {

		var ac = Math.sqrt(Math.pow(xC-xA,2)+
		    		Math.pow(yC-yA,2)); // len a-c
		var bc = Math.sqrt(Math.pow(xC-xB,2)+
		    		Math.pow(yC-yB,2)); // len b-c
		var ab = Math.sqrt(Math.pow(xB-xA,2)+
		     		Math.pow(yB-yA,2)); // len a-b
		return (Math.acos((bc*bc+ac*ac-ab*ab)/(2*bc*ac)) * MathHelpers.RAD_TO_DEG) * MathHelpers.getSign(xA, yA, xB, yB, xC, yC); 
	},

    getSign : function(xA, yA, xB, yB, xC, yC) {
 
		var x1 = xA - xC;
		var y1 = yA - yC;

		var x2 = xB - xC;
		var y2 = yB - yC;

		var res = Math.atan2(x1*y2 - y1*x2, x1*x2 + y1*y2) * (180 / Math.PI);
		if(res > 0) return 1;
		return -1;

    }


};