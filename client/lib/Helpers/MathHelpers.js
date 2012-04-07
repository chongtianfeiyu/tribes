var MathHelpers = {
	DEG_TO_RAD : 2 * Math.PI / 360,
	/*
		Random number between r1 and r2
	*/
	random : function(r1, r2) {
		return ((Math.random()*(r2 - r1)) + r1);
	}
};