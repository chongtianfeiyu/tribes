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
		
		var p0c = Math.sqrt(Math.pow(xC-xA,2)+
		    		Math.pow(yC-yA,2)); // p0->c (b)   
		var p1c = Math.sqrt(Math.pow(xC-xB,2)+
		    		Math.pow(yC-yB,2)); // p1->c (a)
		var p0p1 = Math.sqrt(Math.pow(xB-xA,2)+
		     		Math.pow(yB-yA,2)); // p0->p1 (c)
		return Math.acos((p1c*p1c+p0c*p0c-p0p1*p0p1)/(2*p1c*p0c)); 
	}
};