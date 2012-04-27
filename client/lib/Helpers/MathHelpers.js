var MathHelpers = {
	DEG_TO_RAD : 2 * Math.PI / 360,
	/*
		Random number between r1 and r2
	*/
	random : function(r1, r2) {
		return ((Math.random()*(r2 - r1)) + r1);
	},

	/**
	 * Calculates the angle (in radians) between two vectors pointing outward from one center
	 *
	 * @param p0 first point
	 * @param p1 second point
	 * @param c center point
	 */
	findAngleBetweenThreePoints : function(xA, yA, xB, yB, xC, yC) {
		
		var ac = Math.sqrt(Math.pow(xC-xA,2)+
		    		Math.pow(yC-yA,2)); // len a-c
		var bc = Math.sqrt(Math.pow(xC-xB,2)+
		    		Math.pow(yC-yB,2)); // len b-c
		var ab = Math.sqrt(Math.pow(xB-xA,2)+
		     		Math.pow(yB-yA,2)); // len a-b
		return Math.acos((bc*bc+ac*ac-ab*ab)/(2*bc*ac)); 
	}
};